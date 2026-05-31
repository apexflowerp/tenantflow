'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PenTool,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Send,
  AlertTriangle,
  FileText,
  Signature,
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

type SignatureType = 'lease' | 'addendum' | 'notice' | 'agreement'
type SignatureStatus = 'pending' | 'signed' | 'declined' | 'expired'

interface SignatureRecord {
  id: string
  documentName: string
  type: SignatureType
  requestedBy: string
  requestedFrom: string
  status: SignatureStatus
  sentDate: string
  signedDate: string | null
  expiresDate: string
  property: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const SIGNATURES: SignatureRecord[] = [
  {
    id: 'SIG-001',
    documentName: 'Lease Agreement — Unit 4B',
    type: 'lease',
    requestedBy: 'Lisa Park',
    requestedFrom: 'Sarah Mitchell',
    status: 'pending',
    sentDate: '2025-06-12',
    signedDate: null,
    expiresDate: '2025-06-19',
    property: 'Skyline Tower',
  },
  {
    id: 'SIG-002',
    documentName: 'Lease Renewal Addendum',
    type: 'addendum',
    requestedBy: 'Mark Thompson',
    requestedFrom: 'James Rodriguez',
    status: 'signed',
    sentDate: '2025-06-08',
    signedDate: '2025-06-09',
    expiresDate: '2025-06-22',
    property: 'Harbor View Residences',
  },
  {
    id: 'SIG-003',
    documentName: 'Move-Out Notice',
    type: 'notice',
    requestedBy: 'Lisa Park',
    requestedFrom: 'Michael Brown',
    status: 'signed',
    sentDate: '2025-06-05',
    signedDate: '2025-06-05',
    expiresDate: '2025-06-12',
    property: 'Oakwood Estates',
  },
  {
    id: 'SIG-004',
    documentName: 'Pet Agreement',
    type: 'agreement',
    requestedBy: 'Mark Thompson',
    requestedFrom: 'Emily Chen',
    status: 'pending',
    sentDate: '2025-06-13',
    signedDate: null,
    expiresDate: '2025-06-20',
    property: 'Greenfield Gardens',
  },
  {
    id: 'SIG-005',
    documentName: 'Lease Agreement — Unit 101',
    type: 'lease',
    requestedBy: 'Lisa Park',
    requestedFrom: 'Jessica Taylor',
    status: 'declined',
    sentDate: '2025-06-06',
    signedDate: null,
    expiresDate: '2025-06-13',
    property: 'Metro Commercial Hub',
  },
  {
    id: 'SIG-006',
    documentName: 'Parking Spot Assignment',
    type: 'agreement',
    requestedBy: 'Mark Thompson',
    requestedFrom: 'David Kim',
    status: 'expired',
    sentDate: '2025-05-28',
    signedDate: null,
    expiresDate: '2025-06-04',
    property: 'Riverside Lofts',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getTypeLabel(type: SignatureType): string {
  const map: Record<SignatureType, string> = {
    lease: 'Lease',
    addendum: 'Addendum',
    notice: 'Notice',
    agreement: 'Agreement',
  }
  return map[type]
}

function getTypeColor(type: SignatureType): { bg: string; text: string; badge: string } {
  const map: Record<SignatureType, { bg: string; text: string; badge: string }> = {
    lease: { bg: 'bg-tahoe-pink/10', text: 'text-tahoe-pink', badge: 'tahoe-badge tahoe-badge-pink' },
    addendum: { bg: 'bg-tahoe-blue/10', text: 'text-tahoe-blue', badge: 'tahoe-badge tahoe-badge-blue' },
    notice: { bg: 'bg-tahoe-orange/10', text: 'text-tahoe-orange', badge: 'tahoe-badge tahoe-badge-orange' },
    agreement: { bg: 'bg-tahoe-teal/10', text: 'text-tahoe-teal', badge: 'tahoe-badge tahoe-badge-teal' },
  }
  return map[type]
}

function getStatusBadgeClass(status: SignatureStatus): string {
  const map: Record<SignatureStatus, string> = {
    pending: 'tahoe-badge tahoe-badge-orange',
    signed: 'tahoe-badge tahoe-badge-green',
    declined: 'tahoe-badge tahoe-badge-red',
    expired: 'tahoe-badge tahoe-badge-purple',
  }
  return map[status]
}

function getStatusIcon(status: SignatureStatus) {
  const map: Record<SignatureStatus, React.ReactNode> = {
    pending: <Clock className="size-3.5 text-tahoe-orange" />,
    signed: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    declined: <XCircle className="size-3.5 text-tahoe-red" />,
    expired: <AlertTriangle className="size-3.5 text-tahoe-purple" />,
  }
  return map[status]
}

function getStatusLabel(status: SignatureStatus): string {
  const map: Record<SignatureStatus, string> = {
    pending: 'Pending',
    signed: 'Signed',
    declined: 'Declined',
    expired: 'Expired',
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

export function ESignaturesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<SignatureStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = React.useState<SignatureType | 'all'>('all')

  const filteredSignatures = SIGNATURES.filter((s) => {
    const matchSearch =
      !searchQuery ||
      s.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.requestedFrom.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    const matchType = typeFilter === 'all' || s.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  const stats = [
    {
      title: 'Pending Signatures',
      value: '5',
      subtitle: 'Awaiting response',
      icon: Clock,
      iconColor: 'text-tahoe-pink',
      iconBg: 'bg-tahoe-pink/10',
    },
    {
      title: 'Completed',
      value: '42',
      subtitle: 'Successfully signed',
      icon: CheckCircle2,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Avg Turnaround',
      value: '1.8d',
      subtitle: 'Average sign time',
      icon: PenTool,
      iconColor: 'text-tahoe-blue',
      iconBg: 'bg-tahoe-blue/10',
    },
    {
      title: 'Expiring Soon',
      value: '2',
      subtitle: 'Within 48 hours',
      icon: AlertTriangle,
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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-pink/10">
            <PenTool className="size-6 text-tahoe-pink" />
          </div>
          <div>
            <h1 className="tahoe-title">E-Signatures</h1>
            <p className="tahoe-caption mt-1">Track digital signatures and documents</p>
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
            New Request
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Quick Send Section ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-tahoe-pink/10">
                <Send className="size-4 text-tahoe-pink" />
              </div>
              <div>
                <CardTitle className="tahoe-headline">Quick Signature Request</CardTitle>
                <p className="tahoe-caption mt-0.5">Send a document for signature instantly</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Input
                placeholder="Recipient name or email..."
                className="h-9 text-sm glass-input border-0 rounded-lg flex-1"
              />
              <Select defaultValue="lease">
                <SelectTrigger size="sm" className="w-[140px] rounded-lg border-0 bg-secondary/60">
                  <SelectValue placeholder="Doc type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lease">Lease</SelectItem>
                  <SelectItem value="addendum">Addendum</SelectItem>
                  <SelectItem value="notice">Notice</SelectItem>
                  <SelectItem value="agreement">Agreement</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="gap-2 tahoe-btn-primary rounded-xl shrink-0">
                <Send className="size-3.5" />
                Send Request
                <ArrowRight className="size-3.5" />
              </Button>
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
                <CardTitle className="tahoe-headline">Signature Records</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredSignatures.length} record{filteredSignatures.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(val) => setTypeFilter(val as SignatureType | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[130px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="lease">Lease</SelectItem>
                    <SelectItem value="addendum">Addendum</SelectItem>
                    <SelectItem value="notice">Notice</SelectItem>
                    <SelectItem value="agreement">Agreement</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as SignatureStatus | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[130px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="signed">Signed</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
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
                    <TableHead className="tahoe-overline">Document</TableHead>
                    <TableHead className="tahoe-overline">Type</TableHead>
                    <TableHead className="tahoe-overline">Requested By</TableHead>
                    <TableHead className="tahoe-overline">Requested From</TableHead>
                    <TableHead className="tahoe-overline">Status</TableHead>
                    <TableHead className="tahoe-overline">Dates</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredSignatures.map((sig, i) => {
                      const typeColor = getTypeColor(sig.type)
                      return (
                        <motion.tr
                          key={sig.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className={cn(
                            'border-b border-border/30 tahoe-transition',
                            sig.status === 'expired' && 'opacity-70',
                            sig.status === 'declined' && 'bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.04]',
                            'hover:bg-muted/30'
                          )}
                        >
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-2">
                              <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', typeColor.bg)}>
                                <FileText className={cn('size-3.5', typeColor.text)} />
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{sig.documentName}</p>
                                <p className="text-[11px] text-muted-foreground">{sig.property}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={typeColor.badge}>{getTypeLabel(sig.type)}</span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <p className="text-sm text-foreground">{sig.requestedBy}</p>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <p className="text-sm text-foreground">{sig.requestedFrom}</p>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(sig.status)}
                              <span className={getStatusBadgeClass(sig.status)}>{getStatusLabel(sig.status)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="text-[11px] space-y-0.5">
                              <p className="text-muted-foreground">Sent: {sig.sentDate}</p>
                              {sig.signedDate && <p className="text-tahoe-green">Signed: {sig.signedDate}</p>}
                              <p className={cn(
                                'text-muted-foreground',
                                sig.status === 'pending' && 'text-tahoe-orange'
                              )}>
                                <CalendarClock className="size-2.5 inline mr-0.5" />
                                Expires: {sig.expiresDate}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {sig.status === 'pending' && (
                                <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition" title="Send Reminder">
                                  <Send className="size-3.5 text-tahoe-blue" />
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
                      )
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 max-h-[420px] overflow-y-auto">
              <AnimatePresence>
                {filteredSignatures.map((sig, i) => {
                  const typeColor = getTypeColor(sig.type)
                  return (
                    <motion.div
                      key={sig.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className={cn(
                        'glass-card rounded-2xl p-4 space-y-3 tahoe-transition',
                        sig.status === 'declined' && 'ring-1 ring-tahoe-red/20'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', typeColor.bg)}>
                            <FileText className={cn('size-3.5', typeColor.text)} />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{sig.documentName}</p>
                            <p className="text-[11px] text-muted-foreground">From: {sig.requestedFrom}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(sig.status)}
                          <span className={getStatusBadgeClass(sig.status)}>{getStatusLabel(sig.status)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={typeColor.badge}>{getTypeLabel(sig.type)}</span>
                        <span className="text-[11px] text-muted-foreground ml-auto">Expires: {sig.expiresDate}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {filteredSignatures.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-pink/10 mb-4">
                  <PenTool className="size-8 text-tahoe-pink/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No signatures found</h3>
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
