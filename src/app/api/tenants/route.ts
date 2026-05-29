import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const workspace = await db.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const tenants = await db.tenant.findMany({
      where: { workspaceId: workspace.id },
      include: {
        leases: {
          include: {
            property: { select: { id: true, name: true } },
            unit: { select: { id: true, unitNumber: true, rent: true } },
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            dueDate: true,
            paidDate: true,
            type: true,
          },
          orderBy: { dueDate: 'desc' },
          take: 5,
        },
        _count: {
          select: { payments: true, tickets: true, messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const tenantsWithStats = tenants.map((t) => {
      const activeLease = t.leases.find((l) => l.status === 'active' || l.status === 'expiring')
      const totalPaid = t.payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
      const totalOwed = t.payments.filter((p) => p.status === 'overdue' || p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
      const overdueCount = t.payments.filter((p) => p.status === 'overdue').length

      return {
        ...t,
        currentLease: activeLease || null,
        stats: {
          totalPaid,
          totalOwed,
          overdueCount,
          totalPayments: t._count.payments,
          totalTickets: t._count.tickets,
          totalMessages: t._count.messages,
        },
      }
    })

    return NextResponse.json({ tenants: tenantsWithStats })
  } catch (error) {
    console.error('Tenants API error:', error)
    return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const workspace = await db.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, email, phone, type, company, idNumber, emergencyName, emergencyPhone, notes } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const tenant = await db.tenant.create({
      data: {
        name,
        email,
        phone: phone || null,
        type: type || 'individual',
        company: company || null,
        idNumber: idNumber || null,
        emergencyName: emergencyName || null,
        emergencyPhone: emergencyPhone || null,
        notes: notes || null,
        workspaceId: workspace.id,
      },
    })

    return NextResponse.json({ tenant }, { status: 201 })
  } catch (error) {
    console.error('Tenant creation error:', error)
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 })
  }
}
