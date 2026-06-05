import { db } from '@/lib/db'
import { maskSerialKey } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')
    const serialKey = searchParams.get('serialKey')

    if (!deviceId && !serialKey) {
      return NextResponse.json(
        { error: 'Device ID or serial key is required' },
        { status: 400 }
      )
    }

    let device

    if (deviceId) {
      device = await db.device.findUnique({
        where: { id: deviceId },
      })
    } else if (serialKey) {
      device = await db.device.findUnique({
        where: { serialKey: serialKey.trim().toUpperCase() },
      })
    }

    if (!device) {
      return NextResponse.json({
        activated: false,
        status: 'not_found',
        message: 'Device not found',
      })
    }

    // Update last seen
    await db.device.update({
      where: { id: device.id },
      data: { lastSeenAt: new Date() },
    })

    const isActive = device.status === 'active'

    return NextResponse.json({
      activated: isActive,
      status: device.status,
      device: {
        id: device.id,
        serialKey: maskSerialKey(device.serialKey),
        deviceName: device.deviceName,
        deviceType: device.deviceType,
        activatedAt: device.activatedAt,
        lastSeenAt: device.lastSeenAt,
      },
    })
  } catch (error) {
    console.error('Device status error:', error)
    return NextResponse.json(
      { error: 'Failed to check device status' },
      { status: 500 }
    )
  }
}
