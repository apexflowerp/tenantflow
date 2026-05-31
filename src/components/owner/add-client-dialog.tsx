'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
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

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const { addClient } = useOwnerStore()
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
    status: 'trial',
    plan: 'starter',
    billingCycle: 'monthly',
    monthlyFee: 49,
    setupFee: 0,
    discountPercent: 0,
    maxProperties: 10,
    maxUsers: 5,
    maxDevices: 3,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await addClient(form)
      onOpenChange(false)
      // Reset form
      setForm({
        companyName: '', contactName: '', email: '', phone: '',
        address: '', city: '', state: '', zipCode: '', country: 'US',
        website: '', industry: '', companySize: '', taxId: '',
        status: 'trial', plan: 'starter', billingCycle: 'monthly',
        monthlyFee: 49, setupFee: 0, discountPercent: 0,
        maxProperties: 10, maxUsers: 5, maxDevices: 3,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const planPrices: Record<string, number> = { starter: 49, professional: 149, business: 349, enterprise: 799 }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>Register a new SaaS client to the platform</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Company Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" value={form.companyName} onChange={(e) => updateField('companyName', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input id="contactName" value={form.contactName} onChange={(e) => updateField('contactName', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={form.address} onChange={(e) => updateField('address', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.state} onChange={(e) => updateField('state', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" value={form.zipCode} onChange={(e) => updateField('zipCode', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={form.website} onChange={(e) => updateField('website', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
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
                <Label htmlFor="companySize">Company Size</Label>
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
            </div>
          </div>

          {/* Subscription */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Subscription</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select value={form.plan} onValueChange={(v) => updateField('plan', v)}>
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
                <Label htmlFor="billingCycle">Billing Cycle</Label>
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
                <Label htmlFor="monthlyFee">Monthly Fee ($)</Label>
                <Input id="monthlyFee" type="number" value={form.monthlyFee} onChange={(e) => updateField('monthlyFee', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setupFee">Setup Fee ($)</Label>
                <Input id="setupFee" type="number" value={form.setupFee} onChange={(e) => updateField('setupFee', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPercent">Discount (%)</Label>
                <Input id="discountPercent" type="number" min="0" max="100" value={form.discountPercent} onChange={(e) => updateField('discountPercent', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Resource Limits</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="maxProperties">Max Properties</Label>
                <Input id="maxProperties" type="number" value={form.maxProperties} onChange={(e) => updateField('maxProperties', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUsers">Max Users</Label>
                <Input id="maxUsers" type="number" value={form.maxUsers} onChange={(e) => updateField('maxUsers', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDevices">Max Devices</Label>
                <Input id="maxDevices" type="number" value={form.maxDevices} onChange={(e) => updateField('maxDevices', Number(e.target.value))} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !form.companyName || !form.contactName || !form.email} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              {isSubmitting ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Add Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
