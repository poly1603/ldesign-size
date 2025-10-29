/**
 * @ldesign/size-solid - useSize Hook
 * 
 * Solid.js hook for size management
 */

import { createEffect, createSignal, onCleanup, useContext } from 'solid-js'
import type { SizeConfig, SizePreset } from '@ldesign/size-core'
import { SizeContext } from '../context/SizeContext'

/**
 * useSize Hook Return Type
 */
export interface UseSizeReturn {
  /**
   * Current size configuration (reactive)
   */
  config: () => SizeConfig

  /**
   * Current preset name (reactive)
   */
  currentPreset: () => string

  /**
   * Available presets
   */
  presets: () => SizePreset[]

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
}

/**
 * useSize Hook
 * 
 * 使用尺寸管理器的 Solid.js Hook
 * 
 * @throws {Error} 如果在 SizeProvider 外部使用
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentPreset, presets, applyPreset } = useSize()
 *   
 *   return (
 *     <div>
 *       <p>Current: {currentPreset()}</p>
 *       <For each={presets()}>
 *         {(preset) => (
 *           <button
 *             onClick={() => applyPreset(preset.name)}
 *           >
 *             {preset.label}
 *           </button>
 *         )}
 *       </For>
 *     </div>
 *   )
 * }
 * ```
 */
export function useSize(): UseSizeReturn {
  const manager = useContext(SizeContext)

  if (!manager) {
    throw new Error(
      'useSize must be used within SizeProvider. ' +
      'Wrap your component tree with <SizeProvider>.'
    )
  }

  // 状态管理 - 使用 Solid 的 createSignal
  const [config, setConfig] = createSignal<SizeConfig>(manager.getConfig())
  const [currentPreset, setCurrentPreset] = createSignal<string>(
    manager.getCurrentPreset()
  )

  // 订阅配置变化
  createEffect(() => {
    const unsubscribe = manager.subscribe((newConfig) => {
      setConfig(() => newConfig)
      setCurrentPreset(() => manager.getCurrentPreset())
    })

    onCleanup(unsubscribe)
  })

  // 获取预设列表（不需要响应式，因为预设列表通常不会变化）
  const presets = () => manager.getPresets()

  return {
    config,
    currentPreset,
    presets,
    applyPreset: (name: string) => manager.applyPreset(name),
    setBaseSize: (size: number) => manager.setBaseSize(size),
    setConfig: (newConfig: Partial<SizeConfig>) => manager.setConfig(newConfig)
  }
}


