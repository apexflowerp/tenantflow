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

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const revenueData = [
  { month: 'Jul', revenue: 98200 },
  { month: 'Aug', revenue: 105400 },
  { month: 'Sep', revenue: 112800 },
  { month: 'Oct', revenue: 108600 },
  { month: 'Nov', revenue: 118200 },
  { month: 'Dec', revenue: 124500 },
  { month: 'Jan', revenue: 119800 },
  { month: 'Feb', revenue: 126400 },
  { month: 'Mar', revenue: 131200 },
  { month: 'Apr', revenue: 128900 },
  { month: 'May', revenue: 136700 },
  { month: 'Jun', revenue: 142800 },
]

const occupancyData = [
  { property: 'Skyline Tower', occupancy: 96 },
  { property: 'Harbor View', occupancy: 92 },
  { property: 'Greenfield', occupancy: 88 },
  { property: 'Metro Hub', occupancy: 97 },
  { property: 'Riverside', occupancy: 85 },
  { property: 'Oak Terrace', occupancy: 91 },
]

const recentActivities = [
  { id: 1, type: 'payment' as const, title: 'Rent payment received', description: 'Unit 12A - Harbor View Residences', amount: '$2,400', time: '2 min ago', user: 'JM' },
  { id: 2, type: 'lease' as const, title: 'New lease signed', description: 'Sarah Mitchell - Greenfield Gardens 7C', amount: '12 months', time: '18 min ago', user: 'SM' },
  { id: 3, type: 'maintenance' as const, title: 'Maintenance request filed', description: 'HVAC system - Metro Commercial Hub', amount: 'Urgent', time: '1 hr ago', user: 'RK' },
  { id: 4, type: 'tenant' as const, title: 'New tenant registered', description: 'Alex Thompson - Skyline Tower 22B', amount: '', time: '3 hrs ago', user: 'AT' },
  { id: 5, type: 'payment' as const, title: 'Rent payment received', description: 'Unit 5D - Oak Terrace Apartments', amount: '$1,850', time: '4 hrs ago', user: 'LD' },
  { id: 6, type: 'lease' as const, title: 'Lease renewal initiated', description: 'Michael Brown - Riverside Condos 3A', amount: '$2,100/mo', time: '5 hrs ago', user: 'MB' },
]

const leaseExpirations = [
  { tenant: 'Emily Chen', property: 'Skyline Tower 14A', daysRemaining: 18, avatar: 'EC' },
  { tenant: 'David Park', property: 'Harbor View 8B', daysRemaining: 27, avatar: 'DP' },
  { tenant: 'Maria Garcia', property: 'Riverside 2C', daysRemaining: 45, avatar: 'MG' },
  { tenant: 'James Wilson', property: 'Greenfield 11D', daysRemaining: 72, avatar: 'JW' },
]

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

const paymentCollection = [
  { property: 'Skyline Tower', rate: 97.2, collected: 35200, total: 36200 },
  { property: 'Harbor View Residences', rate: 95.8, collected: 28700, total: 29950 },
  { property: 'Greenfield Gardens', rate: 93.1, collected: 18900, total: 20300 },
  { property: 'Metro Commercial Hub', rate: 96.5, collected: 42800, total: 44350 },
  { property: 'Riverside Condos', rate: 88.4, collected: 11200, total: 12660 },
  { property: 'Oak Terrace Apartments', rate: 94.0, collected: 6200, total: 6600 },
]

const upcomingTasks = [
  { title: 'Property Inspection - Skyline Tower', type: 'inspection' as const, date: 'Today, 2:00 PM', priority: 'high' as const },
  { title: 'Lease Signing - Sarah Mitchell', type: 'lease_signing' as const, date: 'Tomorrow, 10:00 AM', priority: 'medium' as const },
  { title: 'Rent Collection - 48 units due', type: 'payment_due' as const, date: 'Mar 1, 2026', priority: 'high' as const },
  { title: 'HVAC Maintenance - Metro Hub', type: 'maintenance' as const, date: 'Mar 3, 2026', priority: 'medium' as const },
  { title: 'Quarterly Review Meeting', type: 'meeting' as const, date: 'Mar 5, 2026', priority: 'low' as const },
]

// ═══════════════════════════════════════════════════════════════════════════════
// KPI CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const kpiCards = [
  {
    title: 'Total Properties',
    value: '48',
    subtitle: '+3 this month',
    trend: '+6.7%',
    trendDirection: 'up' as const,
    icon: Building2,
    accentColor: 'tahoe-blue',
    sparkData: [32, 35, 38, 36, 40, 42, 44, 43, 45, 46, 47, 48],
  },
  {
    title: 'Active Tenants',
    value: '156',
    subtitle: '94% occupancy',
    trend: '+4.2%',
    trendDirection: 'up' as const,
    icon: Users,
    accentColor: 'tahoe-green',
    sparkData: [120, 128, 132, 130, 138, 140, 142, 145, 148, 150, 153, 156],
  },
  {
    title: 'Monthly Revenue',
    value: '$142,800',
    subtitle: '+12% YoY',
    trend: '+12.3%',
    trendDirection: 'up' as const,
    icon: DollarSign,
    accentColor: 'tahoe-purple',
    sparkData: [98, 105, 112, 108, 118, 124, 119, 126, 131, 128, 136, 142],
  },
  {
    title: 'Open Tickets',
    value: '12',
    subtitle: '3 urgent',
    trend: '-8.2%',
    trendDirection: 'down' as const,
    icon: AlertTriangle,
    accentColor: 'tahoe-orange',
    sparkData: [22, 20, 18, 19, 16, 15, 17, 14, 16, 13, 14, 12],
  },
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

function getUrgencyColor(days: number) {
  if (days < 30) return 'text-tahoe-red bg-tahoe-red/10 border-tahoe-red/20'
  if (days < 60) return 'text-tahoe-orange bg-tahoe-orange/10 border-tahoe-orange/20'
  return 'text-tahoe-green bg-tahoe-green/10 border-tahoe-green/20'
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
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export function DashboardPage() {
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
            {[
              { label: 'Add Property', icon: Building2, accent: 'tahoe-blue' },
              { label: 'New Lease', icon: FileText, accent: 'tahoe-purple' },
              { label: 'Collect Rent', icon: CreditCard, accent: 'tahoe-green' },
              { label: 'AI Copilot', icon: Sparkles, accent: 'tahoe-purple' },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
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
          const isDown = kpi.trendDirection === 'down'
          // For tickets, down is good
          const isPositive = kpi.title === 'Open Tickets' ? isDown : !isDown

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
                    <span className={cn(
                      'inline-flex items-center gap-0.5 text-[11px] font-semibold',
                      isPositive ? 'text-tahoe-green' : 'text-tahoe-red'
                    )}>
                      {isDown ? (
                        <ArrowDownRight className="size-3" />
                      ) : (
                        <ArrowUpRight className="size-3" />
                      )}
                      {kpi.trend}
                    </span>
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
                +12% YoY
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
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
            </div>
          </CardContent>
        </Card>

        {/* Occupancy by Property - Bar Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Occupancy by Property</CardTitle>
              <Badge className="tahoe-badge tahoe-badge-blue">
                Avg 91.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barCategoryGap="20%">
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
                    domain={[70, 100]}
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
                    {occupancyData.map((entry, index) => (
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
              {recentActivities.map((activity, idx) => {
                const ActivityIcon = getActivityIcon(activity.type)
                const colorClasses = getActivityColor(activity.type)
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
                        <span className="tahoe-caption shrink-0 whitespace-nowrap">{activity.time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="tahoe-caption truncate">{activity.description}</p>
                        {activity.amount && (
                          <span className={cn(
                            'text-[11px] font-semibold shrink-0',
                            activity.type === 'payment' ? 'text-tahoe-green' :
                            activity.type === 'maintenance' && activity.amount === 'Urgent' ? 'text-tahoe-red' :
                            'text-muted-foreground'
                          )}>
                            {activity.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* B. Lease Expirations */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Lease Expirations</CardTitle>
              <Badge className="tahoe-badge tahoe-badge-orange">
                <Clock className="size-3" />
                4 Upcoming
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaseExpirations.map((lease, idx) => (
              <motion.div
                key={lease.tenant}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 transition-colors',
                  'hover:bg-accent/30 cursor-pointer',
                  lease.daysRemaining < 30 ? 'border-tahoe-red/15 bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.05]' :
                  lease.daysRemaining < 60 ? 'border-tahoe-orange/15 bg-tahoe-orange/[0.03] dark:bg-tahoe-orange/[0.05]' :
                  'border-border/30 bg-background/30'
                )}
              >
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback className={cn(
                    'text-[10px] font-semibold',
                    lease.daysRemaining < 30 ? 'bg-tahoe-red/10 text-tahoe-red' :
                    lease.daysRemaining < 60 ? 'bg-tahoe-orange/10 text-tahoe-orange' :
                    'bg-tahoe-green/10 text-tahoe-green'
                  )}>
                    {lease.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{lease.tenant}</p>
                  <p className="tahoe-caption truncate">{lease.property}</p>
                </div>
                <Badge className={cn('tahoe-badge text-[10px] shrink-0', getUrgencyBadge(lease.daysRemaining))}>
                  {lease.daysRemaining}d
                </Badge>
              </motion.div>
            ))}
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
                <span className="text-lg font-bold text-tahoe-green">94.2%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentCollection.map((item, idx) => (
              <motion.div
                key={item.property}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-foreground truncate">{item.property}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="tahoe-caption">${item.collected.toLocaleString()}k</span>
                    <span className={cn(
                      'text-[11px] font-semibold',
                      item.rate >= 95 ? 'text-tahoe-green' :
                      item.rate >= 90 ? 'text-tahoe-blue' :
                      'text-tahoe-orange'
                    )}>
                      {item.rate}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={item.rate}
                  className={cn(
                    'h-2 rounded-full',
                    item.rate >= 95 ? '[&>div]:bg-tahoe-green' :
                    item.rate >= 90 ? '[&>div]:bg-tahoe-blue' :
                    '[&>div]:bg-tahoe-orange'
                  )}
                />
              </motion.div>
            ))}
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
