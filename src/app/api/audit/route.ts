import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entity = searchParams.get('entity')
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const severity = searchParams.get('severity')
    const search = searchParams.get('search')
    const dateRange = searchParams.get('dateRange')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: Record<string, unknown> = {}

    if (entity && entity !== 'all') {
      where.entity = entity
    }
    if (action) {
      where.action = { contains: action, mode: 'insensitive' }
    }
    if (userId && userId !== 'all') {
      where.userId = userId
    }
    if (severity && severity !== 'all') {
      where.severity = severity
    }
    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { entity: { contains: search, mode: 'insensitive' } },
        { details: { contains: search, mode: 'insensitive' } },
        { entityId: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Date range filter
    if (dateRange) {
      const now = new Date()
      let startDate: Date | null = null

      if (dateRange === '24h') {
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      } else if (dateRange === '7d') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      } else if (dateRange === '30d') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      } else if (dateRange.startsWith('custom:')) {
        const parts = dateRange.split(':')
        if (parts[1]) {
          startDate = new Date(parts[1])
        }
      }

      if (startDate) {
        where.createdAt = { gte: startDate }
      }
    }

    // Get total count
    const total = await db.auditLog.count({ where })

    // Get audit logs with user and workspace info
    const logs = await db.auditLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        workspace: {
          select: { id: true, name: true },
        },
        client: {
          select: { id: true, companyName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    // Get stats
    const [totalLogs, warningCount, errorCount, criticalCount, recentCount] = await Promise.all([
      db.auditLog.count(),
      db.auditLog.count({ where: { severity: 'warning' } }),
      db.auditLog.count({ where: { severity: 'error' } }),
      db.auditLog.count({ where: { severity: 'critical' } }),
      db.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    // By entity type counts
    const entityCounts = await db.auditLog.groupBy({
      by: ['entity'],
      _count: { entity: true },
      orderBy: { _count: { entity: 'desc' } },
    })

    // Get unique users for filter dropdown
    const usersWithLogs = await db.auditLog.findMany({
      where: { userId: { not: null } },
      select: { userId: true, user: { select: { id: true, name: true } } },
      distinct: ['userId'],
    })

    const users = usersWithLogs
      .filter((l) => l.user)
      .map((l) => ({ id: l.user!.id, name: l.user!.name }))

    return NextResponse.json({
      logs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      stats: {
        totalLogs,
        warningCount,
        errorCount,
        criticalCount,
        recentCount,
        byEntity: entityCounts.map((e) => ({
          entity: e.entity,
          count: e._count.entity,
        })),
      },
      users,
    })
  } catch (error) {
    console.error('Audit logs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs', details: String(error) },
      { status: 500 }
    )
  }
}
