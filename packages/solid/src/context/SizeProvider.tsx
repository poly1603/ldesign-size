/**
 * @ldesign/size-solid - Size Provider
 * 
 * Solid.js Provider component for size management
 */

import { createEffect, createSignal, onCleanup, type ParentComponent } from 'solid-js'
import { SizeManager, type SizePreset } from '@ldesign/size-core'
import { SizeContext } from './SizeContext'

/**
 * Size Provider Props
 */
export interface SizeProviderProps {
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
   * 如果提供，将直接使用该实例，不会创建新实例
   */
  manager?: SizeManager
}

/**
 * Size Provider Component
 * 
 * 提供 SizeManager 实例给子组件
 * 
 * @example
 * ```tsx
 * <SizeProvider defaultPreset="medium">
 *   <App />
 * </SizeProvider>
 * ```
 */
export const SizeProvider: ParentComponent<SizeProviderProps> = (props) => {
  // Create or use existing SizeManager instance
  const manager = props.manager || new SizeManager({
    storageKey: props.storageKey,
    presets: props.presets
  })

  // Apply default preset if provided and manager is newly created
  if (props.defaultPreset && !props.manager) {
    manager.applyPreset(props.defaultPreset)
  }

  // Cleanup: if we created the instance, destroy it on unmount
  onCleanup(() => {
    // Only destroy if we created it
    if (!props.manager) {
      manager.destroy()
    }
  })

  return (
    <SizeContext.Provider value={manager}>
      {props.children}
    </SizeContext.Provider>
  )
}


