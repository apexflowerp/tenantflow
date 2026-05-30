'use client'

import { create } from 'zustand'

// ── Types ────────────────────────────────────────────────────────────────────

interface CurrentUser {
  id: string
  name: string
  email: string
  role: string
  workspaceId: string
}

interface CurrentDevice {
  id: string
  serialKey: string
  deviceName: string
  status: string
}

interface AuthStore {
  // State
  isAuthenticated: boolean
  isDeviceActivated: boolean
  requiresActivation: boolean
  currentUser: CurrentUser | null
  currentDevice: CurrentDevice | null
  loginMethod: 'password' | 'demo' | null
  isViewOnly: boolean
  sessionToken: string | null

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  demoLogin: () => Promise<boolean>
  activateDevice: (serialKey: string) => Promise<boolean>
  logout: () => void
  checkDeviceStatus: () => Promise<void>

  // Internal
  _hydrate: () => void
}

// ── Persistence helpers ──────────────────────────────────────────────────────

const STORAGE_KEY = 'tenantflow-auth'

function persistState(state: Partial<AuthStore>) {
  if (typeof window === 'undefined') return
  const data = {
    isAuthenticated: state.isAuthenticated,
    isDeviceActivated: state.isDeviceActivated,
    requiresActivation: state.requiresActivation,
    currentUser: state.currentUser,
    currentDevice: state.currentDevice,
    loginMethod: state.loginMethod,
    isViewOnly: state.isViewOnly,
    sessionToken: state.sessionToken,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadState(): Partial<AuthStore> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function clearState() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  isDeviceActivated: false,
  requiresActivation: true,
  currentUser: null,
  currentDevice: null,
  loginMethod: null,
  isViewOnly: false,
  sessionToken: null,

  // Hydrate from localStorage on mount
  _hydrate: () => {
    const saved = loadState()
    if (saved) {
      set({
        isAuthenticated: saved.isAuthenticated ?? false,
        isDeviceActivated: saved.isDeviceActivated ?? false,
        requiresActivation: saved.requiresActivation ?? true,
        currentUser: saved.currentUser ?? null,
        currentDevice: saved.currentDevice ?? null,
        loginMethod: saved.loginMethod ?? null,
        isViewOnly: saved.isViewOnly ?? false,
        sessionToken: saved.sessionToken ?? null,
      })
    }
  },

  // Login with email/password
  login: async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        console.error('Login failed:', data.error)
        return false
      }

      const data = await res.json()
      const newState = {
        isAuthenticated: true,
        currentUser: data.user,
        sessionToken: data.token,
        loginMethod: 'password' as const,
        isViewOnly: false,
      }

      set(newState)
      persistState({ ...get(), ...newState })
      return true
    } catch (err) {
      console.error('Login error:', err)
      return false
    }
  },

  // Demo login — view-only access
  demoLogin: async () => {
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const data = await res.json()
        console.error('Demo login failed:', data.error)
        return false
      }

      const data = await res.json()
      const newState = {
        isAuthenticated: true,
        isDeviceActivated: true,
        requiresActivation: false,
        currentUser: data.user,
        currentDevice: data.device ?? null,
        sessionToken: data.token,
        loginMethod: 'demo' as const,
        isViewOnly: true,
      }

      set(newState)
      persistState({ ...get(), ...newState })
      return true
    } catch (err) {
      console.error('Demo login error:', err)
      return false
    }
  },

  // Activate device with serial key
  activateDevice: async (serialKey: string) => {
    try {
      const res = await fetch('/api/auth/device/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serialKey }),
      })

      if (!res.ok) {
        const data = await res.json()
        console.error('Device activation failed:', data.error)
        return false
      }

      const data = await res.json()
      const newState = {
        isDeviceActivated: data.status === 'active' || data.status === 'activated',
        requiresActivation: !(data.status === 'active' || data.status === 'activated'),
        currentDevice: {
          id: data.id,
          serialKey: data.serialKey,
          deviceName: data.deviceName ?? 'Unknown Device',
          status: data.status,
        },
      }

      set(newState)
      persistState({ ...get(), ...newState })
      return newState.isDeviceActivated
    } catch (err) {
      console.error('Device activation error:', err)
      return false
    }
  },

  // Logout
  logout: () => {
    const newState = {
      isAuthenticated: false,
      isDeviceActivated: false,
      requiresActivation: true,
      currentUser: null,
      currentDevice: null,
      loginMethod: null,
      isViewOnly: false,
      sessionToken: null,
    }
    set(newState)
    clearState()
  },

  // Check device status
  checkDeviceStatus: async () => {
    try {
      const { currentDevice } = get()
      if (!currentDevice) {
        set({ requiresActivation: true, isDeviceActivated: false })
        return
      }

      const res = await fetch(`/api/auth/device/status?deviceId=${currentDevice.id}`)
      if (!res.ok) {
        set({ requiresActivation: true, isDeviceActivated: false })
        return
      }

      const data = await res.json()
      const activated = data.status === 'active' || data.activated === true
      const newState = {
        isDeviceActivated: activated,
        requiresActivation: !activated,
      }

      set(newState)
      persistState({ ...get(), ...newState })
    } catch {
      set({ requiresActivation: true, isDeviceActivated: false })
    }
  },
}))
