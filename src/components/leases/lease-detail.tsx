'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  Sparkles,
  FileText,
  CreditCard,
  FolderOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  User,
  Home,
  Shield,
  Percent,
  Hash,
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

import type { LeaseRow } from './lease-card'

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getLeaseStatusBadge(lease: LeaseRow) {
  const daysRemaining = lease.daysRemaining ?? 0

  if (daysRemaining <= 0) {
    return (
      <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800">
        Expired
      </Badge>
    )
  }
  if (lease.isExpiring || daysRemaining <= 90) {
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800">
        Expiring Soon
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary border-primary/20 dark:border-primary/20">
      Active
    </Badge>
  )
}

// ── Circular Progress ────────────────────────────────────────────────────────

function CircularProgress({ value, size = 80, strokeWidth = 6 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const color =
    value >= 90 ? 'stroke-red-500' :
    value >= 70 ? 'stroke-amber-500' :
    'stroke-primary'

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={color}
        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
      />
    </svg>
  )
}

// ── Props ────────────────────────────────────────────────────────────────────

interface LeaseDetailProps {
  lease: LeaseRow
  onBack: () => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function LeaseDetail({ lease, onBack }: LeaseDetailProps) {
  const [activeTab, setActiveTab] = React.useState('overview')
  const daysRemaining = lease.daysRemaining ?? 0
  const totalDays = differenceInDays(new Date(lease.endDate), new Date(lease.startDate))
  const elapsedDays = differenceInDays(new Date(), new Date(lease.startDate))
  const progressPercent = totalDays > 0 ? Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100)) : 0
  const totalLeaseValue = lease.monthlyRent * Math.max(1, Math.ceil(totalDays / 30))

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 w-fit">
          <ArrowLeft className="size-4" />
          Back to Leases
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Avatar & Info */}
        <Avatar className="h-14 w-14 border-2 border-border shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-lg font-bold">
            {lease.tenant ? getInitials(lease.tenant.name) : '?'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {lease.tenant?.name ?? 'Unknown Tenant'}
            </h1>
            {getLeaseStatusBadge(lease)}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              {lease.property?.name ?? 'Unknown Property'}
            </span>
            <span className="flex items-center gap-1.5">
              <Home className="size-3.5" />
              Unit {lease.unit?.unitNumber ?? '—'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-1.5">
            <FileText className="size-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="terms" className="gap-1.5">
            <Shield className="size-3.5" />
            <span className="hidden sm:inline">Terms</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-1.5">
            <CreditCard className="size-3.5" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5">
            <FolderOpen className="size-3.5" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {/* ── Overview Tab ──────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 space-y-6"
            >
              {/* Key Dates & Circular Progress */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Days Remaining with Circular Progress */}
                <Card className="border-border/30 shadow-sm">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      <CircularProgress value={progressPercent} size={72} strokeWidth={5} />
                      <span className="absolute text-sm font-bold">
                        {progressPercent.toFixed(0)}%
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Days Remaining</p>
                      <p className="text-2xl font-bold tracking-tight">{daysRemaining > 0 ? daysRemaining : 0}</p>
                      <p className="text-xs text-muted-foreground">of {totalDays} total days</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Start Date */}
                <Card className="border-border/30 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="size-4 text-primary" />
                      <p className="text-xs font-medium text-muted-foreground">Start Date</p>
                    </div>
                    <p className="text-lg font-bold">{format(new Date(lease.startDate), 'MMM d, yyyy')}</p>
                    <p className="text-xs text-muted-foreground">
                      {differenceInDays(new Date(), new Date(lease.startDate)) > 0
                        ? `${differenceInDays(new Date(), new Date(lease.startDate))} days ago`
                        : 'Starting soon'}
                    </p>
                  </CardContent>
                </Card>

                {/* End Date */}
                <Card className="border-border/30 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="size-4 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs font-medium text-muted-foreground">End Date</p>
                    </div>
                    <p className="text-lg font-bold">{format(new Date(lease.endDate), 'MMM d, yyyy')}</p>
                    <p className="text-xs text-muted-foreground">
                      {daysRemaining > 0 ? `${daysRemaining} days from now` : 'Already expired'}
                    </p>
                  </CardContent>
                </Card>

                {/* Renewal Date */}
                <Card className="border-border/30 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="size-4 text-violet-600 dark:text-violet-400" />
                      <p className="text-xs font-medium text-muted-foreground">Renewal Date</p>
                    </div>
                    <p className="text-lg font-bold">
                      {lease.renewalDate
                        ? format(new Date(lease.renewalDate), 'MMM d, yyyy')
                        : 'Not set'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lease.renewalDate ? 'Renewal scheduled' : 'No renewal scheduled'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Summary */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-border/30 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="size-4 text-primary" />
                      <p className="text-xs font-medium text-muted-foreground">Monthly Rent</p>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(lease.monthlyRent)}</p>
                    <p className="text-xs text-muted-foreground">
                      {lease.type === 'commercial' ? 'Commercial rate' : 'Residential rate'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/30 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="size-4 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs font-medium text-muted-foreground">Security Deposit</p>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(lease.deposit)}</p>
                    <p className="text-xs text-muted-foreground">
                      {lease.deposit > 0 ? `${(lease.deposit / lease.monthlyRent).toFixed(1)}x monthly rent` : 'No deposit'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/30 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="size-4 text-teal-600 dark:text-teal-400" />
                      <p className="text-xs font-medium text-muted-foreground">Total Lease Value</p>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(totalLeaseValue)}</p>
                    <p className="text-xs text-muted-foreground">
                      Over {Math.ceil(totalDays / 30)} months
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Lease Progress */}
              <Card className="border-border/30 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Lease Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {format(new Date(lease.startDate), 'MMM d, yyyy')}
                      </span>
                      <span className="font-medium">
                        {progressPercent.toFixed(0)}% Complete
                      </span>
                      <span className="text-muted-foreground">
                        {format(new Date(lease.endDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-3 text-primary" />
                        {elapsedDays} days elapsed
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-amber-500" />
                        {daysRemaining > 0 ? daysRemaining : 0} days remaining
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="border-violet-200 dark:border-violet-800 shadow-sm bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <Sparkles className="size-4 text-violet-600 dark:text-violet-400" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {daysRemaining <= 90 && daysRemaining > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Lease Expiring Soon</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                          AI recommends reviewing renewal terms and initiating discussions with {lease.tenant?.name ?? 'tenant'}.
                          Consider offering a renewal incentive to retain occupancy.
                        </p>
                      </div>
                    </div>
                  )}
                  {daysRemaining <= 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                      <AlertTriangle className="size-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-300">Lease Expired</p>
                        <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                          This lease has expired. AI recommends initiating move-out procedures or negotiating a lease renewal.
                          Vacant units impact revenue — prioritize resolution.
                        </p>
                      </div>
                    </div>
                  )}
                  {lease.rentEscalation && lease.rentEscalation > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20">
                      <TrendingUp className="size-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-primary dark:text-primary">Rent Escalation Active</p>
                        <p className="text-xs text-primary dark:text-primary mt-0.5">
                          Annual rent escalation of {lease.rentEscalation}% is applied. Next adjustment should be tracked for timely billing updates.
                        </p>
                      </div>
                    </div>
                  )}
                  {daysRemaining > 90 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20">
                      <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-primary dark:text-primary">Lease Healthy</p>
                        <p className="text-xs text-primary dark:text-primary mt-0.5">
                          This lease is in good standing with {daysRemaining} days remaining. AI recommends scheduling a mid-term check-in with the tenant.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── Terms Tab ──────────────────────────────────────────────────── */}
          {activeTab === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 space-y-6"
            >
              {/* Lease Terms */}
              <Card className="border-border/30 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <FileText className="size-4 text-primary" />
                    Lease Agreement Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground">Lease Type</span>
                        <Badge variant="secondary" className="capitalize">{lease.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground">Start Date</span>
                        <span className="text-sm font-medium">{format(new Date(lease.startDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground">End Date</span>
                        <span className="text-sm font-medium">{format(new Date(lease.endDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="text-sm font-medium">{totalDays} days ({Math.ceil(totalDays / 30)} months)</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Renewal Date</span>
                        <span className="text-sm font-medium">
                          {lease.renewalDate ? format(new Date(lease.renewalDate), 'MMM d, yyyy') : 'Not set'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground">Monthly Rent</span>
                        <span className="text-sm font-bold text-primary">{formatCurrency(lease.monthlyRent)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground">Security Deposit</span>
                        <span className="text-sm font-medium">{formatCurrency(lease.deposit)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground">Total Lease Value</span>
                        <span className="text-sm font-bold">{formatCurrency(totalLeaseValue)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground">Rent Escalation</span>
                        <span className="text-sm font-medium">
                          {lease.rentEscalation ? `${lease.rentEscalation}% annually` : 'None'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Status</span>
                        {getLeaseStatusBadge(lease)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rent Escalation Rules */}
              <Card className="border-border/30 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <Percent className="size-4 text-amber-600 dark:text-amber-400" />
                    Rent Escalation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lease.rentEscalation && lease.rentEscalation > 0 ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        This lease includes an annual rent escalation of <span className="font-semibold text-foreground">{lease.rentEscalation}%</span>.
                        The projected rent amounts are:
                      </p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[0, 1, 2].map((year) => {
                          const projectedRent = lease.monthlyRent * Math.pow(1 + lease.rentEscalation! / 100, year)
                          return (
                            <div key={year} className="rounded-lg border border-border/30 p-3 text-center">
                              <p className="text-xs text-muted-foreground">
                                Year {year + 1}
                              </p>
                              <p className="text-lg font-bold mt-1">
                                {formatCurrency(Math.round(projectedRent))}
                              </p>
                              <p className="text-xs text-muted-foreground">/month</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8 text-center">
                      <Percent className="size-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm text-muted-foreground">No rent escalation defined for this lease.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Custom Terms */}
              <Card className="border-border/30 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <FileText className="size-4 text-muted-foreground" />
                    Additional Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lease.terms ? (
                    <div className="rounded-lg border border-border/30 p-4 bg-muted/30">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{lease.terms}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8 text-center">
                      <FileText className="size-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm text-muted-foreground">No additional terms specified for this lease.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── Payments Tab ────────────────────────────────────────────────── */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 space-y-6"
            >
              {/* Payment Summary */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-border/30 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="size-4 text-primary" />
                      <p className="text-xs font-medium text-muted-foreground">Monthly Rent</p>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(lease.monthlyRent)}</p>
                  </CardContent>
                </Card>
                <Card className="border-border/30 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="size-4 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs font-medium text-muted-foreground">Payments Recorded</p>
                    </div>
                    <p className="text-2xl font-bold">{lease.paymentCount ?? 0}</p>
                  </CardContent>
                </Card>
                <Card className="border-border/30 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="size-4 text-teal-600 dark:text-teal-400" />
                      <p className="text-xs font-medium text-muted-foreground">Total Paid</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency((lease.paymentCount ?? 0) * lease.monthlyRent)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Payment History */}
              <Card className="border-border/30 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <CreditCard className="size-4 text-primary" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(lease.paymentCount ?? 0) > 0 ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <CreditCard className="size-10 text-primary/30 mb-3" />
                      <p className="text-sm font-medium text-foreground">
                        {lease.paymentCount} payments linked to this lease
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        View detailed payment records in the Billing module
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8 text-center">
                      <CreditCard className="size-10 text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">No payments recorded for this lease yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── Documents Tab ────────────────────────────────────────────────── */}
          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 space-y-6"
            >
              <Card className="border-border/30 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <FolderOpen className="size-4 text-primary" />
                    Lease Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
                      <FolderOpen className="size-8 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">No documents yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Upload lease agreements, addendums, or other related documents to keep everything organized.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contract Summary */}
              <Card className="border-border/30 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <FileText className="size-4 text-amber-600 dark:text-amber-400" />
                    Contract Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground">Contract Type</span>
                      <Badge variant="secondary" className="capitalize">{lease.type} Lease</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground">Property</span>
                      <span className="text-sm font-medium">{lease.property?.name ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground">Unit</span>
                      <span className="text-sm font-medium">Unit {lease.unit?.unitNumber ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground">Tenant</span>
                      <span className="text-sm font-medium">{lease.tenant?.name ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="text-sm font-medium">{format(new Date(lease.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </motion.div>
  )
}
