'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserCheck,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  UserPlus,
  XCircle,
  LogOut,
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

type VisitorStatus = 'pending' | 'checked_in' | 'checked_out' | 'declined'

interface VisitorRecord {
  id: string
  name: string
  host: string
  purpose: string
  checkIn: string
  checkOut: string | null
  status: VisitorStatus
  property: string
  phone: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const VISITORS: VisitorRecord[] = [
  {
    id: 'VIS-001',
    name: 'David Chen',
    host: 'Lisa Park',
    purpose: 'Property Viewing',
    checkIn: '09:15 AM',
    checkOut: '10:30 AM',
    status: 'checked_out',
    property: 'Skyline Tower',
    phone: '(415) 555-0142',
  },
  {
    id: 'VIS-002',
    name: 'Maria Santos',
    host: 'Mark Thompson',
    purpose: 'Lease Signing',
    checkIn: '10:00 AM',
    checkOut: null,
    status: 'checked_in',
    property: 'Harbor View Residences',
    phone: '(650) 555-0198',
  },
  {
    id: 'VIS-003',
    name: 'Robert Kim',
    host: 'Lisa Park',
    purpose: 'Maintenance Review',
    checkIn: '11:30 AM',
    checkOut: null,
    status: 'checked_in',
    property: 'Greenfield Gardens',
    phone: '(408) 555-0231',
  },
  {
    id: 'VIS-004',
    name: 'Amanda Foster',
    host: 'Mark Thompson',
    purpose: 'Contractor Bid',
    checkIn: '--',
    checkOut: null,
    status: 'pending',
    property: 'Oakwood Estates',
    phone: '(510) 555-0176',
  },
  {
    id: 'VIS-005',
    name: 'James Williams',
    host: 'Lisa Park',
    purpose: 'Unit Inspection',
    checkIn: '02:00 PM',
    checkOut: null,
    status: 'checked_in',
    property: 'Metro Commercial Hub',
    phone: '(415) 555-0289',
  },
  {
    id: 'VIS-006',
    name: 'Sarah Johnson',
    host: 'Mark Thompson',
    purpose: 'Unauthorized Access',
    checkIn: '--',
    checkOut: null,
    status: 'declined',
    property: 'Riverside Lofts',
    phone: '(650) 555-0345',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getStatusBadgeClass(status: VisitorStatus): string {
  const map: Record<VisitorStatus, string> = {
    pending: 'tahoe-badge tahoe-badge-orange',
    checked_in: 'tahoe-badge tahoe-badge-blue',
    checked_out: 'tahoe-badge tahoe-badge-green',
    declined: 'tahoe-badge tahoe-badge-red',
  }
  return map[status]
}

function getStatusIcon(status: VisitorStatus) {
  const map: Record<VisitorStatus, React.ReactNode> = {
    pending: <Clock className="size-3.5 text-tahoe-orange" />,
    checked_in: <UserCheck className="size-3.5 text-tahoe-blue" />,
    checked_out: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    declined: <XCircle className="size-3.5 text-tahoe-red" />,
  }
  return map[status]
}

function getStatusLabel(status: VisitorStatus): string {
  const map: Record<VisitorStatus, string> = {
    pending: 'Pending',
    checked_in: 'Checked In',
    checked_out: 'Checked Out',
    declined: 'Declined',
  }
  return map[status]
}

function getPurposeBadgeClass(purpose: string): string {
  if (purpose.includes('Viewing') || purpose.includes('Signing')) return 'tahoe-badge tahoe-badge-blue'
  if (purpose.includes('Maintenance') || purpose.includes('Inspection')) return 'tahoe-badge tahoe-badge-orange'
  if (purpose.includes('Contractor')) return 'tahoe-badge tahoe-badge-purple'
  return 'tahoe-badge tahoe-badge-red'
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

export function VisitorsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<VisitorStatus | 'all'>('all')

  const filteredVisitors = VISITORS.filter((v) => {
    const matchSearch =
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.property.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = [
    {
      title: "Today's Visitors",
      value: '8',
      subtitle: 'Total scheduled today',
      icon: Users,
      iconColor: 'text-tahoe-blue',
      iconBg: 'bg-tahoe-blue/10',
    },
    {
      title: 'Expected',
      value: '3',
      subtitle: 'Yet to arrive',
      icon: Clock,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
    },
    {
      title: 'Checked In',
      value: '5',
      subtitle: 'Currently on premises',
      icon: UserCheck,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Pending Approval',
      value: '1',
      subtitle: 'Requires review',
      icon: AlertTriangle,
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
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-blue/10">
            <UserCheck className="size-6 text-tahoe-blue" />
          </div>
          <div>
            <h1 className="tahoe-title">Visitor Management</h1>
            <p className="tahoe-caption mt-1">Track visitors, check-ins, and access control</p>
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
            <UserPlus className="size-3.5" />
            Register Visitor
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Quick Check-In ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-tahoe-blue/10">
                <UserPlus className="size-5 text-tahoe-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">Quick Check-In</p>
                <p className="tahoe-caption">Pre-register a visitor or check in an expected guest instantly</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Visitor name or ID..."
                  className="h-9 text-sm glass-input border-0 rounded-lg flex-1 sm:w-[220px]"
                />
                <Button size="sm" className="gap-2 tahoe-btn-primary rounded-xl shrink-0">
                  Check In
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
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
                <CardTitle className="tahoe-headline">Visitor Log</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredVisitors.length} visitor{filteredVisitors.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search visitors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as VisitorStatus | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[140px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="checked_in">Checked In</SelectItem>
                    <SelectItem value="checked_out">Checked Out</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
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
                    <TableHead className="tahoe-overline">Visitor</TableHead>
                    <TableHead className="tahoe-overline">Host</TableHead>
                    <TableHead className="tahoe-overline">Purpose</TableHead>
                    <TableHead className="tahoe-overline">Check-In</TableHead>
                    <TableHead className="tahoe-overline">Check-Out</TableHead>
                    <TableHead className="tahoe-overline">Status</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredVisitors.map((visitor, i) => (
                      <motion.tr
                        key={visitor.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        className={cn(
                          'border-b border-border/30 tahoe-transition',
                          visitor.status === 'declined' && 'bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.04]',
                          'hover:bg-muted/30'
                        )}
                      >
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-full bg-tahoe-blue/10 text-xs font-semibold text-tahoe-blue">
                              {visitor.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{visitor.name}</p>
                              <p className="text-[11px] text-muted-foreground">{visitor.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <p className="text-sm text-foreground">{visitor.host}</p>
                          <p className="text-[11px] text-muted-foreground">{visitor.property}</p>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className={getPurposeBadgeClass(visitor.purpose)}>{visitor.purpose}</span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className="text-sm text-foreground">{visitor.checkIn}</span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-1">
                            {visitor.checkOut ? (
                              <span className="text-sm text-foreground">{visitor.checkOut}</span>
                            ) : (
                              <span className="text-[11px] text-muted-foreground">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(visitor.status)}
                            <span className={getStatusBadgeClass(visitor.status)}>
                              {getStatusLabel(visitor.status)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {visitor.status === 'checked_in' && (
                              <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition" title="Check Out">
                                <LogOut className="size-3.5 text-tahoe-green" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition">
                              <Eye className="size-3.5 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition">
                              <MoreHorizontal className="size-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 max-h-[420px] overflow-y-auto">
              <AnimatePresence>
                {filteredVisitors.map((visitor, i) => (
                  <motion.div
                    key={visitor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className={cn(
                      'glass-card rounded-2xl p-4 space-y-3 tahoe-transition',
                      visitor.status === 'declined' && 'ring-1 ring-tahoe-red/20'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-full bg-tahoe-blue/10 text-xs font-semibold text-tahoe-blue">
                          {visitor.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{visitor.name}</p>
                          <p className="text-[11px] text-muted-foreground">Host: {visitor.host}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(visitor.status)}
                        <span className={getStatusBadgeClass(visitor.status)}>{getStatusLabel(visitor.status)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={getPurposeBadgeClass(visitor.purpose)}>{visitor.purpose}</span>
                      <span className="text-[11px] text-muted-foreground ml-auto">
                        {visitor.checkIn !== '--' ? `In: ${visitor.checkIn}` : 'Not arrived'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredVisitors.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-blue/10 mb-4">
                  <UserCheck className="size-8 text-tahoe-blue/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No visitors found</h3>
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
