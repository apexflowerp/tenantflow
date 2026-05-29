'use client'

import * as React from 'react'
import { Key } from 'lucide-react'
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

interface GenerateLicenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GenerateLicenseDialog({ open, onOpenChange }: GenerateLicenseDialogProps) {
  const { generateLicenseKey, clients, fetchClients } = useOwnerStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [generatedKey, setGeneratedKey] = React.useState<string | null>(null)
  const [form, setForm] = React.useState({
    clientId: '',
    type: 'standard',
    plan: 'starter',
    maxDevices: 1,
    maxUsers: 5,
  })

  React.useEffect(() => {
    if (clients.length === 0) {
      fetchClients()
    }
  }, [clients.length, fetchClients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientId) return
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/owner/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (response.ok) {
        const data = await response.json()
        setGeneratedKey(data.licenseKey.key)
        await generateLicenseKey(form)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setGeneratedKey(null)
    setForm({ clientId: '', type: 'standard', plan: 'starter', maxDevices: 1, maxUsers: 5 })
  }

  const copyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Generate License Key</DialogTitle>
          <DialogDescription>Create a new license key for a client</DialogDescription>
        </DialogHeader>

        {generatedKey ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-4">
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium mb-2">License Key Generated</p>
              <code className="block text-lg font-mono font-bold text-emerald-800 dark:text-emerald-300">
                {generatedKey}
              </code>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyKey} variant="outline" className="flex-1 gap-2">
                Copy Key
              </Button>
              <Button onClick={handleClose} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
              <Select value={form.clientId} onValueChange={(v) => setForm(prev => ({ ...prev, clientId: v }))} required>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Key Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm(prev => ({ ...prev, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select value={form.plan} onValueChange={(v) => setForm(prev => ({ ...prev, plan: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDevices">Max Devices</Label>
                <Input id="maxDevices" type="number" min="1" value={form.maxDevices} onChange={(e) => setForm(prev => ({ ...prev, maxDevices: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUsers">Max Users</Label>
                <Input id="maxUsers" type="number" min="1" value={form.maxUsers} onChange={(e) => setForm(prev => ({ ...prev, maxUsers: Number(e.target.value) }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting || !form.clientId} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                {isSubmitting ? (
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Key className="size-4" />
                )}
                Generate
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
