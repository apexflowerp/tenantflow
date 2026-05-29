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
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="size-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground capitalize">
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
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
            <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
              <Button
                variant={period === 'monthly' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod('monthly')}
                className="h-7 px-3 text-xs"
              >
                Monthly
              </Button>
              <Button
                variant={period === 'quarterly' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod('quarterly')}
                className="h-7 px-3 text-xs"
              >
                Quarterly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={formatCurrencyShort}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: '#10b981',
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#expensesGradient)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: '#f59e0b',
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">Expenses</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
