'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ── Types ────────────────────────────────────────────────────────────────────

interface RecordTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: Array<{ code: string; name: string; type: string; category: string }>
  onRecord?: (transaction: {
    date: string
    description: string
    accountCode: string
    type: 'debit' | 'credit'
    amount: number
    category: string
    reference: string
    notes: string
  }) => void
}

// ── Transaction Categories ───────────────────────────────────────────────────

const TRANSACTION_CATEGORIES = [
  'Rent Payment',
  'Maintenance',
  'Insurance',
  'Property Tax',
  'Utilities',
  'Management Fee',
  'Late Fee',
  'Security Deposit',
  'Other Income',
  'Other Expense',
]

// ── Component ────────────────────────────────────────────────────────────────

export function RecordTransactionDialog({ open, onOpenChange, accounts, onRecord }: RecordTransactionDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = React.useState('')
  const [accountCode, setAccountCode] = React.useState('')
  const [type, setType] = React.useState<'debit' | 'credit'>('credit')
  const [amount, setAmount] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [reference, setReference] = React.useState('')
  const [notes, setNotes] = React.useState('')

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setDate(new Date().toISOString().split('T')[0])
      setDescription('')
      setAccountCode('')
      setType('credit')
      setAmount('')
      setCategory('')
      setReference('')
      setNotes('')
    }
  }, [open])

  // Auto-suggest category when account changes
  const selectedAccount = accounts.find((a) => a.code === accountCode)

  React.useEffect(() => {
    if (selectedAccount) {
      // Auto-suggest type based on account type
      if (selectedAccount.type === 'expense' || selectedAccount.type === 'asset') {
        setType('debit')
      } else if (selectedAccount.type === 'revenue' || selectedAccount.type === 'liability') {
        setType('credit')
      }
    }
  }, [selectedAccount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !description.trim() || !accountCode || !type || !amount || parseFloat(amount) <= 0) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      onRecord?.({
        date,
        description: description.trim(),
        accountCode,
        type,
        amount: parseFloat(amount),
        category,
        reference: reference.trim(),
        notes: notes.trim(),
      })

      toast.success('Transaction recorded successfully')
      onOpenChange(false)
    } catch {
      toast.error('Failed to record transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Record Transaction</DialogTitle>
          <DialogDescription>
            Record a new accounting transaction. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date + Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="txn-date" className="text-sm font-medium">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="txn-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select value={type} onValueChange={(v) => setType(v as 'debit' | 'credit')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Debit (DR)</SelectItem>
                  <SelectItem value="credit">Credit (CR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="txn-description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Input
              id="txn-description"
              placeholder="e.g., Rent Payment - Unit 4B"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Account + Amount row */}
          <div className="grid grid-cols-[1fr_140px] gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Account <span className="text-destructive">*</span>
              </Label>
              <Select value={accountCode} onValueChange={setAccountCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.code} value={a.code}>
                      {a.code} - {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAccount && (
                <p className="text-[11px] text-muted-foreground">
                  {selectedAccount.type.charAt(0).toUpperCase() + selectedAccount.type.slice(1)} · {selectedAccount.category}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="txn-amount" className="text-sm font-medium">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="txn-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="font-mono"
                required
              />
            </div>
          </div>

          {/* Category + Reference row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="txn-reference" className="text-sm font-medium">Reference</Label>
              <Input
                id="txn-reference"
                placeholder="e.g., PAY-2025-001"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="txn-notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              id="txn-notes"
              placeholder="Additional notes about this transaction..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Summary Preview */}
          {description.trim() && accountCode && amount && parseFloat(amount) > 0 && (
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3 space-y-1.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Transaction Preview</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground font-medium">{description}</span>
                <span className={cn(
                  'text-sm font-bold font-mono',
                  type === 'debit' ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
                )}>
                  {type === 'debit' ? '-' : '+'}${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {selectedAccount ? `${selectedAccount.code} - ${selectedAccount.name}` : ''} · {type === 'debit' ? 'Debit' : 'Credit'} · {reference || 'No reference'}
              </p>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


