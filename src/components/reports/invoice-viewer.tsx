'use client'

import * as React from 'react'
import { Building2, Printer, Download, ArrowLeft, Copy, Mail, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ── Types ────────────────────────────────────────────────────────────────────

export interface InvoiceLineItem {
  id: string
  description: string
  detail?: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void'
  billTo: {
    name: string
    contact?: string
    address: string
    city: string
    state: string
    zip: string
  }
  shipTo?: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  items: InvoiceLineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountRate: number
  discountAmount: number
  total: number
  notes?: string
  paymentTerms?: string
  bankDetails?: {
    bank: string
    account: string
    routing: string
    swift?: string
  }
  showWatermark?: boolean
}

// ── Default sample data ──────────────────────────────────────────────────────

export const SAMPLE_INVOICE: InvoiceData = {
  invoiceNumber: 'INV-2024-001',
  date: '01/15/2025',
  dueDate: '02/15/2025',
  status: 'sent',
  billTo: {
    name: 'Meridian Properties LLC',
    contact: 'John Smith',
    address: '456 Property Lane',
    city: 'New York',
    state: 'NY',
    zip: '10001',
  },
  shipTo: {
    name: 'Meridian Properties LLC',
    address: '456 Property Lane',
    city: 'New York',
    state: 'NY',
    zip: '10001',
  },
  items: [
    {
      id: '1',
      description: 'Professional Plan',
      detail: 'Monthly subscription',
      quantity: 1,
      unitPrice: 149.0,
      amount: 149.0,
    },
    {
      id: '2',
      description: 'Additional Users (5)',
      detail: 'Per-user add-on',
      quantity: 5,
      unitPrice: 15.0,
      amount: 75.0,
    },
    {
      id: '3',
      description: 'AI Copilot Credits',
      detail: '100 AI interaction credits',
      quantity: 100,
      unitPrice: 0.5,
      amount: 50.0,
    },
  ],
  subtotal: 274.0,
  taxRate: 8.5,
  taxAmount: 23.29,
  discountRate: 10,
  discountAmount: 27.4,
  total: 269.89,
  notes: 'Thank you for your business!',
  paymentTerms:
    'Payment due within 30 days of invoice date. Late payments subject to 1.5% monthly fee.',
  bankDetails: {
    bank: 'First National Bank',
    account: '1234-5678-9012',
    routing: '021000021',
    swift: 'FNBKUS33',
  },
  showWatermark: false,
}

// ── Status color helper ──────────────────────────────────────────────────────

function statusColor(status: InvoiceData['status']) {
  switch (status) {
    case 'draft':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    case 'sent':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
    case 'paid':
      return 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-amber-400'
    case 'overdue':
      return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    case 'void':
      return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
  }
}

function statusLabel(status: InvoiceData['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// ── Format currency ──────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n)
}

// ── Component ────────────────────────────────────────────────────────────────

interface InvoiceViewerProps {
  data?: InvoiceData
  onBack?: () => void
  onEdit?: () => void
}

export function InvoiceViewer({ data = SAMPLE_INVOICE, onBack, onEdit }: InvoiceViewerProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDuplicate = () => {
    // stub
  }

  const handleSend = () => {
    // stub
  }

  return (
    <div className="space-y-4">
      {/* Toolbar - hidden when printing */}
      <div className="no-print flex items-center justify-between gap-3 print-hide">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-1 size-4" />
              Back
            </Button>
          )}
          <Badge className={statusColor(data.status)}>{statusLabel(data.status)}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleDuplicate}>
            <Copy className="mr-1.5 size-4" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={handleSend}>
            <Mail className="mr-1.5 size-4" />
            Send
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1.5 size-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Download className="mr-1.5 size-4" />
            PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
              <DropdownMenuItem>Void Invoice</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Invoice Document - Letter size format */}
      <div
        className="print-document mx-auto w-full max-w-[816px] rounded-lg border border-border bg-white shadow-sm dark:bg-card"
        id="invoice-document"
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  AI-Powered Property Management
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
            <div className="text-right">
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                INVOICE
              </h2>
              <p className="mt-2 text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                {data.invoiceNumber}
              </p>
              <div className="mt-2 space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                <p>
                  Date:{' '}
                  <span className="font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                    {data.date}
                  </span>
                </p>
                <p>
                  Due:{' '}
                  <span className="font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                    {data.dueDate}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ── Bill To / Ship To ──────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Bill To
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {data.billTo.name}
              </p>
              {data.billTo.contact && (
                <p className="text-xs text-gray-600 dark:text-gray-400">{data.billTo.contact}</p>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-400">{data.billTo.address}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {data.billTo.city}, {data.billTo.state} {data.billTo.zip}
              </p>
            </div>
            {data.shipTo && (
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Ship To
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {data.shipTo.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{data.shipTo.address}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {data.shipTo.city}, {data.shipTo.state} {data.shipTo.zip}
                </p>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* ── Line Items Table ───────────────────────────────────── */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  #
                </th>
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Description
                </th>
                <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Qty
                </th>
                <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Unit Price
                </th>
                <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 dark:border-gray-800 page-break-inside-avoid"
                >
                  <td className="py-3 tabular-nums text-gray-500 dark:text-gray-400">{i + 1}</td>
                  <td className="py-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {item.description}
                    </p>
                    {item.detail && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                    )}
                  </td>
                  <td className="py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {fmt(item.unitPrice)}
                    {item.unitPrice >= 1 && item.quantity > 1 ? '/ea' : ''}
                  </td>
                  <td className="py-3 text-right font-medium tabular-nums text-gray-900 dark:text-gray-100">
                    {fmt(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Totals ─────────────────────────────────────────────── */}
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="tabular-nums font-medium text-gray-900 dark:text-gray-100">
                  {fmt(data.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Tax ({data.taxRate}%)
                </span>
                <span className="tabular-nums font-medium text-gray-900 dark:text-gray-100">
                  {fmt(data.taxAmount)}
                </span>
              </div>
              {data.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Discount ({data.discountRate}%)
                  </span>
                  <span className="tabular-nums font-medium text-primary">
                    -{fmt(data.discountAmount)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between pt-1">
                <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Total
                </span>
                <span className="text-base font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {fmt(data.total)}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ── Payment Terms ──────────────────────────────────────── */}
          {data.paymentTerms && (
            <div className="mb-4">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Payment Terms
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{data.paymentTerms}</p>
            </div>
          )}

          {/* ── Bank Details ───────────────────────────────────────── */}
          {data.bankDetails && (
            <div className="mb-6">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Bank Details
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-600 dark:text-gray-400">
                <p>
                  Bank: <span className="font-medium text-gray-800 dark:text-gray-200">{data.bankDetails.bank}</span>
                </p>
                <p>
                  Account: <span className="font-medium tabular-nums text-gray-800 dark:text-gray-200">{data.bankDetails.account}</span>
                </p>
                <p>
                  Routing: <span className="font-medium tabular-nums text-gray-800 dark:text-gray-200">{data.bankDetails.routing}</span>
                </p>
                {data.bankDetails.swift && (
                  <p>
                    SWIFT: <span className="font-medium tabular-nums text-gray-800 dark:text-gray-200">{data.bankDetails.swift}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* ── Footer ─────────────────────────────────────────────── */}
          <div className="text-center">
            {data.notes && (
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.notes}</p>
            )}
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Questions? Email billing@tenantflow.io
            </p>
          </div>
        </div>

        {/* Print footer with page number */}
        <div className="print-footer hidden">
          <span>TenantFlow OS</span>
          <span>Confidential</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  )
}
