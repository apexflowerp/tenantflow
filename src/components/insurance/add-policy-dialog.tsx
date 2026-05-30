'use client'

import * as React from 'react'
import { Shield } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// ── Types ────────────────────────────────────────────────────────────────────

interface AddPolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function AddPolicyDialog({ open, onOpenChange, onSuccess }: AddPolicyDialogProps) {
  const [formData, setFormData] = React.useState({
    policyNumber: '',
    provider: '',
    type: '',
    premium: '',
    deductible: '',
    coverage: '',
    startDate: '',
    endDate: '',
    property: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsSubmitting(false)
    onOpenChange(false)
    onSuccess?.()

    // Reset form
    setFormData({
      policyNumber: '',
      provider: '',
      type: '',
      premium: '',
      deductible: '',
      coverage: '',
      startDate: '',
      endDate: '',
      property: '',
      notes: '',
    })
  }

  const isValid =
    formData.policyNumber &&
    formData.provider &&
    formData.type &&
    formData.premium &&
    formData.coverage &&
    formData.startDate &&
    formData.endDate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="size-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Add Insurance Policy</DialogTitle>
              <DialogDescription>
                Register a new insurance policy for your properties
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Policy Number & Provider */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number</Label>
              <Input
                id="policyNumber"
                placeholder="PROP-2025-001"
                value={formData.policyNumber}
                onChange={(e) => handleChange('policyNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                placeholder="State Farm"
                value={formData.provider}
                onChange={(e) => handleChange('provider', e.target.value)}
              />
            </div>
          </div>

          {/* Type & Property */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Policy Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="liability">Liability</SelectItem>
                  <SelectItem value="workers_comp">Workers Comp</SelectItem>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="umbrella">Umbrella</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="property">Property</Label>
              <Select
                value={formData.property}
                onValueChange={(value) => handleChange('property', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="skyline">Skyline Tower</SelectItem>
                  <SelectItem value="harbor">Harbor View Residences</SelectItem>
                  <SelectItem value="greenfield">Greenfield Gardens</SelectItem>
                  <SelectItem value="metro">Metro Commercial Hub</SelectItem>
                  <SelectItem value="sunset">Sunset Ridge Apartments</SelectItem>
                  <SelectItem value="oakwood">Oakwood Estates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Premium, Deductible, Coverage */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="premium">Annual Premium ($)</Label>
              <Input
                id="premium"
                type="number"
                placeholder="18000"
                value={formData.premium}
                onChange={(e) => handleChange('premium', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deductible">Deductible ($)</Label>
              <Input
                id="deductible"
                type="number"
                placeholder="5000"
                value={formData.deductible}
                onChange={(e) => handleChange('deductible', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverage">Coverage ($)</Label>
              <Input
                id="coverage"
                type="number"
                placeholder="2500000"
                value={formData.coverage}
                onChange={(e) => handleChange('coverage', e.target.value)}
              />
            </div>
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this policy..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? 'Adding...' : 'Add Policy'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
