'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: number
  trendDirection?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  prefix?: string
  suffix?: string
  index?: number
  className?: string
}

// ── Animated Counter Hook ────────────────────────────────────────────────────

function useAnimatedCounter(end: number, duration = 1200, enabled = true) {
  const [count, setCount] = useState(() => (enabled ? 0 : end))
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) return

    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(eased * end)

      setCount(progress >= 1 ? end : current)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [end, duration, enabled])

  return enabled ? count : end
}

// ── Format Helpers ───────────────────────────────────────────────────────────

function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

function formatCurrency(num: number): string {
  return '$' + num.toLocaleString('en-US')
}

// ── Component ────────────────────────────────────────────────────────────────

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  trend,
  trendDirection = 'up',
  trendLabel,
  prefix = '',
  suffix = '',
  index = 0,
  className,
}: KpiCardProps) {
  // Determine if value is numeric for animation
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''))
  const isNumeric = !isNaN(numericValue) && typeof value === 'number'
  const animatedCount = useAnimatedCounter(numericValue, 1200, isNumeric)

  const displayValue = isNumeric
    ? prefix === '$'
      ? formatCurrency(animatedCount)
      : formatNumber(animatedCount) + suffix
    : String(value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Card
        className={cn(
          'mojave-card group relative overflow-hidden bg-card/80 border-border/30 cursor-pointer',
          className
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 flex-1 min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {displayValue}
                </p>
              </div>
              {subtitle && (
                <p className="text-[11px] text-muted-foreground/70">{subtitle}</p>
              )}
              {trend !== undefined && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-[11px] font-medium',
                      trendDirection === 'up' && 'text-primary',
                      trendDirection === 'down' && 'text-red-600 dark:text-red-400',
                      trendDirection === 'neutral' && 'text-muted-foreground'
                    )}
                  >
                    {trendDirection === 'up' && (
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                    {trendDirection === 'down' && (
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {trend}%
                  </span>
                  {trendLabel && (
                    <span className="text-[11px] text-muted-foreground/60">
                      {trendLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105',
                iconBg
              )}
            >
              <Icon className={cn('size-5', iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

export function KpiCardSkeleton() {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-3 w-20 rounded-md bg-muted/50 animate-pulse" />
            <div className="h-7 w-28 rounded-md bg-muted/50 animate-pulse" />
            <div className="h-2.5 w-16 rounded-md bg-muted/50 animate-pulse" />
          </div>
          <div className="size-11 rounded-xl bg-muted/50 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
