'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogIn,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  ArrowRight,
  ArrowRightLeft,
  Calendar,
  ClipboardCheck,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
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

type MoveType = 'move_in' | 'move_out'
type MoveStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

interface MoveRecord {
  id: string
  tenantName: string
  property: string
  unit: string
  type: MoveType
  scheduledDate: string
  status: MoveStatus
  checklistTotal: number
  checklistComplete: number
  contactPhone: string
  notes: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const MOVE_RECORDS: MoveRecord[] = [
  {
    id: 'MV-001',
    tenantName: 'Sarah Mitchell',
    property: 'Skyline Tower',
    unit: '4B',
    type: 'move_in',
    scheduledDate: '2025-06-18',
    status: 'scheduled',
    checklistTotal: 12,
    checklistComplete: 8,
    contactPhone: '(415) 555-0142',
    notes: 'Furnished unit — verify inventory',
  },
  {
    id: 'MV-002',
    tenantName: 'James Rodriguez',
    property: 'Harbor View Residences',
    unit: '12A',
    type: 'move_out',
    scheduledDate: '2025-06-20',
    status: 'in_progress',
    checklistTotal: 15,
    checklistComplete: 9,
    contactPhone: '(415) 555-0198',
    notes: 'Security deposit refund pending',
  },
  {
    id: 'MV-003',
    tenantName: 'Emily Chen',
    property: 'Greenfield Gardens',
    unit: '7C',
    type: 'move_in',
    scheduledDate: '2025-06-22',
    status: 'scheduled',
    checklistTotal: 12,
    checklistComplete: 3,
    contactPhone: '(650) 555-0231',
    notes: 'Pet deposit required',
  },
  {
    id: 'MV-004',
    tenantName: 'Michael Brown',
    property: 'Oakwood Estates',
    unit: '3A',
    type: 'move_out',
    scheduledDate: '2025-06-15',
    status: 'completed',
    checklistTotal: 15,
    checklistComplete: 15,
    contactPhone: '(408) 555-0176',
    notes: '',
  },
  {
    id: 'MV-005',
    tenantName: 'Jessica Taylor',
    property: 'Metro Commercial Hub',
    unit: '101',
    type: 'move_in',
    scheduledDate: '2025-06-25',
    status: 'scheduled',
    checklistTotal: 12,
    checklistComplete: 1,
    contactPhone: '(510) 555-0289',
    notes: 'Commercial lease — verify insurance',
  },
  {
    id: 'MV-006',
    tenantName: 'David Kim',
    property: 'Riverside Lofts',
    unit: '2D',
    type: 'move_out',
    scheduledDate: '2025-06-10',
    status: 'cancelled',
    checklistTotal: 15,
    checklistComplete: 6,
    contactPhone: '(415) 555-0345',
    notes: 'Lease renewed — move-out cancelled',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getStatusBadgeClass(status: MoveStatus): string {
  const map: Record<MoveStatus, string> = {
    scheduled: 'tahoe-badge tahoe-badge-blue',
    in_progress: 'tahoe-badge tahoe-badge-orange',
    completed: 'tahoe-badge tahoe-badge-green',
    cancelled: 'tahoe-badge tahoe-badge-red',
  }
  return map[status]
}

function getStatusLabel(status: MoveStatus): string {
  const map: Record<MoveStatus, string> = {
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return map[status]
}

function getStatusIcon(status: MoveStatus) {
  const map: Record<MoveStatus, React.ReactNode> = {
    scheduled: <Calendar className="size-3.5 text-tahoe-blue" />,
    in_progress: <Clock className="size-3.5 text-tahoe-orange" />,
    completed: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    cancelled: <XCircle className="size-3.5 text-tahoe-red" />,
  }
  return map[status]
}

function getTypeLabel(type: MoveType): string {
  return type === 'move_in' ? 'Move-In' : 'Move-Out'
}

function getTypeColor(type: MoveType): { bg: string; text: string; badge: string } {
  return type === 'move_in'
    ? { bg: 'bg-tahoe-green/10', text: 'text-tahoe-green', badge: 'tahoe-badge tahoe-badge-green' }
    : { bg: 'bg-tahoe-purple/10', text: 'text-tahoe-purple', badge: 'tahoe-badge tahoe-badge-purple' }
}

function getProgressColor(percent: number): string {
  if (percent === 100) return 'bg-tahoe-green'
  if (percent >= 60) return 'bg-tahoe-blue'
  if (percent >= 30) return 'bg-tahoe-orange'
  return 'bg-tahoe-red'
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

export function MoveInOutPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<MoveStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = React.useState<MoveType | 'all'>('all')

  const filteredRecords = MOVE_RECORDS.filter((r) => {
    const matchSearch =
      !searchQuery ||
      r.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.property.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchType = typeFilter === 'all' || r.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  const stats = [
    {
      title: 'Upcoming Move-Ins',
      value: '3',
      subtitle: 'Next 30 days',
      icon: LogIn,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Pending Move-Outs',
      value: '2',
      subtitle: 'Scheduled departures',
      icon: LogOut,
      iconColor: 'text-tahoe-purple',
      iconBg: 'bg-tahoe-purple/10',
    },
    {
      title: 'In Progress',
      value: '1',
      subtitle: 'Currently active',
      icon: ArrowRightLeft,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
    },
    {
      title: 'Completed This Month',
      value: '7',
      subtitle: 'Successful transitions',
      icon: CheckCircle2,
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
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-purple/10">
            <LogIn className="size-6 text-tahoe-purple" />
          </div>
          <div>
            <h1 className="tahoe-title">Move-In / Move-Out</h1>
            <p className="tahoe-caption mt-1">Manage tenant transitions with checklists</p>
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
            Schedule Move
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Checklist Progress Section ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-tahoe-purple/10">
                <ClipboardCheck className="size-4 text-tahoe-purple" />
              </div>
              <div>
                <CardTitle className="tahoe-headline">Checklist Progress</CardTitle>
                <p className="tahoe-caption mt-0.5">Active move-in/move-out checklist completion</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {MOVE_RECORDS.filter((r) => r.status !== 'cancelled' && r.status !== 'completed').map((record, i) => {
                const typeColor = getTypeColor(record.type)
                const percent = Math.round((record.checklistComplete / record.checklistTotal) * 100)
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                    className="rounded-xl bg-muted/30 p-4 tahoe-transition hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={typeColor.badge}>{getTypeLabel(record.type)}</span>
                        <p className="text-sm font-medium text-foreground">{record.tenantName}</p>
                        <span className="text-[11px] text-muted-foreground">· {record.property} {record.unit}</span>
                      </div>
                      <span className={cn('text-sm font-bold', percent === 100 ? 'text-tahoe-green' : 'text-foreground')}>
                        {record.checklistComplete}/{record.checklistTotal}
                      </span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-muted/80 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
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
                <CardTitle className="tahoe-headline">Transition Records</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search tenants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(val) => setTypeFilter(val as MoveType | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[120px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="move_in">Move-In</SelectItem>
                    <SelectItem value="move_out">Move-Out</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as MoveStatus | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[140px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
                    <TableHead className="tahoe-overline">Tenant</TableHead>
                    <TableHead className="tahoe-overline">Type</TableHead>
                    <TableHead className="tahoe-overline">Property</TableHead>
                    <TableHead className="tahoe-overline">Scheduled</TableHead>
                    <TableHead className="tahoe-overline">Checklist</TableHead>
                    <TableHead className="tahoe-overline">Status</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredRecords.map((record, i) => {
                      const typeColor = getTypeColor(record.type)
                      const percent = Math.round((record.checklistComplete / record.checklistTotal) * 100)
                      return (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className={cn(
                            'border-b border-border/30 tahoe-transition',
                            record.status === 'cancelled' && 'opacity-60',
                            'hover:bg-muted/30'
                          )}
                        >
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'flex size-9 items-center justify-center rounded-full text-xs font-semibold',
                                typeColor.bg, typeColor.text
                              )}>
                                {record.tenantName.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{record.tenantName}</p>
                                <p className="text-[11px] text-muted-foreground">{record.contactPhone}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={typeColor.badge}>{getTypeLabel(record.type)}</span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <p className="text-sm text-foreground">{record.property}</p>
                            <p className="text-[11px] text-muted-foreground">Unit {record.unit}</p>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className="text-sm text-foreground">{record.scheduledDate}</span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="relative h-1.5 w-16 rounded-full bg-muted/80 overflow-hidden">
                                <div
                                  className={cn('absolute inset-y-0 left-0 rounded-full', getProgressColor(percent))}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-muted-foreground">{percent}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(record.status)}
                              <span className={getStatusBadgeClass(record.status)}>{getStatusLabel(record.status)}</span>
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
                {filteredRecords.map((record, i) => {
                  const typeColor = getTypeColor(record.type)
                  const percent = Math.round((record.checklistComplete / record.checklistTotal) * 100)
                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className="glass-card rounded-2xl p-4 space-y-3 tahoe-transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'flex size-9 items-center justify-center rounded-full text-xs font-semibold',
                            typeColor.bg, typeColor.text
                          )}>
                            {record.tenantName.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{record.tenantName}</p>
                            <p className="text-[11px] text-muted-foreground">{record.property} · Unit {record.unit}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(record.status)}
                          <span className={getStatusBadgeClass(record.status)}>{getStatusLabel(record.status)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={typeColor.badge}>{getTypeLabel(record.type)}</span>
                        <div className="flex items-center gap-2 flex-1">
                          <div className="relative h-1.5 flex-1 rounded-full bg-muted/80 overflow-hidden">
                            <div
                              className={cn('absolute inset-y-0 left-0 rounded-full', getProgressColor(percent))}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-muted-foreground shrink-0">{percent}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {filteredRecords.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-purple/10 mb-4">
                  <LogIn className="size-8 text-tahoe-purple/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No records found</h3>
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
