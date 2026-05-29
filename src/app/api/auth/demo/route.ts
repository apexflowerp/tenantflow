import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST() {
  try {
    const demoEmail = 'demo@tenantflow.io'

    // Find or create demo user
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

      // Create demo user
      user = await db.user.create({
        data: {
          email: demoEmail,
          name: 'Demo User',
          role: 'admin',
          department: 'Operations',
          isActive: true,
          lastLogin: new Date(),
          workspaceId: workspace.id,
        },
        include: { workspace: true },
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
          deviceName: 'Demo Device',
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
        userAgent: 'Demo Browser',
        ipAddress: '127.0.0.1',
      },
    })

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Update device last seen
    await db.device.update({
      where: { id: device.id },
      data: { lastSeenAt: new Date() },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
    })
  } catch (error) {
    console.error('Demo login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
