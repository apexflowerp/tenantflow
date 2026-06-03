'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign,
  Search,
  Plus,
  Download,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Percent,
  ToggleLeft,
  ToggleRight,
  Calendar,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type FeeType = 'flat' | 'percentage'

interface LateFeeConfig {
  id: string
  name: string
  type: FeeType
  amount: number
  gracePeriod: number
  isRecurring: boolean
  maxAmount: number | null
  appliesTo: string
  isActive: boolean
}

interface LateFeeActivity {
  id: string
  tenant: string
  property: string
  unit: string
  feeConfig: string
  amount: number
  date: string
  status: 'collected' | 'outstanding' | 'waived'
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const CONFIGS: LateFeeConfig[] = [
  { id: 'lf-001', name: 'Standard Late Fee', type: 'flat', amount: 50, gracePeriod: 5, isRecurring: false, maxAmount: null, appliesTo: 'All Properties', isActive: true },
  { id: 'lf-002', name: 'Recurring Daily Penalty', type: 'flat', amount: 10, gracePeriod: 5, isRecurring: true, maxAmount: 200, appliesTo: 'Skyline Tower', isActive: true },
  { id: 'lf-003', name: 'Percentage-Based Fee', type: 'percentage', amount: 5, gracePeriod: 3, isRecurring: false, maxAmount: 250, appliesTo: 'Harbor View Residences', isActive: true },
  { id: 'lf-004', name: 'Premium Property Fee', type: 'flat', amount: 75, gracePeriod: 5, isRecurring: true, maxAmount: 300, appliesTo: 'Oakwood Estates', isActive: false },
  { id: 'lf-005', name: 'Commercial Late Fee', type: 'percentage', amount: 3, gracePeriod: 10, isRecurring: true, maxAmount: 500, appliesTo: 'Metro Commercial Hub', isActive: true },
]

const ACTIVITIES: LateFeeActivity[] = [
  { id: 'la-001', tenant: 'Sarah Mitchell', property: 'Skyline Tower', unit: '4B', feeConfig: 'Standard Late Fee', amount: 50, date: '2025-06-05', status: 'collected' },
  { id: 'la-002', tenant: 'Robert Garcia', property: 'Greenfield Gardens', unit: '2B', feeConfig: 'Standard Late Fee', amount: 50, date: '2025-06-08', status: 'outstanding' },
  { id: 'la-003', tenant: 'Emily Chen', property: 'Harbor View', unit: '12A', feeConfig: 'Percentage-Based Fee', amount: 140, date: '2025-06-04', status: 'collected' },
  { id: 'la-004', tenant: 'Michael Brown', property: 'Greenfield Gardens', unit: '7C', feeConfig: 'Standard Late Fee', amount: 50, date: '2025-06-10', status: 'waived' },
  { id: 'la-005', tenant: 'David Kim', property: 'Harbor View', unit: '5C', feeConfig: 'Recurring Daily Penalty', amount: 80, date: '2025-06-12', status: 'outstanding' },
  { id: 'la-006', tenant: 'Amanda White', property: 'Greenfield Gardens', unit: '2B', feeConfig: 'Standard Late Fee', amount: 50, date: '2025-06-02', status: 'collected' },
  { id: 'la-007', tenant: 'Jessica Taylor', property: 'Oakwood Estates', unit: '3A', feeConfig: 'Premium Property Fee', amount: 75, date: '2025-06-09', status: 'outstanding' },
  { id: 'la-008', tenant: 'Chris Martinez', property: 'Metro Hub', unit: '205', feeConfig: 'Commercial Late Fee', amount: 45, date: '2025-06-11', status: 'collected' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
}

function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    collected: 'tahoe-badge tahoe-badge-green',
    outstanding: 'tahoe-badge tahoe-badge-red',
    waived: 'tahoe-badge tahoe-badge-purple',
  }
  return map[status] ?? 'tahoe-badge'
}

// ── Main Component ────────────────────────────────────────────────────────────

export function LateFeesPage() {
  const [configs, setConfigs] = React.useState(CONFIGS)
  const [searchQuery, setSearchQuery] = React.useState('')

  const activeConfigs = configs.filter(c => c.isActive).length
  const feesCollected = ACTIVITIES.filter(a => a.status === 'collected').reduce((s, a) => s + a.amount, 0)
  const outstanding = ACTIVITIES.filter(a => a.status === 'outstanding').reduce((s, a) => s + a.amount, 0)
  const waived = ACTIVITIES.filter(a => a.status === 'waived').reduce((s, a) => s + a.amount, 0)

  const toggleConfig = (id: string) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))
  }

  const filteredActivities = ACTIVITIES.filter(a =>
    !searchQuery ||
    a.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.property.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = [
    { title: 'Active Configs', value: String(activeConfigs), subtitle: `of ${configs.length} total rules`, icon: DollarSign, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Fees Collected', value: formatCurrency(feesCollected), subtitle: 'This month', icon: CheckCircle2, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
    { title: 'Outstanding', value: formatCurrency(outstanding), subtitle: 'Awaiting payment', icon: AlertTriangle, iconColor: 'text-tahoe-red', iconBg: 'bg-tahoe-red/10' },
    { title: 'Waived', value: formatCurrency(waived), subtitle: 'Admin adjustments', icon: Clock, iconColor: 'text-tahoe-purple', iconBg: 'bg-tahoe-purple/10' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-red/10">
            <DollarSign className="size-6 text-tahoe-red" />
          </div>
          <div>
            <h1 className="tahoe-title">Late Fees</h1>
            <p className="tahoe-caption mt-1">Late fee configuration & tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary">
            <Plus className="size-3.5" />
            Add Rule
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <Card className="glass-card tahoe-hover overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 min-w-0">
                    <p className="tahoe-overline">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                    <p className="tahoe-caption">{stat.subtitle}</p>
                  </div>
                  <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', stat.iconBg)}>
                    <stat.icon className={cn('size-5', stat.iconColor)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Config Cards */}
      <div className="space-y-3">
        <h3 className="tahoe-headline">Fee Rules</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {configs.map((config, i) => (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className={cn('glass-card tahoe-hover overflow-hidden', !config.isActive && 'opacity-50')}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{config.name}</p>
                        <p className="text-[11px] text-muted-foreground">{config.appliesTo}</p>
                      </div>
                      <Switch
                        checked={config.isActive}
                        onCheckedChange={() => toggleConfig(config.id)}
                        className="data-[state=checked]:bg-tahoe-green"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={config.type === 'flat' ? 'tahoe-badge tahoe-badge-blue' : 'tahoe-badge tahoe-badge-purple'}>
                        {config.type === 'flat' ? 'Flat Fee' : 'Percentage'}
                      </span>
                      <span className="tahoe-badge tahoe-badge-green">
                        {config.type === 'flat' ? formatCurrency(config.amount) : `${config.amount}%`}
                      </span>
                      {config.isRecurring && <span className="tahoe-badge tahoe-badge-orange">Recurring</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30 text-center">
                      <div>
                        <p className="text-lg font-bold text-foreground">{config.gracePeriod}d</p>
                        <p className="text-[10px] text-muted-foreground">Grace Period</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{config.maxAmount ? formatCurrency(config.maxAmount) : '∞'}</p>
                        <p className="text-[10px] text-muted-foreground">Max Amount</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Recent Activity Table */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="tahoe-headline">Recent Activity</CardTitle>
              <p className="tahoe-caption mt-1">Late fee application log</p>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 w-[160px] text-sm glass-input border-0" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-3 tahoe-overline">Tenant</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Property/Unit</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Rule</th>
                  <th className="text-right py-3 px-3 tahoe-overline">Amount</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Date</th>
                  <th className="text-center py-3 px-3 tahoe-overline">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredActivities.map(activity => (
                    <motion.tr
                      key={activity.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        'border-b border-border/30 tahoe-transition',
                        activity.status === 'outstanding' ? 'bg-tahoe-red/5' : 'hover:bg-muted/30'
                      )}
                    >
                      <td className="py-3 px-3 font-medium text-foreground">{activity.tenant}</td>
                      <td className="py-3 px-3">
                        <p className="text-foreground">{activity.property}</p>
                        <p className="text-[11px] text-muted-foreground">Unit {activity.unit}</p>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{activity.feeConfig}</td>
                      <td className="py-3 px-3 text-right font-bold text-foreground">{formatCurrency(activity.amount)}</td>
                      <td className="py-3 px-3 text-muted-foreground">{activity.date}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={getStatusBadge(activity.status)}>{activity.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-3 max-h-96 overflow-y-auto">
            {filteredActivities.map(activity => (
              <div key={activity.id} className={cn('glass-card p-4 space-y-2', activity.status === 'outstanding' && 'ring-1 ring-tahoe-red/20')}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{activity.tenant}</span>
                  <span className={getStatusBadge(activity.status)}>{activity.status}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{activity.property} · Unit {activity.unit}</span>
                  <span className="font-bold">{formatCurrency(activity.amount)}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{activity.feeConfig} · {activity.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
