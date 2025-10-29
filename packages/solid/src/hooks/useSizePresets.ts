/**
 * @ldesign/size-solid - useSizePresets Hook
 * 
 * Hook to access and manage size presets
 */

import { createEffect, createSignal, onCleanup, useContext } from 'solid-js'
import type { SizePreset } from '@ldesign/size-core'
import { SizeContext } from '../context/SizeContext'

/**
 * useSizePresets Hook Return Type
 */
export interface UseSizePresetsReturn {
  /**
   * Available presets
   */
  presets: () => SizePreset[]

  /**
   * Current preset name (reactive)
   */
  currentPreset: () => string

  /**
   * Apply a preset
   */
  applyPreset: (name: string) => void

  /**
   * Check if a preset is currently active
   */
  isActive: (name: string) => boolean
}

/**
 * useSizePresets Hook
 * 
 * 专注于预设管理的 Hook
 * 
 * @example
 * ```tsx
 * function PresetSelector() {
 *   const { presets, currentPreset, applyPreset, isActive } = useSizePresets()
 *   
 *   return (
 *     <For each={presets()}>
 *       {(preset) => (
 *         <button
 *           classList={{ active: isActive(preset.name) }}
 *           onClick={() => applyPreset(preset.name)}
 *         >
 *           {preset.label}
 *         </button>
 *       )}
 *     </For>
 *   )
 * }
 * ```
 */
export function useSizePresets(): UseSizePresetsReturn {
  const manager = useContext(SizeContext)

  if (!manager) {
    throw new Error('useSizePresets must be used within SizeProvider')
  }

  const [currentPreset, setCurrentPreset] = createSignal<string>(
    manager.getCurrentPreset()
  )

  // 订阅预设变化
  createEffect(() => {
    const unsubscribe = manager.subscribe(() => {
      setCurrentPreset(() => manager.getCurrentPreset())
    })

    onCleanup(unsubscribe)
  })

  const presets = () => manager.getPresets()

  return {
    presets,
    currentPreset,
    applyPreset: (name: string) => manager.applyPreset(name),
    isActive: (name: string) => currentPreset() === name
  }
}


