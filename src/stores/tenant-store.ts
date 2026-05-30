import { create } from 'zustand'
import { getApiUrl } from '@/lib/api'

// ── Types ────────────────────────────────────────────────────────────────────

export interface Tenant {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  type: string
  company: string | null
  idNumber: string | null
  emergencyName: string | null
  emergencyPhone: string | null
  moveInDate: string | null
  moveOutDate: string | null
  status: string
  notes: string | null
  workspaceId: string
  createdAt: string
  updatedAt: string

  // Relations
  leases?: Lease[]
  payments?: Payment[]
  tickets?: MaintenanceTicket[]
}

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
  workspaceId: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  leaseId: string
  tenantId: string
  amount: number
  type: string
  status: string
  dueDate: string
  paidDate: string | null
  method: string | null
  reference: string | null
  notes: string | null
  lateFee: number | null
  workspaceId: string
  createdAt: string
  updatedAt: string
}

export interface MaintenanceTicket {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  propertyId: string
  tenantId: string | null
  assignedTo: string | null
  dueDate: string | null
  completedAt: string | null
  image: string | null
  workspaceId: string
  createdAt: string
  updatedAt: string
}

interface TenantStore {
  // Data
  tenants: Tenant[]
  selectedTenant: Tenant | null

  // State
  isLoading: boolean
  error: string | null
  lastFetched: number | null

  // Actions
  fetchTenants: () => Promise<void>
  selectTenant: (id: string) => void
  clearSelection: () => void
  reset: () => void
}

// ── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  tenants: [],
  selectedTenant: null as Tenant | null,
  isLoading: false,
  error: null as string | null,
  lastFetched: null as number | null,
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useTenantStore = create<TenantStore>((set, get) => ({
  ...initialState,

  fetchTenants: async () => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await fetch(getApiUrl('/api/tenants'))

      if (!response.ok) {
        throw new Error(`Failed to fetch tenants: ${response.status}`)
      }

      const data = await response.json()
      const tenants: Tenant[] = data.tenants ?? data ?? []

      set((state) => ({
        tenants,
        isLoading: false,
        lastFetched: Date.now(),
        selectedTenant:
          state.selectedTenant && tenants.find((t) => t.id === state.selectedTenant!.id)
            ? { ...state.selectedTenant, ...tenants.find((t) => t.id === state.selectedTenant!.id)! }
            : null,
      }))
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tenants',
      })
    }
  },

  selectTenant: (id) => {
    const tenant = get().tenants.find((t) => t.id === id) ?? null
    set({ selectedTenant: tenant })
  },

  clearSelection: () => set({ selectedTenant: null }),

  reset: () => set(initialState),
}))
