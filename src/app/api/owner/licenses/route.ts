import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

// GET /api/owner/licenses - List all license keys
export async function GET() {
  try {
    const licenseKeys = await db.licenseKey.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, companyName: true, plan: true } },
      },
    })

    return NextResponse.json({ licenseKeys })
  } catch (error) {
    console.error('Error fetching license keys:', error)
    return NextResponse.json({ error: 'Failed to fetch license keys' }, { status: 500 })
  }
}

// POST /api/owner/licenses - Generate a new license key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate a license key in format: TF-XXXX-XXXX-XXXX-XXXX
    const segments = Array.from({ length: 4 }, () =>
      randomUUID().replace(/-/g, '').substring(0, 4).toUpperCase()
    ).join('-')
    const key = `TF-${segments}`

    const licenseKey = await db.licenseKey.create({
      data: {
        key,
        type: body.type || 'standard',
        plan: body.plan || 'starter',
        maxDevices: body.maxDevices || 1,
        maxUsers: body.maxUsers || 5,
        status: 'available',
        clientId: body.clientId,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
      include: {
        client: { select: { id: true, companyName: true, plan: true } },
      },
    })

    return NextResponse.json({ licenseKey }, { status: 201 })
  } catch (error: any) {
    console.error('Error generating license key:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'License key collision, please try again' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to generate license key' }, { status: 500 })
  }
}
