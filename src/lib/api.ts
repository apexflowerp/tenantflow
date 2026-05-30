import { useAuthStore } from '@/stores/auth-store'

/**
 * Build an API URL with the current user's clientId for multi-tenant DB resolution.
 * Use this for ALL API calls that need to access tenant-specific data.
 * 
 * Example:
 *   getApiUrl('/api/properties') → '/api/properties?clientId=abc123'
 *   getApiUrl('/api/properties?page=1') → '/api/properties?page=1&clientId=abc123'
 */
export function getApiUrl(path: string): string {
  if (typeof window === 'undefined') return path
  
  const clientId = useAuthStore.getState().currentUser?.clientId
  if (clientId) {
    const separator = path.includes('?') ? '&' : '?'
    return `${path}${separator}clientId=${clientId}`
  }
  return path
}
