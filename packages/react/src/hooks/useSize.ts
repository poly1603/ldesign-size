/**
 * @ldesign/size-react - useSize Hook
 * 
 * React hook for size management
 */

import { useCallback, useContext, useEffect, useState } from 'react'
import type { SizeConfig, SizePreset } from '@ldesign/size-core'
import { SizeContext } from '../context/SizeContext'

/**
 * useSize Hook Return Type
 */
export interface UseSizeReturn {
  /**
   * Current size configuration
   */
  config: SizeConfig

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
 * 使用尺寸管理器的 React Hook
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
 *       <p>Current: {currentPreset}</p>
 *       {presets.map(preset => (
 *         <button
 *           key={preset.name}
 *           onClick={() => applyPreset(preset.name)}
 *         >
 *           {preset.label}
 *         </button>
 *       ))}
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

  // 状态管理
  const [config, setConfig] = useState<SizeConfig>(manager.getConfig())
  const [currentPreset, setCurrentPreset] = useState<string>(
    manager.getCurrentPreset()
  )

  // 订阅配置变化
  useEffect(() => {
    const unsubscribe = manager.subscribe((newConfig) => {
      setConfig(newConfig)
      setCurrentPreset(manager.getCurrentPreset())
    })

    return unsubscribe
  }, [manager])

  // 获取预设列表（不需要响应式，因为预设列表通常不会变化）
  const presets = manager.getPresets()

  // 应用预设
  const applyPreset = useCallback(
    (name: string) => {
      manager.applyPreset(name)
    },
    [manager]
  )

  // 设置基础尺寸
  const setBaseSize = useCallback(
    (size: number) => {
      manager.setBaseSize(size)
    },
    [manager]
  )

  // 设置配置
  const setConfigCallback = useCallback(
    (newConfig: Partial<SizeConfig>) => {
      manager.setConfig(newConfig)
    },
    [manager]
  )

  return {
    config,
    currentPreset,
    presets,
    applyPreset,
    setBaseSize,
    setConfig: setConfigCallback
  }
}

