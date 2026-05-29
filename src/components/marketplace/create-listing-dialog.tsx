'use client'

import * as React from 'react'
import {
  Plus,
  Home,
  DollarSign,
  Calendar,
  Star,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

// ── Props ────────────────────────────────────────────────────────────────────

interface CreateListingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ── Form state ───────────────────────────────────────────────────────────────

interface ListingForm {
  title: string
  property: string
  unit: string
  type: string
  price: string
  deposit: string
  description: string
  amenities: string
  availableFrom: string
  featured: boolean
}

const INITIAL_FORM: ListingForm = {
  title: '',
  property: '',
  unit: '',
  type: 'rental',
  price: '',
  deposit: '',
  description: '',
  amenities: '',
  availableFrom: '',
  featured: false,
}

// ── Mock property data ───────────────────────────────────────────────────────

const PROPERTIES = [
  { id: 'p1', name: 'Skyline Tower', units: ['4B', '7A', '12C', 'PH2'] },
  { id: 'p2', name: 'Greenfield Gardens', units: ['2A', '5D', '8B'] },
  { id: 'p3', name: 'Harbor View Residences', units: ['PH1', '10A', '15B'] },
  { id: 'p4', name: 'Metro Commercial Hub', units: ['G1', 'G2', '201', '302'] },
  { id: 'p5', name: 'Riverside Apartments', units: ['G2', '3C', '6A', '9D'] },
]

// ── Component ────────────────────────────────────────────────────────────────

export function CreateListingDialog({ open, onOpenChange }: CreateListingDialogProps) {
  const [form, setForm] = React.useState<ListingForm>(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const selectedProperty = PROPERTIES.find((p) => p.id === form.property)

  function updateField<K extends keyof ListingForm>(key: K, value: ListingForm[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      // Reset unit when property changes
      if (key === 'property') {
        next.unit = ''
      }
      return next
    })
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitting(false)
    onOpenChange(false)
    setForm(INITIAL_FORM)
  }

  const isFormValid =
    form.title.trim() !== '' &&
    form.property !== '' &&
    form.unit !== '' &&
    form.price !== '' &&
    Number(form.price) > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="size-4 text-primary" />
            </div>
            Create Listing
          </DialogTitle>
          <DialogDescription>
            Add a new property listing to the marketplace. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="listing-title" className="text-sm font-medium">
              Listing Title
            </Label>
            <Input
              id="listing-title"
              placeholder="e.g. Modern 2BR with City View"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          {/* Property + Unit row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Property</Label>
              <Select value={form.property} onValueChange={(v) => updateField('property', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTIES.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Unit</Label>
              <Select
                value={form.unit}
                onValueChange={(v) => updateField('unit', v)}
                disabled={!form.property}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProperty?.units.map((u) => (
                    <SelectItem key={u} value={u}>
                      Unit {u}
                    </SelectItem>
                  )) ?? (
                    <SelectItem value="none" disabled>
                      Select a property first
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Listing Type</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={form.type === 'rental' ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5"
                onClick={() => updateField('type', 'rental')}
              >
                <Home className="size-3.5" />
                Rental
              </Button>
              <Button
                type="button"
                variant={form.type === 'sale' ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5"
                onClick={() => updateField('type', 'sale')}
              >
                <DollarSign className="size-3.5" />
                Sale
              </Button>
            </div>
          </div>

          {/* Price + Deposit row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="listing-price" className="text-sm font-medium">
                {form.type === 'rental' ? 'Monthly Rent' : 'Sale Price'}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="listing-price"
                  type="number"
                  placeholder="0"
                  className="pl-9"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="listing-deposit" className="text-sm font-medium">
                {form.type === 'rental' ? 'Security Deposit' : 'Earnest Money'}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="listing-deposit"
                  type="number"
                  placeholder="0"
                  className="pl-9"
                  value={form.deposit}
                  onChange={(e) => updateField('deposit', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="listing-desc" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="listing-desc"
              placeholder="Describe the property, its features, and what makes it special..."
              className="min-h-[80px] resize-none"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <Label htmlFor="listing-amenities" className="text-sm font-medium">
              Amenities
            </Label>
            <Textarea
              id="listing-amenities"
              placeholder="e.g. In-unit laundry, Balcony, Gym access, Parking"
              className="min-h-[60px] resize-none"
              value={form.amenities}
              onChange={(e) => updateField('amenities', e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Separate amenities with commas
            </p>
          </div>

          {/* Available From + Featured row */}
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="listing-available" className="text-sm font-medium">
                Available From
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="listing-available"
                  type="date"
                  className="pl-9"
                  value={form.availableFrom}
                  onChange={(e) => updateField('availableFrom', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pb-0.5">
              <Switch
                checked={form.featured}
                onCheckedChange={(checked) => updateField('featured', checked)}
              />
              <div className="flex items-center gap-1.5">
                <Star className="size-4 text-amber-500" />
                <Label className="text-sm font-medium cursor-pointer">Featured</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setForm(INITIAL_FORM)
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1.5" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="size-4 mr-1.5" />
                Create Listing
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
