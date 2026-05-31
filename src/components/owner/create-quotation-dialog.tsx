'use client'

import * as React from 'react'
import { FileText, Plus, Trash2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

// ── Types ────────────────────────────────────────────────────────────────────

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface CreateQuotationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clients: Array<{ id: string; companyName: string; contactName: string; email: string }>
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateQuotationNumber(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `QUO-${y}${m}${d}-${seq}`
}

function addDays(date: Date, days: number): string {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toISOString().split('T')[0]
}

// ── Default values ───────────────────────────────────────────────────────────

const DEFAULT_INTRO = `Thank you for your interest in TenantFlow OS — the AI-powered rental management platform.

We are pleased to provide this quotation for your review. TenantFlow OS streamlines every aspect of property management, from tenant screening and lease management to rent collection and maintenance tracking, all powered by intelligent automation.

Please review the details below and let us know if you have any questions. We look forward to partnering with you.`

const DEFAULT_TERMS = 'Payment is due within 30 days of acceptance. This quotation is valid for 30 days from the date of issue. Prices are subject to change after the validity period. Cancellation policy: 30 days written notice required after acceptance.'

// ── Component ────────────────────────────────────────────────────────────────

export function CreateQuotationDialog({ open, onOpenChange, clients }: CreateQuotationDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [quotationNumber] = React.useState(generateQuotationNumber)
  const [lineItems, setLineItems] = React.useState<LineItem[]>([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 },
  ])
  const [form, setForm] = React.useState({
    clientId: '',
    subject: '',
    validUntil: addDays(new Date(), 30),
    introMessage: DEFAULT_INTRO,
    taxRate: 0,
    discount: 0,
    terms: DEFAULT_TERMS,
    notes: '',
  })

  // ── Line item helpers ──

  const addLineItem = () => {
    setLineItems(prev => [...prev, { description: '', quantity: 1, unitPrice: 0, amount: 0 }])
  }

  const removeLineItem = (index: number) => {
    setLineItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => {
      const items = [...prev]
      items[index] = { ...items[index], [field]: value }
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = field === 'quantity' ? Number(value) : items[index].quantity
        const price = field === 'unitPrice' ? Number(value) : items[index].unitPrice
        items[index].amount = qty * price
      }
      return items
    })
  }

  // ── Computed totals ──

  const subtotal = React.useMemo(
    () => lineItems.reduce((sum, item) => sum + item.amount, 0),
    [lineItems]
  )

  const taxAmount = React.useMemo(
    () => subtotal * form.taxRate / 100,
    [subtotal, form.taxRate]
  )

  const total = React.useMemo(
    () => subtotal + taxAmount - form.discount,
    [subtotal, taxAmount, form.discount]
  )

  // ── Form helpers ──

  const updateForm = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm({
      clientId: '',
      subject: '',
      validUntil: addDays(new Date(), 30),
      introMessage: DEFAULT_INTRO,
      taxRate: 0,
      discount: 0,
      terms: DEFAULT_TERMS,
      notes: '',
    })
    setLineItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }])
  }

  // ── Submit ──

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientId || !form.subject) return

    setIsSubmitting(true)
    try {
      const validItems = lineItems.filter(item => item.description && item.amount > 0)
      const payload = {
        clientId: form.clientId,
        quotationNumber,
        subject: form.subject,
        validUntil: form.validUntil,
        introMessage: form.introMessage,
        subtotal,
        taxRate: form.taxRate,
        taxAmount,
        discount: form.discount,
        total,
        currency: 'USD',
        items: JSON.stringify(validItems),
        terms: form.terms,
        notes: form.notes,
        status: 'draft',
      }

      const res = await fetch('/api/owner/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to create quotation')

      onOpenChange(false)
      resetForm()
    } catch (err) {
      console.error('Failed to create quotation:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = form.clientId && form.subject && lineItems.some(item => item.description && item.amount > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="size-4 text-primary" />
            </div>
            Create Quotation
          </DialogTitle>
          <DialogDescription>
            Generate a new quotation for a client. Quote # will be auto-generated.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Client & Quotation Info ── */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Client Selection */}
            <div className="space-y-2">
              <Label htmlFor="clientId">
                Client <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.clientId}
                onValueChange={(v) => updateForm('clientId', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 ? (
                    <SelectItem value="__none" disabled>No clients available</SelectItem>
                  ) : (
                    clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex flex-col">
                          <span>{c.companyName}</span>
                          <span className="text-[11px] text-muted-foreground">{c.contactName} &bull; {c.email}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Quotation Number (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="quoteNum">Quotation #</Label>
              <Input id="quoteNum" value={quotationNumber} readOnly className="bg-muted/50 text-muted-foreground" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => updateForm('subject', e.target.value)}
                placeholder="e.g., TenantFlow OS Professional Plan - Annual Subscription"
              />
            </div>

            {/* Valid Until */}
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={form.validUntil}
                onChange={(e) => updateForm('validUntil', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* ── Intro Message ── */}
          <div className="space-y-2">
            <Label htmlFor="introMessage">Intro Message</Label>
            <Textarea
              id="introMessage"
              value={form.introMessage}
              onChange={(e) => updateForm('introMessage', e.target.value)}
              rows={4}
              className="resize-y"
              placeholder="Write a custom introductory message for the client..."
            />
          </div>

          {/* ── Line Items ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Line Items <span className="text-destructive">*</span>
              </Label>
              <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="gap-1">
                <Plus className="size-3" />
                Add Item
              </Button>
            </div>

            <div className="space-y-2">
              {/* Column headers */}
              <div className="grid gap-2 grid-cols-[1fr_70px_100px_80px_32px] items-end">
                <span className="text-[11px] text-muted-foreground font-medium">Description</span>
                <span className="text-[11px] text-muted-foreground font-medium">Qty</span>
                <span className="text-[11px] text-muted-foreground font-medium">Unit Price</span>
                <span className="text-[11px] text-muted-foreground font-medium text-right">Amount</span>
                <span>&nbsp;</span>
              </div>

              {lineItems.map((item, i) => (
                <div key={i} className="grid gap-2 grid-cols-[1fr_70px_100px_80px_32px] items-center">
                  <Input
                    value={item.description}
                    onChange={(e) => updateLineItem(i, 'description', e.target.value)}
                    placeholder="Service description"
                    className="h-8 text-sm"
                  />
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(i, 'quantity', Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(i, 'unitPrice', Number(e.target.value))}
                      className="h-8 text-sm pl-5"
                    />
                  </div>
                  <div className="h-8 flex items-center justify-end text-sm font-medium tabular-nums">
                    ${item.amount.toFixed(2)}
                  </div>
                  <div>
                    {lineItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeLineItem(i)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tax, Discount & Summary ── */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={form.taxRate}
                  onChange={(e) => updateForm('taxRate', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount ($)</Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.discount}
                    onChange={(e) => updateForm('discount', Number(e.target.value))}
                    className="pl-5"
                  />
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="space-y-3">
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({form.taxRate}%)</span>
                  <span className="tabular-nums">${taxAmount.toFixed(2)}</span>
                </div>
                {form.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="tabular-nums text-primary">-${form.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">${Math.max(0, total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Terms ── */}
          <div className="space-y-2">
            <Label htmlFor="terms">Terms &amp; Conditions</Label>
            <Textarea
              id="terms"
              value={form.terms}
              onChange={(e) => updateForm('terms', e.target.value)}
              rows={3}
              className="resize-y"
              placeholder="Enter payment terms, cancellation policy, etc."
            />
          </div>

          {/* ── Notes ── */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => updateForm('notes', e.target.value)}
              rows={2}
              className="resize-y"
              placeholder="Optional internal notes..."
            />
          </div>

          {/* ── Footer Actions ── */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {isSubmitting ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FileText className="size-4" />
              )}
              Create Quotation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
