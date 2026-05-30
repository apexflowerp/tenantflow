'use client'

import * as React from 'react'
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
import { Mail, MessageSquare, Megaphone, Send, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// ── Types ────────────────────────────────────────────────────────────────────

interface NewMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenants: Array<{ id: string; name: string; email: string }>
  onSend: (data: {
    subject: string
    content: string
    type: string
    tenantId: string
  }) => Promise<void>
}

// ── Component ────────────────────────────────────────────────────────────────

export function NewMessageDialog({
  open,
  onOpenChange,
  tenants,
  onSend,
}: NewMessageDialogProps) {
  const { toast } = useToast()
  const [subject, setSubject] = React.useState('')
  const [content, setContent] = React.useState('')
  const [type, setType] = React.useState('email')
  const [tenantId, setTenantId] = React.useState('')
  const [sending, setSending] = React.useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({ title: 'Content is required', variant: 'destructive' })
      return
    }
    if (type === 'email' && !subject.trim()) {
      toast({ title: 'Subject is required for emails', variant: 'destructive' })
      return
    }

    setSending(true)
    try {
      await onSend({
        subject: subject.trim(),
        content: content.trim(),
        type,
        tenantId: tenantId === 'all' ? '' : tenantId,
      })
      toast({ title: 'Message sent successfully', description: `Your ${type} has been delivered` })
      resetForm()
      onOpenChange(false)
    } catch {
      toast({ title: 'Failed to send message', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  const resetForm = () => {
    setSubject('')
    setContent('')
    setType('email')
    setTenantId('')
  }

  const typeOptions = [
    { value: 'email', label: 'Email', icon: Mail, color: 'text-cyan-600' },
    { value: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-primary' },
    { value: 'announcement', label: 'Announcement', icon: Megaphone, color: 'text-amber-600' },
  ]

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Compose a new message to send to tenants
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Type selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Message Type</Label>
            <div className="flex gap-2">
              {typeOptions.map((opt) => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.value}
                    onClick={() => setType(opt.value)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      type === opt.value
                        ? 'border-primary/20 bg-primary/10 text-primary dark:text-primary'
                        : 'border-border/60 text-muted-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className={`size-4 ${type === opt.value ? 'text-primary' : opt.color}`} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {type === 'announcement' ? 'Target Audience' : 'Recipient'}
            </Label>
            <Select value={tenantId} onValueChange={setTenantId}>
              <SelectTrigger>
                <SelectValue placeholder={type === 'announcement' ? 'All tenants' : 'Select tenant...'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {type === 'announcement' ? 'All tenants' : 'All tenants (broadcast)'}
                </SelectItem>
                {tenants.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          {type !== 'sms' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subject</Label>
              <Input
                placeholder="Enter message subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Content</Label>
            <Textarea
              placeholder={type === 'sms' ? 'Type your SMS message...' : 'Type your message...'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[140px] resize-none"
            />
            {type === 'sms' && (
              <p className="text-xs text-muted-foreground text-right">
                {content.length}/160 characters
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={sending || !content.trim()}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {sending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
