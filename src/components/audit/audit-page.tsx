'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Filter,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ── Types ──────────────────────────────────────────────────────────────────────

interface AuditLogUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuditLogEntry {
  id: string
  action: string
  entity: string
  entityId: string | null
  userId: string | null
  workspaceId: string
  clientId: string | null
  ipAddress: string | null
  userAgent: string | null
  details: string | null
  severity: string
  createdAt: string
  user: AuditLogUser | null
  workspace: { id: string; name: string } | null
  client: { id: string; companyName: string } | null
}

interface AuditStats {
  totalLogs: number
  warningCount: number
  errorCount: number
  criticalCount: number
  recentCount: number
  byEntity: { entity: string; count: number }[]
}

// ── Utility ────────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays === 1) {
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    return `Yesterday at ${timeStr}`
  }
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getSeverityConfig(severity: string) {
  switch (severity) {
    case 'info':
      return { label: 'Info', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400', dot: 'bg-sky-500' }
    case 'warning':
      return { label: 'Warning', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' }
    case 'error':
      return { label: 'Error', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' }
    case 'critical':
      return { label: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500', pulse: true }
    default:
      return { label: severity, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', dot: 'bg-gray-500' }
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getEntityIcon(entity: string): string {
  const icons: Record<string, string> = {
    user: '👤',
    property: '🏢',
    tenant: '👥',
    lease: '📋',
    payment: '💳',
    ticket: '🔧',
    client: '🏛️',
    device: '🖥️',
    invoice: '📄',
    workspace: '🏗️',
    document: '📁',
  }
  return icons[entity.toLowerCase()] || '📌'
}

// ── Severity Badge ─────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const config = getSeverityConfig(severity)
  return (
    <Badge
      variant="secondary"
      className={`inline-flex items-center gap-1.5 font-medium text-xs px-2 py-0.5 ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  )
}

// ── User Avatar ────────────────────────────────────────────────────────────────

function UserAvatar({ name }: { name: string }) {
  const initials = getInitials(name)
  return (
    <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
        {initials}
      </span>
    </div>
  )
}

// ── Stats Cards ────────────────────────────────────────────────────────────────

function StatsCards({ stats }: { stats: AuditStats }) {
  const cards = [
    {
      label: 'Total Events',
      value: stats.totalLogs,
      icon: Activity,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Warnings',
      value: stats.warningCount,
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Errors',
      value: stats.errorCount,
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Critical',
      value: stats.criticalCount,
      icon: ShieldAlert,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-xl ${card.bgColor}`}>
                <card.icon className={`size-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold tracking-tight">{card.value.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ── Expandable Row ─────────────────────────────────────────────────────────────

function AuditRow({ log, isExpanded, onToggle }: { log: AuditLogEntry; isExpanded: boolean; onToggle: () => void }) {
  return (
    <motion.div layout className="border-b border-border/50 last:border-b-0">
      <div
        className="grid grid-cols-[1fr_1.2fr_0.8fr_0.6fr_1fr_0.8fr_0.7fr_40px] items-center gap-2 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        {/* Timestamp */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate font-mono">
            {formatRelativeTime(log.createdAt)}
          </span>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm">{getEntityIcon(log.entity)}</span>
          <span className="text-sm font-medium truncate">{log.action}</span>
        </div>

        {/* Entity */}
        <div className="min-w-0">
          <Badge variant="outline" className="text-xs font-mono truncate max-w-full">
            {log.entity}
          </Badge>
        </div>

        {/* Entity ID */}
        <div className="min-w-0">
          {log.entityId ? (
            <span className="text-xs font-mono text-muted-foreground truncate block">
              {log.entityId.slice(0, 8)}…
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2 min-w-0">
          {log.user ? (
            <>
              <UserAvatar name={log.user.name} />
              <span className="text-sm truncate">{log.user.name}</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">System</span>
          )}
        </div>

        {/* IP Address */}
        <div className="min-w-0">
          <span className="text-xs font-mono text-muted-foreground truncate block">
            {log.ipAddress || '—'}
          </span>
        </div>

        {/* Severity */}
        <div className="min-w-0">
          <SeverityBadge severity={log.severity} />
        </div>

        {/* Expand toggle */}
        <div className="flex justify-center">
          {isExpanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-14">
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
                {/* Details row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {log.details && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Details</p>
                      <p className="text-sm">{log.details}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Timestamp (UTC)</p>
                    <p className="text-sm font-mono">
                      {new Date(log.createdAt).toISOString()}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {log.entityId && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Entity ID</p>
                      <p className="text-xs font-mono bg-background px-2 py-1 rounded">{log.entityId}</p>
                    </div>
                  )}
                  {log.ipAddress && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">IP Address</p>
                      <p className="text-xs font-mono bg-background px-2 py-1 rounded">{log.ipAddress}</p>
                    </div>
                  )}
                  {log.userAgent && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">User Agent</p>
                      <p className="text-xs font-mono bg-background px-2 py-1 rounded truncate" title={log.userAgent}>
                        {log.userAgent}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {log.workspace && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Workspace</p>
                      <p className="text-sm">{log.workspace.name}</p>
                    </div>
                  )}
                  {log.client && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Client</p>
                      <p className="text-sm">{log.client.companyName}</p>
                    </div>
                  )}
                  {log.user && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">User Role</p>
                      <p className="text-sm capitalize">{log.user.role}</p>
                    </div>
                  )}
                </div>

                {/* Full JSON details */}
                {log.details && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Raw Details</p>
                    <pre className="text-xs font-mono bg-background p-3 rounded-lg overflow-x-auto max-h-48 overflow-y-auto border border-border/50">
                      {(() => {
                        try {
                          return JSON.stringify(JSON.parse(log.details), null, 2)
                        } catch {
                          return log.details
                        }
                      })()}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main Audit Page ────────────────────────────────────────────────────────────

export function AuditPage() {
  const [logs, setLogs] = React.useState<AuditLogEntry[]>([])
  const [stats, setStats] = React.useState<AuditStats | null>(null)
  const [users, setUsers] = React.useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = React.useState(true)
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

  // Filters
  const [search, setSearch] = React.useState('')
  const [entity, setEntity] = React.useState('all')
  const [severity, setSeverity] = React.useState('all')
  const [dateRange, setDateRange] = React.useState('30d')
  const [userFilter, setUserFilter] = React.useState('all')

  // Pagination
  const [page, setPage] = React.useState(0)
  const [total, setTotal] = React.useState(0)
  const limit = 20

  const fetchLogs = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (entity !== 'all') params.set('entity', entity)
      if (severity !== 'all') params.set('severity', severity)
      if (dateRange) params.set('dateRange', dateRange)
      if (userFilter !== 'all') params.set('userId', userFilter)
      params.set('limit', String(limit))
      params.set('offset', String(page * limit))

      const res = await fetch(`/api/audit?${params}`)
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs || [])
        setTotal(data.pagination?.total || 0)
        if (data.stats) setStats(data.stats)
        if (data.users) setUsers(data.users)
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err)
    } finally {
      setLoading(false)
    }
  }, [search, entity, severity, dateRange, userFilter, page])

  React.useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Reset page when filters change
  React.useEffect(() => {
    setPage(0)
  }, [search, entity, severity, dateRange, userFilter])

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const totalPages = Math.ceil(total / limit)

  const handleExport = () => {
    const csvRows = [
      ['Timestamp', 'Action', 'Entity', 'Entity ID', 'User', 'IP Address', 'Severity', 'Details'].join(','),
      ...logs.map((log) =>
        [
          new Date(log.createdAt).toISOString(),
          log.action,
          log.entity,
          log.entityId || '',
          log.user?.name || 'System',
          log.ipAddress || '',
          log.severity,
          `"${(log.details || '').replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ]
    const csv = csvRows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const entityOptions = ['All', 'User', 'Property', 'Tenant', 'Lease', 'Payment', 'Ticket', 'Client', 'Device', 'Invoice', 'Document', 'Workspace']

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
            <p className="text-sm text-muted-foreground">
              Track all system activities and security events
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="size-4" />
          Export Log
        </Button>
      </div>

      {/* ── Stats Row ── */}
      {stats && <StatsCards stats={stats} />}

      {/* ── Filter Bar ── */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search actions, entities, details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            {/* Entity Type */}
            <Select value={entity} onValueChange={setEntity}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                {entityOptions.map((opt) => (
                  <SelectItem key={opt.toLowerCase()} value={opt.toLowerCase()}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Severity */}
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>

            {/* User Filter */}
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Audit Table ── */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1.2fr_0.8fr_0.6fr_1fr_0.8fr_0.7fr_40px] items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border/50 text-xs font-medium text-muted-foreground">
          <span>Timestamp</span>
          <span>Action</span>
          <span>Entity</span>
          <span>ID</span>
          <span>User</span>
          <span>IP Address</span>
          <span>Severity</span>
          <span></span>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="size-5 animate-pulse" />
              <span className="text-sm">Loading audit logs...</span>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
              <ShieldCheck className="size-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground">No Audit Logs Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or date range
            </p>
          </div>
        ) : (
          <div className="divide-y-0">
            {logs.map((log) => (
              <AuditRow
                key={log.id}
                log={log}
                isExpanded={expandedRows.has(log.id)}
                onToggle={() => toggleRow(log.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {page * limit + 1}–{Math.min((page + 1) * limit, total)} of{' '}
              {total.toLocaleString()} events
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="gap-1"
              >
                <ChevronLeft className="size-4" />
                Prev
              </Button>
              <div className="flex items-center gap-1 px-2">
                <span className="text-sm font-medium">{page + 1}</span>
                <span className="text-sm text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ── Footer Note ── */}
      <div className="flex items-center justify-center gap-2 py-2">
        <ShieldCheck className="size-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Audit logs are immutable and retained for compliance purposes
        </p>
      </div>
    </motion.div>
  )
}
