'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Warehouse,
  DollarSign,
  TrendingDown,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  Shield,
  BarChart3,
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

type AssetCategory = 'hvac' | 'appliance' | 'furniture' | 'infrastructure' | 'technology'
type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor'
type WarrantyStatus = 'active' | 'expired' | 'none'

interface AssetRecord {
  id: string
  name: string
  category: AssetCategory
  property: string
  purchasePrice: number
  currentValue: number
  purchaseDate: string
  condition: AssetCondition
  warrantyStatus: WarrantyStatus
  warrantyExpiry: string | null
  lastMaintenance: string
  nextMaintenance: string
  depreciationRate: number
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const ASSETS: AssetRecord[] = [
  {
    id: 'AST-001',
    name: 'Central HVAC System',
    category: 'hvac',
    property: 'Skyline Tower',
    purchasePrice: 45000,
    currentValue: 31500,
    purchaseDate: '2022-03-15',
    condition: 'good',
    warrantyStatus: 'active',
    warrantyExpiry: '2027-03-15',
    lastMaintenance: '2025-05-20',
    nextMaintenance: '2025-08-20',
    depreciationRate: 10,
  },
  {
    id: 'AST-002',
    name: 'Commercial Washer/Dryer Set',
    category: 'appliance',
    property: 'Harbor View Residences',
    purchasePrice: 8500,
    currentValue: 5100,
    purchaseDate: '2023-01-10',
    condition: 'good',
    warrantyStatus: 'active',
    warrantyExpiry: '2026-01-10',
    lastMaintenance: '2025-06-01',
    nextMaintenance: '2025-09-01',
    depreciationRate: 15,
  },
  {
    id: 'AST-003',
    name: 'Lobby Furniture Set',
    category: 'furniture',
    property: 'Greenfield Gardens',
    purchasePrice: 12000,
    currentValue: 6000,
    purchaseDate: '2021-06-01',
    condition: 'fair',
    warrantyStatus: 'expired',
    warrantyExpiry: '2024-06-01',
    lastMaintenance: '2025-04-15',
    nextMaintenance: '2025-07-15',
    depreciationRate: 20,
  },
  {
    id: 'AST-004',
    name: 'Elevator System',
    category: 'infrastructure',
    property: 'Skyline Tower',
    purchasePrice: 120000,
    currentValue: 84000,
    purchaseDate: '2020-09-01',
    condition: 'excellent',
    warrantyStatus: 'active',
    warrantyExpiry: '2030-09-01',
    lastMaintenance: '2025-06-10',
    nextMaintenance: '2025-07-10',
    depreciationRate: 5,
  },
  {
    id: 'AST-005',
    name: 'Smart Access Control',
    category: 'technology',
    property: 'Metro Commercial Hub',
    purchasePrice: 22000,
    currentValue: 13200,
    purchaseDate: '2023-07-01',
    condition: 'good',
    warrantyStatus: 'active',
    warrantyExpiry: '2026-07-01',
    lastMaintenance: '2025-05-01',
    nextMaintenance: '2025-06-30',
    depreciationRate: 15,
  },
  {
    id: 'AST-006',
    name: 'Boiler System',
    category: 'hvac',
    property: 'Oakwood Estates',
    purchasePrice: 35000,
    currentValue: 10500,
    purchaseDate: '2018-01-15',
    condition: 'poor',
    warrantyStatus: 'expired',
    warrantyExpiry: '2023-01-15',
    lastMaintenance: '2025-03-01',
    nextMaintenance: '2025-06-01',
    depreciationRate: 12,
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getCategoryLabel(category: AssetCategory): string {
  const map: Record<AssetCategory, string> = {
    hvac: 'HVAC',
    appliance: 'Appliance',
    furniture: 'Furniture',
    infrastructure: 'Infrastructure',
    technology: 'Technology',
  }
  return map[category]
}

function getCategoryColor(category: AssetCategory): { bg: string; text: string; badge: string } {
  const map: Record<AssetCategory, { bg: string; text: string; badge: string }> = {
    hvac: { bg: 'bg-tahoe-blue/10', text: 'text-tahoe-blue', badge: 'tahoe-badge tahoe-badge-blue' },
    appliance: { bg: 'bg-tahoe-orange/10', text: 'text-tahoe-orange', badge: 'tahoe-badge tahoe-badge-orange' },
    furniture: { bg: 'bg-tahoe-purple/10', text: 'text-tahoe-purple', badge: 'tahoe-badge tahoe-badge-purple' },
    infrastructure: { bg: 'bg-tahoe-teal/10', text: 'text-tahoe-teal', badge: 'tahoe-badge tahoe-badge-teal' },
    technology: { bg: 'bg-tahoe-green/10', text: 'text-tahoe-green', badge: 'tahoe-badge tahoe-badge-green' },
  }
  return map[category]
}

function getConditionBadgeClass(condition: AssetCondition): string {
  const map: Record<AssetCondition, string> = {
    excellent: 'tahoe-badge tahoe-badge-green',
    good: 'tahoe-badge tahoe-badge-blue',
    fair: 'tahoe-badge tahoe-badge-orange',
    poor: 'tahoe-badge tahoe-badge-red',
  }
  return map[condition]
}

function getConditionLabel(condition: AssetCondition): string {
  return condition.charAt(0).toUpperCase() + condition.slice(1)
}

function getWarrantyBadgeClass(status: WarrantyStatus): string {
  const map: Record<WarrantyStatus, string> = {
    active: 'tahoe-badge tahoe-badge-green',
    expired: 'tahoe-badge tahoe-badge-red',
    none: 'tahoe-badge',
  }
  return map[status]
}

function getWarrantyLabel(status: WarrantyStatus): string {
  const map: Record<WarrantyStatus, string> = {
    active: 'Active',
    expired: 'Expired',
    none: 'None',
  }
  return map[status]
}

function getHealthScore(asset: AssetRecord): number {
  let score = 0
  // Condition weight
  const conditionScores: Record<AssetCondition, number> = { excellent: 40, good: 30, fair: 15, poor: 5 }
  score += conditionScores[asset.condition]
  // Value retention
  const retention = (asset.currentValue / asset.purchasePrice) * 100
  score += Math.min(30, retention * 0.3)
  // Warranty
  if (asset.warrantyStatus === 'active') score += 20
  else if (asset.warrantyStatus === 'expired') score += 10
  // Maintenance recency
  const daysSince = Math.floor((Date.now() - new Date(asset.lastMaintenance).getTime()) / 86400000)
  if (daysSince < 30) score += 10
  else if (daysSince < 90) score += 5
  return Math.min(100, Math.round(score))
}

function getHealthColor(score: number): string {
  if (score >= 80) return 'text-tahoe-green'
  if (score >= 60) return 'text-tahoe-blue'
  if (score >= 40) return 'text-tahoe-orange'
  return 'text-tahoe-red'
}

function getHealthBg(score: number): string {
  if (score >= 80) return 'bg-tahoe-green/10'
  if (score >= 60) return 'bg-tahoe-blue/10'
  if (score >= 40) return 'bg-tahoe-orange/10'
  return 'bg-tahoe-red/10'
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

export function AssetsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<AssetCategory | 'all'>('all')
  const [conditionFilter, setConditionFilter] = React.useState<AssetCondition | 'all'>('all')

  const filteredAssets = ASSETS.filter((a) => {
    const matchSearch =
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.property.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = categoryFilter === 'all' || a.category === categoryFilter
    const matchCondition = conditionFilter === 'all' || a.condition === conditionFilter
    return matchSearch && matchCategory && matchCondition
  })

  const stats = [
    {
      title: 'Total Assets',
      value: '42',
      subtitle: 'Across all properties',
      icon: Warehouse,
      iconColor: 'text-tahoe-blue',
      iconBg: 'bg-tahoe-blue/10',
    },
    {
      title: 'Total Value',
      value: '$285K',
      subtitle: 'Current market value',
      icon: DollarSign,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Depreciated',
      value: '$48K',
      subtitle: 'Total depreciation YTD',
      icon: TrendingDown,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
    },
    {
      title: 'Maintenance Due',
      value: '3',
      subtitle: 'Overdue or upcoming',
      icon: Wrench,
      iconColor: 'text-tahoe-red',
      iconBg: 'bg-tahoe-red/10',
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
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-blue/10">
            <Warehouse className="size-6 text-tahoe-blue" />
          </div>
          <div>
            <h1 className="tahoe-title">Asset Management</h1>
            <p className="tahoe-caption mt-1">Track property assets and depreciation</p>
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
            Add Asset
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Asset Health Indicators ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-tahoe-blue/10">
                <BarChart3 className="size-4 text-tahoe-blue" />
              </div>
              <div>
                <CardTitle className="tahoe-headline">Asset Health Overview</CardTitle>
                <p className="tahoe-caption mt-0.5">Composite health scores based on condition, value, and maintenance</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ASSETS.map((asset, i) => {
                const health = getHealthScore(asset)
                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.05 }}
                    className="glass-card rounded-xl p-4 tahoe-hover cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm text-foreground truncate mr-2">{asset.name}</p>
                      <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', getHealthBg(health))}>
                        <span className={cn('text-lg font-bold', getHealthColor(health))}>{health}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-2">{asset.property}</p>
                    <div className="relative h-1.5 w-full rounded-full bg-muted/80 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${health}%` }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={cn('absolute inset-y-0 left-0 rounded-full', getHealthBg(health).replace('/10', ''))}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Data Table ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="tahoe-headline">Asset Registry</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={(val) => setCategoryFilter(val as AssetCategory | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[140px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="appliance">Appliance</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={conditionFilter}
                  onValueChange={(val) => setConditionFilter(val as AssetCondition | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[120px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
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
                    <TableHead className="tahoe-overline">Asset</TableHead>
                    <TableHead className="tahoe-overline">Category</TableHead>
                    <TableHead className="tahoe-overline text-right">Purchase Price</TableHead>
                    <TableHead className="tahoe-overline text-right">Current Value</TableHead>
                    <TableHead className="tahoe-overline">Condition</TableHead>
                    <TableHead className="tahoe-overline">Warranty</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredAssets.map((asset, i) => {
                      const categoryColor = getCategoryColor(asset.category)
                      const health = getHealthScore(asset)
                      return (
                        <motion.tr
                          key={asset.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className={cn(
                            'border-b border-border/30 tahoe-transition',
                            asset.condition === 'poor' && 'bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.04]',
                            'hover:bg-muted/30'
                          )}
                        >
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'flex size-9 items-center justify-center rounded-lg text-xs font-bold',
                                getHealthBg(health), getHealthColor(health)
                              )}>
                                {health}
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{asset.name}</p>
                                <p className="text-[11px] text-muted-foreground">{asset.property} · {asset.purchaseDate}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={categoryColor.badge}>{getCategoryLabel(asset.category)}</span>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <span className="text-sm text-foreground">${asset.purchasePrice.toLocaleString()}</span>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <span className="text-sm font-medium text-foreground">${asset.currentValue.toLocaleString()}</span>
                            <p className="text-[10px] text-tahoe-red">-{Math.round(((asset.purchasePrice - asset.currentValue) / asset.purchasePrice) * 100)}% dep.</p>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={getConditionBadgeClass(asset.condition)}>{getConditionLabel(asset.condition)}</span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={getWarrantyBadgeClass(asset.warrantyStatus)}>{getWarrantyLabel(asset.warrantyStatus)}</span>
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
                {filteredAssets.map((asset, i) => {
                  const categoryColor = getCategoryColor(asset.category)
                  const health = getHealthScore(asset)
                  return (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className={cn(
                        'glass-card rounded-2xl p-4 space-y-3 tahoe-transition',
                        asset.condition === 'poor' && 'ring-1 ring-tahoe-red/20'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'flex size-9 items-center justify-center rounded-lg text-xs font-bold',
                            getHealthBg(health), getHealthColor(health)
                          )}>
                            {health}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{asset.name}</p>
                            <p className="text-[11px] text-muted-foreground">{asset.property}</p>
                          </div>
                        </div>
                        <span className={getConditionBadgeClass(asset.condition)}>{getConditionLabel(asset.condition)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={categoryColor.badge}>{getCategoryLabel(asset.category)}</span>
                        <span className={getWarrantyBadgeClass(asset.warrantyStatus)}>{getWarrantyLabel(asset.warrantyStatus)}</span>
                        <span className="text-[11px] font-medium text-foreground ml-auto">
                          ${asset.currentValue.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {filteredAssets.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-blue/10 mb-4">
                  <Warehouse className="size-8 text-tahoe-blue/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No assets found</h3>
                <p className="tahoe-caption mt-1 max-w-sm">
                  Try adjusting your search or filter criteria.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
