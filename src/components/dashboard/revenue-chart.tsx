'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { RevenueDataPoint } from '@/stores'

// ── Types ────────────────────────────────────────────────────────────────────

interface RevenueChartProps {
  data: RevenueDataPoint[]
  isLoading?: boolean
}

// ── Format Helpers ───────────────────────────────────────────────────────────

function formatCurrencyShort(value: number): string {
  if (value >= 1000) {
    return '$' + (value / 1000).toFixed(0) + 'k'
  }
  return '$' + value
}

function formatCurrencyFull(value: number): string {
  return '$' + value.toLocaleString('en-US')
}

// ── Custom Tooltip ───────────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="rounded-xl border border-border/40 bg-card/95 backdrop-blur-xl px-4 py-3 shadow-xl">
      <p className="text-[11px] font-medium text-muted-foreground mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[11px] text-muted-foreground capitalize">
            {entry.dataKey}:
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrencyFull(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const [period, setPeriod] = useState<'monthly' | 'quarterly'>('monthly')

  // Aggregate for quarterly view
  const chartData =
    period === 'quarterly'
      ? data.reduce<Array<{ month: string; revenue: number; expenses: number }>>(
          (acc, item, idx) => {
            const quarterIdx = Math.floor(idx / 3)
            if (!acc[quarterIdx]) {
              const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4']
              acc[quarterIdx] = {
                month: quarterLabels[quarterIdx] || `Q${quarterIdx + 1}`,
                revenue: 0,
                expenses: 0,
              }
            }
            acc[quarterIdx].revenue += item.revenue
            acc[quarterIdx].expenses += item.expenses
            return acc
          },
          []
        )
      : data

  if (isLoading) {
    return (
      <Card className="border-border/30 bg-card/80">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-7 w-36 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  // Warm Mojave colors for charts
  const revenueColor = '#c2703a' // warm terracotta/amber
  const expenseColor = '#d4956a' // warm sand

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.4 }}
    >
      <Card className="mojave-card border-border/30 bg-card/80">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
            <div className="flex items-center gap-0.5 rounded-lg border border-border/40 bg-muted/30 p-0.5">
              <Button
                variant={period === 'monthly' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod('monthly')}
                className="h-6 px-2.5 text-[11px] rounded-md"
              >
                Monthly
              </Button>
              <Button
                variant={period === 'quarterly' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod('quarterly')}
                className="h-6 px-2.5 text-[11px] rounded-md"
              >
                Quarterly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={revenueColor} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={revenueColor} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={expenseColor} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={expenseColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={formatCurrencyShort}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={revenueColor}
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: revenueColor,
                    stroke: 'hsl(var(--card))',
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke={expenseColor}
                  strokeWidth={1.5}
                  fill="url(#expensesGradient)"
                  dot={false}
                  activeDot={{
                    r: 3,
                    fill: expenseColor,
                    stroke: 'hsl(var(--card))',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-3">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full" style={{ backgroundColor: revenueColor }} />
              <span className="text-[11px] text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full" style={{ backgroundColor: expenseColor }} />
              <span className="text-[11px] text-muted-foreground">Expenses</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
