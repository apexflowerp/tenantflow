'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  MessageSquare,
  Megaphone,
  ArrowUpRight,
  ArrowDownLeft,
  Reply,
  Forward,
  Trash2,
  Send,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { MessageItem } from './message-list'

// ── Types ────────────────────────────────────────────────────────────────────

interface MessageDetailProps {
  message: MessageItem | null
  onReply: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
}

// ── Config ───────────────────────────────────────────────────────────────────

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string; bg: string }> = {
  email: { icon: Mail, label: 'Email', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  sms: { icon: MessageSquare, label: 'SMS', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
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

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full flex-col items-center justify-center text-center p-8"
    >
      <div className="flex size-20 items-center justify-center rounded-2xl bg-cyan-500/10 mb-4">
        <Inbox className="size-10 text-cyan-500/50" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">No message selected</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Select a message from the list to view its contents and details
      </p>
    </motion.div>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export function MessageDetail({ message, onReply, onDelete }: MessageDetailProps) {
  const [replyText, setReplyText] = React.useState('')
  const [showReply, setShowReply] = React.useState(false)

  if (!message) {
    return <EmptyState />
  }

  const typeCfg = typeConfig[message.type] || typeConfig.email
  const TypeIcon = typeCfg.icon
  const isInbound = message.direction === 'inbound'
  const displayName = message.tenant?.name || 'Unknown'
  const displayEmail = message.tenant?.email || ''
  const avatarColor = isInbound
    ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'

  const handleReplySend = () => {
    if (!replyText.trim()) return
    onReply(message.id, replyText)
    setReplyText('')
    setShowReply(false)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message.id}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.2 }}
        className="flex h-full flex-col"
      >
        {/* Header */}
        <div className="border-b border-border/50 p-4 md:p-6">
          <div className="flex items-start gap-4">
            <Avatar className="size-11">
              <AvatarFallback className={cn('text-sm font-medium', avatarColor)}>
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-foreground truncate">
                  {message.subject || 'No Subject'}
                </h2>
                <Badge
                  variant="secondary"
                  className={cn('h-5 px-2 text-[10px] gap-1', typeCfg.bg, typeCfg.color, 'border-0')}
                >
                  <TypeIcon className="size-3" />
                  {typeCfg.label}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    'h-5 px-2 text-[10px] gap-1 border-0',
                    isInbound
                      ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  )}
                >
                  {isInbound ? (
                    <ArrowDownLeft className="size-3" />
                  ) : (
                    <ArrowUpRight className="size-3" />
                  )}
                  {isInbound ? 'Inbound' : 'Outbound'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm text-muted-foreground">
                  {isInbound ? 'From' : 'To'}: <span className="font-medium text-foreground/80">{displayName}</span>
                  {displayEmail && (
                    <span className="text-muted-foreground"> ({displayEmail})</span>
                  )}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatFullDate(message.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>

        {/* Actions bar */}
        <Separator />
        <div className="p-3 md:p-4 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReply(!showReply)}
            className="gap-1.5 text-xs"
          >
            <Reply className="size-3.5" />
            Reply
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <Forward className="size-3.5" />
            Forward
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(message.id)}
            className="gap-1.5 text-xs text-destructive hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>

        {/* Reply input */}
        <AnimatePresence>
          {showReply && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/50 overflow-hidden"
            >
              <div className="p-3 md:p-4 space-y-3">
                <Textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[100px] resize-none text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowReply(false)
                      setReplyText('')
                    }}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReplySend}
                    disabled={!replyText.trim()}
                    className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Send className="size-3.5" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
