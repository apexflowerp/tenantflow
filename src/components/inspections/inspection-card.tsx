'use client'

import * as React from 'react'
import {
  ClipboardCheck,
  Calendar,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  ChevronRight,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Inspection {
  id: string
  title: string
  type: 'move_in' | 'move_out' | 'annual' | 'seasonal' | 'emergency' | 'compliance'
  status: 'scheduled' | 'in_progress' | 'completed'
  scheduledDate: string
  completedDate: string | null
  property: string
  unit: string | null
  inspectorName: string
  rating: number | null
  findings?: string
}

// ── Config maps ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  move_in: { label: 'Move-In', icon: ClipboardCheck, color: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-500/10' },
  move_out: { label: 'Move-Out', icon: ClipboardCheck, color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500/10' },
  annual: { label: 'Annual', icon: Calendar, color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-500/10' },
  seasonal: { label: 'Seasonal', icon: Calendar, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10' },
  emergency: { label: 'Emergency', icon: AlertTriangle, color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500/10' },
  compliance: { label: 'Compliance', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  scheduled: { label: 'Scheduled', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500' },
  in_progress: { label: 'In Progress', color: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20', dot: 'bg-teal-500' },
  completed: { label: 'Completed', color: 'text-primary', bg: 'bg-primary/10 border-primary/20', dot: 'bg-primary' },
}

// ── Rating display ────────────────────────────────────────────────────────────

function RatingDisplay({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-xs text-muted-foreground">—</span>

  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.3
  const color = rating >= 4 ? 'text-amber-500' : rating >= 3 ? 'text-orange-500' : 'text-red-500'

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-3.5 ${
              i < fullStars
                ? `fill-current ${color}`
                : i === fullStars && hasHalf
                  ? `fill-current/50 ${color}`
                  : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-semibold ${color}`}>{rating.toFixed(1)}</span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

interface InspectionCardProps {
  inspection: Inspection
  onClick?: () => void
  compact?: boolean
}

export function InspectionCard({ inspection, onClick, compact = false }: InspectionCardProps) {
  const typeConfig = TYPE_CONFIG[inspection.type] ?? TYPE_CONFIG.annual
  const statusConfig = STATUS_CONFIG[inspection.status] ?? STATUS_CONFIG.scheduled
  const TypeIcon = typeConfig.icon

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left rounded-xl border border-border/40 bg-card/80 p-3 hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`flex size-9 items-center justify-center rounded-lg ${typeConfig.bg}`}>
            <TypeIcon className={`size-4 ${typeConfig.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{inspection.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-foreground">{inspection.property}</span>
              {inspection.unit && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-[11px] text-muted-foreground">Unit {inspection.unit}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant="outline" className={`text-[10px] shrink-0 ${statusConfig.bg} ${statusConfig.color} border`}>
            <span className={`size-1.5 rounded-full ${statusConfig.dot} mr-1`} />
            {statusConfig.label}
          </Badge>
        </div>
      </button>
    )
  }

  return (
    <Card
      className="mojave-card border-border/40 bg-card/80 hover:shadow-md transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div className={`flex size-10 items-center justify-center rounded-xl ${typeConfig.bg} shrink-0`}>
            <TypeIcon className={`size-5 ${typeConfig.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {inspection.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`text-[10px] ${typeConfig.bg} ${typeConfig.color} border`}>
                    {typeConfig.label}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] gap-1 ${statusConfig.bg} ${statusConfig.color} border`}>
                    <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" />
                <span>{inspection.property}{inspection.unit ? ` · Unit ${inspection.unit}` : ''}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>{formatDate(inspection.scheduledDate)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="size-3.5" />
                <span>{inspection.inspectorName}</span>
              </div>
              {inspection.status === 'completed' && inspection.completedDate && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>Completed {formatDate(inspection.completedDate)}</span>
                </div>
              )}
            </div>

            {/* Rating and findings */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
              <RatingDisplay rating={inspection.rating} />
              {inspection.findings && (
                <p className="text-[11px] text-muted-foreground max-w-[60%] truncate">
                  {inspection.findings}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
