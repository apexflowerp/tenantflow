'use client'

import * as React from 'react'
import { Bell, Check, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

import { useAppStore } from '@/stores'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

// ── Helpers ─────────────────────────────────────────────────────────────────

const typeConfig: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  info: { icon: Info, color: 'text-sky-500' },
  success: { icon: CheckCircle2, color: 'text-primary' },
  warning: { icon: AlertTriangle, color: 'text-amber-500' },
  error: { icon: XCircle, color: 'text-red-500' },
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// ── Component ───────────────────────────────────────────────────────────────

export function NotificationPanel() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } =
    useAppStore()

  const count = unreadCount()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="size-[16px]" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-[16px] items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-background">
              {count > 9 ? '9+' : count}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl">
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
          <span className="text-[13px] font-semibold">Notifications</span>
          {count > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                markAllNotificationsRead()
              }}
              className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />

        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
              <Bell className="size-8 opacity-30" />
              <p className="text-[12px]">No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((n) => {
              const config = typeConfig[n.type] ?? typeConfig.info
              const Icon = config.icon
              return (
                <DropdownMenuItem
                  key={n.id}
                  className={cn(
                    'flex items-start gap-3 px-4 py-2.5 cursor-pointer rounded-lg mx-1',
                    !n.read && 'bg-primary/5'
                  )}
                  onClick={() => markNotificationRead(n.id)}
                >
                  <Icon className={cn('mt-0.5 size-3.5 shrink-0', config.color)} />
                  <div className="flex-1 space-y-0.5">
                    <p
                      className={cn(
                        'text-[12px] leading-snug',
                        !n.read ? 'font-medium text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {n.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/50">
                      {formatTimeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              )
            })
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2">
              <button className="w-full rounded-lg py-1.5 text-center text-[11px] font-medium text-primary hover:bg-primary/5 transition-colors">
                View all notifications
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
