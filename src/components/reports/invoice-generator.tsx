'use client'

import * as React from 'react'
import {
  Plus,
  Trash2,
  Eye,
  Save,
  Send,
  Receipt,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { InvoiceData, InvoiceLineItem } from './invoice-viewer'

// ── Client data ──────────────────────────────────────────────────────────────

const CLIENTS = [
  { id: 'meridian', name: 'Meridian Properties LLC', contact: 'John Smith', address: '456 Property Lane', city: 'New York', state: 'NY', zip: '10001' },
  { id: 'pinnacle', name: 'Pinnacle Real Estate Group', contact: 'Sarah Johnson', address: '789 Commerce Blvd', city: 'Chicago', state: 'IL', zip: '60601' },
  { id: 'apex', name: 'Apex Housing Partners', contact: 'Michael Lee', address: '321 Oak Street', city: 'Austin', state: 'TX', zip: '73301' },
  { id: 'bright', name: 'Bright Horizon Properties', contact: 'Emily Davis', address: '555 Sunset Ave', city: 'Los Angeles', state: 'CA', zip: '90001' },
]

// ── Default line item ────────────────────────────────────────────────────────

const EMPTY_LINE: Omit<InvoiceLineItem, 'id'> = {
  description: '',
  detail: '',
  quantity: 1,
  unitPrice: 0,
  amount: 0,
}

// ── Component ────────────────────────────────────────────────────────────────

interface InvoiceGeneratorProps {
  onPreview?: (data: InvoiceData) => void
  onSaveDraft?: (data: InvoiceData) => void
  onSend?: (data: InvoiceData) => void
  onCancel?: () => void
}

export function InvoiceGenerator({ onPreview, onSaveDraft, onSend, onCancel }: InvoiceGeneratorProps) {
  const [clientId, setClientId] = React.useState('')
  const [invoiceNumber, setInvoiceNumber] = React.useState('INV-2025-')
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10))
  const [dueDate, setDueDate] = React.useState('')
  const [lines, setLines] = React.useState<Array<InvoiceLineItem & { id: string }>>([
    { id: crypto.randomUUID(), description: '', detail: '', quantity: 1, unitPrice: 0, amount: 0 },
  ])
  const [taxRate, setTaxRate] = React.useState(8.5)
  const [discountRate, setDiscountRate] = React.useState(0)
  const [notes, setNotes] = React.useState('')
  const [paymentTerms, setPaymentTerms] = React.useState(
    'Payment due within 30 days of invoice date. Late payments subject to 1.5% monthly fee.'
  )

  // Auto-set due date 30 days from invoice date
  React.useEffect(() => {
    if (date) {
      const d = new Date(date)
      d.setDate(d.getDate() + 30)
      setDueDate(d.toISOString().slice(0, 10))
    }
  }, [date])

  // Calculate amounts
  const subtotal = React.useMemo(() => lines.reduce((s, l) => s + l.amount, 0), [lines])
  const taxAmount = React.useMemo(() => subtotal * (taxRate / 100), [subtotal, taxRate])
  const discountAmount = React.useMemo(() => subtotal * (discountRate / 100), [subtotal, discountRate])
  const total = React.useMemo(() => subtotal + taxAmount - discountAmount, [subtotal, taxAmount, discountAmount])

  const updateLine = (id: string, field: string, value: string | number) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l
        const updated = { ...l, [field]: value }
        // Recalculate amount
        updated.amount = Number(updated.quantity) * Number(updated.unitPrice)
        return updated
      })
    )
  }

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...EMPTY_LINE },
    ])
  }

  const removeLine = (id: string) => {
    if (lines.length <= 1) return
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  const buildInvoiceData = (): InvoiceData => {
    const client = CLIENTS.find((c) => c.id === clientId)
    return {
      invoiceNumber,
      date: date ? new Date(date).toLocaleDateString('en-US') : '',
      dueDate: dueDate ? new Date(dueDate).toLocaleDateString('en-US') : '',
      status: 'draft',
      billTo: client
        ? {
            name: client.name,
            contact: client.contact,
            address: client.address,
            city: client.city,
            state: client.state,
            zip: client.zip,
          }
        : { name: '', address: '', city: '', state: '', zip: '' },
      items: lines,
      subtotal,
      taxRate,
      taxAmount,
      discountRate,
      discountAmount,
      total,
      notes,
      paymentTerms,
      bankDetails: {
        bank: 'First National Bank',
        account: '1234-5678-9012',
        routing: '021000021',
        swift: 'FNBKUS33',
      },
    }
  }

  const handlePreview = () => onPreview?.(buildInvoiceData())
  const handleSaveDraft = () => onSaveDraft?.(buildInvoiceData())
  const handleSend = () => onSend?.(buildInvoiceData())

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Receipt className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Create Invoice</h2>
            <p className="text-xs text-muted-foreground">Fill in the details below to create a new invoice</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="mr-1.5 size-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveDraft}>
            <Save className="mr-1.5 size-4" />
            Save Draft
          </Button>
          <Button size="sm" onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-700">
            <Send className="mr-1.5 size-4" />
            Send
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - main form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Invoice Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="inv-number">Invoice Number</Label>
                  <Input
                    id="inv-number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inv-date">Invoice Date</Label>
                  <Input
                    id="inv-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inv-due">Due Date</Label>
                  <Input
                    id="inv-due"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENTS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Line Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Header row */}
              <div className="hidden gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid sm:grid-cols-12">
                <span className="col-span-5">Description</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-center">Unit Price</span>
                <span className="col-span-2 text-right">Amount</span>
                <span className="col-span-1" />
              </div>

              {lines.map((line) => (
                <div key={line.id} className="grid gap-2 sm:grid-cols-12">
                  <div className="col-span-5 space-y-1">
                    <Input
                      placeholder="Description"
                      value={line.description}
                      onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Input
                      placeholder="Detail (optional)"
                      value={line.detail ?? ''}
                      onChange={(e) => updateLine(line.id, 'detail', e.target.value)}
                      className="h-7 text-xs text-muted-foreground"
                    />
                  </div>
                  <Input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) => updateLine(line.id, 'quantity', Number(e.target.value))}
                    className="col-span-2 h-9 text-sm tabular-nums"
                  />
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={line.unitPrice}
                    onChange={(e) => updateLine(line.id, 'unitPrice', Number(e.target.value))}
                    className="col-span-2 h-9 text-sm tabular-nums"
                  />
                  <div className="col-span-2 flex items-center justify-end text-sm font-medium tabular-nums">
                    {fmt(line.amount)}
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeLine(line.id)}
                      disabled={lines.length <= 1}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={addLine}
                className="w-full border-dashed text-muted-foreground"
              >
                <Plus className="mr-1.5 size-4" />
                Add Line Item
              </Button>
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Notes & Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Thank you for your business!"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Payment Terms</Label>
                <Textarea
                  id="terms"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums font-medium">{fmt(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Tax Rate</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="h-7 w-16 text-right text-xs tabular-nums"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax Amount</span>
                <span className="tabular-nums font-medium">{fmt(taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Discount</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    className="h-7 w-16 text-right text-xs tabular-nums"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount Amount</span>
                <span className="tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                  -{fmt(discountAmount)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-bold">Total</span>
                <span className="font-bold tabular-nums">{fmt(total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={handlePreview}
              >
                <Eye className="mr-2 size-4" />
                Preview Invoice
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={handleSaveDraft}
              >
                <Save className="mr-2 size-4" />
                Save as Draft
              </Button>
              <Button
                className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
                size="sm"
                onClick={handleSend}
              >
                <Send className="mr-2 size-4" />
                Send Invoice
              </Button>
              {onCancel && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="sm"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
