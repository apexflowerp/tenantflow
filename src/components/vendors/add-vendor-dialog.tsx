'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'general', label: 'General' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'painting', label: 'Painting' },
] as const

const PAYMENT_TERMS = [
  { value: 'net15', label: 'Net 15' },
  { value: 'net30', label: 'Net 30' },
  { value: 'net60', label: 'Net 60' },
] as const

interface AddVendorDialogProps {
  children?: React.ReactNode
  onAdd?: (vendor: Record<string, unknown>) => void
}

export function AddVendorDialog({ children, onAdd }: AddVendorDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [category, setCategory] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [insuranceExpiry, setInsuranceExpiry] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [notes, setNotes] = useState('')

  function resetForm() {
    setName('')
    setEmail('')
    setPhone('')
    setCompany('')
    setCategory('')
    setSpecialty('')
    setLicenseNumber('')
    setInsuranceExpiry('')
    setPaymentTerms('')
    setAddress('')
    setCity('')
    setState('')
    setZipCode('')
    setNotes('')
  }

  async function handleSubmit() {
    if (!name || !email || !company || !category || !paymentTerms) return

    setIsSubmitting(true)
    try {
      const newVendor = {
        name,
        email,
        phone,
        company,
        category,
        specialty,
        licenseNumber,
        insuranceExpiry,
        paymentTerms,
        address,
        city,
        state,
        zipCode,
        notes,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      onAdd?.(newVendor)
      resetForm()
      setOpen(false)
    } catch (error) {
      console.error('Failed to add vendor:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = name && email && company && category && paymentTerms

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="gap-1.5">
            <Plus className="size-4" />
            Add Vendor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
          <DialogDescription>
            Register a new vendor or contractor to your management system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* ── Company Information ────────────────────────── */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Company Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="vendor-name">Contact Name *</Label>
                <Input
                  id="vendor-name"
                  placeholder="e.g. Mike Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-company">Company *</Label>
                <Input
                  id="vendor-company"
                  placeholder="e.g. Elite Plumbing Co"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-email">Email *</Label>
                <Input
                  id="vendor-email"
                  type="email"
                  placeholder="e.g. mike@eliteplumbing.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-phone">Phone</Label>
                <Input
                  id="vendor-phone"
                  placeholder="e.g. (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Service Details ────────────────────────────── */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Service Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="vendor-category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="vendor-category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-specialty">Specialty</Label>
                <Input
                  id="vendor-specialty"
                  placeholder="e.g. Emergency repairs"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-license">License Number</Label>
                <Input
                  id="vendor-license"
                  placeholder="e.g. PLB-2019-4521"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-insurance">Insurance Expiry</Label>
                <Input
                  id="vendor-insurance"
                  type="date"
                  value={insuranceExpiry}
                  onChange={(e) => setInsuranceExpiry(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="vendor-payment">Payment Terms *</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger id="vendor-payment" className="w-full">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TERMS.map((pt) => (
                      <SelectItem key={pt.value} value={pt.value}>
                        {pt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Address ────────────────────────────────────── */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Address
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="vendor-address">Street Address</Label>
                <Input
                  id="vendor-address"
                  placeholder="e.g. 123 Business Ave"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="vendor-city">City</Label>
                  <Input
                    id="vendor-city"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vendor-state">State</Label>
                  <Input
                    id="vendor-state"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vendor-zip">Zip Code</Label>
                  <Input
                    id="vendor-zip"
                    placeholder="Zip"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Notes ──────────────────────────────────────── */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Additional Notes
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="vendor-notes" className="sr-only">Notes</Label>
              <Textarea
                id="vendor-notes"
                placeholder="Any additional notes about this vendor..."
                className="resize-none"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => { setOpen(false); resetForm() }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSubmitting || !isValid}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Add Vendor
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
