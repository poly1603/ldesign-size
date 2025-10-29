/**
 * @ldesign/size-svelte - Utilities
 */

/**
 * Check if code is running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * Safe localStorage access
 */
export const storage = {
  getItem(key: string): string | null {
    if (!isBrowser()) return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },

  setItem(key: string, value: string): void {
    if (!isBrowser()) return
    try {
      localStorage.setItem(key, value)
    } catch {
      // Silent fail
    }
  },

  removeItem(key: string): void {
    if (!isBrowser()) return
    try {
      localStorage.removeItem(key)
    } catch {
      // Silent fail
    }
  }
}


