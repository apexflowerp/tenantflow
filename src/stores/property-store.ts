import { create } from 'zustand'
import { getApiUrl } from '@/lib/api'

// ── Types ────────────────────────────────────────────────────────────────────

export interface Property {
  id: string
  name: string
  slug: string
  type: string
  address: string
  city: string
  state: string | null
  zipCode: string | null
  country: string
  lat: number | null
  lng: number | null
  description: string | null
  totalUnits: number
  occupiedUnits: number
  floors: number | null
  yearBuilt: number | null
  totalArea: number | null
  image: string | null
  status: string
  workspaceId: string
  createdAt: string
  updatedAt: string

  // Computed / relations
  units?: Unit[]
  occupancyRate?: number
  stats?: PropertyStats
  _count?: PropertyCounts
}

export interface Unit {
  id: string
  unitNumber: string
  propertyId: string
  floor: number | null
  type: string
  bedrooms: number
  bathrooms: number
  area: number | null
  rent: number
  deposit: number | null
  status: string
  amenities: string | null
  image: string | null
  createdAt: string
  updatedAt: string
}

export interface PropertyStats {
  totalUnits: number
  occupiedUnits: number
  vacancyUnits: number
  occupancyRate: number
  monthlyRevenue: number
}

export interface PropertyCounts {
  leases: number
  tickets: number
  documents: number
}

interface PropertyStore {
  // Data
  properties: Property[]
  selectedProperty: Property | null

  // State
  isLoading: boolean
  error: string | null
  lastFetched: number | null

  // Actions
  fetchProperties: () => Promise<void>
  selectProperty: (id: string) => void
  clearSelection: () => void
  reset: () => void
}

// ── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  properties: [],
  selectedProperty: null as Property | null,
  isLoading: false,
  error: null as string | null,
  lastFetched: null as number | null,
}

// ── Store ────────────────────────────────────────────────────────────────────

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  ...initialState,

  fetchProperties: async () => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await fetch(getApiUrl('/api/properties'))

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`)
      }

      const data = await response.json()
      const properties: Property[] = data.properties ?? data ?? []

      set((state) => ({
        properties,
        isLoading: false,
        lastFetched: Date.now(),
        // Preserve selection if the property still exists
        selectedProperty:
          state.selectedProperty && properties.find((p) => p.id === state.selectedProperty!.id)
            ? { ...state.selectedProperty, ...properties.find((p) => p.id === state.selectedProperty!.id)! }
            : null,
      }))
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch properties',
      })
    }
  },

  selectProperty: (id) => {
    const property = get().properties.find((p) => p.id === id) ?? null
    set({ selectedProperty: property })
  },

  clearSelection: () => set({ selectedProperty: null }),

  reset: () => set(initialState),
}))
