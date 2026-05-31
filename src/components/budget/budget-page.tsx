'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PiggyBank,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
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

type BudgetCategory = 'operating' | 'capital' | 'maintenance'
type BudgetStatus = 'draft' | 'active' | 'over_budget' | 'closed'

interface BudgetItem {
  id: string
  name: string
  category: BudgetCategory
  amount: number
  spent: number
  remaining: number
  period: string
  status: BudgetStatus
  property: string
  variance: number
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const BUDGET_ITEMS: BudgetItem[] = [
  {
    id: 'BUD-001',
    name: 'Operations Fund',
    category: 'operating',
    amount: 180000,
    spent: 124000,
    remaining: 56000,
    period: '2025 H1',
    status: 'active',
    property: 'All Properties',
    variance: -2.1,
  },
  {
    id: 'BUD-002',
    name: 'Capital Improvements',
    category: 'capital',
    amount: 120000,
    spent: 98000,
    remaining: 22000,
    period: '2025 H1',
    status: 'over_budget',
    property: 'Skyline Tower',
    variance: -8.4,
  },
  {
    id: 'BUD-003',
    name: 'Preventive Maintenance',
    category: 'maintenance',
    amount: 85000,
    spent: 42000,
    remaining: 43000,
    period: '2025 H1',
    status: 'active',
    property: 'Harbor View Residences',
    variance: 3.2,
  },
  {
    id: 'BUD-004',
    name: 'Marketing & Leasing',
    category: 'operating',
    amount: 45000,
    spent: 28500,
    remaining: 16500,
    period: '2025 H1',
    status: 'active',
    property: 'All Properties',
    variance: -0.8,
  },
  {
    id: 'BUD-005',
    name: 'Emergency Repairs',
    category: 'maintenance',
    amount: 30000,
    spent: 12500,
    remaining: 17500,
    period: '2025 H1',
    status: 'active',
    property: 'Greenfield Gardens',
    variance: 1.5,
  },
  {
    id: 'BUD-006',
    name: 'Technology Upgrades',
    category: 'capital',
    amount: 25000,
    spent: 7000,
    remaining: 18000,
    period: '2025 H1',
    status: 'draft',
    property: 'Metro Commercial Hub',
    variance: 0,
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getCategoryLabel(category: BudgetCategory): string {
  const map: Record<BudgetCategory, string> = {
    operating: 'Operating',
    capital: 'Capital',
    maintenance: 'Maintenance',
  }
  return map[category]
}

function getCategoryColor(category: BudgetCategory): { bg: string; text: string; badge: string } {
  const map: Record<BudgetCategory, { bg: string; text: string; badge: string }> = {
    operating: { bg: 'bg-tahoe-blue/10', text: 'text-tahoe-blue', badge: 'tahoe-badge tahoe-badge-blue' },
    capital: { bg: 'bg-tahoe-teal/10', text: 'text-tahoe-teal', badge: 'tahoe-badge tahoe-badge-teal' },
    maintenance: { bg: 'bg-tahoe-orange/10', text: 'text-tahoe-orange', badge: 'tahoe-badge tahoe-badge-orange' },
  }
  return map[category]
}

function getStatusBadgeClass(status: BudgetStatus): string {
  const map: Record<BudgetStatus, string> = {
    draft: 'tahoe-badge tahoe-badge-purple',
    active: 'tahoe-badge tahoe-badge-green',
    over_budget: 'tahoe-badge tahoe-badge-red',
    closed: 'tahoe-badge tahoe-badge-blue',
  }
  return map[status]
}

function getStatusIcon(status: BudgetStatus) {
  const map: Record<BudgetStatus, React.ReactNode> = {
    draft: <FileText className="size-3.5 text-tahoe-purple" />,
    active: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    over_budget: <AlertTriangle className="size-3.5 text-tahoe-red" />,
    closed: <Clock className="size-3.5 text-tahoe-blue" />,
  }
  return map[status]
}

function getStatusLabel(status: BudgetStatus): string {
  const map: Record<BudgetStatus, string> = {
    draft: 'Draft',
    active: 'Active',
    over_budget: 'Over Budget',
    closed: 'Closed',
  }
  return map[status]
}

function getVarianceColor(variance: number): string {
  if (variance > 0) return 'text-tahoe-green'
  if (variance < -5) return 'text-tahoe-red'
  if (variance < 0) return 'text-tahoe-orange'
  return 'text-muted-foreground'
}

function formatCurrency(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount.toLocaleString()}`
}

function getProgressColor(percent: number): string {
  if (percent >= 95) return 'bg-tahoe-red'
  if (percent >= 80) return 'bg-tahoe-orange'
  if (percent >= 50) return 'bg-tahoe-blue'
  return 'bg-tahoe-green'
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

export function BudgetPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<BudgetCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = React.useState<BudgetStatus | 'all'>('all')

  const filteredItems = BUDGET_ITEMS.filter((b) => {
    const matchSearch =
      !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.property.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = categoryFilter === 'all' || b.category === categoryFilter
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchCategory && matchStatus
  })

  const stats = [
    {
      title: 'Annual Budget',
      value: '$485K',
      subtitle: 'Total allocated for 2025',
      icon: PiggyBank,
      iconColor: 'text-tahoe-teal',
      iconBg: 'bg-tahoe-teal/10',
    },
    {
      title: 'Spent YTD',
      value: '$312K',
      subtitle: '64.3% of annual budget',
      icon: DollarSign,
      iconColor: 'text-tahoe-blue',
      iconBg: 'bg-tahoe-blue/10',
    },
    {
      title: 'Remaining',
      value: '$173K',
      subtitle: '35.7% available',
      icon: TrendingUp,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Variance',
      value: '-3.2%',
      subtitle: 'Slightly over projections',
      icon: TrendingDown,
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
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-teal/10">
            <PiggyBank className="size-6 text-tahoe-teal" />
          </div>
          <div>
            <h1 className="tahoe-title">Budget & Forecasting</h1>
            <p className="tahoe-caption mt-1">Plan budgets and track spending</p>
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
            Create Budget
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Budget vs Actual Progress ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-tahoe-teal/10">
                <BarChart3 className="size-4 text-tahoe-teal" />
              </div>
              <div>
                <CardTitle className="tahoe-headline">Budget vs Actual</CardTitle>
                <p className="tahoe-caption mt-0.5">Spending progress against allocated budget</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {BUDGET_ITEMS.filter((b) => b.status !== 'draft').map((item, i) => {
                const categoryColor = getCategoryColor(item.category)
                const percent = Math.round((item.spent / item.amount) * 100)
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                    className="rounded-xl bg-muted/30 p-4 tahoe-transition hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={categoryColor.badge}>{getCategoryLabel(item.category)}</span>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          ${item.spent.toLocaleString()} / ${item.amount.toLocaleString()}
                        </span>
                        <span className={cn(
                          'text-sm font-bold',
                          percent >= 95 ? 'text-tahoe-red' : percent >= 80 ? 'text-tahoe-orange' : 'text-foreground'
                        )}>
                          {percent}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2.5 w-full rounded-full bg-muted/80 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percent, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={cn('absolute inset-y-0 left-0 rounded-full', getProgressColor(percent))}
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
                <CardTitle className="tahoe-headline">Budget Items</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search budgets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={(val) => setCategoryFilter(val as BudgetCategory | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[130px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="operating">Operating</SelectItem>
                    <SelectItem value="capital">Capital</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as BudgetStatus | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[130px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="over_budget">Over Budget</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
                    <TableHead className="tahoe-overline">Budget Item</TableHead>
                    <TableHead className="tahoe-overline">Category</TableHead>
                    <TableHead className="tahoe-overline text-right">Allocated</TableHead>
                    <TableHead className="tahoe-overline text-right">Spent</TableHead>
                    <TableHead className="tahoe-overline text-right">Remaining</TableHead>
                    <TableHead className="tahoe-overline">Variance</TableHead>
                    <TableHead className="tahoe-overline">Status</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredItems.map((item, i) => {
                      const categoryColor = getCategoryColor(item.category)
                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className={cn(
                            'border-b border-border/30 tahoe-transition',
                            item.status === 'over_budget' && 'bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.04]',
                            'hover:bg-muted/30'
                          )}
                        >
                          <TableCell className="py-3.5">
                            <div>
                              <p className="font-medium text-foreground text-sm">{item.name}</p>
                              <p className="text-[11px] text-muted-foreground">{item.property} · {item.period}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={categoryColor.badge}>{getCategoryLabel(item.category)}</span>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <span className="font-medium text-foreground">${item.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <span className="text-foreground">${item.spent.toLocaleString()}</span>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <span className={cn(
                              'font-medium',
                              item.remaining < 0 ? 'text-tahoe-red' : 'text-tahoe-green'
                            )}>
                              ${item.remaining.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={cn('text-sm font-medium', getVarianceColor(item.variance))}>
                              {item.variance > 0 ? '+' : ''}{item.variance}%
                            </span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(item.status)}
                              <span className={getStatusBadgeClass(item.status)}>{getStatusLabel(item.status)}</span>
                            </div>
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
                {filteredItems.map((item, i) => {
                  const categoryColor = getCategoryColor(item.category)
                  const percent = Math.round((item.spent / item.amount) * 100)
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className={cn(
                        'glass-card rounded-2xl p-4 space-y-3 tahoe-transition',
                        item.status === 'over_budget' && 'ring-1 ring-tahoe-red/20'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">{item.property}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(item.status)}
                          <span className={getStatusBadgeClass(item.status)}>{getStatusLabel(item.status)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={categoryColor.badge}>{getCategoryLabel(item.category)}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="relative h-1.5 flex-1 rounded-full bg-muted/80 overflow-hidden">
                            <div
                              className={cn('absolute inset-y-0 left-0 rounded-full', getProgressColor(percent))}
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium shrink-0">{percent}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Spent: ${item.spent.toLocaleString()}</span>
                        <span className={cn('font-medium', getVarianceColor(item.variance))}>
                          Variance: {item.variance > 0 ? '+' : ''}{item.variance}%
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-teal/10 mb-4">
                  <PiggyBank className="size-8 text-tahoe-teal/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No budget items found</h3>
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
