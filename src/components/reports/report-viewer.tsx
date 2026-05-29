'use client'

import * as React from 'react'
import {
  Building2,
  Printer,
  Download,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ReportPropertyRow {
  name: string
  units: number
  occupied: number
  occupancyRate: number
  revenue: number
  expenses: number
  noi: number
}

export interface ReportData {
  title: string
  subtitle?: string
  period: string
  generatedAt: string
  showWatermark?: boolean
  executiveSummary: {
    totalProperties: number
    totalUnits: number
    overallOccupancy: number
    totalRevenue: number
    totalExpenses: number
    netOperatingIncome: number
    highlights: string[]
  }
  properties: ReportPropertyRow[]
  charts?: {
    type: 'bar' | 'pie' | 'line'
    title: string
    data: { label: string; value: number; color?: string }[]
  }[]
}

// ── Sample data ──────────────────────────────────────────────────────────────

export const SAMPLE_REPORT: ReportData = {
  title: 'Property Performance Report',
  subtitle: 'Quarterly Analysis',
  period: 'January 1 - March 31, 2025',
  generatedAt: 'March 4, 2025 at 10:30 AM',
  showWatermark: false,
  executiveSummary: {
    totalProperties: 6,
    totalUnits: 24,
    overallOccupancy: 83,
    totalRevenue: 91200,
    totalExpenses: 34600,
    netOperatingIncome: 56600,
    highlights: [
      'Overall occupancy increased by 5% from last quarter',
      'Harbor View Residences achieved 100% occupancy',
      'Net Operating Income grew 12% year-over-year',
      'Two new leases signed at Metro Commercial Hub',
    ],
  },
  properties: [
    { name: 'Skyline Tower', units: 6, occupied: 5, occupancyRate: 83, revenue: 18500, expenses: 6200, noi: 12300 },
    { name: 'Harbor View Residences', units: 4, occupied: 4, occupancyRate: 100, revenue: 12800, expenses: 4100, noi: 8700 },
    { name: 'Greenfield Gardens', units: 4, occupied: 3, occupancyRate: 75, revenue: 9600, expenses: 3800, noi: 5800 },
    { name: 'Metro Commercial Hub', units: 3, occupied: 3, occupancyRate: 100, revenue: 22500, expenses: 8900, noi: 13600 },
    { name: 'Riverside Apartments', units: 4, occupied: 3, occupancyRate: 75, revenue: 14200, expenses: 5600, noi: 8600 },
    { name: 'Oakwood Estates', units: 3, occupied: 2, occupancyRate: 67, revenue: 13600, expenses: 6000, noi: 7600 },
  ],
  charts: [
    {
      type: 'bar',
      title: 'Revenue by Property',
      data: [
        { label: 'Skyline Tower', value: 18500, color: '#b8653a' },
        { label: 'Harbor View', value: 12800, color: '#c2703a' },
        { label: 'Greenfield', value: 9600, color: '#34d399' },
        { label: 'Metro Hub', value: 22500, color: '#047857' },
        { label: 'Riverside', value: 14200, color: '#6ee7b7' },
        { label: 'Oakwood', value: 13600, color: '#a7f3d0' },
      ],
    },
    {
      type: 'pie',
      title: 'Expense Breakdown',
      data: [
        { label: 'Maintenance', value: 12400, color: '#b8653a' },
        { label: 'Insurance', value: 8200, color: '#c2703a' },
        { label: 'Utilities', value: 6800, color: '#34d399' },
        { label: 'Management', value: 4800, color: '#6ee7b7' },
        { label: 'Other', value: 2400, color: '#a7f3d0' },
      ],
    },
  ],
}

// ── Format helpers ───────────────────────────────────────────────────────────

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function fmtPct(n: number) {
  return `${n}%`
}

// ── Mini chart components ────────────────────────────────────────────────────

function MiniBarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-2 text-xs">
          <span className="w-24 shrink-0 truncate text-gray-600 dark:text-gray-400">{d.label}</span>
          <div className="flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-5 rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: d.color ?? '#b8653a',
                minWidth: '4px',
              }}
            />
          </div>
          <span className="w-16 shrink-0 text-right tabular-nums font-medium text-gray-900 dark:text-gray-100">
            {fmtCurrency(d.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function MiniPieChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)

  // Compute segments with cumulative percentages using reduce
  const segments = data.reduce<Array<{ label: string; value: number; color?: string; pct: number; start: number }>>(
    (acc, d) => {
      const pct = (d.value / total) * 100
      const start = acc.length > 0 ? acc[acc.length - 1].start + acc[acc.length - 1].pct : 0
      acc.push({ ...d, pct, start })
      return acc
    },
    []
  )

  return (
    <div className="flex items-center gap-6">
      {/* Simple donut using conic gradient */}
      <div
        className="size-32 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(${segments
            .map(
              (s) =>
                `${s.color ?? '#b8653a'} ${s.start}% ${s.start + s.pct}%`
            )
            .join(', ')})`,
        }}
      >
        <div className="flex size-full items-center justify-center rounded-full bg-white dark:bg-gray-900">
          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
            {fmtCurrency(total)}
          </span>
        </div>
      </div>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <div
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: d.color ?? '#b8653a' }}
            />
            <span className="text-gray-600 dark:text-gray-400">
              {d.label} ({((d.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

interface ReportViewerProps {
  data?: ReportData
  onBack?: () => void
}

export function ReportViewer({ data = SAMPLE_REPORT, onBack }: ReportViewerProps) {
  const handlePrint = () => {
    window.print()
  }

  const summary = data.executiveSummary

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="no-print flex items-center justify-between gap-3 print-hide">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-1 size-4" />
              Back
            </Button>
          )}
          <Badge className="bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary">
            {data.period}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1.5 size-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Download className="mr-1.5 size-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Report Document */}
      <div
        className="print-document mx-auto w-full max-w-[816px] rounded-lg border border-border bg-white shadow-sm dark:bg-card"
        id="report-document"
      >
        <div className="p-8 sm:p-10" style={{ fontFamily: 'system-ui, sans-serif' }}>
          {/* Watermark */}
          {data.showWatermark && (
            <div className="watermark pointer-events-none select-none">CONFIDENTIAL</div>
          )}

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <Building2 className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  TenantFlow OS
                </h1>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {data.title}
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
              <p>
                Period:{' '}
                <span className="font-medium text-gray-700 dark:text-gray-300">{data.period}</span>
              </p>
              <p>
                Generated:{' '}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {data.generatedAt}
                </span>
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ── Executive Summary ───────────────────────────────────── */}
          <section className="page-break-inside-avoid">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-primary">
              Executive Summary
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Properties
                </p>
                <p className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {summary.totalProperties}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Occupancy
                </p>
                <p className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {fmtPct(summary.overallOccupancy)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Revenue
                </p>
                <p className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {fmtCurrency(summary.totalRevenue)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Expenses
                </p>
                <p className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {fmtCurrency(summary.totalExpenses)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  NOI
                </p>
                <p className="text-lg font-bold tabular-nums text-primary">
                  {fmtCurrency(summary.netOperatingIncome)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Total Units
                </p>
                <p className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {summary.totalUnits}
                </p>
              </div>
            </div>

            {summary.highlights.length > 0 && (
              <ul className="mt-3 space-y-1">
                {summary.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <TrendingUp className="mt-0.5 size-3 shrink-0 text-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Separator className="my-6" />

          {/* ── Detailed Analysis Table ──────────────────────────────── */}
          <section className="page-break-inside-avoid">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-primary">
              Detailed Analysis
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Property
                  </th>
                  <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Units
                  </th>
                  <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Occupied
                  </th>
                  <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Rate
                  </th>
                  <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Revenue
                  </th>
                  <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Expenses
                  </th>
                  <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    NOI
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.properties.map((p) => (
                  <tr
                    key={p.name}
                    className="border-b border-gray-100 dark:border-gray-800 page-break-inside-avoid"
                  >
                    <td className="py-2.5 font-medium text-gray-900 dark:text-gray-100">
                      {p.name}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {p.units}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {p.occupied}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      <span
                        className={`font-medium ${
                          p.occupancyRate >= 90
                            ? 'text-primary'
                            : p.occupancyRate >= 75
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {fmtPct(p.occupancyRate)}
                      </span>
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {fmtCurrency(p.revenue)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {fmtCurrency(p.expenses)}
                    </td>
                    <td className="py-2.5 text-right font-medium tabular-nums text-primary">
                      {fmtCurrency(p.noi)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                  <td className="pt-2.5 font-bold text-gray-900 dark:text-gray-100">Total</td>
                  <td className="pt-2.5 text-right tabular-nums font-bold text-gray-900 dark:text-gray-100">
                    {data.properties.reduce((s, p) => s + p.units, 0)}
                  </td>
                  <td className="pt-2.5 text-right tabular-nums font-bold text-gray-900 dark:text-gray-100">
                    {data.properties.reduce((s, p) => s + p.occupied, 0)}
                  </td>
                  <td className="pt-2.5 text-right tabular-nums font-bold text-gray-900 dark:text-gray-100">
                    {fmtPct(summary.overallOccupancy)}
                  </td>
                  <td className="pt-2.5 text-right tabular-nums font-bold text-gray-900 dark:text-gray-100">
                    {fmtCurrency(summary.totalRevenue)}
                  </td>
                  <td className="pt-2.5 text-right tabular-nums font-bold text-gray-900 dark:text-gray-100">
                    {fmtCurrency(summary.totalExpenses)}
                  </td>
                  <td className="pt-2.5 text-right tabular-nums font-bold text-primary">
                    {fmtCurrency(summary.netOperatingIncome)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>

          {/* ── Charts ──────────────────────────────────────────────── */}
          {data.charts && data.charts.length > 0 && (
            <>
              <Separator className="my-6" />
              <section className="page-break-inside-avoid">
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Visual Analysis
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {data.charts.map((chart) => (
                    <div
                      key={chart.title}
                      className="rounded-lg border border-gray-100 p-4 dark:border-gray-800"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        {chart.type === 'bar' ? (
                          <BarChart3 className="size-4 text-primary" />
                        ) : (
                          <PieChart className="size-4 text-primary" />
                        )}
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {chart.title}
                        </p>
                      </div>
                      {chart.type === 'bar' ? (
                        <MiniBarChart data={chart.data} />
                      ) : (
                        <MiniPieChart data={chart.data} />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          <Separator className="my-6" />

          {/* ── Footer ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500">
            <span>Confidential</span>
            <span>TenantFlow OS - Property Management</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  )
}
