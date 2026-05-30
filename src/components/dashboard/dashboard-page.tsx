'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Home,
  DollarSign,
  AlertTriangle,
  Plus,
  UserPlus,
  FileText,
  Wrench,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useDashboardStore } from '@/stores'
import { KpiCard, KpiCardSkeleton } from './kpi-card'
import { RevenueChart } from './revenue-chart'
import { ActivityFeed } from './activity-feed'
import { BreakdownChart } from './breakdown-chart'

// ── Format Helpers ───────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return '$' + value.toLocaleString('en-US')
}

// ── Quick Actions ────────────────────────────────────────────────────────────

const quickActions = [
  {
    label: 'Add Property',
    icon: Building2,
    color: 'text-primary',
    bg: 'hover:bg-primary/5',
    border: 'hover:border-primary/20',
  },
  {
    label: 'New Tenant',
    icon: UserPlus,
    color: 'text-primary',
    bg: 'hover:bg-primary/5',
    border: 'hover:border-primary/20',
  },
  {
    label: 'Create Lease',
    icon: FileText,
    color: 'text-primary',
    bg: 'hover:bg-primary/5',
    border: 'hover:border-primary/20',
  },
  {
    label: 'Report Issue',
    icon: Wrench,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
    border: 'hover:border-orange-200 dark:hover:border-orange-800',
  },
]

// ── Dashboard Page ───────────────────────────────────────────────────────────

export function DashboardPage() {
  const {
    stats,
    recentActivities,
    revenueData,
    ticketBreakdown,
    leaseBreakdown,
    paymentBreakdown,
    isLoading,
    error,
    fetchDashboardData,
  } = useDashboardStore()

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // ── Error State ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
          <AlertCircle className="size-8 text-red-500" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            Failed to load dashboard
          </h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchDashboardData()}
          className="gap-2 rounded-xl"
        >
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </div>
    )
  }

  // ── Payment Breakdown Transform ──────────────────────────────────────────
  const paymentData = paymentBreakdown ?? undefined

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of your property portfolio performance
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchDashboardData()}
          disabled={isLoading}
          className="gap-2 w-fit rounded-xl border-border/40"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* ── KPI Cards Row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {isLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              title="Total Properties"
              value={stats?.totalProperties ?? 0}
              subtitle="+2 this month"
              icon={Building2}
              iconColor="text-primary"
              iconBg="bg-primary/10"
              trend={12}
              trendDirection="up"
              trendLabel="vs last month"
              index={0}
            />
            <KpiCard
              title="Occupancy Rate"
              value={stats?.occupancyRate ?? 0}
              suffix="%"
              subtitle={`${stats?.occupiedUnits ?? 0} of ${stats?.totalUnits ?? 0} units occupied`}
              icon={Home}
              iconColor="text-primary"
              iconBg="bg-primary/10"
              index={1}
            />
            <KpiCard
              title="Total Revenue"
              value={stats?.totalRevenue ?? 0}
              prefix="$"
              subtitle={`${formatCurrency(stats?.pendingPayments ?? 0)} pending`}
              icon={DollarSign}
              iconColor="text-primary"
              iconBg="bg-primary/10"
              trend={12}
              trendDirection="up"
              trendLabel="vs last month"
              index={2}
            />
            <KpiCard
              title="Open Tickets"
              value={ticketBreakdown?.open ?? 0}
              subtitle={`${ticketBreakdown?.in_progress ?? 0} in progress`}
              icon={AlertTriangle}
              iconColor="text-orange-600 dark:text-orange-400"
              iconBg="bg-orange-50 dark:bg-orange-950/30"
              index={3}
            />
          </>
        )}
      </div>

      {/* ── Occupancy Progress Bar ───────────────────────────────────────── */}
      {!isLoading && stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-4 px-1"
        >
          <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap uppercase tracking-wider">
            Occupancy
          </span>
          <Progress
            value={stats.occupancyRate}
            className="h-1.5 flex-1 [&>div]:bg-primary"
          />
          <span className="text-[11px] font-semibold text-primary whitespace-nowrap">
            {stats.occupancyRate}%
          </span>
        </motion.div>
      )}

      {/* ── Middle Row: Revenue Chart + Quick Actions ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} isLoading={isLoading} />
        </div>

        {/* ── Quick Actions Panel ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.5 }}
        >
          <Card className="mojave-card border-border/30 bg-card/80 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, idx) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.5 + idx * 0.06 }}
                  className={`flex w-full items-center gap-3 rounded-xl border border-border/30 bg-background/50 p-3.5 text-left transition-all duration-200 ${action.bg} ${action.border} hover:shadow-sm`}
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted/40">
                    <action.icon className={`size-4 ${action.color}`} />
                  </div>
                  <span className="text-[13px] font-medium text-foreground">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Bottom Row: Activity Feed + Breakdown Charts ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityFeed activities={recentActivities} isLoading={isLoading} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BreakdownChart
            type="payment"
            paymentBreakdown={paymentData}
            isLoading={isLoading}
          />
          <BreakdownChart
            type="lease"
            leaseBreakdown={leaseBreakdown ?? undefined}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
