'use client'

import * as React from 'react'
import { ClipboardCheck, Calendar, Plus } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

// ── Mock properties ───────────────────────────────────────────────────────────

const PROPERTIES = [
  { id: 'p1', name: 'Skyline Tower' },
  { id: 'p2', name: 'Harbor View Residences' },
  { id: 'p3', name: 'Metro Commercial Hub' },
  { id: 'p4', name: 'Greenfield Gardens' },
  { id: 'p5', name: 'Riverside Apartments' },
]

const INSPECTION_TYPES = [
  { value: 'move_in', label: 'Move-In Inspection' },
  { value: 'move_out', label: 'Move-Out Inspection' },
  { value: 'annual', label: 'Annual Safety Check' },
  { value: 'seasonal', label: 'Seasonal Review' },
  { value: 'emergency', label: 'Emergency Inspection' },
  { value: 'compliance', label: 'Compliance Check' },
]

// ── Component ─────────────────────────────────────────────────────────────────

interface ScheduleInspectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSchedule?: (data: ScheduleInspectionData) => void
}

export interface ScheduleInspectionData {
  title: string
  type: string
  property: string
  unit: string
  inspectorName: string
  scheduledDate: string
  scheduledTime: string
  checklistItems: string
  notes: string
}

export function ScheduleInspectionDialog({ open, onOpenChange, onSchedule }: ScheduleInspectionDialogProps) {
  const [formData, setFormData] = React.useState<ScheduleInspectionData>({
    title: '',
    type: '',
    property: '',
    unit: '',
    inspectorName: '',
    scheduledDate: '',
    scheduledTime: '',
    checklistItems: '',
    notes: '',
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  function updateField(field: keyof ScheduleInspectionData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!formData.title || !formData.type || !formData.property || !formData.inspectorName || !formData.scheduledDate) {
      return
    }
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600))
      onSchedule?.(formData)
      onOpenChange(false)
      // Reset form
      setFormData({
        title: '',
        type: '',
        property: '',
        unit: '',
        inspectorName: '',
        scheduledDate: '',
        scheduledTime: '',
        checklistItems: '',
        notes: '',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = formData.title && formData.type && formData.property && formData.inspectorName && formData.scheduledDate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardCheck className="size-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Schedule Inspection</DialogTitle>
              <DialogDescription>
                Set up a new property inspection with details and checklist items.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-1" />

        <div className="grid gap-4 py-2">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Inspection Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Move-In Inspection - Unit 4B"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          {/* Type and Property row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium">
                Inspection Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.type} onValueChange={(v) => updateField('type', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {INSPECTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-medium">
                Property <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.property} onValueChange={(v) => updateField('property', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTIES.map((prop) => (
                    <SelectItem key={prop.id} value={prop.name}>
                      {prop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Unit and Inspector row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="unit" className="text-sm font-medium">
                Unit
              </Label>
              <Input
                id="unit"
                placeholder="e.g. 4B (optional)"
                value={formData.unit}
                onChange={(e) => updateField('unit', e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="inspector" className="text-sm font-medium">
                Inspector Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="inspector"
                placeholder="e.g. Jordan Davis"
                value={formData.inspectorName}
                onChange={(e) => updateField('inspectorName', e.target.value)}
              />
            </div>
          </div>

          {/* Date and Time row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Scheduled Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="date"
                  type="date"
                  className="pl-9"
                  value={formData.scheduledDate}
                  onChange={(e) => updateField('scheduledDate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Scheduled Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => updateField('scheduledTime', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Checklist Items */}
          <div className="grid gap-2">
            <Label htmlFor="checklist" className="text-sm font-medium">
              Checklist Items
            </Label>
            <Textarea
              id="checklist"
              placeholder="Enter checklist items, one per line:&#10;- Check smoke detectors&#10;- Inspect HVAC system&#10;- Verify lock functionality&#10;- Check plumbing fixtures"
              rows={5}
              value={formData.checklistItems}
              onChange={(e) => updateField('checklistItems', e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Enter each checklist item on a new line
            </p>
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or special instructions..."
              rows={3}
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1.5" />
                Scheduling...
              </>
            ) : (
              <>
                <Plus className="size-4 mr-1.5" />
                Schedule Inspection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
