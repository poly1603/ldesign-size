/**
 * @ldesign/size-vue - Vue Composition API
 * 
 * 提供 Vue 3 的尺寸管理 Composables
 * 
 * @module useSize
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

import type { SizeConfig, SizePreset } from '@ldesign/size-core'
import type { ComputedRef, DeepReadonly, Ref } from 'vue'
import { computed, inject, onBeforeUnmount, readonly, ref, shallowRef } from 'vue'
import { SIZE_MANAGER_KEY } from '../plugin'

/**
 * useSize 返回类型
 */
export interface UseSizeReturn {
  /** 只读配置 */
  readonly config: DeepReadonly<Ref<SizeConfig>>
  /** 当前预设名称 */
  readonly currentPreset: DeepReadonly<Ref<string>>
  /** 预设列表 */
  readonly presets: ComputedRef<ReadonlyArray<SizePreset>>
  /** 设置基础尺寸 */
  setBaseSize: (baseSize: number) => void
  /** 应用预设 */
  applyPreset: (presetName: string) => void
  /** 清理函数（取消订阅） */
  cleanup: () => void
}

/**
 * 默认预设配置（冻结以避免意外修改和响应式追踪）
 */
const DEFAULT_PRESETS: ReadonlyArray<Readonly<SizePreset>> = Object.freeze([
  Object.freeze({ name: 'compact', baseSize: 14, label: '紧凑' }),
  Object.freeze({ name: 'comfortable', baseSize: 16, label: '舒适' }),
  Object.freeze({ name: 'default', baseSize: 16, label: '默认' }),
  Object.freeze({ name: 'spacious', baseSize: 18, label: '宽松' })
])

/** 默认配置 */
const DEFAULT_CONFIG: SizeConfig = Object.freeze({ baseSize: 14 })

/**
 * 使用 WeakMap 缓存 manager API 实例
 * 
 * 好处：
 * - 自动垃圾回收
 * - 避免重复创建 API 包装
 */
const managerCache = new WeakMap<object, UseSizeReturn>()

/**
 * SizeManager 接口类型（用于类型安全）
 */
interface SizeManagerLike {
  getConfig?: () => SizeConfig
  getCurrentPreset?: () => string
  getPresets?: () => SizePreset[]
  setBaseSize?: (baseSize: number) => void
  applyPreset?: (presetName: string) => boolean | void
  subscribe?: (listener: (config: SizeConfig) => void) => () => void
}

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
 * @param manager - SizeManager 实例
 * @returns 响应式 API 对象
 * @internal
 */
function createSizeApi(manager: SizeManagerLike): UseSizeReturn {
  // 使用 shallowRef 减少响应式开销
  const config = shallowRef<SizeConfig>(
    manager.getConfig?.() ?? DEFAULT_CONFIG
  )

  // 当前预设名称
  const currentPreset = ref<string>(
    manager.getCurrentPreset?.() ?? 'default'
  )

  // 取消订阅函数
  let unsubscribe: () => void = () => {}

  // 订阅配置变化
  if (manager.subscribe) {
    try {
      unsubscribe = manager.subscribe((newConfig: SizeConfig) => {
        config.value = newConfig
        currentPreset.value = manager.getCurrentPreset?.() ?? 'default'
      })
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[useSize] 订阅失败:', error)
      }
    }
  }

  // 使用 computed 缓存预设列表
  const presets = computed<ReadonlyArray<SizePreset>>(() => {
    try {
      const result = manager.getPresets?.()
      if (result?.length) {
        return Object.freeze(result)
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[useSize] 获取预设失败:', error)
      }
    }
    return DEFAULT_PRESETS
  })

  return {
    config: readonly(config),
    currentPreset: readonly(currentPreset),
    presets,

    setBaseSize: (baseSize: number) => {
      if (typeof baseSize !== 'number' || Number.isNaN(baseSize)) {
        console.warn('[useSize] setBaseSize: baseSize 必须是有效数字')
        return
      }
      try {
        manager.setBaseSize?.(baseSize)
      } catch (error) {
        console.warn('[useSize] setBaseSize 失败:', error)
      }
    },

    applyPreset: (presetName: string) => {
      if (!presetName || typeof presetName !== 'string') {
        console.warn('[useSize] applyPreset: 预设名称无效')
        return
      }
      try {
        manager.applyPreset?.(presetName)
        // 立即更新，不等待异步通知
        currentPreset.value = presetName
      } catch (error) {
        console.warn('[useSize] applyPreset 失败:', error)
      }
    },

    cleanup: unsubscribe
  }
}

/**
 * 创建默认的 Size API（未注入 manager 时使用）
 * @internal
 */
function createDefaultApi(): UseSizeReturn {
  const defaultConfig = shallowRef<SizeConfig>(DEFAULT_CONFIG)
  const defaultPreset = ref<string>('default')

  return {
    config: readonly(defaultConfig),
    currentPreset: readonly(defaultPreset),
    presets: computed(() => DEFAULT_PRESETS),
    setBaseSize: (_baseSize: number) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[useSize] SizeManager 未注入，setBaseSize 无效')
      }
    },
    applyPreset: (name: string) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[useSize] SizeManager 未注入，applyPreset 无效')
      }
      // 更新本地状态保持 UI 一致
      defaultPreset.value = name
    },
    cleanup: () => {}
  }
}

/**
 * 使用尺寸管理器的 Vue Composition Hook
 * 
 * 提供响应式的尺寸配置访问和操作
 * 
 * @returns 响应式尺寸 API
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useSize } from '@ldesign/size-vue'
 * 
 * const { currentPreset, presets, applyPreset } = useSize()
 * 
 * // 切换预设
 * applyPreset('spacious')
 * </script>
 * 
 * <template>
 *   <div>当前预设: {{ currentPreset }}</div>
 * </template>
 * ```
 */
export function useSize(): UseSizeReturn {
  // 尝试注入 SizeManager
  const injected = inject<{ manager?: SizeManagerLike } | SizeManagerLike | null>(
    SIZE_MANAGER_KEY,
    null
  )

  // 如果没有注入 manager，返回默认 API
  if (!injected) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[useSize] SizeManager 未注入。\n' +
        '请确保已在 app.use() 中安装 createSizePlugin()。'
      )
    }
    return createDefaultApi()
  }

  // 获取实际的 manager 实例
  const manager: SizeManagerLike = 
    (injected as { manager?: SizeManagerLike }).manager ?? 
    (injected as SizeManagerLike)

  // 检查缓存，避免重复创建 API 包装
  let api = managerCache.get(manager as object)
  if (!api) {
    api = createSizeApi(manager)
    managerCache.set(manager as object, api)
  }

  // 组件卸载时清理订阅
  onBeforeUnmount(() => {
    api!.cleanup()
  })

  return api
}

