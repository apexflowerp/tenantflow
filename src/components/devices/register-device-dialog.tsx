'use client'

import * as React from 'react'
import { Monitor, Laptop, Tablet, Smartphone, RefreshCw } from 'lucide-react'

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
import { getApiUrl } from '@/lib/api'

// ── Types ────────────────────────────────────────────────────────────────────

interface UserOption {
  id: string
  name: string
  email: string
}

interface RegisterDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function RegisterDeviceDialog({ open, onOpenChange, onSuccess }: RegisterDeviceDialogProps) {
  const [deviceName, setDeviceName] = React.useState('')
  const [deviceType, setDeviceType] = React.useState('desktop')
  const [os, setOs] = React.useState('')
  const [userId, setUserId] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [users, setUsers] = React.useState<UserOption[]>([])

  // Fetch users for assignment dropdown
  React.useEffect(() => {
    if (open) {
      fetch(getApiUrl('/api/tenants'))
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          // We'll use the workspace users from the seed data
          // For simplicity, provide a manual list
          setUsers([
            { id: 'user-1', name: 'Sarah Chen', email: 'sarah.chen@tenantflow.io' },
            { id: 'user-2', name: 'Marcus Johnson', email: 'marcus.johnson@tenantflow.io' },
            { id: 'user-3', name: 'Emily Rodriguez', email: 'emily.rodriguez@tenantflow.io' },
            { id: 'user-4', name: 'David Kim', email: 'david.kim@tenantflow.io' },
            { id: 'user-5', name: 'Rachel Patel', email: 'rachel.patel@tenantflow.io' },
          ])
        })
        .catch(() => {})
    }
  }, [open])

  const handleSubmit = async () => {
    if (!deviceName.trim()) {
      toast.error('Please enter a device name')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(getApiUrl('/api/devices'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceName: deviceName.trim(),
          deviceType,
          os: os.trim() || null,
          browser: null,
          ipAddress: null,
          macAddress: null,
          userId: userId || null,
          workspaceId: 'ws-default',
        }),
      })

      if (res.ok) {
        toast.success('Device registered successfully')
        setDeviceName('')
        setDeviceType('desktop')
        setOs('')
        setUserId('')
        onOpenChange(false)
        onSuccess()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to register device')
      }
    } catch {
      toast.error('Failed to register device')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSerialPreview = () => {
    return `TF-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="size-5 text-primary" />
            Register New Device
          </DialogTitle>
          <DialogDescription>
            Add a new device to the system. A serial key will be auto-generated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Auto-generated serial key preview */}
          <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Auto-generated Serial Key</p>
                <code className="text-sm font-mono mt-1 block">{generateSerialPreview()}</code>
              </div>
              <RefreshCw className="size-4 text-muted-foreground" />
            </div>
          </div>

          {/* Device Name */}
          <div className="space-y-2">
            <Label htmlFor="device-name">Device Name *</Label>
            <Input
              id="device-name"
              placeholder="e.g., Jordan's MacBook Pro"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </div>

          {/* Device Type */}
          <div className="space-y-2">
            <Label>Device Type</Label>
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desktop">
                  <div className="flex items-center gap-2">
                    <Monitor className="size-4" />
                    Desktop
                  </div>
                </SelectItem>
                <SelectItem value="laptop">
                  <div className="flex items-center gap-2">
                    <Laptop className="size-4" />
                    Laptop
                  </div>
                </SelectItem>
                <SelectItem value="tablet">
                  <div className="flex items-center gap-2">
                    <Tablet className="size-4" />
                    Tablet
                  </div>
                </SelectItem>
                <SelectItem value="mobile">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4" />
                    Mobile
                  </div>
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operating System */}
          <div className="space-y-2">
            <Label htmlFor="device-os">Operating System</Label>
            <Select value={os} onValueChange={setOs}>
              <SelectTrigger>
                <SelectValue placeholder="Select OS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Windows 11 Pro">Windows 11 Pro</SelectItem>
                <SelectItem value="Windows 10 Pro">Windows 10 Pro</SelectItem>
                <SelectItem value="macOS Sonoma">macOS Sonoma</SelectItem>
                <SelectItem value="macOS Ventura">macOS Ventura</SelectItem>
                <SelectItem value="Ubuntu 22.04 LTS">Ubuntu 22.04 LTS</SelectItem>
                <SelectItem value="iPadOS 17">iPadOS 17</SelectItem>
                <SelectItem value="iOS 17">iOS 17</SelectItem>
                <SelectItem value="Android 14">Android 14</SelectItem>
                <SelectItem value="ChromeOS">ChromeOS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assign to User */}
          <div className="space-y-2">
            <Label>Assign to User (Optional)</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
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
            disabled={isSubmitting || !deviceName.trim()}
          >
            {isSubmitting ? 'Registering...' : 'Register Device'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
