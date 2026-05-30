'use client'

import * as React from 'react'
import {
  Search,
  Filter,
  ArrowUpDown,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string
  date: string
  description: string
  accountCode: string
  type: 'debit' | 'credit'
  amount: number
  status: 'posted' | 'pending' | 'void'
  reference: string
}

interface TransactionListProps {
  transactions: Transaction[]
  accountNames: Record<string, string>
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

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const STATUS_CONFIG: Record<Transaction['status'], { label: string; color: string; bgColor: string }> = {
  posted: { label: 'Posted', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40' },
  pending: { label: 'Pending', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/40' },
  void: { label: 'Void', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/40' },
}

// ── Component ────────────────────────────────────────────────────────────────

export function TransactionList({ transactions, accountNames }: TransactionListProps) {
  const [search, setSearch] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'debit' | 'credit'>('all')
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'posted' | 'pending' | 'void'>('all')
  const [sortField, setSortField] = React.useState<'date' | 'amount' | 'description'>('date')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  const handleSort = (field: 'date' | 'amount' | 'description') => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const filteredTransactions = React.useMemo(() => {
    let filtered = [...transactions]

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q) ||
          t.accountCode.includes(q) ||
          (accountNames[t.accountCode] ?? '').toLowerCase().includes(q)
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === typeFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'date':
          cmp = a.date.localeCompare(b.date)
          break
        case 'amount':
          cmp = a.amount - b.amount
          break
        case 'description':
          cmp = a.description.localeCompare(b.description)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return filtered
  }, [transactions, search, typeFilter, statusFilter, sortField, sortDir, accountNames])

  // Summary stats
  const totalDebits = transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const totalCredits = transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const postedCount = transactions.filter((t) => t.status === 'posted').length
  const pendingCount = transactions.filter((t) => t.status === 'pending').length

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Transactions</p>
            <p className="text-lg font-bold tracking-tight text-foreground">{transactions.length}</p>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Debits</p>
            <p className="text-lg font-bold tracking-tight text-red-700 dark:text-red-400">{formatCurrency(totalDebits)}</p>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Credits</p>
            <p className="text-lg font-bold tracking-tight text-emerald-700 dark:text-emerald-400">{formatCurrency(totalCredits)}</p>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-foreground">{postedCount} posted</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{pendingCount} pending</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="mojave-card border-border/40 bg-card/80">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions, references, accounts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as 'all' | 'debit' | 'credit')}>
                <SelectTrigger className="w-[130px] h-9">
                  <Filter className="size-3.5 mr-1 text-muted-foreground" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'posted' | 'pending' | 'void')}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="posted">Posted</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="mojave-card border-border/40 bg-card/80 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Transactions</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {filteredTransactions.length} of {transactions.length} transactions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[110px]">
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 gap-1 text-xs font-medium" onClick={() => handleSort('date')}>Date<ArrowUpDown className="size-3 text-muted-foreground" /></Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 gap-1 text-xs font-medium" onClick={() => handleSort('description')}>Description<ArrowUpDown className="size-3 text-muted-foreground" /></Button>
                  </TableHead>
                  <TableHead className="w-[160px]">Account</TableHead>
                  <TableHead className="w-[90px] text-center">Type</TableHead>
                  <TableHead className="text-right w-[120px]">
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 gap-1 text-xs font-medium" onClick={() => handleSort('amount')}>Amount<ArrowUpDown className="size-3 text-muted-foreground" /></Button>
                  </TableHead>
                  <TableHead className="w-[90px] text-center">Status</TableHead>
                  <TableHead className="w-[130px]">Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="size-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">No transactions found</p>
                        <p className="text-xs text-muted-foreground/60">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((txn) => {
                    const statusConf = STATUS_CONFIG[txn.status]
                    const accountName = accountNames[txn.accountCode] ?? txn.accountCode
                    return (
                      <TableRow key={txn.id} className="group cursor-pointer transition-colors hover:bg-accent/50">
                        <TableCell className="text-sm text-muted-foreground">{formatDate(txn.date)}</TableCell>
                        <TableCell className="font-medium text-foreground">{txn.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{accountName}</span>
                            <span className="text-[11px] text-muted-foreground font-mono">{txn.accountCode}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-[11px] font-semibold border-0',
                              txn.type === 'debit'
                                ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            )}
                          >
                            {txn.type === 'debit' ? 'DR' : 'CR'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          <span className={cn(
                            txn.type === 'debit' ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
                          )}>
                            {txn.type === 'debit' ? '-' : '+'}{formatCurrency(txn.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className={cn('text-[10px] font-medium border-0', statusConf.bgColor, statusConf.color)}
                          >
                            {statusConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">{txn.reference}</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
