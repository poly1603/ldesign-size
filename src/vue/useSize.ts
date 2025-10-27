/**
 * @ldesign/size - Vue Composition API
 * 
 * 提供 Vue 3 的尺寸管理 Hooks
 * 
 * 主要功能：
 * - useSize: 获取和操作尺寸配置
 * - 响应式配置管理
 * - 自动清理资源
 * 
 * 性能优化：
 * - 使用 shallowRef 减少响应式开销
 * - WeakMap 缓存 API 实例
 * - 冻结静态数据避免响应式追踪
 */

import type { SizeScheme } from '../core/SizeManager'
import { computed, inject, onBeforeUnmount, readonly, ref, shallowRef } from 'vue'
import { SIZE_MANAGER_KEY } from './plugin'

/**
 * 默认预设配置（冻结以避免意外修改和响应式追踪）
 */
const DEFAULT_PRESETS = Object.freeze([
  Object.freeze({ name: 'small', baseSize: 12, label: 'Small' }),
  Object.freeze({ name: 'medium', baseSize: 14, label: 'Medium' }),
  Object.freeze({ name: 'large', baseSize: 16, label: 'Large' })
] as const)

/**
 * 使用 WeakMap 缓存 manager API 实例
 * 
 * 好处：
 * - 自动垃圾回收
 * - 避免重复创建 API 包装
 */
const managerCache = new WeakMap<any, ReturnType<typeof createSizeApi>>();

/**
 * 创建 Size API 包装
 * 
 * 将 SizeManager 实例包装为响应式 API
 * 
 * 性能优化：
 * - 使用 shallowRef 避免深度响应式
 * - 使用 computed 缓存预设列表
 * - 立即更新避免等待异步通知
 * 
 * @param actualManager - SizeManager 实例
 * @returns 响应式 API 对象
 * @private
 */
function createSizeApi(actualManager: any) {
  // 使用 shallowRef 减少响应式开销（配置对象不需要深度追踪）
  const config = shallowRef<SizeScheme>(
    actualManager?.getConfig?.() || { baseSize: 14 } as SizeScheme
  )

  // 当前预设名称（使用 ref，因为是基础类型）
  const currentPreset = ref<string>(
    actualManager?.getCurrentPreset?.() || 'medium'
  )

  // 取消订阅函数
  let unsubscribe: () => void = () => { }

  // 订阅配置变化
  try {
    const subscribe = actualManager?.subscribe
    if (subscribe && typeof subscribe === 'function') {
      unsubscribe = subscribe((newConfig: SizeScheme) => {
        config.value = newConfig
        currentPreset.value = actualManager?.getCurrentPreset?.() || 'medium'
      })
    }
  } catch {
    // 静默处理，不影响组件功能
  }

  // 使用 computed 缓存预设列表（避免每次访问都调用方法）
  const presets = computed(() => {
    try {
      if (actualManager?.getPresets) {
        // 获取预设并冻结，避免意外修改
        const result = actualManager.getPresets()
        return Object.freeze(result)
      }
    } catch (error) {
      console.warn('[useSize] getPresets failed:', error)
    }
    return DEFAULT_PRESETS
  })

  return {
    /** 只读配置（外部不可直接修改） */
    config: readonly(config),

    /** 只读当前预设名称 */
    currentPreset: readonly(currentPreset),

    /** 计算属性：预设列表 */
    presets,

    /**
     * 设置基础尺寸
     * 
     * @param baseSize - 基础字体大小（像素）
     */
    setBaseSize: (baseSize: number) => {
      try {
        if (actualManager?.setBaseSize) {
          actualManager.setBaseSize(baseSize)
        }
      } catch (error) {
        console.warn('[useSize] setBaseSize failed:', error)
      }
    },

    /**
     * 应用预设
     * 
     * @param presetName - 预设名称
     */
    applyPreset: (presetName: string) => {
      try {
        if (actualManager?.applyPreset) {
          actualManager.applyPreset(presetName)
          // 立即更新 currentPreset，不等待异步通知（优化响应速度）
          currentPreset.value = presetName
        } else {
          console.warn('[useSize] applyPreset 方法不存在')
        }
      } catch (error) {
        console.warn('[useSize] applyPreset failed:', error)
      }
    },

    /** 清理函数（取消订阅） */
    cleanup: unsubscribe
  }
}

/**
 * 使用尺寸管理器的 Vue Composition Hook
 * 
 * 提供响应式的尺寸配置访问和操作
 * 
 * 性能优化：
 * - WeakMap 缓存 API 实例，避免重复创建
 * - shallowRef 减少响应式追踪开销
 * - computed 缓存派生数据
 * 
 * 生命周期：
 * - 自动订阅配置变化
 * - 组件卸载时自动清理订阅
 * 
 * @returns 响应式尺寸 API
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useSize } from '@ldesign/size/vue'
 * 
 * const { currentPreset, presets, applyPreset } = useSize()
 * 
 * // 切换预设
 * const switchSize = () => {
 *   applyPreset('large')
 * }
 * </script>
 * ```
 */
export function useSize() {
  // 尝试注入 SizeManager
  let manager = inject(SIZE_MANAGER_KEY) as any

  // 如果没有注入 manager，返回默认 API
  if (!manager) {
    // 可选：尝试从全局获取（开发环境调试用）
    // 默认禁用以避免生产环境的全局污染
    if (false) {
      const app = (window as any).__APP__
      const globalManager = app?.config?.globalProperties?.$sizeManager

      if (globalManager) {
        console.info('[useSize] 使用全局 $sizeManager（inject 失败，回退到全局）')
        manager = { manager: globalManager }
      }
    }

    // 仍然没有 manager，返回默认实现
    if (!manager) {
      console.warn('[useSize] SizeManager 未注入，返回默认 API')

      // 创建默认响应式数据（使用 shallowRef 优化性能）
      const defaultConfig = shallowRef<SizeScheme>({ baseSize: 14 } as SizeScheme)
      const defaultPreset = ref<string>('medium')

      return {
        config: readonly(defaultConfig),
        currentPreset: readonly(defaultPreset),
        presets: computed(() => DEFAULT_PRESETS),
        setBaseSize: () => {
          console.warn('[useSize] setBaseSize 调用失败：manager 未注入')
        },
        applyPreset: (name: string) => {
          console.warn('[useSize] applyPreset 调用失败：manager 未注入', name)
          // 即使没有 manager，也更新本地状态以保持 UI 一致
          defaultPreset.value = name
        },
        cleanup: () => { }
      }
    }
  }

  // 获取实际的 manager 实例
  const actualManager = manager.manager || manager

  // 检查缓存，避免重复创建 API 包装
  let api = managerCache.get(actualManager)
  if (!api) {
    api = createSizeApi(actualManager)
    managerCache.set(actualManager, api)
  }

  // 组件卸载时清理订阅
  onBeforeUnmount(() => {
    api!.cleanup()
  })

  return api
}

