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
  Mail,
  Phone,
  Building2,
  User,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Tenant } from '@/stores/tenant-store'

// ── Extended Tenant Type (API response includes these) ────────────────────────

interface CurrentLease {
  id: string
  propertyId: string
  unitId: string
  tenantId: string
  startDate: string
  endDate: string
  monthlyRent: number
  deposit: number
  status: string
  type: string
  terms: string | null
  workspaceId: string
  createdAt: string
  updatedAt: string
  property: { id: string; name: string }
  unit: { id: string; unitNumber: string; rent: number }
}

interface TenantStats {
  totalPaid: number
  totalOwed: number
  overdueCount: number
  totalPayments: number
  totalTickets: number
  totalMessages: number
}

export interface TenantRow extends Tenant {
  currentLease?: CurrentLease | null
  stats?: TenantStats
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/20'
    case 'inactive':
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
    case 'overdue':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
  }
}

function getLeaseStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/20'
    case 'expiring':
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    case 'expired':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
    case 'terminated':
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
  }
}

function getPaymentStatusBadge(stats?: TenantStats) {
  if (!stats) return <Badge variant="outline" className="text-xs">Unknown</Badge>
  if (stats.overdueCount > 0) {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800 text-xs border">
        Overdue ({stats.overdueCount})
      </Badge>
    )
  }
  if (stats.totalOwed > 0) {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 text-xs border">
        Pending
      </Badge>
    )
  }
  return (
    <Badge className="bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/20 text-xs border">
      Current
    </Badge>
  )
}

// ── Column Definitions ───────────────────────────────────────────────────────

interface TenantTableProps {
  data: TenantRow[]
  onRowClick?: (tenant: TenantRow) => void
  onEdit?: (tenant: TenantRow) => void
  onDelete?: (tenant: TenantRow) => void
  isLoading?: boolean
}

export function TenantTable({ data, onRowClick, onEdit, onDelete, isLoading }: TenantTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const columns = React.useMemo<ColumnDef<TenantRow>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
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
          const tenant = row.original
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border">
                {tenant.avatar ? (
                  <AvatarImage src={tenant.avatar} alt={tenant.name} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-medium">
                  {getInitials(tenant.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm leading-tight">{tenant.name}</span>
                {tenant.company && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {tenant.company}
                  </span>
                )}
              </div>
            </div>
          )
        },
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: ({ column }) => {
          const sorted = column.getIsSorted()
          return (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8"
              onClick={() => column.toggleSorting(sorted === 'asc')}
            >
              Email
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
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {row.getValue('email')}
          </span>
        ),
      },
      {
        id: 'phone',
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => {
          const phone = row.getValue('phone') as string | null
          if (!phone) return <span className="text-muted-foreground">—</span>
          return (
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </span>
          )
        },
      },
      {
        id: 'type',
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.getValue('type') as string
          return (
            <Badge variant="outline" className="text-xs capitalize font-medium">
              {type === 'individual' ? (
                <User className="mr-1 h-3 w-3" />
              ) : (
                <Building2 className="mr-1 h-3 w-3" />
              )}
              {type}
            </Badge>
          )
        },
        filterFn: (row, _columnId, filterValue) => {
          if (filterValue === 'all') return true
          return row.getValue('type') === filterValue
        },
      },
      {
        id: 'property',
        header: 'Property / Unit',
        accessorFn: (row) => row.currentLease?.property?.name ?? '',
        cell: ({ row }) => {
          const lease = row.original.currentLease
          if (!lease) return <span className="text-muted-foreground">No lease</span>
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{lease.property.name}</span>
              <span className="text-xs text-muted-foreground">Unit {lease.unit.unitNumber}</span>
            </div>
          )
        },
      },
      {
        id: 'leaseStatus',
        header: 'Lease',
        accessorFn: (row) => row.currentLease?.status ?? 'none',
        cell: ({ row }) => {
          const lease = row.original.currentLease
          if (!lease) return <span className="text-muted-foreground text-sm">No lease</span>
          return (
            <Badge className={`text-xs border capitalize ${getLeaseStatusColor(lease.status)}`}>
              {lease.status}
            </Badge>
          )
        },
        filterFn: (row, _columnId, filterValue) => {
          if (filterValue === 'all') return true
          const status = row.original.status
          return status === filterValue
        },
      },
      {
        id: 'paymentStatus',
        header: 'Payment',
        cell: ({ row }) => getPaymentStatusBadge(row.original.stats),
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
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRowClick?.(row.original) }}>
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(row.original) }}>
                Edit Tenant
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={(e) => { e.stopPropagation(); onDelete?.(row.original) }}
              >
                Delete Tenant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onRowClick, onEdit, onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 8 },
    },
  })

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border bg-card shadow-sm overflow-hidden">
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
              // Skeleton rows
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
                  onClick={() => onRowClick?.(row.original)}
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
                    <User className="h-8 w-8" />
                    <p className="text-sm font-medium">No tenants found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))
        ) : table.getRowModel().rows.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {table.getRowModel().rows.map((row) => {
              const tenant = row.original
              return (
                <motion.div
                  key={tenant.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border bg-card p-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
                  onClick={() => onRowClick?.(tenant)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border">
                      {tenant.avatar ? (
                        <AvatarImage src={tenant.avatar} alt={tenant.name} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-medium">
                        {getInitials(tenant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{tenant.name}</span>
                        <Badge className={`text-[10px] border capitalize ${getStatusColor(tenant.status)}`}>
                          {tenant.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {tenant.email}
                      </p>
                      {tenant.currentLease && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {tenant.currentLease.property.name} · Unit {tenant.currentLease.unit.unitNumber}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getPaymentStatusBadge(tenant.stats)}
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {tenant.type}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <User className="h-8 w-8" />
            <p className="text-sm font-medium">No tenants found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {table.getRowCount() > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length}
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
