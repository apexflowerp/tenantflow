'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  MessageSquare,
  Megaphone,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

export interface MessageItem {
  id: string
  subject: string | null
  content: string
  type: string
  direction: string
  status: string
  tenantId: string | null
  createdAt: string
  tenant: {
    id: string
    name: string
    email: string
    phone: string | null
    avatar: string | null
  } | null
}

interface MessageListProps {
  messages: MessageItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  activeTab: string
  onTabChange: (tab: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

// ── Type badge config ────────────────────────────────────────────────────────

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string; bg: string }> = {
  email: { icon: Mail, label: 'Email', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  sms: { icon: MessageSquare, label: 'SMS', color: 'text-primary', bg: 'bg-primary/5 dark:bg-primary/10' },
  announcement: { icon: Megaphone, label: 'Announcement', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.slice(0, len) + '…'
}

// ── Component ────────────────────────────────────────────────────────────────

export function MessageList({
  messages,
  selectedId,
  onSelect,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: MessageListProps) {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' },
    { id: 'announcement', label: 'Announcements' },
  ]

  const filteredMessages = React.useMemo(() => {
    let filtered = messages
    if (activeTab !== 'all') {
      filtered = filtered.filter((m) => m.type === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          (m.subject && m.subject.toLowerCase().includes(q)) ||
          m.content.toLowerCase().includes(q) ||
          (m.tenant && m.tenant.name.toLowerCase().includes(q))
      )
    }
    return filtered
  }, [messages, activeTab, searchQuery])

  const isInbound = (dir: string) => dir === 'inbound'

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="p-3 border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-muted/30 border-border/30"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex-1 px-3 py-2.5 text-xs font-medium transition-colors relative',
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="message-tab-indicator"
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Message list */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/30">
          <AnimatePresence initial={false}>
            {filteredMessages.map((message, index) => {
              const typeCfg = typeConfig[message.type] || typeConfig.email
              const TypeIcon = typeCfg.icon
              const isSelected = selectedId === message.id
              const isUnread = message.status === 'sent' && isInbound(message.direction)
              const displayName = message.tenant?.name || 'Unknown'
              const avatarColor = isInbound(message.direction)
                ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300'
                : 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary'

              return (
                <motion.button
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                  onClick={() => onSelect(message.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-accent/50',
                    isSelected && 'bg-primary/5 border-l-2 border-l-primary',
                    isUnread && 'bg-accent/30'
                  )}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <Avatar className="size-9">
                      <AvatarFallback className={cn('text-xs font-medium', avatarColor)}>
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Direction indicator */}
                    <div
                      className={cn(
                        'absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border-2 border-background',
                        isInbound(message.direction)
                          ? 'bg-cyan-500'
                          : 'bg-primary'
                      )}
                    >
                      {isInbound(message.direction) ? (
                        <ArrowDownLeft className="size-2.5 text-white" />
                      ) : (
                        <ArrowUpRight className="size-2.5 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-sm truncate',
                          isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'
                        )}
                      >
                        {displayName}
                      </span>
                      {isUnread && (
                        <span className="size-2 rounded-full bg-primary shrink-0" />
                      )}
                      <span className="ml-auto text-[11px] text-muted-foreground shrink-0">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        'text-sm truncate mt-0.5',
                        isUnread ? 'font-medium text-foreground/90' : 'text-muted-foreground'
                      )}
                    >
                      {message.subject || 'No Subject'}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">
                      {truncate(message.content, 80)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Badge
                        variant="secondary"
                        className={cn('h-5 px-1.5 text-[10px] gap-1', typeCfg.bg, typeCfg.color, 'border-0')}
                      >
                        <TypeIcon className="size-2.5" />
                        {typeCfg.label}
                      </Badge>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>

          {filteredMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mail className="size-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No messages found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {searchQuery ? 'Try a different search term' : 'Messages will appear here'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
