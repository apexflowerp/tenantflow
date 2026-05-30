'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Plus,
  Building2,
  Home,
  User,
  FileText,
  Loader2,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { useToast } from '@/hooks/use-toast'

// ── Schema ───────────────────────────────────────────────────────────────────

const createLeaseSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  unitId: z.string().min(1, 'Unit is required'),
  tenantId: z.string().min(1, 'Tenant is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  monthlyRent: z.string().min(1, 'Monthly rent is required').refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, 'Monthly rent must be a positive number'),
  deposit: z.string().optional().refine((val) => {
    if (!val) return true
    const num = parseFloat(val)
    return !isNaN(num) && num >= 0
  }, 'Deposit must be a non-negative number'),
  type: z.enum(['residential', 'commercial']),
  terms: z.string().optional(),
  rentEscalation: z.string().optional().refine((val) => {
    if (!val) return true
    const num = parseFloat(val)
    return !isNaN(num) && num >= 0 && num <= 50
  }, 'Rent escalation must be between 0% and 50%'),
})

type CreateLeaseFormValues = z.infer<typeof createLeaseSchema>

// ── Types for fetched data ───────────────────────────────────────────────────

interface PropertyOption {
  id: string
  name: string
  type: string
  units: { id: string; unitNumber: string; status: string; rent: number }[]
}

interface TenantOption {
  id: string
  name: string
  email: string
  type: string
  company?: string
}

// ── Props ────────────────────────────────────────────────────────────────────

interface CreateLeaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLeaseCreated?: () => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function CreateLeaseDialog({ open, onOpenChange, onLeaseCreated }: CreateLeaseDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [properties, setProperties] = React.useState<PropertyOption[]>([])
  const [tenants, setTenants] = React.useState<TenantOption[]>([])
  const [isLoadingData, setIsLoadingData] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<CreateLeaseFormValues>({
    resolver: zodResolver(createLeaseSchema),
    defaultValues: {
      propertyId: '',
      unitId: '',
      tenantId: '',
      startDate: '',
      endDate: '',
      monthlyRent: '',
      deposit: '',
      type: 'residential',
      terms: '',
      rentEscalation: '',
    },
  })

  const selectedPropertyId = form.watch('propertyId')
  const availableUnits = React.useMemo(() => {
    const prop = properties.find((p) => p.id === selectedPropertyId)
    if (!prop) return []
    return prop.units.filter((u) => u.status === 'vacant')
  }, [properties, selectedPropertyId])

  // Fetch properties and tenants when dialog opens
  React.useEffect(() => {
    if (!open) return

    const fetchData = async () => {
      setIsLoadingData(true)
      try {
        const [propRes, tenantRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/tenants'),
        ])

        if (propRes.ok) {
          const propData = await propRes.json()
          setProperties(propData.properties ?? propData ?? [])
        }

        if (tenantRes.ok) {
          const tenantData = await tenantRes.json()
          setTenants(tenantData.tenants ?? tenantData ?? [])
        }
      } catch (error) {
        console.error('Failed to fetch form data:', error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [open])

  // Reset unit when property changes
  React.useEffect(() => {
    form.setValue('unitId', '')
    // Auto-fill monthly rent from unit
    const prop = properties.find((p) => p.id === selectedPropertyId)
    if (prop) {
      // Check if commercial property
      if (prop.type === 'commercial') {
        form.setValue('type', 'commercial')
      } else {
        form.setValue('type', 'residential')
      }
    }
  }, [selectedPropertyId, properties, form])

  // Auto-fill rent from unit
  const selectedUnitId = form.watch('unitId')
  React.useEffect(() => {
    const prop = properties.find((p) => p.id === selectedPropertyId)
    if (prop) {
      const unit = prop.units.find((u) => u.id === selectedUnitId)
      if (unit) {
        form.setValue('monthlyRent', unit.rent.toString())
      }
    }
  }, [selectedUnitId, properties, selectedPropertyId, form])

  const onSubmit = async (data: CreateLeaseFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/leases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: data.propertyId,
          unitId: data.unitId,
          tenantId: data.tenantId,
          startDate: data.startDate,
          endDate: data.endDate,
          monthlyRent: parseFloat(data.monthlyRent),
          deposit: data.deposit ? parseFloat(data.deposit) : 0,
          type: data.type,
          terms: data.terms || null,
          rentEscalation: data.rentEscalation ? parseFloat(data.rentEscalation) : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create lease')
      }

      toast({
        title: 'Lease Created',
        description: 'The new lease has been successfully created.',
      })

      form.reset()
      onOpenChange(false)
      onLeaseCreated?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create lease',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
              <FileText className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            Create New Lease
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new lease agreement.
          </DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading data...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Property & Unit */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Building2 className="size-4 text-primary" />
                  Property & Unit
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="propertyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {properties.map((prop) => (
                              <SelectItem key={prop.id} value={prop.id}>
                                {prop.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Unit{' '}
                          {availableUnits.length > 0 && (
                            <Badge variant="secondary" className="ml-1 text-[10px]">
                              {availableUnits.length} vacant
                            </Badge>
                          )}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedPropertyId || availableUnits.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                !selectedPropertyId
                                  ? 'Select property first'
                                  : availableUnits.length === 0
                                  ? 'No vacant units'
                                  : 'Select unit'
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableUnits.map((unit) => (
                              <SelectItem key={unit.id} value={unit.id}>
                                Unit {unit.unitNumber} — ${unit.rent.toLocaleString()}/mo
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Tenant */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="size-4 text-teal-600 dark:text-teal-400" />
                  Tenant
                </div>
                <FormField
                  control={form.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenant</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tenant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tenants.map((tenant) => (
                            <SelectItem key={tenant.id} value={tenant.id}>
                              <span className="flex items-center gap-2">
                                {tenant.name}
                                <span className="text-muted-foreground text-xs">({tenant.email})</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Lease Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Home className="size-4 text-amber-600 dark:text-amber-400" />
                  Lease Details
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="monthlyRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rent ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            step="50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            step="50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lease Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rentEscalation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Rent Escalation (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            max="50"
                            step="0.5"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Terms</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional lease terms or conditions..."
                          className="min-h-[80px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[120px]">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      Create Lease
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
