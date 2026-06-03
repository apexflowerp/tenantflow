'use client'

import * as React from 'react'
import {
  Building2, Printer, Download, FileSpreadsheet, X,
  ArrowRightLeft, CheckCircle2, XCircle, Clock, Eye,
  FileText, Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// ── Types ────────────────────────────────────────────────────────────────────

interface QuotationLineItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface QuotationViewerProps {
  quotation: {
    id: string
    quotationNumber: string
    status: string
    subject: string
    validUntil: string
    subtotal: number
    taxRate: number
    taxAmount: number
    discount: number
    total: number
    currency: string
    items: string | null
    notes: string | null
    terms: string | null
    introMessage: string | null
    convertedToInvoice: boolean
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
  onConvertToInvoice?: (id: string) => void
}

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  draft: {
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    icon: FileText,
  },
  sent: {
    color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    icon: Mail,
  },
  viewed: {
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    icon: Eye,
  },
  accepted: {
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    icon: CheckCircle2,
  },
  rejected: {
    color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    icon: XCircle,
  },
  expired: {
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    icon: Clock,
  },
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// ── Format helpers ────────────────────────────────────────────────────────────

function fmtCurrency(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(n)
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function parseLineItems(items: string | null): QuotationLineItem[] {
  if (!items) return []
  try {
    const parsed = JSON.parse(items)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function daysUntilValid(validUntil: string): number {
  const now = new Date()
  const valid = new Date(validUntil)
  const diff = valid.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ── Component ────────────────────────────────────────────────────────────────

export function QuotationViewer({ quotation, onClose, onConvertToInvoice }: QuotationViewerProps) {
  const lineItems = parseLineItems(quotation.items)
  const daysValid = daysUntilValid(quotation.validUntil)
  const statusCfg = STATUS_CONFIG[quotation.status] || STATUS_CONFIG.draft
  const StatusIcon = statusCfg.icon

  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const header = '#,Description,Quantity,Unit Price,Amount'
    const rows = lineItems.map((item, i) =>
      `${i + 1},"${item.description}",${item.quantity},${item.unitPrice.toFixed(2)},${item.amount.toFixed(2)}`
    )
    const summary = [
      '',
      `Subtotal,,,"${quotation.currency}",${quotation.subtotal.toFixed(2)}`,
      `Tax (${quotation.taxRate}%),,,${quotation.taxAmount.toFixed(2)}`,
      quotation.discount > 0 ? `Discount,,,-${quotation.discount.toFixed(2)}` : '',
      `Total,,,"${quotation.currency}",${quotation.total.toFixed(2)}`,
    ]
      .filter(Boolean)
      .join('\n')
    const csv = [header, ...rows, summary].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${quotation.quotationNumber}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const isConvertible = !quotation.convertedToInvoice && quotation.status !== 'rejected' && quotation.status !== 'expired'

  return (
    <div className="space-y-4">
      {/* ── Action Toolbar (hidden when printing) ── */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 print-hide">
        <div className="flex items-center gap-2">
          <Badge className={`${statusCfg.color} gap-1.5 px-3 py-1 text-xs font-semibold`}>
            <StatusIcon className="size-3.5" />
            {statusLabel(quotation.status)}
          </Badge>
          {quotation.convertedToInvoice && (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 gap-1 px-2 py-1 text-xs">
              <ArrowRightLeft className="size-3" />
              Converted to Invoice
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Convert to Invoice */}
          {isConvertible && onConvertToInvoice && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConvertToInvoice(quotation.id)}
              className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
            >
              <ArrowRightLeft className="size-4" />
              Convert to Invoice
            </Button>
          )}

          {/* Mark as Accepted */}
          {quotation.status !== 'accepted' && quotation.status !== 'rejected' && quotation.status !== 'expired' && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
              onClick={() => {
                /* stub: mark accepted */
              }}
            >
              <CheckCircle2 className="size-4" />
              Accept
            </Button>
          )}

          {/* Mark as Rejected */}
          {quotation.status !== 'accepted' && quotation.status !== 'rejected' && quotation.status !== 'expired' && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
              onClick={() => {
                /* stub: mark rejected */
              }}
            >
              <XCircle className="size-4" />
              Reject
            </Button>
          )}

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="size-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Download className="size-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5">
            <FileSpreadsheet className="size-4" />
            CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <X className="size-4" />
            Close
          </Button>
        </div>
      </div>

      {/* ── Quotation Document (Letter-size: 8.5" × 11") ── */}
      <div
        className="print-document mx-auto w-full max-w-[816px] rounded-lg border border-border bg-white shadow-sm dark:bg-card"
        id="quotation-document"
      >
        <div className="p-8 sm:p-10" style={{ fontFamily: 'system-ui, sans-serif' }}>
          {/* ── 1. Header ── */}
          <div className="flex items-start justify-between gap-4">
            {/* Left: Company branding */}
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <Building2 className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  TenantFlow OS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  AI-Powered Rental Management
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  123 Business Ave, Suite 100
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  San Francisco, CA 94102
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  contact@tenantflow.io
                </p>
              </div>
            </div>

            {/* Right: Quotation title and number */}
            <div className="text-right">
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                QUOTATION
              </h2>
              <p className="mt-2 text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                {quotation.quotationNumber}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5">
                <Badge className={`${statusCfg.color} text-[10px]`}>
                  {statusLabel(quotation.status)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ── 2. Client Info + Quotation Details ── */}
          <div className="grid grid-cols-2 gap-8">
            {/* Prepared For */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Prepared For
              </p>
              {quotation.client ? (
                <>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {quotation.client.companyName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {quotation.client.contactName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {quotation.client.email}
                  </p>
                  {quotation.client.phone && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {quotation.client.phone}
                    </p>
                  )}
                  {quotation.client.address && (
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {quotation.client.address}
                    </p>
                  )}
                  {(quotation.client.city || quotation.client.state || quotation.client.zipCode) && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {[quotation.client.city, quotation.client.state, quotation.client.zipCode].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {quotation.client.country && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {quotation.client.country}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic">No client assigned</p>
              )}
            </div>

            {/* Quotation Details */}
            <div className="text-right">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Quotation Details
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Quote #:</span>
                  <span className="font-medium tabular-nums text-gray-900 dark:text-gray-100">
                    {quotation.quotationNumber}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Date:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {fmtDate(new Date().toISOString())}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Valid Until:</span>
                  <span className={`font-medium tabular-nums ${daysValid <= 7 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {fmtDate(quotation.validUntil)}
                  </span>
                </div>
                {quotation.subject && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Subject:</span>
                      <span className="font-medium text-right text-gray-900 dark:text-gray-100 max-w-[200px]">
                        {quotation.subject}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ── 3. Intro Message ── */}
          {quotation.introMessage && (
            <>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900/40 p-4 mb-6">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {quotation.introMessage}
                </p>
              </div>
            </>
          )}

          {/* ── 4. Line Items Table ── */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-8">
                  #
                </th>
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Description
                </th>
                <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-16">
                  Qty
                </th>
                <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-24">
                  Unit Price
                </th>
                <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-24">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-gray-400 dark:text-gray-500 italic">
                    No line items
                  </td>
                </tr>
              ) : (
                lineItems.map((item, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-100 dark:border-gray-800 page-break-inside-avoid ${
                      i % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-900/20' : ''
                    }`}
                  >
                    <td className="py-3 tabular-nums text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="py-3 font-medium text-gray-900 dark:text-gray-100">
                      {item.description}
                    </td>
                    <td className="py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {fmtCurrency(item.unitPrice, quotation.currency)}
                    </td>
                    <td className="py-3 text-right font-medium tabular-nums text-gray-900 dark:text-gray-100">
                      {fmtCurrency(item.amount, quotation.currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ── 5. Summary (right-aligned) ── */}
          <div className="mt-6 flex justify-end">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="tabular-nums font-medium text-gray-900 dark:text-gray-100">
                  {fmtCurrency(quotation.subtotal, quotation.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Tax ({quotation.taxRate}%)
                </span>
                <span className="tabular-nums font-medium text-gray-900 dark:text-gray-100">
                  {fmtCurrency(quotation.taxAmount, quotation.currency)}
                </span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Discount</span>
                  <span className="tabular-nums font-medium text-primary">
                    -{fmtCurrency(quotation.discount, quotation.currency)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between pt-1">
                <span className="text-base font-bold text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-base font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {fmtCurrency(quotation.total, quotation.currency)}
                </span>
              </div>
              <div className="pt-1 text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/20 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                  <Clock className="size-3" />
                  Valid for {daysValid} day{daysValid !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ── 6. Terms & Conditions ── */}
          {quotation.terms && (
            <div className="mb-6">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Terms &amp; Conditions
              </p>
              <div className="rounded-md border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 p-3">
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {quotation.terms}
                </p>
              </div>
            </div>
          )}

          {/* ── 7. Signature / Acceptance Section ── */}
          <div className="mb-6">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Acceptance
            </p>
            <div className="rounded-md border border-dashed border-gray-300 dark:border-gray-600 p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                By signing below, I accept this quotation and agree to the terms and conditions outlined above.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">
                    Signature
                  </p>
                  <div className="border-b border-gray-300 dark:border-gray-600" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">
                    Name
                  </p>
                  <div className="border-b border-gray-300 dark:border-gray-600" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">
                    Title
                  </p>
                  <div className="border-b border-gray-300 dark:border-gray-600" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">
                    Date
                  </p>
                  <div className="border-b border-gray-300 dark:border-gray-600" />
                </div>
                <div className="col-span-2" />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ── 8. Footer ── */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Thank you for considering TenantFlow OS
            </p>
            {quotation.notes && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {quotation.notes}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Questions? Email sales@tenantflow.io &bull; 123 Business Ave, Suite 100, San Francisco, CA 94102
            </p>
          </div>
        </div>

        {/* Print footer */}
        <div className="print-footer hidden">
          <span>TenantFlow OS</span>
          <span>Quotation {quotation.quotationNumber}</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  )
}
