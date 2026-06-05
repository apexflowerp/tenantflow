import { db } from '@/lib/db'
import { maskSerialKey } from '@/lib/utils'
import { NextResponse } from 'next/server'

function generateToken(): string {
  return 'tf-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST() {
  try {
    const demoEmail = 'demo@tenantflow.io'

    // Find the demo client (created by seed)
    let defaultClient = await db.client.findFirst({
      where: { email: 'demo@tenantflow.io' },
    })

    if (!defaultClient) {
      defaultClient = await db.client.create({
        data: {
          companyName: 'TenantFlow Demo',
          contactName: 'Demo User',
          email: 'demo@tenantflow.io',
          status: 'active',
          plan: 'starter',
          dbStatus: 'active',
          databaseName: 'demo',
        },
      })
    }

    // Find or create demo user with viewer role (view-only)
    let user = await db.user.findUnique({
      where: { email: demoEmail },
      include: { workspace: { select: { id: true, name: true, slug: true, plan: true, clientId: true } } },
    })

    if (!user) {
      let workspace = await db.workspace.findFirst({
        where: { clientId: defaultClient.id },
      })

      if (!workspace) {
        workspace = await db.workspace.findFirst()
      }

      if (!workspace) {
        workspace = await db.workspace.create({
          data: {
            name: 'Demo Workspace',
            slug: 'demo-workspace',
            plan: 'starter',
            clientId: defaultClient.id,
          },
        })
      }

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
    } else {
      user = await db.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
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
          status: 'active',
          activatedAt: new Date(),
          lastSeenAt: new Date(),
          workspaceId: user.workspaceId,
          userId: user.id,
        },
      })
    }

    // Generate session token
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 1)

    const session = await db.session.create({
      data: {
        userId: user.id,
        deviceId: device.id,
        token,
        isActive: true,
        expiresAt,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'viewer',
        workspaceId: user.workspaceId,
        clientId: user.workspace.clientId,
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
        serialKey: maskSerialKey(device.serialKey),
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
