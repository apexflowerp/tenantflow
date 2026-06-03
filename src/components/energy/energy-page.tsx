'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  DollarSign,
  Leaf,
  TrendingUp,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Flame,
  Droplets,
  Sun,
  Lightbulb,
  ArrowRight,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────────

type EnergyType = 'electric' | 'gas' | 'water' | 'solar'
type EnergyStatus = 'active' | 'warning' | 'critical'

interface EnergyReading {
  id: string
  property: string
  type: EnergyType
  consumption: number
  unit: string
  cost: number
  status: EnergyStatus
  lastReading: string
  trend: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const ENERGY_READINGS: EnergyReading[] = [
  {
    id: 'EN-001',
    property: 'Skyline Tower',
    type: 'electric',
    consumption: 4520,
    unit: 'kWh',
    cost: 678,
    status: 'active',
    lastReading: '2025-06-14',
    trend: '+3.2%',
  },
  {
    id: 'EN-002',
    property: 'Harbor View Residences',
    type: 'gas',
    consumption: 890,
    unit: 'therms',
    cost: 445,
    status: 'warning',
    lastReading: '2025-06-13',
    trend: '+8.1%',
  },
  {
    id: 'EN-003',
    property: 'Greenfield Gardens',
    type: 'water',
    consumption: 24500,
    unit: 'gal',
    cost: 312,
    status: 'active',
    lastReading: '2025-06-14',
    trend: '-2.4%',
  },
  {
    id: 'EN-004',
    property: 'Oakwood Estates',
    type: 'solar',
    consumption: 1800,
    unit: 'kWh',
    cost: -270,
    status: 'active',
    lastReading: '2025-06-14',
    trend: '+12.5%',
  },
  {
    id: 'EN-005',
    property: 'Metro Commercial Hub',
    type: 'electric',
    consumption: 8200,
    unit: 'kWh',
    cost: 1230,
    status: 'critical',
    lastReading: '2025-06-12',
    trend: '+15.8%',
  },
  {
    id: 'EN-006',
    property: 'Riverside Lofts',
    type: 'gas',
    consumption: 420,
    unit: 'therms',
    cost: 210,
    status: 'active',
    lastReading: '2025-06-14',
    trend: '-1.3%',
  },
]

const EFFICIENCY_TIPS = [
  {
    icon: Sun,
    title: 'Solar Panel Optimization',
    description: 'Schedule quarterly cleaning to maintain 95%+ efficiency across all solar installations.',
    savings: '$2,400/yr',
    color: 'text-tahoe-orange',
    bg: 'bg-tahoe-orange/10',
  },
  {
    icon: Lightbulb,
    title: 'LED Retrofit Program',
    description: 'Replace remaining fluorescent fixtures in common areas with LED alternatives.',
    savings: '$1,800/yr',
    color: 'text-tahoe-green',
    bg: 'bg-tahoe-green/10',
  },
  {
    icon: Droplets,
    title: 'Smart Irrigation Controls',
    description: 'Install weather-responsive irrigation controllers to reduce outdoor water usage.',
    savings: '$960/yr',
    color: 'text-tahoe-blue',
    bg: 'bg-tahoe-blue/10',
  },
  {
    icon: Flame,
    title: 'HVAC Efficiency Audit',
    description: 'Metro Commercial Hub shows 15% above baseline — schedule an HVAC tune-up.',
    savings: '$3,200/yr',
    color: 'text-tahoe-red',
    bg: 'bg-tahoe-red/10',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getTypeLabel(type: EnergyType): string {
  const map: Record<EnergyType, string> = {
    electric: 'Electric',
    gas: 'Gas',
    water: 'Water',
    solar: 'Solar',
  }
  return map[type]
}

function getTypeIcon(type: EnergyType) {
  const map: Record<EnergyType, React.ReactNode> = {
    electric: <Zap className="size-3.5" />,
    gas: <Flame className="size-3.5" />,
    water: <Droplets className="size-3.5" />,
    solar: <Sun className="size-3.5" />,
  }
  return map[type]
}

function getTypeColor(type: EnergyType): { bg: string; text: string; badge: string } {
  const map: Record<EnergyType, { bg: string; text: string; badge: string }> = {
    electric: { bg: 'bg-tahoe-blue/10', text: 'text-tahoe-blue', badge: 'tahoe-badge tahoe-badge-blue' },
    gas: { bg: 'bg-tahoe-orange/10', text: 'text-tahoe-orange', badge: 'tahoe-badge tahoe-badge-orange' },
    water: { bg: 'bg-tahoe-teal/10', text: 'text-tahoe-teal', badge: 'tahoe-badge tahoe-badge-teal' },
    solar: { bg: 'bg-tahoe-green/10', text: 'text-tahoe-green', badge: 'tahoe-badge tahoe-badge-green' },
  }
  return map[type]
}

function getStatusBadgeClass(status: EnergyStatus): string {
  const map: Record<EnergyStatus, string> = {
    active: 'tahoe-badge tahoe-badge-green',
    warning: 'tahoe-badge tahoe-badge-orange',
    critical: 'tahoe-badge tahoe-badge-red',
  }
  return map[status]
}

function getStatusLabel(status: EnergyStatus): string {
  const map: Record<EnergyStatus, string> = {
    active: 'Active',
    warning: 'Warning',
    critical: 'Critical',
  }
  return map[status]
}

function getTrendColor(trend: string): string {
  if (trend.startsWith('-')) return 'text-tahoe-green'
  if (trend.startsWith('+')) {
    const val = parseFloat(trend)
    return val > 10 ? 'text-tahoe-red' : 'text-tahoe-orange'
  }
  return 'text-muted-foreground'
}

// ── Stat Card Component ────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  delay,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="glass-card tahoe-hover rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1 min-w-0">
              <p className="tahoe-overline">{title}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
              <p className="tahoe-caption">{subtitle}</p>
            </div>
            <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', iconBg)}>
              <Icon className={cn('size-5', iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function EnergyPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<EnergyType | 'all'>('all')
  const [statusFilter, setStatusFilter] = React.useState<EnergyStatus | 'all'>('all')

  const filteredReadings = ENERGY_READINGS.filter((r) => {
    const matchSearch =
      !searchQuery ||
      r.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = typeFilter === 'all' || r.type === typeFilter
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const stats = [
    {
      title: 'Monthly Consumption',
      value: '$3,842',
      subtitle: 'All properties combined',
      icon: DollarSign,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Avg Cost/Unit',
      value: '$128',
      subtitle: 'Per property average',
      icon: TrendingUp,
      iconColor: 'text-tahoe-blue',
      iconBg: 'bg-tahoe-blue/10',
    },
    {
      title: 'Carbon Footprint',
      value: '12.4t',
      subtitle: 'CO₂ equivalent this month',
      icon: Leaf,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Savings',
      value: '18%',
      subtitle: 'YoY energy reduction',
      icon: Zap,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-6"
    >
      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-green/10">
            <Zap className="size-6 text-tahoe-green" />
          </div>
          <div>
            <h1 className="tahoe-title">Energy Management</h1>
            <p className="tahoe-caption mt-1">Monitor energy consumption, costs, and carbon footprint</p>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button variant="outline" size="sm" className="gap-2 rounded-xl glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl glass-input border-0">
            <RefreshCw className="size-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary rounded-xl">
            <Plus className="size-3.5" />
            Add Reading
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Data Table ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="tahoe-headline">Energy Readings</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredReadings.length} reading{filteredReadings.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(val) => setTypeFilter(val as EnergyType | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[130px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="solar">Solar</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as EnergyStatus | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[130px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="tahoe-overline">Property</TableHead>
                    <TableHead className="tahoe-overline">Type</TableHead>
                    <TableHead className="tahoe-overline text-right">Consumption</TableHead>
                    <TableHead className="tahoe-overline text-right">Cost</TableHead>
                    <TableHead className="tahoe-overline">Status</TableHead>
                    <TableHead className="tahoe-overline">Trend</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredReadings.map((reading, i) => {
                      const typeColor = getTypeColor(reading.type)
                      return (
                        <motion.tr
                          key={reading.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className={cn(
                            'border-b border-border/30 tahoe-transition',
                            reading.status === 'critical' && 'bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.04]',
                            reading.status === 'warning' && 'bg-tahoe-orange/[0.03] dark:bg-tahoe-orange/[0.04]',
                            'hover:bg-muted/30'
                          )}
                        >
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'flex size-9 items-center justify-center rounded-full text-xs font-semibold',
                                typeColor.bg, typeColor.text
                              )}>
                                {reading.property.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{reading.property}</p>
                                <p className="text-[11px] text-muted-foreground">{reading.id} · {reading.lastReading}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className={cn('flex size-5 items-center justify-center rounded-md', typeColor.bg)}>
                                {getTypeIcon(reading.type)}
                              </span>
                              <span className={typeColor.badge}>{getTypeLabel(reading.type)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <span className="font-medium text-foreground">{reading.consumption.toLocaleString()}</span>
                            <span className="text-[11px] text-muted-foreground ml-1">{reading.unit}</span>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <span className={cn(
                              'font-bold',
                              reading.cost < 0 ? 'text-tahoe-green' : 'text-foreground'
                            )}>
                              {reading.cost < 0 ? '-' : ''}${Math.abs(reading.cost).toLocaleString()}
                            </span>
                            {reading.cost < 0 && (
                              <p className="text-[10px] text-tahoe-green font-medium">Solar credit</p>
                            )}
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={getStatusBadgeClass(reading.status)}>
                              {getStatusLabel(reading.status)}
                            </span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={cn('text-sm font-medium', getTrendColor(reading.trend))}>
                              {reading.trend}
                            </span>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition">
                                <Eye className="size-3.5 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition">
                                <MoreHorizontal className="size-3.5 text-muted-foreground" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 max-h-[420px] overflow-y-auto">
              <AnimatePresence>
                {filteredReadings.map((reading, i) => {
                  const typeColor = getTypeColor(reading.type)
                  return (
                    <motion.div
                      key={reading.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className={cn(
                        'glass-card rounded-2xl p-4 space-y-3 tahoe-transition',
                        reading.status === 'critical' && 'ring-1 ring-tahoe-red/20',
                        reading.status === 'warning' && 'ring-1 ring-tahoe-orange/20'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'flex size-9 items-center justify-center rounded-full text-xs font-semibold',
                            typeColor.bg, typeColor.text
                          )}>
                            {reading.property.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{reading.property}</p>
                            <p className="text-[11px] text-muted-foreground">{reading.consumption.toLocaleString()} {reading.unit}</p>
                          </div>
                        </div>
                        <span className={cn('font-bold text-lg', reading.cost < 0 ? 'text-tahoe-green' : 'text-foreground')}>
                          {reading.cost < 0 ? '-' : ''}${Math.abs(reading.cost).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={typeColor.badge}>{getTypeLabel(reading.type)}</span>
                        <span className={getStatusBadgeClass(reading.status)}>{getStatusLabel(reading.status)}</span>
                        <span className={cn('text-[11px] font-medium ml-auto', getTrendColor(reading.trend))}>{reading.trend}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {filteredReadings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-green/10 mb-4">
                  <Zap className="size-8 text-tahoe-green/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No readings found</h3>
                <p className="tahoe-caption mt-1 max-w-sm">
                  Try adjusting your search or filter criteria to find what you&apos;re looking for.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Energy Efficiency Tips ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-tahoe-green/10">
                <Lightbulb className="size-4 text-tahoe-green" />
              </div>
              <div>
                <CardTitle className="tahoe-headline">Energy Efficiency Tips</CardTitle>
                <p className="tahoe-caption mt-0.5">AI-powered recommendations to reduce consumption and costs</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              {EFFICIENCY_TIPS.map((tip, i) => {
                const TipIcon = tip.icon
                return (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
                    className="glass-card rounded-xl p-4 tahoe-hover cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', tip.bg)}>
                        <TipIcon className={cn('size-4', tip.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm text-foreground">{tip.title}</p>
                          <Badge className="tahoe-badge tahoe-badge-green shrink-0 text-[10px]">
                            {tip.savings}
                          </Badge>
                        </div>
                        <p className="tahoe-caption mt-1">{tip.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
