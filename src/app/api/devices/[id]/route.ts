import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// PATCH /api/devices/[id] — update device (block, unblock, deactivate, activate)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, deviceName, deviceType, os, browser, ipAddress } = body

    const existing = await db.device.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (status !== undefined) {
      updateData.status = status
      if (status === 'active' && !existing.activatedAt) {
        updateData.activatedAt = new Date()
      }
    }
    if (deviceName !== undefined) updateData.deviceName = deviceName
    if (deviceType !== undefined) updateData.deviceType = deviceType
    if (os !== undefined) updateData.os = os
    if (browser !== undefined) updateData.browser = browser
    if (ipAddress !== undefined) updateData.ipAddress = ipAddress

    // Update lastSeenAt on any status change
    updateData.lastSeenAt = new Date()

    const device = await db.device.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        sessions: true,
        licenseKeys: true,
      },
    })

    // If blocking, deactivate all active sessions
    if (status === 'blocked') {
      await db.session.updateMany({
        where: { deviceId: id, isActive: true },
        data: { isActive: false },
      })
    }

    return NextResponse.json({ device })
  } catch (error) {
    console.error('PATCH /api/devices/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update device' }, { status: 500 })
  }
}

// DELETE /api/devices/[id] — delete device
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.device.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 })
    }

    // Delete related sessions first
    await db.session.deleteMany({ where: { deviceId: id } })
    // Unlink license keys
    await db.licenseKey.updateMany({
      where: { deviceId: id },
      data: { deviceId: null },
    })

    await db.device.delete({ where: { id } })

    return NextResponse.json({ message: 'Device deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/devices/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete device' }, { status: 500 })
  }
}
