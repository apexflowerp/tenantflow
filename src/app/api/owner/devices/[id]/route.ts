import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/owner/devices/[id] - Update device status (block/unblock/activate)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const validStatuses = ['active', 'disabled', 'blocked', 'pending']
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if device exists
    const device = await db.device.findUnique({
      where: { id },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            clientId: true,
            client: { select: { id: true, companyName: true, plan: true } },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        licenseKeys: {
          select: { id: true, key: true, status: true, plan: true },
        },
      },
    })

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 })
    }

    // If activating, set activatedAt if not already set
    const updateData: any = { status: body.status }
    if (body.status === 'active' && !device.activatedAt) {
      updateData.activatedAt = new Date()
    }

    // Update the device status
    const updated = await db.device.update({
      where: { id },
      data: updateData,
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            clientId: true,
            client: { select: { id: true, companyName: true, plan: true } },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        licenseKeys: {
          select: { id: true, key: true, status: true, plan: true },
        },
      },
    })

    // If blocking or disabling, invalidate all active sessions for this device
    if (body.status === 'blocked' || body.status === 'disabled') {
      await db.session.updateMany({
        where: {
          deviceId: id,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      })
    }

    return NextResponse.json({ device: updated })
  } catch (error: any) {
    console.error('Error updating device:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update device' }, { status: 500 })
  }
}

// GET /api/owner/devices/[id] - Get single device details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const device = await db.device.findUnique({
      where: { id },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            clientId: true,
            client: { select: { id: true, companyName: true, plan: true } },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        licenseKeys: {
          select: { id: true, key: true, status: true, plan: true },
        },
        sessions: {
          where: { isActive: true },
          select: { id: true, ipAddress: true, userAgent: true, createdAt: true },
        },
      },
    })

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 })
    }

    return NextResponse.json({ device })
  } catch (error) {
    console.error('Error fetching device:', error)
    return NextResponse.json({ error: 'Failed to fetch device' }, { status: 500 })
  }
}
