/**
 * TenantFlow OS — Zustand Stores
 *
 * Central re-export for all application stores.
 * Import stores from here for consistency:
 *
 *   import { useAppStore, useDashboardStore } from '@/stores'
 */

// Main application shell state
export { useAppStore } from './app-store'
export type { Workspace, Notification, Theme } from './app-store'

// Dashboard analytics
export { useDashboardStore } from './dashboard-store'
export type {
  DashboardStats,
  RecentActivity,
  RevenueDataPoint,
  OccupancyDataPoint,
  PaymentBreakdown,
  TicketBreakdown,
  LeaseBreakdown,
} from './dashboard-store'

// Properties & units
export { usePropertyStore } from './property-store'
export type { Property, Unit, PropertyStats, PropertyCounts } from './property-store'

// Tenants
export { useTenantStore } from './tenant-store'
export type { Tenant } from './tenant-store'

// Leases
export { useLeaseStore } from './lease-store'
export type { Lease, LeaseStatus } from './lease-store'

// Payments
export { usePaymentStore } from './payment-store'
export type { Payment, PaymentStatus, PaymentType } from './payment-store'

// Maintenance tickets
export { useMaintenanceStore } from './maintenance-store'
export type {
  MaintenanceTicket,
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from './maintenance-store'

// AI Chat
export { useChatStore } from './chat-store'
export type { ChatMessage } from './chat-store'

// Owner Management
export { useOwnerStore } from './owner-store'
export type { ClientData, LicenseKeyData, InvoiceData, DashboardStats as OwnerDashboardStats } from './owner-store'

// Authentication
export { useAuthStore } from './auth-store'
