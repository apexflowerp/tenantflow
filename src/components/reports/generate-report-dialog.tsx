'use client'

import * as React from 'react'
import {
  FileBarChart,
  Eye,
  Printer,
  Download,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

// ── Report types ─────────────────────────────────────────────────────────────

const REPORT_TYPES = [
  { group: 'Financial Reports', items: [
    { id: 'income-statement', label: 'Income Statement (P&L)' },
    { id: 'balance-sheet', label: 'Balance Sheet' },
    { id: 'cash-flow', label: 'Cash Flow Statement' },
    { id: 'rent-roll', label: 'Rent Roll Report' },
    { id: 'ar-aging', label: 'Accounts Receivable Aging' },
    { id: 'ap-summary', label: 'Accounts Payable Summary' },
    { id: 'revenue-by-property', label: 'Revenue by Property' },
    { id: 'expense-breakdown', label: 'Expense Breakdown' },
  ]},
  { group: 'Property Reports', items: [
    { id: 'occupancy', label: 'Occupancy Report' },
    { id: 'property-performance', label: 'Property Performance' },
    { id: 'lease-expiration', label: 'Lease Expiration Report' },
    { id: 'vacancy', label: 'Vacancy Report' },
    { id: 'maintenance-summary', label: 'Maintenance Summary' },
  ]},
  { group: 'Tenant Reports', items: [
    { id: 'tenant-directory', label: 'Tenant Directory' },
    { id: 'payment-history', label: 'Payment History' },
    { id: 'outstanding-balances', label: 'Outstanding Balances' },
    { id: 'tenant-activity', label: 'Tenant Activity Log' },
  ]},
  { group: 'Owner/Management Reports', items: [
    { id: 'owner-statement', label: 'Owner Statement' },
    { id: 'portfolio-summary', label: 'Portfolio Summary' },
    { id: 'collection-rate', label: 'Collection Rate Report' },
    { id: 'budget-vs-actual', label: 'Budget vs Actual' },
  ]},
]

const PROPERTIES = [
  { id: 'all', label: 'All Properties' },
  { id: 'skyline-tower', label: 'Skyline Tower' },
  { id: 'harbor-view', label: 'Harbor View Residences' },
  { id: 'greenfield', label: 'Greenfield Gardens' },
  { id: 'metro-hub', label: 'Metro Commercial Hub' },
  { id: 'riverside', label: 'Riverside Apartments' },
  { id: 'oakwood', label: 'Oakwood Estates' },
]

// ── Component ────────────────────────────────────────────────────────────────

interface GenerateReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate?: (config: ReportConfig) => void
}

export interface ReportConfig {
  type: string
  label: string
  dateFrom: string
  dateTo: string
  property: string
  format: 'view' | 'print' | 'pdf'
}

export function GenerateReportDialog({
  open,
  onOpenChange,
  onGenerate,
}: GenerateReportDialogProps) {
  const [reportType, setReportType] = React.useState('')
  const [reportLabel, setReportLabel] = React.useState('')
  const [dateFrom, setDateFrom] = React.useState('2025-01-01')
  const [dateTo, setDateTo] = React.useState('2025-03-31')
  const [property, setProperty] = React.useState('all')
  const [format, setFormat] = React.useState<'view' | 'print' | 'pdf'>('view')

  const handleTypeChange = (val: string) => {
    setReportType(val)
    // Find label
    for (const group of REPORT_TYPES) {
      const found = group.items.find((i) => i.id === val)
      if (found) {
        setReportLabel(found.label)
        break
      }
    }
  }

  const handleGenerate = () => {
    if (!reportType) return
    onGenerate?.({
      type: reportType,
      label: reportLabel,
      dateFrom,
      dateTo,
      property,
      format,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileBarChart className="size-5 text-emerald-600 dark:text-emerald-400" />
            Generate Report
          </DialogTitle>
          <DialogDescription>
            Select a report type, configure the parameters, and generate your report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={handleTypeChange}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type..." />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {REPORT_TYPES.map((group) => (
                  <React.Fragment key={group.group}>
                    <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.group}
                    </div>
                    {group.items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                    <Separator className="my-1" />
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date-from">From</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">To</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Property Filter */}
          <div className="space-y-2">
            <Label htmlFor="property-filter">Property (Optional)</Label>
            <Select value={property} onValueChange={setProperty}>
              <SelectTrigger id="property-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROPERTIES.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label>Format</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('view')}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
                  format === 'view'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'border-border text-muted-foreground hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30'
                }`}
              >
                <Eye className="size-3.5" />
                View
              </button>
              <button
                type="button"
                onClick={() => setFormat('print')}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
                  format === 'print'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'border-border text-muted-foreground hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30'
                }`}
              >
                <Printer className="size-3.5" />
                Print
              </button>
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
                  format === 'pdf'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'border-border text-muted-foreground hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30'
                }`}
              >
                <Download className="size-3.5" />
                PDF
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!reportType}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <FileBarChart className="mr-1.5 size-4" />
            Generate Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
