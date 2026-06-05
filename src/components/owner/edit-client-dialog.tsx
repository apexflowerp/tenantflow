'use client'

import * as React from 'react'
import { Save } from 'lucide-react'
import { useOwnerStore, type ClientData } from '@/stores/owner-store'
import { useToast } from '@/hooks/use-toast'
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
import { Separator } from '@/components/ui/separator'

interface EditClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: ClientData
}

const planPrices: Record<string, number> = {
  starter: 49,
  professional: 149,
  business: 349,
  enterprise: 799,
}

const planLimits: Record<string, { maxProperties: number; maxUsers: number; maxDevices: number }> = {
  starter: { maxProperties: 10, maxUsers: 5, maxDevices: 3 },
  professional: { maxProperties: 50, maxUsers: 25, maxDevices: 10 },
  business: { maxProperties: 200, maxUsers: 100, maxDevices: 50 },
  enterprise: { maxProperties: 9999, maxUsers: 9999, maxDevices: 9999 },
}

export function EditClientDialog({ open, onOpenChange, client }: EditClientDialogProps) {
  const { updateClient } = useOwnerStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [form, setForm] = React.useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    website: '',
    industry: '',
    companySize: '',
    taxId: '',
    status: 'active',
    plan: 'starter',
    billingCycle: 'monthly',
    monthlyFee: 49,
    setupFee: 0,
    discountPercent: 0,
    maxProperties: 10,
    maxUsers: 5,
    maxDevices: 3,
    notes: '',
    primaryColor: '',
    customDomain: '',
  })

  // Populate form when client changes or dialog opens
  React.useEffect(() => {
    if (client && open) {
      setForm({
        companyName: client.companyName || '',
        contactName: client.contactName || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zipCode: client.zipCode || '',
        country: client.country || 'US',
        website: client.website || '',
        industry: client.industry || '',
        companySize: client.companySize || '',
        taxId: client.taxId || '',
        status: client.status || 'active',
        plan: client.plan || 'starter',
        billingCycle: client.billingCycle || 'monthly',
        monthlyFee: client.monthlyFee || 0,
        setupFee: client.setupFee || 0,
        discountPercent: client.discountPercent || 0,
        maxProperties: client.maxProperties || 10,
        maxUsers: client.maxUsers || 5,
        maxDevices: client.maxDevices || 3,
        notes: client.notes || '',
        primaryColor: client.primaryColor || '',
        customDomain: client.customDomain || '',
      })
    }
  }, [client, open])

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePlanChange = (plan: string) => {
    const limits = planLimits[plan]
    const price = planPrices[plan]
    setForm(prev => ({
      ...prev,
      plan,
      monthlyFee: price,
      maxProperties: limits.maxProperties,
      maxUsers: limits.maxUsers,
      maxDevices: limits.maxDevices,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await updateClient(client.id, {
        companyName: form.companyName,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        zipCode: form.zipCode || null,
        country: form.country,
        website: form.website || null,
        industry: form.industry || null,
        companySize: form.companySize || null,
        taxId: form.taxId || null,
        status: form.status,
        plan: form.plan,
        billingCycle: form.billingCycle,
        monthlyFee: form.monthlyFee,
        setupFee: form.setupFee,
        discountPercent: form.discountPercent,
        maxProperties: form.maxProperties,
        maxUsers: form.maxUsers,
        maxDevices: form.maxDevices,
        notes: form.notes || null,
        primaryColor: form.primaryColor || null,
        customDomain: form.customDomain || null,
      })
      toast({
        title: 'Client updated',
        description: `${form.companyName} has been updated successfully.`,
      })
      onOpenChange(false)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update client. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>Update client information, subscription, and settings</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Company Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-companyName">Company Name *</Label>
                <Input id="edit-companyName" value={form.companyName} onChange={(e) => updateField('companyName', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contactName">Contact Name *</Label>
                <Input id="edit-contactName" value={form.contactName} onChange={(e) => updateField('contactName', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input id="edit-email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" value={form.address} onChange={(e) => updateField('address', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input id="edit-city" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Input id="edit-state" value={form.state} onChange={(e) => updateField('state', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-zipCode">Zip Code</Label>
                <Input id="edit-zipCode" value={form.zipCode} onChange={(e) => updateField('zipCode', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-country">Country</Label>
                <Input id="edit-country" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-website">Website</Label>
                <Input id="edit-website" value={form.website} onChange={(e) => updateField('website', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-industry">Industry</Label>
                <Select value={form.industry} onValueChange={(v) => updateField('industry', v)}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property-management">Rental Management</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-companySize">Company Size</Label>
                <Select value={form.companySize} onValueChange={(v) => updateField('companySize', v)}>
                  <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-taxId">Tax ID</Label>
                <Input id="edit-taxId" value={form.taxId} onChange={(e) => updateField('taxId', e.target.value)} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Subscription */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Subscription</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Plan</Label>
                <Select value={form.plan} onValueChange={handlePlanChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter (${planPrices.starter}/mo)</SelectItem>
                    <SelectItem value="professional">Professional (${planPrices.professional}/mo)</SelectItem>
                    <SelectItem value="business">Business (${planPrices.business}/mo)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (${planPrices.enterprise}/mo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-billingCycle">Billing Cycle</Label>
                <Select value={form.billingCycle} onValueChange={(v) => updateField('billingCycle', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-monthlyFee">Monthly Fee ($)</Label>
                <Input id="edit-monthlyFee" type="number" value={form.monthlyFee} onChange={(e) => updateField('monthlyFee', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-setupFee">Setup Fee ($)</Label>
                <Input id="edit-setupFee" type="number" value={form.setupFee} onChange={(e) => updateField('setupFee', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discountPercent">Discount (%)</Label>
                <Input id="edit-discountPercent" type="number" min="0" max="100" value={form.discountPercent} onChange={(e) => updateField('discountPercent', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={form.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="churned">Churned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Resource Limits */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Resource Limits</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="edit-maxProperties">Max Properties</Label>
                <Input id="edit-maxProperties" type="number" value={form.maxProperties} onChange={(e) => updateField('maxProperties', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxUsers">Max Users</Label>
                <Input id="edit-maxUsers" type="number" value={form.maxUsers} onChange={(e) => updateField('maxUsers', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxDevices">Max Devices</Label>
                <Input id="edit-maxDevices" type="number" value={form.maxDevices} onChange={(e) => updateField('maxDevices', Number(e.target.value))} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notes & Customization */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Notes & Customization</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input id="edit-primaryColor" value={form.primaryColor} onChange={(e) => updateField('primaryColor', e.target.value)} placeholder="#0ea5e9" />
                  {form.primaryColor && (
                    <div className="size-9 rounded-md border shrink-0" style={{ backgroundColor: form.primaryColor }} />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customDomain">Custom Domain</Label>
                <Input id="edit-customDomain" value={form.customDomain} onChange={(e) => updateField('customDomain', e.target.value)} placeholder="app.client.com" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea id="edit-notes" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Internal notes about this client..." rows={3} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !form.companyName || !form.contactName || !form.email} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              {isSubmitting ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
