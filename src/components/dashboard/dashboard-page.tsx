'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Users,
  DollarSign,
  AlertTriangle,
  FileText,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Wrench,
  CalendarCheck,
  ClipboardCheck,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Zap,
  Bell,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'
import { useDashboardStore } from '@/stores/dashboard-store'
import { useAppStore } from '@/stores'

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC PLACEHOLDER DATA (AI-generated content & calendar events)
// ═══════════════════════════════════════════════════════════════════════════════

const aiInsights = [
  {
    title: 'Revenue Optimization',
    description: '3 units at Skyline Tower are priced 8% below market average. Adjusting could yield +$1,680/mo.',
    action: 'View Analysis',
    accent: 'tahoe-purple',
  },
  {
    title: 'Tenant Retention Risk',
    description: '2 tenants with expiring leases have unresolved maintenance tickets. Prioritize to improve renewal rates.',
    action: 'Review Tickets',
    accent: 'tahoe-orange',
  },
  {
    title: 'Collection Forecast',
    description: 'Projected 97.8% collection rate this month based on payment patterns. Best quarter in 2 years.',
    action: 'See Forecast',
    accent: 'tahoe-green',
  },
]

const upcomingTasks = [
  { title: 'Property Inspection - Skyline Tower', type: 'inspection' as const, date: 'Today, 2:00 PM', priority: 'high' as const },
  { title: 'Lease Signing - Sarah Mitchell', type: 'lease_signing' as const, date: 'Tomorrow, 10:00 AM', priority: 'medium' as const },
  { title: 'Rent Collection - 48 units due', type: 'payment_due' as const, date: 'Mar 1, 2026', priority: 'high' as const },
  { title: 'HVAC Maintenance - Metro Hub', type: 'maintenance' as const, date: 'Mar 3, 2026', priority: 'medium' as const },
  { title: 'Quarterly Review Meeting', type: 'meeting' as const, date: 'Mar 5, 2026', priority: 'low' as const },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'payment': return CreditCard
    case 'lease': return FileText
    case 'maintenance': return Wrench
    case 'tenant': return UserCheck
    default: return Bell
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'payment': return 'text-tahoe-green bg-tahoe-green/10'
    case 'lease': return 'text-tahoe-blue bg-tahoe-blue/10'
    case 'maintenance': return 'text-tahoe-orange bg-tahoe-orange/10'
    case 'tenant': return 'text-tahoe-purple bg-tahoe-purple/10'
    default: return 'text-muted-foreground bg-muted'
  }
}

function getUrgencyBadge(days: number) {
  if (days < 30) return 'bg-tahoe-red/10 text-tahoe-red border-tahoe-red/20'
  if (days < 60) return 'bg-tahoe-orange/10 text-tahoe-orange border-tahoe-orange/20'
  return 'bg-tahoe-green/10 text-tahoe-green border-tahoe-green/20'
}

function getTaskIcon(type: string) {
  switch (type) {
    case 'inspection': return ClipboardCheck
    case 'lease_signing': return FileText
    case 'payment_due': return CreditCard
    case 'maintenance': return Wrench
    case 'meeting': return CalendarCheck
    default: return Bell
  }
}

function getTaskColor(type: string) {
  switch (type) {
    case 'inspection': return 'text-tahoe-blue bg-tahoe-blue/10'
    case 'lease_signing': return 'text-tahoe-purple bg-tahoe-purple/10'
    case 'payment_due': return 'text-tahoe-green bg-tahoe-green/10'
    case 'maintenance': return 'text-tahoe-orange bg-tahoe-orange/10'
    case 'meeting': return 'text-tahoe-teal bg-tahoe-teal/10'
    default: return 'text-muted-foreground bg-muted'
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'high': return 'bg-tahoe-red/10 text-tahoe-red border-tahoe-red/20'
    case 'medium': return 'bg-tahoe-orange/10 text-tahoe-orange border-tahoe-orange/20'
    case 'low': return 'bg-tahoe-blue/10 text-tahoe-blue border-tahoe-blue/20'
    default: return 'bg-muted text-muted-foreground border-border'
  }
}

function getAccentClasses(color: string) {
  const map: Record<string, { border: string; bg: string; icon: string; spark: string }> = {
    'tahoe-blue': { border: 'border-l-tahoe-blue', bg: 'glass-tint-blue', icon: 'text-tahoe-blue', spark: '#0071e3' },
    'tahoe-green': { border: 'border-l-tahoe-green', bg: 'glass-tint-green', icon: 'text-tahoe-green', spark: '#34c759' },
    'tahoe-purple': { border: 'border-l-tahoe-purple', bg: 'glass-tint-purple', icon: 'text-tahoe-purple', spark: '#af52de' },
    'tahoe-orange': { border: 'border-l-tahoe-orange', bg: 'glass-tint-blue', icon: 'text-tahoe-orange', spark: '#ff9500' },
  }
  return map[color] ?? map['tahoe-blue']
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPARKLINE MINI CHART
// ═══════════════════════════════════════════════════════════════════════════════

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 80
  const height = 28

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `0,${height} ${points} ${width},${height}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="opacity-50">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#spark-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM TOOLTIP FOR CHARTS
// ═══════════════════════════════════════════════════════════════════════════════

function ChartTooltip({ active, payload, label, formatter }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  formatter?: (value: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground">
        {formatter ? formatter(payload[0].value) : payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING SKELETON
// ═══════════════════════════════════════════════════════════════════════════════

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="glass-panel glass-tint-blue p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-lg bg-muted/50" />
            <div className="h-4 w-48 rounded bg-muted/50" />
          </div>
          <div className="h-6 w-40 rounded-full bg-muted/50" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-28 rounded-xl bg-muted/50" />
          ))}
        </div>
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-muted/50" />
                <div className="space-y-1.5">
                  <div className="h-3 w-20 rounded bg-muted/50" />
                  <div className="h-6 w-16 rounded bg-muted/50" />
                </div>
              </div>
              <div className="h-7 w-20 rounded bg-muted/50" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-muted/50" />
              <div className="h-3 w-12 rounded bg-muted/50" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="glass-card rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 rounded bg-muted/50" />
              <div className="h-5 w-20 rounded-full bg-muted/50" />
            </div>
            <div className="h-[280px] rounded-lg bg-muted/30" />
          </div>
        ))}
      </div>

      {/* Middle row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-xl p-6 space-y-3">
            <div className="h-5 w-32 rounded bg-muted/50" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-12 rounded-xl bg-muted/30" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="glass-card rounded-xl p-6 space-y-3">
            <div className="h-5 w-32 rounded bg-muted/50" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-14 rounded-xl bg-muted/30" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export function DashboardPage() {
  const {
    stats,
    recentActivities,
    revenueData,
    propertyOccupancy,
    paymentBreakdown,
    ticketBreakdown,
    ticketPriority,
    leaseBreakdown,
    isLoading,
    error,
    fetchDashboardData,
  } = useDashboardStore()

  const setActiveModule = useAppStore((s) => s.setActiveModule)

  // Fetch dashboard data on mount
  React.useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Loading state
  if (isLoading && !stats) {
    return <DashboardSkeleton />
  }

  // Error state
  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-red/10">
          <AlertCircle className="size-8 text-tahoe-red" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Failed to load dashboard</h3>
          <p className="tahoe-caption max-w-md">{error}</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-xl"
          onClick={() => fetchDashboardData()}
        >
          <RefreshCw className="size-4" />
          Try Again
        </Button>
      </div>
    )
  }

  // ── Derived data from store ──────────────────────────────────────────────────

  const openTicketCount = (ticketBreakdown?.open ?? 0) + (ticketBreakdown?.in_progress ?? 0)
  const highPriorityCount = ticketPriority?.high ?? 0

  // KPI cards from real stats
  const kpiCards = [
    {
      title: 'Total Properties',
      value: String(stats?.totalProperties ?? 0),
      subtitle: `${stats?.totalUnits ?? 0} total units`,
      trend: '',
      trendDirection: 'up' as const,
      icon: Building2,
      accentColor: 'tahoe-blue',
      sparkData: revenueData.length > 1
        ? revenueData.map((d) => d.revenue > 0 ? 1 : 0)
        : [1],
    },
    {
      title: 'Active Tenants',
      value: String(stats?.totalTenants ?? 0),
      subtitle: `${stats?.occupancyRate ?? 0}% occupancy`,
      trend: '',
      trendDirection: 'up' as const,
      icon: Users,
      accentColor: 'tahoe-green',
      sparkData: revenueData.length > 1
        ? revenueData.map((d) => d.revenue > 0 ? 1 : 0)
        : [1],
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats?.totalRevenue ?? 0),
      subtitle: stats?.pendingPayments ? `${formatCurrency(stats.pendingPayments)} pending` : 'No pending',
      trend: '',
      trendDirection: 'up' as const,
      icon: DollarSign,
      accentColor: 'tahoe-purple',
      sparkData: revenueData.length > 1
        ? revenueData.map((d) => d.revenue)
        : [0],
    },
    {
      title: 'Open Tickets',
      value: String(openTicketCount),
      subtitle: highPriorityCount > 0 ? `${highPriorityCount} high priority` : 'No high priority',
      trend: '',
      trendDirection: 'down' as const,
      icon: AlertTriangle,
      accentColor: 'tahoe-orange',
      sparkData: revenueData.length > 1
        ? revenueData.map(() => openTicketCount)
        : [0],
    },
  ]

  // Map propertyOccupancy for bar chart
  const occupancyChartData = propertyOccupancy.map((p) => ({
    property: p.name,
    occupancy: p.occupancyRate,
  }))

  // Compute avg occupancy for badge
  const avgOccupancy = propertyOccupancy.length > 0
    ? Math.round(propertyOccupancy.reduce((sum, p) => sum + p.occupancyRate, 0) / propertyOccupancy.length)
    : 0

  // Payment collection overall rate
  const totalPayments = (paymentBreakdown?.paid ?? 0) + (paymentBreakdown?.pending ?? 0) + (paymentBreakdown?.overdue ?? 0)
  const overallCollectionRate = totalPayments > 0
    ? Math.round(((paymentBreakdown?.paid ?? 0) / totalPayments) * 1000) / 10
    : 0

  // Lease breakdown for the expirations card
  const leaseSummaryItems = [
    { label: 'Active Leases', count: leaseBreakdown?.active ?? 0, color: 'tahoe-green' as const },
    { label: 'Expiring Soon', count: leaseBreakdown?.expiring ?? 0, color: 'tahoe-orange' as const },
    { label: 'Expired', count: leaseBreakdown?.expired ?? 0, color: 'tahoe-red' as const },
  ]

  // Quick actions config with navigation
  const quickActions = [
    { label: 'Add Property', icon: Building2, accent: 'tahoe-blue', module: 'properties' },
    { label: 'New Lease', icon: FileText, accent: 'tahoe-purple', module: 'leases' },
    { label: 'Collect Rent', icon: CreditCard, accent: 'tahoe-green', module: 'billing' },
    { label: 'AI Copilot', icon: Sparkles, accent: 'tahoe-purple', module: 'copilot' },
  ] as const

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: WELCOME HEADER
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <div className="glass-panel glass-tint-blue p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="tahoe-title">
                {getGreeting()}, TenantFlow
              </h1>
              <p className="tahoe-caption mt-1">{formatDate()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="tahoe-badge tahoe-badge-green">
                <TrendingUp className="size-3" />
                All Systems Operational
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                onClick={() => setActiveModule(action.module)}
                className={cn(
                  'gap-2 rounded-xl border-border/30 bg-background/50 backdrop-blur-sm',
                  'hover:bg-accent/50 hover:border-border/50',
                  'active:scale-[0.97] transition-all duration-200'
                )}
              >
                <action.icon className={cn('size-4', `text-${action.accent}`)} />
                <span className="text-[13px] font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: KPI STATS ROW
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => {
          const accents = getAccentClasses(kpi.accentColor)
          const Icon = kpi.icon

          return (
            <motion.div
              key={kpi.title}
              variants={itemVariants}
              custom={index}
            >
              <Card className={cn(
                'glass-card tahoe-hover overflow-hidden',
                accents.bg,
                'border-l-[3px]',
                accents.border,
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex size-10 items-center justify-center rounded-xl',
                        kpi.accentColor === 'tahoe-blue' && 'bg-tahoe-blue/10',
                        kpi.accentColor === 'tahoe-green' && 'bg-tahoe-green/10',
                        kpi.accentColor === 'tahoe-purple' && 'bg-tahoe-purple/10',
                        kpi.accentColor === 'tahoe-orange' && 'bg-tahoe-orange/10',
                      )}>
                        <Icon className={cn('size-5', accents.icon)} />
                      </div>
                      <div>
                        <p className="tahoe-overline">{kpi.title}</p>
                        <p className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                          {kpi.value}
                        </p>
                      </div>
                    </div>
                    <MiniSparkline data={kpi.sparkData} color={accents.spark} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="tahoe-caption">{kpi.subtitle}</span>
                    {kpi.trend && (
                      <span className={cn(
                        'inline-flex items-center gap-0.5 text-[11px] font-semibold',
                        kpi.trendDirection === 'up' ? 'text-tahoe-green' : 'text-tahoe-red'
                      )}>
                        {kpi.trendDirection === 'down' ? (
                          <ArrowDownRight className="size-3" />
                        ) : (
                          <ArrowUpRight className="size-3" />
                        )}
                        {kpi.trend}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: CHARTS ROW
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend - Area Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
              <Badge className="tahoe-badge tahoe-badge-green">
                <TrendingUp className="size-3" />
                {formatCurrency(stats?.totalRevenue ?? 0)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--tahoe-blue)" stopOpacity={0.3} />
                        <stop offset="50%" stopColor="var(--tahoe-blue)" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="var(--tahoe-blue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--glass-border-subtle)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                      tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => (
                        <ChartTooltip
                          active={active}
                          payload={payload as any}
                          label={label}
                          formatter={(v: number) => `$${v.toLocaleString()}`}
                        />
                      )}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--tahoe-blue)"
                      strokeWidth={2.5}
                      fill="url(#revenueGradient)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: 'var(--tahoe-blue)',
                        stroke: 'var(--background)',
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No revenue data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Occupancy by Property - Bar Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Occupancy by Property</CardTitle>
              <Badge className="tahoe-badge tahoe-badge-blue">
                Avg {avgOccupancy}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              {occupancyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyChartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barCategoryGap="20%">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--glass-border-subtle)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="property"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => (
                        <ChartTooltip
                          active={active}
                          payload={payload as any}
                          label={label}
                          formatter={(v: number) => `${v}%`}
                        />
                      )}
                    />
                    <Bar
                      dataKey="occupancy"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    >
                      {occupancyChartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.occupancy >= 95 ? 'var(--tahoe-green)' :
                            entry.occupancy >= 90 ? 'var(--tahoe-blue)' :
                            entry.occupancy >= 85 ? 'var(--tahoe-orange)' :
                            'var(--tahoe-red)'
                          }
                          opacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No occupancy data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4: MIDDLE ROW — ACTIVITY / LEASES / AI INSIGHTS
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* A. Recent Activity Feed */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-[11px] text-muted-foreground h-7 px-2">
                View All <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="max-h-[340px] overflow-y-auto">
            <div className="space-y-1">
              {recentActivities.length > 0 ? recentActivities.map((activity, idx) => {
                const ActivityIcon = getActivityIcon(activity.type)
                const colorClasses = getActivityColor(activity.type)
                const initials = activity.user?.name
                  ? getUserInitials(activity.user.name)
                  : activity.type.slice(0, 2).toUpperCase()

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.06 }}
                    className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-lg',
                      colorClasses
                    )}>
                      <ActivityIcon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-medium text-foreground truncate">
                          {activity.title}
                        </p>
                        <span className="tahoe-caption shrink-0 whitespace-nowrap">
                          {getRelativeTime(activity.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="tahoe-caption truncate">{activity.description ?? ''}</p>
                        {activity.user?.name && (
                          <span className="tahoe-caption shrink-0 font-medium">
                            {initials}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              }) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* B. Lease Breakdown */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Lease Overview</CardTitle>
              <Badge className="tahoe-badge tahoe-badge-orange">
                <Clock className="size-3" />
                {leaseBreakdown?.expiring ?? 0} Expiring
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaseSummaryItems.map((item, idx) => {
              const colorMap = {
                'tahoe-green': {
                  iconBg: 'bg-tahoe-green/10',
                  iconColor: 'text-tahoe-green',
                  barColor: '[&>div]:bg-tahoe-green',
                  borderBg: 'border-tahoe-green/15 bg-tahoe-green/[0.03] dark:bg-tahoe-green/[0.05]',
                },
                'tahoe-orange': {
                  iconBg: 'bg-tahoe-orange/10',
                  iconColor: 'text-tahoe-orange',
                  barColor: '[&>div]:bg-tahoe-orange',
                  borderBg: 'border-tahoe-orange/15 bg-tahoe-orange/[0.03] dark:bg-tahoe-orange/[0.05]',
                },
                'tahoe-red': {
                  iconBg: 'bg-tahoe-red/10',
                  iconColor: 'text-tahoe-red',
                  barColor: '[&>div]:bg-tahoe-red',
                  borderBg: 'border-tahoe-red/15 bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.05]',
                },
              }[item.color]

              const totalLeases = leaseBreakdown?.active ?? 0 + (leaseBreakdown?.expiring ?? 0) + (leaseBreakdown?.expired ?? 0)
              const rate = totalLeases > 0 ? Math.round((item.count / totalLeases) * 100) : 0

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className={cn(
                    'rounded-xl border p-3 transition-colors space-y-2',
                    'hover:bg-accent/30 cursor-pointer',
                    colorMap.borderBg
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className={cn(
                        'text-[10px] font-semibold',
                        colorMap.iconBg,
                        colorMap.iconColor,
                      )}>
                        {item.label === 'Active Leases' ? 'AL' : item.label === 'Expiring Soon' ? 'ES' : 'EX'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                        <Badge className={cn('tahoe-badge text-[10px] shrink-0', getUrgencyBadge(item.color === 'tahoe-green' ? 90 : item.color === 'tahoe-orange' ? 25 : 5))}>
                          {item.count}
                        </Badge>
                      </div>
                      <Progress
                        value={rate}
                        className={cn('h-1.5 rounded-full mt-1.5', colorMap.barColor)}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Quick link to leases */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-[12px] text-muted-foreground hover:text-foreground mt-2"
              onClick={() => setActiveModule('leases')}
            >
              View All Leases <ChevronRight className="size-3 ml-0.5" />
            </Button>
          </CardContent>
        </Card>

        {/* C. AI Insights */}
        <Card className="glass-card glass-tint-purple">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-tahoe-purple/10">
                  <Sparkles className="size-4 text-tahoe-purple" />
                </div>
                <CardTitle className="text-base font-semibold">AI Insights</CardTitle>
              </div>
              <Badge className="tahoe-badge tahoe-badge-purple">
                Powered by AI
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiInsights.map((insight, idx) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="rounded-xl border border-border/30 bg-background/30 p-3.5 space-y-2 hover:bg-accent/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-2">
                  <Zap className={cn(
                    'size-4 mt-0.5 shrink-0',
                    insight.accent === 'tahoe-purple' && 'text-tahoe-purple',
                    insight.accent === 'tahoe-orange' && 'text-tahoe-orange',
                    insight.accent === 'tahoe-green' && 'text-tahoe-green',
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{insight.title}</p>
                    <p className="tahoe-caption mt-0.5 line-clamp-2">{insight.description}</p>
                  </div>
                </div>
                <button className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-semibold transition-colors',
                  insight.accent === 'tahoe-purple' && 'text-tahoe-purple hover:text-tahoe-purple/80',
                  insight.accent === 'tahoe-orange' && 'text-tahoe-orange hover:text-tahoe-orange/80',
                  insight.accent === 'tahoe-green' && 'text-tahoe-green hover:text-tahoe-green/80',
                )}>
                  {insight.action}
                  <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5: BOTTOM ROW — PAYMENT COLLECTION / UPCOMING TASKS
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* A. Payment Collection Status */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Payment Collection</CardTitle>
              <div className="flex items-center gap-2">
                <span className="tahoe-overline">Overall</span>
                <span className={cn(
                  'text-lg font-bold',
                  overallCollectionRate >= 95 ? 'text-tahoe-green' :
                  overallCollectionRate >= 90 ? 'text-tahoe-blue' :
                  'text-tahoe-orange'
                )}>
                  {overallCollectionRate}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentBreakdown ? (
              <>
                {/* Paid */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-md bg-tahoe-green/10">
                        <CreditCard className="size-3 text-tahoe-green" />
                      </div>
                      <span className="text-[13px] font-medium text-foreground">Paid</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="tahoe-caption">{paymentBreakdown.paid} payments</span>
                      <span className="text-[11px] font-semibold text-tahoe-green">
                        {totalPayments > 0 ? Math.round((paymentBreakdown.paid / totalPayments) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={totalPayments > 0 ? (paymentBreakdown.paid / totalPayments) * 100 : 0}
                    className="h-2 rounded-full [&>div]:bg-tahoe-green"
                  />
                </motion.div>

                {/* Pending */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.06 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-md bg-tahoe-blue/10">
                        <Clock className="size-3 text-tahoe-blue" />
                      </div>
                      <span className="text-[13px] font-medium text-foreground">Pending</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="tahoe-caption">{formatCurrency(stats?.pendingPayments ?? 0)}</span>
                      <span className="text-[11px] font-semibold text-tahoe-blue">
                        {totalPayments > 0 ? Math.round((paymentBreakdown.pending / totalPayments) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={totalPayments > 0 ? (paymentBreakdown.pending / totalPayments) * 100 : 0}
                    className="h-2 rounded-full [&>div]:bg-tahoe-blue"
                  />
                </motion.div>

                {/* Overdue */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.12 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-md bg-tahoe-red/10">
                        <AlertTriangle className="size-3 text-tahoe-red" />
                      </div>
                      <span className="text-[13px] font-medium text-foreground">Overdue</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="tahoe-caption">{formatCurrency(stats?.overduePayments ?? 0)}</span>
                      <span className="text-[11px] font-semibold text-tahoe-red">
                        {totalPayments > 0 ? Math.round((paymentBreakdown.overdue / totalPayments) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={totalPayments > 0 ? (paymentBreakdown.overdue / totalPayments) * 100 : 0}
                    className="h-2 rounded-full [&>div]:bg-tahoe-red"
                  />
                </motion.div>

                {/* Property-level occupancy as secondary info */}
                {propertyOccupancy.length > 0 && (
                  <div className="pt-3 border-t border-border/30 space-y-3">
                    <p className="tahoe-overline">Collection by Property</p>
                    {propertyOccupancy.map((prop, idx) => (
                      <motion.div
                        key={prop.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.18 + idx * 0.06 }}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium text-foreground truncate">{prop.name}</span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="tahoe-caption">{prop.occupiedUnits}/{prop.totalUnits} units</span>
                            <span className={cn(
                              'text-[11px] font-semibold',
                              prop.occupancyRate >= 95 ? 'text-tahoe-green' :
                              prop.occupancyRate >= 90 ? 'text-tahoe-blue' :
                              'text-tahoe-orange'
                            )}>
                              {prop.occupancyRate}%
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={prop.occupancyRate}
                          className={cn(
                            'h-2 rounded-full',
                            prop.occupancyRate >= 95 ? '[&>div]:bg-tahoe-green' :
                            prop.occupancyRate >= 90 ? '[&>div]:bg-tahoe-blue' :
                            '[&>div]:bg-tahoe-orange'
                          )}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                No payment data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* B. Upcoming Tasks & Events */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Upcoming Tasks</CardTitle>
              <Button variant="ghost" size="sm" className="text-[11px] text-muted-foreground h-7 px-2">
                View Calendar <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingTasks.map((task, idx) => {
              const TaskIcon = getTaskIcon(task.type)
              const taskColor = getTaskColor(task.type)
              const priorityStyle = getPriorityStyle(task.priority)
              return (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-accent/30 transition-colors cursor-pointer group"
                >
                  <div className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-lg',
                    taskColor
                  )}>
                    <TaskIcon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate group-hover:text-accent-foreground transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="tahoe-caption">{task.date}</span>
                    </div>
                  </div>
                  <Badge className={cn('tahoe-badge text-[10px] shrink-0', priorityStyle)}>
                    {task.priority}
                  </Badge>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
