'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  DollarSign,
  Clock,
  Users,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

import { RevenueChart } from './revenue-chart'
import { OccupancyChart } from './occupancy-chart'
import { PerformanceChart } from './performance-chart'
import { InsightCard, DEFAULT_AI_INSIGHTS } from './insight-card'

// ── Types ──────────────────────────────────────────────────────────────────────

interface AnalyticsData {
  revenueTrends: Array<{ month: string; revenue: number; expenses: number; net: number }>
  occupancyTrends: Array<{ month: string; rate: number; units: number }>
  currentOccupancy: { rate: number; occupied: number; total: number }
  collectionRate: {
    overall: number
    totalDue: number
    totalCollected: number
    byMonth: Array<{ month: string; rate: number; collected: number; total: number }>
  }
  maintenance: {
    avgResolutionHours: number
    resolutionByCategory: Record<string, { avgHours: number; count: number }>
    resolutionByPriority: Record<string, { avgHours: number; count: number }>
    totalResolved: number
  }
  propertyPerformance: Array<{
    id: string
    name: string
    type: string
    city: string
    totalUnits: number
    occupiedUnits: number
    occupancyRate: number
    monthlyRevenue: number
    potentialRevenue: number
    revenueEfficiency: number
    openTickets: number
    totalDocuments: number
  }>
  tenantMetrics: {
    totalTenants: number
    activeTenants: number
    retentionRate: number
    acquisition: Array<{ month: string; newTenants: number }>
  }
}

// ── Collection Donut ────────────────────────────────────────────────────────────

function CollectionDonut({
  collectionRate,
  loading,
}: {
  collectionRate: AnalyticsData['collectionRate'] | null
  loading: boolean
}) {
  if (loading) {
    return (
      <Card className="border-border/30">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!collectionRate) return null

  const onTimeRate = collectionRate.overall
  const lateRate = 100 - onTimeRate

  const pieData = [
    { name: 'On Time', value: onTimeRate, color: '#c2703a' },
    { name: 'Late', value: lateRate, color: '#dc4a3a' },
  ]

  return (
    <Card className="mojave-card border-border/30 bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-[13px] font-semibold">Payment Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative h-[220px] w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--background) / 0.95)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{onTimeRate}%</span>
              <span className="text-xs text-muted-foreground">On Time</span>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">On Time ({onTimeRate}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-rose-500" />
            <span className="text-xs text-muted-foreground">Late ({lateRate}%)</span>
          </div>
        </div>
        {/* Summary */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground">Collected</p>
            <p className="text-sm font-semibold text-primary">
              ${collectionRate.totalCollected.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-950/30">
            <p className="text-xs text-muted-foreground">Outstanding</p>
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              ${(collectionRate.totalDue - collectionRate.totalCollected).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Circular Progress ──────────────────────────────────────────────────────────

function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  color = '#c2703a',
}: {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  )
}

// ── Main Analytics Page ────────────────────────────────────────────────────────

export function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [dateRange, setDateRange] = React.useState('12months')

  React.useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      try {
        const res = await fetch('/api/analytics')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  // Compute derived metrics
  const collectionRate = data?.collectionRate.overall ?? 0
  const avgResolutionDays = data
    ? Math.round((data.maintenance.avgResolutionHours / 24) * 10) / 10
    : 0
  const retentionRate = data?.tenantMetrics.retentionRate ?? 0
  const netIncome = data
    ? data.revenueTrends.reduce((sum, d) => sum + d.net, 0)
    : 0
  const totalRevenue = data
    ? data.revenueTrends.reduce((sum, d) => sum + d.revenue, 0)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <BarChart3 className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Analytics & Insights
            </h1>
            <p className="text-sm text-muted-foreground">
              Performance metrics across your portfolio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="size-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Row 1: Key Metrics ────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Collection Rate */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card className="mojave-card border-border/30 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Collection Rate</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      {loading ? '—' : `${collectionRate}%`}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary">
                      <ArrowUpRight className="size-3" />
                      +3%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground/60">vs. last quarter</p>
                </div>
                <CircularProgress value={collectionRate} size={64} strokeWidth={5} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Avg Resolution Time */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.06 }}
        >
          <Card className="mojave-card border-border/30 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Avg Resolution Time</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      {loading ? '—' : avgResolutionDays}
                    </span>
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground/60">
                    {data?.maintenance.totalResolved ?? 0} tickets resolved
                  </p>
                </div>
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
                  <Clock className="size-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tenant Retention */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12 }}
        >
          <Card className="mojave-card border-border/30 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Tenant Retention</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      {loading ? '—' : `${retentionRate}%`}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary">
                      <ArrowUpRight className="size-3" />
                      +2%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground/60">
                    {data?.tenantMetrics.activeTenants ?? 0} of {data?.tenantMetrics.totalTenants ?? 0} tenants
                  </p>
                </div>
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Net Operating Income */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18 }}
        >
          <Card className="mojave-card border-border/30 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Net Operating Income</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      {loading ? '—' : `$${(netIncome / 1000).toFixed(1)}k`}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary">
                      <TrendingUp className="size-3" />
                      +18%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground/60">
                    Revenue: ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
                  <DollarSign className="size-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Row 2: Revenue & Occupancy Charts ────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart
          data={data?.revenueTrends ?? []}
          loading={loading}
        />
        <OccupancyChart
          data={data?.occupancyTrends ?? []}
          loading={loading}
          avgRate={data?.currentOccupancy.rate}
        />
      </div>

      {/* ── Row 3: Performance & Collection Charts ───────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart
          data={
            data?.propertyPerformance.map((p) => ({
              name: p.name,
              monthlyRevenue: p.monthlyRevenue,
              occupancyRate: p.occupancyRate,
              totalUnits: p.totalUnits,
              revenueEfficiency: p.revenueEfficiency,
            })) ?? []
          }
          loading={loading}
        />
        <CollectionDonut
          collectionRate={data?.collectionRate ?? null}
          loading={loading}
        />
      </div>

      {/* ── Row 4: AI Insights ───────────────────────────────────────── */}
      <Card className="mojave-card border-border/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-600/20">
              <Sparkles className="size-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">AI Insights</CardTitle>
              <p className="text-xs text-muted-foreground">
                Powered by your portfolio data
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto gap-1 text-xs">
              <Sparkles className="size-3" />
              AI-Generated
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {DEFAULT_AI_INSIGHTS.map((insight, index) => (
                <InsightCard
                  key={insight.id}
                  title={insight.title}
                  description={insight.description}
                  type={insight.type}
                  icon={insight.icon}
                  index={index}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
