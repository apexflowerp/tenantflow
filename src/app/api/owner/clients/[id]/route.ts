import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/owner/clients/[id] - Get single client with full details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await db.client.findUnique({
      where: { id },
      include: {
        workspaces: true,
        licenseKeys: true,
        invoices: { orderBy: { createdAt: 'desc' } },
        auditLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json({ client })
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 })
  }
}

// PATCH /api/owner/clients/[id] - Update client
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const client = await db.client.update({
      where: { id },
      data: {
        ...body,
        trialStart: body.trialStart ? new Date(body.trialStart) : undefined,
        trialEnd: body.trialEnd ? new Date(body.trialEnd) : undefined,
        contractStart: body.contractStart ? new Date(body.contractStart) : undefined,
        contractEnd: body.contractEnd ? new Date(body.contractEnd) : undefined,
      },
    })

    return NextResponse.json({ client })
  } catch (error: any) {
    console.error('Error updating client:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}

// DELETE /api/owner/clients/[id] - Delete client
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.client.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting client:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
}
