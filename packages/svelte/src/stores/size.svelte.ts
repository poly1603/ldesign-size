/**
 * @ldesign/size-svelte - Size Store (Svelte 5 Runes)
 * 
 * 使用 Svelte 5 runes 创建响应式尺寸管理 store
 */

import { SizeManager, type SizeConfig, type SizePreset } from '@ldesign/size-core'

export interface SizeStoreOptions {
  /**
   * Default preset to apply
   * @default 'default'
   */
  defaultPreset?: string

  /**
   * Custom presets
   */
  presets?: SizePreset[]

  /**
   * Storage key for persistence
   * @default 'ldesign-size'
   */
  storageKey?: string

  /**
   * Existing SizeManager instance (optional)
   */
  manager?: SizeManager
}

export interface SizeStore {
  /**
   * Current size configuration (reactive)
   */
  readonly config: SizeConfig

  /**
   * Current preset name (reactive)
   */
  readonly currentPreset: string

  /**
   * Available presets (reactive)
   */
  readonly presets: SizePreset[]

  /**
   * Apply a preset
   */
  applyPreset: (name: string) => void

  /**
   * Set base size
   */
  setBaseSize: (size: number) => void

  /**
   * Set configuration
   */
  setConfig: (config: Partial<SizeConfig>) => void

  /**
   * Get the underlying SizeManager instance
   */
  getManager: () => SizeManager

  /**
   * Destroy the store and clean up resources
   */
  destroy: () => void
}

/**
 * Create a reactive size store using Svelte 5 runes
 * 
 * @example
 * ```ts
 * import { createSizeStore } from '@ldesign/size-svelte'
 * 
 * const sizeStore = createSizeStore({
 *   defaultPreset: 'medium',
 *   storageKey: 'my-app-size'
 * })
 * 
 * // In component:
 * <script>
 *   const size = createSizeStore()
 *   
 *   function changeSize() {
 *     size.applyPreset('large')
 *   }
 * </script>
 * 
 * <p>Current: {size.currentPreset}</p>
 * <p>Base size: {size.config.baseSize}px</p>
 * ```
 */
export function createSizeStore(options: SizeStoreOptions = {}): SizeStore {
  // Create or use existing manager
  const manager = options.manager || new SizeManager({
    presets: options.presets,
    storageKey: options.storageKey
  })

  // Apply default preset
  if (options.defaultPreset && !options.manager) {
    manager.applyPreset(options.defaultPreset)
  }

  // Create reactive state using Svelte 5 runes
  let config = $state(manager.getConfig())
  let currentPreset = $state(manager.getCurrentPreset())
  let presets = $state(manager.getPresets())

  // Subscribe to manager changes
  const unsubscribe = manager.subscribe((newConfig) => {
    config = newConfig
    currentPreset = manager.getCurrentPreset()
    presets = manager.getPresets()
  })

  // Store API
  const store: SizeStore = {
    get config() {
      return config
    },

    get currentPreset() {
      return currentPreset
    },

    get presets() {
      return presets
    },

    applyPreset(name: string) {
      manager.applyPreset(name)
    },

    setBaseSize(size: number) {
      manager.setBaseSize(size)
    },

    setConfig(newConfig: Partial<SizeConfig>) {
      manager.setConfig(newConfig)
    },

    getManager() {
      return manager
    },

    destroy() {
      unsubscribe()
      if (!options.manager) {
        manager.destroy()
      }
    }
  }

  return store
}

/**
 * Global size store instance (singleton)
 */
let globalStore: SizeStore | null = null

/**
 * Get or create the global size store
 * 
 * @example
 * ```ts
 * import { getGlobalSizeStore } from '@ldesign/size-svelte'
 * 
 * const size = getGlobalSizeStore()
 * ```
 */
export function getGlobalSizeStore(options?: SizeStoreOptions): SizeStore {
  if (!globalStore) {
    globalStore = createSizeStore(options)
  }
  return globalStore
}

/**
 * Reset the global size store
 */
export function resetGlobalSizeStore(): void {
  if (globalStore) {
    globalStore.destroy()
    globalStore = null
  }
}


