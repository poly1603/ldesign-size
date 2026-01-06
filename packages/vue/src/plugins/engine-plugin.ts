/**
 * Vue 3 Size Engine 插件
 * 
 * 将 Vue Size 功能集成到 LDesign Engine 中
 * 
 * @module plugins/engine-plugin
 */

import type { Plugin, SizePluginAPI } from '@ldesign/engine-core/types'
import { BaseSizeAdapter } from '@ldesign/size-core'
import type { SizeAdapterOptions, SizePresetTheme } from '@ldesign/size-core'
import type { SizePresetName } from '@ldesign/size-core'
import { SIZE_EVENTS } from '@ldesign/engine-core/constants/events'
import { createSizePlugin } from '../plugin/index'
import { SIZE_SYMBOL } from '../constants'

/**
 * 尺寸选择器配置
 */
export interface SizeSwitcherConfig {
  /** 禁用的预设名称 */
  disabledPresets?: string[]
  /** 自定义预设 */
  customPresets?: SizePresetTheme[]
  /** 是否只使用自定义预设 */
  useOnlyCustom?: boolean
  /** 样式配置 */
  style?: {
    width?: string
    maxHeight?: string
  }
}

/**
 * Size 插件上下文（用于 onReady 回调）
 */
export interface SizePluginContext {
  /** 应用预设 */
  applyPreset: (preset: string) => void
  /** 获取当前预设 */
  getCurrentPreset: () => SizePresetTheme | null
  /** 设置基础尺寸 */
  setBaseSize: (size: number) => void
  /** 获取基础尺寸 */
  getBaseSize: () => number
  /** 设置缩放比例 */
  setScale: (scale: number) => void
  /** 获取缩放比例 */
  getScale: () => number
  /** 获取所有预设 */
  getPresets: () => SizePresetTheme[]
  /** 计算尺寸 */
  compute: (level: number) => number
  /** 适配器实例 */
  adapter: BaseSizeAdapter
}

/**
 * Size Engine 插件选项
 * 
 * 扩展 SizeAdapterOptions，添加 Engine 特定的配置
 */
export interface SizeEnginePluginOptions extends Omit<SizeAdapterOptions, 'baseSize'> {
  /** 插件名称 */
  name?: string
  /** 插件版本 */
  version?: string
  /** 是否启用调试模式 */
  debug?: boolean
  /** 是否注册全局属性 */
  globalProperties?: boolean
  /** 是否注册全局组件 */
  globalComponents?: boolean

  /**
   * 基础尺寸
   * 支持两种类型：
   * 1. 具体数值：如 16、18 等
   * 2. 预设名称：如 'default'、'compact' 等
   */
  baseSize?: number | SizePresetName

  /**
   * 自定义预设数组
   * 用于扩展或覆盖内置预设
   */
  customPresets?: SizePresetTheme[]

  /**
   * 持久化配置
   */
  persistence?: {
    /** 是否启用持久化 */
    enabled?: boolean
    /** 存储键名 */
    key?: string
    /** 存储类型 */
    storage?: 'localStorage' | 'sessionStorage'
  }

  // ========== 尺寸选择器配置 ==========
  /** 尺寸选择器配置 */
  sizeSwitcher?: SizeSwitcherConfig

  // ========== 事件回调 ==========
  /** 尺寸变化回调 */
  onSizeChange?: (preset: SizePresetTheme, oldPreset: SizePresetTheme | null) => void | Promise<void>
  /** 初始化完成回调 */
  onReady?: (context: SizePluginContext) => void | Promise<void>
}

/**
 * 创建 Size Engine 插件
 * 
 * @param options - 插件选项
 * @returns LDesign Engine 插件
 * 
 * @example
 * ```ts
 * import { createSizeEnginePlugin } from '@ldesign/size-vue/plugins'
 * 
 * const engine = createVueEngine({
 *   plugins: [
 *     createSizeEnginePlugin({
 *       baseSize: 'default', // 使用预设名称
 *       customPresets: [
 *         {
 *           name: 'brand-default',
 *           label: '品牌默认',
 *           config: { baseSize: 16, scale: 1.25, unit: 'px' },
 *         },
 *       ],
 *       persistence: {
 *         enabled: true,
 *         key: 'my-app-size',
 *       },
 *       globalProperties: true,
 *       globalComponents: true,
 *     }),
 *   ],
 * })
 * ```
 */
export function createSizeEnginePlugin(
  options: SizeEnginePluginOptions = {},
): Plugin {
  const {
    name = 'size',
    version = '1.0.0',
    debug = false,
    globalProperties = true,
    globalComponents = true,
    baseSize,
    customPresets,
    persistence,
    sizeSwitcher,
    onSizeChange,
    onReady,
    ...adapterOptions
  } = options

  if (debug) {
    console.log('[Size Engine Plugin] Creating plugin with options:', options)
  }

  // ==================== 持久化配置 ====================
  const STORAGE_KEY = persistence?.key || 'ldesign-size'
  const storageType = persistence?.storage || 'localStorage'
  const persistenceEnabled = persistence?.enabled !== false

  // 从 Storage 读取保存的预设（兼容 BaseSizeAdapter 格式）
  const loadPresetFromStorage = (): string | null => {
    if (!persistenceEnabled) return null
    try {
      const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage
      const data = storage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        // 兼容两种格式：{ preset: ... } 和 { presetName: ... }
        return parsed.preset || parsed.presetName || null
      }
    } catch { /* ignore */ }
    return null
  }

  // 保存预设到 Storage（使用 BaseSizeAdapter 兼容格式）
  const savePresetToStorage = (preset: string) => {
    if (!persistenceEnabled) return
    try {
      const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage
      // 使用与 BaseSizeAdapter 兼容的格式
      const data = {
        presetName: preset,
        updatedAt: Date.now()
      }
      storage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('[Size Engine Plugin] Failed to save preset to storage:', e)
    }
  }

  // 处理 baseSize：如果是预设名称，需要在适配器中处理
  let presetName: string | undefined
  let resolvedBaseSize: number | undefined

  // 优先从 Storage 恢复
  const storedPreset = loadPresetFromStorage()
  if (storedPreset) {
    presetName = storedPreset
  } else if (typeof baseSize === 'string') {
    presetName = baseSize
  } else if (typeof baseSize === 'number') {
    resolvedBaseSize = baseSize
  }

  if (debug) {
    console.log('[Size Engine Plugin] Initial preset:', { presetName, storedPreset, baseSize })
  }

  // 创建适配器
  const sizeAdapter = new BaseSizeAdapter({
    ...adapterOptions,
    baseSize: resolvedBaseSize,
    customPresets,
    persistence,
    immediate: false,
    presetName,
  })

  // 创建 Vue 插件
  const vuePlugin = createSizePlugin({
    globalProperties,
    globalComponents,
    baseSize: resolvedBaseSize,
    customPresets,
    persistence: persistence?.enabled ?? false,
    ...adapterOptions,
  })

  // 标记 Vue 插件是否已安装
  let vueInstalled = false
  let pluginContext: SizePluginContext | null = null

  // 返回 Engine 插件
  return {
    name,
    version,

    /**
     * 安装插件
     */
    async install(context: any) {
      if (debug) {
        console.log(`[Size Engine Plugin] Installing plugin: ${name}`)
      }

      // 兼容 Engine Core 的插件上下文
      const engine: any = (context?.engine || context)

      // 1. 初始化适配器
      sizeAdapter.initialize(presetName)

      // 包装 applyPreset 以触发回调和持久化
      const originalApplyPreset = sizeAdapter.applyPreset.bind(sizeAdapter)
      sizeAdapter.applyPreset = (newPreset: string) => {
        const oldPreset = sizeAdapter.getCurrentPreset()
        originalApplyPreset(newPreset)
        const currentPreset = sizeAdapter.getCurrentPreset()

        // 保存到 Storage
        savePresetToStorage(newPreset)

        // 触发回调
        if (onSizeChange && currentPreset) {
          try {
            onSizeChange(currentPreset, oldPreset)
          } catch (e) {
            console.error('[Size Engine Plugin] onSizeChange error:', e)
          }
        }
      }

      // 创建插件上下文
      pluginContext = {
        applyPreset: (preset: string) => sizeAdapter.applyPreset(preset),
        getCurrentPreset: () => sizeAdapter.getCurrentPreset(),
        setBaseSize: (size: number) => sizeAdapter.setBaseSize(size),
        getBaseSize: () => sizeAdapter.getBaseSize(),
        setScale: (scale: number) => sizeAdapter.setScale(scale),
        getScale: () => sizeAdapter.getScale(),
        getPresets: () => sizeAdapter.getPresets(),
        compute: (level: number) => sizeAdapter.compute(level),
        adapter: sizeAdapter,
      }

      // 2. 注册到 Engine 状态
      if (engine?.state) {
        engine.state.set(`plugins.${name}`, sizeAdapter)
      }

      // 注册 Size API 到 API 注册表
      if ((engine as any)?.api) {
        const sizeAPI: SizePluginAPI = {
          name: 'size',
          version: version || '1.0.0',
          applyPreset: (preset: string) => sizeAdapter.applyPreset(preset),
          getCurrentPreset: () => sizeAdapter.getCurrentPreset()?.name ?? null,
          setBaseSize: (size: number) => sizeAdapter.setBaseSize(size),
          getBaseSize: () => sizeAdapter.getBaseSize(),
          setScale: (scale: number) => sizeAdapter.setScale(scale),
          getScale: () => sizeAdapter.getScale(),
          getPresets: () => sizeAdapter.getPresets() as unknown as Record<string, unknown>[],
          compute: (level: number) => sizeAdapter.compute(level),
          getState: () => sizeAdapter.getState() as unknown as Record<string, unknown>,
        };
        (engine as any).api.register(sizeAPI)
        if (debug) {
          console.log('[Size Engine Plugin] Size API registered to API registry')
        }
      }

      // 3. 安装到 Vue 应用
      const app = engine?.getApp?.() || context?.framework?.app

      console.log('[Size] Checking Vue app:', { hasApp: !!app, vueInstalled })

      if (app && !vueInstalled) {
        console.log('[Size] Vue app already exists, installing immediately')

        // 先提供适配器实例
        app.provide(SIZE_SYMBOL, sizeAdapter)

        // 然后安装 Vue 插件（使用 app.use 更稳妥）
        console.log('[Size Engine Plugin] Installing Vue plugin...')
        try {
          app.use(vuePlugin)
          vueInstalled = true

          // 重要：覆盖 $sizeManager 为 sizeAdapter，确保持久化生效
          app.config.globalProperties.$sizeManager = sizeAdapter

          console.log('[Size Engine Plugin] Vue plugin installed')
        } catch (error) {
          console.error('[Size Engine Plugin] Error installing Vue plugin:', error)
        }
      }
      else if (!vueInstalled) {
        console.log('[Size] Vue app not ready, waiting for app:created event')
        // 如果应用还未创建，等待应用创建事件
        engine?.events?.once?.('app:created', () => {
          if (vueInstalled) {
            console.log('[Size] size already installed to Vue app, skipping')
            return
          }

          console.log('[Size] Installing size to Vue app')
          const app = engine?.getApp?.() || context?.framework?.app
          if (app) {
            // 先提供适配器实例
            app.provide(SIZE_SYMBOL, sizeAdapter)

            // 然后安装 Vue 插件
            app.use(vuePlugin)
            vueInstalled = true

            // 重要：覆盖 $sizeManager 为 sizeAdapter，确保持久化生效
            app.config.globalProperties.$sizeManager = sizeAdapter

            console.log('[Size] size installed to Vue app')
          }
          else {
            console.error('[Size] Vue app not found after app:created event')
          }
        })
      }

      // 保存配置到状态
      engine?.state?.set?.('size:config', options)

      // 触发 onReady 回调
      if (onReady && pluginContext) {
        try {
          await onReady(pluginContext)
          if (debug) {
            console.log('[Size Engine Plugin] onReady hook executed')
          }
        } catch (e) {
          console.error('[Size Engine Plugin] onReady error:', e)
        }
      }

      if (debug) {
        console.log(`[Size Engine Plugin] Plugin installed: ${name}`)
        console.log('[Size Engine Plugin] Current state:', sizeAdapter.getState())
      }
    },

    /**
     * 卸载插件
     */
    async uninstall(engine: any) {
      if (debug) {
        console.log(`[Size Engine Plugin] Uninstalling plugin: ${name}`)
      }

      // 清除存储
      sizeAdapter.clearStorage()

      // 从 Engine 状态中移除
      if (engine.state) {
        engine.state.delete(`plugins.${name}`)
      }

      // 注销 Size API
      if ((engine as any)?.api) {
        (engine as any).api.unregister('size')
      }

      if (debug) {
        console.log(`[Size Engine Plugin] Plugin uninstalled: ${name}`)
      }
    },
  }
}

/**
 * 从 Engine 获取 Size 适配器
 *
 * @param engine - Engine 实例
 * @returns Size 适配器实例，如果不存在则返回 undefined
 *
 * @example
 * ```ts
 * const sizeAdapter = useSizeFromEngine(engine)
 * if (sizeAdapter) {
 *   console.log('Current preset:', sizeAdapter.getCurrentPreset())
 * }
 * ```
 */
export function useSizeFromEngine(engine: any): BaseSizeAdapter | undefined {
  return engine?.state?.get?.('plugins.size')
}

