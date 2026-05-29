'use client'

import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
  CreditCard,
  Banknote,
  Building2,
  Wifi,
  Receipt,
  Eye,
  Send,
  X,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'

import { Badge } from '@/components/ui/badge'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type { Payment } from '@/stores/payment-store'

// ── Extended Payment Row ────────────────────────────────────────────────────

export interface PaymentRow extends Payment {
  tenantName?: string
  propertyName?: string
  unitNumber?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

function getStatusColor(status: string) {
  switch (status) {
    case 'paid':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    case 'overdue':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
    case 'partial':
      return 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800'
    case 'cancelled':
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case 'paid':
      return 'bg-emerald-500'
    case 'pending':
      return 'bg-amber-500'
    case 'overdue':
      return 'bg-red-500'
    case 'partial':
      return 'bg-sky-500'
    default:
      return 'bg-gray-400'
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'rent':
      return Building2
    case 'utility':
      return Wifi
    case 'deposit':
      return Banknote
    case 'late_fee':
      return Receipt
    default:
      return CreditCard
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'rent':
      return 'Rent'
    case 'utility':
      return 'Utility'
    case 'deposit':
      return 'Deposit'
    case 'late_fee':
      return 'Late Fee'
    case 'other':
      return 'Other'
    default:
      return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

function getMethodLabel(method: string | null) {
  if (!method) return '—'
  switch (method) {
    case 'cash':
      return 'Cash'
    case 'check':
      return 'Check'
    case 'bank_transfer':
      return 'Bank Transfer'
    case 'online':
      return 'Online'
    default:
      return method.charAt(0).toUpperCase() + method.slice(1)
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

// ── Column Definitions ───────────────────────────────────────────────────────

interface PaymentTableProps {
  data: PaymentRow[]
  onViewPayment?: (payment: PaymentRow) => void
  onSendReminder?: (payment: PaymentRow) => void
  isLoading?: boolean
}

export function PaymentTable({ data, onViewPayment, onSendReminder, isLoading }: PaymentTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'dueDate', desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')

  // Apply filters
  const filteredData = React.useMemo(() => {
    let result = data

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      result = result.filter((p) => p.type === typeFilter)
    }

    if (globalFilter) {
      const search = globalFilter.toLowerCase()
      result = result.filter(
        (p) =>
          p.tenantName?.toLowerCase().includes(search) ||
          p.propertyName?.toLowerCase().includes(search) ||
          p.unitNumber?.toLowerCase().includes(search) ||
          p.reference?.toLowerCase().includes(search)
      )
    }

    return result
  }, [data, statusFilter, typeFilter, globalFilter])

  const columns = React.useMemo<ColumnDef<PaymentRow>[]>(
    () => [
      {
        id: 'tenant',
        accessorFn: (row) => row.tenantName ?? '',
        header: ({ column }) => {
          const sorted = column.getIsSorted()
          return (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              onClick={() => column.toggleSorting(sorted === 'asc')}
            >
              Tenant
              {sorted === 'asc' ? (
                <ArrowUp className="ml-1 h-3.5 w-3.5" />
              ) : sorted === 'desc' ? (
                <ArrowDown className="ml-1 h-3.5 w-3.5" />
              ) : (
                <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => {
          const name = row.original.tenantName
          return (
            <div className="flex flex-col">
              <span className="font-medium text-sm leading-tight">{name || 'Unknown'}</span>
            </div>
          )
        },
      },
      {
        id: 'property',
        accessorFn: (row) => row.propertyName ?? '',
        header: 'Property / Unit',
        cell: ({ row }) => {
          const property = row.original.propertyName
          const unit = row.original.unitNumber
          if (!property) return <span className="text-muted-foreground">—</span>
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{property}</span>
              {unit && <span className="text-xs text-muted-foreground">Unit {unit}</span>}
            </div>
          )
        },
      },
      {
        id: 'type',
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.getValue('type') as string
          const TypeIcon = getTypeIcon(type)
          return (
            <div className="flex items-center gap-1.5">
              <TypeIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm">{getTypeLabel(type)}</span>
            </div>
          )
        },
      },
      {
        id: 'amount',
        accessorKey: 'amount',
        header: ({ column }) => {
          const sorted = column.getIsSorted()
          return (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              onClick={() => column.toggleSorting(sorted === 'asc')}
            >
              Amount
              {sorted === 'asc' ? (
                <ArrowUp className="ml-1 h-3.5 w-3.5" />
              ) : sorted === 'desc' ? (
                <ArrowDown className="ml-1 h-3.5 w-3.5" />
              ) : (
                <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => {
          const amount = row.getValue('amount') as number
          const lateFee = row.original.lateFee
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-sm tabular-nums">{formatCurrency(amount)}</span>
              {lateFee && lateFee > 0 && (
                <span className="text-xs text-red-600 dark:text-red-400">
                  +{formatCurrency(lateFee)} fee
                </span>
              )}
            </div>
          )
        },
      },
      {
        id: 'dueDate',
        accessorKey: 'dueDate',
        header: ({ column }) => {
          const sorted = column.getIsSorted()
          return (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              onClick={() => column.toggleSorting(sorted === 'asc')}
            >
              Due Date
              {sorted === 'asc' ? (
                <ArrowUp className="ml-1 h-3.5 w-3.5" />
              ) : sorted === 'desc' ? (
                <ArrowDown className="ml-1 h-3.5 w-3.5" />
              ) : (
                <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => (
          <span className="text-sm tabular-nums">{formatDate(row.getValue('dueDate') as string)}</span>
        ),
      },
      {
        id: 'paidDate',
        accessorKey: 'paidDate',
        header: 'Paid Date',
        cell: ({ row }) => (
          <span className="text-sm tabular-nums text-muted-foreground">
            {formatDate(row.getValue('paidDate') as string | null)}
          </span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }) => {
          const sorted = column.getIsSorted()
          return (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              onClick={() => column.toggleSorting(sorted === 'asc')}
            >
              Status
              {sorted === 'asc' ? (
                <ArrowUp className="ml-1 h-3.5 w-3.5" />
              ) : sorted === 'desc' ? (
                <ArrowDown className="ml-1 h-3.5 w-3.5" />
              ) : (
                <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => {
          const status = row.getValue('status') as string
          return (
            <Badge className={`text-xs border capitalize gap-1.5 ${getStatusColor(status)}`}>
              <span className={`size-1.5 rounded-full ${getStatusDot(status)}`} />
              {status}
            </Badge>
          )
        },
      },
      {
        id: 'method',
        accessorKey: 'method',
        header: 'Method',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {getMethodLabel(row.getValue('method') as string | null)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewPayment?.(row.original) }}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {row.original.status !== 'paid' && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSendReminder?.(row.original) }}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reminder
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onViewPayment, onSendReminder]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || globalFilter !== ''

  const clearFilters = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setGlobalFilter('')
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tenant, property..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger size="sm" className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger size="sm" className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="late_fee">Late Fee</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-1 text-muted-foreground">
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-11 text-xs font-semibold uppercase tracking-wider">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className={i % 2 === 1 ? 'bg-muted/20' : ''}>
                  {Array.from({ length: columns.length }).map((_, j) => (
                    <TableCell key={j} className="h-14">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/60 ${i % 2 === 1 ? 'bg-muted/20' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-8 w-8" />
                    <p className="text-sm font-medium">No payments found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile / Tablet Card List */}
      <div className="lg:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
              </div>
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))
        ) : table.getRowModel().rows.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {table.getRowModel().rows.map((row) => {
              const payment = row.original
              const TypeIcon = getTypeIcon(payment.type)
              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-sm">{payment.tenantName || 'Unknown'}</span>
                      <p className="text-xs text-muted-foreground">
                        {payment.propertyName}{payment.unitNumber ? ` · Unit ${payment.unitNumber}` : ''}
                      </p>
                    </div>
                    <Badge className={`text-xs border capitalize gap-1 ${getStatusColor(payment.status)}`}>
                      <span className={`size-1.5 rounded-full ${getStatusDot(payment.status)}`} />
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <TypeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{getTypeLabel(payment.type)}</span>
                    </div>
                    <span className="font-semibold text-sm tabular-nums">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>Due: {formatDate(payment.dueDate)}</span>
                    {payment.paidDate && <span>Paid: {formatDate(payment.paidDate)}</span>}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <CreditCard className="h-8 w-8" />
            <p className="text-sm font-medium">No payments found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && table.getRowCount() > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              filteredData.length
            )}{' '}
            of {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm tabular-nums">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
