'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface OccupancyDataPoint {
  month: string
  rate: number
  units?: number
}

interface OccupancyChartProps {
  data: OccupancyDataPoint[]
  loading?: boolean
  avgRate?: number
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border/60 bg-background/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">Occupancy:</span>
          <span className="font-semibold text-foreground">{entry.value}%</span>
        </div>
      ))}
    </div>
  )
}

export function OccupancyChart({ data, loading, avgRate }: OccupancyChartProps) {
  if (loading) {
    return (
      <Card className="border-border/30 shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const averageRate = avgRate ?? Math.round(data.reduce((s, d) => s + d.rate, 0) / (data.length || 1))

  return (
    <Card className="border-border/30 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Occupancy Trend</CardTitle>
          <span className="text-xs font-medium text-muted-foreground">
            Avg: {averageRate}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c2703a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#c2703a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={averageRate}
                stroke="#c2703a"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                label={{}}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#c2703a"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: '#c2703a',
                  strokeWidth: 2,
                  fill: '#fff',
                }}
                fill="url(#occupancyGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
