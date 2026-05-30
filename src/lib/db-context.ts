import { NextRequest } from 'next/server'
import { db } from './db'
import { PrismaClient } from '@prisma/client'

/**
 * Get the appropriate database client for a request.
 * 
 * For now, all API routes use the main database directly.
 * The multi-tenant architecture (separate DB per client) is available
 * but currently uses the shared main DB for stability.
 * 
 * To enable per-tenant databases:
 * 1. Set up tenant databases with the provision API
 * 2. Import getTenantDbForClient from tenant-db
 * 3. Route to tenant DBs based on clientId
 */
export async function getDbForRequest(request: NextRequest): Promise<{
  db: PrismaClient
  clientId: string | null
  isTenant: boolean
}> {
  const clientId = request.nextUrl.searchParams.get('clientId')

  if (!clientId) {
    return { db, clientId: null, isTenant: false }
  }

  // Use main DB for all requests (single connection pool = stable)
  return { db, clientId, isTenant: true }
}

/**
 * Get tenant DB from an authorization token.
 * Currently returns the main DB for all requests.
 */
export async function getAuthenticatedDb(request: NextRequest): Promise<{
  db: PrismaClient
  clientId: string
  userId: string
}> {
  // For now, use main DB for all authenticated requests
  // In production, this would resolve the tenant DB from the token
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    throw new Error('Authorization required')
  }

  // Look up the session to get clientId and userId
  const session = await db.session.findUnique({
    where: { token },
    include: { user: { select: { id: true, name: true } } },
  })

  if (!session || !session.isActive) {
    throw new Error('Invalid or expired session')
  }

  // Get the client ID from the user's workspace
  const workspace = await db.workspace.findFirst({
    where: { users: { some: { id: session.userId } } },
    select: { clientId: true },
  })

  const clientId = workspace?.clientId || ''

  return { db, clientId, userId: session.userId }
}
