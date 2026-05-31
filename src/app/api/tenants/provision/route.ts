import { db } from '@/lib/db'
import { provisionTenantDatabase } from '@/lib/tenant-db'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/tenants/provision — Create a tenant database for a client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId } = body

    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
    }

    const client = await db.client.findUnique({ where: { id: clientId } })
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    if (client.dbStatus === 'active') {
      return NextResponse.json({
        message: 'Tenant database already active',
        databaseUrl: client.databaseUrl,
        databaseName: client.databaseName,
      })
    }

    // Provision the tenant database
    const result = await provisionTenantDatabase(clientId, client.companyName)

    return NextResponse.json({
      message: 'Tenant database provisioned successfully',
      ...result,
    })
  } catch (error) {
    console.error('Tenant provision error:', error)
    return NextResponse.json(
      { error: 'Failed to provision tenant database' },
      { status: 500 }
    )
  }
}

// GET /api/tenants/provision — Check tenant database status
export async function GET(request: NextRequest) {
  try {
    const clientId = request.nextUrl.searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
    }

    const client = await db.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyName: true, databaseUrl: true, databaseName: true, dbStatus: true },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Tenant status error:', error)
    return NextResponse.json({ error: 'Failed to get tenant status' }, { status: 500 })
  }
}
