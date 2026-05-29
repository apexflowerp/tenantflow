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
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  property_updated: {
    icon: Building2,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
  },
  tenant_created: {
    icon: UserPlus,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  tenant_updated: {
    icon: UserPlus,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
  },
  lease_created: {
    icon: FileText,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  lease_updated: {
    icon: FileText,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
  },
  lease_expired: {
    icon: FileText,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40',
  },
  payment_received: {
    icon: CreditCard,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/40',
  },
  payment_pending: {
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
  },
  payment_overdue: {
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40',
  },
  maintenance_created: {
    icon: Wrench,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
  },
  maintenance_resolved: {
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  message_sent: {
    icon: MessageSquare,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
  },
  message_received: {
    icon: MessageSquare,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
}

const defaultConfig = {
  icon: Clock,
  color: 'text-muted-foreground',
  bg: 'bg-muted',
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
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="size-9 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {activities.length} new
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-80">
            <div className="px-6 space-y-1">
              {activities.map((activity, index) => {
                const config = activityConfig[activity.type] || defaultConfig
                const Icon = config.icon

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${config.bg}`}
                    >
                      <Icon className={`size-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-foreground leading-tight truncate">
                        {activity.title}
                      </p>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {activity.user && (
                          <span className="text-xs text-muted-foreground">
                            {activity.user.name}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground/60">
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
            className="w-full text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            View all activity
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
