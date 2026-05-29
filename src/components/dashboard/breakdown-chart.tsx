'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TicketBreakdown, LeaseBreakdown } from '@/stores'

// ── Types ────────────────────────────────────────────────────────────────────

interface BreakdownChartProps {
  type: 'payment' | 'ticket' | 'lease'
  paymentBreakdown?: { paid: number; pending: number; overdue: number }
  ticketBreakdown?: TicketBreakdown
  leaseBreakdown?: LeaseBreakdown
  isLoading?: boolean
}

// ── Color Palettes — Warm Mojave tones ───────────────────────────────────────

const paymentColors = {
  paid: '#c2703a',     // warm terracotta
  pending: '#d4956a',  // warm sand
  overdue: '#dc4a3a',  // warm red
}

const ticketColors = {
  open: '#d4956a',       // warm sand
  in_progress: '#6ba3b5', // muted teal
  scheduled: '#8b6ba5',   // muted violet
  resolved: '#c2703a',    // warm terracotta
}

const leaseColors = {
  active: '#c2703a',    // warm terracotta
  expiring: '#d4956a',  // warm sand
  expired: '#dc4a3a',   // warm red
}

// ── Custom Tooltip ───────────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>
}

function BreakdownTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="rounded-xl border border-border/40 bg-card/95 backdrop-blur-xl px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2">
        <div
          className="size-2 rounded-full"
          style={{ backgroundColor: payload[0].payload.fill }}
        />
        <span className="text-[11px] text-muted-foreground capitalize">
          {payload[0].name.replace('_', ' ')}:
        </span>
        <span className="text-sm font-semibold text-foreground">
          {payload[0].value}
        </span>
      </div>
    </div>
  )
}

// ── Custom Label Renderer ────────────────────────────────────────────────────

interface LabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) => {
  if (percent < 0.05) return null

  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export function BreakdownChart({
  type,
  paymentBreakdown,
  ticketBreakdown,
  leaseBreakdown,
  isLoading,
}: BreakdownChartProps) {
  let chartData: Array<{ name: string; value: number; fill: string }> = []
  let title = ''
  let total = 0

  if (type === 'payment' && paymentBreakdown) {
    const { paid, pending, overdue } = paymentBreakdown
    total = paid + pending + overdue
    chartData = [
      { name: 'paid', value: paid, fill: paymentColors.paid },
      { name: 'pending', value: pending, fill: paymentColors.pending },
      { name: 'overdue', value: overdue, fill: paymentColors.overdue },
    ]
    title = 'Payment Status'
  } else if (type === 'ticket' && ticketBreakdown) {
    const { open, in_progress, scheduled, resolved } = ticketBreakdown
    total = open + in_progress + scheduled + resolved
    chartData = [
      { name: 'open', value: open, fill: ticketColors.open },
      { name: 'in_progress', value: in_progress, fill: ticketColors.in_progress },
      { name: 'scheduled', value: scheduled, fill: ticketColors.scheduled },
      { name: 'resolved', value: resolved, fill: ticketColors.resolved },
    ]
    title = 'Ticket Status'
  } else if (type === 'lease' && leaseBreakdown) {
    const { active, expiring, expired } = leaseBreakdown
    total = active + expiring + expired
    chartData = [
      { name: 'active', value: active, fill: leaseColors.active },
      { name: 'expiring', value: expiring, fill: leaseColors.expiring },
      { name: 'expired', value: expired, fill: leaseColors.expired },
    ]
    title = 'Lease Status'
  }

  if (isLoading) {
    return (
      <Card className="border-border/30 bg-card/80">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-28 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[160px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.6 }}
    >
      <Card className="mojave-card border-border/30 bg-card/80">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[13px] font-semibold">{title}</CardTitle>
            <span className="text-[11px] text-muted-foreground">{total} total</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<BreakdownTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-[11px] text-muted-foreground capitalize">
                  {item.name.replace('_', ' ')}
                </span>
                <span className="text-[11px] font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
