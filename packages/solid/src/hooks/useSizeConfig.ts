/**
 * @ldesign/size-solid - useSizeConfig Hook
 * 
 * Hook to access and update size configuration
 */

import { createEffect, createSignal, onCleanup, useContext } from 'solid-js'
import type { SizeConfig } from '@ldesign/size-core'
import { SizeContext } from '../context/SizeContext'

/**
 * useSizeConfig Hook Return Type
 */
export interface UseSizeConfigReturn {
  /**
   * Current size configuration (reactive)
   */
  config: () => SizeConfig

  /**
   * Update configuration
   */
  setConfig: (config: Partial<SizeConfig>) => void

  /**
   * Reset to default configuration
   */
  resetConfig: () => void
}

/**
 * useSizeConfig Hook
 * 
 * 专注于配置管理的 Hook
 * 
 * @example
 * ```tsx
 * function ConfigPanel() {
 *   const { config, setConfig } = useSizeConfig()
 *   
 *   return (
 *     <div>
 *       <input
 *         type="number"
 *         value={config().baseSize}
 *         onInput={(e) => setConfig({ baseSize: Number(e.target.value) })}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
export function useSizeConfig(): UseSizeConfigReturn {
  const manager = useContext(SizeContext)

  if (!manager) {
    throw new Error('useSizeConfig must be used within SizeProvider')
  }

  const [config, setConfigState] = createSignal<SizeConfig>(manager.getConfig())

  // 订阅配置变化
  createEffect(() => {
    const unsubscribe = manager.subscribe((newConfig) => {
      setConfigState(() => newConfig)
    })

    onCleanup(unsubscribe)
  })

  return {
    config,
    setConfig: (newConfig: Partial<SizeConfig>) => manager.setConfig(newConfig),
    resetConfig: () => manager.applyPreset('default')
  }
}


