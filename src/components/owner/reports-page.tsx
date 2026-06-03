'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, DollarSign, Users, FileText, Key, TrendingUp, TrendingDown,
  Download, Printer, RefreshCw, Calendar, ArrowUpRight, ArrowDownRight,
  FileSpreadsheet, FileJson, Filter, ChevronRight, AlertTriangle,
  CheckCircle2, Clock, XCircle, Shield, Activity,
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from 'recharts'

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
import { cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0,
})

const pctFmt = new Intl.NumberFormat('en-US', {
  style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1,
})

function formatCurrency(v: number) { return currencyFmt.format(v) }
function formatPct(v: number) { return pctFmt.format(v / 100) }

function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function exportToJSON(data: Record<string, unknown>[], filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const CHART_COLORS = ['#0071e3', '#34c759', '#ff9500', '#af52de', '#ff3b30', '#5ac8fa']

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

// ── Revenue Data ──────────────────────────────────────────────────────────────

const revenueMonthly = [
  { month: 'Jan 2025', revenue: 42500, mrr: 38200, arr: 458400, growth: 8.2 },
  { month: 'Feb 2025', revenue: 44200, mrr: 39500, arr: 474000, growth: 4.0 },
  { month: 'Mar 2025', revenue: 46800, mrr: 41200, arr: 494400, growth: 5.9 },
  { month: 'Apr 2025', revenue: 45100, mrr: 40800, arr: 489600, growth: -1.0 },
  { month: 'May 2025', revenue: 48900, mrr: 43600, arr: 523200, growth: 6.9 },
  { month: 'Jun 2025', revenue: 51200, mrr: 45800, arr: 549600, growth: 5.0 },
  { month: 'Jul 2025', revenue: 49800, mrr: 44900, arr: 538800, growth: -2.0 },
  { month: 'Aug 2025', revenue: 53400, mrr: 47200, arr: 566400, growth: 5.1 },
  { month: 'Sep 2025', revenue: 55800, mrr: 49100, arr: 589200, growth: 4.0 },
  { month: 'Oct 2025', revenue: 54200, mrr: 48600, arr: 583200, growth: -1.0 },
  { month: 'Nov 2025', revenue: 57600, mrr: 51200, arr: 614400, growth: 5.3 },
  { month: 'Dec 2025', revenue: 61200, mrr: 54800, arr: 657600, growth: 7.0 },
]

const revenueByClient = [
  { client: 'Greenfield Realty', revenue: 18200, plan: 'enterprise', pct: 29.7 },
  { client: 'Skyline Properties', revenue: 14800, plan: 'business', pct: 24.2 },
  { client: 'Harbor View Corp', revenue: 9600, plan: 'professional', pct: 15.7 },
  { client: 'Metro Hub LLC', revenue: 8400, plan: 'business', pct: 13.7 },
  { client: 'Oak Terrace Inc', revenue: 6200, plan: 'professional', pct: 10.1 },
  { client: 'Riverside Group', revenue: 4200, plan: 'starter', pct: 6.9 },
]

const revenueByPlan = [
  { plan: 'Enterprise', revenue: 18200, clients: 2, color: '#af52de' },
  { plan: 'Business', revenue: 23200, clients: 4, color: '#ff9500' },
  { plan: 'Professional', revenue: 15800, clients: 6, color: '#0071e3' },
  { plan: 'Starter', revenue: 4200, clients: 12, color: '#34c759' },
]

// ── Client Summary Data ──────────────────────────────────────────────────────

const clientSummaryData = {
  total: 24, active: 18, trial: 3, suspended: 1, churned: 2,
  planDistribution: [
    { plan: 'Enterprise', count: 2, pct: 8.3 },
    { plan: 'Business', count: 4, pct: 16.7 },
    { plan: 'Professional', count: 6, pct: 25.0 },
    { plan: 'Starter', count: 12, pct: 50.0 },
  ],
  acquisitionTrend: [
    { month: 'Jan', newClients: 3, churned: 0 },
    { month: 'Feb', newClients: 2, churned: 1 },
    { month: 'Mar', newClients: 4, churned: 0 },
    { month: 'Apr', newClients: 1, churned: 1 },
    { month: 'May', newClients: 3, churned: 0 },
    { month: 'Jun', newClients: 2, churned: 1 },
    { month: 'Jul', newClients: 5, churned: 0 },
    { month: 'Aug', newClients: 2, churned: 0 },
    { month: 'Sep', newClients: 3, churned: 1 },
    { month: 'Oct', newClients: 1, churned: 0 },
    { month: 'Nov', newClients: 4, churned: 0 },
    { month: 'Dec', newClients: 3, churned: 1 },
  ],
  clients: [
    { name: 'Greenfield Realty', contact: 'James Wilson', email: 'james@greenfield.com', plan: 'enterprise', status: 'active', mrr: 9100, since: '2023-03-15' },
    { name: 'Skyline Properties', contact: 'Sarah Chen', email: 'sarah@skyline.co', plan: 'business', status: 'active', mrr: 7400, since: '2023-06-22' },
    { name: 'Harbor View Corp', contact: 'Michael Brown', email: 'michael@harborview.io', plan: 'professional', status: 'active', mrr: 4800, since: '2024-01-10' },
    { name: 'Metro Hub LLC', contact: 'Emily Davis', email: 'emily@metrohub.com', plan: 'business', status: 'active', mrr: 4200, since: '2024-02-05' },
    { name: 'Oak Terrace Inc', contact: 'Robert Taylor', email: 'robert@oakterrace.net', plan: 'professional', status: 'active', mrr: 3100, since: '2024-04-18' },
    { name: 'Riverside Group', contact: 'Amanda Lee', email: 'amanda@riverside.org', plan: 'starter', status: 'active', mrr: 2100, since: '2024-05-02' },
    { name: 'Pacific Heights Co', contact: 'David Kim', email: 'david@pacificheights.com', plan: 'professional', status: 'trial', mrr: 0, since: '2025-02-01' },
    { name: 'Summit Living LLC', contact: 'Lisa Park', email: 'lisa@summitliving.co', plan: 'business', status: 'trial', mrr: 0, since: '2025-02-15' },
    { name: 'Bay Area Rentals', contact: 'Tom Nguyen', email: 'tom@bayrentals.io', plan: 'starter', status: 'trial', mrr: 0, since: '2025-03-01' },
    { name: 'Valley Homes Inc', contact: 'Karen White', email: 'karen@valleyhomes.com', plan: 'starter', status: 'suspended', mrr: 1200, since: '2023-11-20' },
    { name: 'Coastal Properties', contact: 'Brian Martin', email: 'brian@coastal.co', plan: 'starter', status: 'churned', mrr: 0, since: '2023-08-10' },
    { name: 'Downtown Realty', contact: 'Nancy Adams', email: 'nancy@downtown.io', plan: 'professional', status: 'churned', mrr: 0, since: '2024-01-05' },
  ],
}

// ── Invoice Aging Data ───────────────────────────────────────────────────────

const invoiceAgingData = {
  current: 45200,
  days30: 12800,
  days60: 8500,
  days90: 4200,
  daysOver90: 2100,
  totalReceivable: 72800,
  overdueTotal: 27600,
  overduePercent: 37.9,
  buckets: [
    { label: 'Current', amount: 45200, count: 12, color: '#34c759' },
    { label: '1-30 Days', amount: 12800, count: 5, color: '#0071e3' },
    { label: '31-60 Days', amount: 8500, count: 3, color: '#ff9500' },
    { label: '61-90 Days', amount: 4200, count: 2, color: '#af52de' },
    { label: '90+ Days', amount: 2100, count: 1, color: '#ff3b30' },
  ],
  overdueInvoices: [
    { invoice: 'INV-2025-001', client: 'Metro Hub LLC', amount: 4200, dueDate: '2025-01-15', daysOverdue: 52, status: '31-60' },
    { invoice: 'INV-2025-003', client: 'Valley Homes Inc', amount: 1200, dueDate: '2025-01-02', daysOverdue: 65, status: '61-90' },
    { invoice: 'INV-2024-048', client: 'Coastal Properties', amount: 2100, dueDate: '2024-11-15', daysOverdue: 113, status: '90+' },
    { invoice: 'INV-2025-007', client: 'Oak Terrace Inc', amount: 3100, dueDate: '2025-02-01', daysOverdue: 35, status: '31-60' },
    { invoice: 'INV-2025-009', client: 'Riverside Group', amount: 2800, dueDate: '2025-02-10', daysOverdue: 26, status: '1-30' },
    { invoice: 'INV-2025-010', client: 'Harbor View Corp', amount: 4800, dueDate: '2025-02-15', daysOverdue: 21, status: '1-30' },
    { invoice: 'INV-2025-011', client: 'Skyline Properties', amount: 3700, dueDate: '2025-02-18', daysOverdue: 18, status: '1-30' },
    { invoice: 'INV-2025-012', client: 'Greenfield Realty', amount: 1300, dueDate: '2025-01-28', daysOverdue: 39, status: '31-60' },
    { invoice: 'INV-2024-045', client: 'Valley Homes Inc', amount: 3000, dueDate: '2024-12-20', daysOverdue: 78, status: '61-90' },
    { invoice: 'INV-2025-014', client: 'Pacific Heights Co', amount: 1000, dueDate: '2025-02-22', daysOverdue: 12, status: '1-30' },
  ],
}

// ── License Utilization Data ─────────────────────────────────────────────────

const licenseData = {
  total: 48,
  activated: 32,
  available: 10,
  expired: 4,
  revoked: 2,
  utilizationRate: 76.2,
  byPlan: [
    { plan: 'Enterprise', total: 8, activated: 7, available: 1, expired: 0, revoked: 0, utilization: 87.5 },
    { plan: 'Business', total: 12, activated: 10, available: 1, expired: 1, revoked: 0, utilization: 90.9 },
    { plan: 'Professional', total: 16, activated: 10, available: 4, expired: 1, revoked: 1, utilization: 71.4 },
    { plan: 'Starter', total: 12, activated: 5, available: 4, expired: 2, revoked: 1, utilization: 55.6 },
  ],
  licenses: [
    { key: 'TFOW-ENT1-XXXX-ABCD', plan: 'enterprise', status: 'activated', client: 'Greenfield Realty', activatedAt: '2023-03-15', expiresAt: '2026-03-15', devices: 3, maxDevices: 5 },
    { key: 'TFOW-ENT2-XXXX-EFGH', plan: 'enterprise', status: 'activated', client: 'Greenfield Realty', activatedAt: '2024-01-10', expiresAt: '2026-01-10', devices: 2, maxDevices: 5 },
    { key: 'TFOW-BIZ1-XXXX-IJKL', plan: 'business', status: 'activated', client: 'Skyline Properties', activatedAt: '2023-06-22', expiresAt: '2025-06-22', devices: 4, maxDevices: 5 },
    { key: 'TFOW-BIZ2-XXXX-MNOP', plan: 'business', status: 'activated', client: 'Metro Hub LLC', activatedAt: '2024-02-05', expiresAt: '2026-02-05', devices: 2, maxDevices: 5 },
    { key: 'TFOW-BIZ3-XXXX-QRST', plan: 'business', status: 'expired', client: 'Coastal Properties', activatedAt: '2023-08-10', expiresAt: '2024-08-10', devices: 0, maxDevices: 5 },
    { key: 'TFOW-PRO1-XXXX-UVWX', plan: 'professional', status: 'activated', client: 'Harbor View Corp', activatedAt: '2024-01-10', expiresAt: '2025-01-10', devices: 2, maxDevices: 3 },
    { key: 'TFOW-PRO2-XXXX-YZAB', plan: 'professional', status: 'activated', client: 'Oak Terrace Inc', activatedAt: '2024-04-18', expiresAt: '2025-04-18', devices: 1, maxDevices: 3 },
    { key: 'TFOW-PRO3-XXXX-CDEF', plan: 'professional', status: 'revoked', client: 'Downtown Realty', activatedAt: '2024-01-05', expiresAt: '2025-01-05', devices: 0, maxDevices: 3 },
    { key: 'TFOW-STR1-XXXX-GHIJ', plan: 'starter', status: 'activated', client: 'Riverside Group', activatedAt: '2024-05-02', expiresAt: '2025-05-02', devices: 1, maxDevices: 2 },
    { key: 'TFOW-STR2-XXXX-KLMN', plan: 'starter', status: 'available', client: '—', activatedAt: '—', expiresAt: '—', devices: 0, maxDevices: 2 },
    { key: 'TFOW-STR3-XXXX-OPQR', plan: 'starter', status: 'expired', client: 'Valley Homes Inc', activatedAt: '2023-11-20', expiresAt: '2024-11-20', devices: 0, maxDevices: 2 },
    { key: 'TFOW-STR4-XXXX-STUV', plan: 'starter', status: 'available', client: '—', activatedAt: '—', expiresAt: '—', devices: 0, maxDevices: 2 },
  ],
}

// ── Churn Analysis Data ──────────────────────────────────────────────────────

const churnData = {
  rate: 4.2,
  retained: 95.8,
  atRisk: 3,
  reasons: [
    { reason: 'Price too high', count: 4, pct: 40 },
    { reason: 'Switched to competitor', count: 2, pct: 20 },
    { reason: 'Business closed', count: 2, pct: 20 },
    { reason: 'Poor support experience', count: 1, pct: 10 },
    { reason: 'Feature gap', count: 1, pct: 10 },
  ],
  churnTrend: [
    { month: 'Jan', churnRate: 3.8, retentionRate: 96.2, churned: 0, retained: 21 },
    { month: 'Feb', churnRate: 4.5, retentionRate: 95.5, churned: 1, retained: 21 },
    { month: 'Mar', churnRate: 3.2, retentionRate: 96.8, churned: 0, retained: 23 },
    { month: 'Apr', churnRate: 4.8, retentionRate: 95.2, churned: 1, retained: 22 },
    { month: 'May', churnRate: 3.5, retentionRate: 96.5, churned: 0, retained: 24 },
    { month: 'Jun', churnRate: 4.2, retentionRate: 95.8, churned: 1, retained: 23 },
    { month: 'Jul', churnRate: 2.8, retentionRate: 97.2, churned: 0, retained: 27 },
    { month: 'Aug', churnRate: 3.0, retentionRate: 97.0, churned: 0, retained: 28 },
    { month: 'Sep', churnRate: 4.5, retentionRate: 95.5, churned: 1, retained: 28 },
    { month: 'Oct', churnRate: 2.5, retentionRate: 97.5, churned: 0, retained: 29 },
    { month: 'Nov', churnRate: 3.2, retentionRate: 96.8, churned: 0, retained: 32 },
    { month: 'Dec', churnRate: 4.2, retentionRate: 95.8, churned: 1, retained: 24 },
  ],
  atRiskClients: [
    { name: 'Valley Homes Inc', plan: 'starter', risk: 'high', reason: 'Contract ending in 14 days', lastActivity: '12 days ago', mrr: 1200 },
    { name: 'Oak Terrace Inc', plan: 'professional', risk: 'medium', reason: 'No login in 28 days', lastActivity: '28 days ago', mrr: 3100 },
    { name: 'Riverside Group', plan: 'starter', risk: 'high', reason: 'Outstanding invoice 65+ days', lastActivity: '5 days ago', mrr: 2100 },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM CHART TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════════

function ChartTooltip({ active, payload, label, formatter }: {
  active?: boolean
  payload?: Array<{ value: number; name?: string; color?: string }>
  label?: string
  formatter?: (value: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-xl px-3 py-2 text-xs shadow-lg border border-border/30">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">{formatter ? formatter(p.value) : p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS BADGE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const PLAN_COLORS: Record<string, string> = {
  starter: 'tahoe-badge-green',
  professional: 'tahoe-badge-blue',
  business: 'tahoe-badge-orange',
  enterprise: 'tahoe-badge-purple',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'tahoe-badge-green',
  trial: 'tahoe-badge-orange',
  suspended: 'tahoe-badge-red',
  churned: 'tahoe-badge-red',
}

const LICENSE_STATUS_COLORS: Record<string, string> = {
  available: 'tahoe-badge-green',
  activated: 'tahoe-badge-blue',
  expired: 'tahoe-badge-orange',
  revoked: 'tahoe-badge-red',
}

const RISK_COLORS: Record<string, string> = {
  high: 'tahoe-badge-red',
  medium: 'tahoe-badge-orange',
  low: 'tahoe-badge-green',
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORT HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ReportHeader({ title, description, icon: Icon, generatedAt }: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  generatedAt: Date
}) {
  return (
    <div className="glass-panel glass-tint-blue p-5 print:p-0 print:bg-transparent print:shadow-none">
      <div className="flex items-start gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-tahoe-blue/10 print:bg-gray-200">
          <Icon className="size-5 text-tahoe-blue print:text-gray-700" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" />
              Generated: {generatedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// KPI CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function KpiCard({ label, value, trend, trendDirection, icon: Icon, accent }: {
  label: string
  value: string | number
  trend?: string
  trendDirection?: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  accent: string
}) {
  const accentMap: Record<string, { border: string; bg: string; icon: string }> = {
    'tahoe-blue': { border: 'border-l-tahoe-blue', bg: 'glass-tint-blue', icon: 'text-tahoe-blue' },
    'tahoe-green': { border: 'border-l-tahoe-green', bg: 'glass-tint-green', icon: 'text-tahoe-green' },
    'tahoe-purple': { border: 'border-l-tahoe-purple', bg: 'glass-tint-purple', icon: 'text-tahoe-purple' },
    'tahoe-orange': { border: 'border-l-tahoe-orange', bg: 'glass-tint-blue', icon: 'text-tahoe-orange' },
    'tahoe-red': { border: 'border-l-tahoe-red', bg: 'glass-tint-blue', icon: 'text-tahoe-red' },
  }
  const style = accentMap[accent] ?? accentMap['tahoe-blue']

  return (
    <Card className={cn('glass-card tahoe-hover overflow-hidden border-l-[3px]', style.border, style.bg)}>
      <CardContent className="p-4 print:p-2">
        <div className="flex items-center gap-3">
          <div className={cn('flex size-9 items-center justify-center rounded-xl', `${accent}/10`)}>
            <Icon className={cn('size-4', style.icon)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="tahoe-overline">{label}</p>
            <p className="text-xl font-bold tracking-tight text-foreground mt-0.5">{value}</p>
          </div>
          {trend && (
            <span className={cn(
              'inline-flex items-center gap-0.5 text-[11px] font-semibold',
              trendDirection === 'up' ? 'text-tahoe-green' : 'text-tahoe-red'
            )}>
              {trendDirection === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVENUE REPORT
// ═══════════════════════════════════════════════════════════════════════════════

function RevenueReport() {
  const [viewMode, setViewMode] = React.useState<'chart' | 'table'>('chart')
  const [period, setPeriod] = React.useState('monthly')
  const generatedAt = React.useMemo(() => new Date(), [])

  const kpis = [
    { label: 'Total Revenue', value: formatCurrency(61200), trend: '+7.0%', trendDirection: 'up' as const, icon: DollarSign, accent: 'tahoe-green' },
    { label: 'MRR', value: formatCurrency(54800), trend: '+7.0%', trendDirection: 'up' as const, icon: TrendingUp, accent: 'tahoe-blue' },
    { label: 'ARR', value: formatCurrency(657600), trend: '+7.0%', trendDirection: 'up' as const, icon: Activity, accent: 'tahoe-purple' },
    { label: 'Growth Rate', value: '7.0%', trend: '+1.7pp', trendDirection: 'up' as const, icon: TrendingUp, accent: 'tahoe-orange' },
  ]

  const csvData = revenueMonthly.map(r => ({
    Month: r.month, Revenue: r.revenue, MRR: r.mrr, ARR: r.arr, 'Growth %': r.growth,
  }))

  return (
    <div className="print-report-area space-y-6">
      <ReportHeader
        title="Revenue Report"
        description="Monthly/Quarterly/Annual revenue breakdown by client, plan, and billing cycle"
        icon={DollarSign}
        generatedAt={generatedAt}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(kpi => (
          <motion.div key={kpi.label} variants={itemVariants}>
            <KpiCard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Period selector + view toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
        <Tabs value={viewMode} onValueChange={v => setViewMode(v as 'chart' | 'table')}>
          <TabsList className="bg-muted/50 p-1 h-8">
            <TabsTrigger value="chart" className="text-xs px-3 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Chart</TabsTrigger>
            <TabsTrigger value="table" className="text-xs px-3 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chart / Table */}
      {viewMode === 'chart' ? (
        <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Revenue Trend */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueMonthly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--tahoe-blue)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--tahoe-blue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-subtle)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={({ active, payload, label }) => <ChartTooltip active={active} payload={payload as any} label={label} formatter={(v) => formatCurrency(v)} />} />
                    <Area type="monotone" dataKey="revenue" stroke="var(--tahoe-blue)" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: 'var(--tahoe-blue)', stroke: 'var(--background)', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Plan Pie */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Revenue by Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={revenueByPlan} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="revenue" nameKey="plan" paddingAngle={3}>
                      {revenueByPlan.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => <ChartTooltip active={active} payload={payload as any} label={String(payload?.[0]?.name ?? '')} formatter={(v) => formatCurrency(v)} />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-1.5">
                {revenueByPlan.map((p) => (
                  <div key={p.plan} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-muted-foreground">{p.plan}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(p.revenue)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Client Bar */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Revenue by Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByClient} margin={{ top: 8, right: 8, left: -10, bottom: 0 }} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-subtle)" vertical={false} />
                    <XAxis dataKey="client" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={({ active, payload, label }) => <ChartTooltip active={active} payload={payload as any} label={label} formatter={(v) => formatCurrency(v)} />} />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={45}>
                      {revenueByClient.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} opacity={0.85} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={sectionVariants}>
          <Card className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">MRR</TableHead>
                    <TableHead className="text-right">ARR</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueMonthly.map(r => (
                    <TableRow key={r.month} className="hover:bg-accent/50">
                      <TableCell className="font-medium text-sm">{r.month}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(r.revenue)}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(r.mrr)}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(r.arr)}</TableCell>
                      <TableCell className="text-right">
                        <span className={cn('inline-flex items-center gap-0.5 text-xs font-semibold', r.growth >= 0 ? 'text-tahoe-green' : 'text-tahoe-red')}>
                          {r.growth >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                          {Math.abs(r.growth)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground print:mt-4">
        <span>TenantFlow OS — Revenue Report</span>
        <span>Page 1 · {generatedAt.toLocaleDateString()}</span>
      </div>

      {/* Export actions */}
      <div className="flex items-center gap-2 no-print">
        <Button variant="outline" size="sm" onClick={() => exportToCSV(csvData, 'revenue-report')} className="gap-1.5">
          <FileSpreadsheet className="size-3.5" /> Export CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => exportToJSON(csvData, 'revenue-report')} className="gap-1.5">
          <FileJson className="size-3.5" /> Export JSON
        </Button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT SUMMARY REPORT
// ═══════════════════════════════════════════════════════════════════════════════

function ClientSummaryReport() {
  const [viewMode, setViewMode] = React.useState<'chart' | 'table'>('chart')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const generatedAt = React.useMemo(() => new Date(), [])
  const d = clientSummaryData

  const kpis = [
    { label: 'Total Clients', value: d.total, trend: '+8.3%', trendDirection: 'up' as const, icon: Users, accent: 'tahoe-blue' },
    { label: 'Active Clients', value: d.active, trend: '+5.9%', trendDirection: 'up' as const, icon: CheckCircle2, accent: 'tahoe-green' },
    { label: 'Trial Clients', value: d.trial, icon: Clock, accent: 'tahoe-orange' },
    { label: 'Churned', value: d.churned, trend: '-50%', trendDirection: 'up' as const, icon: XCircle, accent: 'tahoe-red' },
  ]

  const statusPie = [
    { name: 'Active', value: d.active, color: '#34c759' },
    { name: 'Trial', value: d.trial, color: '#ff9500' },
    { name: 'Suspended', value: d.suspended, color: '#af52de' },
    { name: 'Churned', value: d.churned, color: '#ff3b30' },
  ]

  const filtered = statusFilter === 'all' ? d.clients : d.clients.filter(c => c.status === statusFilter)

  const csvData = d.clients.map(c => ({
    Name: c.name, Contact: c.contact, Email: c.email, Plan: c.plan, Status: c.status, MRR: c.mrr, 'Client Since': c.since,
  }))

  return (
    <div className="print-report-area space-y-6">
      <ReportHeader title="Client Summary Report" description="Complete client roster with status breakdown, plan distribution, and acquisition trends" icon={Users} generatedAt={generatedAt} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(kpi => <motion.div key={kpi.label} variants={itemVariants}><KpiCard {...kpi} /></motion.div>)}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
          </SelectContent>
        </Select>
        <Tabs value={viewMode} onValueChange={v => setViewMode(v as 'chart' | 'table')}>
          <TabsList className="bg-muted/50 p-1 h-8">
            <TabsTrigger value="chart" className="text-xs px-3 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Chart</TabsTrigger>
            <TabsTrigger value="table" className="text-xs px-3 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === 'chart' ? (
        <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Status Distribution */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Client Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={3}>
                      {statusPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => <ChartTooltip active={active} payload={payload as any} label={String(payload?.[0]?.name ?? '')} formatter={(v) => `${v} clients`} />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Plan Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={d.planDistribution} margin={{ top: 8, right: 8, left: -10, bottom: 0 }} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-subtle)" vertical={false} />
                    <XAxis dataKey="plan" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <Tooltip content={({ active, payload, label }) => <ChartTooltip active={active} payload={payload as any} label={label} />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
                      {d.planDistribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} opacity={0.85} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Acquisition Trend */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Client Acquisition Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={d.acquisitionTrend} margin={{ top: 8, right: 8, left: -10, bottom: 0 }} barCategoryGap="15%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-subtle)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <Tooltip content={({ active, payload, label }) => <ChartTooltip active={active} payload={payload as any} label={label} />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="newClients" name="New Clients" fill="#34c759" radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="churned" name="Churned" fill="#ff3b30" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={sectionVariants}>
          <Card className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">MRR</TableHead>
                    <TableHead>Since</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(c => (
                    <TableRow key={c.name} className="hover:bg-accent/50">
                      <TableCell className="font-medium text-sm">{c.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.contact}</TableCell>
                      <TableCell><Badge className={cn('tahoe-badge text-[10px]', PLAN_COLORS[c.plan])}>{c.plan}</Badge></TableCell>
                      <TableCell><Badge className={cn('tahoe-badge text-[10px]', STATUS_COLORS[c.status])}>{c.status}</Badge></TableCell>
                      <TableCell className="text-right text-sm">{c.mrr > 0 ? formatCurrency(c.mrr) : '—'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.since}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="flex items-center justify-between text-[10px] text-muted-foreground print:mt-4">
        <span>TenantFlow OS — Client Summary Report</span>
        <span>Page 1 · {generatedAt.toLocaleDateString()}</span>
      </div>

      <div className="flex items-center gap-2 no-print">
        <Button variant="outline" size="sm" onClick={() => exportToCSV(csvData, 'client-summary-report')} className="gap-1.5">
          <FileSpreadsheet className="size-3.5" /> Export CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => exportToJSON(csvData, 'client-summary-report')} className="gap-1.5">
          <FileJson className="size-3.5" /> Export JSON
        </Button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVOICE AGING REPORT
// ═══════════════════════════════════════════════════════════════════════════════

function InvoiceAgingReport() {
  const [viewMode, setViewMode] = React.useState<'chart' | 'table'>('chart')
  const generatedAt = React.useMemo(() => new Date(), [])
  const d = invoiceAgingData

  const kpis = [
    { label: 'Total Receivable', value: formatCurrency(d.totalReceivable), icon: DollarSign, accent: 'tahoe-blue' },
    { label: 'Overdue Total', value: formatCurrency(d.overdueTotal), trend: '+12.3%', trendDirection: 'down' as const, icon: AlertTriangle, accent: 'tahoe-red' },
    { label: 'Overdue %', value: `${d.overduePercent}%`, icon: Activity, accent: 'tahoe-orange' },
    { label: 'Overdue Invoices', value: d.overdueInvoices.length, icon: FileText, accent: 'tahoe-purple' },
  ]

  const csvData = d.overdueInvoices.map(inv => ({
    Invoice: inv.invoice, Client: inv.client, Amount: inv.amount, 'Due Date': inv.dueDate, 'Days Overdue': inv.daysOverdue, Bucket: inv.status,
  }))

  return (
    <div className="print-report-area space-y-6">
      <ReportHeader title="Invoice Aging Report" description="Outstanding invoices grouped by age with overdue details and receivable analysis" icon={FileText} generatedAt={generatedAt} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(kpi => <motion.div key={kpi.label} variants={itemVariants}><KpiCard {...kpi} /></motion.div>)}
      </div>

      <div className="flex items-center justify-end no-print">
        <Tabs value={viewMode} onValueChange={v => setViewMode(v as 'chart' | 'table')}>
          <TabsList className="bg-muted/50 p-1 h-8">
            <TabsTrigger value="chart" className="text-xs px-3 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Chart</TabsTrigger>
            <TabsTrigger value="table" className="text-xs px-3 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === 'chart' ? (
        <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Aging Buckets */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Receivables by Aging Bucket</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={d.buckets} margin={{ top: 8, right: 8, left: -10, bottom: 0 }} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-subtle)" vertical={false} />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={({ active, payload, label }) => <ChartTooltip active={active} payload={payload as any} label={label} formatter={(v) => formatCurrency(v)} />} />
                    <Bar dataKey="amount" name="Amount" radius={[6, 6, 0, 0]} maxBarSize={45}>
                      {d.buckets.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.85} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bucket Summary Cards */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Aging Bucket Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {d.buckets.map(bucket => (
                <div key={bucket.label} className="flex items-center gap-3 rounded-xl border border-border/30 p-3 hover:bg-accent/30 transition-colors">
                  <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: bucket.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{bucket.label}</p>
                    <p className="tahoe-caption">{bucket.count} invoice{bucket.count !== 1 ? 's' : ''}</p>
                  </div>
                  <span className="text-sm font-bold">{formatCurrency(bucket.amount)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex items-center justify-between px-3">
                <span className="text-sm font-semibold">Total Receivable</span>
                <span className="text-sm font-bold">{formatCurrency(d.totalReceivable)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={sectionVariants}>
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Overdue Invoice Details</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Days Overdue</TableHead>
                    <TableHead>Bucket</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {d.overdueInvoices.map(inv => (
                    <TableRow key={inv.invoice} className={cn('hover:bg-accent/50', inv.daysOverdue > 90 && 'bg-red-50/50 dark:bg-red-950/10')}>
                      <TableCell className="font-mono text-sm font-medium">{inv.invoice}</TableCell>
                      <TableCell className="text-sm">{inv.client}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatCurrency(inv.amount)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{inv.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <span className={cn('text-xs font-semibold', inv.daysOverdue > 60 ? 'text-tahoe-red' : inv.daysOverdue > 30 ? 'text-tahoe-orange' : 'text-tahoe-blue')}>
                          {inv.daysOverdue}d
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('tahoe-badge text-[10px]',
                          inv.status === '1-30' && 'tahoe-badge-blue',
                          inv.status === '31-60' && 'tahoe-badge-orange',
                          inv.status === '61-90' && 'tahoe-badge-purple',
                          inv.status === '90+' && 'tahoe-badge-red',
                        )}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="flex items-center justify-between text-[10px] text-muted-foreground print:mt-4">
        <span>TenantFlow OS — Invoice Aging Report</span>
        <span>Page 1 · {generatedAt.toLocaleDateString()}</span>
      </div>

      <div className="flex items-center gap-2 no-print">
        <Button variant="outline" size="sm" onClick={() => exportToCSV(csvData, 'invoice-aging-report')} className="gap-1.5">
          <FileSpreadsheet className="size-3.5" /> Export CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => exportToJSON(csvData, 'invoice-aging-report')} className="gap-1.5">
          <FileJson className="size-3.5" /> Export JSON
        </Button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LICENSE UTILIZATION REPORT
// ═══════════════════════════════════════════════════════════════════════════════

function LicenseUtilizationReport() {
  const [viewMode, setViewMode] = React.useState<'chart' | 'table'>('chart')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const generatedAt = React.useMemo(() => new Date(), [])
  const d = licenseData

  const kpis = [
    { label: 'Total Licenses', value: d.total, icon: Key, accent: 'tahoe-blue' },
    { label: 'Activated', value: d.activated, trend: '+8.6%', trendDirection: 'up' as const, icon: CheckCircle2, accent: 'tahoe-green' },
    { label: 'Available', value: d.available, icon: Clock, accent: 'tahoe-orange' },
    { label: 'Utilization Rate', value: `${d.utilizationRate}%`, icon: Activity, accent: 'tahoe-purple' },
  ]

  const statusPie = [
    { name: 'Activated', value: d.activated, color: '#0071e3' },
    { name: 'Available', value: d.available, color: '#34c759' },
    { name: 'Expired', value: d.expired, color: '#ff9500' },
    { name: 'Revoked', value: d.revoked, color: '#ff3b30' },
  ]

  const filtered = statusFilter === 'all' ? d.licenses : d.licenses.filter(l => l.status === statusFilter)

  const csvData = d.licenses.map(l => ({
    Key: l.key, Plan: l.plan, Status: l.status, Client: l.client, 'Activated At': l.activatedAt, 'Expires At': l.expiresAt, 'Devices': `${l.devices}/${l.maxDevices}`,
  }))

  return (
    <div className="print-report-area space-y-6">
      <ReportHeader title="License Utilization Report" description="License key distribution by status, plan type, utilization rate, and client assignment" icon={Key} generatedAt={generatedAt} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(kpi => <motion.div key={kpi.label} variants={itemVariants}><KpiCard {...kpi} /></motion.div>)}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="activated">Activated</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
        <Tabs value={viewMode} onValueChange={v => setViewMode(v as 'chart' | 'table')}>
          <TabsList className="bg-muted/50 p-1 h-8">
            <TabsTrigger value="chart" className="text-xs px-3 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Chart</TabsTrigger>
            <TabsTrigger value="table" className="text-xs px-3 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === 'chart' ? (
        <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Status Pie */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">License Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={3}>
                      {statusPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => <ChartTooltip active={active} payload={payload as any} label={String(payload?.[0]?.name ?? '')} formatter={(v) => `${v} licenses`} />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* By Plan */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Utilization by Plan</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={d.byPlan} margin={{ top: 8, right: 8, left: -10, bottom: 0 }} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-subtle)" vertical={false} />
                    <XAxis dataKey="plan" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
                    <Tooltip content={({ active, payload, label }) => <ChartTooltip active={active} payload={payload as any} label={label} formatter={(v) => `${v}%`} />} />
                    <Bar dataKey="utilization" name="Utilization" radius={[6, 6, 0, 0]} maxBarSize={40}>
                      {d.byPlan.map((entry, i) => (
                        <Cell key={i} fill={entry.utilization >= 80 ? '#34c759' : entry.utilization >= 60 ? '#ff9500' : '#ff3b30'} opacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Plan breakdown details */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">License Allocation by Plan</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {d.byPlan.map(plan => (
                  <div key={plan.plan} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={cn('tahoe-badge text-[10px]', PLAN_COLORS[plan.plan.toLowerCase()])}>{plan.plan}</Badge>
                        <span className="text-xs text-muted-foreground">{plan.activated} of {plan.total} activated</span>
                      </div>
                      <span className={cn('text-xs font-semibold', plan.utilization >= 80 ? 'text-tahoe-green' : plan.utilization >= 60 ? 'text-tahoe-orange' : 'text-tahoe-red')}>
                        {plan.utilization}% utilized
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="rounded-lg bg-tahoe-blue/10 p-2"><p className="text-[10px] text-muted-foreground">Activated</p><p className="text-sm font-bold text-tahoe-blue">{plan.activated}</p></div>
                      <div className="rounded-lg bg-tahoe-green/10 p-2"><p className="text-[10px] text-muted-foreground">Available</p><p className="text-sm font-bold text-tahoe-green">{plan.available}</p></div>
                      <div className="rounded-lg bg-tahoe-orange/10 p-2"><p className="text-[10px] text-muted-foreground">Expired</p><p className="text-sm font-bold text-tahoe-orange">{plan.expired}</p></div>
                      <div className="rounded-lg bg-tahoe-red/10 p-2"><p className="text-[10px] text-muted-foreground">Revoked</p><p className="text-sm font-bold text-tahoe-red">{plan.revoked}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={sectionVariants}>
          <Card className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License Key</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Activated</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Devices</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(l => (
                    <TableRow key={l.key} className="hover:bg-accent/50">
                      <TableCell className="font-mono text-xs">{l.key}</TableCell>
                      <TableCell><Badge className={cn('tahoe-badge text-[10px]', PLAN_COLORS[l.plan])}>{l.plan}</Badge></TableCell>
                      <TableCell><Badge className={cn('tahoe-badge text-[10px]', LICENSE_STATUS_COLORS[l.status])}>{l.status}</Badge></TableCell>
                      <TableCell className="text-sm">{l.client}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{l.activatedAt}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{l.expiresAt}</TableCell>
                      <TableCell className="text-right text-sm">{l.devices}/{l.maxDevices}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="flex items-center justify-between text-[10px] text-muted-foreground print:mt-4">
        <span>TenantFlow OS — License Utilization Report</span>
        <span>Page 1 · {generatedAt.toLocaleDateString()}</span>
      </div>

      <div className="flex items-center gap-2 no-print">
        <Button variant="outline" size="sm" onClick={() => exportToCSV(csvData, 'license-utilization-report')} className="gap-1.5">
          <FileSpreadsheet className="size-3.5" /> Export CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => exportToJSON(csvData, 'license-utilization-report')} className="gap-1.5">
          <FileJson className="size-3.5" /> Export JSON
        </Button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHURN ANALYSIS REPORT
// ═══════════════════════════════════════════════════════════════════════════════

function ChurnAnalysisReport() {
  const [viewMode, setViewMode] = React.useState<'chart' | 'table'>('chart')
  const generatedAt = React.useMemo(() => new Date(), [])
  const d = churnData

  const kpis = [
    { label: 'Churn Rate', value: `${d.rate}%`, trend: '-0.5pp', trendDirection: 'up' as const, icon: TrendingDown, accent: 'tahoe-red' },
    { label: 'Retention Rate', value: `${d.retained}%`, trend: '+0.5pp', trendDirection: 'up' as const, icon: CheckCircle2, accent: 'tahoe-green' },
    { label: 'At-Risk Clients', value: d.atRisk, icon: AlertTriangle, accent: 'tahoe-orange' },
    { label: 'Churned (12mo)', value: d.churnTrend.reduce((s, c) => s + c.churned, 0), icon: XCircle, accent: 'tahoe-purple' },
  ]

  const csvData = d.churnTrend.map(c => ({
    Month: c.month, 'Churn Rate %': c.churnRate, 'Retention Rate %': c.retentionRate, Churned: c.churned, Retained: c.retained,
  }))

  return (
    <div className="print-report-area space-y-6">
      <ReportHeader title="Churn Analysis Report" description="Client churn rate trends, reasons, retention metrics, and at-risk client identification" icon={TrendingDown} generatedAt={generatedAt} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(kpi => <motion.div key={kpi.label} variants={itemVariants}><KpiCard {...kpi} /></motion.div>)}
      </div>

      <div className="flex items-center justify-end no-print">
        <Tabs value={viewMode} onValueChange={v => setViewMode(v as 'chart' | 'table')}>
          <TabsList className="bg-muted/50 p-1 h-8">
            <TabsTrigger value="chart" className="text-xs px-3 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Chart</TabsTrigger>
            <TabsTrigger value="table" className="text-xs px-3 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === 'chart' ? (
        <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Churn Trend */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Churn Rate Over Time</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={d.churnTrend} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-subtle)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 10]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={(v: number) => `${v}%`} />
                    <Tooltip content={({ active, payload, label }) => <ChartTooltip active={active} payload={payload as any} label={label} formatter={(v) => `${v}%`} />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="churnRate" name="Churn Rate" stroke="#ff3b30" strokeWidth={2} dot={{ r: 3, fill: '#ff3b30' }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="retentionRate" name="Retention Rate" stroke="#34c759" strokeWidth={2} dot={{ r: 3, fill: '#34c759' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Churn Reasons */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Churn Reasons</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={d.reasons} layout="vertical" margin={{ top: 8, right: 20, left: 80, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-subtle)" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={(v: number) => `${v}%`} />
                    <YAxis type="category" dataKey="reason" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <Tooltip content={({ active, payload, label }) => <ChartTooltip active={active} payload={payload as any} label={label} formatter={(v) => `${v}%`} />} />
                    <Bar dataKey="pct" name="Percentage" radius={[0, 6, 6, 0]} maxBarSize={24} fill="#ff9500" opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* At-Risk Clients */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">At-Risk Clients</CardTitle>
                <Badge className="tahoe-badge tahoe-badge-orange">
                  <AlertTriangle className="size-3" />
                  {d.atRisk} at risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {d.atRiskClients.map(client => (
                <div key={client.name} className={cn(
                  'flex items-center gap-4 rounded-xl border p-4 transition-colors',
                  client.risk === 'high' ? 'border-tahoe-red/20 bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.05]' : 'border-tahoe-orange/20 bg-tahoe-orange/[0.03] dark:bg-tahoe-orange/[0.05]'
                )}>
                  <div className={cn(
                    'flex size-10 items-center justify-center rounded-xl shrink-0',
                    client.risk === 'high' ? 'bg-tahoe-red/10' : 'bg-tahoe-orange/10'
                  )}>
                    <AlertTriangle className={cn('size-5', client.risk === 'high' ? 'text-tahoe-red' : 'text-tahoe-orange')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{client.name}</p>
                      <Badge className={cn('tahoe-badge text-[10px]', RISK_COLORS[client.risk])}>{client.risk} risk</Badge>
                      <Badge className={cn('tahoe-badge text-[10px]', PLAN_COLORS[client.plan])}>{client.plan}</Badge>
                    </div>
                    <p className="tahoe-caption mt-0.5">{client.reason}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Last activity: {client.lastActivity} · MRR: {formatCurrency(client.mrr)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={sectionVariants} className="space-y-4">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Churn Metrics</CardTitle></CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Churn Rate</TableHead>
                    <TableHead className="text-right">Retention Rate</TableHead>
                    <TableHead className="text-right">Churned</TableHead>
                    <TableHead className="text-right">Retained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {d.churnTrend.map(c => (
                    <TableRow key={c.month} className="hover:bg-accent/50">
                      <TableCell className="font-medium text-sm">{c.month}</TableCell>
                      <TableCell className="text-right"><span className="text-xs font-semibold text-tahoe-red">{c.churnRate}%</span></TableCell>
                      <TableCell className="text-right"><span className="text-xs font-semibold text-tahoe-green">{c.retentionRate}%</span></TableCell>
                      <TableCell className="text-right text-sm">{c.churned}</TableCell>
                      <TableCell className="text-right text-sm">{c.retained}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Churn Reasons Breakdown</CardTitle></CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {d.reasons.map(r => (
                    <TableRow key={r.reason} className="hover:bg-accent/50">
                      <TableCell className="font-medium text-sm">{r.reason}</TableCell>
                      <TableCell className="text-right text-sm">{r.count}</TableCell>
                      <TableCell className="text-right"><span className="text-xs font-semibold">{r.pct}%</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="flex items-center justify-between text-[10px] text-muted-foreground print:mt-4">
        <span>TenantFlow OS — Churn Analysis Report</span>
        <span>Page 1 · {generatedAt.toLocaleDateString()}</span>
      </div>

      <div className="flex items-center gap-2 no-print">
        <Button variant="outline" size="sm" onClick={() => exportToCSV(csvData, 'churn-analysis-report')} className="gap-1.5">
          <FileSpreadsheet className="size-3.5" /> Export CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => exportToJSON(csvData, 'churn-analysis-report')} className="gap-1.5">
          <FileJson className="size-3.5" /> Export JSON
        </Button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORT TYPE CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const REPORT_TYPES = [
  { id: 'revenue', label: 'Revenue Report', description: 'Revenue breakdown by period, client, and plan', icon: DollarSign, color: 'tahoe-green' },
  { id: 'clients', label: 'Client Summary', description: 'Client roster with status and plan distribution', icon: Users, color: 'tahoe-blue' },
  { id: 'aging', label: 'Invoice Aging', description: 'Outstanding invoices grouped by age', icon: FileText, color: 'tahoe-orange' },
  { id: 'licenses', label: 'License Utilization', description: 'License status, utilization, and assignments', icon: Key, color: 'tahoe-purple' },
  { id: 'churn', label: 'Churn Analysis', description: 'Churn rates, reasons, and at-risk clients', icon: TrendingDown, color: 'tahoe-red' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN REPORTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = React.useState('revenue')
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [dateRange, setDateRange] = React.useState({ start: '2025-01-01', end: '2025-12-31' })

  const handleRefresh = React.useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1200)
  }, [])

  const handlePrint = React.useCallback(() => {
    window.print()
  }, [])

  const renderReport = () => {
    switch (selectedReport) {
      case 'revenue': return <RevenueReport />
      case 'clients': return <ClientSummaryReport />
      case 'aging': return <InvoiceAgingReport />
      case 'licenses': return <LicenseUtilizationReport />
      case 'churn': return <ChurnAnalysisReport />
      default: return <RevenueReport />
    }
  }

  return (
    <>
      {/* Print-only CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .print-report-area, .print-report-area * { visibility: visible; }
          .print-report-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
          .glass-card, .glass-panel { background: white !important; box-shadow: none !important; border: 1px solid #e5e7eb !important; }
          .glass-tint-blue, .glass-tint-purple, .glass-tint-green { background: white !important; }
        }
      ` }} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-purple/10">
                <BarChart3 className="size-6 text-tahoe-purple" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">Reports Generator</h1>
                <p className="mt-1 text-sm text-muted-foreground">Professional business reports with print and export capabilities</p>
              </div>
            </div>
            <div className="flex items-center gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
                <Printer className="size-3.5" /> Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1.5" disabled={isRefreshing}>
                <RefreshCw className={cn('size-3.5', isRefreshing && 'animate-spin')} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Report Type Selector */}
        <motion.div variants={itemVariants}>
          <div className="flex gap-2 overflow-x-auto pb-1 no-print">
            {REPORT_TYPES.map(rt => (
              <button
                key={rt.id}
                onClick={() => setSelectedReport(rt.id)}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200',
                  selectedReport === rt.id
                    ? 'border-primary/30 bg-primary/10 text-primary shadow-sm'
                    : 'border-border/30 bg-card/50 text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <rt.icon className={cn('size-4', selectedReport === rt.id && `text-${rt.color}`)} />
                {rt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Date Range Filter */}
        <motion.div variants={itemVariants} className="no-print">
          <Card className="glass-card">
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="size-4" />
                  <span className="font-medium">Date Range</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="h-8 text-xs w-[150px]"
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="h-8 text-xs w-[150px]"
                  />
                </div>
                <Badge className="tahoe-badge tahoe-badge-blue text-[10px]">
                  <Calendar className="size-3" />
                  {dateRange.start} — {dateRange.end}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Report Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedReport}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderReport()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  )
}
