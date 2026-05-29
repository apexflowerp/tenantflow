import { create } from 'zustand'

// ── Types ────────────────────────────────────────────────────────────────────

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

  // Relations (populated on detail view)
  property?: {
    id: string
    name: string
    address: string
  } | null
  tenant?: {
    id: string
    name: string
    email: string
    avatar: string | null
  } | null
}

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketCategory = 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'appliance' | 'pest' | 'general'

interface MaintenanceStore {
  // Data
  tickets: MaintenanceTicket[]
  selectedTicket: MaintenanceTicket | null

  // State
  isLoading: boolean
  error: string | null
  lastFetched: number | null

  // Actions
  fetchTickets: () => Promise<void>
  selectTicket: (id: string) => void
  clearSelection: () => void
  reset: () => void
}

// ── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  tickets: [],
  selectedTicket: null as MaintenanceTicket | null,
  isLoading: false,
  error: null as string | null,
  lastFetched: null as number | null,
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  ...initialState,

  fetchTickets: async () => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/maintenance')

      if (!response.ok) {
        throw new Error(`Failed to fetch maintenance tickets: ${response.status}`)
      }

      const data = await response.json()
      const tickets: MaintenanceTicket[] = data.tickets ?? data ?? []

      set((state) => ({
        tickets,
        isLoading: false,
        lastFetched: Date.now(),
        selectedTicket:
          state.selectedTicket && tickets.find((t) => t.id === state.selectedTicket!.id)
            ? { ...state.selectedTicket, ...tickets.find((t) => t.id === state.selectedTicket!.id)! }
            : null,
      }))
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch maintenance tickets',
      })
    }
  },

  selectTicket: (id) => {
    const ticket = get().tickets.find((t) => t.id === id) ?? null
    set({ selectedTicket: ticket })
  },

  clearSelection: () => set({ selectedTicket: null }),

  reset: () => set(initialState),
}))
