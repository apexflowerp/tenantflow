'use client'

import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Shield,
  Zap,
  Target,
  AlertTriangle,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react'

type InsightType = 'positive' | 'negative' | 'neutral' | 'warning' | 'action'

interface InsightCardProps {
  title: string
  description: string
  type?: InsightType
  icon?: LucideIcon
  index?: number
}

const TYPE_CONFIG: Record<InsightType, {
  icon: LucideIcon
  accentColor: string
  bgColor: string
  borderColor: string
  textColor: string
}> = {
  positive: {
    icon: TrendingUp,
    accentColor: 'text-primary',
    bgColor: 'bg-primary/5 dark:bg-primary/10',
    borderColor: 'border-primary/20 dark:border-primary/20',
    textColor: 'text-primary',
  },
  negative: {
    icon: TrendingDown,
    accentColor: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    borderColor: 'border-rose-200 dark:border-rose-800/40',
    textColor: 'text-rose-700 dark:text-rose-300',
  },
  neutral: {
    icon: BarChart3,
    accentColor: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    borderColor: 'border-teal-200 dark:border-teal-800/40',
    textColor: 'text-teal-700 dark:text-teal-300',
  },
  warning: {
    icon: AlertTriangle,
    accentColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800/40',
    textColor: 'text-amber-700 dark:text-amber-300',
  },
  action: {
    icon: Zap,
    accentColor: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    borderColor: 'border-violet-200 dark:border-violet-800/40',
    textColor: 'text-violet-700 dark:text-violet-300',
  },
}

export function InsightCard({
  title,
  description,
  type = 'neutral',
  icon,
  index = 0,
}: InsightCardProps) {
  const config = TYPE_CONFIG[type]
  const Icon = icon ?? config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={`group relative flex gap-3 rounded-xl border ${config.borderColor} ${config.bgColor} p-4 transition-shadow hover:shadow-md`}
    >
      {/* Accent line */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-current opacity-20" style={{ color: 'inherit' }} />

      <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${config.bgColor} ${config.accentColor}`}>
        <Icon className="size-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className={`text-sm font-semibold ${config.textColor}`}>{title}</h4>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

// ── Preset Insights for the AI Insights Panel ──

export interface AIInsight {
  id: string
  title: string
  description: string
  type: InsightType
  icon?: LucideIcon
}

export const DEFAULT_AI_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    title: 'Occupancy trending up 5%',
    description: 'Consider adjusting rental rates to maximize revenue while demand is strong.',
    type: 'positive',
    icon: Target,
  },
  {
    id: '2',
    title: 'Skyline Tower leads collection',
    description: 'Skyline Tower has the highest collection rate at 96%. Replicate their processes across other properties.',
    type: 'neutral',
    icon: Shield,
  },
  {
    id: '3',
    title: 'Maintenance resolution improved',
    description: 'Maintenance resolution time improved by 15% this quarter. Keep up the proactive maintenance schedule.',
    type: 'positive',
    icon: TrendingUp,
  },
  {
    id: '4',
    title: '3 leases expiring within 30 days',
    description: 'Proactively reach out to tenants for renewals to minimize vacancy risk.',
    type: 'warning',
    icon: AlertTriangle,
  },
]
