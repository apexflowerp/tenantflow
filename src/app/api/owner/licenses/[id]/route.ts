import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/owner/licenses/[id] - Update license key (revoke, expire, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: any = {}

    if (body.status) {
      updateData.status = body.status
    }

    // When revoking, also update linked device status if requested
    if (body.status === 'revoked') {
      const license = await db.licenseKey.findUnique({
        where: { id },
        include: { device: true },
      })

      if (!license) {
        return NextResponse.json({ error: 'License key not found' }, { status: 404 })
      }

      // Update the license key status
      const updated = await db.licenseKey.update({
        where: { id },
        data: { status: 'revoked' },
        include: {
          client: { select: { id: true, companyName: true } },
          device: { select: { id: true, deviceName: true, serialKey: true } },
        },
      })

      // Optionally update linked device status
      if (license.deviceId && body.revokeDevice !== false) {
        await db.device.update({
          where: { id: license.deviceId },
          data: { status: 'disabled' },
        })
      }

      return NextResponse.json({ licenseKey: updated })
    }

    // Generic status update
    const updated = await db.licenseKey.update({
      where: { id },
      data: updateData,
      include: {
        client: { select: { id: true, companyName: true } },
        device: { select: { id: true, deviceName: true, serialKey: true } },
      },
    })

    return NextResponse.json({ licenseKey: updated })
  } catch (error: any) {
    console.error('Error updating license key:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'License key not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update license key' }, { status: 500 })
  }
}

// GET /api/owner/licenses/[id] - Get single license key details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const licenseKey = await db.licenseKey.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, companyName: true, plan: true } },
        device: { select: { id: true, deviceName: true, serialKey: true, status: true } },
      },
    })

    if (!licenseKey) {
      return NextResponse.json({ error: 'License key not found' }, { status: 404 })
    }

    return NextResponse.json({ licenseKey })
  } catch (error) {
    console.error('Error fetching license key:', error)
    return NextResponse.json({ error: 'Failed to fetch license key' }, { status: 500 })
  }
}
