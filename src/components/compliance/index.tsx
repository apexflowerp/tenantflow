'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scale,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  RefreshCw,
  Shield,
  Flame,
  Heart,
  Building2,
  ArrowRight,
  CalendarClock,
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

type ComplianceCategory = 'fair_housing' | 'building_code' | 'fire_safety' | 'health'
type ComplianceStatus = 'compliant' | 'violation' | 'pending' | 'expired'

interface ComplianceRule {
  id: string
  rule: string
  category: ComplianceCategory
  status: ComplianceStatus
  lastCheck: string
  nextDue: string
  property: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  notes: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const RULES: ComplianceRule[] = [
  {
    id: 'CR-001',
    rule: 'Fair Housing Act Compliance',
    category: 'fair_housing',
    status: 'compliant',
    lastCheck: '2025-06-01',
    nextDue: '2025-09-01',
    property: 'All Properties',
    severity: 'high',
    notes: 'Annual review completed. No violations found across all 6 properties.',
  },
  {
    id: 'CR-002',
    rule: 'Fire Alarm System Certification',
    category: 'fire_safety',
    status: 'violation',
    lastCheck: '2025-04-20',
    nextDue: '2025-05-20',
    property: 'Metro Commercial Hub',
    severity: 'critical',
    notes: 'Certification expired. Fire alarm panel requires inspection and recertification by licensed technician.',
  },
  {
    id: 'CR-003',
    rule: 'ADA Accessibility Standards',
    category: 'fair_housing',
    status: 'compliant',
    lastCheck: '2025-05-15',
    nextDue: '2025-08-15',
    property: 'Skyline Tower',
    severity: 'high',
    notes: 'All common areas and pathways meet current ADA requirements. Ramp gradients verified.',
  },
  {
    id: 'CR-004',
    rule: 'Lead Paint Disclosure',
    category: 'health',
    status: 'pending',
    lastCheck: '2025-03-10',
    nextDue: '2025-06-30',
    property: 'Greenfield Gardens',
    severity: 'medium',
    notes: 'Lead paint inspection scheduled for June 28. All pre-1978 units require EPA disclosure forms.',
  },
  {
    id: 'CR-005',
    rule: 'Structural Integrity Inspection',
    category: 'building_code',
    status: 'compliant',
    lastCheck: '2025-06-08',
    nextDue: '2025-12-08',
    property: 'Harbor View Residences',
    severity: 'critical',
    notes: 'Bi-annual structural inspection passed. Seismic retrofit verification complete.',
  },
  {
    id: 'CR-006',
    rule: 'Carbon Monoxide Detector Compliance',
    category: 'fire_safety',
    status: 'expired',
    lastCheck: '2025-01-15',
    nextDue: '2025-04-15',
    property: 'Oakwood Estates',
    severity: 'critical',
    notes: 'CO detector batteries expired in units 1A, 3B, 5C. Immediate replacement required by state law.',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getCategoryLabel(cat: ComplianceCategory): string {
  const map: Record<ComplianceCategory, string> = {
    fair_housing: 'Fair Housing',
    building_code: 'Building Code',
    fire_safety: 'Fire Safety',
    health: 'Health',
  }
  return map[cat]
}

function getCategoryIcon(cat: ComplianceCategory) {
  const map: Record<ComplianceCategory, React.ReactNode> = {
    fair_housing: <Scale className="size-3.5" />,
    building_code: <Building2 className="size-3.5" />,
    fire_safety: <Flame className="size-3.5" />,
    health: <Heart className="size-3.5" />,
  }
  return map[cat]
}

function getCategoryColor(cat: ComplianceCategory): { bg: string; text: string; badge: string } {
  const map: Record<ComplianceCategory, { bg: string; text: string; badge: string }> = {
    fair_housing: { bg: 'bg-tahoe-purple/10', text: 'text-tahoe-purple', badge: 'tahoe-badge tahoe-badge-purple' },
    building_code: { bg: 'bg-tahoe-blue/10', text: 'text-tahoe-blue', badge: 'tahoe-badge tahoe-badge-blue' },
    fire_safety: { bg: 'bg-tahoe-orange/10', text: 'text-tahoe-orange', badge: 'tahoe-badge tahoe-badge-orange' },
    health: { bg: 'bg-tahoe-green/10', text: 'text-tahoe-green', badge: 'tahoe-badge tahoe-badge-green' },
  }
  return map[cat]
}

function getStatusBadgeClass(status: ComplianceStatus): string {
  const map: Record<ComplianceStatus, string> = {
    compliant: 'tahoe-badge tahoe-badge-green',
    violation: 'tahoe-badge tahoe-badge-red',
    pending: 'tahoe-badge tahoe-badge-orange',
    expired: 'tahoe-badge tahoe-badge-red',
  }
  return map[status]
}

function getStatusIcon(status: ComplianceStatus) {
  const map: Record<ComplianceStatus, React.ReactNode> = {
    compliant: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    violation: <XCircle className="size-3.5 text-tahoe-red" />,
    pending: <Clock className="size-3.5 text-tahoe-orange" />,
    expired: <AlertTriangle className="size-3.5 text-tahoe-red" />,
  }
  return map[status]
}

function getStatusLabel(status: ComplianceStatus): string {
  const map: Record<ComplianceStatus, string> = {
    compliant: 'Compliant',
    violation: 'Violation',
    pending: 'Pending',
    expired: 'Expired',
  }
  return map[status]
}

function getSeverityDot(severity: string): string {
  const map: Record<string, string> = {
    low: 'bg-tahoe-green',
    medium: 'bg-tahoe-orange',
    high: 'bg-tahoe-red',
    critical: 'bg-tahoe-red animate-pulse',
  }
  return map[severity] ?? 'bg-muted-foreground'
}

function getSeverityLabel(severity: string): { text: string; badge: string } {
  const map: Record<string, { text: string; badge: string }> = {
    low: { text: 'text-tahoe-green', badge: 'tahoe-badge tahoe-badge-green' },
    medium: { text: 'text-tahoe-orange', badge: 'tahoe-badge tahoe-badge-orange' },
    high: { text: 'text-tahoe-red', badge: 'tahoe-badge tahoe-badge-red' },
    critical: { text: 'text-tahoe-red', badge: 'tahoe-badge tahoe-badge-red' },
  }
  return map[severity] ?? { text: 'text-muted-foreground', badge: 'tahoe-badge' }
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

export function CompliancePage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<ComplianceCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = React.useState<ComplianceStatus | 'all'>('all')

  const filteredRules = RULES.filter((r) => {
    const matchSearch =
      !searchQuery ||
      r.rule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = categoryFilter === 'all' || r.category === categoryFilter
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  const stats = [
    {
      title: 'Active Rules',
      value: '24',
      subtitle: 'Total regulations tracked',
      icon: Scale,
      iconColor: 'text-tahoe-purple',
      iconBg: 'bg-tahoe-purple/10',
    },
    {
      title: 'Compliant',
      value: '21',
      subtitle: 'Rules in good standing',
      icon: CheckCircle2,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Violations',
      value: '3',
      subtitle: 'Require immediate action',
      icon: XCircle,
      iconColor: 'text-tahoe-red',
      iconBg: 'bg-tahoe-red/10',
    },
    {
      title: 'Upcoming Deadlines',
      value: '5',
      subtitle: 'Pending review items',
      icon: CalendarClock,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
    },
  ]

  const complianceScore = Math.round((21 / 24) * 100)

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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-purple/10">
            <Scale className="size-6 text-tahoe-purple" />
          </div>
          <div>
            <h1 className="tahoe-title">Compliance</h1>
            <p className="tahoe-caption mt-1">Legal & regulatory compliance tracking</p>
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
            Add Rule
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Compliance Score Gauge ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative flex items-center justify-center shrink-0">
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="currentColor"
                    className="text-muted/30"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="currentColor"
                    className={complianceScore >= 80 ? 'text-tahoe-green' : complianceScore >= 60 ? 'text-tahoe-orange' : 'text-tahoe-red'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 314.16' }}
                    animate={{ strokeDasharray: `${(complianceScore / 100) * 314.16} 314.16` }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <motion.span
                    className="text-2xl font-bold text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {complianceScore}%
                  </motion.span>
                  <span className="tahoe-overline">Score</span>
                </div>
              </div>
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <h3 className="tahoe-headline">Compliance Score</h3>
                <p className="tahoe-body text-muted-foreground">
                  21 of 24 rules are compliant. 3 violations need immediate attention to maintain regulatory standards.
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <span className="tahoe-badge tahoe-badge-green">21 Compliant</span>
                  <span className="tahoe-badge tahoe-badge-red">3 Violations</span>
                  <span className="tahoe-badge tahoe-badge-orange">5 Pending</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Data Table ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="tahoe-headline">Compliance Rules</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredRules.length} rule{filteredRules.length !== 1 ? 's' : ''} tracked
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search rules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                {/* Category Filter */}
                <Select
                  value={categoryFilter}
                  onValueChange={(val) => setCategoryFilter(val as ComplianceCategory | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[150px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fair_housing">Fair Housing</SelectItem>
                    <SelectItem value="building_code">Building Code</SelectItem>
                    <SelectItem value="fire_safety">Fire Safety</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                  </SelectContent>
                </Select>
                {/* Status Filter */}
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as ComplianceStatus | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[140px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="violation">Violation</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
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
                    <TableHead className="tahoe-overline">Rule</TableHead>
                    <TableHead className="tahoe-overline">Category</TableHead>
                    <TableHead className="tahoe-overline text-center">Status</TableHead>
                    <TableHead className="tahoe-overline">Last Check</TableHead>
                    <TableHead className="tahoe-overline">Next Due</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredRules.map((rule, i) => {
                      const catColor = getCategoryColor(rule.category)
                      const sevStyle = getSeverityLabel(rule.severity)
                      return (
                        <motion.tr
                          key={rule.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.04 }}
                          className={cn(
                            'border-b border-border/30 tahoe-transition',
                            (rule.status === 'violation' || rule.status === 'expired') && 'bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.04]',
                            'hover:bg-muted/30'
                          )}
                        >
                          <TableCell className="py-3.5">
                            <div className="max-w-[280px]">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={cn('size-2 rounded-full shrink-0', getSeverityDot(rule.severity))} />
                                <p className="font-medium text-foreground text-sm truncate">{rule.rule}</p>
                              </div>
                              <p className="text-[11px] text-muted-foreground pl-4 truncate">{rule.property}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className={cn('flex size-5 items-center justify-center rounded-md', catColor.bg)}>
                                {getCategoryIcon(rule.category)}
                              </span>
                              <span className={catColor.badge}>{getCategoryLabel(rule.category)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {getStatusIcon(rule.status)}
                              <span className={getStatusBadgeClass(rule.status)}>
                                {getStatusLabel(rule.status)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className="text-sm text-muted-foreground">{rule.lastCheck}</span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={cn(
                              'text-sm',
                              (rule.status === 'expired' || rule.status === 'violation') ? 'text-tahoe-red font-medium' : 'text-muted-foreground'
                            )}>
                              {rule.nextDue}
                            </span>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition">
                                <ArrowRight className="size-3.5 text-muted-foreground" />
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
                {filteredRules.map((rule, i) => {
                  const catColor = getCategoryColor(rule.category)
                  return (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className={cn(
                        'glass-card rounded-2xl p-4 space-y-3 tahoe-transition',
                        (rule.status === 'violation' || rule.status === 'expired') && 'ring-1 ring-tahoe-red/20'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={cn('size-2 rounded-full shrink-0', getSeverityDot(rule.severity))} />
                            <p className="font-medium text-sm text-foreground truncate">{rule.rule}</p>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{rule.property}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {getStatusIcon(rule.status)}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={catColor.badge}>{getCategoryLabel(rule.category)}</span>
                        <span className={getStatusBadgeClass(rule.status)}>{getStatusLabel(rule.status)}</span>
                        <span className={cn(
                          'text-[11px] ml-auto',
                          (rule.status === 'expired' || rule.status === 'violation') ? 'text-tahoe-red font-medium' : 'text-muted-foreground'
                        )}>
                          Due {rule.nextDue}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {filteredRules.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-purple/10 mb-4">
                  <Scale className="size-8 text-tahoe-purple/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No rules found</h3>
                <p className="tahoe-caption mt-1 max-w-sm">
                  Try adjusting your search or filter criteria to find what you&apos;re looking for.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
