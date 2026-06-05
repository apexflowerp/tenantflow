import { db } from '@/lib/db'
import { maskSerialKey } from '@/lib/utils'
import { NextResponse } from 'next/server'

// GET /api/devices/sessions — list all sessions
export async function GET() {
  try {
    const sessions = await db.session.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        device: { select: { id: true, deviceName: true, serialKey: true, deviceType: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Mask serial keys in response
    const maskedSessions = sessions.map((s) => ({
      ...s,
      device: s.device ? { ...s.device, serialKey: maskSerialKey(s.device.serialKey) } : null,
    }))

    const stats = {
      total: sessions.length,
      active: sessions.filter((s) => s.isActive).length,
      expired: sessions.filter((s) => !s.isActive).length,
    }

    return NextResponse.json({ sessions: maskedSessions, stats })
  } catch (error) {
    console.error('GET /api/devices/sessions error:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}

// POST /api/devices/sessions — create a new session
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, deviceId, ipAddress, userAgent } = body

    const token = `ses_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 16)}`
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const session = await db.session.create({
      data: {
        userId,
        deviceId: deviceId || null,
        token,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        isActive: true,
        expiresAt,
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        device: { select: { id: true, deviceName: true, serialKey: true, deviceType: true } },
      },
    })

    // Mask serial key in response
    const maskedSession = {
      ...session,
      device: session.device ? { ...session.device, serialKey: maskSerialKey(session.device.serialKey) } : null,
    }

    // Update device lastSeenAt
    if (deviceId) {
      await db.device.update({
        where: { id: deviceId },
        data: { lastSeenAt: new Date() },
      })
    }

    return NextResponse.json({ session: maskedSession }, { status: 201 })
  } catch (error) {
    console.error('POST /api/devices/sessions error:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

// DELETE /api/devices/sessions — revoke session(s)
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, revokeAll, deviceId } = body

    if (revokeAll) {
      const where: { isActive: boolean; deviceId?: string } = { isActive: true }
      if (deviceId) where.deviceId = deviceId

      const result = await db.session.updateMany({
        where,
        data: { isActive: false },
      })

      return NextResponse.json({ message: `Revoked ${result.count} sessions`, count: result.count })
    }

    if (sessionId) {
      const session = await db.session.update({
        where: { id: sessionId },
        data: { isActive: false },
      })
      return NextResponse.json({ session })
    }

    return NextResponse.json({ error: 'Provide sessionId or revokeAll flag' }, { status: 400 })
  } catch (error) {
    console.error('DELETE /api/devices/sessions error:', error)
    return NextResponse.json({ error: 'Failed to revoke session' }, { status: 500 })
  }
}
