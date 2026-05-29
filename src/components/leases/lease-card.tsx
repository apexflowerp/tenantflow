'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  DollarSign,
  Clock,
  Building2,
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import type { Lease } from '@/stores/lease-store'

// ── Extended Lease type (from API) ────────────────────────────────────────────

export interface LeaseRow extends Lease {
  daysRemaining?: number
  isExpiring?: boolean
  paymentCount?: number
  property?: {
    id: string
    name: string
    address: string
    city?: string
    type?: string
  } | null
  unit?: {
    id: string
    unitNumber: string
    type: string
    bedrooms?: number
    bathrooms?: number
    area?: number
    rent?: number
  } | null
  tenant?: {
    id: string
    name: string
    email: string
    phone?: string
    type?: string
    company?: string
    avatar: string | null
  } | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getLeaseStatusInfo(lease: LeaseRow): {
  label: string
  className: string
} {
  const daysRemaining = lease.daysRemaining ?? 0

  if (daysRemaining <= 0) {
    return {
      label: 'Expired',
      className: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800',
    }
  }
  if (lease.isExpiring || daysRemaining <= 90) {
    return {
      label: 'Expiring Soon',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    }
  }
  return {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  }
}

function getDaysRemainingProgress(lease: LeaseRow): number {
  const start = new Date(lease.startDate)
  const end = new Date(lease.endDate)
  const now = new Date()

  const totalDays = differenceInDays(end, start)
  const elapsedDays = differenceInDays(now, start)

  if (totalDays <= 0) return 0
  const progress = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100))
  return progress
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ── Props ────────────────────────────────────────────────────────────────────

interface LeaseCardProps {
  lease: LeaseRow
  index?: number
  onClick?: () => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function LeaseCard({ lease, index = 0, onClick }: LeaseCardProps) {
  const statusInfo = getLeaseStatusInfo(lease)
  const progress = getDaysRemainingProgress(lease)
  const daysRemaining = lease.daysRemaining ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      <button
        onClick={onClick}
        className="w-full text-left rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border hover:bg-accent/30 group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Tenant Info */}
          <div className="flex items-center gap-3 sm:w-[240px] shrink-0">
            <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs font-semibold">
                {lease.tenant ? getInitials(lease.tenant.name) : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {lease.tenant?.name ?? 'Unknown Tenant'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {lease.tenant?.email ?? ''}
              </p>
            </div>
          </div>

          {/* Property & Unit */}
          <div className="flex items-center gap-2 sm:w-[220px] shrink-0">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Building2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {lease.property?.name ?? 'Unknown Property'}
              </p>
              <p className="text-xs text-muted-foreground">
                Unit {lease.unit?.unitNumber ?? '—'}
                {lease.unit?.type ? ` · ${lease.unit.type}` : ''}
              </p>
            </div>
          </div>

          {/* Lease Period */}
          <div className="flex items-center gap-2 sm:w-[180px] shrink-0">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {format(new Date(lease.startDate), 'MMM d, yyyy')}
              </p>
              <p className="text-xs text-muted-foreground">
                to {format(new Date(lease.endDate), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Monthly Rent */}
          <div className="flex items-center gap-2 sm:w-[120px] shrink-0">
            <DollarSign className="size-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground">
                {formatCurrency(lease.monthlyRent)}
              </p>
              <p className="text-xs text-muted-foreground">/month</p>
            </div>
          </div>

          {/* Status + Days Remaining */}
          <div className="flex items-center gap-3 sm:ml-auto shrink-0">
            <Badge variant="outline" className={`text-xs font-semibold ${statusInfo.className}`}>
              {statusInfo.label}
            </Badge>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Clock className="size-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {daysRemaining > 0 ? `${daysRemaining}d left` : 'Expired'}
                        </span>
                      </div>
                      <Progress
                        value={progress}
                        className="h-1.5 bg-muted"
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{progress.toFixed(0)}% of lease elapsed</p>
                  <p className="text-xs text-muted-foreground">
                    {daysRemaining > 0
                      ? `${daysRemaining} days remaining`
                      : 'Lease has expired'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

export function LeaseCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 sm:w-[240px]">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-28 bg-muted rounded" />
            <div className="h-3 w-36 bg-muted rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:w-[220px]">
          <div className="h-8 w-8 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:w-[180px]">
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:w-[120px]">
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="space-y-2">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-3 w-12 bg-muted rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3 sm:ml-auto">
          <div className="h-5 w-20 bg-muted rounded-full" />
          <div className="space-y-1.5 min-w-[100px]">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-1.5 w-full bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
