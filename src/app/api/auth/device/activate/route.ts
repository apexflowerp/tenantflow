import { db } from '@/lib/db'
import { provisionTenantDatabase } from '@/lib/tenant-db'
import { NextRequest, NextResponse } from 'next/server'

// ── Owner Key Registry ──────────────────────────────────────────────────────
// Owner keys grant full platform access and auto-provision a device
const OWNER_KEYS: Record<string, { plan: string; label: string }> = {
  'TFOW-OWNR-180H-XK9Z': { plan: 'enterprise', label: 'TenantFlow Owner Device' },
}

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

    // ── Owner Key Auto-Provisioning ────────────────────────────────────────
    // Owner keys (TFOW-OWNR-*) automatically provision a device + workspace
    if (normalizedKey.startsWith('TFOW-OWNR-') && OWNER_KEYS[normalizedKey]) {
      const ownerConfig = OWNER_KEYS[normalizedKey]

      // Ensure a default workspace exists for the owner
      let workspace = await db.workspace.findFirst({ where: { slug: 'tenantflow-hq' } })
      let client = await db.client.findFirst({ where: { companyName: 'TenantFlow HQ Corp' } })

      if (!client) {
        // Create the default client (multi-tenant owner)
        client = await db.client.create({
          data: {
            companyName: 'TenantFlow HQ Corp',
            contactName: 'Sarah Chen',
            email: 'admin@apexflow.cloud',
            phone: '(212) 555-0100',
            address: '450 Park Avenue',
            city: 'New York',
            state: 'NY',
            zipCode: '10022',
            country: 'US',
            industry: 'Rental Management',
            companySize: '11-50',
            status: 'active',
            plan: ownerConfig.plan,
            billingCycle: 'monthly',
            monthlyFee: 99,
            maxProperties: 999,
            maxUsers: 999,
            maxDevices: 999,
            databaseUrl: process.env.DATABASE_URL,
            databaseName: 'neondb',
            dbStatus: 'active',
          },
        })

        // Trigger tenant DB provisioning
        try {
          await provisionTenantDatabase(client.id, client.companyName)
        } catch (provisionError) {
          console.error('Tenant DB provisioning failed during owner activation:', provisionError)
        }
      }

      if (!workspace) {
        workspace = await db.workspace.create({
          data: {
            name: 'TenantFlow HQ',
            slug: 'tenantflow-hq',
            industry: 'Rental Management',
            currency: 'USD',
            timezone: 'America/New_York',
            plan: ownerConfig.plan,
            clientId: client.id,
          },
        })
      }

      // Create the owner device
      const ownerDevice = await db.device.create({
        data: {
          serialKey: normalizedKey,
          deviceName: ownerConfig.label,
          deviceType: 'desktop',
          status: 'active',
          activatedAt: new Date(),
          lastSeenAt: new Date(),
          workspaceId: workspace.id,
        },
      })

      // Create or link license key for the owner
      const existingLicense = await db.licenseKey.findUnique({ where: { key: normalizedKey } })
      if (!existingLicense) {
        await db.licenseKey.create({
          data: {
            key: normalizedKey,
            type: 'owner',
            plan: ownerConfig.plan,
            maxDevices: 999,
            maxUsers: 999,
            status: 'activated',
            activatedAt: new Date(),
            clientId: client.id,
            deviceId: ownerDevice.id,
          },
        })
      }

      return NextResponse.json({
        id: ownerDevice.id,
        serialKey: ownerDevice.serialKey,
        deviceName: ownerDevice.deviceName,
        status: ownerDevice.status,
        activatedAt: ownerDevice.activatedAt,
        message: 'Owner device activated successfully. Welcome to TenantFlow OS.',
        licensePlan: ownerConfig.plan,
        clientId: client.id,
        isOwner: true,
      })
    }

    // ── License Key Auto-Provisioning (TFOL-*) ─────────────────────────────
    // License keys can be used to auto-create a device
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
