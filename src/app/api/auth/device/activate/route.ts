import { db } from '@/lib/db'
import { provisionTenantDatabase } from '@/lib/tenant-db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serialKey } = body

    if (!serialKey) {
      return NextResponse.json(
        { error: 'Serial key is required' },
        { status: 400 }
      )
    }

    // Normalize the serial key (uppercase, trim)
    const normalizedKey = serialKey.trim().toUpperCase()

    // Check if device exists with this serial key
    const existingDevice = await db.device.findUnique({
      where: { serialKey: normalizedKey },
    })

    if (existingDevice) {
      // Device found - check status
      if (existingDevice.status === 'blocked') {
        return NextResponse.json(
          { error: 'This device has been blocked. Please contact support.', status: 'blocked' },
          { status: 403 }
        )
      }

      if (existingDevice.status === 'deactivated') {
        return NextResponse.json(
          { error: 'This device has been deactivated. Please contact support.', status: 'deactivated' },
          { status: 403 }
        )
      }

      if (existingDevice.status === 'active') {
        // Already activated - update last seen and return
        await db.device.update({
          where: { id: existingDevice.id },
          data: { lastSeenAt: new Date() },
        })

        return NextResponse.json({
          id: existingDevice.id,
          serialKey: existingDevice.serialKey,
          deviceName: existingDevice.deviceName,
          status: existingDevice.status,
          activatedAt: existingDevice.activatedAt,
          message: 'Device is already activated',
        })
      }

      // Status is 'pending' - activate it
      const updated = await db.device.update({
        where: { id: existingDevice.id },
        data: {
          status: 'active',
          activatedAt: new Date(),
          lastSeenAt: new Date(),
          deviceName: existingDevice.deviceName ?? 'Desktop Device',
        },
      })

      return NextResponse.json({
        id: updated.id,
        serialKey: updated.serialKey,
        deviceName: updated.deviceName,
        status: updated.status,
        activatedAt: updated.activatedAt,
        message: 'Device activated successfully',
      })
    }

    // Device not found - check if it's a valid license key format
    // License keys (TFOL-*) can be used to auto-create a device
    if (normalizedKey.startsWith('TFOL-')) {
      const licenseKey = await db.licenseKey.findUnique({
        where: { key: normalizedKey },
        include: { client: { include: { workspaces: true } } },
      })

      if (!licenseKey) {
        return NextResponse.json(
          { error: 'Invalid license key. Please check and try again.' },
          { status: 404 }
        )
      }

      if (licenseKey.status === 'used' || licenseKey.status === 'expired') {
        return NextResponse.json(
          { error: `This license key has been ${licenseKey.status}. Please contact support.` },
          { status: 403 }
        )
      }

      // Get workspace from the license key's client
      const workspace = licenseKey.client.workspaces[0]
      if (!workspace) {
        return NextResponse.json(
          { error: 'No workspace associated with this license key.' },
          { status: 500 }
        )
      }

      // Auto-create device with this license key
      const newDevice = await db.device.create({
        data: {
          serialKey: `TFOW-AUTO-${randomSuffix()}`,
          deviceName: `Licensed Device (${licenseKey.plan})`,
          deviceType: 'desktop',
          status: 'active',
          activatedAt: new Date(),
          lastSeenAt: new Date(),
          workspaceId: workspace.id,
        },
      })

      // Mark license key as used
      await db.licenseKey.update({
        where: { id: licenseKey.id },
        data: {
          status: 'used',
          activatedAt: new Date(),
          deviceId: newDevice.id,
        },
      })

      // Trigger tenant DB provisioning if the client doesn't have an active DB yet
      let provisioningStatus: string | null = null
      try {
        if (licenseKey.client.dbStatus !== 'active') {
          await provisionTenantDatabase(licenseKey.client.id, licenseKey.client.companyName)
          provisioningStatus = 'provisioned'
        } else {
          provisioningStatus = 'already_active'
        }
      } catch (provisionError) {
        console.error('Tenant DB provisioning failed during device activation:', provisionError)
        provisioningStatus = 'provisioning_failed'
      }

      return NextResponse.json({
        id: newDevice.id,
        serialKey: newDevice.serialKey,
        deviceName: newDevice.deviceName,
        status: newDevice.status,
        activatedAt: newDevice.activatedAt,
        message: 'License key activated successfully. Device has been created.',
        licensePlan: licenseKey.plan,
        clientId: licenseKey.client.id,
        tenantProvisioning: provisioningStatus,
      })
    }

    // Check TFOW- format keys that don't exist yet
    if (normalizedKey.startsWith('TFOW-')) {
      return NextResponse.json(
        { error: 'Serial key not found. Please verify your key or contact support.' },
        { status: 404 }
      )
    }

    // Unknown key format
    return NextResponse.json(
      { error: 'Invalid serial key format. Keys should start with TFOW- or TFOL-.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Device activation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during activation.' },
      { status: 500 }
    )
  }
}

function randomSuffix(): string {
  const chars = '0123456789ABCDEF'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}
