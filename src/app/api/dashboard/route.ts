import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const workspace = await db.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found. Please seed the database first.' }, { status: 404 })
    }

    const wsId = workspace.id

    // ── Basic counts ──
    const [totalProperties, totalUnits, totalTenants, totalLeases] = await Promise.all([
      db.property.count({ where: { workspaceId: wsId } }),
      db.unit.count({ where: { property: { workspaceId: wsId } } }),
      db.tenant.count({ where: { workspaceId: wsId } }),
      db.lease.count({ where: { workspaceId: wsId } }),
    ])

    // ── Occupancy ──
    const occupiedUnits = await db.unit.count({
      where: { property: { workspaceId: wsId }, status: 'occupied' },
    })
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

    // ── Revenue & Payments ──
    const allPayments = await db.payment.findMany({
      where: { workspaceId: wsId },
      select: { amount: true, status: true, type: true, dueDate: true, paidDate: true, lateFee: true },
    })

    const totalRevenue = allPayments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount + (p.lateFee || 0), 0)

    const pendingPayments = allPayments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)

    const overduePayments = allPayments
      .filter((p) => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount + (p.lateFee || 0), 0)

    // ── Payment status breakdown ──
    const paymentBreakdown = {
      paid: allPayments.filter((p) => p.status === 'paid').length,
      pending: allPayments.filter((p) => p.status === 'pending').length,
      overdue: allPayments.filter((p) => p.status === 'overdue').length,
    }

    // ── Recent activities ──
    const recentActivities = await db.activity.findMany({
      where: { workspaceId: wsId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // ── Monthly revenue data (last 12 months) ──
    const now = new Date()
    const monthlyRevenue: Array<{ month: string; revenue: number; collected: number }> = []

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const monthLabel = monthStart.toLocaleString('default', { month: 'short', year: '2-digit' })

      const monthPaid = allPayments
        .filter((p) => {
          if (p.status !== 'paid' || !p.paidDate) return false
          const paidDate = new Date(p.paidDate)
          return paidDate >= monthStart && paidDate <= monthEnd
        })
        .reduce((sum, p) => sum + p.amount + (p.lateFee || 0), 0)

      const monthDue = allPayments
        .filter((p) => {
          const dueDate = new Date(p.dueDate)
          return dueDate >= monthStart && dueDate <= monthEnd
        })
        .reduce((sum, p) => sum + p.amount, 0)

      monthlyRevenue.push({ month: monthLabel, revenue: monthPaid, collected: monthDue })
    }

    // ── Property occupancy breakdown ──
    const properties = await db.property.findMany({
      where: { workspaceId: wsId },
      include: {
        _count: { select: { units: true } },
        units: { where: { status: 'occupied' }, select: { id: true } },
      },
    })

    const propertyOccupancy = properties.map((p) => ({
      id: p.id,
      name: p.name,
      totalUnits: p._count.units,
      occupiedUnits: p.units.length,
      occupancyRate: p._count.units > 0 ? Math.round((p.units.length / p._count.units) * 100) : 0,
    }))

    // ── Ticket status breakdown ──
    const tickets = await db.maintenanceTicket.findMany({
      where: { workspaceId: wsId },
      select: { status: true, priority: true },
    })

    const ticketBreakdown = {
      open: tickets.filter((t) => t.status === 'open').length,
      in_progress: tickets.filter((t) => t.status === 'in_progress').length,
      scheduled: tickets.filter((t) => t.status === 'scheduled').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
    }

    const ticketPriority = {
      low: tickets.filter((t) => t.priority === 'low').length,
      medium: tickets.filter((t) => t.priority === 'medium').length,
      high: tickets.filter((t) => t.priority === 'high').length,
    }

    // ── Lease status breakdown ──
    const leaseBreakdown = {
      active: await db.lease.count({ where: { workspaceId: wsId, status: 'active' } }),
      expiring: await db.lease.count({ where: { workspaceId: wsId, status: 'expiring' } }),
      expired: await db.lease.count({ where: { workspaceId: wsId, status: 'expired' } }),
    }

    return NextResponse.json({
      stats: {
        totalProperties,
        totalUnits,
        totalTenants,
        totalLeases,
        occupiedUnits,
        occupancyRate,
        totalRevenue,
        pendingPayments,
        overduePayments,
      },
      paymentBreakdown,
      ticketBreakdown,
      ticketPriority,
      leaseBreakdown,
      recentActivities,
      monthlyRevenue,
      propertyOccupancy,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
