'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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

type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'

interface AddAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingAccounts: Array<{ code: string; name: string; type: AccountType }>
  onAdd?: (account: {
    code: string
    name: string
    type: AccountType
    category: string
    description: string
    parentCode: string
    openingBalance: number
  }) => void
}

// ── Categories by type ───────────────────────────────────────────────────────

const CATEGORIES_BY_TYPE: Record<AccountType, string[]> = {
  asset: ['Current Assets', 'Fixed Assets', 'Other Assets'],
  liability: ['Current Liabilities', 'Long-term Liabilities', 'Other Liabilities'],
  equity: ['Equity', 'Retained Earnings', 'Other Equity'],
  revenue: ['Operating Revenue', 'Other Revenue'],
  expense: ['Operating Expenses', 'Administrative Expenses', 'Other Expenses'],
}

// ── Component ────────────────────────────────────────────────────────────────

export function AddAccountDialog({ open, onOpenChange, existingAccounts, onAdd }: AddAccountDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState<AccountType>('asset')
  const [category, setCategory] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [parentCode, setParentCode] = React.useState('')
  const [openingBalance, setOpeningBalance] = React.useState('')

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setCode('')
      setName('')
      setType('asset')
      setCategory('')
      setDescription('')
      setParentCode('')
      setOpeningBalance('')
    }
  }, [open])

  // Update category options when type changes
  const categories = CATEGORIES_BY_TYPE[type] ?? []

  // Filter parent accounts by selected type
  const parentAccounts = existingAccounts.filter((a) => a.type === type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim() || !name.trim() || !type || !category) {
      toast.error('Please fill in all required fields')
      return
    }

    // Check for duplicate code
    if (existingAccounts.some((a) => a.code === code.trim())) {
      toast.error('An account with this code already exists')
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      onAdd?.({
        code: code.trim(),
        name: name.trim(),
        type,
        category,
        description: description.trim(),
        parentCode,
        openingBalance: parseFloat(openingBalance) || 0,
      })

      toast.success(`Account "${name.trim()}" created successfully`)
      onOpenChange(false)
    } catch {
      toast.error('Failed to create account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Account</DialogTitle>
          <DialogDescription>
            Create a new account in the chart of accounts. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code + Name row */}
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <div className="space-y-2">
              <Label htmlFor="account-code" className="text-sm font-medium">
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="account-code"
                placeholder="1000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-name" className="text-sm font-medium">
                Account Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="account-name"
                placeholder="e.g., Cash, Accounts Receivable"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Type + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={type}
                onValueChange={(v) => {
                  setType(v as AccountType)
                  setCategory('')
                  setParentCode('')
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset">Asset</SelectItem>
                  <SelectItem value="liability">Liability</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="account-description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="account-description"
              placeholder="Describe the purpose of this account..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Parent Account + Opening Balance */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Parent Account</Label>
              <Select value={parentCode} onValueChange={setParentCode}>
                <SelectTrigger>
                  <SelectValue placeholder="None (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None (top-level)</SelectItem>
                  {parentAccounts.map((a) => (
                    <SelectItem key={a.code} value={a.code}>
                      {a.code} - {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="opening-balance" className="text-sm font-medium">Opening Balance</Label>
              <Input
                id="opening-balance"
                type="number"
                step="0.01"
                min="0"
                placeholder="$0.00"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

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
              Create Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
