import { create } from 'zustand'

export interface ClientData {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string
  website: string | null
  industry: string | null
  companySize: string | null
  taxId: string | null
  status: string
  plan: string
  billingCycle: string
  monthlyFee: number
  setupFee: number
  currency: string
  discountPercent: number
  trialStart: string | null
  trialEnd: string | null
  contractStart: string | null
  contractEnd: string | null
  notes: string | null
  logo: string | null
  primaryColor: string | null
  customDomain: string | null
  maxProperties: number
  maxUsers: number
  maxDevices: number
  features: string | null
  createdAt: string
  updatedAt: string
  workspaces?: any[]
  licenseKeys?: any[]
  invoices?: any[]
}

export interface LicenseKeyData {
  id: string
  key: string
  type: string
  plan: string
  maxDevices: number
  maxUsers: number
  status: string
  activatedAt: string | null
  expiresAt: string | null
  clientId: string
  deviceId: string | null
  createdAt: string
  updatedAt: string
  client?: ClientData
}

export interface InvoiceData {
  id: string
  invoiceNumber: string
  clientId: string
  workspaceId: string | null
  type: string
  status: string
  issueDate: string
  dueDate: string
  paidDate: string | null
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
  paidAmount: number
  currency: string
  notes: string | null
  terms: string | null
  items: string | null
  createdAt: string
  updatedAt: string
  client?: ClientData
}

export interface QuotationData {
  id: string
  quotationNumber: string
  clientId: string
  status: string
  subject: string
  validUntil: string
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
  currency: string
  items: string | null
  notes: string | null
  terms: string | null
  introMessage: string | null
  convertedToInvoice: boolean
  convertedInvoiceId: string | null
  createdAt: string
  updatedAt: string
  client?: ClientData
}

export interface DashboardStats {
  totalClients: number
  activeClients: number
  trialClients: number
  churnedClients: number
  suspendedClients: number
  mrr: number
  arr: number
  revenueByPlan: { plan: string; revenue: number; count: number }[]
  clientGrowth: { month: string; clients: number; revenue: number }[]
  recentClients: ClientData[]
  upcomingRenewals: { clientId: string; companyName: string; contractEnd: string; plan: string; monthlyFee: number }[]
  licenseStats: { total: number; available: number; activated: number; expired: number; revoked: number }
  overdueInvoices: { count: number; total: number }
}

interface OwnerStore {
  clients: ClientData[]
  selectedClient: ClientData | null
  licenseKeys: LicenseKeyData[]
  invoices: InvoiceData[]
  quotations: QuotationData[]
  dashboardStats: DashboardStats | null
  isLoading: boolean
  error: string | null

  fetchClients: () => Promise<void>
  selectClient: (id: string) => void
  clearSelection: () => void
  fetchLicenseKeys: () => Promise<void>
  fetchInvoices: () => Promise<void>
  fetchQuotations: () => Promise<void>
  fetchDashboard: () => Promise<void>
  addClient: (data: Partial<ClientData>) => Promise<void>
  updateClient: (id: string, data: Partial<ClientData>) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  generateLicenseKey: (data: { clientId: string; type: string; plan: string; maxDevices?: number; maxUsers?: number }) => Promise<void>
  createInvoice: (data: Partial<InvoiceData>) => Promise<void>
  updateInvoiceStatus: (id: string, status: string) => Promise<void>
  createQuotation: (data: any) => Promise<void>
  updateQuotationStatus: (id: string, status: string) => Promise<void>
  convertQuotationToInvoice: (id: string) => Promise<void>
}

export const useOwnerStore = create<OwnerStore>((set, get) => ({
  clients: [],
  selectedClient: null,
  licenseKeys: [],
  invoices: [],
  quotations: [],
  dashboardStats: null,
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/owner/clients')
      if (!res.ok) throw new Error('Failed to fetch clients')
      const data = await res.json()
      set({ clients: data.clients || data, isLoading: false })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },

  selectClient: (id: string) => {
    const client = get().clients.find(c => c.id === id) || null
    set({ selectedClient: client })
  },

  clearSelection: () => {
    set({ selectedClient: null })
  },

  fetchLicenseKeys: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/owner/licenses')
      if (!res.ok) throw new Error('Failed to fetch license keys')
      const data = await res.json()
      set({ licenseKeys: data.licenseKeys || data, isLoading: false })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchInvoices: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/owner/invoices')
      if (!res.ok) throw new Error('Failed to fetch invoices')
      const data = await res.json()
      set({ invoices: data.invoices || data, isLoading: false })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchQuotations: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/owner/quotations')
      if (!res.ok) throw new Error('Failed to fetch quotations')
      const data = await res.json()
      set({ quotations: data.quotations || data, isLoading: false })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchDashboard: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/owner/dashboard')
      if (!res.ok) throw new Error('Failed to fetch dashboard stats')
      const data = await res.json()
      set({ dashboardStats: data, isLoading: false })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },

  addClient: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/owner/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to add client')
      await get().fetchClients()
      set({ isLoading: false })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },

  updateClient: async (id, data) => {
    set({ error: null })
    try {
      const res = await fetch(`/api/owner/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update client')
      await get().fetchClients()
      const currentSelected = get().selectedClient
      if (currentSelected?.id === id) {
        const clients = get().clients
        const updated = clients.find(c => c.id === id) || null
        set({ selectedClient: updated })
      }
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  deleteClient: async (id) => {
    set({ error: null })
    try {
      const res = await fetch(`/api/owner/clients/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete client')
      if (get().selectedClient?.id === id) {
        set({ selectedClient: null })
      }
      await get().fetchClients()
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  generateLicenseKey: async (data) => {
    set({ error: null })
    try {
      const res = await fetch('/api/owner/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to generate license key')
      await get().fetchLicenseKeys()
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  createInvoice: async (data) => {
    set({ error: null })
    try {
      const res = await fetch('/api/owner/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create invoice')
      await get().fetchInvoices()
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  updateInvoiceStatus: async (id, status) => {
    set({ error: null })
    try {
      const res = await fetch(`/api/owner/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update invoice status')
      await get().fetchInvoices()
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  createQuotation: async (data) => {
    set({ error: null })
    try {
      const res = await fetch('/api/owner/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create quotation')
      await get().fetchQuotations()
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  updateQuotationStatus: async (id, status) => {
    set({ error: null })
    try {
      const res = await fetch(`/api/owner/quotations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update quotation status')
      await get().fetchQuotations()
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  convertQuotationToInvoice: async (id) => {
    set({ error: null })
    try {
      const res = await fetch(`/api/owner/quotations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted', createInvoice: true }),
      })
      if (!res.ok) throw new Error('Failed to convert quotation to invoice')
      await get().fetchQuotations()
      await get().fetchInvoices()
    } catch (err: any) {
      set({ error: err.message })
    }
  },
}))
