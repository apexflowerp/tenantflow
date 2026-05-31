import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/devices — list all devices with user info
export async function GET() {
  try {
    const devices = await db.device.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        sessions: { where: { isActive: true } },
        licenseKeys: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const stats = {
      total: devices.length,
      active: devices.filter((d) => d.status === 'active').length,
      blocked: devices.filter((d) => d.status === 'blocked').length,
      pending: devices.filter((d) => d.status === 'pending').length,
      deactivated: devices.filter((d) => d.status === 'deactivated').length,
      activeSessions: devices.reduce((sum, d) => sum + d.sessions.length, 0),
    }

    return NextResponse.json({ devices, stats })
  } catch (error) {
    console.error('GET /api/devices error:', error)
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 })
  }
}

// POST /api/devices — register a new device
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { deviceName, deviceType, os, browser, ipAddress, macAddress, userId, workspaceId } = body

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 })
    }

    // Auto-generate serial key
    const serialKey = `TF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const device = await db.device.create({
      data: {
        serialKey,
        deviceName: deviceName || 'Unnamed Device',
        deviceType: deviceType || 'desktop',
        os: os || null,
        browser: browser || null,
        ipAddress: ipAddress || null,
        macAddress: macAddress || null,
        status: 'pending',
        userId: userId || null,
        workspaceId: workspaceId,
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    })

    return NextResponse.json({ device }, { status: 201 })
  } catch (error) {
    console.error('POST /api/devices error:', error)
    return NextResponse.json({ error: 'Failed to register device' }, { status: 500 })
  }
}
