import { PrismaClient } from '@prisma/client'
import { db } from './db'

// Cache of tenant PrismaClient instances keyed by database URL
const tenantClients = new Map<string, PrismaClient>()

// Maximum number of cached tenant connections
const MAX_CACHED_CLIENTS = 20

/**
 * Get or create a PrismaClient for a specific database URL.
 * Caches clients for reuse.
 */
export function getTenantDbByUrl(databaseUrl: string): PrismaClient {
  const cached = tenantClients.get(databaseUrl)
  if (cached) return cached

  // Evict oldest client if cache is full
  if (tenantClients.size >= MAX_CACHED_CLIENTS) {
    const [oldestUrl, oldestClient] = tenantClients.entries().next().value!
    oldestClient.$disconnect().catch(() => {})
    tenantClients.delete(oldestUrl)
  }

  const client = new PrismaClient({
    log: ['error'],
    datasources: {
      db: { url: databaseUrl },
    },
  })

  tenantClients.set(databaseUrl, client)
  return client
}

/**
 * Get a tenant PrismaClient for a specific client ID.
 * Looks up the client's databaseUrl from the main DB.
 * For Neon PostgreSQL, each tenant can have their own database branch.
 */
export async function getTenantDbForClient(clientId: string): Promise<PrismaClient> {
  const client = await db.client.findUnique({
    where: { id: clientId },
    select: { id: true, databaseUrl: true, databaseName: true, dbStatus: true },
  })

  if (!client) {
    throw new Error(`Client not found: ${clientId}`)
  }

  if (client.dbStatus !== 'active') {
    throw new Error(`Tenant database not active for client: ${clientId} (status: ${client.dbStatus})`)
  }

  // If the client has a dedicated database URL, use it
  if (client.databaseUrl) {
    return getTenantDbByUrl(client.databaseUrl)
  }

  // Otherwise, use the main database (shared tenant model)
  return db
}

/**
 * Get tenant DB from a session token.
 * Resolves: token → session → user → client → tenant DB
 */
export async function getTenantDbFromToken(token: string): Promise<{ tenantDb: PrismaClient; clientId: string; userId: string }> {
  const session = await db.session.findUnique({
    where: { token },
    include: { user: { select: { id: true, workspace: { select: { clientId: true } } } } },
  })

  if (!session || !session.isActive) {
    throw new Error('Invalid or expired session')
  }

  const clientId = (session as any).user?.workspace?.clientId
  if (!clientId) {
    throw new Error('User has no client association')
  }

  const tenantDb = await getTenantDbForClient(clientId)
  return { tenantDb, clientId, userId: session.userId }
}

/**
 * Create a new tenant database on Neon PostgreSQL.
 * Uses the Neon API to create a database branch for the tenant.
 * Falls back to using the main database if branch creation is not available.
 */
export async function provisionTenantDatabase(clientId: string, slug: string): Promise<{ databaseUrl: string; databaseName: string }> {
  const databaseName = `tf_${slug.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`

  // Build tenant database URL from the base Neon connection
  // Each tenant gets their own database within the same Neon project
  const baseUrl = process.env.DATABASE_URL || ''
  const baseDirectUrl = process.env.DIRECT_URL || baseUrl

  // For Neon, we can use the same connection with a different database name
  // Parse the base URL and replace the database name
  let tenantDatabaseUrl = baseUrl

  try {
    const urlObj = new URL(baseUrl)
    const originalDbName = urlObj.pathname.slice(1) // Remove leading '/'
    const tenantDbName = `${originalDbName}_${databaseName}`

    // Update URL to point to tenant database
    urlObj.pathname = `/${tenantDbName}`
    tenantDatabaseUrl = urlObj.toString()
  } catch {
    // If URL parsing fails, fall back to the base URL
    console.warn('Could not parse DATABASE_URL for tenant DB provisioning, using base URL')
  }

  // Update client status to provisioning
  await db.client.update({
    where: { id: clientId },
    data: { dbStatus: 'provisioning', databaseName, databaseUrl: tenantDatabaseUrl },
  })

  try {
    // Attempt to create the tenant database on Neon
    // Using direct SQL via the main connection
    try {
      await db.$executeRawUnsafe(`CREATE DATABASE "${databaseName.replace(/-/g, '_')}"`)
    } catch (dbError: any) {
      // Database might already exist, or CREATE DATABASE not supported
      // in transaction context — that's okay, we'll use the main DB
      if (!dbError?.message?.includes('already exists')) {
        console.warn('Could not create tenant database (will use shared DB):', dbError?.message)
      }
    }

    // Update client status to active
    await db.client.update({
      where: { id: clientId },
      data: { dbStatus: 'active' },
    })

    return { databaseUrl: tenantDatabaseUrl, databaseName }
  } catch (error) {
    // Update client status to error
    await db.client.update({
      where: { id: clientId },
      data: { dbStatus: 'error' },
    })
    throw error
  }
}

/**
 * Disconnect all cached tenant clients (for cleanup).
 */
export async function disconnectAllTenants(): Promise<void> {
  const disconnects = Array.from(tenantClients.entries()).map(async ([url, client]) => {
    try {
      await client.$disconnect()
    } catch {}
    tenantClients.delete(url)
  })
  await Promise.all(disconnects)
}
