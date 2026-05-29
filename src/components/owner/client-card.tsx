'use client'

import * as React from 'react'
import {
  Building2, Mail, Phone, DollarSign, Calendar,
  MoreHorizontal, Eye, Pencil, Ban, FileText,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ClientData } from '@/stores/owner-store'

const PLAN_COLORS: Record<string, string> = {
  starter: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  professional: 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary',
  business: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  enterprise: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary',
  trial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  churned: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const PLAN_DOT_COLORS: Record<string, string> = {
  starter: 'bg-gray-400',
  professional: 'bg-primary',
  business: 'bg-amber-500',
  enterprise: 'bg-violet-500',
}

const STATUS_DOT_COLORS: Record<string, string> = {
  active: 'bg-primary',
  trial: 'bg-amber-500',
  suspended: 'bg-red-500',
  churned: 'bg-gray-400',
}

interface ClientCardProps {
  client: ClientData
  onSelect: () => void
}

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ClientCard({ client, onSelect }: ClientCardProps) {
  const initials = client.companyName
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <Card
      className="border-border/30 shadow-sm hover:shadow-md transition-all cursor-pointer group"
      onClick={onSelect}
    >
      <CardContent className="p-5">
        {/* Header: Logo + Name + Actions */}
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm font-bold shadow-sm">
            {client.logo ? (
              <img src={client.logo} alt={client.companyName} className="size-11 rounded-xl object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold truncate group-hover:text-primary dark:group-hover:text-primary transition-colors">
                {client.companyName}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{client.contactName}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="size-8 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect() }}>
                <Eye className="size-4 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Pencil className="size-4 mr-2" /> Edit Client
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <FileText className="size-4 mr-2" /> Generate Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => e.stopPropagation()}>
                <Ban className="size-4 mr-2" /> Suspend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className={`text-[10px] capitalize ${PLAN_COLORS[client.plan] || ''}`}>
            <span className={`size-1.5 rounded-full mr-1.5 ${PLAN_DOT_COLORS[client.plan] || 'bg-gray-400'}`} />
            {client.plan}
          </Badge>
          <Badge variant="secondary" className={`text-[10px] capitalize ${STATUS_COLORS[client.status] || ''}`}>
            <span className={`size-1.5 rounded-full mr-1.5 ${STATUS_DOT_COLORS[client.status] || 'bg-gray-400'}`} />
            {client.status}
          </Badge>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="size-3.5" />
              Monthly Fee
            </span>
            <span className="font-semibold">{formatCurrency(client.monthlyFee)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Billing
            </span>
            <span className="capitalize text-sm">{client.billingCycle}</span>
          </div>
          {client.contractStart && client.contractEnd && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Contract
              </span>
              <span className="text-xs">{formatDate(client.contractStart)} — {formatDate(client.contractEnd)}</span>
            </div>
          )}
        </div>

        {/* Contact Footer */}
        <div className="mt-4 pt-3 border-t border-border/30 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 truncate">
            <Mail className="size-3" />
            {client.email}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
