'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  AlertTriangle,
  DollarSign,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Circle,
  XCircle,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { AddPolicyDialog } from './add-policy-dialog'

// ── Mock Data ────────────────────────────────────────────────────────────────

interface Policy {
  id: string
  policyNumber: string
  provider: string
  type: string
  premium: number
  deductible: number
  coverage: number
  startDate: string
  endDate: string
  status: string
  property?: string
}

const POLICIES: Policy[] = [
  { id: 'p1', policyNumber: 'PROP-2025-001', provider: 'State Farm', type: 'property', premium: 18000, deductible: 5000, coverage: 2500000, startDate: '2025-01-01', endDate: '2025-12-31', status: 'active', property: 'All Properties' },
  { id: 'p2', policyNumber: 'LIAB-2025-002', provider: 'Liberty Mutual', type: 'liability', premium: 8500, deductible: 2000, coverage: 1000000, startDate: '2025-01-01', endDate: '2025-12-31', status: 'active' },
  { id: 'p3', policyNumber: 'WC-2025-003', provider: 'Hartford', type: 'workers_comp', premium: 6200, deductible: 1000, coverage: 500000, startDate: '2025-01-01', endDate: '2025-12-31', status: 'active' },
  { id: 'p4', policyNumber: 'FLD-2025-004', provider: 'FEMA/NFIP', type: 'flood', premium: 3400, deductible: 10000, coverage: 500000, startDate: '2025-01-01', endDate: '2025-12-31', status: 'active', property: 'Harbor View Residences' },
  { id: 'p5', policyNumber: 'UMB-2025-005', provider: 'Chubb', type: 'umbrella', premium: 4200, deductible: 0, coverage: 5000000, startDate: '2025-03-01', endDate: '2026-02-28', status: 'active' },
  { id: 'p6', policyNumber: 'PROP-2024-006', provider: 'State Farm', type: 'property', premium: 16500, deductible: 5000, coverage: 2200000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'expired' },
]

const COMPLIANCE_ITEMS = [
  { id: 'c1', label: 'Fire Safety Inspection', status: 'completed', dueDate: '2025-02-15', property: 'All Properties' },
  { id: 'c2', label: 'ADA Compliance Audit', status: 'completed', dueDate: '2025-01-30', property: 'Skyline Tower' },
  { id: 'c3', label: 'Lead Paint Disclosure', status: 'pending', dueDate: '2025-04-01', property: 'Greenfield Gardens' },
  { id: 'c4', label: 'CO Detector Installation', status: 'pending', dueDate: '2025-03-30', property: 'Harbor View Residences' },
  { id: 'c5', label: 'Building Permit Renewal', status: 'overdue', dueDate: '2025-02-28', property: 'Metro Commercial Hub' },
  { id: 'c6', label: 'Elevator Certification', status: 'pending', dueDate: '2025-05-15', property: 'Skyline Tower' },
  { id: 'c7', label: 'Emergency Exit Signage', status: 'completed', dueDate: '2025-01-10', property: 'All Properties' },
  { id: 'c8', label: 'Asbestos Inspection', status: 'overdue', dueDate: '2025-03-01', property: 'Oakwood Estates' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount}`
}

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    property: 'Property',
    liability: 'Liability',
    workers_comp: 'Workers Comp',
    flood: 'Flood',
    umbrella: 'Umbrella',
  }
  return map[type] ?? type
}

function getTypeBadgeVariant(type: string): 'default' | 'secondary' | 'outline' {
  const map: Record<string, 'default' | 'secondary' | 'outline'> = {
    property: 'default',
    liability: 'secondary',
    workers_comp: 'outline',
    flood: 'secondary',
    umbrella: 'outline',
  }
  return map[type] ?? 'secondary'
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-0 text-[11px]">Active</Badge>
    case 'expired':
      return <Badge className="bg-muted text-muted-foreground border-0 text-[11px]">Expired</Badge>
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-0 text-[11px]">Pending</Badge>
    default:
      return <Badge variant="outline" className="text-[11px]">{status}</Badge>
  }
}

function getComplianceIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
    case 'pending':
      return <Circle className="size-4 text-amber-500 dark:text-amber-400" />
    case 'overdue':
      return <XCircle className="size-4 text-red-500 dark:text-red-400" />
    default:
      return <Circle className="size-4 text-muted-foreground" />
  }
}

function getComplianceBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-0 text-[11px]">Completed</Badge>
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-0 text-[11px]">Pending</Badge>
    case 'overdue':
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-0 text-[11px]">Overdue</Badge>
    default:
      return <Badge variant="outline" className="text-[11px]">{status}</Badge>
  }
}

function getDaysUntilExpiry(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

// ── Stats Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  index: number
}

function StatCard({ title, value, subtitle, icon: Icon, iconColor, iconBg, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="mojave-card border-border/40 bg-card/80 group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
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

// ── Main Insurance Page ─────────────────────────────────────────────────────

export function InsurancePage() {
  const [addPolicyOpen, setAddPolicyOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')

  // Stats
  const activePolicies = POLICIES.filter((p) => p.status === 'active').length
  const totalCoverage = POLICIES.filter((p) => p.status === 'active').reduce((sum, p) => sum + p.coverage, 0)
  const annualPremium = POLICIES.filter((p) => p.status === 'active').reduce((sum, p) => sum + p.premium, 0)
  const expiringSoon = POLICIES.filter((p) => {
    if (p.status !== 'active') return false
    const days = getDaysUntilExpiry(p.endDate)
    return days <= 90 && days > 0
  }).length

  // Filter policies
  const filteredPolicies = POLICIES.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTypeLabel(p.type).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.property && p.property.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = typeFilter === 'all' || p.type === typeFilter
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  // Compliance stats
  const complianceCompleted = COMPLIANCE_ITEMS.filter((c) => c.status === 'completed').length
  const compliancePending = COMPLIANCE_ITEMS.filter((c) => c.status === 'pending').length
  const complianceOverdue = COMPLIANCE_ITEMS.filter((c) => c.status === 'overdue').length
  const complianceRate = Math.round((complianceCompleted / COMPLIANCE_ITEMS.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Insurance & Compliance
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage policies, coverage, and regulatory compliance
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setAddPolicyOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Policy</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Policies"
          value={String(activePolicies)}
          subtitle={`${POLICIES.length} total policies`}
          icon={Shield}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          index={0}
        />
        <StatCard
          title="Total Coverage"
          value={formatCurrencyCompact(totalCoverage)}
          subtitle="Across all active policies"
          icon={DollarSign}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
          index={1}
        />
        <StatCard
          title="Annual Premium"
          value={formatCurrency(annualPremium)}
          subtitle="Total yearly cost"
          icon={Calendar}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/40"
          index={2}
        />
        <StatCard
          title="Expiring Soon"
          value={String(expiringSoon)}
          subtitle="Within 90 days"
          icon={AlertTriangle}
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-50 dark:bg-red-950/40"
          index={3}
        />
      </div>

      {/* Policies Table */}
      <Card className="mojave-card border-border/40 bg-card/80">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">Insurance Policies</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredPolicies.length} policies · {activePolicies} active
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 w-[180px] text-sm"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-sm text-foreground"
              >
                <option value="all">All Types</option>
                <option value="property">Property</option>
                <option value="liability">Liability</option>
                <option value="workers_comp">Workers Comp</option>
                <option value="flood">Flood</option>
                <option value="umbrella">Umbrella</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-sm text-foreground"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Policy #</th>
                  <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Provider</th>
                  <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-right py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Premium</th>
                  <th className="text-right py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Deductible</th>
                  <th className="text-right py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Coverage</th>
                  <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Dates</th>
                  <th className="text-center py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.map((policy) => {
                  const daysLeft = getDaysUntilExpiry(policy.endDate)
                  const isExpiring = policy.status === 'active' && daysLeft <= 90 && daysLeft > 0

                  return (
                    <tr
                      key={policy.id}
                      className="border-b border-border/30 transition-colors hover:bg-muted/30"
                    >
                      <td className="py-3 px-3">
                        <span className="font-mono text-xs font-medium text-foreground">{policy.policyNumber}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-foreground">{policy.provider}</span>
                        {policy.property && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">{policy.property}</p>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={getTypeBadgeVariant(policy.type)} className="text-[11px]">
                          {getTypeLabel(policy.type)}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-foreground">
                        {formatCurrency(policy.premium)}
                      </td>
                      <td className="py-3 px-3 text-right text-muted-foreground">
                        {policy.deductible > 0 ? formatCurrency(policy.deductible) : '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-foreground">
                        {formatCurrencyCompact(policy.coverage)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-xs">
                          <span className="text-foreground">{policy.startDate}</span>
                          <span className="text-muted-foreground"> → </span>
                          <span className={isExpiring ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-foreground'}>
                            {policy.endDate}
                          </span>
                          {isExpiring && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                              {daysLeft}d remaining
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {getStatusBadge(policy.status)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {filteredPolicies.map((policy) => {
              const daysLeft = getDaysUntilExpiry(policy.endDate)
              const isExpiring = policy.status === 'active' && daysLeft <= 90 && daysLeft > 0

              return (
                <div
                  key={policy.id}
                  className="rounded-xl border border-border/40 bg-card/50 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium">{policy.policyNumber}</span>
                      {getStatusBadge(policy.status)}
                    </div>
                    <Badge variant={getTypeBadgeVariant(policy.type)} className="text-[11px]">
                      {getTypeLabel(policy.type)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{policy.provider}</span>
                    <span className="font-medium">{formatCurrency(policy.premium)}/yr</span>
                  </div>
                  {policy.property && (
                    <p className="text-[11px] text-muted-foreground">{policy.property}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Coverage: {formatCurrencyCompact(policy.coverage)}</span>
                    <span>Deductible: {policy.deductible > 0 ? formatCurrency(policy.deductible) : '—'}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {policy.startDate} → {policy.endDate}
                    {isExpiring && (
                      <span className="ml-1 text-amber-600 dark:text-amber-400 font-medium">
                        ({daysLeft}d left)
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredPolicies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="size-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No policies found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Checklist */}
      <Card className="mojave-card border-border/40 bg-card/80">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">Compliance Checklist</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {complianceCompleted} of {COMPLIANCE_ITEMS.length} items completed · {complianceRate}% compliance rate
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {complianceCompleted} done
              </span>
              <span className="flex items-center gap-1.5">
                <Circle className="size-3.5 text-amber-500 dark:text-amber-400" />
                {compliancePending} pending
              </span>
              <span className="flex items-center gap-1.5">
                <XCircle className="size-3.5 text-red-500 dark:text-red-400" />
                {complianceOverdue} overdue
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {COMPLIANCE_ITEMS.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  item.status === 'overdue' ? 'bg-red-50/50 dark:bg-red-950/20' :
                  item.status === 'pending' ? 'bg-amber-50/50 dark:bg-amber-950/20' :
                  'hover:bg-muted/30'
                )}
              >
                {getComplianceIcon(item.status)}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium',
                    item.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'
                  )}>
                    {item.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.property} · Due {item.dueDate}
                  </p>
                </div>
                {getComplianceBadge(item.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Policy Dialog */}
      <AddPolicyDialog
        open={addPolicyOpen}
        onOpenChange={setAddPolicyOpen}
      />
    </motion.div>
  )
}
