// ═══════════════════════════════════════════════════════════════════════════════
// TenantFlow OS — Tenant Resolver
// ═══════════════════════════════════════════════════════════════════════════════
// Resolves the current tenant (workspace) from an API request.
// Extracts session token from headers, validates it, and returns
// the workspace context needed for tenant-specific database access.
//
// Flow:
// 1. Client sends Authorization header with session token
// 2. Resolver finds the session in Central DB
// 3. Returns { user, workspace, tenantDb } for the request handler
// ═══════════════════════════════════════════════════════════════════════════════

import { db } from './db'
import { getTenantDb, getDefaultTenantDb } from './tenant-db'
import type { PrismaClient as TenantPrismaClient } from '@/generated/tenant'
import { NextRequest } from 'next/server'

export interface TenantContext {
  userId: string
  userName: string
  userEmail: string
  userRole: string
  workspaceId: string
  workspaceName: string
  workspaceSlug: string
  workspacePlan: string
  tenantDb: TenantPrismaClient
}

/**
 * Resolve the tenant context from a Next.js API request.
 * Extracts the session token from the Authorization header,
 * validates it, and returns the full tenant context.
 *
 * @param request - Next.js API request
 * @returns TenantContext with user, workspace, and tenantDb
 * @throws Error if session is invalid or expired
 */
export async function resolveTenant(request: NextRequest): Promise<TenantContext> {
  // Extract session token from Authorization header
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') || request.headers.get('x-session-token')

  if (!token) {
    throw new TenantResolutionError('No session token provided', 401)
  }

  // Find the session in central DB
  const session = await db.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          workspace: true,
        },
      },
    },
  })

  if (!session || !session.isActive) {
    throw new TenantResolutionError('Invalid or expired session', 401)
  }

  // Check session expiry
  if (session.expiresAt < new Date()) {
    // Deactivate expired session
    await db.session.update({
      where: { id: session.id },
      data: { isActive: false },
    })
    throw new TenantResolutionError('Session expired. Please log in again.', 401)
  }

  // Check user is active
  if (!session.user.isActive) {
    throw new TenantResolutionError('Account is deactivated', 403)
  }

  const user = session.user
  const workspace = user.workspace

  if (!workspace) {
    throw new TenantResolutionError('No workspace associated with this user', 403)
  }

  // Get the tenant-specific database
  // Use the default tenant DB singleton when possible to avoid creating
  // new PrismaClient instances which can crash the Next.js Turbopack dev server
  const defaultTenantUrl = process.env.TENANT_DATABASE_URL || ''
  const isDefaultTenant = workspace.connectionString === defaultTenantUrl ||
    (!workspace.connectionString && workspace.slug === 'tenantflow-hq')
  const tenantDb = isDefaultTenant
    ? getDefaultTenantDb()
    : await getTenantDb(workspace.id)

  // Update last seen for session
  await db.session.update({
    where: { id: session.id },
    data: { ipAddress: request.headers.get('x-forwarded-for') ?? session.ipAddress },
  }).catch(() => {}) // Don't fail if update fails

  return {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    workspaceSlug: workspace.slug,
    workspacePlan: workspace.plan,
    tenantDb,
  }
}

/**
 * Resolve tenant from workspaceId directly (for internal/server-side use).
 * Used when you already know the workspace but need the tenant DB.
 */
export async function resolveTenantById(workspaceId: string): Promise<{
  workspaceId: string
  workspaceName: string
  workspaceSlug: string
  tenantDb: TenantPrismaClient
}> {
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  })

  if (!workspace) {
    throw new TenantResolutionError(`Workspace not found: ${workspaceId}`, 404)
  }

  // Use default tenant DB singleton when possible
  const defaultTenantUrl = process.env.TENANT_DATABASE_URL || ''
  const isDefaultTenant = workspace.connectionString === defaultTenantUrl ||
    (!workspace.connectionString && workspace.slug === 'tenantflow-hq')
  const tenantDb = isDefaultTenant
    ? getDefaultTenantDb()
    : await getTenantDb(workspaceId)

  return {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    workspaceSlug: workspace.slug,
    tenantDb,
  }
}

/**
 * Custom error class for tenant resolution failures.
 * Includes an HTTP status code for the API response.
 */
export class TenantResolutionError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.name = 'TenantResolutionError'
    this.statusCode = statusCode
  }
}

/**
 * Helper to handle tenant resolution errors in API routes.
 * Returns an appropriate NextResponse for the error.
 */
export function handleTenantError(error: unknown): { error: string; status: number } {
  if (error instanceof TenantResolutionError) {
    return { error: error.message, status: error.statusCode }
  }
  console.error('Tenant resolution error:', error)
  return { error: 'Internal server error', status: 500 }
}
