/**
 * @ldesign/size-react - useSizePresets Hook
 * 
 * React hook for size presets management
 */

import { useCallback, useContext, useEffect, useState } from 'react'
import type { SizePreset } from '@ldesign/size-core'
import { SizeContext } from '../context/SizeContext'

/**
 * useSizePresets Hook Return Type
 */
export interface UseSizePresetsReturn {
  /**
   * Current preset name
   */
  currentPreset: string

  /**
   * Available presets
   */
  presets: SizePreset[]

  /**
   * Apply a preset
   */
  applyPreset: (name: string) => void

  /**
   * Get current preset name
   */
  getCurrentPreset: () => string

  /**
   * Add a custom preset
   */
  addPreset: (preset: SizePreset) => void
}

/**
 * useSizePresets Hook
 * 
 * 专注于预设管理的 Hook
 * 
 * @throws {Error} 如果在 SizeProvider 外部使用
 * 
 * @example
 * ```tsx
 * function PresetSelector() {
 *   const { currentPreset, presets, applyPreset } = useSizePresets()
 *   
 *   return (
 *     <select
 *       value={currentPreset}
 *       onChange={(e) => applyPreset(e.target.value)}
 *     >
 *       {presets.map(preset => (
 *         <option key={preset.name} value={preset.name}>
 *           {preset.label}
 *         </option>
 *       ))}
 *     </select>
 *   )
 * }
 * ```
 */
export function useSizePresets(): UseSizePresetsReturn {
  const manager = useContext(SizeContext)

  if (!manager) {
    throw new Error(
      'useSizePresets must be used within SizeProvider. ' +
      'Wrap your component tree with <SizeProvider>.'
    )
  }

  const [currentPreset, setCurrentPreset] = useState<string>(
    manager.getCurrentPreset()
  )

  // 订阅配置变化以更新当前预设
  useEffect(() => {
    const unsubscribe = manager.subscribe(() => {
      setCurrentPreset(manager.getCurrentPreset())
    })

    return unsubscribe
  }, [manager])

  // 获取预设列表
  const presets = manager.getPresets()

  // 应用预设
  const applyPreset = useCallback(
    (name: string) => {
      manager.applyPreset(name)
    },
    [manager]
  )

  // 获取当前预设名称
  const getCurrentPreset = useCallback(() => {
    return manager.getCurrentPreset()
  }, [manager])

  // 添加自定义预设
  const addPreset = useCallback(
    (preset: SizePreset) => {
      manager.addPreset(preset)
    },
    [manager]
  )

  return {
    currentPreset,
    presets,
    applyPreset,
    getCurrentPreset,
    addPreset
  }
}

