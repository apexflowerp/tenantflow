import { getDbForRequest } from '@/lib/db-context'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { db: tenantDb } = await getDbForRequest(request)

    const workspace = await tenantDb.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const leases = await tenantDb.lease.findMany({
      where: { workspaceId: workspace.id },
      include: {
        property: { select: { id: true, name: true, address: true, city: true, type: true } },
        unit: { select: { id: true, unitNumber: true, type: true, bedrooms: true, bathrooms: true, area: true, rent: true } },
        tenant: { select: { id: true, name: true, email: true, phone: true, type: true, company: true } },
        _count: { select: { payments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const now = new Date()
    const leasesWithStatus = leases.map((l) => {
      const daysRemaining = Math.ceil((new Date(l.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const isExpiring = daysRemaining > 0 && daysRemaining <= 90
      return {
        ...l,
        daysRemaining,
        isExpiring,
        paymentCount: l._count.payments,
      }
    })

    return NextResponse.json({ leases: leasesWithStatus })
  } catch (error) {
    console.error('Leases API error:', error)
    return NextResponse.json({ error: 'Failed to fetch leases' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db: tenantDb } = await getDbForRequest(request)

    const workspace = await tenantDb.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const body = await request.json()
    const { propertyId, unitId, tenantId, startDate, endDate, monthlyRent, deposit, type, terms } = body

    if (!propertyId || !unitId || !tenantId || !startDate || !endDate || !monthlyRent) {
      return NextResponse.json({ error: 'Property, unit, tenant, start date, end date, and monthly rent are required' }, { status: 400 })
    }

    const lease = await tenantDb.lease.create({
      data: {
        propertyId,
        unitId,
        tenantId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyRent: parseFloat(monthlyRent),
        deposit: deposit ? parseFloat(deposit) : 0,
        type: type || 'residential',
        terms: terms || null,
        workspaceId: workspace.id,
      },
      include: {
        property: { select: { id: true, name: true } },
        unit: { select: { id: true, unitNumber: true } },
        tenant: { select: { id: true, name: true } },
      },
    })

    // Update unit status to occupied
    await tenantDb.unit.update({
      where: { id: unitId },
      data: { status: 'occupied' },
    })

    return NextResponse.json({ lease }, { status: 201 })
  } catch (error) {
    console.error('Lease creation error:', error)
    return NextResponse.json({ error: 'Failed to create lease' }, { status: 500 })
  }
}
