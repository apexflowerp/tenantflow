'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { useAuthStore } from '@/stores/auth-store'

// ── Lazy-loaded pages ────────────────────────────────────────────────────────
// LoginPage and AuthenticatedApp are dynamically imported so that turbopack
// does not compile the entire authenticated shell (40+ icons, MODULES config,
// module registry, sidebar, etc.) when the user is on the login screen.

const LoginPage = dynamic(
  () => import('@/components/auth/login-page').then(m => ({ default: m.LoginPage })),
  { ssr: false }
)

const AuthenticatedApp = dynamic(
  () => import('@/components/authenticated-app').then(m => ({ default: m.AuthenticatedApp })),
  { ssr: false }
)

// ── Multi-tenant API helper ──────────────────────────────────────────────────
export function buildTenantApiUrl(path: string, clientId: string | null): string {
  if (!clientId) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}clientId=${clientId}`
}

// ── Auth Gate ────────────────────────────────────────────────────────────────

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hydrate } = useAuthStore()
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    _hydrate()
    setHydrated(true)
  }, [_hydrate])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="size-5 animate-pulse rounded-full bg-muted-foreground/30" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <>{children}</>
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <AuthGate>
      <AuthenticatedApp />
    </AuthGate>
  )
}
