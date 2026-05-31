'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Search,
  Plus,
  Download,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Send,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type RenewalStatus = 'pending' | 'sent' | 'accepted' | 'declined' | 'expired'

interface RenewalRecord {
  id: string
  tenant: string
  email: string
  property: string
  unit: string
  currentLeaseEnd: string
  currentRent: number
  proposedRent: number
  changePercent: number
  status: RenewalStatus
  sentDate: string | null
  responseDate: string | null
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const RENEWALS: RenewalRecord[] = [
  { id: 'rn-001', tenant: 'Sarah Mitchell', email: 'sarah.m@email.com', property: 'Skyline Tower', unit: '4B', currentLeaseEnd: '2025-07-31', currentRent: 2400, proposedRent: 2520, changePercent: 5.0, status: 'sent', sentDate: '2025-06-01', responseDate: null },
  { id: 'rn-002', tenant: 'James Rodriguez', email: 'j.rodriguez@email.com', property: 'Skyline Tower', unit: '8F', currentLeaseEnd: '2025-08-31', currentRent: 2100, proposedRent: 2184, changePercent: 4.0, status: 'accepted', sentDate: '2025-05-15', responseDate: '2025-05-28' },
  { id: 'rn-003', tenant: 'Emily Chen', email: 'e.chen@email.com', property: 'Harbor View', unit: '12A', currentLeaseEnd: '2025-07-15', currentRent: 2800, proposedRent: 2940, changePercent: 5.0, status: 'declined', sentDate: '2025-05-20', responseDate: '2025-06-05' },
  { id: 'rn-004', tenant: 'Michael Brown', email: 'mbrown@email.com', property: 'Greenfield Gardens', unit: '7C', currentLeaseEnd: '2025-09-30', currentRent: 1800, proposedRent: 1854, changePercent: 3.0, status: 'pending', sentDate: null, responseDate: null },
  { id: 'rn-005', tenant: 'Jessica Taylor', email: 'j.taylor@email.com', property: 'Oakwood Estates', unit: '3A', currentLeaseEnd: '2025-06-30', currentRent: 3200, proposedRent: 3360, changePercent: 5.0, status: 'expired', sentDate: '2025-04-15', responseDate: null },
  { id: 'rn-006', tenant: 'David Kim', email: 'd.kim@email.com', property: 'Harbor View', unit: '5C', currentLeaseEnd: '2025-08-15', currentRent: 2600, proposedRent: 2730, changePercent: 5.0, status: 'sent', sentDate: '2025-06-10', responseDate: null },
  { id: 'rn-007', tenant: 'Amanda White', email: 'a.white@email.com', property: 'Greenfield Gardens', unit: '2B', currentLeaseEnd: '2025-10-31', currentRent: 1750, proposedRent: 1785, changePercent: 2.0, status: 'accepted', sentDate: '2025-06-01', responseDate: '2025-06-08' },
  { id: 'rn-008', tenant: 'Robert Garcia', email: 'r.garcia@email.com', property: 'Metro Hub', unit: '205', currentLeaseEnd: '2025-08-31', currentRent: 1500, proposedRent: 1560, changePercent: 4.0, status: 'pending', sentDate: null, responseDate: null },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
}

function getStatusBadge(status: RenewalStatus): string {
  const map: Record<RenewalStatus, string> = {
    pending: 'tahoe-badge tahoe-badge-orange',
    sent: 'tahoe-badge tahoe-badge-blue',
    accepted: 'tahoe-badge tahoe-badge-green',
    declined: 'tahoe-badge tahoe-badge-red',
    expired: 'tahoe-badge tahoe-badge-purple',
  }
  return map[status]
}

function getStatusIcon(status: RenewalStatus) {
  const map: Record<RenewalStatus, React.ReactNode> = {
    pending: <Clock className="size-3.5 text-tahoe-orange" />,
    sent: <Send className="size-3.5 text-tahoe-blue" />,
    accepted: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    declined: <XCircle className="size-3.5 text-tahoe-red" />,
    expired: <AlertTriangle className="size-3.5 text-tahoe-purple" />,
  }
  return map[status]
}

// ── Main Component ────────────────────────────────────────────────────────────

export function RenewalsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<RenewalStatus | 'all'>('all')

  const upcomingRenewals = RENEWALS.filter(r => r.status === 'pending' || r.status === 'sent').length
  const sentCount = RENEWALS.filter(r => r.status === 'sent').length
  const acceptedCount = RENEWALS.filter(r => r.status === 'accepted').length
  const expiredCount = RENEWALS.filter(r => r.status === 'expired' || r.status === 'declined').length

  const filteredRenewals = RENEWALS.filter(r => {
    const matchSearch = !searchQuery ||
      r.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.property.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = [
    { title: 'Upcoming Renewals', value: String(upcomingRenewals), subtitle: 'Pending or sent', icon: Clock, iconColor: 'text-tahoe-orange', iconBg: 'bg-tahoe-orange/10' },
    { title: 'Sent', value: String(sentCount), subtitle: 'Awaiting response', icon: Send, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Accepted', value: String(acceptedCount), subtitle: 'Renewals confirmed', icon: CheckCircle2, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
    { title: 'Expired/Declined', value: String(expiredCount), subtitle: 'Lost renewals', icon: AlertTriangle, iconColor: 'text-tahoe-red', iconBg: 'bg-tahoe-red/10' },
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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-purple/10">
            <FileText className="size-6 text-tahoe-purple" />
          </div>
          <div>
            <h1 className="tahoe-title">Lease Renewals</h1>
            <p className="tahoe-caption mt-1">Track & manage lease renewals</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary">
            <Plus className="size-3.5" />
            Send Renewal
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

      {/* Table */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="tahoe-headline">Renewal Tracker</CardTitle>
              <p className="tahoe-caption mt-1">{filteredRenewals.length} records</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 w-[160px] text-sm glass-input border-0" />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as RenewalStatus | 'all')} className="h-8 rounded-lg border-0 bg-secondary/60 px-3 pr-7 text-sm text-foreground appearance-none cursor-pointer">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="expired">Expired</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Desktop */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-3 tahoe-overline">Tenant</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Property/Unit</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Lease End</th>
                  <th className="text-right py-3 px-3 tahoe-overline">Current</th>
                  <th className="text-right py-3 px-3 tahoe-overline">Proposed</th>
                  <th className="text-center py-3 px-3 tahoe-overline">Change</th>
                  <th className="text-center py-3 px-3 tahoe-overline">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredRenewals.map((renewal) => (
                    <motion.tr
                      key={renewal.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        'border-b border-border/30 tahoe-transition',
                        renewal.status === 'expired' ? 'bg-tahoe-purple/5' :
                        renewal.status === 'declined' ? 'bg-tahoe-red/5' : 'hover:bg-muted/30'
                      )}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-full bg-tahoe-purple/10 text-tahoe-purple text-[10px] font-semibold">
                            {renewal.tenant.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{renewal.tenant}</p>
                            <p className="text-[11px] text-muted-foreground">{renewal.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-foreground">{renewal.property}</p>
                        <p className="text-[11px] text-muted-foreground">Unit {renewal.unit}</p>
                      </td>
                      <td className="py-3 px-3 text-foreground">{renewal.currentLeaseEnd}</td>
                      <td className="py-3 px-3 text-right font-medium text-foreground">{formatCurrency(renewal.currentRent)}</td>
                      <td className="py-3 px-3 text-right font-medium text-foreground">{formatCurrency(renewal.proposedRent)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn(
                          'inline-flex items-center gap-0.5 text-sm font-semibold',
                          renewal.changePercent > 0 ? 'text-tahoe-red' : 'text-tahoe-green'
                        )}>
                          {renewal.changePercent > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                          {renewal.changePercent > 0 ? '+' : ''}{renewal.changePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {getStatusIcon(renewal.status)}
                          <span className={getStatusBadge(renewal.status)}>{renewal.status}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="xl:hidden space-y-3 max-h-96 overflow-y-auto">
            {filteredRenewals.map(renewal => (
              <div key={renewal.id} className={cn('glass-card p-4 space-y-2', renewal.status === 'declined' && 'ring-1 ring-tahoe-red/20')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-tahoe-purple/10 text-tahoe-purple text-[10px] font-semibold">
                      {renewal.tenant.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-sm">{renewal.tenant}</span>
                  </div>
                  <div className="flex items-center gap-1">{getStatusIcon(renewal.status)}<span className={getStatusBadge(renewal.status)}>{renewal.status}</span></div>
                </div>
                <p className="text-[11px] text-muted-foreground">{renewal.property} · Unit {renewal.unit} · Ends {renewal.currentLeaseEnd}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{formatCurrency(renewal.currentRent)}/mo</span>
                  <span className="text-tahoe-red font-semibold">→ {formatCurrency(renewal.proposedRent)}/mo (+{renewal.changePercent}%)</span>
                </div>
              </div>
            ))}
          </div>

          {filteredRenewals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="size-10 text-muted-foreground/40 mb-3" />
              <p className="tahoe-body text-muted-foreground">No renewals match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
