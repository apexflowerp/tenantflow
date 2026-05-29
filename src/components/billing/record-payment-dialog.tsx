'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

// ── Schema ──────────────────────────────────────────────────────────────────

const recordPaymentSchema = z.object({
  tenantId: z.string().min(1, 'Tenant is required'),
  leaseId: z.string().min(1, 'Lease is required'),
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Amount must be a positive number'
  ),
  type: z.enum(['rent', 'utility', 'deposit', 'other']),
  method: z.enum(['cash', 'check', 'bank_transfer', 'online']),
  reference: z.string().optional(),
  notes: z.string().optional(),
  paidDate: z.string().min(1, 'Payment date is required'),
})

type RecordPaymentForm = z.infer<typeof recordPaymentSchema>

// ── Types ───────────────────────────────────────────────────────────────────

interface TenantOption {
  id: string
  name: string
  email: string
  leases?: Array<{
    id: string
    property: { name: string }
    unit: { unitNumber: string }
    monthlyRent: number
  }>
}

interface RecordPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenants: TenantOption[]
  onSuccess?: () => void
}

// ── Component ───────────────────────────────────────────────────────────────

export function RecordPaymentDialog({ open, onOpenChange, tenants, onSuccess }: RecordPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedTenantId, setSelectedTenantId] = React.useState<string>('')

  const form = useForm<RecordPaymentForm>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      tenantId: '',
      leaseId: '',
      amount: '',
      type: 'rent',
      method: 'online',
      reference: '',
      notes: '',
      paidDate: new Date().toISOString().split('T')[0],
    },
  })

  // Get leases for selected tenant
  const selectedTenant = tenants.find((t) => t.id === selectedTenantId)
  const tenantLeases = selectedTenant?.leases ?? []

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      form.reset({
        tenantId: '',
        leaseId: '',
        amount: '',
        type: 'rent',
        method: 'online',
        reference: '',
        notes: '',
        paidDate: new Date().toISOString().split('T')[0],
      })
      setSelectedTenantId('')
    }
  }, [open, form])

  const onSubmit = async (values: RecordPaymentForm) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: values.tenantId,
          leaseId: values.leaseId,
          amount: values.amount,
          type: values.type,
          status: 'paid',
          method: values.method,
          reference: values.reference || null,
          notes: values.notes || null,
          dueDate: values.paidDate,
          paidDate: values.paidDate,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to record payment')
      }

      toast.success('Payment recorded successfully')
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to record payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Record Payment</DialogTitle>
          <DialogDescription>
            Record a new payment for a tenant. This will create a paid payment record.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tenant */}
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedTenantId(value)
                      // Reset lease when tenant changes
                      form.setValue('leaseId', '')
                      form.setValue('amount', '')
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tenant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lease */}
            <FormField
              control={form.control}
              name="leaseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lease</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Auto-fill amount from lease rent
                      const lease = tenantLeases.find((l) => l.id === value)
                      if (lease) {
                        form.setValue('amount', lease.monthlyRent.toString())
                      }
                    }}
                    disabled={!selectedTenantId || tenantLeases.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !selectedTenantId
                            ? 'Select a tenant first'
                            : tenantLeases.length === 0
                              ? 'No active leases'
                              : 'Select lease'
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tenantLeases.map((lease) => (
                        <SelectItem key={lease.id} value={lease.id}>
                          {lease.property.name} · Unit {lease.unit.unitNumber} (${lease.monthlyRent.toLocaleString()}/mo)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount + Type row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Method + Date row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paidDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Reference */}
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference #</FormLabel>
                  <FormControl>
                    <Input placeholder="Check #, transaction ID, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this payment..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Record Payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
