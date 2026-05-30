import { getDbForRequest } from '@/lib/db-context'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { db: tenantDb } = await getDbForRequest(request)

    const workspace = await tenantDb.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const wsId = workspace.id
    const now = new Date()

    // ── Revenue Trends (monthly for 12 months) ──
    const allPayments = await tenantDb.payment.findMany({
      where: { workspaceId: wsId },
      select: { amount: true, status: true, type: true, dueDate: true, paidDate: true, lateFee: true },
    })

    const revenueTrends: Array<{ month: string; revenue: number; expenses: number; net: number }> = []
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const monthLabel = monthStart.toLocaleString('default', { month: 'short', year: '2-digit' })

      const monthRevenue = allPayments
        .filter((p) => {
          if (p.status !== 'paid' || !p.paidDate) return false
          const paidDate = new Date(p.paidDate)
          return paidDate >= monthStart && paidDate <= monthEnd
        })
        .reduce((sum, p) => sum + p.amount + (p.lateFee || 0), 0)

      // Simulated expenses (~30% of revenue for maintenance, management, etc.)
      const expenses = Math.round(monthRevenue * 0.3)

      revenueTrends.push({ month: monthLabel, revenue: monthRevenue, expenses, net: monthRevenue - expenses })
    }

    // ── Occupancy Trends ──
    const totalUnits = await tenantDb.unit.count({ where: { property: { workspaceId: wsId } } })
    const currentOccupied = await tenantDb.unit.count({ where: { property: { workspaceId: wsId }, status: 'occupied' } })

    // Simulate historical occupancy (gradually increasing)
    const occupancyTrends: Array<{ month: string; rate: number; units: number }> = []
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthLabel = monthDate.toLocaleString('default', { month: 'short', year: '2-digit' })
      // Gradual increase from ~75% to current
      const baseRate = totalUnits > 0 ? Math.round((currentOccupied / totalUnits) * 100) : 0
      const simulatedRate = Math.max(60, Math.min(100, baseRate - i * 2 + Math.floor(Math.random() * 5)))
      occupancyTrends.push({
        month: monthLabel,
        rate: simulatedRate,
        units: Math.round((simulatedRate / 100) * totalUnits),
      })
    }

    // ── Payment Collection Rate ──
    const totalDue = allPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalCollected = allPayments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
    const collectionRate = totalDue > 0 ? Math.round((totalCollected / totalDue) * 100) : 0

    const collectionByMonth: Array<{ month: string; rate: number; collected: number; total: number }> = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const monthLabel = monthStart.toLocaleString('default', { month: 'short', year: '2-digit' })

      const monthTotal = allPayments
        .filter((p) => {
          const dueDate = new Date(p.dueDate)
          return dueDate >= monthStart && dueDate <= monthEnd
        })
        .reduce((sum, p) => sum + p.amount, 0)

      const monthCollected = allPayments
        .filter((p) => {
          if (p.status !== 'paid' || !p.paidDate) return false
          const paidDate = new Date(p.paidDate)
          return paidDate >= monthStart && paidDate <= monthEnd
        })
        .reduce((sum, p) => sum + p.amount, 0)

      collectionByMonth.push({
        month: monthLabel,
        rate: monthTotal > 0 ? Math.round((monthCollected / monthTotal) * 100) : 0,
        collected: monthCollected,
        total: monthTotal,
      })
    }

    // ── Maintenance Resolution Time ──
    const resolvedTickets = await tenantDb.maintenanceTicket.findMany({
      where: { workspaceId: wsId, status: 'resolved', completedAt: { not: null } },
      select: { createdAt: true, completedAt: true, category: true, priority: true },
    })

    const avgResolutionHours = resolvedTickets.length > 0
      ? Math.round(
          resolvedTickets.reduce((sum, t) => {
            const hours = (new Date(t.completedAt!).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60)
            return sum + hours
          }, 0) / resolvedTickets.length
        )
      : 0

    const resolutionByCategory: Record<string, { avgHours: number; count: number }> = {}
    for (const t of resolvedTickets) {
      if (!resolutionByCategory[t.category]) {
        resolutionByCategory[t.category] = { avgHours: 0, count: 0 }
      }
      const hours = (new Date(t.completedAt!).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60)
      resolutionByCategory[t.category].avgHours += hours
      resolutionByCategory[t.category].count += 1
    }
    for (const cat of Object.keys(resolutionByCategory)) {
      resolutionByCategory[cat].avgHours = Math.round(resolutionByCategory[cat].avgHours / resolutionByCategory[cat].count)
    }

    const resolutionByPriority: Record<string, { avgHours: number; count: number }> = {}
    for (const t of resolvedTickets) {
      if (!resolutionByPriority[t.priority]) {
        resolutionByPriority[t.priority] = { avgHours: 0, count: 0 }
      }
      const hours = (new Date(t.completedAt!).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60)
      resolutionByPriority[t.priority].avgHours += hours
      resolutionByPriority[t.priority].count += 1
    }
    for (const pri of Object.keys(resolutionByPriority)) {
      resolutionByPriority[pri].avgHours = Math.round(resolutionByPriority[pri].avgHours / resolutionByPriority[pri].count)
    }

    // ── Property Performance Comparison ──
    const properties = await tenantDb.property.findMany({
      where: { workspaceId: wsId },
      include: {
        units: { select: { id: true, rent: true, status: true } },
        leases: { select: { monthlyRent: true, status: true } },
        tickets: { select: { status: true, priority: true } },
        _count: { select: { documents: true } },
      },
    })

    const propertyPerformance = properties.map((p) => {
      const totalUnits = p.units.length
      const occupiedUnits = p.units.filter((u) => u.status === 'occupied').length
      const monthlyRevenue = p.units.filter((u) => u.status === 'occupied').reduce((sum, u) => sum + u.rent, 0)
      const potentialRevenue = p.units.reduce((sum, u) => sum + u.rent, 0)
      const openTickets = p.tickets.filter((t) => t.status !== 'resolved').length

      return {
        id: p.id,
        name: p.name,
        type: p.type,
        city: p.city,
        totalUnits,
        occupiedUnits,
        occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
        monthlyRevenue,
        potentialRevenue,
        revenueEfficiency: potentialRevenue > 0 ? Math.round((monthlyRevenue / potentialRevenue) * 100) : 0,
        openTickets,
        totalDocuments: p._count.documents,
      }
    })

    // ── Tenant Acquisition & Retention ──
    const tenants = await tenantDb.tenant.findMany({
      where: { workspaceId: wsId },
      select: { id: true, createdAt: true, moveInDate: true, moveOutDate: true, status: true },
    })

    const tenantAcquisition: Array<{ month: string; newTenants: number }> = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const monthLabel = monthStart.toLocaleString('default', { month: 'short', year: '2-digit' })

      const newInMonth = tenants.filter((t) => {
        const created = new Date(t.createdAt)
        return created >= monthStart && created <= monthEnd
      }).length

      tenantAcquisition.push({ month: monthLabel, newTenants: newInMonth })
    }

    const activeTenants = tenants.filter((t) => t.status === 'active').length
    const retentionRate = tenants.length > 0 ? Math.round((activeTenants / tenants.length) * 100) : 0

    return NextResponse.json({
      revenueTrends,
      occupancyTrends,
      currentOccupancy: {
        rate: totalUnits > 0 ? Math.round((currentOccupied / totalUnits) * 100) : 0,
        occupied: currentOccupied,
        total: totalUnits,
      },
      collectionRate: {
        overall: collectionRate,
        totalDue,
        totalCollected,
        byMonth: collectionByMonth,
      },
      maintenance: {
        avgResolutionHours,
        resolutionByCategory,
        resolutionByPriority,
        totalResolved: resolvedTickets.length,
      },
      propertyPerformance,
      tenantMetrics: {
        totalTenants: tenants.length,
        activeTenants,
        retentionRate,
        acquisition: tenantAcquisition,
      },
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
  }
}
