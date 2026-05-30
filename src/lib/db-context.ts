import { NextRequest } from 'next/server'
import { db } from './db'
import { getTenantDbForClient, getTenantDbFromToken } from './tenant-db'
import { PrismaClient } from '@prisma/client'

/**
 * Get the appropriate database client for a request.
 * If clientId is provided (via query param), returns the tenant DB.
 * Otherwise returns the main DB.
 */
export async function getDbForRequest(request: NextRequest): Promise<{
  db: PrismaClient
  clientId: string | null
  isTenant: boolean
}> {
  // Try to get clientId from query params
  const clientId = request.nextUrl.searchParams.get('clientId')

  if (!clientId) {
    return { db, clientId: null, isTenant: false }
  }

  try {
    const tenantDb = await getTenantDbForClient(clientId)
    return { db: tenantDb, clientId, isTenant: true }
  } catch (error) {
    console.error('Failed to resolve tenant DB, falling back to main:', error)
    return { db, clientId, isTenant: false }
  }
}

/**
 * Get tenant DB from an authorization token.
 * Use this for authenticated API routes.
 */
export async function getAuthenticatedDb(request: NextRequest): Promise<{
  db: PrismaClient
  clientId: string
  userId: string
}> {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    throw new Error('Authorization required')
  }

  const { tenantDb, clientId, userId } = await getTenantDbFromToken(token)
  return { db: tenantDb, clientId, userId }
}
