'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Key,
  Search,
  Plus,
  Download,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  User,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type KeyType = 'physical' | 'smart' | 'fob' | 'code'
type KeyStatus = 'assigned' | 'available' | 'overdue' | 'lost'

interface KeyRecord {
  id: string
  keyId: string
  type: KeyType
  assignee: string | null
  property: string
  unit: string
  issuedDate: string | null
  returnDate: string | null
  dueDate: string | null
  status: KeyStatus
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const KEYS: KeyRecord[] = [
  { id: 'kr-001', keyId: 'KEY-P-001', type: 'physical', assignee: 'Sarah Mitchell', property: 'Skyline Tower', unit: '4B', issuedDate: '2025-01-15', returnDate: null, dueDate: '2026-01-15', status: 'assigned' },
  { id: 'kr-002', keyId: 'KEY-S-002', type: 'smart', assignee: 'James Rodriguez', property: 'Skyline Tower', unit: '8F', issuedDate: '2025-03-01', returnDate: null, dueDate: '2026-03-01', status: 'assigned' },
  { id: 'kr-003', keyId: 'KEY-F-003', type: 'fob', assignee: 'Emily Chen', property: 'Harbor View', unit: '12A', issuedDate: '2025-02-10', returnDate: null, dueDate: '2025-06-10', status: 'overdue' },
  { id: 'kr-004', keyId: 'KEY-C-004', type: 'code', assignee: 'Michael Brown', property: 'Greenfield Gardens', unit: '7C', issuedDate: '2025-04-01', returnDate: null, dueDate: '2026-04-01', status: 'assigned' },
  { id: 'kr-005', keyId: 'KEY-P-005', type: 'physical', assignee: null, property: 'Metro Hub', unit: '101', issuedDate: null, returnDate: '2025-03-15', dueDate: null, status: 'available' },
  { id: 'kr-006', keyId: 'KEY-S-006', type: 'smart', assignee: 'Jessica Taylor', property: 'Oakwood Estates', unit: '3A', issuedDate: '2025-05-01', returnDate: null, dueDate: '2026-05-01', status: 'assigned' },
  { id: 'kr-007', keyId: 'KEY-F-007', type: 'fob', assignee: null, property: 'Skyline Tower', unit: '2A', issuedDate: null, returnDate: null, dueDate: null, status: 'available' },
  { id: 'kr-008', keyId: 'KEY-P-008', type: 'physical', assignee: 'David Kim', property: 'Harbor View', unit: '5C', issuedDate: '2025-02-01', returnDate: null, dueDate: null, status: 'lost' },
  { id: 'kr-009', keyId: 'KEY-C-009', type: 'code', assignee: 'Amanda White', property: 'Greenfield Gardens', unit: '2B', issuedDate: '2025-06-01', returnDate: null, dueDate: '2026-06-01', status: 'assigned' },
  { id: 'kr-010', keyId: 'KEY-S-010', type: 'smart', assignee: null, property: 'Metro Hub', unit: '205', issuedDate: null, returnDate: '2025-05-20', dueDate: null, status: 'available' },
  { id: 'kr-011', keyId: 'KEY-P-011', type: 'physical', assignee: 'Robert Garcia', property: 'Oakwood Estates', unit: '9D', issuedDate: '2025-01-20', returnDate: null, dueDate: '2025-05-20', status: 'overdue' },
  { id: 'kr-012', keyId: 'KEY-F-012', type: 'fob', assignee: null, property: 'Skyline Tower', unit: '6C', issuedDate: null, returnDate: null, dueDate: null, status: 'available' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTypeBadgeClass(type: KeyType): string {
  const map: Record<KeyType, string> = {
    physical: 'tahoe-badge tahoe-badge-blue',
    smart: 'tahoe-badge tahoe-badge-purple',
    fob: 'tahoe-badge tahoe-badge-teal',
    code: 'tahoe-badge tahoe-badge-green',
  }
  return map[type]
}

function getTypeLabel(type: KeyType): string {
  const map: Record<KeyType, string> = { physical: 'Physical', smart: 'Smart', fob: 'Fob', code: 'Access Code' }
  return map[type]
}

function getStatusBadge(status: KeyStatus): string {
  const map: Record<KeyStatus, string> = {
    assigned: 'tahoe-badge tahoe-badge-blue',
    available: 'tahoe-badge tahoe-badge-green',
    overdue: 'tahoe-badge tahoe-badge-red',
    lost: 'tahoe-badge tahoe-badge-orange',
  }
  return map[status]
}

function getStatusIcon(status: KeyStatus) {
  const map: Record<KeyStatus, React.ReactNode> = {
    assigned: <CheckCircle2 className="size-3.5 text-tahoe-blue" />,
    available: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    overdue: <AlertTriangle className="size-3.5 text-tahoe-red" />,
    lost: <XCircle className="size-3.5 text-tahoe-orange" />,
  }
  return map[status]
}

// ── Main Component ────────────────────────────────────────────────────────────

export function KeyManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<KeyType | 'all'>('all')
  const [statusFilter, setStatusFilter] = React.useState<KeyStatus | 'all'>('all')

  const totalKeys = KEYS.length
  const assignedKeys = KEYS.filter(k => k.status === 'assigned').length
  const availableKeys = KEYS.filter(k => k.status === 'available').length
  const overdueKeys = KEYS.filter(k => k.status === 'overdue').length

  const filteredKeys = KEYS.filter(k => {
    const matchSearch = !searchQuery ||
      k.keyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.assignee && k.assignee.toLowerCase().includes(searchQuery.toLowerCase())) ||
      k.property.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = typeFilter === 'all' || k.type === typeFilter
    const matchStatus = statusFilter === 'all' || k.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const stats = [
    { title: 'Total Keys', value: String(totalKeys), subtitle: 'All key records', icon: Key, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Assigned', value: String(assignedKeys), subtitle: 'Currently issued', icon: User, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Available', value: String(availableKeys), subtitle: 'Ready for assignment', icon: CheckCircle2, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
    { title: 'Overdue Returns', value: String(overdueKeys), subtitle: 'Require follow-up', icon: AlertTriangle, iconColor: 'text-tahoe-red', iconBg: 'bg-tahoe-red/10' },
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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-blue/10">
            <Key className="size-6 text-tahoe-blue" />
          </div>
          <div>
            <h1 className="tahoe-title">Key Management</h1>
            <p className="tahoe-caption mt-1">Physical & digital key tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary">
            <Plus className="size-3.5" />
            Issue Key
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
              <CardTitle className="tahoe-headline">Key Registry</CardTitle>
              <p className="tahoe-caption mt-1">{filteredKeys.length} records</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 w-[160px] text-sm glass-input border-0" />
              </div>
              <div className="relative">
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as KeyType | 'all')} className="h-8 rounded-lg border-0 bg-secondary/60 px-3 pr-7 text-sm text-foreground appearance-none cursor-pointer">
                  <option value="all">All Types</option>
                  <option value="physical">Physical</option>
                  <option value="smart">Smart</option>
                  <option value="fob">Fob</option>
                  <option value="code">Access Code</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as KeyStatus | 'all')} className="h-8 rounded-lg border-0 bg-secondary/60 px-3 pr-7 text-sm text-foreground appearance-none cursor-pointer">
                  <option value="all">All Status</option>
                  <option value="assigned">Assigned</option>
                  <option value="available">Available</option>
                  <option value="overdue">Overdue</option>
                  <option value="lost">Lost</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-3 tahoe-overline">Key ID</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Type</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Assignee</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Property/Unit</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Issued</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Return/Due</th>
                  <th className="text-center py-3 px-3 tahoe-overline">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredKeys.map((key) => (
                    <motion.tr
                      key={key.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        'border-b border-border/30 tahoe-transition',
                        key.status === 'overdue' ? 'bg-tahoe-red/5' : 'hover:bg-muted/30'
                      )}
                    >
                      <td className="py-3 px-3">
                        <span className="font-mono text-xs font-semibold text-foreground">{key.keyId}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={getTypeBadgeClass(key.type)}>{getTypeLabel(key.type)}</span>
                      </td>
                      <td className="py-3 px-3">
                        {key.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 items-center justify-center rounded-full bg-tahoe-blue/10 text-tahoe-blue text-[10px] font-semibold">
                              {key.assignee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-foreground font-medium">{key.assignee}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-foreground">{key.property}</p>
                        <p className="text-[11px] text-muted-foreground">Unit {key.unit}</p>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{key.issuedDate ?? '—'}</td>
                      <td className="py-3 px-3">
                        {key.returnDate && <span className="text-tahoe-green">{key.returnDate}</span>}
                        {!key.returnDate && key.dueDate && (
                          <span className={key.status === 'overdue' ? 'text-tahoe-red font-medium' : 'text-muted-foreground'}>Due: {key.dueDate}</span>
                        )}
                        {!key.returnDate && !key.dueDate && <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {getStatusIcon(key.status)}
                          <span className={getStatusBadge(key.status)}>{key.status}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-3 max-h-96 overflow-y-auto">
            {filteredKeys.map(key => (
              <div key={key.id} className={cn('glass-card p-4 space-y-2', key.status === 'overdue' && 'ring-1 ring-tahoe-red/20')}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold">{key.keyId}</span>
                  <span className={getTypeBadgeClass(key.type)}>{getTypeLabel(key.type)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{key.assignee ?? 'Unassigned'}</span>
                  <div className="flex items-center gap-1">{getStatusIcon(key.status)}<span className={getStatusBadge(key.status)}>{key.status}</span></div>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {key.property} · Unit {key.unit}
                  {key.dueDate && <span className={key.status === 'overdue' ? 'text-tahoe-red' : ''}> · Due: {key.dueDate}</span>}
                </div>
              </div>
            ))}
          </div>

          {filteredKeys.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Key className="size-10 text-muted-foreground/40 mb-3" />
              <p className="tahoe-body text-muted-foreground">No keys match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
