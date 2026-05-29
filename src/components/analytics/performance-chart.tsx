'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface PropertyPerformanceData {
  name: string
  monthlyRevenue: number
  occupancyRate: number
  totalUnits: number
  revenueEfficiency?: number
}

interface PerformanceChartProps {
  data: PropertyPerformanceData[]
  loading?: boolean
}

const BAR_COLORS = [
  '#c2703a',
  '#d4956a',
  '#8b6ba5',
  '#6ba3b5',
  '#b8653a',
  '#c4a882',
]

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; payload: PropertyPerformanceData }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  const data = payload[0]?.payload
  return (
    <div className="rounded-lg border border-border/60 bg-background/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 text-sm font-semibold text-foreground">{label}</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Revenue:</span>
          <span className="font-semibold">${data?.monthlyRevenue?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Occupancy:</span>
          <span className="font-semibold">{data?.occupancyRate}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Units:</span>
          <span className="font-semibold">{data?.totalUnits}</span>
        </div>
      </div>
    </div>
  )
}

export function PerformanceChart({ data, loading }: PerformanceChartProps) {
  if (loading) {
    return (
      <Card className="border-border/30 shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const chartData = data
    .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
    .map((d) => ({
      ...d,
      displayName: d.name.length > 16 ? d.name.substring(0, 16) + '…' : d.name,
    }))

  return (
    <Card className="border-border/30 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Property Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.4}
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="displayName"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="monthlyRevenue"
                radius={[0, 6, 6, 0]}
                barSize={24}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
