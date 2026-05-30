import { create } from 'zustand'
import { getApiUrl } from '@/lib/api'

// ── Types ────────────────────────────────────────────────────────────────────

export interface Lease {
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
  renewalDate: string | null
  rentEscalation: number | null
  workspaceId: string
  createdAt: string
  updatedAt: string

  // Relations (populated on detail view)
  property?: {
    id: string
    name: string
    address: string
  } | null
  unit?: {
    id: string
    unitNumber: string
    type: string
  } | null
  tenant?: {
    id: string
    name: string
    email: string
    avatar: string | null
  } | null
}

export type LeaseStatus = 'active' | 'expired' | 'terminated' | 'pending' | 'renewed'

interface LeaseStore {
  // Data
  leases: Lease[]
  selectedLease: Lease | null

  // State
  isLoading: boolean
  error: string | null
  lastFetched: number | null

  // Actions
  fetchLeases: () => Promise<void>
  selectLease: (id: string) => void
  clearSelection: () => void
  reset: () => void
}

// ── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  leases: [],
  selectedLease: null as Lease | null,
  isLoading: false,
  error: null as string | null,
  lastFetched: null as number | null,
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useLeaseStore = create<LeaseStore>((set, get) => ({
  ...initialState,

  fetchLeases: async () => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await fetch(getApiUrl('/api/leases'))

      if (!response.ok) {
        throw new Error(`Failed to fetch leases: ${response.status}`)
      }

      const data = await response.json()
      const leases: Lease[] = data.leases ?? data ?? []

      set((state) => ({
        leases,
        isLoading: false,
        lastFetched: Date.now(),
        selectedLease:
          state.selectedLease && leases.find((l) => l.id === state.selectedLease!.id)
            ? { ...state.selectedLease, ...leases.find((l) => l.id === state.selectedLease!.id)! }
            : null,
      }))
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch leases',
      })
    }
  },

  selectLease: (id) => {
    const lease = get().leases.find((l) => l.id === id) ?? null
    set({ selectedLease: lease })
  },

  clearSelection: () => set({ selectedLease: null }),

  reset: () => set(initialState),
}))
