import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST() {
  try {
    const demoEmail = 'demo@tenantflow.io'

    // Ensure a default client exists for demo purposes
    let defaultClient = await db.client.findFirst({
      where: { email: 'demo@tenantflow.io' },
    })

    if (!defaultClient) {
      // Create a demo client with active DB status (uses main DB for demo)
      defaultClient = await db.client.create({
        data: {
          companyName: 'TenantFlow Demo',
          contactName: 'Demo User',
          email: 'demo@tenantflow.io',
          status: 'active',
          plan: 'starter',
          dbStatus: 'active',
          databaseUrl: process.env.DATABASE_URL || '',
          databaseName: 'demo',
        },
      })
    } else if (defaultClient.dbStatus !== 'active') {
      // Ensure the demo client has an active DB status
      defaultClient = await db.client.update({
        where: { id: defaultClient.id },
        data: {
          dbStatus: 'active',
          databaseUrl: defaultClient.databaseUrl || process.env.DATABASE_URL,
          databaseName: defaultClient.databaseName || 'demo',
        },
      })
    }

    // Find or create demo user with viewer role (view-only)
    let user = await db.user.findUnique({
      where: { email: demoEmail },
      include: { workspace: { select: { id: true, name: true, slug: true, plan: true, clientId: true } } },
    })

    if (!user) {
      // Get the first workspace that belongs to the demo client, or any workspace
      let workspace = await db.workspace.findFirst({
        where: { clientId: defaultClient.id },
      })

      if (!workspace) {
        // Get any workspace or create one tied to the demo client
        workspace = await db.workspace.findFirst()
        if (workspace) {
          // Link workspace to demo client
          workspace = await db.workspace.update({
            where: { id: workspace.id },
            data: { clientId: defaultClient.id },
          })
        } else {
          // Create a workspace tied to the demo client
          workspace = await db.workspace.create({
            data: {
              name: 'Demo Workspace',
              slug: 'demo-workspace',
              plan: 'starter',
              clientId: defaultClient.id,
            },
          })
        }
      }

      // Create demo user with viewer role — view-only access
      user = await db.user.create({
        data: {
          email: demoEmail,
          name: 'Demo Viewer',
          role: 'viewer',
          department: 'Demo',
          isActive: true,
          lastLogin: new Date(),
          workspaceId: workspace.id,
        },
        include: { workspace: { select: { id: true, name: true, slug: true, plan: true, clientId: true } } },
      })
    } else if (user.role !== 'viewer') {
      // Ensure existing demo user has viewer role
      user = await db.user.update({
        where: { id: user.id },
        data: {
          role: 'viewer',
          name: 'Demo Viewer',
          lastLogin: new Date(),
          // Ensure workspace is linked to demo client
          workspace: user.workspace.clientId
            ? undefined
            : { update: { clientId: defaultClient.id } },
        },
        include: { workspace: { select: { id: true, name: true, slug: true, plan: true, clientId: true } } },
      })
    } else {
      // Update last login
      user = await db.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          // Ensure workspace is linked to demo client
          workspace: user.workspace.clientId
            ? undefined
            : { update: { clientId: defaultClient.id } },
        },
        include: { workspace: { select: { id: true, name: true, slug: true, plan: true, clientId: true } } },
      })
    }

    // Find or create a demo device
    let device = await db.device.findFirst({
      where: { serialKey: 'TFOW-2024-DEMO-0000' },
    })

    if (!device) {
      device = await db.device.create({
        data: {
          serialKey: 'TFOW-2024-DEMO-0000',
          deviceName: 'Demo Device (View Only)',
          deviceType: 'desktop',
          os: 'Demo OS',
          browser: 'Demo Browser',
          status: 'active',
          activatedAt: new Date(),
          lastSeenAt: new Date(),
          workspaceId: user.workspaceId,
          userId: user.id,
        },
      })
    } else {
      // Update last seen
      device = await db.device.update({
        where: { id: device.id },
        data: { lastSeenAt: new Date() },
      })
    }

    // Generate session token
    const token = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 1) // 1 day expiry for demo

    // Create session
    const session = await db.session.create({
      data: {
        userId: user.id,
        deviceId: device.id,
        token,
        isActive: true,
        expiresAt,
        userAgent: 'Demo Browser (View Only)',
        ipAddress: '127.0.0.1',
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'viewer',
        workspaceId: user.workspaceId,
        clientId: user.workspace.clientId, // from workspace.clientId
        workspace: {
          id: user.workspace.id,
          name: user.workspace.name,
          slug: user.workspace.slug,
          plan: user.workspace.plan,
          clientId: user.workspace.clientId,
        },
      },
      device: {
        id: device.id,
        serialKey: device.serialKey,
        deviceName: device.deviceName,
        status: device.status,
      },
      token: session.token,
      expiresAt: session.expiresAt,
      isViewOnly: true,
    })
  } catch (error) {
    console.error('Demo login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
