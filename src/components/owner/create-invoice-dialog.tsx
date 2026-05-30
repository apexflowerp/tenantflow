'use client'

import * as React from 'react'
import { FileText, Plus, Trash2 } from 'lucide-react'
import { useOwnerStore } from '@/stores/owner-store'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateInvoiceDialog({ open, onOpenChange }: CreateInvoiceDialogProps) {
  const { createInvoice, clients, fetchClients } = useOwnerStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [lineItems, setLineItems] = React.useState<LineItem[]>([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 },
  ])
  const [form, setForm] = React.useState({
    clientId: '',
    type: 'subscription',
    taxRate: 0,
    discount: 0,
    notes: '',
    terms: 'Net 30',
  })

  React.useEffect(() => {
    if (clients.length === 0) {
      fetchClients()
    }
  }, [clients.length, fetchClients])

  const addLineItem = () => {
    setLineItems(prev => [...prev, { description: '', quantity: 1, unitPrice: 0, amount: 0 }])
  }

  const removeLineItem = (index: number) => {
    setLineItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    setLineItems(prev => {
      const items = [...prev]
      items[index] = { ...items[index], [field]: value }
      if (field === 'quantity' || field === 'unitPrice') {
        items[index].amount = items[index].quantity * items[index].unitPrice
      }
      return items
    })
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientId) return
    setIsSubmitting(true)
    try {
      const validItems = lineItems.filter(item => item.description && item.amount > 0)
      await createInvoice({
        clientId: form.clientId,
        type: form.type,
        taxRate: form.taxRate,
        discount: form.discount,
        subtotal,
        notes: form.notes,
        terms: form.terms,
        items: JSON.stringify(validItems),
      })
      onOpenChange(false)
      setForm({ clientId: '', type: 'subscription', taxRate: 0, discount: 0, notes: '', terms: 'Net 30' })
      setLineItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>Generate a new invoice for a client</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client & Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
              <Select value={form.clientId} onValueChange={(v) => setForm(prev => ({ ...prev, clientId: v }))} required>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Invoice Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm(prev => ({ ...prev, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="one_time">One-Time</SelectItem>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                  <SelectItem value="addon">Add-on</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Line Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="gap-1">
                <Plus className="size-3" />
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {lineItems.map((item, i) => (
                <div key={i} className="grid gap-2 grid-cols-[1fr_70px_90px_70px_32px] items-end">
                  <div>
                    {i === 0 && <span className="text-[11px] text-muted-foreground">Description</span>}
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(i, 'description', e.target.value)}
                      placeholder="Service description"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    {i === 0 && <span className="text-[11px] text-muted-foreground">Qty</span>}
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(i, 'quantity', Number(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    {i === 0 && <span className="text-[11px] text-muted-foreground">Unit Price</span>}
                    <Input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(i, 'unitPrice', Number(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    {i === 0 && <span className="text-[11px] text-muted-foreground">Amount</span>}
                    <div className="h-8 flex items-center text-sm font-medium">${item.amount.toFixed(2)}</div>
                  </div>
                  <div>
                    {i === 0 && <span className="text-[11px]">&nbsp;</span>}
                    {lineItems.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => removeLineItem(i)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Notes */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input id="taxRate" type="number" min="0" max="100" value={form.taxRate} onChange={(e) => setForm(prev => ({ ...prev, taxRate: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount ($)</Label>
                <Input id="discount" type="number" min="0" value={form.discount} onChange={(e) => setForm(prev => ({ ...prev, discount: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms</Label>
                <Input id="terms" value={form.terms} onChange={(e) => setForm(prev => ({ ...prev, terms: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-3">
              {/* Summary */}
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({form.taxRate}%)</span>
                  <span>${(subtotal * form.taxRate / 100).toFixed(2)}</span>
                </div>
                {form.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-${form.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>${(subtotal + subtotal * form.taxRate / 100 - form.discount).toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" value={form.notes} onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))} placeholder="Optional notes" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !form.clientId} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              {isSubmitting ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FileText className="size-4" />
              )}
              Create Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
