import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const workspace = await db.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const properties = await db.property.findMany({
      where: { workspaceId: workspace.id },
      include: {
        units: {
          select: {
            id: true,
            unitNumber: true,
            type: true,
            bedrooms: true,
            bathrooms: true,
            area: true,
            rent: true,
            status: true,
          },
        },
        _count: {
          select: { leases: true, tickets: true, documents: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const propertiesWithStats = properties.map((p) => {
      const totalUnits = p.units.length
      const occupiedUnits = p.units.filter((u) => u.status === 'occupied').length
      const vacancyUnits = p.units.filter((u) => u.status === 'vacant').length
      const totalRent = p.units.filter((u) => u.status === 'occupied').reduce((sum, u) => sum + u.rent, 0)
      const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

      return {
        ...p,
        stats: {
          totalUnits,
          occupiedUnits,
          vacancyUnits,
          occupancyRate,
          monthlyRevenue: totalRent,
        },
      }
    })

    return NextResponse.json({ properties: propertiesWithStats })
  } catch (error) {
    console.error('Properties API error:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const workspace = await db.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, type, address, city, state, zipCode, country, floors, yearBuilt, totalArea, description } = body

    if (!name || !address || !city) {
      return NextResponse.json({ error: 'Name, address, and city are required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const property = await db.property.create({
      data: {
        name,
        slug,
        type: type || 'residential',
        address,
        city,
        state: state || null,
        zipCode: zipCode || null,
        country: country || 'US',
        floors: floors || null,
        yearBuilt: yearBuilt || null,
        totalArea: totalArea || null,
        description: description || null,
        workspaceId: workspace.id,
      },
    })

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    console.error('Property creation error:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}
