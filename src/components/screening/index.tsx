'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  User,
  TrendingUp,
  FileText,
  Loader2,
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

type ScreeningType = 'credit' | 'criminal' | 'eviction' | 'income'
type ScreeningStatus = 'pending' | 'in_progress' | 'completed' | 'flagged'

interface ScreeningRecord {
  id: string
  applicant: string
  email: string
  phone: string
  type: ScreeningType
  status: ScreeningStatus
  score: number | null
  date: string
  property: string
  unit: string
  requestedBy: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const SCREENINGS: ScreeningRecord[] = [
  {
    id: 'SC-2024-001',
    applicant: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '(415) 555-0142',
    type: 'credit',
    status: 'completed',
    score: 742,
    date: '2025-06-10',
    property: 'Skyline Tower',
    unit: '4B',
    requestedBy: 'Lisa Park',
  },
  {
    id: 'SC-2024-002',
    applicant: 'James Rodriguez',
    email: 'j.rodriguez@email.com',
    phone: '(415) 555-0198',
    type: 'criminal',
    status: 'in_progress',
    score: null,
    date: '2025-06-12',
    property: 'Harbor View Residences',
    unit: '12A',
    requestedBy: 'Lisa Park',
  },
  {
    id: 'SC-2024-003',
    applicant: 'Emily Chen',
    email: 'e.chen@email.com',
    phone: '(650) 555-0231',
    type: 'eviction',
    status: 'pending',
    score: null,
    date: '2025-06-14',
    property: 'Greenfield Gardens',
    unit: '7C',
    requestedBy: 'Mark Thompson',
  },
  {
    id: 'SC-2024-004',
    applicant: 'Michael Brown',
    email: 'mbrown@email.com',
    phone: '(408) 555-0176',
    type: 'income',
    status: 'flagged',
    score: null,
    date: '2025-06-08',
    property: 'Oakwood Estates',
    unit: '3A',
    requestedBy: 'Lisa Park',
  },
  {
    id: 'SC-2024-005',
    applicant: 'Jessica Taylor',
    email: 'j.taylor@email.com',
    phone: '(510) 555-0289',
    type: 'credit',
    status: 'completed',
    score: 580,
    date: '2025-06-09',
    property: 'Metro Commercial Hub',
    unit: '101',
    requestedBy: 'Mark Thompson',
  },
  {
    id: 'SC-2024-006',
    applicant: 'David Kim',
    email: 'd.kim@email.com',
    phone: '(415) 555-0345',
    type: 'criminal',
    status: 'completed',
    score: null,
    date: '2025-06-07',
    property: 'Skyline Tower',
    unit: '8F',
    requestedBy: 'Lisa Park',
  },
  {
    id: 'SC-2024-007',
    applicant: 'Amanda White',
    email: 'a.white@email.com',
    phone: '(650) 555-0412',
    type: 'credit',
    status: 'in_progress',
    score: null,
    date: '2025-06-13',
    property: 'Harbor View Residences',
    unit: '5C',
    requestedBy: 'Mark Thompson',
  },
  {
    id: 'SC-2024-008',
    applicant: 'Robert Garcia',
    email: 'r.garcia@email.com',
    phone: '(408) 555-0156',
    type: 'eviction',
    status: 'flagged',
    score: null,
    date: '2025-06-06',
    property: 'Greenfield Gardens',
    unit: '2B',
    requestedBy: 'Lisa Park',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getTypeLabel(type: ScreeningType): string {
  const map: Record<ScreeningType, string> = {
    credit: 'Credit',
    criminal: 'Criminal',
    eviction: 'Eviction',
    income: 'Income',
  }
  return map[type]
}

function getTypeIcon(type: ScreeningType) {
  const map: Record<ScreeningType, React.ReactNode> = {
    credit: <TrendingUp className="size-3.5" />,
    criminal: <ShieldCheck className="size-3.5" />,
    eviction: <FileText className="size-3.5" />,
    income: <User className="size-3.5" />,
  }
  return map[type]
}

function getTypeColor(type: ScreeningType): { bg: string; text: string; badge: string } {
  const map: Record<ScreeningType, { bg: string; text: string; badge: string }> = {
    credit: { bg: 'bg-tahoe-blue/10', text: 'text-tahoe-blue', badge: 'tahoe-badge tahoe-badge-blue' },
    criminal: { bg: 'bg-tahoe-purple/10', text: 'text-tahoe-purple', badge: 'tahoe-badge tahoe-badge-purple' },
    eviction: { bg: 'bg-tahoe-orange/10', text: 'text-tahoe-orange', badge: 'tahoe-badge tahoe-badge-orange' },
    income: { bg: 'bg-tahoe-green/10', text: 'text-tahoe-green', badge: 'tahoe-badge tahoe-badge-green' },
  }
  return map[type]
}

function getStatusBadgeClass(status: ScreeningStatus): string {
  const map: Record<ScreeningStatus, string> = {
    pending: 'tahoe-badge tahoe-badge-orange',
    in_progress: 'tahoe-badge tahoe-badge-blue',
    completed: 'tahoe-badge tahoe-badge-green',
    flagged: 'tahoe-badge tahoe-badge-red',
  }
  return map[status]
}

function getStatusIcon(status: ScreeningStatus) {
  const map: Record<ScreeningStatus, React.ReactNode> = {
    pending: <Clock className="size-3.5 text-tahoe-orange" />,
    in_progress: <Loader2 className="size-3.5 text-tahoe-blue animate-spin" />,
    completed: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    flagged: <AlertTriangle className="size-3.5 text-tahoe-red" />,
  }
  return map[status]
}

function getStatusLabel(status: ScreeningStatus): string {
  const map: Record<ScreeningStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    flagged: 'Flagged',
  }
  return map[status]
}

function getScoreColor(score: number): string {
  if (score >= 750) return 'text-tahoe-green'
  if (score >= 650) return 'text-tahoe-blue'
  if (score >= 580) return 'text-tahoe-orange'
  return 'text-tahoe-red'
}

function getScoreBadge(score: number): string {
  if (score >= 750) return 'Excellent'
  if (score >= 650) return 'Good'
  if (score >= 580) return 'Fair'
  return 'Poor'
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

export function TenantScreeningPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<ScreeningType | 'all'>('all')
  const [statusFilter, setStatusFilter] = React.useState<ScreeningStatus | 'all'>('all')

  const filteredScreenings = SCREENINGS.filter((s) => {
    const matchSearch =
      !searchQuery ||
      s.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = typeFilter === 'all' || s.type === typeFilter
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const stats = [
    {
      title: 'Pending',
      value: '12',
      subtitle: 'Awaiting processing',
      icon: Clock,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
    },
    {
      title: 'Approved',
      value: '284',
      subtitle: 'Successfully cleared',
      icon: CheckCircle2,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Flagged',
      value: '8',
      subtitle: 'Require attention',
      icon: AlertTriangle,
      iconColor: 'text-tahoe-red',
      iconBg: 'bg-tahoe-red/10',
    },
    {
      title: 'Completion Rate',
      value: '94.2%',
      subtitle: 'Overall success rate',
      icon: ShieldCheck,
      iconColor: 'text-tahoe-blue',
      iconBg: 'bg-tahoe-blue/10',
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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-blue/10">
            <ShieldCheck className="size-6 text-tahoe-blue" />
          </div>
          <div>
            <h1 className="tahoe-title">Tenant Screening</h1>
            <p className="tahoe-caption mt-1">Background checks, credit reports & eviction history</p>
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
            New Screening
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
                <CardTitle className="tahoe-headline">Screening Records</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredScreenings.length} record{filteredScreenings.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search applicants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                {/* Type Filter */}
                <Select
                  value={typeFilter}
                  onValueChange={(val) => setTypeFilter(val as ScreeningType | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[130px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="criminal">Criminal</SelectItem>
                    <SelectItem value="eviction">Eviction</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
                {/* Status Filter */}
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as ScreeningStatus | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[140px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
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
                    <TableHead className="tahoe-overline">Applicant</TableHead>
                    <TableHead className="tahoe-overline">Type</TableHead>
                    <TableHead className="tahoe-overline text-center">Status</TableHead>
                    <TableHead className="tahoe-overline text-right">Score</TableHead>
                    <TableHead className="tahoe-overline">Date</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredScreenings.map((screening, i) => {
                      const typeColor = getTypeColor(screening.type)
                      return (
                        <motion.tr
                          key={screening.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className={cn(
                            'border-b border-border/30 tahoe-transition',
                            screening.status === 'flagged' && 'bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.04]',
                            'hover:bg-muted/30'
                          )}
                        >
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'flex size-9 items-center justify-center rounded-full text-xs font-semibold',
                                typeColor.bg, typeColor.text
                              )}>
                                {screening.applicant.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{screening.applicant}</p>
                                <p className="text-[11px] text-muted-foreground">{screening.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className={cn('flex size-5 items-center justify-center rounded-md', typeColor.bg)}>
                                {getTypeIcon(screening.type)}
                              </span>
                              <span className={typeColor.badge}>{getTypeLabel(screening.type)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {getStatusIcon(screening.status)}
                              <span className={getStatusBadgeClass(screening.status)}>
                                {getStatusLabel(screening.status)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            {screening.score ? (
                              <div className="flex flex-col items-end">
                                <span className={cn('font-bold text-lg leading-tight', getScoreColor(screening.score))}>
                                  {screening.score}
                                </span>
                                <span className={cn('text-[10px] font-medium', getScoreColor(screening.score))}>
                                  {getScoreBadge(screening.score)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/50">—</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className="text-muted-foreground text-sm">{screening.date}</span>
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
                {filteredScreenings.map((screening, i) => {
                  const typeColor = getTypeColor(screening.type)
                  return (
                    <motion.div
                      key={screening.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className={cn(
                        'glass-card rounded-2xl p-4 space-y-3 tahoe-transition',
                        screening.status === 'flagged' && 'ring-1 ring-tahoe-red/20'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'flex size-9 items-center justify-center rounded-full text-xs font-semibold',
                            typeColor.bg, typeColor.text
                          )}>
                            {screening.applicant.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{screening.applicant}</p>
                            <p className="text-[11px] text-muted-foreground">{screening.property} · {screening.unit}</p>
                          </div>
                        </div>
                        {screening.score ? (
                          <span className={cn('font-bold text-lg', getScoreColor(screening.score))}>
                            {screening.score}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={typeColor.badge}>
                          {getTypeLabel(screening.type)}
                        </span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(screening.status)}
                          <span className={getStatusBadgeClass(screening.status)}>
                            {getStatusLabel(screening.status)}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground ml-auto">{screening.date}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {filteredScreenings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-blue/10 mb-4">
                  <ShieldCheck className="size-8 text-tahoe-blue/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No screenings found</h3>
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
