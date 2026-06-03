'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Search,
  Plus,
  Download,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type PlanStatus = 'active' | 'completed' | 'defaulted' | 'paused'

interface PaymentPlan {
  id: string
  tenant: string
  email: string
  property: string
  unit: string
  originalDebt: number
  planAmount: number
  paidAmount: number
  remainingAmount: number
  installments: number
  completedInstallments: number
  status: PlanStatus
  nextPaymentDate: string
  nextPaymentAmount: number
  createdAt: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const PLANS: PaymentPlan[] = [
  { id: 'pp-001', tenant: 'Sarah Mitchell', email: 'sarah.m@email.com', property: 'Skyline Tower', unit: '4B', originalDebt: 4800, planAmount: 200, paidAmount: 1400, remainingAmount: 3400, installments: 24, completedInstallments: 7, status: 'active', nextPaymentDate: '2025-07-01', nextPaymentAmount: 200, createdAt: '2024-12-01' },
  { id: 'pp-002', tenant: 'Robert Garcia', email: 'r.garcia@email.com', property: 'Greenfield Gardens', unit: '2B', originalDebt: 3200, planAmount: 400, paidAmount: 3200, remainingAmount: 0, installments: 8, completedInstallments: 8, status: 'completed', nextPaymentDate: '—', nextPaymentAmount: 0, createdAt: '2024-10-15' },
  { id: 'pp-003', tenant: 'David Kim', email: 'd.kim@email.com', property: 'Harbor View', unit: '5C', originalDebt: 5600, planAmount: 350, paidAmount: 1050, remainingAmount: 4550, installments: 16, completedInstallments: 3, status: 'active', nextPaymentDate: '2025-07-05', nextPaymentAmount: 350, createdAt: '2025-04-05' },
  { id: 'pp-004', tenant: 'Jessica Taylor', email: 'j.taylor@email.com', property: 'Oakwood Estates', unit: '3A', originalDebt: 2100, planAmount: 300, paidAmount: 600, remainingAmount: 1500, installments: 7, completedInstallments: 2, status: 'paused', nextPaymentDate: 'TBD', nextPaymentAmount: 0, createdAt: '2025-03-20' },
  { id: 'pp-005', tenant: 'Chris Martinez', email: 'c.martinez@email.com', property: 'Metro Hub', unit: '205', originalDebt: 1800, planAmount: 225, paidAmount: 450, remainingAmount: 1350, installments: 8, completedInstallments: 2, status: 'defaulted', nextPaymentDate: 'Overdue', nextPaymentAmount: 225, createdAt: '2025-01-15' },
  { id: 'pp-006', tenant: 'Amanda White', email: 'a.white@email.com', property: 'Greenfield Gardens', unit: '2B', originalDebt: 1200, planAmount: 200, paidAmount: 1000, remainingAmount: 200, installments: 6, completedInstallments: 5, status: 'active', nextPaymentDate: '2025-07-15', nextPaymentAmount: 200, createdAt: '2025-02-15' },
  { id: 'pp-007', tenant: 'Michael Brown', email: 'mbrown@email.com', property: 'Greenfield Gardens', unit: '7C', originalDebt: 900, planAmount: 150, paidAmount: 900, remainingAmount: 0, installments: 6, completedInstallments: 6, status: 'completed', nextPaymentDate: '—', nextPaymentAmount: 0, createdAt: '2025-01-01' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
}

function getStatusBadge(status: PlanStatus): string {
  const map: Record<PlanStatus, string> = {
    active: 'tahoe-badge tahoe-badge-green',
    completed: 'tahoe-badge tahoe-badge-blue',
    defaulted: 'tahoe-badge tahoe-badge-red',
    paused: 'tahoe-badge tahoe-badge-orange',
  }
  return map[status]
}

function getStatusIcon(status: PlanStatus) {
  const map: Record<PlanStatus, React.ReactNode> = {
    active: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    completed: <CheckCircle2 className="size-3.5 text-tahoe-blue" />,
    defaulted: <AlertTriangle className="size-3.5 text-tahoe-red" />,
    paused: <Clock className="size-3.5 text-tahoe-orange" />,
  }
  return map[status]
}

// ── Main Component ────────────────────────────────────────────────────────────

export function PaymentPlansPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<PlanStatus | 'all'>('all')

  const activePlans = PLANS.filter(p => p.status === 'active').length
  const totalEnrolled = PLANS.length
  const totalPaid = PLANS.reduce((s, p) => s + p.paidAmount, 0)
  const totalDebt = PLANS.reduce((s, p) => s + p.originalDebt, 0)
  const collectionRate = Math.round((totalPaid / totalDebt) * 100)
  const activePlansList = PLANS.filter(p => p.status === 'active')
  const avgDuration = activePlansList.length > 0
    ? Math.round(activePlansList.reduce((s, p) => s + p.installments, 0) / activePlansList.length)
    : 0

  const filteredPlans = PLANS.filter(p => {
    const matchSearch = !searchQuery ||
      p.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.property.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = [
    { title: 'Active Plans', value: String(activePlans), subtitle: 'Currently in progress', icon: CreditCard, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
    { title: 'Total Enrolled', value: String(totalEnrolled), subtitle: 'All time participants', icon: Users, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Collection Rate', value: `${collectionRate}%`, subtitle: `${formatCurrency(totalPaid)} collected`, icon: TrendingUp, iconColor: 'text-tahoe-orange', iconBg: 'bg-tahoe-orange/10' },
    { title: 'Avg Plan Duration', value: `${avgDuration} mo`, subtitle: 'Average installments', icon: Calendar, iconColor: 'text-tahoe-purple', iconBg: 'bg-tahoe-purple/10' },
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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-green/10">
            <CreditCard className="size-6 text-tahoe-green" />
          </div>
          <div>
            <h1 className="tahoe-title">Payment Plans</h1>
            <p className="tahoe-caption mt-1">Payment plans for overdue tenants</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary">
            <Plus className="size-3.5" />
            New Plan
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
              <CardTitle className="tahoe-headline">Payment Plans</CardTitle>
              <p className="tahoe-caption mt-1">{filteredPlans.length} plans</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 w-[160px] text-sm glass-input border-0" />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as PlanStatus | 'all')} className="h-8 rounded-lg border-0 bg-secondary/60 px-3 pr-7 text-sm text-foreground appearance-none cursor-pointer">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="defaulted">Defaulted</option>
                  <option value="paused">Paused</option>
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
                  <th className="text-right py-3 px-3 tahoe-overline">Original Debt</th>
                  <th className="text-right py-3 px-3 tahoe-overline">Plan Amt</th>
                  <th className="text-right py-3 px-3 tahoe-overline">Paid</th>
                  <th className="text-right py-3 px-3 tahoe-overline">Remaining</th>
                  <th className="text-center py-3 px-3 tahoe-overline">Progress</th>
                  <th className="text-center py-3 px-3 tahoe-overline">Status</th>
                  <th className="text-left py-3 px-3 tahoe-overline">Next Payment</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPlans.map(plan => {
                    const progress = Math.round((plan.paidAmount / plan.originalDebt) * 100)
                    return (
                      <motion.tr
                        key={plan.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          'border-b border-border/30 tahoe-transition',
                          plan.status === 'defaulted' ? 'bg-tahoe-red/5' : 'hover:bg-muted/30'
                        )}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 items-center justify-center rounded-full bg-tahoe-green/10 text-tahoe-green text-[10px] font-semibold">
                              {plan.tenant.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{plan.tenant}</p>
                              <p className="text-[11px] text-muted-foreground">{plan.property} · {plan.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-tahoe-red">{formatCurrency(plan.originalDebt)}</td>
                        <td className="py-3 px-3 text-right text-foreground">{formatCurrency(plan.planAmount)}/mo</td>
                        <td className="py-3 px-3 text-right font-medium text-tahoe-green">{formatCurrency(plan.paidAmount)}</td>
                        <td className="py-3 px-3 text-right text-foreground">{formatCurrency(plan.remainingAmount)}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-2 flex-1" />
                            <span className="text-[11px] font-medium w-8 text-right">{progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {getStatusIcon(plan.status)}
                            <span className={getStatusBadge(plan.status)}>{plan.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={plan.nextPaymentDate === 'Overdue' ? 'text-tahoe-red font-medium' : 'text-muted-foreground'}>
                            {plan.nextPaymentDate}
                          </span>
                          {plan.nextPaymentAmount > 0 && (
                            <span className="text-[11px] text-muted-foreground ml-1">({formatCurrency(plan.nextPaymentAmount)})</span>
                          )}
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="xl:hidden space-y-3 max-h-96 overflow-y-auto">
            {filteredPlans.map(plan => {
              const progress = Math.round((plan.paidAmount / plan.originalDebt) * 100)
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('glass-card p-4 space-y-2', plan.status === 'defaulted' && 'ring-1 ring-tahoe-red/20')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-tahoe-green/10 text-tahoe-green text-[10px] font-semibold">
                        {plan.tenant.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-sm">{plan.tenant}</span>
                    </div>
                    <div className="flex items-center gap-1">{getStatusIcon(plan.status)}<span className={getStatusBadge(plan.status)}>{plan.status}</span></div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{plan.property} · Unit {plan.unit}</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-muted-foreground">Debt</p>
                      <p className="font-bold text-tahoe-red">{formatCurrency(plan.originalDebt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Paid</p>
                      <p className="font-bold text-tahoe-green">{formatCurrency(plan.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Left</p>
                      <p className="font-bold">{formatCurrency(plan.remainingAmount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-2 flex-1" />
                    <span className="text-[11px] font-medium">{progress}%</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Next: {plan.nextPaymentDate} · {plan.nextPaymentAmount > 0 ? formatCurrency(plan.nextPaymentAmount) : '—'}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredPlans.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="size-10 text-muted-foreground/40 mb-3" />
              <p className="tahoe-body text-muted-foreground">No payment plans match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
