/**
 * Vue 3 Size Engine 插件
 * 
 * 将 Vue Size 功能集成到 LDesign Engine 中
 * 
 * @module plugins/engine-plugin
 */

import type { Plugin } from '@ldesign/engine-core/types'
import { BaseSizeAdapter } from '@ldesign/size-core'
import type { SizeAdapterOptions, SizePresetTheme } from '@ldesign/size-core'
import type { SizePresetName } from '@ldesign/size-core'
import { createSizePlugin } from '../plugin/index'
import { SIZE_SYMBOL } from '../constants'

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
    ...adapterOptions
  } = options

  if (debug) {
    console.log('[Size Engine Plugin] Creating plugin with options:', options)
  }

  // 处理 baseSize：如果是预设名称，需要在适配器中处理
  let presetName: string | undefined
  let resolvedBaseSize: number | undefined

  if (typeof baseSize === 'string') {
    // 是预设名称
    presetName = baseSize
    if (debug) {
      console.log(`[Size Engine Plugin] Using preset: ${presetName}`)
    }
  }
  else if (typeof baseSize === 'number') {
    // 是具体数值
    resolvedBaseSize = baseSize
  }

  // 创建适配器
  const sizeAdapter = new BaseSizeAdapter({
    ...adapterOptions,
    baseSize: resolvedBaseSize,
    customPresets,
    persistence,
    immediate: false, // 延迟初始化，等插件安装后再初始化
    presetName,
  })

  // 创建 Vue 插件
  const vuePlugin = createSizePlugin({
    globalProperties,
    globalComponents,
    baseSize: resolvedBaseSize,
    customPresets,
    persistence,
    ...adapterOptions,
  })

  // 标记 Vue 插件是否已安装
  let vueInstalled = false

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

      // 兼容 Engine Core 的插件上下文：既支持传入 context，也支持直接传入 engine
      const engine: any = (context?.engine || context)

      // 1. 初始化适配器
      sizeAdapter.initialize(presetName)

      // 2. 注册到 Engine 状态
      if (engine?.state) {
        engine.state.set(`plugins.${name}`, sizeAdapter)
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
            console.log('[Size] size installed to Vue app')
          }
          else {
            console.error('[Size] Vue app not found after app:created event')
          }
        })
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

