'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  FileText,
  LayoutGrid,
  LayoutList,
  Clock,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useLeaseStore } from '@/stores'

import { LeaseCard, LeaseCardSkeleton, type LeaseRow } from './lease-card'
import { LeaseDetail } from './lease-detail'
import { CreateLeaseDialog } from './create-lease-dialog'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getLeaseComputedStatus(lease: LeaseRow): 'active' | 'expiring' | 'expired' {
  const daysRemaining = lease.daysRemaining ?? 0
  if (daysRemaining <= 0) return 'expired'
  if (lease.isExpiring || daysRemaining <= 90) return 'expiring'
  return 'active'
}

// ── Skeleton Loader ──────────────────────────────────────────────────────────

function LeasesPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
          </div>
          <div className="h-6 w-8 bg-muted rounded-full" />
        </div>
        <div className="h-9 w-36 bg-muted rounded-md" />
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-2">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-7 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
      {/* Filter bar skeleton */}
      <div className="flex gap-3">
        <div className="h-9 w-64 bg-muted rounded-md" />
        <div className="h-9 w-36 bg-muted rounded-md" />
        <div className="h-9 w-36 bg-muted rounded-md" />
      </div>
      {/* Lease cards skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <LeaseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// ── Kanban Card ──────────────────────────────────────────────────────────────

function KanbanCard({ lease, onClick }: { lease: LeaseRow; onClick: () => void }) {
  const daysRemaining = lease.daysRemaining ?? 0
  const computedStatus = getLeaseComputedStatus(lease)

  const statusColors = {
    active: 'border-l-primary',
    expiring: 'border-l-amber-500',
    expired: 'border-l-red-500',
  }

  const statusBadge = {
    active: 'bg-primary/10 text-primary border-primary/20 dark:border-primary/30',
    expiring: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    expired: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800',
  }

  const statusLabel = {
    active: 'Active',
    expiring: 'Expiring Soon',
    expired: 'Expired',
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`w-full text-left rounded-lg border border-border/60 border-l-4 ${statusColors[computedStatus]} bg-card p-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-accent/30`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground truncate">
            {lease.tenant?.name ?? 'Unknown'}
          </p>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusBadge[computedStatus]}`}>
            {statusLabel[computedStatus]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {lease.property?.name ?? '—'} · Unit {lease.unit?.unitNumber ?? '—'}
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">{formatCurrency(lease.monthlyRent)}/mo</span>
          <span className="text-muted-foreground">
            {daysRemaining > 0 ? `${daysRemaining}d left` : 'Expired'}
          </span>
        </div>
      </div>
    </motion.button>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

export function LeasesPage() {
  const { leases, selectedLease, isLoading, fetchLeases, selectLease, clearSelection } = useLeaseStore()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<'list' | 'kanban'>('list')
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [isSeeding, setIsSeeding] = React.useState(false)

  // Fetch leases on mount
  React.useEffect(() => {
    fetchLeases()
  }, [fetchLeases])

  // Cast leases to LeaseRow for extended fields
  const leaseRows = leases as unknown as LeaseRow[]

  // Apply filters
  const filteredLeases = React.useMemo(() => {
    let result = leaseRows

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (l) =>
          (l.tenant?.name ?? '').toLowerCase().includes(query) ||
          (l.tenant?.email ?? '').toLowerCase().includes(query) ||
          (l.property?.name ?? '').toLowerCase().includes(query) ||
          (l.unit?.unitNumber ?? '').toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((l) => {
        const computed = getLeaseComputedStatus(l)
        return computed === statusFilter
      })
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((l) => l.type === typeFilter)
    }

    return result
  }, [leaseRows, searchQuery, statusFilter, typeFilter])

  // Stats
  const activeLeases = leaseRows.filter((l) => getLeaseComputedStatus(l) === 'active')
  const expiringLeases = leaseRows.filter((l) => getLeaseComputedStatus(l) === 'expiring')
  const expiredLeases = leaseRows.filter((l) => getLeaseComputedStatus(l) === 'expired')
  const totalMonthlyRent = leaseRows.reduce((sum, l) => sum + l.monthlyRent, 0)
  const avgDuration = leaseRows.length > 0
    ? Math.round(
        leaseRows.reduce((sum, l) => {
          const days = Math.ceil(
            (new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / (1000 * 60 * 60 * 24)
          )
          return sum + days
        }, 0) / leaseRows.length / 30
      )
    : 0

  // Handle seeding
  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch('/api/seed')
      if (response.ok) {
        await fetchLeases()
      }
    } catch (error) {
      console.error('Seed failed:', error)
    } finally {
      setIsSeeding(false)
    }
  }

  // Handle lease selection
  const handleLeaseClick = (lease: LeaseRow) => {
    selectLease(lease.id)
  }

  // Handle back from detail
  const handleBackToList = () => {
    clearSelection()
  }

  // Get the full selected lease with API fields
  const selectedLeaseFull = selectedLease
    ? (leaseRows.find((l) => l.id === selectedLease.id) as LeaseRow | undefined) ?? null
    : null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {selectedLeaseFull ? (
            // ── Detail View ───────────────────────────────────────────────
            <LeaseDetail
              lease={selectedLeaseFull}
              onBack={handleBackToList}
            />
          ) : (
            // ── List View ─────────────────────────────────────────────────
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold">Leases</h1>
                    <p className="text-sm text-muted-foreground">
                      Manage lease agreements, renewals, and expirations
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2 text-xs font-semibold tabular-nums">
                    {leases.length}
                  </Badge>
                </div>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="gap-2 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Create Lease
                </Button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    statusFilter === 'active'
                      ? 'bg-primary/5 border-primary/20'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="size-4 text-primary" />
                    <p className="text-xs font-medium text-muted-foreground">Active Leases</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{activeLeases.length}</p>
                </button>
                <button
                  onClick={() => setStatusFilter(statusFilter === 'expiring' ? 'all' : 'expiring')}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    statusFilter === 'expiring'
                      ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs font-medium text-muted-foreground">Expiring Soon</p>
                  </div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{expiringLeases.length}</p>
                </button>
                <div className="rounded-lg border p-4 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="size-4 text-teal-600 dark:text-teal-400" />
                    <p className="text-xs font-medium text-muted-foreground">Total Monthly Rent</p>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(totalMonthlyRent)}</p>
                </div>
                <div className="rounded-lg border p-4 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="size-4 text-violet-600 dark:text-violet-400" />
                    <p className="text-xs font-medium text-muted-foreground">Avg. Duration</p>
                  </div>
                  <p className="text-2xl font-bold">{avgDuration}<span className="text-sm font-normal text-muted-foreground ml-1">months</span></p>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 w-full sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leases by tenant, property, unit..."
                    className="pl-9 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expiring">Expiring Soon</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* View Mode Toggle */}
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-9 px-2.5 rounded-r-none"
                      onClick={() => setViewMode('list')}
                    >
                      <LayoutList className="size-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-9 px-2.5 rounded-l-none"
                      onClick={() => setViewMode('kanban')}
                    >
                      <LayoutGrid className="size-4" />
                    </Button>
                  </div>
                  {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 text-xs"
                      onClick={() => {
                        setSearchQuery('')
                        setStatusFilter('all')
                        setTypeFilter('all')
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Lease Content */}
              {isLoading && leases.length === 0 ? (
                <LeasesPageSkeleton />
              ) : leases.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">No leases yet</h3>
                  <p className="text-sm mb-6 max-w-sm text-center">
                    Get started by creating your first lease, or seed the database with demo data.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Lease
                    </Button>
                    <Button variant="outline" onClick={handleSeed} disabled={isSeeding} className="gap-2">
                      {isSeeding ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Seeding...
                        </>
                      ) : (
                        'Load Demo Data'
                      )}
                    </Button>
                  </div>
                </div>
              ) : filteredLeases.length === 0 ? (
                // No results state
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="h-10 w-10 mb-3 text-muted-foreground/40" />
                  <h3 className="text-base font-semibold text-foreground mb-1">No matching leases</h3>
                  <p className="text-sm max-w-sm text-center">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : viewMode === 'list' ? (
                // ── List View ───────────────────────────────────────────
                <div className="space-y-3">
                  {filteredLeases.map((lease, index) => (
                    <LeaseCard
                      key={lease.id}
                      lease={lease}
                      index={index}
                      onClick={() => handleLeaseClick(lease)}
                    />
                  ))}
                </div>
              ) : (
                // ── Kanban View ─────────────────────────────────────────
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Active Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <div className="size-2.5 rounded-full bg-primary" />
                      <h3 className="text-sm font-semibold">Active</h3>
                      <Badge variant="secondary" className="text-[10px] ml-auto">
                        {filteredLeases.filter((l) => getLeaseComputedStatus(l) === 'active').length}
                      </Badge>
                    </div>
                    <Card className="border-border/30">
                      <CardContent className="p-3 space-y-2.5 min-h-[200px]">
                        {filteredLeases
                          .filter((l) => getLeaseComputedStatus(l) === 'active')
                          .map((lease) => (
                            <KanbanCard
                              key={lease.id}
                              lease={lease}
                              onClick={() => handleLeaseClick(lease)}
                            />
                          ))}
                        {filteredLeases.filter((l) => getLeaseComputedStatus(l) === 'active').length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                            <CheckCircle2 className="size-6 mb-1" />
                            <p className="text-xs">No active leases</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Expiring Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <div className="size-2.5 rounded-full bg-amber-500" />
                      <h3 className="text-sm font-semibold">Expiring Soon</h3>
                      <Badge variant="secondary" className="text-[10px] ml-auto">
                        {filteredLeases.filter((l) => getLeaseComputedStatus(l) === 'expiring').length}
                      </Badge>
                    </div>
                    <Card className="border-border/30">
                      <CardContent className="p-3 space-y-2.5 min-h-[200px]">
                        {filteredLeases
                          .filter((l) => getLeaseComputedStatus(l) === 'expiring')
                          .map((lease) => (
                            <KanbanCard
                              key={lease.id}
                              lease={lease}
                              onClick={() => handleLeaseClick(lease)}
                            />
                          ))}
                        {filteredLeases.filter((l) => getLeaseComputedStatus(l) === 'expiring').length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                            <Clock className="size-6 mb-1" />
                            <p className="text-xs">No expiring leases</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Expired Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <div className="size-2.5 rounded-full bg-red-500" />
                      <h3 className="text-sm font-semibold">Expired</h3>
                      <Badge variant="secondary" className="text-[10px] ml-auto">
                        {filteredLeases.filter((l) => getLeaseComputedStatus(l) === 'expired').length}
                      </Badge>
                    </div>
                    <Card className="border-border/30">
                      <CardContent className="p-3 space-y-2.5 min-h-[200px]">
                        {filteredLeases
                          .filter((l) => getLeaseComputedStatus(l) === 'expired')
                          .map((lease) => (
                            <KanbanCard
                              key={lease.id}
                              lease={lease}
                              onClick={() => handleLeaseClick(lease)}
                            />
                          ))}
                        {filteredLeases.filter((l) => getLeaseComputedStatus(l) === 'expired').length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                            <XCircle className="size-6 mb-1" />
                            <p className="text-xs">No expired leases</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Lease Dialog */}
        <CreateLeaseDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onLeaseCreated={() => fetchLeases()}
        />
      </div>
    </div>
  )
}
