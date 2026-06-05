// ═══════════════════════════════════════════════════════════════════════════════
// TenantFlow OS — Authenticated API Client
// ═══════════════════════════════════════════════════════════════════════════════
// Utility for making authenticated API calls with session token.
// All workspace-scoped API routes now require a Bearer token.
// This helper reads the token from the auth store and attaches it to requests.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Make an authenticated fetch request.
 * Automatically includes the session token from localStorage.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken()

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Set Content-Type for JSON bodies if not already set
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * Get the stored session token from localStorage.
 */
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem('tenantflow-auth')
    if (!raw) return null
    const data = JSON.parse(raw)
    return data.sessionToken || null
  } catch {
    return null
  }
}

/**
 * Authenticated GET request
 */
export async function authGet(url: string): Promise<Response> {
  return authFetch(url, { method: 'GET' })
}

/**
 * Authenticated POST request
 */
export async function authPost(url: string, body: unknown): Promise<Response> {
  return authFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * Authenticated PATCH request
 */
export async function authPatch(url: string, body: unknown): Promise<Response> {
  return authFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

/**
 * Authenticated DELETE request
 */
export async function authDelete(url: string, body?: unknown): Promise<Response> {
  return authFetch(url, {
    method: 'DELETE',
    body: body ? JSON.stringify(body) : undefined,
  })
}
