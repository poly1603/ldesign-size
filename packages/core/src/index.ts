/**
 * @ldesign/size-core - Framework agnostic size management system
 */

// ========== 尺寸适配器（核心功能） ==========
// 框架无关的尺寸主题管理基类
export { BaseSizeAdapter } from './adapter/BaseSizeAdapter'
export type {
  SizeAdapterOptions,
  SizeAdapterState,
  SizePersistenceConfig,
} from './adapter/BaseSizeAdapter'

// ========== 尺寸预设主题（核心功能） ==========
// 内置预设和预设管理工具
export {
  getPresetByName,
  getPresetConfig,
  mergePresets,
  sizePresetThemes,
  sortPresets,
} from './presets/sizePresets'
export type {
  SizePresetConfig,
  SizePresetName,
  SizePresetTheme,
} from './presets/sizePresets'

// Accessibility exports
export {
  a11y,
  AccessibilityEnhancer,
  type ColorBlindnessType,
  type ComplianceReport,
  type ContrastRatio,
  getAccessibilityEnhancer,
  type WCAGLevel
} from './core/AccessibilityEnhancer'

// AI Optimizer exports - 懒加载
export type {
  AIOptimizerConfig,
  OptimizationSuggestion,
  PageContext,
  ReadabilityOptions
} from './core/AIOptimizer'

/**
 * 懒加载模块管理器
 * 
 * 统一管理所有懒加载模块的状态和错误处理
 */
class LazyModuleManager {
  private modules = new Map<string, {
    loaded: boolean
    loading: Promise<any> | null
    error: Error | null
    retryCount: number
  }>()

  private maxRetries = 3
  private retryDelay = 1000

  /**
   * 加载模块（带状态管理和错误处理）
   */
  async load<T>(
    moduleName: string,
    loader: () => Promise<T>
  ): Promise<T> {
    const state = this.modules.get(moduleName) || {
      loaded: false,
      loading: null,
      error: null,
      retryCount: 0,
    }

    // 如果已经在加载中，返回正在进行的 Promise
    if (state.loading) {
      return state.loading
    }

    // 如果已加载成功，直接加载
    if (state.loaded && !state.error) {
      return loader()
    }

    // 开始加载
    const loadingPromise = (async () => {
      try {
        const module = await loader()
        state.loaded = true
        state.error = null
        state.loading = null
        this.modules.set(moduleName, state)
        return module
      } catch (error) {
        state.error = error as Error
        state.loading = null

        // 如果还有重试次数，尝试重试
        if (state.retryCount < this.maxRetries) {
          state.retryCount++
          this.modules.set(moduleName, state)

          console.warn(
            `[LazyLoader] 模块 "${moduleName}" 加载失败，${this.retryDelay}ms 后重试 (${state.retryCount}/${this.maxRetries})`
          )

          await new Promise(resolve => setTimeout(resolve, this.retryDelay))
          return this.load(moduleName, loader)
        }

        this.modules.set(moduleName, state)
        throw error
      }
    })()

    state.loading = loadingPromise
    this.modules.set(moduleName, state)
    return loadingPromise
  }

  /**
   * 获取模块状态
   */
  getStatus(moduleName: string) {
    return this.modules.get(moduleName) || {
      loaded: false,
      loading: null,
      error: null,
      retryCount: 0,
    }
  }

  /**
   * 重置模块状态
   */
  reset(moduleName: string) {
    this.modules.delete(moduleName)
  }

  /**
   * 获取所有模块状态
   */
  getAllStatus() {
    return Array.from(this.modules.entries()).map(([name, state]) => ({
      name,
      ...state,
    }))
  }
}

const lazyLoader = new LazyModuleManager()

// 懒加载 AI 模块（通常较大）
export const ai = new Proxy({} as Record<string, (...args: unknown[]) => Promise<unknown>>, {
  get(_, prop: string) {
    return async (...args: unknown[]) => {
      const module = await lazyLoader.load('AIOptimizer', () => import('./core/AIOptimizer'))
      return (module.ai as Record<string, (...args: unknown[]) => unknown>)[prop](...args)
    }
  }
})

export const getAIOptimizer = async () => {
  const module = await lazyLoader.load('AIOptimizer', () => import('./core/AIOptimizer'))
  return module.getAIOptimizer()
}

export const AIOptimizer = new Proxy(class { } as new (...args: unknown[]) => unknown, {
  construct: async (_, args: unknown[]) => {
    const module = await lazyLoader.load('AIOptimizer', () => import('./core/AIOptimizer'))
    return new (module.AIOptimizer as new (...args: unknown[]) => unknown)(...args)
  }
})

// Animation exports
export {
  animate,
  AnimationManager,
  type AnimationOptions,
  getAnimationManager
} from './core/AnimationManager'

// CSS Generator exports
export {
  generateCSS,
  generateCSSString,
  generateCSSVariables,
  injectCSS,
  removeCSS
} from './core/cssGenerator'

// Device Detection exports
export {
  DEFAULT_BREAKPOINTS,
  device,
  DeviceDetector,
  getDeviceDetector
} from './core/DeviceDetector'

// Fluid Size exports
export {
  fluid,
  FluidSizeCalculator,
  fluidTypographyPresets,
  getFluidSizeCalculator,
  modularScaleRatios
} from './core/FluidSize'

// Advanced Responsive System exports
export {
  AdvancedResponsiveSystem,
  createResponsiveSystem,
  responsive
} from './modules/AdvancedResponsiveSystem'

export type {
  AdvancedBreakpoint,
  ContainerQuery,
  ContainerQueryType,
  LayoutConfig,
  LayoutType,
  ResponsiveSizeConfig,
  SizeStrategy,
  VisibilityConfig
} from './modules/AdvancedResponsiveSystem'

// Size class exports
export {
  em,
  percent,
  px,
  rem,
  Size,
  size,
  vh,
  vw
} from './core/Size'

// Size Analyzer exports - 懒加载（调试工具通常不需要立即加载）
export type {
  PerformanceMetrics,
  SizeSpecDoc,
  SizeUsageReport,
  ValidationReport
} from './core/SizeAnalyzer'

// 懒加载分析器模块（带状态管理和错误处理）
export const analyze = new Proxy({} as Record<string, (...args: unknown[]) => Promise<unknown>>, {
  get(_, prop: string) {
    return async (...args: unknown[]) => {
      const module = await lazyLoader.load('SizeAnalyzer', () => import('./core/SizeAnalyzer'))
      return (module.analyze as Record<string, (...args: unknown[]) => unknown>)[prop](...args)
    }
  }
})

export const getSizeAnalyzer = async () => {
  const module = await lazyLoader.load('SizeAnalyzer', () => import('./core/SizeAnalyzer'))
  return module.getSizeAnalyzer()
}

export const SizeAnalyzer = new Proxy(class { } as new (...args: unknown[]) => unknown, {
  construct: async (_, args: unknown[]) => {
    const module = await lazyLoader.load('SizeAnalyzer', () => import('./core/SizeAnalyzer'))
    return new (module.SizeAnalyzer as new (...args: unknown[]) => unknown)(...args)
  }
})

// Core exports
export {
  type SizeChangeListener,
  type SizeConfig,
  SizeManager,
  sizeManager,
  type SizePreset
} from './core/SizeManager'

// Migration Tool exports - 懒加载（迁移工具通常只在迁移时使用）
export type {
  Framework,
  MigrationConfig,
  MigrationReport
} from './core/SizeMigration'

// 懒加载迁移工具（带状态管理和错误处理）
export const createMigrationGuide = async (...args: unknown[]) => {
  const module = await lazyLoader.load('SizeMigration', () => import('./core/SizeMigration'))
  return (module.createMigrationGuide as (...args: unknown[]) => unknown)(...args)
}

export const detectFramework = async (...args: unknown[]) => {
  const module = await lazyLoader.load('SizeMigration', () => import('./core/SizeMigration'))
  return (module.detectFramework as (...args: unknown[]) => unknown)(...args)
}

export const migrateFrom = async (...args: unknown[]) => {
  const module = await lazyLoader.load('SizeMigration', () => import('./core/SizeMigration'))
  return (module.migrateFrom as (...args: unknown[]) => unknown)(...args)
}

export const SizeMigration = new Proxy(class { } as new (...args: unknown[]) => unknown, {
  construct: async (_, args: unknown[]) => {
    const module = await lazyLoader.load('SizeMigration', () => import('./core/SizeMigration'))
    return new (module.SizeMigration as new (...args: unknown[]) => unknown)(...args)
  }
})

// Theme exports
export {
  getThemeManager,
  theme,
  type Theme,
  type ThemeConfig,
  ThemeManager,
  type ThemeManagerOptions
} from './core/ThemeManager'

// Unit Strategy exports
export {
  getUnitStrategyManager,
  units,
  UnitStrategyManager
} from './core/UnitStrategy'

// Locale exports
export {
  deDE,
  enUS,
  esES,
  frFR,
  getLocale,
  itIT,
  jaJP,
  koKR,
  locales,
  ptBR,
  ruRU,
  zhCN
} from './locales'

export type { LocaleKey, SizeLocale } from './locales'

// Utility exports
export {
  batchProcessSizes,
  memoize,
  optimizeCSSVariables,
  requestIdleCallback
} from './utils'

// Cache Manager exports
export {
  CacheManager,
  LRUCache,
  CacheType,
  globalCacheManager
} from './utils/CacheManager'

// Error handling exports
export {
  SizeError,
  ErrorHandlerManager,
  globalErrorHandler,
  ERROR_CODES,
  handleError,
  createError
} from './utils/error'

export type {
  ErrorCode,
  ErrorContext,
  ErrorHandler
} from './utils/error'

// Performance Monitor exports (enhanced)
export type {
  PerformanceBudget,
  PerformanceTrend,
  OptimizationSuggestion as PerformanceOptimizationSuggestion
} from './core/PerformanceMonitor'

// Constants exports
export { PERFORMANCE_CONFIG } from './constants/performance'
export { SIZE_CONFIG, UNITS, SIZE_MULTIPLIERS, COMMON_SIZES, CSS_IDENTIFIERS } from './constants/sizes'

// Version
export const version = '0.2.0'

