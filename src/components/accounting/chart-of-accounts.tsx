'use client'

import * as React from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

export interface Account {
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  category: string
  balance: number
  isActive: boolean
}

interface ChartOfAccountsProps {
  accounts: Account[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const TYPE_CONFIG: Record<Account['type'], { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  asset: { label: 'Asset', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40', icon: TrendingUp },
  liability: { label: 'Liability', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/40', icon: TrendingDown },
  equity: { label: 'Equity', color: 'text-sky-700 dark:text-sky-400', bgColor: 'bg-sky-50 dark:bg-sky-950/40', icon: DollarSign },
  revenue: { label: 'Revenue', color: 'text-primary', bgColor: 'bg-primary/10', icon: TrendingUp },
  expense: { label: 'Expense', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/40', icon: TrendingDown },
}

// ── Component ────────────────────────────────────────────────────────────────

export function ChartOfAccounts({ accounts }: ChartOfAccountsProps) {
  const [sortField, setSortField] = React.useState<'code' | 'name' | 'type' | 'balance'>('code')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc')

  const handleSort = (field: 'code' | 'name' | 'type' | 'balance') => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sortedAccounts = React.useMemo(() => {
    const sorted = [...accounts].sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'code':
          cmp = a.code.localeCompare(b.code)
          break
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'type':
          cmp = a.type.localeCompare(b.type)
          break
        case 'balance':
          cmp = a.balance - b.balance
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [accounts, sortField, sortDir])

  // Group by type for visual sections
  const groupedAccounts = React.useMemo(() => {
    const groups: Record<string, Account[]> = {}
    const typeOrder: Account['type'][] = ['asset', 'liability', 'equity', 'revenue', 'expense']
    for (const type of typeOrder) {
      const typeAccounts = sortedAccounts.filter((a) => a.type === type)
      if (typeAccounts.length > 0) {
        groups[type] = typeAccounts
      }
    }
    return groups
  }, [sortedAccounts])

  // Compute totals by type
  const totalsByType = React.useMemo(() => {
    const totals: Record<string, number> = {}
    for (const [type, accts] of Object.entries(groupedAccounts)) {
      totals[type] = accts.reduce((sum, a) => sum + a.balance, 0)
    }
    return totals
  }, [groupedAccounts])

  return (
    <div className="space-y-4">
      {/* Summary by Type */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {(Object.entries(TYPE_CONFIG) as [Account['type'], typeof TYPE_CONFIG[Account['type']]][]).map(([type, config]) => {
          const Icon = config.icon
          const total = totalsByType[type] ?? 0
          const count = groupedAccounts[type]?.length ?? 0
          return (
            <Card key={type} className={cn('mojave-card border-border/40 bg-card/80')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className={cn('flex size-8 items-center justify-center rounded-lg', config.bgColor)}>
                    <Icon className={cn('size-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{config.label}s</p>
                    <p className={cn('text-lg font-bold tracking-tight', config.color)}>{formatCurrency(total)}</p>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{count} account{count !== 1 ? 's' : ''}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Accounts Table */}
      <Card className="mojave-card border-border/40 bg-card/80 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Chart of Accounts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 gap-1 text-xs font-medium" onClick={() => handleSort('code')}>Code<ArrowUpDown className="size-3 text-muted-foreground" /></Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 gap-1 text-xs font-medium" onClick={() => handleSort('name')}>Account Name<ArrowUpDown className="size-3 text-muted-foreground" /></Button>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 gap-1 text-xs font-medium" onClick={() => handleSort('type')}>Type<ArrowUpDown className="size-3 text-muted-foreground" /></Button>
                  </TableHead>
                  <TableHead className="w-[160px]">Category</TableHead>
                  <TableHead className="text-right w-[140px]">
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 gap-1 text-xs font-medium" onClick={() => handleSort('balance')}>Balance<ArrowUpDown className="size-3 text-muted-foreground" /></Button>
                  </TableHead>
                  <TableHead className="w-[90px] text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Object.entries(groupedAccounts) as [Account['type'], Account[]][]).map(([type, typeAccounts]) => (
                  <React.Fragment key={type}>
                    {/* Type Header Row */}
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={6} className="py-2">
                        <div className="flex items-center gap-2">
                          <div className={cn('flex size-6 items-center justify-center rounded-md', TYPE_CONFIG[type].bgColor)}>
                            {(() => {
                              const TypeIcon = TYPE_CONFIG[type].icon
                              return <TypeIcon className={cn('size-3.5', TYPE_CONFIG[type].color)} />
                            })()}
                          </div>
                          <span className={cn('text-sm font-semibold', TYPE_CONFIG[type].color)}>
                            {TYPE_CONFIG[type].label}s
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({typeAccounts.length} accounts · {formatCurrency(totalsByType[type] ?? 0)})
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Account Rows */}
                    {typeAccounts.map((account) => {
                      const typeConf = TYPE_CONFIG[account.type]
                      return (
                        <TableRow key={account.code} className="group cursor-pointer transition-colors hover:bg-accent/50">
                          <TableCell className="font-mono text-sm font-medium">{account.code}</TableCell>
                          <TableCell className="font-medium text-foreground">{account.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={cn('text-[11px] font-medium', typeConf.bgColor, typeConf.color, 'border-0')}
                            >
                              {typeConf.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{account.category}</TableCell>
                          <TableCell className="text-right font-mono font-semibold text-foreground">
                            {formatCurrency(account.balance)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] font-medium',
                                account.isActive
                                  ? 'border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400'
                                  : 'border-muted-foreground/30 text-muted-foreground'
                              )}
                            >
                              {account.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
