import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Mask a serial key so only the prefix and last segment are visible.
 *  e.g. "TFOW-OWNR-180H-XK9Z" → "TFOW-****-****-XK9Z"
 *  Used to prevent full serial key exposure in API responses and localStorage. */
export function maskSerialKey(key: string): string {
  if (!key) return ''
  const parts = key.split('-')
  if (parts.length < 3) return key.slice(0, 2) + '****'
  return parts
    .map((part, i) => (i === 0 || i === parts.length - 1 ? part : '****'))
    .join('-')
}
