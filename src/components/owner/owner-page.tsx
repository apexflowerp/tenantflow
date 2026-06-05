'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, CheckCircle2, DollarSign, Clock, Shield, Key, FileText,
  Search, Plus, Copy, AlertTriangle, TrendingUp,
  Calendar, BarChart3, Eye, FileSpreadsheet, ArrowRightLeft,
  Monitor, Ban, Unlock, Lock, Wifi,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

import { useOwnerStore, type InvoiceData, type QuotationData, type DeviceData } from '@/stores/owner-store'
import { ClientCard } from './client-card'
import { ClientDetail } from './client-detail'
import { AddClientDialog } from './add-client-dialog'
import { GenerateLicenseDialog } from './generate-license-dialog'
import { CreateInvoiceDialog } from './create-invoice-dialog'
import { CreateQuotationDialog } from './create-quotation-dialog'
import { InvoiceViewer } from './invoice-viewer'
import { QuotationViewer } from './quotation-viewer'
import { ReportsPage } from './reports-page'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

// ── Color Maps ──

const PLAN_COLORS: Record<string, string> = {
  starter: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  professional: 'bg-primary/10 text-primary dark:bg-primary/20',
  business: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  enterprise: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-primary/10 text-primary dark:bg-primary/20',
  trial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  churned: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const LICENSE_STATUS_COLORS: Record<string, string> = {
  available: 'bg-primary/10 text-primary dark:bg-primary/20',
  activated: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
  expired: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  revoked: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

const INVOICE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  sent: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
  paid: 'bg-primary/10 text-primary dark:bg-primary/20',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const QUOTATION_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  sent: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
  viewed: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400',
  accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  expired: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
}

const DEVICE_STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  disabled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  blocked: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

const CHART_COLORS = ['#c2703a', '#f59e0b', '#8b5cf6', '#6b7280', '#06b6d4', '#ec4899']

// ── Helpers ──

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function maskKey(key: string) {
  const parts = key.split('-')
  if (parts.length < 5) return key
  return `${parts[0]}-${parts[1]}-****-****-${parts[4]}`
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════════════════════

function DashboardTab() {
  const { dashboardStats, fetchDashboard, isLoading } = useOwnerStore()

  React.useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const stats = dashboardStats

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border/30">
              <CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/30"><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
          <Card className="border-border/30"><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
        </div>
      </div>
    )
  }

  const kpis = [
    { label: 'Total Clients', value: stats.totalClients, icon: Users, color: 'text-primary', bgColor: 'bg-primary/10', trend: '+12%' },
    { label: 'Active Clients', value: stats.activeClients, icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-500/10', trend: '+8%' },
    { label: 'MRR', value: formatCurrency(stats.mrr), icon: DollarSign, color: 'text-primary', bgColor: 'bg-primary/10', trend: '+15%' },
    { label: 'Trial Clients', value: stats.trialClients, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-500/10', trend: '+3' },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border/30 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                    <p className="mt-1 text-2xl font-bold tracking-tight">{kpi.value}</p>
                  </div>
                  <div className={`flex size-11 items-center justify-center rounded-xl ${kpi.bgColor}`}>
                    <kpi.icon className={`size-5 ${kpi.color}`} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                  <TrendingUp className="size-3" />
                  {kpi.trend} from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Monthly Recurring Revenue</CardTitle>
              <CardDescription>Revenue trend over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.clientGrowth}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c2703a" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#c2703a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#c2703a"
                      strokeWidth={2}
                      fill="url(#revenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plan Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/30 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Client Distribution</CardTitle>
              <CardDescription>By subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.revenueByPlan}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      dataKey="count"
                      nameKey="plan"
                      paddingAngle={3}
                    >
                      {stats.revenueByPlan.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-2">
                {stats.revenueByPlan.map((p, i) => (
                  <div key={p.plan} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="capitalize text-muted-foreground">{p.plan}</span>
                    </div>
                    <span className="font-medium">{p.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row: Recent Clients + Renewals + Overdue Alert */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Clients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.recentClients.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No clients yet</p>
              ) : (
                stats.recentClients.map((client) => (
                  <div key={client.id} className="flex items-center gap-3 rounded-lg p-2 -mx-1 hover:bg-accent/50 transition-colors">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                      {client.companyName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{client.companyName}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(client.monthlyFee)}/mo</p>
                    </div>
                    <Badge variant="secondary" className={`text-[10px] capitalize ${PLAN_COLORS[client.plan] || ''}`}>
                      {client.plan}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Renewals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Upcoming Renewals</CardTitle>
              <CardDescription>Next 90 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.upcomingRenewals.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No upcoming renewals</p>
              ) : (
                stats.upcomingRenewals.map((r) => (
                  <div key={r.clientId} className="flex items-center gap-3 rounded-lg p-2 -mx-1 hover:bg-accent/50 transition-colors">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                      <Calendar className="size-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.companyName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(r.contractEnd)}</p>
                    </div>
                    <span className="text-xs font-medium">{formatCurrency(r.monthlyFee)}/mo</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Overdue Alert + License Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-red-500/10">
                  <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">Overdue Invoices</p>
                  <p className="mt-1 text-2xl font-bold text-red-700 dark:text-red-400">{stats.overdueInvoices.count}</p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">Total: {formatCurrency(stats.overdueInvoices.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">License Keys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">{stats.licenseStats.total}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 text-[10px]">
                  {stats.licenseStats.available}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Activated</span>
                <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 text-[10px]">
                  {stats.licenseStats.activated}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expired</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 text-[10px]">
                  {stats.licenseStats.expired}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENTS TAB
// ═══════════════════════════════════════════════════════════════════════════════

function ClientsTab() {
  const { clients, fetchClients, selectClient, selectedClient } = useOwnerStore()
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [planFilter, setPlanFilter] = React.useState('all')
  const [showAddDialog, setShowAddDialog] = React.useState(false)

  React.useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const filtered = React.useMemo(() => {
    return clients.filter(c => {
      const matchesSearch = c.companyName.toLowerCase().includes(search.toLowerCase()) ||
        c.contactName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      const matchesPlan = planFilter === 'all' || c.plan === planFilter
      return matchesSearch && matchesStatus && matchesPlan
    })
  }, [clients, search, statusFilter, planFilter])

  if (selectedClient) {
    return <ClientDetail />
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddDialog(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Client</span>
          </Button>
        </div>
      </div>

      {/* Client Grid */}
      {filtered.length === 0 ? (
        <Card className="border-border/30">
          <CardContent className="py-12 text-center">
            <Users className="mx-auto size-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold">No clients found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {search || statusFilter !== 'all' || planFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first client to get started'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
              >
                <ClientCard client={client} onSelect={() => selectClient(client.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AddClientDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVOICES TAB
// ═══════════════════════════════════════════════════════════════════════════════

function InvoicesTab() {
  const { invoices, fetchInvoices, clients, updateInvoiceStatus } = useOwnerStore()
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [clientFilter, setClientFilter] = React.useState('all')
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [viewingInvoice, setViewingInvoice] = React.useState<InvoiceData | null>(null)

  React.useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const filtered = React.useMemo(() => {
    return invoices.filter(inv => {
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter
      const matchesClient = clientFilter === 'all' || inv.clientId === clientFilter
      return matchesStatus && matchesClient
    })
  }, [invoices, statusFilter, clientFilter])

  const uniqueClients = React.useMemo(() => {
    const map = new Map<string, string>()
    invoices.forEach(inv => {
      if (inv.client?.companyName) {
        map.set(inv.clientId, inv.client.companyName)
      }
    })
    return Array.from(map.entries())
  }, [invoices])

  // Invoice status summary counts
  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { draft: 0, sent: 0, paid: 0, overdue: 0, cancelled: 0 }
    invoices.forEach(inv => { counts[inv.status] = (counts[inv.status] || 0) + 1 })
    return counts
  }, [invoices])

  const totalRevenue = React.useMemo(() => {
    return invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0)
  }, [invoices])

  const totalOutstanding = React.useMemo(() => {
    return invoices
      .filter(i => i.status === 'sent' || i.status === 'overdue')
      .reduce((sum, i) => sum + (i.total - i.paidAmount), 0)
  }, [invoices])

  return (
    <div className="space-y-4">
      {/* Invoice Viewer Overlay */}
      <AnimatePresence>
        {viewingInvoice && (
          <InvoiceViewer
            invoice={viewingInvoice}
            onClose={() => setViewingInvoice(null)}
            onStatusChange={(status) => {
              updateInvoiceStatus(viewingInvoice.id, status)
              setViewingInvoice(null)
            }}
          />
        )}
      </AnimatePresence>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="mt-1 text-2xl font-bold">{invoices.length}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Revenue Collected</p>
              <p className="mt-1 text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(totalOutstanding)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{statusCounts.overdue}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {uniqueClients.map(([id, name]) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <FileText className="size-4" />
          Create Invoice
        </Button>
      </div>

      {/* Invoice Table */}
      <Card className="border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => (
                  <TableRow
                    key={inv.id}
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={() => setViewingInvoice(inv)}
                  >
                    <TableCell className="font-mono text-sm font-medium">{inv.invoiceNumber}</TableCell>
                    <TableCell className="text-sm">{inv.client?.companyName || '—'}</TableCell>
                    <TableCell className="capitalize text-sm">{inv.type.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] capitalize ${INVOICE_STATUS_COLORS[inv.status] || ''}`}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(inv.issueDate)}</TableCell>
                    <TableCell className="text-sm">{formatDate(inv.dueDate)}</TableCell>
                    <TableCell className="text-right font-medium text-sm">{formatCurrency(inv.total)}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{formatCurrency(inv.paidAmount)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          setViewingInvoice(inv)
                        }}
                      >
                        <Eye className="size-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <CreateInvoiceDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUOTATIONS TAB
// ═══════════════════════════════════════════════════════════════════════════════

function QuotationsTab() {
  const { quotations, fetchQuotations, clients, convertQuotationToInvoice, updateQuotationStatus } = useOwnerStore()
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [clientFilter, setClientFilter] = React.useState('all')
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [viewingQuotation, setViewingQuotation] = React.useState<QuotationData | null>(null)

  React.useEffect(() => {
    fetchQuotations()
  }, [fetchQuotations])

  const filtered = React.useMemo(() => {
    return quotations.filter(q => {
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter
      const matchesClient = clientFilter === 'all' || q.clientId === clientFilter
      return matchesStatus && matchesClient
    })
  }, [quotations, statusFilter, clientFilter])

  const uniqueClients = React.useMemo(() => {
    const map = new Map<string, string>()
    quotations.forEach(q => {
      if (q.client?.companyName) {
        map.set(q.clientId, q.client.companyName)
      }
    })
    return Array.from(map.entries())
  }, [quotations])

  // Status summary
  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { draft: 0, sent: 0, viewed: 0, accepted: 0, rejected: 0, expired: 0 }
    quotations.forEach(q => { counts[q.status] = (counts[q.status] || 0) + 1 })
    return counts
  }, [quotations])

  const totalQuotedValue = React.useMemo(() => {
    return quotations.filter(q => q.status !== 'rejected' && q.status !== 'expired').reduce((sum, q) => sum + q.total, 0)
  }, [quotations])

  const acceptedValue = React.useMemo(() => {
    return quotations.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total, 0)
  }, [quotations])

  const conversionRate = React.useMemo(() => {
    const total = quotations.length
    if (total === 0) return 0
    const accepted = quotations.filter(q => q.status === 'accepted').length
    return Math.round((accepted / total) * 100)
  }, [quotations])

  return (
    <div className="space-y-4">
      {/* Quotation Viewer Overlay */}
      <AnimatePresence>
        {viewingQuotation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto p-4 sm:p-8"
            onClick={(e) => { if (e.target === e.currentTarget) setViewingQuotation(null) }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-[900px] mx-auto my-4"
            >
              <QuotationViewer
                quotation={viewingQuotation}
                onClose={() => setViewingQuotation(null)}
                onConvertToInvoice={(id) => {
                  convertQuotationToInvoice(id)
                  setViewingQuotation(null)
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Quotations</p>
              <p className="mt-1 text-2xl font-bold">{quotations.length}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Quoted Value</p>
              <p className="mt-1 text-2xl font-bold text-primary">{formatCurrency(totalQuotedValue)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Accepted Value</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(acceptedValue)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="mt-1 text-2xl font-bold">{conversionRate}%</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {uniqueClients.map(([id, name]) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <FileSpreadsheet className="size-4" />
          Create Quotation
        </Button>
      </div>

      {/* Quotations Table */}
      <Card className="border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Converted</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No quotations found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((q) => (
                  <TableRow
                    key={q.id}
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={() => setViewingQuotation(q)}
                  >
                    <TableCell className="font-mono text-sm font-medium">{q.quotationNumber}</TableCell>
                    <TableCell className="text-sm">{q.client?.companyName || '—'}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{q.subject || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] capitalize ${QUOTATION_STATUS_COLORS[q.status] || ''}`}>
                        {q.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(q.validUntil)}</TableCell>
                    <TableCell>
                      {q.convertedToInvoice ? (
                        <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 gap-1">
                          <ArrowRightLeft className="size-3" />
                          Invoice
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">{formatCurrency(q.total)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          setViewingQuotation(q)
                        }}
                      >
                        <Eye className="size-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <CreateQuotationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        clients={clients.map(c => ({ id: c.id, companyName: c.companyName, contactName: c.contactName, email: c.email }))}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICES TAB
// ═══════════════════════════════════════════════════════════════════════════════

function DevicesTab() {
  const { devices, fetchDevices, blockDevice, unblockDevice, isLoading } = useOwnerStore()
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [clientFilter, setClientFilter] = React.useState('all')
  const [search, setSearch] = React.useState('')
  const [blockTarget, setBlockTarget] = React.useState<DeviceData | null>(null)
  const [actionLoading, setActionLoading] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  const filtered = React.useMemo(() => {
    return devices.filter(d => {
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter
      const matchesClient = clientFilter === 'all' || d.workspace?.clientId === clientFilter
      const matchesSearch = !search ||
        (d.deviceName || '').toLowerCase().includes(search.toLowerCase()) ||
        d.serialKey.toLowerCase().includes(search.toLowerCase()) ||
        (d.ipAddress || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.workspace?.name || '').toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesClient && matchesSearch
    })
  }, [devices, statusFilter, clientFilter, search])

  const uniqueClients = React.useMemo(() => {
    const map = new Map<string, string>()
    devices.forEach(d => {
      if (d.workspace?.client?.companyName) {
        map.set(d.workspace.clientId, d.workspace.client.companyName)
      }
    })
    return Array.from(map.entries())
  }, [devices])

  // Summary counts
  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { active: 0, disabled: 0, blocked: 0, pending: 0 }
    devices.forEach(d => { counts[d.status] = (counts[d.status] || 0) + 1 })
    return counts
  }, [devices])

  const handleBlock = async (device: DeviceData) => {
    setActionLoading(device.id)
    try {
      await blockDevice(device.id)
      toast({
        title: 'Device blocked',
        description: `${device.deviceName || device.serialKey} has been blocked.`,
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to block device. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(null)
      setBlockTarget(null)
    }
  }

  const handleUnblock = async (device: DeviceData) => {
    setActionLoading(device.id)
    try {
      await unblockDevice(device.id)
      toast({
        title: 'Device unblocked',
        description: `${device.deviceName || device.serialKey} has been unblocked and reactivated.`,
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to unblock device. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(null)
    }
  }

  function formatTimeAgo(dateStr: string | null) {
    if (!dateStr) return '—'
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 30) return `${diffDays}d ago`
    return formatDate(dateStr)
  }

  return (
    <div className="space-y-4">
      {/* Block Confirmation Dialog */}
      <AlertDialog open={!!blockTarget} onOpenChange={(open) => !open && setBlockTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block <strong>{blockTarget?.deviceName || blockTarget?.serialKey}</strong>?
              This device will lose access immediately and all active sessions will be invalidated.
              You can unblock it later to restore access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => blockTarget && handleBlock(blockTarget)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Block Device
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Devices</p>
                  <p className="mt-1 text-2xl font-bold">{devices.length}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Monitor className="size-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{statusCounts.active}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disabled / Blocked</p>
                  <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{statusCounts.disabled + statusCounts.blocked}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
                  <Ban className="size-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{statusCounts.pending}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {uniqueClients.map(([id, name]) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Devices Table */}
      <Card className="border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Serial Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Client / Workspace</TableHead>
                <TableHead>OS / Browser</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <div className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                      Loading devices...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Monitor className="size-8 text-muted-foreground/30" />
                      <span>No devices found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((d) => (
                  <TableRow key={d.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                          <Monitor className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{d.deviceName || 'Unknown Device'}</p>
                          {d.user && (
                            <p className="text-xs text-muted-foreground">{d.user.name}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-sm">{d.deviceType}</TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {maskKey(d.serialKey)}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] capitalize ${DEVICE_STATUS_COLORS[d.status] || ''}`}>
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{d.workspace?.client?.companyName || '—'}</p>
                        <p className="text-xs text-muted-foreground">{d.workspace?.name || '—'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{d.os || '—'}</p>
                        <p className="text-xs text-muted-foreground">{d.browser || '—'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        {d.ipAddress && <Wifi className="size-3 text-muted-foreground" />}
                        {d.ipAddress || '—'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{formatTimeAgo(d.lastSeenAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {d.status === 'blocked' || d.status === 'disabled' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                            disabled={actionLoading === d.id}
                            onClick={() => handleUnblock(d)}
                          >
                            {actionLoading === d.id ? (
                              <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Unlock className="size-4" />
                            )}
                          </Button>
                        ) : d.status === 'active' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                            disabled={actionLoading === d.id}
                            onClick={() => setBlockTarget(d)}
                          >
                            <Lock className="size-4" />
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LICENSE KEYS TAB
// ═══════════════════════════════════════════════════════════════════════════════

function LicensesTab() {
  const { licenseKeys, fetchLicenseKeys, clients } = useOwnerStore()
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [planFilter, setPlanFilter] = React.useState('all')
  const [showGenDialog, setShowGenDialog] = React.useState(false)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchLicenseKeys()
  }, [fetchLicenseKeys])

  const filtered = React.useMemo(() => {
    return licenseKeys.filter(k => {
      const matchesStatus = statusFilter === 'all' || k.status === statusFilter
      const matchesPlan = planFilter === 'all' || k.plan === planFilter
      return matchesStatus && matchesPlan
    })
  }, [licenseKeys, statusFilter, planFilter])

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="activated">Activated</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowGenDialog(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Key className="size-4" />
          Generate Key
        </Button>
      </div>

      {/* Table */}
      <Card className="border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Key</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Max Devices</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Activated</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No license keys found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((lk) => (
                  <TableRow key={lk.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {maskKey(lk.key)}
                        </code>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => copyKey(lk.key)}
                                className="p-1 rounded hover:bg-accent transition-colors"
                              >
                                {copiedKey === lk.key ? (
                                  <CheckCircle2 className="size-3.5 text-primary" />
                                ) : (
                                  <Copy className="size-3.5 text-muted-foreground" />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>{copiedKey === lk.key ? 'Copied!' : 'Copy key'}</TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-sm">{lk.type}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] capitalize ${PLAN_COLORS[lk.plan] || ''}`}>
                        {lk.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{lk.maxDevices}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] capitalize ${LICENSE_STATUS_COLORS[lk.status] || ''}`}>
                        {lk.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{lk.client?.companyName || '—'}</TableCell>
                    <TableCell className="text-sm">{formatDate(lk.activatedAt)}</TableCell>
                    <TableCell className="text-sm">{formatDate(lk.expiresAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <GenerateLicenseDialog open={showGenDialog} onOpenChange={setShowGenDialog} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN OWNER PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export function OwnerPage() {
  const [activeTab, setActiveTab] = React.useState('dashboard')

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4"
      >
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Shield className="size-6 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Owner Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage SaaS clients, licenses, billing, and quotations</p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Users className="size-4" />
            <span className="hidden sm:inline">Clients</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="size-4" />
            <span className="hidden sm:inline">Invoices</span>
          </TabsTrigger>
          <TabsTrigger value="quotations" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileSpreadsheet className="size-4" />
            <span className="hidden sm:inline">Quotations</span>
          </TabsTrigger>
          <TabsTrigger value="licenses" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Key className="size-4" />
            <span className="hidden sm:inline">License Keys</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Monitor className="size-4" />
            <span className="hidden sm:inline">Devices</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <DashboardTab />
        </TabsContent>
        <TabsContent value="clients" className="mt-6">
          <ClientsTab />
        </TabsContent>
        <TabsContent value="invoices" className="mt-6">
          <InvoicesTab />
        </TabsContent>
        <TabsContent value="quotations" className="mt-6">
          <QuotationsTab />
        </TabsContent>
        <TabsContent value="licenses" className="mt-6">
          <LicensesTab />
        </TabsContent>
        <TabsContent value="devices" className="mt-6">
          <DevicesTab />
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <ReportsPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
