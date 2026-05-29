'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, CheckCircle2, DollarSign, Clock, Shield, Key, FileText,
  ArrowLeft, Search, Plus, Copy, AlertTriangle, TrendingUp,
  Building2, Mail, Phone, Globe, MapPin, Calendar, CreditCard,
  ChevronRight, MoreHorizontal, ExternalLink, Ban, RefreshCw,
  ArrowUpRight, ArrowDownRight, BarChart3,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

import { useOwnerStore } from '@/stores/owner-store'
import { ClientCard } from './client-card'
import { ClientDetail } from './client-detail'
import { AddClientDialog } from './add-client-dialog'
import { GenerateLicenseDialog } from './generate-license-dialog'
import { CreateInvoiceDialog } from './create-invoice-dialog'

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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'

// ── Helpers ──

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

const CHART_COLORS = ['#c2703a', '#f59e0b', '#8b5cf6', '#6b7280', '#06b6d4', '#ec4899']

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function maskKey(key: string) {
  const parts = key.split('-')
  if (parts.length < 5) return key
  return `${parts[0]}-${parts[1]}-****-****-${parts[4]}`
}

// ── Dashboard Tab ──

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
            <Card key={i} className="border-border/30"><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
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
            <Card className="mojave-card border-border/30 hover:shadow-md transition-shadow">
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
          <Card className="mojave-card border-border/30">
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
          <Card className="mojave-card border-border/30 h-full">
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
          <Card className="mojave-card border-border/30">
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
          <Card className="mojave-card border-border/30">
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

          <Card className="mojave-card border-border/30">
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

// ── Clients Tab ──

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

// ── License Keys Tab ──

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
      <Card className="mojave-card border-border/30 overflow-hidden">
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

// ── Invoices Tab ──

function InvoicesTab() {
  const { invoices, fetchInvoices, clients } = useOwnerStore()
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [clientFilter, setClientFilter] = React.useState('all')
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)

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
      <Card className="mojave-card border-border/30 overflow-hidden">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-accent/50">
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

// ── Main OwnerPage ──

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
          <p className="mt-1 text-sm text-muted-foreground">Manage SaaS clients, licenses, and billing</p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <BarChart3 className="size-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Users className="size-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="licenses" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Key className="size-4" />
            License Keys
          </TabsTrigger>
          <TabsTrigger value="invoices" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="size-4" />
            Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <DashboardTab />
        </TabsContent>
        <TabsContent value="clients" className="mt-6">
          <ClientsTab />
        </TabsContent>
        <TabsContent value="licenses" className="mt-6">
          <LicensesTab />
        </TabsContent>
        <TabsContent value="invoices" className="mt-6">
          <InvoicesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
