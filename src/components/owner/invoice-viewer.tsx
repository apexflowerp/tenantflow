'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Printer, Download, FileSpreadsheet, Send, CheckCircle2,
  AlertTriangle, X, Building2, Mail, Phone, Globe, MapPin,
  Clock, CalendarDays, Receipt, Banknote, Shield,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// ── Types ────────────────────────────────────────────────────────────────────

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface InvoiceViewerProps {
  invoice: {
    id: string
    invoiceNumber: string
    status: string
    type: string
    issueDate: string
    dueDate: string
    paidDate: string | null
    subtotal: number
    taxRate: number
    taxAmount: number
    discount: number
    total: number
    paidAmount: number
    currency: string
    notes: string | null
    terms: string | null
    items: string | null
    client?: {
      id: string
      companyName: string
      contactName: string
      email: string
      phone: string | null
      address: string | null
      city: string | null
      state: string | null
      zipCode: string | null
      country: string
    }
  }
  onClose: () => void
  onStatusChange?: (status: string) => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseLineItems(items: string | null): LineItem[] {
  if (!items) return []
  try {
    const parsed = JSON.parse(items)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '\u2014'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatShortDate(dateStr: string | null) {
  if (!dateStr) return '\u2014'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  sent: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
  overdue: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  draft: Receipt,
  sent: Send,
  paid: CheckCircle2,
  overdue: AlertTriangle,
  cancelled: X,
}

function getDaysUntilDue(dueDate: string): number {
  const now = new Date()
  const due = new Date(dueDate)
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

// ── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(invoice: InvoiceViewerProps['invoice']) {
  const items = parseLineItems(invoice.items)
  const balanceDue = invoice.total - invoice.paidAmount
  const currency = invoice.currency || 'USD'

  const rows: string[][] = []

  // Header rows
  rows.push(['Invoice Number', invoice.invoiceNumber])
  rows.push(['Status', invoice.status.toUpperCase()])
  rows.push(['Issue Date', formatShortDate(invoice.issueDate)])
  rows.push(['Due Date', formatShortDate(invoice.dueDate)])
  rows.push([])
  rows.push(['Bill To', invoice.client?.companyName || ''])
  rows.push(['Contact', invoice.client?.contactName || ''])
  rows.push(['Email', invoice.client?.email || ''])
  rows.push([])
  rows.push(['#', 'Description', 'Quantity', 'Unit Price', 'Amount'])

  items.forEach((item, i) => {
    rows.push([
      String(i + 1),
      `"${item.description}"`,
      String(item.quantity),
      item.unitPrice.toFixed(2),
      item.amount.toFixed(2),
    ])
  })

  rows.push([])
  rows.push(['', '', '', 'Subtotal', invoice.subtotal.toFixed(2)])
  rows.push(['', '', '', `Tax (${invoice.taxRate}%)`, invoice.taxAmount.toFixed(2)])
  if (invoice.discount > 0) {
    rows.push(['', '', '', 'Discount', `-${invoice.discount.toFixed(2)}`])
  }
  rows.push(['', '', '', 'Total', invoice.total.toFixed(2)])
  rows.push(['', '', '', 'Paid', invoice.paidAmount.toFixed(2)])
  rows.push(['', '', '', 'Balance Due', balanceDue.toFixed(2)])

  const csvContent = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${invoice.invoiceNumber}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ── Component ────────────────────────────────────────────────────────────────

export function InvoiceViewer({ invoice, onClose, onStatusChange }: InvoiceViewerProps) {
  const items = parseLineItems(invoice.items)
  const balanceDue = invoice.total - invoice.paidAmount
  const currency = invoice.currency || 'USD'
  const isOverdue = invoice.status === 'overdue' || (invoice.status !== 'paid' && invoice.status !== 'cancelled' && getDaysUntilDue(invoice.dueDate) < 0)
  const daysUntilDue = getDaysUntilDue(invoice.dueDate)

  const StatusIcon = STATUS_ICONS[invoice.status] || Receipt

  return (
    <>
      {/* ── Print Styles ────────────────────────────────────────────── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-invoice-area,
          .print-invoice-area * {
            visibility: visible !important;
          }
          .print-invoice-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
          .print-invoice-area .invoice-paper {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .no-print,
          .print-hide {
            display: none !important;
          }
          @page {
            size: letter;
            margin: 0.5in;
          }
          .invoice-paper {
            font-size: 11pt !important;
          }
          .invoice-paper h2.invoice-title {
            font-size: 18pt !important;
          }
          .invoice-paper .invoice-overline {
            font-size: 8pt !important;
          }
        }
      `}</style>

      {/* ── Overlay & Container ──────────────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-[900px] my-4"
          >
            {/* ── Action Buttons (floating, not printable) ──────────── */}
            <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="gap-1.5 bg-white/80 backdrop-blur-md dark:bg-card/80 border-border/50"
                >
                  <X className="size-4" />
                  Close
                </Button>
                <Badge
                  className={`gap-1.5 px-3 py-1 text-xs font-semibold border ${STATUS_STYLES[invoice.status] || STATUS_STYLES.draft}`}
                >
                  <StatusIcon className="size-3" />
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
                {isOverdue && invoice.status !== 'overdue' && (
                  <Badge className="gap-1 px-3 py-1 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800">
                    <AlertTriangle className="size-3" />
                    Past Due
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Print */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="gap-1.5 bg-white/80 backdrop-blur-md dark:bg-card/80 border-border/50"
                >
                  <Printer className="size-4" />
                  Print
                </Button>
                {/* Download PDF */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="gap-1.5 bg-white/80 backdrop-blur-md dark:bg-card/80 border-border/50"
                >
                  <Download className="size-4" />
                  PDF
                </Button>
                {/* Export CSV */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportCSV(invoice)}
                  className="gap-1.5 bg-white/80 backdrop-blur-md dark:bg-card/80 border-border/50"
                >
                  <FileSpreadsheet className="size-4" />
                  CSV
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Status Change Buttons */}
                {invoice.status === 'draft' && onStatusChange && (
                  <Button
                    size="sm"
                    onClick={() => onStatusChange('sent')}
                    className="gap-1.5 bg-sky-600 hover:bg-sky-700 text-white"
                  >
                    <Send className="size-3.5" />
                    Mark as Sent
                  </Button>
                )}
                {(invoice.status === 'sent' || invoice.status === 'overdue') && onStatusChange && (
                  <Button
                    size="sm"
                    onClick={() => onStatusChange('paid')}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle2 className="size-3.5" />
                    Mark as Paid
                  </Button>
                )}
                {invoice.status === 'sent' && onStatusChange && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange('overdue')}
                    className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/50"
                  >
                    <AlertTriangle className="size-3.5" />
                    Mark as Overdue
                  </Button>
                )}
              </div>
            </div>

            {/* ── Invoice Document (Letter-Size Paper) ────────────────── */}
            <div className="print-invoice-area">
              <div className="invoice-paper mx-auto bg-white dark:bg-card rounded-xl shadow-2xl border border-gray-200/60 dark:border-border/40 overflow-hidden"
                style={{ aspectRatio: '8.5 / 11', maxWidth: '816px' }}
              >
                <div className="p-8 sm:p-10 h-full flex flex-col" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif" }}>

                  {/* ── Header Section ──────────────────────────────────── */}
                  <div className="flex items-start justify-between gap-6">
                    {/* Company Logo & Details */}
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                        <Building2 className="size-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                          TenantFlow OS
                        </h1>
                        <p className="text-[11px] font-medium text-primary/80 tracking-wide">
                          AI-Powered Rental Intelligence
                        </p>
                        <div className="mt-2.5 space-y-0.5">
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <MapPin className="size-3 opacity-60" />
                            123 Business Ave, Suite 100
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 pl-[18px]">
                            San Francisco, CA 94102
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <Phone className="size-3 opacity-60" />
                            +1 (415) 555-0190
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <Mail className="size-3 opacity-60" />
                            billing@tenantflow.io
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <Globe className="size-3 opacity-60" />
                            tenantflow.io
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* INVOICE Title & Meta */}
                    <div className="text-right flex-shrink-0">
                      <h2 className="invoice-title text-3xl font-extrabold tracking-tight text-primary">
                        INVOICE
                      </h2>
                      <p className="mt-1.5 text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">
                        {invoice.invoiceNumber}
                      </p>
                      <div className="mt-2 space-y-1 text-[11px]">
                        <div className="flex items-center justify-end gap-2 text-gray-500 dark:text-gray-400">
                          <CalendarDays className="size-3 opacity-60" />
                          <span>Issue Date:</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
                            {formatShortDate(invoice.issueDate)}
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-2 text-gray-500 dark:text-gray-400">
                          <Clock className="size-3 opacity-60" />
                          <span>Due Date:</span>
                          <span className={`font-semibold tabular-nums ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {formatShortDate(invoice.dueDate)}
                          </span>
                        </div>
                        {invoice.paidDate && (
                          <div className="flex items-center justify-end gap-2 text-gray-500 dark:text-gray-400">
                            <CheckCircle2 className="size-3 opacity-60" />
                            <span>Paid Date:</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                              {formatShortDate(invoice.paidDate)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <Badge className={`text-[10px] font-bold tracking-wide border ${STATUS_STYLES[invoice.status] || STATUS_STYLES.draft}`}>
                          <StatusIcon className="size-3 mr-0.5" />
                          {invoice.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-5" />

                  {/* ── Bill To / Invoice Details ────────────────────────── */}
                  <div className="grid grid-cols-5 gap-6">
                    {/* Bill To - takes 3 cols */}
                    <div className="col-span-3 rounded-lg border border-gray-100 dark:border-border/40 bg-gray-50/50 dark:bg-muted/20 p-4">
                      <p className="invoice-overline mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">
                        Bill To
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
                        {invoice.client?.companyName || 'N/A'}
                      </p>
                      {invoice.client?.contactName && (
                        <p className="text-[12px] text-gray-600 dark:text-gray-400 mt-0.5">
                          {invoice.client.contactName}
                        </p>
                      )}
                      {invoice.client?.address && (
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1.5">
                          {invoice.client.address}
                        </p>
                      )}
                      {(invoice.client?.city || invoice.client?.state || invoice.client?.zipCode) && (
                        <p className="text-[12px] text-gray-500 dark:text-gray-400">
                          {[invoice.client.city, invoice.client.state, invoice.client.zipCode].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {invoice.client?.email && (
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                          <Mail className="size-3 opacity-50" />
                          {invoice.client.email}
                        </p>
                      )}
                      {invoice.client?.phone && (
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Phone className="size-3 opacity-50" />
                          {invoice.client.phone}
                        </p>
                      )}
                    </div>

                    {/* Invoice Details - takes 2 cols */}
                    <div className="col-span-2 rounded-lg border border-gray-100 dark:border-border/40 bg-gray-50/50 dark:bg-muted/20 p-4">
                      <p className="invoice-overline mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">
                        Invoice Details
                      </p>
                      <div className="space-y-2 text-[12px]">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Invoice #</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Type</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {invoice.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Issue Date</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                            {formatShortDate(invoice.issueDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Due Date</span>
                          <span className={`font-medium tabular-nums ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {formatShortDate(invoice.dueDate)}
                          </span>
                        </div>
                        {daysUntilDue < 0 && invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                          <div className="flex justify-between">
                            <span className="text-red-500 dark:text-red-400">Overdue By</span>
                            <span className="font-bold text-red-600 dark:text-red-400 tabular-nums">
                              {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Line Items Table ────────────────────────────────── */}
                  <div className="mt-5 flex-1">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="border-b-2 border-gray-200 dark:border-border/60">
                          <th className="invoice-overline pb-2.5 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 w-8">
                            #
                          </th>
                          <th className="invoice-overline pb-2.5 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                            Description
                          </th>
                          <th className="invoice-overline pb-2.5 text-right text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 w-16">
                            Qty
                          </th>
                          <th className="invoice-overline pb-2.5 text-right text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 w-24">
                            Unit Price
                          </th>
                          <th className="invoice-overline pb-2.5 text-right text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 w-28">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-gray-400 dark:text-gray-500 text-[12px] italic">
                              No line items
                            </td>
                          </tr>
                        ) : (
                          items.map((item, i) => (
                            <tr
                              key={i}
                              className={`border-b border-gray-100 dark:border-border/30 ${i % 2 === 1 ? 'bg-gray-50/60 dark:bg-muted/10' : ''}`}
                            >
                              <td className="py-2.5 tabular-nums text-gray-400 dark:text-gray-500 font-medium">
                                {i + 1}
                              </td>
                              <td className="py-2.5">
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {item.description}
                                </span>
                              </td>
                              <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                                {item.quantity}
                              </td>
                              <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                                {formatCurrency(item.unitPrice, currency)}
                              </td>
                              <td className="py-2.5 text-right font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                                {formatCurrency(item.amount, currency)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* ── Summary Section ────────────────────────────────── */}
                  <div className="mt-2 flex justify-end">
                    <div className="w-72">
                      <div className="space-y-1.5 text-[12px]">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                          <span className="tabular-nums font-medium text-gray-800 dark:text-gray-200">
                            {formatCurrency(invoice.subtotal, currency)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Tax ({invoice.taxRate}%)
                          </span>
                          <span className="tabular-nums font-medium text-gray-800 dark:text-gray-200">
                            {formatCurrency(invoice.taxAmount, currency)}
                          </span>
                        </div>
                        {invoice.discount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Discount</span>
                            <span className="tabular-nums font-medium text-primary">
                              &minus;{formatCurrency(invoice.discount, currency)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Total with highlight */}
                      <div className="mt-2 pt-2 border-t-2 border-gray-900 dark:border-gray-100">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-50">Total</span>
                          <span className="text-lg font-extrabold tabular-nums text-gray-900 dark:text-gray-50">
                            {formatCurrency(invoice.total, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 space-y-1.5 text-[12px]">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
                          <span className="tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(invoice.paidAmount, currency)}
                          </span>
                        </div>

                        {/* Balance Due */}
                        <div className={`flex justify-between items-baseline pt-2 mt-1 border-t ${isOverdue ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-border/50'}`}>
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            Balance Due
                          </span>
                          <span className={`text-base font-extrabold tabular-nums ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-50'}`}>
                            {formatCurrency(balanceDue, currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* ── Terms & Notes Section ────────────────────────────── */}
                  <div className="grid grid-cols-2 gap-6 text-[11px]">
                    <div className="space-y-3">
                      {(invoice.terms || invoice.status !== 'cancelled') && (
                        <div>
                          <p className="invoice-overline mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Shield className="size-3 opacity-60" />
                            Payment Terms
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {invoice.terms || 'Payment is due within 30 days of the invoice date. Late payments may be subject to a 1.5% monthly finance charge.'}
                          </p>
                        </div>
                      )}
                      {invoice.notes && (
                        <div>
                          <p className="invoice-overline mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">
                            Notes
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {invoice.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="invoice-overline mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Banknote className="size-3 opacity-60" />
                        Payment Instructions
                      </p>
                      <div className="space-y-0.5 text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p>Bank: <span className="font-medium text-gray-800 dark:text-gray-200">First National Bank</span></p>
                        <p>Account: <span className="font-medium tabular-nums text-gray-800 dark:text-gray-200">1234-5678-9012</span></p>
                        <p>Routing: <span className="font-medium tabular-nums text-gray-800 dark:text-gray-200">021000021</span></p>
                        <p>SWIFT: <span className="font-medium tabular-nums text-gray-800 dark:text-gray-200">FNBKUS33</span></p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* ── Footer ──────────────────────────────────────────── */}
                  <div className="text-center space-y-1">
                    <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">
                      Thank you for your business
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      Questions? Contact billing@tenantflow.io &bull; Tax ID: 94-1234567
                    </p>
                    <p className="text-[9px] text-gray-300 dark:text-gray-600 mt-1">
                      TenantFlow OS &copy; {new Date().getFullYear()} &mdash; AI-Powered Rental Intelligence Platform
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
