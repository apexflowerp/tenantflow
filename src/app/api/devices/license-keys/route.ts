import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/devices/license-keys — list all license keys
export async function GET() {
  try {
    const licenseKeys = await db.licenseKey.findMany({
      include: {
        client: { select: { id: true, companyName: true, contactName: true, email: true } },
        device: { select: { id: true, deviceName: true, serialKey: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const stats = {
      total: licenseKeys.length,
      available: licenseKeys.filter((k) => k.status === 'available').length,
      activated: licenseKeys.filter((k) => k.status === 'activated').length,
      expired: licenseKeys.filter((k) => k.status === 'expired').length,
      revoked: licenseKeys.filter((k) => k.status === 'revoked').length,
    }

    return NextResponse.json({ licenseKeys, stats })
  } catch (error) {
    console.error('GET /api/devices/license-keys error:', error)
    return NextResponse.json({ error: 'Failed to fetch license keys' }, { status: 500 })
  }
}

// POST /api/devices/license-keys — generate a new license key
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, plan, maxDevices, maxUsers, expiresAt, clientId } = body

    // Generate key: XXXX-XXXX-XXXX-XXXX format
    const segments = Array.from({ length: 4 }, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase()
    )
    const key = segments.join('-')

    // Find or create a default client if not provided
    let clientIdToUse = clientId
    if (!clientIdToUse) {
      const defaultClient = await db.client.findFirst()
      if (defaultClient) {
        clientIdToUse = defaultClient.id
      } else {
        // Create a default client
        const newClient = await db.client.create({
          data: {
            companyName: 'Default Client',
            contactName: 'System',
            email: `system-${Date.now()}@apexflow.cloud`,
          },
        })
        clientIdToUse = newClient.id
      }
    }

    const licenseKey = await db.licenseKey.create({
      data: {
        key,
        type: type || 'standard',
        plan: plan || 'starter',
        maxDevices: maxDevices || 1,
        maxUsers: maxUsers || 5,
        status: 'available',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        clientId: clientIdToUse,
      },
      include: {
        client: { select: { id: true, companyName: true, contactName: true, email: true } },
        device: { select: { id: true, deviceName: true, serialKey: true } },
      },
    })

    return NextResponse.json({ licenseKey }, { status: 201 })
  } catch (error) {
    console.error('POST /api/devices/license-keys error:', error)
    return NextResponse.json({ error: 'Failed to generate license key' }, { status: 500 })
  }
}
