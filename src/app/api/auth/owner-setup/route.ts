import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/utils'

/**
 * Parse user-agent to detect browser, OS, and device type.
 */
function parseUserAgent(ua: string) {
  let os = 'Unknown OS'
  let browser = 'Unknown Browser'
  let deviceType = 'desktop'

  // Detect OS
  if (/Windows NT/i.test(ua)) os = 'Windows'
  else if (/Mac OS X/i.test(ua)) os = 'macOS'
  else if (/Linux/i.test(ua)) os = 'Linux'
  else if (/Android/i.test(ua)) { os = 'Android'; deviceType = 'mobile' }
  else if (/iPhone|iPad/i.test(ua)) { os = 'iOS'; deviceType = ua.includes('iPad') ? 'tablet' : 'mobile' }

  // Detect browser
  if (/Edg\//i.test(ua)) browser = 'Microsoft Edge'
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Google Chrome'
  else if (/Firefox/i.test(ua)) browser = 'Firefox'
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari'

  return { os, browser, deviceType }
}

/**
 * POST /api/auth/owner-setup
 *
 * Creates/ensures an owner admin account (admin@apexflow.cloud)
 * and registers the user's PC/browser as an owner device with a
 * dedicated owner serial key (TFOW-OWNR-180H-XK9Z).
 * Returns session data with device info.
 */
export async function POST(request: NextRequest) {
  try {
    const ownerEmail = 'admin@apexflow.cloud'
    const ownerName = 'Owner Admin'
    const ownerPassword = 'Admin@180H'
    const ownerSerialKey = 'TFOW-OWNR-180H-XK9Z'
    const userAgent = request.headers.get('user-agent') ?? 'Unknown'
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor?.split(',')[0]?.trim() ?? '127.0.0.1'
    const { os, browser, deviceType } = parseUserAgent(userAgent)

    // Find or create workspace for the owner
    let workspace = await db.workspace.findFirst({
      where: { slug: 'apexflow-hq' },
    })

    if (!workspace) {
      workspace = await db.workspace.create({
        data: {
          name: 'ApexFlow HQ',
          slug: 'apexflow-hq',
          plan: 'enterprise',
        },
      })
    }

    // Find or create the owner admin user
    let user = await db.user.findUnique({
      where: { email: ownerEmail },
      include: { workspace: true },
    })

    if (!user) {
      user = await db.user.create({
        data: {
          email: ownerEmail,
          name: ownerName,
          role: 'owner',
          department: 'Administration',
          isActive: true,
          lastLogin: new Date(),
          passwordHash: ownerPassword,
          workspaceId: workspace.id,
        },
        include: { workspace: true },
      })
    } else {
      // Update the owner account: ensure active, correct role, and latest password
      user = await db.user.update({
        where: { id: user.id },
        data: {
          isActive: true,
          role: 'owner',
          lastLogin: new Date(),
          passwordHash: ownerPassword,
        },
        include: { workspace: true },
      })
    }

    // Create or find the owner device with the dedicated serial key
    let device = await db.device.findUnique({
      where: { serialKey: ownerSerialKey },
    })

    if (!device) {
      device = await db.device.create({
        data: {
          serialKey: ownerSerialKey,
          deviceName: `Owner PC (${browser} on ${os})`,
          deviceType,
          os,
          browser,
          status: 'active',
          activatedAt: new Date(),
          lastSeenAt: new Date(),
          workspaceId: user.workspaceId,
          userId: user.id,
          ipAddress,
        },
      })
    } else {
      // Update device info
      device = await db.device.update({
        where: { id: device.id },
        data: {
          lastSeenAt: new Date(),
          ipAddress,
          os,
          browser,
          deviceName: `Owner PC (${browser} on ${os})`,
          status: 'active',
          userId: user.id,
        },
      })
    }

    // Generate session token
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 day expiry for owner

    // Create session
    const session = await db.session.create({
      data: {
        userId: user.id,
        deviceId: device.id,
        token,
        isActive: true,
        expiresAt,
        userAgent,
        ipAddress,
      },
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
    console.error('Owner setup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during owner setup. Please try again.' },
      { status: 500 }
    )
  }
}
