/**
 * @ldesign/size-react - Size Provider
 * 
 * React Provider component for size management
 */

import React, { useEffect, useMemo } from 'react'
import { SizeManager, type SizePreset } from '@ldesign/size-core'
import { SizeContext } from './SizeContext'

/**
 * Size Provider Props
 */
export interface SizeProviderProps {
  /**
   * Child components
   */
  children: React.ReactNode

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
export function SizeProvider({
  children,
  defaultPreset = 'default',
  presets,
  storageKey,
  manager: externalManager
}: SizeProviderProps) {
  // 创建或使用现有的 SizeManager 实例
  const manager = useMemo(() => {
    if (externalManager) {
      return externalManager
    }

    const newManager = new SizeManager({
      storageKey,
      presets
    })

    // 应用默认预设
    if (defaultPreset) {
      newManager.applyPreset(defaultPreset)
    }

    return newManager
  }, [externalManager, storageKey, presets, defaultPreset])

  // 清理：如果是我们创建的实例，在卸载时销毁
  useEffect(() => {
    return () => {
      // 只销毁我们创建的实例
      if (!externalManager) {
        manager.destroy()
      }
    }
  }, [manager, externalManager])

  return (
    <SizeContext.Provider value={manager}>
      {children}
    </SizeContext.Provider>
  )
}

SizeProvider.displayName = 'SizeProvider'

