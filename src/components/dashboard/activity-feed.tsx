'use client'

import { motion } from 'framer-motion'
import {
  Building2,
  UserPlus,
  FileText,
  CreditCard,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { RecentActivity } from '@/stores'

// ── Types ────────────────────────────────────────────────────────────────────

interface ActivityFeedProps {
  activities: RecentActivity[]
  isLoading?: boolean
}

// ── Activity Type Config ─────────────────────────────────────────────────────

const activityConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  property_created: {
    icon: Building2,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  property_updated: {
    icon: Building2,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  tenant_created: {
    icon: UserPlus,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  tenant_updated: {
    icon: UserPlus,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  lease_created: {
    icon: FileText,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  lease_updated: {
    icon: FileText,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  lease_expired: {
    icon: FileText,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
  },
  payment_received: {
    icon: CreditCard,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  payment_pending: {
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  payment_overdue: {
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
  },
  maintenance_created: {
    icon: Wrench,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
  },
  maintenance_resolved: {
    icon: CheckCircle2,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  message_sent: {
    icon: MessageSquare,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
  },
  message_received: {
    icon: MessageSquare,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
}

const defaultConfig = {
  icon: Clock,
  color: 'text-muted-foreground',
  bg: 'bg-muted/50',
}

// ── Time Ago Helper ──────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

// ── Component ────────────────────────────────────────────────────────────────

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className="border-border/30 bg-card/80">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="size-8 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3.5 w-3/4 rounded-md" />
                <Skeleton className="h-2.5 w-1/2 rounded-md" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.5 }}
    >
      <Card className="mojave-card border-border/30 bg-card/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <Badge variant="secondary" className="text-[10px] font-medium">
              {activities.length} new
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-80">
            <div className="px-5 space-y-0.5">
              {activities.map((activity, index) => {
                const config = activityConfig[activity.type] || defaultConfig
                const Icon = config.icon

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/40"
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
                    >
                      <Icon className={`size-3.5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-[13px] font-medium text-foreground leading-tight truncate">
                        {activity.title}
                      </p>
                      {activity.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        {activity.user && (
                          <span className="text-[11px] text-muted-foreground">
                            {activity.user.name}
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground/50">
                          {timeAgo(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-primary hover:text-primary/80 text-[12px] rounded-xl"
          >
            View all activity
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
