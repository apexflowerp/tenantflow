'use client'

import * as React from 'react'
import { Key, RefreshCw } from 'lucide-react'
import { getApiUrl } from '@/lib/api'

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
import { toast } from 'sonner'

// ── Types ────────────────────────────────────────────────────────────────────

interface ClientOption {
  id: string
  companyName: string
}

interface GenerateKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function GenerateKeyDialog({ open, onOpenChange, onSuccess }: GenerateKeyDialogProps) {
  const [keyType, setKeyType] = React.useState('standard')
  const [plan, setPlan] = React.useState('starter')
  const [maxDevices, setMaxDevices] = React.useState('5')
  const [maxUsers, setMaxUsers] = React.useState('10')
  const [expiresAt, setExpiresAt] = React.useState('')
  const [clientId, setClientId] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [clients, setClients] = React.useState<ClientOption[]>([])

  // Fetch clients
  React.useEffect(() => {
    if (open) {
      setClients([
        { id: 'default-client', companyName: 'TenantFlow HQ' },
      ])
      setClientId('default-client')
    }
  }, [open])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const body: Record<string, unknown> = {
        type: keyType,
        plan,
        maxDevices: parseInt(maxDevices) || 1,
        maxUsers: parseInt(maxUsers) || 5,
      }
      if (expiresAt) body.expiresAt = expiresAt
      if (clientId) body.clientId = clientId

      const res = await fetch(getApiUrl('/api/devices/license-keys'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`License key generated: ${data.licenseKey?.key || 'Key created'}`)
        setKeyType('standard')
        setPlan('starter')
        setMaxDevices('5')
        setMaxUsers('10')
        setExpiresAt('')
        onOpenChange(false)
        onSuccess()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to generate license key')
      }
    } catch {
      toast.error('Failed to generate license key')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateKeyPreview = () => {
    const segments = Array.from({ length: 4 }, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase()
    )
    return segments.join('-')
  }

  // Set defaults when key type changes
  React.useEffect(() => {
    switch (keyType) {
      case 'trial':
        setMaxDevices('1')
        setMaxUsers('3')
        setPlan('starter')
        break
      case 'standard':
        setMaxDevices('5')
        setMaxUsers('10')
        setPlan('standard')
        break
      case 'professional':
        setMaxDevices('10')
        setMaxUsers('25')
        setPlan('professional')
        break
      case 'enterprise':
        setMaxDevices('50')
        setMaxUsers('100')
        setPlan('enterprise')
        break
    }
  }, [keyType])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="size-5 text-primary" />
            Generate License Key
          </DialogTitle>
          <DialogDescription>
            Create a new license key for device activation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Key Preview */}
          <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Generated Key Preview</p>
                <code className="text-sm font-mono mt-1 block tracking-wider">{generateKeyPreview()}</code>
              </div>
              <RefreshCw className="size-4 text-muted-foreground" />
            </div>
          </div>

          {/* Key Type */}
          <div className="space-y-2">
            <Label>Key Type</Label>
            <Select value={keyType} onValueChange={setKeyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select key type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trial">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-amber-500" />
                    Trial — 1 device, 3 users
                  </div>
                </SelectItem>
                <SelectItem value="standard">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    Standard — 5 devices, 10 users
                  </div>
                </SelectItem>
                <SelectItem value="professional">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-sky-500" />
                    Professional — 10 devices, 25 users
                  </div>
                </SelectItem>
                <SelectItem value="enterprise">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-violet-500" />
                    Enterprise — 50 devices, 100 users
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Plan */}
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max Devices & Max Users */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-devices">Max Devices</Label>
              <Input
                id="max-devices"
                type="number"
                min="1"
                value={maxDevices}
                onChange={(e) => setMaxDevices(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-users">Max Users</Label>
              <Input
                id="max-users"
                type="number"
                min="1"
                value={maxUsers}
                onChange={(e) => setMaxUsers(e.target.value)}
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date (Optional)</Label>
            <Input
              id="expiry"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          {/* Assign to Client */}
          <div className="space-y-2">
            <Label>Assign to Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Generating...' : 'Generate Key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
