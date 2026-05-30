import { create } from 'zustand'
import { getApiUrl } from '@/lib/api'

// ── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalProperties: number
  totalUnits: number
  totalTenants: number
  totalLeases: number
  occupiedUnits: number
  occupancyRate: number
  totalRevenue: number
  pendingPayments: number
  overduePayments: number
  openTickets: number
}

export interface RecentActivity {
  id: string
  type: string
  title: string
  description: string | null
  createdAt: string
  user?: {
    id: string
    name: string
    avatar: string | null
  } | null
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  expenses: number
}

export interface OccupancyDataPoint {
  month: string
  rate: number
}

export interface PaymentBreakdown {
  paid: number
  pending: number
  overdue: number
}

export interface TicketBreakdown {
  open: number
  in_progress: number
  scheduled: number
  resolved: number
}

export interface LeaseBreakdown {
  active: number
  expiring: number
  expired: number
}

interface DashboardStore {
  // Data
  stats: DashboardStats | null
  recentActivities: RecentActivity[]
  revenueData: RevenueDataPoint[]
  occupancyData: OccupancyDataPoint[]
  paymentBreakdown: PaymentBreakdown | null
  ticketBreakdown: TicketBreakdown | null
  leaseBreakdown: LeaseBreakdown | null

  // State
  isLoading: boolean
  error: string | null
  lastFetched: number | null

  // Actions
  fetchDashboardData: () => Promise<void>
  reset: () => void
}

// ── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  stats: null,
  recentActivities: [],
  revenueData: [],
  occupancyData: [],
  paymentBreakdown: null,
  ticketBreakdown: null,
  leaseBreakdown: null,
  isLoading: false,
  error: null,
  lastFetched: null,
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  ...initialState,

  fetchDashboardData: async () => {
    // Avoid duplicate requests
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await fetch(getApiUrl('/api/dashboard'))

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }

      const data = await response.json()

      set({
        stats: data.stats ?? null,
        recentActivities: data.recentActivities ?? [],
        revenueData: data.revenueData ?? [],
        occupancyData: data.occupancyData ?? [],
        paymentBreakdown: data.paymentBreakdown ?? null,
        ticketBreakdown: data.ticketBreakdown ?? null,
        leaseBreakdown: data.leaseBreakdown ?? null,
        isLoading: false,
        lastFetched: Date.now(),
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      })
    }
  },

  reset: () => set(initialState),
}))
