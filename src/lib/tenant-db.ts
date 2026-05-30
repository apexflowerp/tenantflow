import { PrismaClient } from '@prisma/client'
import { db } from './db'

// Cache of tenant PrismaClient instances keyed by database URL
const tenantClients = new Map<string, PrismaClient>()

// Maximum number of cached tenant connections
const MAX_CACHED_CLIENTS = 20

/**
 * Build a tenant database URL from the base URL and database name.
 * Pattern: {baseUrl}/{dbName}?sslmode=require&connection_limit=2
 */
export function buildTenantDbUrl(databaseName: string): string {
  const baseUrl = process.env.TENANT_DB_BASE_URL
  if (!baseUrl) {
    throw new Error('TENANT_DB_BASE_URL environment variable is not set')
  }
  return `${baseUrl}/${databaseName}?sslmode=require&connection_limit=2`
}

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
 */
export async function getTenantDbForClient(clientId: string): Promise<PrismaClient> {
  const client = await db.client.findUnique({
    where: { id: clientId },
    select: { id: true, databaseUrl: true, databaseName: true, dbStatus: true },
  })

  if (!client) {
    throw new Error(`Client not found: ${clientId}`)
  }

  if (client.dbStatus !== 'active' || !client.databaseUrl) {
    throw new Error(`Tenant database not active for client: ${clientId} (status: ${client.dbStatus})`)
  }

  return getTenantDbByUrl(client.databaseUrl)
}

/**
 * Get tenant DB from a session token.
 * Resolves: token → session → user → client → tenant DB
 */
export async function getTenantDbFromToken(token: string): Promise<{ tenantDb: PrismaClient; clientId: string; userId: string }> {
  const session = await db.session.findUnique({
    where: { token },
    include: { user: { select: { id: true, clientId: true } } },
  })

  if (!session || !session.isActive) {
    throw new Error('Invalid or expired session')
  }

  const clientId = (session.user as any).clientId
  if (!clientId) {
    throw new Error('User has no client association')
  }

  const tenantDb = await getTenantDbForClient(clientId)
  return { tenantDb, clientId, userId: session.userId }
}

/**
 * Create a new tenant database and configure the client.
 */
export async function provisionTenantDatabase(clientId: string, slug: string): Promise<{ databaseUrl: string; databaseName: string }> {
  const databaseName = `tf_${slug.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`
  const databaseUrl = buildTenantDbUrl(databaseName)

  // Update client status to provisioning
  await db.client.update({
    where: { id: clientId },
    data: { dbStatus: 'provisioning', databaseName, databaseUrl },
  })

  try {
    // Create the database using raw SQL on the main connection
    await db.$executeRawUnsafe(`CREATE DATABASE "${databaseName}"`)

    // Push schema to the new tenant database
    const tenantClient = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    })

    // Test connection
    await tenantClient.$connect()
    await tenantClient.$disconnect()

    // Update client status to active
    await db.client.update({
      where: { id: clientId },
      data: { dbStatus: 'active' },
    })

    return { databaseUrl, databaseName }
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
