import { getDbForRequest } from '@/lib/db-context'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { db: tenantDb } = await getDbForRequest(request)

    const workspace = await tenantDb.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const payments = await tenantDb.payment.findMany({
      where: { workspaceId: workspace.id },
      include: {
        tenant: { select: { id: true, name: true, email: true, type: true, company: true } },
        lease: {
          select: {
            id: true,
            property: { select: { id: true, name: true } },
            unit: { select: { id: true, unitNumber: true } },
          },
        },
      },
      orderBy: { dueDate: 'desc' },
    })

    // Summary stats
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const paidAmount = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
    const pendingAmount = payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
    const overdueAmount = payments.filter((p) => p.status === 'overdue').reduce((sum, p) => sum + p.amount + (p.lateFee || 0), 0)
    const totalLateFees = payments.filter((p) => p.status === 'overdue').reduce((sum, p) => sum + (p.lateFee || 0), 0)
    const collectionRate = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0

    const summary = {
      totalPayments: payments.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      totalLateFees,
      collectionRate,
      paidCount: payments.filter((p) => p.status === 'paid').length,
      pendingCount: payments.filter((p) => p.status === 'pending').length,
      overdueCount: payments.filter((p) => p.status === 'overdue').length,
    }

    return NextResponse.json({ payments, summary })
  } catch (error) {
    console.error('Payments API error:', error)
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
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
    const { leaseId, tenantId, amount, type, status, dueDate, paidDate, method, reference, notes } = body

    if (!leaseId || !tenantId || !amount || !dueDate) {
      return NextResponse.json({ error: 'Lease, tenant, amount, and due date are required' }, { status: 400 })
    }

    const payment = await tenantDb.payment.create({
      data: {
        leaseId,
        tenantId,
        amount: parseFloat(amount),
        type: type || 'rent',
        status: status || 'pending',
        dueDate: new Date(dueDate),
        paidDate: paidDate ? new Date(paidDate) : null,
        method: method || null,
        reference: reference || null,
        notes: notes || null,
        workspaceId: workspace.id,
      },
    })

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
