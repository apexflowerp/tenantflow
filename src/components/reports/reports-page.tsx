'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileBarChart,
  DollarSign,
  Building2,
  Users,
  Briefcase,
  Eye,
  Play,
  Download,
  Plus,
  Receipt,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  CreditCard,
  Calendar,
  ArrowLeft,
  Search,
  ChevronDown,
  LayoutGrid,
  List,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { InvoiceViewer, SAMPLE_INVOICE } from './invoice-viewer'
import type { InvoiceData } from './invoice-viewer'
import { ReportViewer, SAMPLE_REPORT } from './report-viewer'
import { GenerateReportDialog, type ReportConfig } from './generate-report-dialog'
import { InvoiceGenerator } from './invoice-generator'
import { PrintStyles } from './print-styles'

// ── Report categories data ───────────────────────────────────────────────────

interface ReportItem {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: string
}

const REPORT_CATEGORIES = [
  {
    id: 'financial',
    label: 'Financial Reports',
    icon: DollarSign,
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/20',
    reports: [
      { id: 'income-statement', name: 'Income Statement (P&L)', description: 'Revenue, expenses, and net income overview', icon: TrendingUp },
      { id: 'balance-sheet', name: 'Balance Sheet', description: 'Assets, liabilities, and equity snapshot', icon: BarChart3 },
      { id: 'cash-flow', name: 'Cash Flow Statement', description: 'Cash inflows and outflows analysis', icon: DollarSign },
      { id: 'rent-roll', name: 'Rent Roll Report', description: 'Complete rental income breakdown by unit', icon: FileText },
      { id: 'ar-aging', name: 'Accounts Receivable Aging', description: 'Outstanding receivables by age bracket', icon: Clock },
      { id: 'ap-summary', name: 'Accounts Payable Summary', description: 'Outstanding payables and vendor obligations', icon: CreditCard },
      { id: 'revenue-by-property', name: 'Revenue by Property', description: 'Income comparison across all properties', icon: PieChart },
      { id: 'expense-breakdown', name: 'Expense Breakdown', description: 'Categorized expense analysis', icon: BarChart3 },
    ] as unknown as ReportItem[],
  },
  {
    id: 'property',
    label: 'Property Reports',
    icon: Building2,
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    borderColor: 'border-sky-200 dark:border-sky-800',
    reports: [
      { id: 'occupancy', name: 'Occupancy Report', description: 'Occupancy rates by property and unit type', icon: Building2 },
      { id: 'property-performance', name: 'Property Performance', description: 'Key performance metrics per property', icon: TrendingUp },
      { id: 'lease-expiration', name: 'Lease Expiration Report', description: 'Upcoming lease renewals and expirations', icon: Calendar },
      { id: 'vacancy', name: 'Vacancy Report', description: 'Available units and vacancy trends', icon: FileText },
      { id: 'maintenance-summary', name: 'Maintenance Summary', description: 'Maintenance costs and ticket analytics', icon: BarChart3 },
    ] as unknown as ReportItem[],
  },
  {
    id: 'tenant',
    label: 'Tenant Reports',
    icon: Users,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    borderColor: 'border-teal-200 dark:border-teal-800',
    reports: [
      { id: 'tenant-directory', name: 'Tenant Directory', description: 'Complete tenant roster with contact details', icon: Users },
      { id: 'payment-history', name: 'Payment History', description: 'Transaction history and payment patterns', icon: CreditCard },
      { id: 'outstanding-balances', name: 'Outstanding Balances', description: 'Tenants with overdue or pending payments', icon: DollarSign },
      { id: 'tenant-activity', name: 'Tenant Activity Log', description: 'Recent tenant interactions and events', icon: Clock },
    ] as unknown as ReportItem[],
  },
  {
    id: 'owner',
    label: 'Owner/Management Reports',
    icon: Briefcase,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    reports: [
      { id: 'owner-statement', name: 'Owner Statement', description: 'Property owner income and expense summary', icon: FileText },
      { id: 'portfolio-summary', name: 'Portfolio Summary', description: 'High-level portfolio performance overview', icon: Briefcase },
      { id: 'collection-rate', name: 'Collection Rate Report', description: 'Rent collection efficiency metrics', icon: TrendingUp },
      { id: 'budget-vs-actual', name: 'Budget vs Actual', description: 'Budget performance comparison analysis', icon: BarChart3 },
    ] as unknown as ReportItem[],
  },
]

// ── Recent reports mock data ─────────────────────────────────────────────────

interface RecentReport {
  id: string
  name: string
  type: 'report' | 'invoice'
  date: string
  format: string
  size: string
}

const RECENT_REPORTS: RecentReport[] = [
  { id: '1', name: 'Property Performance Report', type: 'report', date: 'Mar 4, 2025', format: 'PDF', size: '2.4 MB' },
  { id: '2', name: 'Invoice #INV-2024-001', type: 'invoice', date: 'Jan 15, 2025', format: 'PDF', size: '156 KB' },
  { id: '3', name: 'Rent Roll Report - Q4 2024', type: 'report', date: 'Jan 2, 2025', format: 'PDF', size: '1.8 MB' },
  { id: '4', name: 'Income Statement - Annual', type: 'report', date: 'Dec 30, 2024', format: 'PDF', size: '3.1 MB' },
  { id: '5', name: 'Invoice #INV-2024-018', type: 'invoice', date: 'Dec 15, 2024', format: 'PDF', size: '142 KB' },
  { id: '6', name: 'Occupancy Report - December', type: 'report', date: 'Dec 1, 2024', format: 'PDF', size: '890 KB' },
]

// ── View state ───────────────────────────────────────────────────────────────

type ViewState =
  | { view: 'hub' }
  | { view: 'invoice-preview'; data: InvoiceData }
  | { view: 'invoice-create' }
  | { view: 'report-preview' }

// ── Component ────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const [state, setState] = React.useState<ViewState>({ view: 'hub' })
  const [generateOpen, setGenerateOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  const handleGenerateReport = (config: ReportConfig) => {
    // Navigate to report preview with sample data
    setState({ view: 'report-preview' })
  }

  const handlePreviewReport = (reportId: string) => {
    setState({ view: 'report-preview' })
  }

  const handlePreviewInvoice = () => {
    setState({ view: 'invoice-preview', data: SAMPLE_INVOICE })
  }

  // Filter reports by search
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return REPORT_CATEGORIES
    const q = searchQuery.toLowerCase()
    return REPORT_CATEGORIES.map((cat) => ({
      ...cat,
      reports: cat.reports.filter(
        (r) =>
          r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.reports.length > 0)
  }, [searchQuery])

  return (
    <>
      <PrintStyles />

      <AnimatePresence mode="wait">
        {/* ── Hub View ──────────────────────────────────────────── */}
        {state.view === 'hub' && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  Reports & Invoices
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate, preview, and export professional business documents
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviewInvoice}
                >
                  <Receipt className="mr-1.5 size-4" />
                  View Sample Invoice
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Plus className="mr-1.5 size-4" />
                      Generate Report
                      <ChevronDown className="ml-1.5 size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setGenerateOpen(true)}>
                      <FileBarChart className="mr-2 size-4" />
                      Custom Report...
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setState({ view: 'invoice-create' })}>
                      <Receipt className="mr-2 size-4" />
                      New Invoice
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: 'Reports Generated', value: '24', icon: FileBarChart, color: 'text-primary', bg: 'bg-primary/5' },
                { label: 'Invoices Sent', value: '18', icon: Receipt, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30' },
                { label: 'Total Revenue', value: '$269.8K', icon: DollarSign, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/30' },
                { label: 'Outstanding', value: '$12.4K', icon: CreditCard, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
              ].map((stat) => (
                <Card key={stat.label} className="mojave-card border-border/30">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`flex size-9 items-center justify-center rounded-lg ${stat.bg}`}>
                      <stat.icon className={`size-4 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-lg font-bold tabular-nums">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search & View Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center rounded-lg border border-border p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md p-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-md p-1.5 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>

            {/* Report Categories */}
            {filteredCategories.map((category) => (
              <div key={category.id}>
                <div className="mb-3 flex items-center gap-2">
                  <category.icon className={`size-4 ${category.color}`} />
                  <h2 className="text-sm font-semibold text-foreground">{category.label}</h2>
                  <Badge variant="secondary" className="text-[10px]">
                    {category.reports.length}
                  </Badge>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {category.reports.map((report) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Card className="group mojave-card border-border/30 transition-all hover:border-primary/20 hover:shadow-md dark:hover:border-primary/30">
                          <CardContent className="p-4">
                            <div className="mb-3 flex items-start gap-2.5">
                              <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${category.bgColor}`}>
                                <report.icon className={`size-4 ${category.color}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">
                                  {report.name}
                                </p>
                                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                  {report.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 flex-1 text-xs"
                                onClick={() => handlePreviewReport(report.id)}
                              >
                                <Eye className="mr-1 size-3" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                className="h-7 flex-1 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                                onClick={() => {
                                  setGenerateOpen(true)
                                }}
                              >
                                <Play className="mr-1 size-3" />
                                Generate
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="mojave-card border-border/30">
                    <CardContent className="divide-y divide-border/50 p-0">
                      {category.reports.map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
                        >
                          <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${category.bgColor}`}>
                            <report.icon className={`size-4 ${category.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">{report.name}</p>
                            <p className="text-xs text-muted-foreground">{report.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handlePreviewReport(report.id)}
                            >
                              <Eye className="mr-1 size-3" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                              onClick={() => setGenerateOpen(true)}
                            >
                              <Play className="mr-1 size-3" />
                              Generate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}

            {/* Recent Reports */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="size-4 text-muted-foreground" />
                Recent Reports
              </h2>
              <Card className="mojave-card border-border/30">
                <CardContent className="divide-y divide-border/50 p-0">
                  {RECENT_REPORTS.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
                    >
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                          report.type === 'invoice'
                            ? 'bg-sky-50 dark:bg-sky-950/30'
                            : 'bg-primary/5'
                        }`}
                      >
                        {report.type === 'invoice' ? (
                          <Receipt className="size-4 text-sky-600 dark:text-sky-400" />
                        ) : (
                          <FileBarChart className="size-4 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{report.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.date} · {report.format} · {report.size}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            report.type === 'invoice'
                              ? 'border-sky-200 text-sky-600 dark:border-sky-800 dark:text-sky-400'
                              : 'border-primary/20 text-primary dark:border-primary/30'
                          }`}
                        >
                          {report.type === 'invoice' ? 'Invoice' : 'Report'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-foreground"
                        >
                          <Download className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ── Invoice Preview View ──────────────────────────────── */}
        {state.view === 'invoice-preview' && (
          <motion.div
            key="invoice-preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <InvoiceViewer
              data={state.data}
              onBack={() => setState({ view: 'hub' })}
              onEdit={() => setState({ view: 'invoice-create' })}
            />
          </motion.div>
        )}

        {/* ── Invoice Create View ────────────────────────────────── */}
        {state.view === 'invoice-create' && (
          <motion.div
            key="invoice-create"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <InvoiceGenerator
              onPreview={(data) => setState({ view: 'invoice-preview', data })}
              onSaveDraft={() => setState({ view: 'hub' })}
              onSend={() => setState({ view: 'hub' })}
              onCancel={() => setState({ view: 'hub' })}
            />
          </motion.div>
        )}

        {/* ── Report Preview View ────────────────────────────────── */}
        {state.view === 'report-preview' && (
          <motion.div
            key="report-preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ReportViewer onBack={() => setState({ view: 'hub' })} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Report Dialog */}
      <GenerateReportDialog
        open={generateOpen}
        onOpenChange={setGenerateOpen}
        onGenerate={handleGenerateReport}
      />
    </>
  )
}
