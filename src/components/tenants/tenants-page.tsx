'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Users,
  Filter,
  LayoutGrid,
  LayoutList,
  UserPlus,
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
import { useTenantStore } from '@/stores'
import type { Tenant } from '@/stores/tenant-store'

import { TenantTable, type TenantRow } from './tenant-table'
import { TenantProfile } from './tenant-profile'
import { AddTenantDialog } from './add-tenant-dialog'

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ── Skeleton Loader ──────────────────────────────────────────────────────────

function TenantsPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-6 w-8 bg-muted rounded-full" />
        </div>
        <div className="h-9 w-32 bg-muted rounded-md" />
      </div>
      {/* Filter bar skeleton */}
      <div className="flex gap-3">
        <div className="h-9 w-64 bg-muted rounded-md" />
        <div className="h-9 w-32 bg-muted rounded-md" />
        <div className="h-9 w-32 bg-muted rounded-md" />
      </div>
      {/* Table skeleton */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="h-11 bg-muted/50" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`h-14 border-b flex items-center px-4 gap-4 ${i % 2 === 1 ? 'bg-muted/20' : ''}`}>
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-40 bg-muted rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

export function TenantsPage() {
  const { tenants, selectedTenant, isLoading, fetchTenants, selectTenant, clearSelection } = useTenantStore()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [isSeeding, setIsSeeding] = React.useState(false)

  // Fetch tenants on mount
  React.useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  // Apply filters
  const filteredTenants = React.useMemo(() => {
    let result = tenants as TenantRow[]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.email.toLowerCase().includes(query) ||
          (t.phone && t.phone.toLowerCase().includes(query)) ||
          (t.company && t.company.toLowerCase().includes(query))
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter)
    }

    return result
  }, [tenants, searchQuery, typeFilter, statusFilter])

  // Active/Inactive counts
  const activeCount = tenants.filter((t) => t.status === 'active').length
  const inactiveCount = tenants.filter((t) => t.status === 'inactive').length

  // Handle seeding if no data
  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch('/api/seed')
      if (response.ok) {
        await fetchTenants()
      }
    } catch (error) {
      console.error('Seed failed:', error)
    } finally {
      setIsSeeding(false)
    }
  }

  // Handle row click → show profile
  const handleRowClick = (tenant: TenantRow) => {
    selectTenant(tenant.id)
  }

  // Handle back from profile
  const handleBackToList = () => {
    clearSelection()
  }

  // Tenant profile data with extended fields
  const selectedTenantExtended = selectedTenant
    ? (tenants.find((t) => t.id === selectedTenant.id) as TenantRow | undefined)
    : null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {selectedTenantExtended ? (
            // ── Profile View ──────────────────────────────────────────────
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TenantProfile
                tenant={selectedTenantExtended}
                onBack={handleBackToList}
              />
            </motion.div>
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
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold">Tenants</h1>
                    <p className="text-sm text-muted-foreground">
                      Manage your tenants, leases, and payments
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2 text-xs font-semibold tabular-nums">
                    {tenants.length}
                  </Badge>
                </div>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  className="gap-2 shadow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Tenant
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    statusFilter === 'all' ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                  }`}
                >
                  <p className="text-2xl font-bold">{tenants.length}</p>
                  <p className="text-xs text-muted-foreground">Total Tenants</p>
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    statusFilter === 'active' ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                  }`}
                >
                  <p className="text-2xl font-bold text-primary">{activeCount}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    statusFilter === 'inactive' ? 'bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-700' : 'hover:bg-muted/50'
                  }`}
                >
                  <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">{inactiveCount}</p>
                  <p className="text-xs text-muted-foreground">Inactive</p>
                </button>
                <div className="rounded-lg border p-3 text-left">
                  <p className="text-2xl font-bold">
                    {tenants.length > 0 ? Math.round((activeCount / tenants.length) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 w-full sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tenants by name, email, phone..."
                    className="pl-9 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {(searchQuery || typeFilter !== 'all' || statusFilter !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 text-xs"
                      onClick={() => {
                        setSearchQuery('')
                        setTypeFilter('all')
                        setStatusFilter('all')
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Tenant Table / Empty State */}
              {isLoading && tenants.length === 0 ? (
                <TenantsPageSkeleton />
              ) : tenants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">No tenants yet</h3>
                  <p className="text-sm mb-6 max-w-sm text-center">
                    Get started by adding your first tenant, or seed the database with demo data.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add Tenant
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
              ) : (
                <TenantTable
                  data={filteredTenants}
                  onRowClick={handleRowClick}
                  isLoading={isLoading && tenants.length > 0}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Tenant Dialog */}
        <AddTenantDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onTenantAdded={() => fetchTenants()}
        />
      </div>
    </div>
  )
}
