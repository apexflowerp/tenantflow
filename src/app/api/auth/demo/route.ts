import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST() {
  try {
    const demoEmail = 'demo@tenantflow.io'

    // Find or create demo user with viewer role (view-only)
    let user = await db.user.findUnique({
      where: { email: demoEmail },
      include: { workspace: true },
    })

    if (!user) {
      // Get the first workspace
      const workspace = await db.workspace.findFirst()
      if (!workspace) {
        return NextResponse.json(
          { error: 'No workspace found. Please seed the database first.' },
          { status: 500 }
        )
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
        include: { workspace: true },
      })
    } else if (user.role !== 'viewer') {
      // Ensure existing demo user has viewer role
      user = await db.user.update({
        where: { id: user.id },
        data: { role: 'viewer', name: 'Demo Viewer', lastLogin: new Date() },
        include: { workspace: true },
      })
    } else {
      // Update last login
      user = await db.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
        include: { workspace: true },
      })
    }

    // Find or create a demo device
    let device = await db.device.findFirst({
      where: { serialKey: 'TFOW-2024-DEMO-0000' },
    })

    if (!device) {
      const workspace = await db.workspace.findFirst()
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
          workspaceId: workspace?.id ?? user.workspaceId,
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
        workspace: {
          id: user.workspace.id,
          name: user.workspace.name,
          slug: user.workspace.slug,
          plan: user.workspace.plan,
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
