'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  BookOpen,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { ChartOfAccounts, type Account } from './chart-of-accounts'
import { TransactionList, type Transaction } from './transaction-list'
import { AddAccountDialog } from './add-account-dialog'
import { RecordTransactionDialog } from './record-transaction-dialog'

// ── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_ACCOUNTS: Account[] = [
  { code: '1000', name: 'Cash', type: 'asset', category: 'Current Assets', balance: 125400, isActive: true },
  { code: '1100', name: 'Accounts Receivable', type: 'asset', category: 'Current Assets', balance: 42800, isActive: true },
  { code: '1200', name: 'Security Deposits', type: 'asset', category: 'Current Assets', balance: 36200, isActive: true },
  { code: '1500', name: 'Property & Equipment', type: 'asset', category: 'Fixed Assets', balance: 2450000, isActive: true },
  { code: '2000', name: 'Accounts Payable', type: 'liability', category: 'Current Liabilities', balance: 18500, isActive: true },
  { code: '2100', name: 'Accrued Expenses', type: 'liability', category: 'Current Liabilities', balance: 8200, isActive: true },
  { code: '2200', name: 'Tenant Deposits Held', type: 'liability', category: 'Current Liabilities', balance: 36200, isActive: true },
  { code: '3000', name: "Owner's Equity", type: 'equity', category: 'Equity', balance: 500000, isActive: true },
  { code: '3100', name: 'Retained Earnings', type: 'equity', category: 'Equity', balance: 186200, isActive: true },
  { code: '4000', name: 'Rental Income', type: 'revenue', category: 'Operating Revenue', balance: 512400, isActive: true },
  { code: '4100', name: 'Late Fee Income', type: 'revenue', category: 'Other Revenue', balance: 3800, isActive: true },
  { code: '4200', name: 'Other Income', type: 'revenue', category: 'Other Revenue', balance: 8200, isActive: true },
  { code: '5000', name: 'Maintenance Expenses', type: 'expense', category: 'Operating Expenses', balance: 45600, isActive: true },
  { code: '5100', name: 'Insurance Expenses', type: 'expense', category: 'Operating Expenses', balance: 18000, isActive: true },
  { code: '5200', name: 'Property Taxes', type: 'expense', category: 'Operating Expenses', balance: 62000, isActive: true },
  { code: '5300', name: 'Management Fees', type: 'expense', category: 'Operating Expenses', balance: 24000, isActive: true },
  { code: '5400', name: 'Utilities', type: 'expense', category: 'Operating Expenses', balance: 15800, isActive: true },
]

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2025-03-01', description: 'Rent Payment - Unit 4B', accountCode: '4000', type: 'credit', amount: 2800, status: 'posted', reference: 'PAY-2025-001' },
  { id: 't2', date: '2025-03-01', description: 'Rent Payment - Unit 12A', accountCode: '4000', type: 'credit', amount: 2400, status: 'posted', reference: 'PAY-2025-002' },
  { id: 't3', date: '2025-03-02', description: 'HVAC Repair - CoolBreeze', accountCode: '5000', type: 'debit', amount: 1850, status: 'posted', reference: 'INV-2025-045' },
  { id: 't4', date: '2025-03-03', description: 'Monthly Insurance Premium', accountCode: '5100', type: 'debit', amount: 1500, status: 'posted', reference: 'INS-2025-03' },
  { id: 't5', date: '2025-03-05', description: 'Rent Payment - Unit 7C', accountCode: '4000', type: 'credit', amount: 3200, status: 'pending', reference: 'PAY-2025-003' },
  { id: 't6', date: '2025-03-05', description: 'Cleaning Service - CleanPro', accountCode: '5000', type: 'debit', amount: 650, status: 'posted', reference: 'INV-2025-046' },
  { id: 't7', date: '2025-03-07', description: 'Property Tax Q1 Payment', accountCode: '5200', type: 'debit', amount: 15500, status: 'posted', reference: 'TAX-2025-Q1' },
  { id: 't8', date: '2025-03-10', description: 'Late Fee Collection', accountCode: '4100', type: 'credit', amount: 150, status: 'posted', reference: 'LF-2025-001' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ── Ledger Summary Card ──────────────────────────────────────────────────────

interface LedgerSummaryCardProps {
  title: string
  amount: number
  accounts: Account[]
  color: string
  bgColor: string
  icon: React.ComponentType<{ className?: string }>
}

function LedgerSummaryCard({ title, amount, accounts, color, bgColor, icon: Icon }: LedgerSummaryCardProps) {
  return (
    <Card className="mojave-card border-border/40 bg-card/80 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className={cn('flex size-8 items-center justify-center rounded-lg', bgColor)}>
                <Icon className={cn('size-4', color)} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <p className={cn('text-2xl font-bold tracking-tight', color)}>{formatCurrency(amount)}</p>
            <div className="space-y-1.5">
              {accounts.map((account) => (
                <div key={account.code} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">
                    <span className="font-mono text-[11px] mr-1.5">{account.code}</span>
                    {account.name}
                  </span>
                  <span className="font-mono font-medium text-foreground shrink-0">{formatCurrency(account.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main Accounting Page ─────────────────────────────────────────────────────

export function AccountingPage() {
  const [accounts, setAccounts] = React.useState<Account[]>(INITIAL_ACCOUNTS)
  const [transactions, setTransactions] = React.useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [addAccountOpen, setAddAccountOpen] = React.useState(false)
  const [recordTransactionOpen, setRecordTransactionOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('chart-of-accounts')

  // Build account names map for transaction list
  const accountNames = React.useMemo(() => {
    const map: Record<string, string> = {}
    for (const a of accounts) {
      map[a.code] = a.name
    }
    return map
  }, [accounts])

  // Compute stats
  const totalRevenue = accounts.filter((a) => a.type === 'revenue').reduce((sum, a) => sum + a.balance, 0)
  const totalExpenses = accounts.filter((a) => a.type === 'expense').reduce((sum, a) => sum + a.balance, 0)
  const netIncome = totalRevenue - totalExpenses
  const accountsCount = accounts.length

  // Compute ledger groups
  const ledgerGroups = React.useMemo(() => {
    const groups: Record<string, Account[]> = {}
    const typeOrder: Account['type'][] = ['asset', 'liability', 'equity', 'revenue', 'expense']
    for (const type of typeOrder) {
      const typeAccounts = accounts.filter((a) => a.type === type)
      if (typeAccounts.length > 0) {
        groups[type] = typeAccounts
      }
    }
    return groups
  }, [accounts])

  const ledgerConfig: Record<string, { color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
    asset: { color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40', icon: TrendingUp },
    liability: { color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/40', icon: TrendingDown },
    equity: { color: 'text-sky-700 dark:text-sky-400', bgColor: 'bg-sky-50 dark:bg-sky-950/40', icon: DollarSign },
    revenue: { color: 'text-primary', bgColor: 'bg-primary/10', icon: TrendingUp },
    expense: { color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/40', icon: TrendingDown },
  }

  // Handlers
  const handleAddAccount = (account: {
    code: string
    name: string
    type: Account['type']
    category: string
    description: string
    parentCode: string
    openingBalance: number
  }) => {
    const newAccount: Account = {
      code: account.code,
      name: account.name,
      type: account.type,
      category: account.category,
      balance: account.openingBalance,
      isActive: true,
    }
    setAccounts((prev) => [...prev, newAccount])
  }

  const handleRecordTransaction = (txn: {
    date: string
    description: string
    accountCode: string
    type: 'debit' | 'credit'
    amount: number
    category: string
    reference: string
    notes: string
  }) => {
    const newTxn: Transaction = {
      id: `t${Date.now()}`,
      date: txn.date,
      description: txn.description,
      accountCode: txn.accountCode,
      type: txn.type,
      amount: txn.amount,
      status: 'pending',
      reference: txn.reference || `TXN-${Date.now()}`,
    }
    setTransactions((prev) => [newTxn, ...prev])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Accounting
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Chart of accounts, general ledger, and transaction management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setAddAccountOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Account</span>
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setRecordTransactionOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Record Transaction</span>
            <span className="sm:hidden">Record</span>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold tracking-tight text-primary">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs text-muted-foreground">{accounts.filter((a) => a.type === 'revenue').length} revenue accounts</p>
                </div>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                  <TrendingUp className="size-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold tracking-tight text-red-700 dark:text-red-400">{formatCurrency(totalExpenses)}</p>
                  <p className="text-xs text-muted-foreground">{accounts.filter((a) => a.type === 'expense').length} expense accounts</p>
                </div>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40">
                  <TrendingDown className="size-6 text-red-700 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Net Income</p>
                  <p className={cn(
                    'text-2xl font-bold tracking-tight',
                    netIncome >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                  )}>
                    {formatCurrency(netIncome)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {netIncome >= 0 ? '+' : ''}{((netIncome / totalRevenue) * 100).toFixed(1)}% margin
                  </p>
                </div>
                <div className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-xl',
                  netIncome >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-red-50 dark:bg-red-950/40'
                )}>
                  <DollarSign className={cn(
                    'size-6',
                    netIncome >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Accounts Count</p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">{accountsCount}</p>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] font-medium border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400">
                      {accounts.filter((a) => a.isActive).length} active
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-medium">
                      {transactions.length} txns
                    </Badge>
                  </div>
                </div>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/40">
                  <BookOpen className="size-6 text-sky-700 dark:text-sky-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="chart-of-accounts" className="gap-1.5 text-xs">
            <BookOpen className="size-3.5" />
            Chart of Accounts
          </TabsTrigger>
          <TabsTrigger value="general-ledger" className="gap-1.5 text-xs">
            <DollarSign className="size-3.5" />
            General Ledger
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-1.5 text-xs">
            <TrendingUp className="size-3.5" />
            Transactions
          </TabsTrigger>
        </TabsList>

        {/* Chart of Accounts Tab */}
        <TabsContent value="chart-of-accounts" className="space-y-4 mt-0">
          <ChartOfAccounts accounts={accounts} />
        </TabsContent>

        {/* General Ledger Tab */}
        <TabsContent value="general-ledger" className="space-y-4 mt-0">
          {/* Summary Cards by Account Type */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(ledgerGroups) as [Account['type'], Account[]][]).map(([type, typeAccounts]) => {
              const config = ledgerConfig[type]
              const total = typeAccounts.reduce((sum, a) => sum + a.balance, 0)
              const Icon = config.icon
              return (
                <LedgerSummaryCard
                  key={type}
                  title={type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                  amount={total}
                  accounts={typeAccounts}
                  color={config.color}
                  bgColor={config.bgColor}
                  icon={Icon}
                />
              )
            })}
          </div>

          {/* Accounting Equation */}
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Accounting Equation</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Assets = Liabilities + Equity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-4">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Assets</p>
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                      {formatCurrency(ledgerGroups.asset?.reduce((s, a) => s + a.balance, 0) ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-4">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Liabilities</p>
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-1">
                      {formatCurrency(ledgerGroups.liability?.reduce((s, a) => s + a.balance, 0) ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-sky-50 dark:bg-sky-950/40 p-4">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Equity</p>
                    <p className="text-xl font-bold text-sky-700 dark:text-sky-400 mt-1">
                      {formatCurrency(ledgerGroups.equity?.reduce((s, a) => s + a.balance, 0) ?? 0)}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-center gap-3 text-sm">
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(ledgerGroups.asset?.reduce((s, a) => s + a.balance, 0) ?? 0)}
                  </span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                    {formatCurrency(ledgerGroups.liability?.reduce((s, a) => s + a.balance, 0) ?? 0)}
                  </span>
                  <span className="text-muted-foreground">+</span>
                  <span className="font-mono font-bold text-sky-700 dark:text-sky-400">
                    {formatCurrency(ledgerGroups.equity?.reduce((s, a) => s + a.balance, 0) ?? 0)}
                  </span>
                </div>

                {/* Balance Check */}
                {(() => {
                  const assets = ledgerGroups.asset?.reduce((s, a) => s + a.balance, 0) ?? 0
                  const liabilities = ledgerGroups.liability?.reduce((s, a) => s + a.balance, 0) ?? 0
                  const equity = ledgerGroups.equity?.reduce((s, a) => s + a.balance, 0) ?? 0
                  const balanced = assets === liabilities + equity
                  return (
                    <div className={cn(
                      'flex items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium',
                      balanced
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    )}>
                      <div className={cn(
                        'size-2 rounded-full',
                        balanced ? 'bg-emerald-500' : 'bg-amber-500'
                      )} />
                      {balanced ? 'Books are balanced' : 'Note: Books include net income not yet closed to equity'}
                    </div>
                  )
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Income Statement Summary */}
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Income Statement Summary</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Revenue vs Expenses breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Revenue */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-primary">Revenue</span>
                    <span className="text-sm font-mono font-bold text-primary">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(totalRevenue / Math.max(totalRevenue, totalExpenses)) * 100}%` }}
                    />
                  </div>
                </div>
                {/* Expenses */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">Expenses</span>
                    <span className="text-sm font-mono font-bold text-red-700 dark:text-red-400">{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500 transition-all duration-500"
                      style={{ width: `${(totalExpenses / Math.max(totalRevenue, totalExpenses)) * 100}%` }}
                    />
                  </div>
                </div>
                <Separator />
                {/* Net Income */}
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'text-sm font-semibold',
                    netIncome >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                  )}>
                    Net Income
                  </span>
                  <span className={cn(
                    'text-lg font-mono font-bold',
                    netIncome >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                  )}>
                    {formatCurrency(netIncome)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4 mt-0">
          <TransactionList transactions={transactions} accountNames={accountNames} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddAccountDialog
        open={addAccountOpen}
        onOpenChange={setAddAccountOpen}
        existingAccounts={accounts}
        onAdd={handleAddAccount}
      />
      <RecordTransactionDialog
        open={recordTransactionOpen}
        onOpenChange={setRecordTransactionOpen}
        accounts={accounts}
        onRecord={handleRecordTransaction}
      />
    </motion.div>
  )
}
