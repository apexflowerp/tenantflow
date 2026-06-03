'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle2,
  Users,
  MessageSquare,
  Shield,
  XCircle,
  Flame,
  Zap,
  Info,
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

type DisputeType = 'noise' | 'damage' | 'payment' | 'lease' | 'common_area' | 'other'
type DisputePriority = 'low' | 'medium' | 'high' | 'critical'
type DisputeStatus = 'open' | 'under_review' | 'mediation' | 'resolved' | 'closed'

interface DisputeRecord {
  id: string
  title: string
  type: DisputeType
  priority: DisputePriority
  reportedBy: string
  againstTenant: string
  property: string
  unit: string
  status: DisputeStatus
  createdDate: string
  updatedDate: string
  description: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const DISPUTES: DisputeRecord[] = [
  {
    id: 'DSP-001',
    title: 'Excessive Noise Complaint — Unit 4B',
    type: 'noise',
    priority: 'high',
    reportedBy: 'Lisa Park (Property Mgr)',
    againstTenant: 'Sarah Mitchell',
    property: 'Skyline Tower',
    unit: '4B',
    status: 'open',
    createdDate: '2025-06-12',
    updatedDate: '2025-06-14',
    description: 'Multiple noise complaints from adjacent units about late-night gatherings.',
  },
  {
    id: 'DSP-002',
    title: 'Property Damage — Common Hallway',
    type: 'damage',
    priority: 'medium',
    reportedBy: 'Mark Thompson (Property Mgr)',
    againstTenant: 'James Rodriguez',
    property: 'Harbor View Residences',
    unit: '12A',
    status: 'under_review',
    createdDate: '2025-06-08',
    updatedDate: '2025-06-13',
    description: 'Scratches and dents on hallway walls during move-in process.',
  },
  {
    id: 'DSP-003',
    title: 'Unpaid Utility Charges — 3 Months',
    type: 'payment',
    priority: 'critical',
    reportedBy: 'Lisa Park (Property Mgr)',
    againstTenant: 'Michael Brown',
    property: 'Oakwood Estates',
    unit: '3A',
    status: 'mediation',
    createdDate: '2025-06-01',
    updatedDate: '2025-06-14',
    description: 'Tenant refuses to pay utility charges totaling $1,240 over 3 months.',
  },
  {
    id: 'DSP-004',
    title: 'Lease Violation — Unauthorized Pet',
    type: 'lease',
    priority: 'high',
    reportedBy: 'Mark Thompson (Property Mgr)',
    againstTenant: 'Emily Chen',
    property: 'Greenfield Gardens',
    unit: '7C',
    status: 'open',
    createdDate: '2025-06-10',
    updatedDate: '2025-06-12',
    description: 'Tenant keeps a German Shepherd without prior approval or pet deposit.',
  },
  {
    id: 'DSP-005',
    title: 'Parking Spot Misuse — Reserved Spot',
    type: 'common_area',
    priority: 'low',
    reportedBy: 'Lisa Park (Property Mgr)',
    againstTenant: 'David Kim',
    property: 'Riverside Lofts',
    unit: '2D',
    status: 'resolved',
    createdDate: '2025-05-28',
    updatedDate: '2025-06-05',
    description: 'Tenant parking in reserved spots. Issue resolved after verbal warning.',
  },
  {
    id: 'DSP-006',
    title: 'Laundry Room Equipment Damage',
    type: 'damage',
    priority: 'medium',
    reportedBy: 'Mark Thompson (Property Mgr)',
    againstTenant: 'Amanda White',
    property: 'Metro Commercial Hub',
    unit: '5C',
    status: 'closed',
    createdDate: '2025-05-15',
    updatedDate: '2025-06-01',
    description: 'Washing machine damaged. Tenant paid for repairs. Case closed.',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getTypeLabel(type: DisputeType): string {
  const map: Record<DisputeType, string> = {
    noise: 'Noise',
    damage: 'Damage',
    payment: 'Payment',
    lease: 'Lease',
    common_area: 'Common Area',
    other: 'Other',
  }
  return map[type]
}

function getTypeColor(type: DisputeType): { bg: string; text: string; badge: string } {
  const map: Record<DisputeType, { bg: string; text: string; badge: string }> = {
    noise: { bg: 'bg-tahoe-orange/10', text: 'text-tahoe-orange', badge: 'tahoe-badge tahoe-badge-orange' },
    damage: { bg: 'bg-tahoe-red/10', text: 'text-tahoe-red', badge: 'tahoe-badge tahoe-badge-red' },
    payment: { bg: 'bg-tahoe-purple/10', text: 'text-tahoe-purple', badge: 'tahoe-badge tahoe-badge-purple' },
    lease: { bg: 'bg-tahoe-blue/10', text: 'text-tahoe-blue', badge: 'tahoe-badge tahoe-badge-blue' },
    common_area: { bg: 'bg-tahoe-teal/10', text: 'text-tahoe-teal', badge: 'tahoe-badge tahoe-badge-teal' },
    other: { bg: 'bg-muted/50', text: 'text-muted-foreground', badge: 'tahoe-badge' },
  }
  return map[type]
}

function getPriorityBadgeClass(priority: DisputePriority): string {
  const map: Record<DisputePriority, string> = {
    low: 'tahoe-badge tahoe-badge-blue',
    medium: 'tahoe-badge tahoe-badge-orange',
    high: 'tahoe-badge tahoe-badge-red',
    critical: 'tahoe-badge tahoe-badge-red',
  }
  return map[priority]
}

function getPriorityIcon(priority: DisputePriority) {
  const map: Record<DisputePriority, React.ReactNode> = {
    low: <Info className="size-3.5 text-tahoe-blue" />,
    medium: <AlertTriangle className="size-3.5 text-tahoe-orange" />,
    high: <Flame className="size-3.5 text-tahoe-red" />,
    critical: <Zap className="size-3.5 text-tahoe-red" />,
  }
  return map[priority]
}

function getPriorityLabel(priority: DisputePriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

function getStatusBadgeClass(status: DisputeStatus): string {
  const map: Record<DisputeStatus, string> = {
    open: 'tahoe-badge tahoe-badge-red',
    under_review: 'tahoe-badge tahoe-badge-orange',
    mediation: 'tahoe-badge tahoe-badge-purple',
    resolved: 'tahoe-badge tahoe-badge-green',
    closed: 'tahoe-badge tahoe-badge-blue',
  }
  return map[status]
}

function getStatusIcon(status: DisputeStatus) {
  const map: Record<DisputeStatus, React.ReactNode> = {
    open: <AlertTriangle className="size-3.5 text-tahoe-red" />,
    under_review: <Eye className="size-3.5 text-tahoe-orange" />,
    mediation: <MessageSquare className="size-3.5 text-tahoe-purple" />,
    resolved: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    closed: <XCircle className="size-3.5 text-tahoe-blue" />,
  }
  return map[status]
}

function getStatusLabel(status: DisputeStatus): string {
  const map: Record<DisputeStatus, string> = {
    open: 'Open',
    under_review: 'Under Review',
    mediation: 'Mediation',
    resolved: 'Resolved',
    closed: 'Closed',
  }
  return map[status]
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

export function DisputesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<DisputeStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = React.useState<DisputePriority | 'all'>('all')

  const filteredDisputes = DISPUTES.filter((d) => {
    const matchSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.againstTenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.property.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    const matchPriority = priorityFilter === 'all' || d.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  const stats = [
    {
      title: 'Open Disputes',
      value: '4',
      subtitle: 'Requires attention',
      icon: AlertTriangle,
      iconColor: 'text-tahoe-red',
      iconBg: 'bg-tahoe-red/10',
    },
    {
      title: 'Under Review',
      value: '2',
      subtitle: 'Being investigated',
      icon: Eye,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
    },
    {
      title: 'Resolved This Month',
      value: '8',
      subtitle: 'Successfully closed',
      icon: CheckCircle2,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Avg Resolution',
      value: '5.2d',
      subtitle: 'Average days to close',
      icon: Clock,
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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-red/10">
            <AlertTriangle className="size-6 text-tahoe-red" />
          </div>
          <div>
            <h1 className="tahoe-title">Dispute Resolution</h1>
            <p className="tahoe-caption mt-1">Track and resolve tenant disputes</p>
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
            File Dispute
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Data Table ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="tahoe-headline">Dispute Records</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredDisputes.length} dispute{filteredDisputes.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search disputes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                <Select
                  value={priorityFilter}
                  onValueChange={(val) => setPriorityFilter(val as DisputePriority | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[120px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as DisputeStatus | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[140px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="mediation">Mediation</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
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
                    <TableHead className="tahoe-overline">Dispute</TableHead>
                    <TableHead className="tahoe-overline">Type</TableHead>
                    <TableHead className="tahoe-overline">Priority</TableHead>
                    <TableHead className="tahoe-overline">Tenant</TableHead>
                    <TableHead className="tahoe-overline">Status</TableHead>
                    <TableHead className="tahoe-overline">Dates</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredDisputes.map((dispute, i) => {
                      const typeColor = getTypeColor(dispute.type)
                      return (
                        <motion.tr
                          key={dispute.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className={cn(
                            'border-b border-border/30 tahoe-transition',
                            dispute.priority === 'critical' && 'bg-tahoe-red/[0.04] dark:bg-tahoe-red/[0.05]',
                            dispute.status === 'open' && dispute.priority === 'high' && 'bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.04]',
                            'hover:bg-muted/30'
                          )}
                        >
                          <TableCell className="py-3.5">
                            <div>
                              <p className="font-medium text-foreground text-sm">{dispute.title}</p>
                              <p className="text-[11px] text-muted-foreground">{dispute.property} · {dispute.unit}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={typeColor.badge}>{getTypeLabel(dispute.type)}</span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              {getPriorityIcon(dispute.priority)}
                              <span className={getPriorityBadgeClass(dispute.priority)}>
                                {getPriorityLabel(dispute.priority)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <p className="text-sm text-foreground">{dispute.againstTenant}</p>
                            <p className="text-[11px] text-muted-foreground">Reported by: {dispute.reportedBy.split(' (')[0]}</p>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(dispute.status)}
                              <span className={getStatusBadgeClass(dispute.status)}>
                                {getStatusLabel(dispute.status)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="text-[11px] space-y-0.5">
                              <p className="text-muted-foreground">Created: {dispute.createdDate}</p>
                              <p className="text-foreground/70">Updated: {dispute.updatedDate}</p>
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
                {filteredDisputes.map((dispute, i) => {
                  const typeColor = getTypeColor(dispute.type)
                  return (
                    <motion.div
                      key={dispute.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className={cn(
                        'glass-card rounded-2xl p-4 space-y-3 tahoe-transition',
                        (dispute.priority === 'critical' || dispute.priority === 'high') && 'ring-1 ring-tahoe-red/20'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm text-foreground">{dispute.title}</p>
                          <p className="text-[11px] text-muted-foreground">{dispute.property} · {dispute.againstTenant}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {getPriorityIcon(dispute.priority)}
                          <span className={getPriorityBadgeClass(dispute.priority)}>{getPriorityLabel(dispute.priority)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={typeColor.badge}>{getTypeLabel(dispute.type)}</span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(dispute.status)}
                          <span className={getStatusBadgeClass(dispute.status)}>{getStatusLabel(dispute.status)}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground ml-auto">{dispute.updatedDate}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {filteredDisputes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-red/10 mb-4">
                  <AlertTriangle className="size-8 text-tahoe-red/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No disputes found</h3>
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
