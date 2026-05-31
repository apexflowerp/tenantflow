'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Flame,
  Droplets,
  Wifi,
  Search,
  Plus,
  Download,
  ChevronDown,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Clock,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type UtilityType = 'electric' | 'gas' | 'water' | 'internet'

interface UtilityReading {
  id: string
  property: string
  unit: string
  type: UtilityType
  reading: number
  previous: number
  consumption: number
  cost: number
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const READINGS: UtilityReading[] = [
  { id: 'ur-001', property: 'Skyline Tower', unit: '4B', type: 'electric', reading: 4520, previous: 4280, consumption: 240, cost: 62.40 },
  { id: 'ur-002', property: 'Skyline Tower', unit: '4B', type: 'gas', reading: 1890, previous: 1820, consumption: 70, cost: 38.50 },
  { id: 'ur-003', property: 'Harbor View', unit: '12A', type: 'water', reading: 3240, previous: 3100, consumption: 140, cost: 28.00 },
  { id: 'ur-004', property: 'Greenfield Gardens', unit: '7C', type: 'electric', reading: 5100, previous: 4700, consumption: 400, cost: 104.00 },
  { id: 'ur-005', property: 'Oakwood Estates', unit: '3A', type: 'internet', reading: 1, previous: 1, consumption: 0, cost: 79.99 },
  { id: 'ur-006', property: 'Metro Hub', unit: '101', type: 'electric', reading: 8920, previous: 8100, consumption: 820, cost: 213.20 },
  { id: 'ur-007', property: 'Harbor View', unit: '5C', type: 'water', reading: 2100, previous: 1950, consumption: 150, cost: 30.00 },
  { id: 'ur-008', property: 'Skyline Tower', unit: '8F', type: 'gas', reading: 2200, previous: 2050, consumption: 150, cost: 82.50 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTypeIcon(type: UtilityType) {
  const map: Record<UtilityType, React.ComponentType<{ className?: string }>> = { electric: Zap, gas: Flame, water: Droplets, internet: Wifi }
  return map[type]
}

function getTypeColor(type: UtilityType): { color: string; bg: string } {
  const map: Record<UtilityType, { color: string; bg: string }> = {
    electric: { color: 'text-tahoe-orange', bg: 'bg-tahoe-orange/10' },
    gas: { color: 'text-tahoe-red', bg: 'bg-tahoe-red/10' },
    water: { color: 'text-tahoe-blue', bg: 'bg-tahoe-blue/10' },
    internet: { color: 'text-tahoe-purple', bg: 'bg-tahoe-purple/10' },
  }
  return map[type]
}

function getTypeBadgeClass(type: UtilityType): string {
  const map: Record<UtilityType, string> = {
    electric: 'tahoe-badge tahoe-badge-orange',
    gas: 'tahoe-badge tahoe-badge-red',
    water: 'tahoe-badge tahoe-badge-blue',
    internet: 'tahoe-badge tahoe-badge-purple',
  }
  return map[type]
}

function getTypeLabel(type: UtilityType): string {
  const map: Record<UtilityType, string> = { electric: 'Electric', gas: 'Gas', water: 'Water', internet: 'Internet' }
  return map[type]
}

function getUnit(type: UtilityType): string {
  const map: Record<UtilityType, string> = { electric: 'kWh', gas: 'therms', water: 'gal', internet: '' }
  return map[type]
}

// ── Main Component ────────────────────────────────────────────────────────────

export function UtilitiesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<UtilityType | 'all'>('all')

  const filteredReadings = READINGS.filter(r => {
    const matchSearch = !searchQuery ||
      r.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.unit.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = typeFilter === 'all' || r.type === typeFilter
    return matchSearch && matchType
  })

  const stats = [
    { title: 'Total Utilities Cost', value: '$18,450', subtitle: 'Current billing period', icon: DollarSign, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
    { title: 'Avg Per Unit', value: '$128', subtitle: 'Across 144 units', icon: BarChart3, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Readings Due', value: '14', subtitle: 'Scheduled this month', icon: Clock, iconColor: 'text-tahoe-orange', iconBg: 'bg-tahoe-orange/10' },
    { title: 'Overdue', value: '3', subtitle: 'Require immediate action', icon: AlertTriangle, iconColor: 'text-tahoe-red', iconBg: 'bg-tahoe-red/10' },
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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-orange/10">
            <Zap className="size-6 text-tahoe-orange" />
          </div>
          <div>
            <h1 className="tahoe-title">Utilities</h1>
            <p className="tahoe-caption mt-1">Utility tracking & meter readings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary">
            <Plus className="size-3.5" />
            Add Reading
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <Card className="glass-card tahoe-hover overflow-hidden rounded-2xl">
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

      {/* Readings Table */}
      <Card className="glass-card overflow-hidden rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="tahoe-headline">Meter Readings</CardTitle>
              <p className="tahoe-caption mt-1">{filteredReadings.length} records</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 w-[160px] text-sm glass-input border-0" />
              </div>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value as UtilityType | 'all')}
                  className="h-8 rounded-lg border-0 bg-secondary/60 px-3 pr-7 text-sm text-foreground appearance-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="electric">Electric</option>
                  <option value="gas">Gas</option>
                  <option value="water">Water</option>
                  <option value="internet">Internet</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-3 tahoe-overline">Property</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Type</th>
                  <th className="text-right py-3 px-3 tahoe-overline">Reading</th>
                  <th className="text-right py-3 px-3 tahoe-overline">Previous</th>
                  <th className="text-right py-3 px-3 tahoe-overline">Consumption</th>
                  <th className="text-right py-3 px-3 tahoe-overline">Cost</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredReadings.map((r) => {
                    const Icon = getTypeIcon(r.type)
                    const style = getTypeColor(r.type)
                    return (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-border/30 tahoe-transition hover:bg-muted/30"
                      >
                        <td className="py-3 px-3">
                          <p className="font-medium text-foreground">{r.property}</p>
                          <p className="text-[11px] text-muted-foreground">Unit {r.unit}</p>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className={cn('flex size-7 items-center justify-center rounded-lg', style.bg)}>
                              <Icon className={cn('size-3.5', style.color)} />
                            </div>
                            <span className={getTypeBadgeClass(r.type)}>{getTypeLabel(r.type)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-foreground">{r.reading.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-mono text-muted-foreground">{r.previous.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">
                          <span className="font-medium text-foreground">{r.consumption} {getUnit(r.type)}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="font-bold text-foreground">${r.cost.toFixed(2)}</span>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3 max-h-96 overflow-y-auto">
            {filteredReadings.map(r => {
              const Icon = getTypeIcon(r.type)
              const style = getTypeColor(r.type)
              return (
                <div key={r.id} className="glass-card p-4 space-y-2 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{r.property}</p>
                      <p className="text-[11px] text-muted-foreground">Unit {r.unit}</p>
                    </div>
                    <span className={getTypeBadgeClass(r.type)}>{getTypeLabel(r.type)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Reading</p>
                      <p className="font-mono text-sm font-medium">{r.reading.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Used</p>
                      <p className="font-medium text-sm">{r.consumption} {getUnit(r.type)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cost</p>
                      <p className="font-bold text-sm">${r.cost.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
