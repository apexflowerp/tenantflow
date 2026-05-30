import { create } from 'zustand'

// ── Types ────────────────────────────────────────────────────────────────────

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

  // Relations (populated on detail view)
  lease?: {
    id: string
    propertyId: string
    unitId: string
    property?: { id: string; name: string }
    unit?: { id: string; unitNumber: string }
  } | null
  tenant?: {
    id: string
    name: string
    email: string
    avatar: string | null
  } | null
}

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled'
export type PaymentType = 'rent' | 'deposit' | 'late_fee' | 'utility' | 'other'

interface PaymentStore {
  // Data
  payments: Payment[]
  selectedPayment: Payment | null

  // State
  isLoading: boolean
  error: string | null
  lastFetched: number | null

  // Actions
  fetchPayments: () => Promise<void>
  selectPayment: (id: string) => void
  clearSelection: () => void
  reset: () => void
}

// ── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  payments: [],
  selectedPayment: null as Payment | null,
  isLoading: false,
  error: null as string | null,
  lastFetched: null as number | null,
}

// ── Store ────────────────────────────────────────────────────────────────────

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  ...initialState,

  fetchPayments: async () => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/payments')

      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.status}`)
      }

      const data = await response.json()
      const payments: Payment[] = data.payments ?? data ?? []

      set((state) => ({
        payments,
        isLoading: false,
        lastFetched: Date.now(),
        selectedPayment:
          state.selectedPayment && payments.find((p) => p.id === state.selectedPayment!.id)
            ? { ...state.selectedPayment, ...payments.find((p) => p.id === state.selectedPayment!.id)! }
            : null,
      }))
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payments',
      })
    }
  },

  selectPayment: (id) => {
    const payment = get().payments.find((p) => p.id === id) ?? null
    set({ selectedPayment: payment })
  },

  clearSelection: () => set({ selectedPayment: null }),

  reset: () => set(initialState),
}))
