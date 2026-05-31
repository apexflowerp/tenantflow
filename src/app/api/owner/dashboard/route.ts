import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/owner/dashboard - Owner dashboard stats
export async function GET() {
  try {
    // ── Client stats ──
    const totalClients = await db.client.count()
    const activeClients = await db.client.count({ where: { status: 'active' } })
    const trialClients = await db.client.count({ where: { status: 'trial' } })
    const churnedClients = await db.client.count({ where: { status: 'churned' } })
    const suspendedClients = await db.client.count({ where: { status: 'suspended' } })

    // ── MRR calculation ──
    const activeClientData = await db.client.findMany({
      where: { status: { in: ['active', 'trial'] } },
      select: { monthlyFee: true, billingCycle: true, discountPercent: true, plan: true },
    })

    let mrr = 0
    for (const c of activeClientData) {
      const fee = c.monthlyFee * (1 - c.discountPercent / 100)
      if (c.billingCycle === 'annually') {
        mrr += fee / 12
      } else if (c.billingCycle === 'quarterly') {
        mrr += fee / 3
      } else {
        mrr += fee
      }
    }

    const arr = mrr * 12

    // ── Revenue by plan ──
    const clientsByPlan = await db.client.findMany({
      where: { status: { in: ['active', 'trial'] } },
      select: { plan: true, monthlyFee: true, billingCycle: true, discountPercent: true },
    })

    const planMap = new Map<string, { revenue: number; count: number }>()
    for (const c of clientsByPlan) {
      const fee = c.monthlyFee * (1 - c.discountPercent / 100)
      const monthlyEquiv = c.billingCycle === 'annually' ? fee / 12 : c.billingCycle === 'quarterly' ? fee / 3 : fee
      const existing = planMap.get(c.plan) || { revenue: 0, count: 0 }
      planMap.set(c.plan, { revenue: existing.revenue + monthlyEquiv, count: existing.count + 1 })
    }

    const revenueByPlan = Array.from(planMap.entries()).map(([plan, data]) => ({
      plan,
      revenue: Math.round(data.revenue * 100) / 100,
      count: data.count,
    }))

    // ── Client growth (last 12 months) ──
    const now = new Date()
    const clientGrowth: Array<{ month: string; clients: number; revenue: number }> = []
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const monthLabel = monthDate.toLocaleString('en-US', { month: 'short', year: '2-digit' })

      const clientsInMonth = await db.client.count({
        where: { createdAt: { lte: monthEnd } },
      })

      // Revenue for that month (sum of active client monthly fees at that time)
      const activeInMonth = await db.client.findMany({
        where: {
          status: { in: ['active', 'trial'] },
          contractStart: { lte: monthEnd },
          createdAt: { lte: monthEnd },
        },
        select: { monthlyFee: true, discountPercent: true },
      })

      const monthRevenue = activeInMonth.reduce((sum, c) => sum + c.monthlyFee * (1 - c.discountPercent / 100), 0)

      clientGrowth.push({
        month: monthLabel,
        clients: clientsInMonth,
        revenue: Math.round(monthRevenue * 100) / 100,
      })
    }

    // ── Recent clients ──
    const recentClients = await db.client.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // ── Upcoming renewals ──
    const upcomingRenewals = await db.client.findMany({
      where: {
        status: 'active',
        contractEnd: {
          gte: now,
          lte: new Date(now.getTime() + 90 * 86400000), // 90 days
        },
      },
      orderBy: { contractEnd: 'asc' },
      take: 5,
      select: {
        id: true,
        companyName: true,
        contractEnd: true,
        plan: true,
        monthlyFee: true,
      },
    })

    const formattedRenewals = upcomingRenewals.map(r => ({
      clientId: r.id,
      companyName: r.companyName,
      contractEnd: r.contractEnd?.toISOString() || '',
      plan: r.plan,
      monthlyFee: r.monthlyFee,
    }))

    // ── License key stats ──
    const totalLicenses = await db.licenseKey.count()
    const availableLicenses = await db.licenseKey.count({ where: { status: 'available' } })
    const activatedLicenses = await db.licenseKey.count({ where: { status: 'activated' } })
    const expiredLicenses = await db.licenseKey.count({ where: { status: 'expired' } })
    const revokedLicenses = await db.licenseKey.count({ where: { status: 'revoked' } })

    const licenseStats = {
      total: totalLicenses,
      available: availableLicenses,
      activated: activatedLicenses,
      expired: expiredLicenses,
      revoked: revokedLicenses,
    }

    // ── Overdue invoices ──
    const overdueInvoices = await db.invoice.findMany({
      where: { status: 'overdue' },
      select: { total: true },
    })

    const overdueTotal = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0)

    return NextResponse.json({
      totalClients,
      activeClients,
      trialClients,
      churnedClients,
      suspendedClients,
      mrr: Math.round(mrr * 100) / 100,
      arr: Math.round(arr * 100) / 100,
      revenueByPlan,
      clientGrowth,
      recentClients,
      upcomingRenewals: formattedRenewals,
      licenseStats,
      overdueInvoices: {
        count: overdueInvoices.length,
        total: Math.round(overdueTotal * 100) / 100,
      },
    })
  } catch (error) {
    console.error('Error fetching owner dashboard:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
