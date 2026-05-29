'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Plus,
  Mail,
  MessageSquare as SmsIcon,
  Megaphone,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageList, type MessageItem } from './message-list'
import { MessageDetail } from './message-detail'
import { NewMessageDialog } from './new-message-dialog'

// ── Types ────────────────────────────────────────────────────────────────────

interface MessageStats {
  total: number
  unread: number
  email: number
  sms: number
  announcement: number
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function CommunicationsSkeleton() {
  return (
    <div className="flex h-[calc(100vh-10rem)] gap-0 rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="w-full md:w-[380px] lg:w-[420px] border-r border-border/50">
        <div className="p-3 border-b border-border/50">
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex border-b border-border/50">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="flex-1 h-9 m-1" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border-b border-border/30">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export function CommunicationsPage() {
  const [messages, setMessages] = React.useState<MessageItem[]>([])
  const [stats, setStats] = React.useState<MessageStats | null>(null)
  const [tenants, setTenants] = React.useState<Array<{ id: string; name: string; email: string }>>([])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [newMessageOpen, setNewMessageOpen] = React.useState(false)
  const [showMobileDetail, setShowMobileDetail] = React.useState(false)

  // Fetch messages
  const fetchMessages = React.useCallback(async () => {
    try {
      const res = await fetch('/api/messages')
      if (!res.ok) throw new Error('Failed to fetch messages')
      const data = await res.json()
      setMessages(data.messages || [])
      setStats(data.stats || null)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch tenants for dropdown
  const fetchTenants = React.useCallback(async () => {
    try {
      const res = await fetch('/api/tenants')
      if (!res.ok) return
      const data = await res.json()
      const tenantList = (data.tenants || []).map((t: { id: string; name: string; email: string }) => ({
        id: t.id,
        name: t.name,
        email: t.email,
      }))
      setTenants(tenantList)
    } catch {
      // silently fail
    }
  }, [])

  React.useEffect(() => {
    fetchMessages()
    fetchTenants()
  }, [fetchMessages, fetchTenants])

  const selectedMessage = React.useMemo(
    () => messages.find((m) => m.id === selectedId) ?? null,
    [messages, selectedId]
  )

  const handleSelectMessage = (id: string) => {
    setSelectedId(id)
    setShowMobileDetail(true)
  }

  const handleReply = async (messageId: string, content: string) => {
    try {
      const original = messages.find((m) => m.id === messageId)
      if (!original) return

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: original.subject ? `Re: ${original.subject}` : null,
          content,
          type: original.type,
          direction: 'outbound',
          tenantId: original.tenantId || undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed to send reply')
      await fetchMessages()
    } catch (err) {
      console.error('Reply failed:', err)
    }
  }

  const handleDelete = async (messageId: string) => {
    // Optimistic delete from local state
    setMessages((prev) => prev.filter((m) => m.id !== messageId))
    if (selectedId === messageId) {
      setSelectedId(null)
      setShowMobileDetail(false)
    }
  }

  const handleNewMessage = async (data: {
    subject: string
    content: string
    type: string
    tenantId: string
  }) => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: data.subject || null,
        content: data.content,
        type: data.type,
        direction: 'outbound',
        tenantId: data.tenantId || null,
      }),
    })
    if (!res.ok) throw new Error('Failed to send message')
    await fetchMessages()
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <CommunicationsSkeleton />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <MessageSquare className="size-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Communications</h1>
            {stats && (
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-muted-foreground">
                  {stats.total} messages
                </span>
                {stats.unread > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                    {stats.unread} unread
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="size-3" /> {stats.email}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <SmsIcon className="size-3" /> {stats.sms}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Megaphone className="size-3" /> {stats.announcement}
                </span>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={() => setNewMessageOpen(true)}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          size="sm"
        >
          <Plus className="size-4" />
          New Message
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="flex h-[calc(100vh-14rem)] rounded-xl border border-border/50 bg-card overflow-hidden">
        {/* Left panel - Message list */}
        <div
          className={`w-full md:w-[380px] lg:w-[420px] border-r border-border/50 shrink-0 ${
            showMobileDetail ? 'hidden md:flex md:flex-col' : 'flex flex-col'
          }`}
        >
          <MessageList
            messages={messages}
            selectedId={selectedId}
            onSelect={handleSelectMessage}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Right panel - Message detail */}
        <div
          className={`flex-1 ${
            showMobileDetail ? 'flex flex-col' : 'hidden md:flex md:flex-col'
          }`}
        >
          {/* Mobile back button */}
          {showMobileDetail && (
            <div className="md:hidden border-b border-border/50 p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileDetail(false)}
                className="text-xs"
              >
                ← Back to messages
              </Button>
            </div>
          )}
          <MessageDetail
            message={selectedMessage}
            onReply={handleReply}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* New message dialog */}
      <NewMessageDialog
        open={newMessageOpen}
        onOpenChange={setNewMessageOpen}
        tenants={tenants}
        onSend={handleNewMessage}
      />
    </motion.div>
  )
}
