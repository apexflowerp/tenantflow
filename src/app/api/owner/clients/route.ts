import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/owner/clients - List all clients with stats
export async function GET() {
  try {
    const clients = await db.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        workspaces: { select: { id: true, name: true, slug: true } },
        licenseKeys: { select: { id: true, status: true } },
        _count: { select: { invoices: true } },
      },
    })

    return NextResponse.json({ clients })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

// POST /api/owner/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const client = await db.client.create({
      data: {
        companyName: body.companyName,
        contactName: body.contactName,
        email: body.email,
        phone: body.phone || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        zipCode: body.zipCode || null,
        country: body.country || 'US',
        website: body.website || null,
        industry: body.industry || null,
        companySize: body.companySize || null,
        taxId: body.taxId || null,
        status: body.status || 'trial',
        plan: body.plan || 'starter',
        billingCycle: body.billingCycle || 'monthly',
        monthlyFee: body.monthlyFee || 0,
        setupFee: body.setupFee || 0,
        currency: body.currency || 'USD',
        discountPercent: body.discountPercent || 0,
        trialStart: body.trialStart ? new Date(body.trialStart) : null,
        trialEnd: body.trialEnd ? new Date(body.trialEnd) : null,
        contractStart: body.contractStart ? new Date(body.contractStart) : null,
        contractEnd: body.contractEnd ? new Date(body.contractEnd) : null,
        notes: body.notes || null,
        primaryColor: body.primaryColor || null,
        customDomain: body.customDomain || null,
        maxProperties: body.maxProperties || 10,
        maxUsers: body.maxUsers || 5,
        maxDevices: body.maxDevices || 3,
        features: body.features || null,
      },
    })

    return NextResponse.json({ client }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating client:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A client with this email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}
