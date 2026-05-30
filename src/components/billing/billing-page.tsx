'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Send,
  Plus,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns'

import { usePaymentStore } from '@/stores/payment-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

import { PaymentTable, type PaymentRow } from './payment-table'
import { RecordPaymentDialog } from './record-payment-dialog'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// ── Summary Card ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  progress?: number
  index?: number
}

function SummaryCard({ title, value, subtitle, icon: Icon, iconColor, iconBg, progress, index = 0 }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 mojave-card border-border/30">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
              {progress !== undefined && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Collection rate</span>
                    <span className="text-xs font-semibold text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
            <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', iconBg)}>
              <Icon className={cn('size-6', iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SummaryCardSkeleton() {
  return (
    <Card className="border-border/30">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="size-12 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}

// ── Revenue Chart ────────────────────────────────────────────────────────────

interface RevenueDataPoint {
  month: string
  collected: number
  expected: number
}

interface RevenueChartProps {
  payments: PaymentRow[]
}

// Custom tooltip for the revenue chart (declared outside render to avoid lint error)
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="text-sm font-medium mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="size-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold">{formatCurrencyFull(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

function RevenueChart({ payments }: RevenueChartProps) {
  // Generate monthly revenue data from payments
  const revenueData = React.useMemo<RevenueDataPoint[]>(() => {
    const months: RevenueDataPoint[] = []

    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      const monthLabel = format(date, 'MMM')

      const monthPayments = payments.filter((p) => {
        try {
          const dueDate = parseISO(p.dueDate)
          return dueDate >= monthStart && dueDate <= monthEnd
        } catch {
          return false
        }
      })

      const collected = monthPayments
        .filter((p) => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0)

      const expected = monthPayments
        .reduce((sum, p) => sum + p.amount, 0)

      months.push({
        month: monthLabel,
        collected,
        expected,
      })
    }

    return months
  }, [payments])

  return (
    <Card className="border-border/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Monthly collected vs expected revenue
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">Last 12 months</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                className="fill-muted-foreground"
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value: string) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
              <Bar
                dataKey="expected"
                name="Expected"
                fill="#d1d5db"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
                className="dark:fill-muted-foreground/30"
              />
              <Bar
                dataKey="collected"
                name="Collected"
                fill="#c2703a"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function RevenueChartSkeleton() {
  return (
    <Card className="border-border/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] mt-4 flex items-end gap-2 px-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col gap-1 items-center">
              <Skeleton className="w-full rounded-t" style={{ height: `${Math.random() * 150 + 50}px` }} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Tenant type for the dialog ──────────────────────────────────────────────

interface TenantForDialog {
  id: string
  name: string
  email: string
  leases?: Array<{
    id: string
    property: { name: string }
    unit: { unitNumber: string }
    monthlyRent: number
  }>
}

// ── Main Billing Page ───────────────────────────────────────────────────────

export function BillingPage() {
  const { payments, isLoading, fetchPayments } = usePaymentStore()
  const [recordPaymentOpen, setRecordPaymentOpen] = React.useState(false)
  const [tenantsForDialog, setTenantsForDialog] = React.useState<TenantForDialog[]>([])
  const [summary, setSummary] = React.useState({
    totalCollected: 0,
    totalPending: 0,
    totalOverdue: 0,
    collectionRate: 0,
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0,
  })

  // Fetch payments on mount
  React.useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  // Fetch tenants for the dialog
  React.useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/tenants')
        if (response.ok) {
          const data = await response.json()
          const tenantList = data.tenants ?? data ?? []
          setTenantsForDialog(
            tenantList.map((t: Record<string, unknown>) => ({
              id: t.id as string,
              name: t.name as string,
              email: t.email as string,
              leases: Array.isArray(t.leases)
                ? t.leases.map((l: Record<string, unknown>) => ({
                    id: l.id as string,
                    property: {
                      name: (l.property as Record<string, unknown>)?.name as string ?? 'Unknown',
                    },
                    unit: {
                      unitNumber: (l.unit as Record<string, unknown>)?.unitNumber as string ?? '?',
                    },
                    monthlyRent: l.monthlyRent as number,
                  }))
                : [],
            }))
          )
        }
      } catch {
        // Silently fail - tenants for dialog are optional
      }
    }
    fetchTenants()
  }, [])

  // Compute summary from payments
  React.useEffect(() => {
    const totalCollected = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0)

    const totalPending = payments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)

    const totalOverdue = payments
      .filter((p) => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount + (p.lateFee || 0), 0)

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const collectionRate = totalAmount > 0 ? Math.round((totalCollected / totalAmount) * 100) : 0

    setSummary({
      totalCollected,
      totalPending,
      totalOverdue,
      collectionRate,
      paidCount: payments.filter((p) => p.status === 'paid').length,
      pendingCount: payments.filter((p) => p.status === 'pending').length,
      overdueCount: payments.filter((p) => p.status === 'overdue').length,
    })
  }, [payments])

  // Map payments to PaymentRow format
  const paymentRows: PaymentRow[] = React.useMemo(
    () =>
      payments.map((p) => ({
        ...p,
        tenantName: p.tenant?.name ?? 'Unknown',
        propertyName: p.lease?.property?.name ?? 'Unknown',
        unitNumber: p.lease?.unit?.unitNumber ?? '',
      })),
    [payments]
  )

  const handleSendReminder = (payment: PaymentRow) => {
    // Placeholder for send reminder functionality
    const name = payment.tenantName ?? 'tenant'
    const amount = formatCurrencyFull(payment.amount)
    alert(`Invoice reminder sent to ${name} for ${amount}`)
  }

  const handleViewPayment = (payment: PaymentRow) => {
    // Placeholder for view payment detail
    const name = payment.tenantName ?? 'Unknown'
    const amount = formatCurrencyFull(payment.amount)
    alert(`View payment details: ${name} - ${amount}`)
  }

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
            <CreditCard className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Billing & Payments
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track payments, manage invoices, and monitor collection rates
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => alert('Send Invoice feature coming soon!')}
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send Invoice</span>
            <span className="sm:hidden">Invoice</span>
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setRecordPaymentOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Record Payment</span>
            <span className="sm:hidden">Record</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </>
        ) : (
          <>
            <SummaryCard
              title="Total Collected"
              value={formatCurrency(summary.totalCollected)}
              subtitle={`${summary.paidCount} payments received`}
              icon={DollarSign}
              iconColor="text-primary"
              iconBg="bg-primary/5"
              index={0}
            />
            <SummaryCard
              title="Pending Payments"
              value={formatCurrency(summary.totalPending)}
              subtitle={`${summary.pendingCount} payments pending`}
              icon={Clock}
              iconColor="text-amber-600 dark:text-amber-400"
              iconBg="bg-amber-50 dark:bg-amber-950/40"
              index={1}
            />
            <SummaryCard
              title="Overdue Amount"
              value={formatCurrency(summary.totalOverdue)}
              subtitle={`${summary.overdueCount} overdue payments`}
              icon={AlertTriangle}
              iconColor="text-red-600 dark:text-red-400"
              iconBg="bg-red-50 dark:bg-red-950/40"
              index={2}
            />
            <SummaryCard
              title="Collection Rate"
              value={`${summary.collectionRate}%`}
              subtitle="Of total billed amount"
              icon={TrendingUp}
              iconColor="text-primary"
              iconBg="bg-primary/5"
              progress={summary.collectionRate}
              index={3}
            />
          </>
        )}
      </div>

      {/* Payment Table */}
      <Card className="border-border/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Payment History</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {payments.length} total payments · {summary.paidCount} paid · {summary.pendingCount} pending · {summary.overdueCount} overdue
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <PaymentTable
            data={paymentRows}
            isLoading={isLoading}
            onViewPayment={handleViewPayment}
            onSendReminder={handleSendReminder}
          />
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      {isLoading ? (
        <RevenueChartSkeleton />
      ) : (
        <RevenueChart payments={paymentRows} />
      )}

      {/* Record Payment Dialog */}
      <RecordPaymentDialog
        open={recordPaymentOpen}
        onOpenChange={setRecordPaymentOpen}
        tenants={tenantsForDialog}
        onSuccess={() => fetchPayments()}
      />
    </motion.div>
  )
}
