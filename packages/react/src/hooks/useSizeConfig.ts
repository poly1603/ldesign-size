/**
 * @ldesign/size-react - useSizeConfig Hook
 * 
 * React hook for size configuration management
 */

import { useCallback, useContext, useEffect, useState } from 'react'
import type { SizeConfig } from '@ldesign/size-core'
import { SizeContext } from '../context/SizeContext'

/**
 * useSizeConfig Hook Return Type
 */
export interface UseSizeConfigReturn {
  /**
   * Current size configuration
   */
  config: SizeConfig

  /**
   * Set configuration
   */
  setConfig: (config: Partial<SizeConfig>) => void

  /**
   * Set base size
   */
  setBaseSize: (size: number) => void

  /**
   * Get configuration
   */
  getConfig: () => SizeConfig
}

/**
 * useSizeConfig Hook
 * 
 * 专注于配置管理的 Hook
 * 
 * @throws {Error} 如果在 SizeProvider 外部使用
 * 
 * @example
 * ```tsx
 * function ConfigPanel() {
 *   const { config, setBaseSize } = useSizeConfig()
 *   
 *   return (
 *     <div>
 *       <p>Base Size: {config.baseSize}px</p>
 *       <input
 *         type="range"
 *         min="12"
 *         max="20"
 *         value={config.baseSize}
 *         onChange={(e) => setBaseSize(Number(e.target.value))}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
export function useSizeConfig(): UseSizeConfigReturn {
  const manager = useContext(SizeContext)

  if (!manager) {
    throw new Error(
      'useSizeConfig must be used within SizeProvider. ' +
      'Wrap your component tree with <SizeProvider>.'
    )
  }

  const [config, setConfigState] = useState<SizeConfig>(manager.getConfig())

  // 订阅配置变化
  useEffect(() => {
    const unsubscribe = manager.subscribe((newConfig) => {
      setConfigState(newConfig)
    })

    return unsubscribe
  }, [manager])

  // 设置配置
  const setConfig = useCallback(
    (newConfig: Partial<SizeConfig>) => {
      manager.setConfig(newConfig)
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

  // 获取配置
  const getConfig = useCallback(() => {
    return manager.getConfig()
  }, [manager])

  return {
    config,
    setConfig,
    setBaseSize,
    getConfig
  }
}

