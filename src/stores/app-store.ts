import { create } from 'zustand'

// ── Types ────────────────────────────────────────────────────────────────────

export interface Workspace {
  id: string
  name: string
  slug: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

export type Theme = 'light' | 'dark' | 'system'

interface AppStore {
  // Navigation
  activeModule: string
  setActiveModule: (module: string) => void

  // Sidebar
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Command palette
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void

  // Current workspace
  currentWorkspace: Workspace | null
  setCurrentWorkspace: (workspace: Workspace | null) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  unreadCount: () => number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const generateId = () =>
  Math.random().toString(36).substring(2, 11) + Date.now().toString(36)

// ── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>((set, get) => ({
  // Navigation
  activeModule: 'owner',
  setActiveModule: (module) => set({ activeModule: module }),

  // Sidebar — defaults to open on desktop, closed on mobile
  sidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Command palette
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  // Theme
  theme: 'system',
  setTheme: (theme) => {
    set({ theme })
    // Persist theme preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('tenantflow-theme', theme)

      // Apply theme to document
      const root = document.documentElement
      root.classList.remove('light', 'dark')

      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.add(systemDark ? 'dark' : 'light')
      } else {
        root.classList.add(theme)
      }
    }
  },

  // Current workspace
  currentWorkspace: null,
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

  // Notifications
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: generateId(),
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}))
