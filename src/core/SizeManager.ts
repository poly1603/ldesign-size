/**
 * @ldesign/size - 尺寸管理器
 * 
 * 核心职责：
 * 1. 管理预设配置（紧凑、舒适、宽松等）
 * 2. 生成和注入 CSS 变量到文档
 * 3. 持久化用户偏好设置
 * 4. 通知监听器配置变化
 * 
 * 性能优化：
 * - CSS 缓存避免重复生成
 * - 批量通知监听器减少重绘
 * - LRU 缓存策略限制内存占用
 * - 预计算常用尺寸值
 * 
 * @example
 * ```ts
 * // 创建实例
 * const manager = new SizeManager({ storageKey: 'my-size' })
 * 
 * // 应用预设
 * manager.applyPreset('comfortable')
 * 
 * // 监听变化
 * manager.subscribe((config) => {
 *   console.log('尺寸变化:', config.baseSize)
 * })
 * ```
 */

import { PERFORMANCE_CONFIG } from '../constants/performance'
import { SIZE_CONFIG, SIZE_MULTIPLIERS, CSS_IDENTIFIERS } from '../constants/sizes'

/**
 * 尺寸配置接口
 */
export interface SizeConfig {
  /** 基础字体大小（像素） */
  baseSize: number
}

/**
 * 尺寸方案类型（SizeConfig 的别名）
 */
export type SizeScheme = SizeConfig

/**
 * 尺寸预设接口
 */
export interface SizePreset {
  /** 预设名称（唯一标识） */
  name: string
  /** 显示标签 */
  label: string
  /** 描述文本 */
  description?: string
  /** 基础尺寸值 */
  baseSize: number
  /** 分类（可选） */
  category?: string
}

/**
 * 尺寸变化监听器类型
 */
export type SizeChangeListener = (config: SizeConfig) => void

// 使用配置常量
const DEFAULT_STORAGE_KEY = SIZE_CONFIG.DEFAULT_STORAGE_KEY
const { MAX_CSS_CACHE_SIZE, LISTENER_BATCH_SIZE } = PERFORMANCE_CONFIG
const { SIZE_STYLE_ID } = CSS_IDENTIFIERS

// Default presets
const defaultPresets: SizePreset[] = [
  {
    name: 'compact',
    label: 'Compact',
    description: 'High density for maximum content',
    baseSize: 14,
    category: 'density'
  },
  {
    name: 'comfortable',
    label: 'Comfortable',
    description: 'Balanced spacing for everyday use',
    baseSize: 16,
    category: 'density'
  },
  {
    name: 'default',
    label: 'Default',
    description: 'Standard size settings',
    baseSize: 16,
    category: 'density'
  },
  {
    name: 'spacious',
    label: 'Spacious',
    description: 'Lower density for better readability',
    baseSize: 18,
    category: 'density'
  }
]

/**
 * 尺寸管理器类
 * 
 * 管理整个应用的尺寸系统，包括预设配置、CSS 生成和持久化
 */
export class SizeManager {
  /** 当前尺寸配置 */
  private config: SizeConfig

  /** 预设配置映射表（name -> preset） */
  private presets: Map<string, SizePreset>

  /** 监听器集合（使用 Set 自动去重） */
  private listeners: Set<SizeChangeListener>

  /** 样式元素引用（用于注入 CSS） */
  private styleElement: HTMLStyleElement | null = null

  /** 当前预设名称 */
  private currentPresetName: string = 'default'

  /** localStorage 存储键名 */
  private storageKey: string

  /** 管理器是否已销毁 */
  private isDestroyed = false

  /** CSS 缓存映射（cacheKey -> css） */
  private cssCache = new Map<string, string>()

  /** 上次生成的 CSS 字符串（用于去重） */
  private lastGeneratedCSS = ''

  /** 待通知的监听器列表（批量处理用） */
  private pendingListenerNotifications: SizeChangeListener[] = []

  /** 是否已调度通知（防止重复调度） */
  private notificationScheduled = false

  /**
   * 构造函数
   * 
   * @param options - 配置选项
   * @param options.storageKey - localStorage 存储键名
   * @param options.presets - 自定义预设数组
   */
  constructor(options: { storageKey?: string; presets?: SizePreset[] } = {}) {
    // 初始化存储键名
    this.storageKey = options.storageKey || DEFAULT_STORAGE_KEY

    // 初始化默认配置
    this.config = {
      baseSize: SIZE_CONFIG.DEFAULT_BASE_SIZE
    }

    // 初始化预设映射表
    this.presets = new Map()

    // 初始化监听器集合（使用 Set 自动去重和高效删除）
    this.listeners = new Set()

    // 加载默认预设
    defaultPresets.forEach(preset => {
      this.presets.set(preset.name, preset)
    })

    // 加载自定义预设
    if (options.presets) {
      options.presets.forEach(preset => {
        this.presets.set(preset.name, preset)
      })
    }

    // 从存储加载保存的配置
    this.loadFromStorage()

    // 应用初始尺寸（生成并注入 CSS）
    this.applySize()
  }

  /**
   * 获取当前配置（返回副本）
   * 
   * @returns 当前尺寸配置的副本
   */
  getConfig(): SizeConfig {
    return { ...this.config }
  }

  /**
   * 设置配置
   * 
   * 会触发 CSS 重新生成、持久化保存和监听器通知
   * 
   * @param config - 要更新的配置（部分）
   * @throws {Error} 如果 baseSize 无效
   */
  setConfig(config: Partial<SizeConfig>): void {
    // 验证配置
    if (config.baseSize !== undefined) {
      if (typeof config.baseSize !== 'number' || config.baseSize <= 0 || config.baseSize > 100) {
        throw new Error('Invalid baseSize: must be a positive number between 0 and 100')
      }
    }

    // 合并配置
    this.config = {
      ...this.config,
      ...config
    }

    try {
      // 应用新配置
      this.applySize()
      // 保存到存储
      this.saveToStorage()
      // 通知监听器
      this.notifyListeners()
    } catch (error) {
      console.error('[SizeManager] Failed to apply config:', error)
      throw error
    }
  }

  /**
   * 设置基础尺寸
   * 
   * @param baseSize - 基础字体大小（像素）
   */
  setBaseSize(baseSize: number): void {
    this.setConfig({ baseSize })
  }

  /**
   * 应用预设配置
   * 
   * @param presetName - 预设名称
   */
  applyPreset(presetName: string): void {
    const preset = this.presets.get(presetName)
    if (!preset) {
      console.warn(`[SizeManager] Preset '${presetName}' not found, available presets:`, Array.from(this.presets.keys()))
      return
    }

    console.info(`[SizeManager] 应用预设: ${presetName}, baseSize: ${preset.baseSize}px`)
    this.currentPresetName = presetName
    // 清除 lastGeneratedCSS 以确保 CSS 会被重新应用
    this.lastGeneratedCSS = ''
    this.setConfig({
      baseSize: preset.baseSize
    })
    console.info(`[SizeManager] 预设应用完成: ${presetName}`)
  }

  /**
   * 获取当前预设名称
   * 
   * @returns 当前预设名称
   */
  getCurrentPreset(): string {
    return this.currentPresetName
  }

  /**
   * 获取当前尺寸（getCurrentPreset 的别名）
   * 
   * @returns 当前预设名称
   */
  getCurrentSize(): string {
    return this.currentPresetName
  }

  /**
   * 设置尺寸（applyPreset 的别名）
   * 
   * @param size - 预设名称
   */
  setSize(size: string): void {
    this.applyPreset(size)
  }

  /**
   * 获取所有预设名称列表
   * 
   * @returns 预设名称数组
   */
  getSizes(): string[] {
    return Array.from(this.presets.keys())
  }

  /**
   * 获取所有预设配置
   * 
   * @returns 预设配置数组
   */
  getPresets(): SizePreset[] {
    return Array.from(this.presets.values())
  }

  /**
   * 添加自定义预设
   * 
   * @param preset - 预设配置
   */
  addPreset(preset: SizePreset): void {
    this.presets.set(preset.name, preset)
  }

  /**
   * 应用尺寸配置（生成并注入 CSS）
   * 
   * 性能优化：
   * - 复用已存在的 style 元素
   * - 检查 CSS 是否变化，避免无效更新
   * - 使用 textContent 提升性能
   * 
   * @private
   */
  private applySize(): void {
    // 服务端渲染环境跳过
    if (typeof document === 'undefined') return

    // 生成 CSS
    const css = this.generateCSS()

    // 首先检查是否已存在 style 元素（处理 HMR 或多实例情况）
    if (!this.styleElement) {
      const existingElement = document.getElementById(SIZE_STYLE_ID)
      if (existingElement && existingElement instanceof HTMLStyleElement) {
        this.styleElement = existingElement
      } else {
        this.styleElement = document.createElement('style')
        this.styleElement.id = SIZE_STYLE_ID
        document.head.appendChild(this.styleElement)
      }
    }

    // 如果 CSS 没有变化，避免重新渲染（性能优化）
    if (css === this.lastGeneratedCSS && this.styleElement.textContent === css) {
      return
    }

    // 使用 textContent 比 innerHTML 更快更安全
    this.styleElement.textContent = css
    this.lastGeneratedCSS = css
  }

  /**
   * 生成完整的 CSS 字符串
   * 
   * 性能优化：
   * - 使用缓存避免重复生成
   * - 预计算所有尺寸值
   * - 使用 Uint16Array 减少内存占用
   * 
   * @returns CSS 字符串
   */
  private generateCSS(): string {
    const { baseSize } = this.config

    // 检查 CSS 缓存
    const cacheKey = `${baseSize}:${this.currentPresetName}`
    if (this.cssCache.has(cacheKey)) {
      return this.cssCache.get(cacheKey)!
    }

    // LRU 缓存策略：限制缓存大小
    if (this.cssCache.size >= MAX_CSS_CACHE_SIZE) {
      const firstKey = this.cssCache.keys().next().value
      if (firstKey !== undefined) {
        this.cssCache.delete(firstKey)
      }
    }

    // 使用 Uint16Array 预计算所有值，减少内存分配
    const multipliers = SIZE_MULTIPLIERS as readonly number[]
    const values = new Uint16Array(multipliers.length)

    // 预计算所有尺寸值
    for (let i = 0; i < multipliers.length; i++) {
      values[i] = Math.round(baseSize * multipliers[i])
    }

    // 创建快速查找映射（缓存计算结果）
    const valueCache = new Map<number, string>()

    /**
     * 根据倍数获取像素值字符串
     * 
     * @param multiplier - 尺寸倍数
     * @returns 像素值字符串（如 "16px"）
     */
    const getScaledSize = (multiplier: number): string => {
      // 检查缓存
      if (valueCache.has(multiplier)) {
        return valueCache.get(multiplier)!
      }

      // 尝试从预计算数组中获取
      const idx = multipliers.indexOf(multiplier)
      if (idx !== -1) {
        const value = values[idx]
        const result = value === 0 ? '0' : `${value}px`
        valueCache.set(multiplier, result)
        return result
      }

      // 计算新值
      const value = Math.round(baseSize * multiplier)
      const result = value === 0 ? '0' : `${value}px`
      valueCache.set(multiplier, result)
      return result
    }

    // 生成 CSS 字符串（使用数组 join 提升性能）
    const css = `
      :root {
        /* Base Configuration */
        --size-base: ${baseSize}px;
        --size-base-rem: ${baseSize / 16}rem;
        --size-scale: ${baseSize / 16};

        /* Base Size Tokens (TDesign style - 2px increment) */
        --size-0: 0px;
        --size-1: ${getScaledSize(0.125)};
        --size-2: ${getScaledSize(0.25)};
        --size-3: ${getScaledSize(0.375)};
        --size-4: ${getScaledSize(0.5)};
        --size-5: ${getScaledSize(0.75)};
        --size-6: ${getScaledSize(1)};
        --size-7: ${getScaledSize(1.25)};
        --size-8: ${getScaledSize(1.5)};
        --size-9: ${getScaledSize(1.75)};
        --size-10: ${getScaledSize(2)};
        --size-11: ${getScaledSize(2.25)};
        --size-12: ${getScaledSize(2.5)};
        --size-13: ${getScaledSize(3)};
        --size-14: ${getScaledSize(3.5)};
        --size-15: ${getScaledSize(4)};
        --size-16: ${getScaledSize(4.5)};
        --size-17: ${getScaledSize(5)};
        --size-18: ${getScaledSize(6)};
        --size-19: ${getScaledSize(7)};
        --size-20: ${getScaledSize(8)};
        --size-24: ${getScaledSize(12)};
        --size-32: ${getScaledSize(16)};
        --size-40: ${getScaledSize(20)};
        --size-48: ${getScaledSize(24)};
        --size-56: ${getScaledSize(28)};
        --size-64: ${getScaledSize(32)};

        /* Font Sizes */
        --size-font-2xs: ${getScaledSize(0.625)}; /* 10px */
        --size-font-xs: ${getScaledSize(0.6875)}; /* 11px */
        --size-font-sm: ${getScaledSize(0.75)};   /* 12px */
        --size-font-base: ${getScaledSize(0.875)}; /* 14px */
        --size-font-md: ${getScaledSize(1)};       /* 16px */
        --size-font-lg: ${getScaledSize(1.125)};   /* 18px */
        --size-font-xl: ${getScaledSize(1.25)};    /* 20px */
        --size-font-2xl: ${getScaledSize(1.5)};    /* 24px */
        --size-font-3xl: ${getScaledSize(1.875)};  /* 30px */
        --size-font-4xl: ${getScaledSize(2.25)};   /* 36px */
        
        /* Legacy Support */
        --size-font-tiny: var(--size-font-2xs);
        --size-font-small: var(--size-font-sm);
        --size-font-medium: var(--size-font-base);
        --size-font-large: var(--size-font-md);
        --size-font-huge: var(--size-font-lg);
        --size-font-giant: var(--size-font-xl);
        
        /* Heading Sizes */
        --size-font-h1: ${getScaledSize(1.75)};
        --size-font-h2: ${getScaledSize(1.5)};
        --size-font-h3: ${getScaledSize(1.25)};
        --size-font-h4: ${getScaledSize(1.125)};
        --size-font-h5: ${getScaledSize(1)};
        --size-font-h6: ${getScaledSize(0.875)};
        
        /* Display Sizes */
        --size-font-display1: ${getScaledSize(3)};
        --size-font-display2: ${getScaledSize(2.625)};
        --size-font-display3: ${getScaledSize(2.25)};
        
        /* Special Font Sizes */
        --size-font-caption: ${getScaledSize(0.6875)};
        --size-font-overline: ${getScaledSize(0.625)};
        --size-font-code: ${getScaledSize(0.8125)};

        /* Spacing System - Semantic */
        --size-spacing-none: 0;
        --size-spacing-3xs: ${getScaledSize(0.0625)};  /* 1px */
        --size-spacing-2xs: ${getScaledSize(0.125)};   /* 2px */
        --size-spacing-xs: ${getScaledSize(0.25)};     /* 4px */
        --size-spacing-sm: ${getScaledSize(0.375)};    /* 6px */
        --size-spacing-md: ${getScaledSize(0.5)};      /* 8px */
        --size-spacing-lg: ${getScaledSize(0.75)};     /* 12px */
        --size-spacing-xl: ${getScaledSize(1)};        /* 16px */
        --size-spacing-2xl: ${getScaledSize(1.5)};     /* 24px */
        --size-spacing-3xl: ${getScaledSize(2)};       /* 32px */
        --size-spacing-4xl: ${getScaledSize(3)};       /* 48px */
        
        /* Legacy Support */
        --size-spacing-tiny: var(--size-spacing-2xs);
        --size-spacing-small: var(--size-spacing-xs);
        --size-spacing-medium: var(--size-spacing-md);
        --size-spacing-large: var(--size-spacing-lg);
        --size-spacing-huge: var(--size-spacing-xl);
        --size-spacing-giant: var(--size-spacing-2xl);
        --size-spacing-massive: var(--size-spacing-3xl);
        --size-spacing-colossal: var(--size-spacing-4xl);

        /* Component Heights */
        --size-comp-size-xxxs: var(--size-6);
        --size-comp-size-xxs: var(--size-7);
        --size-comp-size-xs: var(--size-8);
        --size-comp-size-s: var(--size-9);
        --size-comp-size-m: var(--size-10);
        --size-comp-size-l: var(--size-11);
        --size-comp-size-xl: var(--size-12);
        --size-comp-size-xxl: var(--size-13);
        --size-comp-size-xxxl: var(--size-14);
        --size-comp-size-xxxxl: var(--size-15);
        --size-comp-size-xxxxxl: var(--size-16);

        /* Popup Padding */
        --size-pop-padding-s: var(--size-2);
        --size-pop-padding-m: var(--size-3);
        --size-pop-padding-l: var(--size-4);
        --size-pop-padding-xl: var(--size-5);
        --size-pop-padding-xxl: var(--size-6);

        /* Component Padding LR */
        --size-comp-paddingLR-xxs: var(--size-1);
        --size-comp-paddingLR-xs: var(--size-2);
        --size-comp-paddingLR-s: var(--size-4);
        --size-comp-paddingLR-m: var(--size-5);
        --size-comp-paddingLR-l: var(--size-6);
        --size-comp-paddingLR-xl: var(--size-8);
        --size-comp-paddingLR-xxl: var(--size-10);

        /* Component Padding TB */
        --size-comp-paddingTB-xxs: var(--size-1);
        --size-comp-paddingTB-xs: var(--size-2);
        --size-comp-paddingTB-s: var(--size-3);
        --size-comp-paddingTB-m: var(--size-4);
        --size-comp-paddingTB-l: var(--size-5);
        --size-comp-paddingTB-xl: var(--size-6);
        --size-comp-paddingTB-xxl: var(--size-8);

        /* Component Margins */
        --size-comp-margin-xxs: var(--size-1);
        --size-comp-margin-xs: var(--size-2);
        --size-comp-margin-s: var(--size-4);
        --size-comp-margin-m: var(--size-5);
        --size-comp-margin-l: var(--size-6);
        --size-comp-margin-xl: var(--size-7);
        --size-comp-margin-xxl: var(--size-8);
        --size-comp-margin-xxxl: var(--size-10);
        --size-comp-margin-xxxxl: var(--size-12);

        /* Border Radius - Consistent System */
        --size-radius-none: 0;
        --size-radius-xs: ${getScaledSize(0.125)};     /* 2px */
        --size-radius-sm: ${getScaledSize(0.25)};      /* 4px */
        --size-radius-md: ${getScaledSize(0.375)};     /* 6px */
        --size-radius-lg: ${getScaledSize(0.5)};       /* 8px */
        --size-radius-xl: ${getScaledSize(0.75)};      /* 12px */
        --size-radius-2xl: ${getScaledSize(1)};        /* 16px */
        --size-radius-3xl: ${getScaledSize(1.5)};      /* 24px */
        --size-radius-full: 9999px;
        --size-radius-circle: 50%;
        
        /* Legacy Support */
        --size-radius-small: var(--size-radius-sm);
        --size-radius-medium: var(--size-radius-md);
        --size-radius-large: var(--size-radius-lg);
        --size-radius-huge: var(--size-radius-xl);

        /* Line Heights */
        --size-line-none: 1.0;
        --size-line-tight: 1.25;
        --size-line-snug: 1.375;
        --size-line-normal: 1.5;
        --size-line-relaxed: 1.625;
        --size-line-loose: 2.0;

        /* Letter Spacing */
        --size-letter-tighter: -0.05em;
        --size-letter-tight: -0.025em;
        --size-letter-normal: 0;
        --size-letter-wide: 0.025em;
        --size-letter-wider: 0.05em;
        --size-letter-widest: 0.1em;

        /* Font Families */
        --size-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        --size-font-family-mono: "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

        /* Font Weights */
        --size-font-weight-thin: 100;
        --size-font-weight-extralight: 200;
        --size-font-weight-light: 300;
        --size-font-weight-regular: 400;
        --size-font-weight-medium: 500;
        --size-font-weight-semibold: 600;
        --size-font-weight-bold: 700;
        --size-font-weight-extrabold: 800;
        --size-font-weight-black: 900;

        /* Border Widths */
        --size-border-width-thin: 1px;
        --size-border-width-medium: 2px;
        --size-border-width-thick: 3px;

        /* Shadows */
        --size-shadow-1: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --size-shadow-2: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        --size-shadow-3: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --size-shadow-4: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        --size-shadow-5: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        --size-shadow-6: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

        /* Z-Index */
        --size-z-dropdown: 1000;
        --size-z-sticky: 1020;
        --size-z-fixed: 1030;
        --size-z-modal-backdrop: 1040;
        --size-z-modal: 1050;
        --size-z-popover: 1060;
        --size-z-tooltip: 1070;
        --size-z-notification: 1080;

        /* Animation Durations */
        --size-duration-instant: 0ms;
        --size-duration-fast: 150ms;
        --size-duration-normal: 300ms;
        --size-duration-slow: 450ms;
        --size-duration-slower: 600ms;

        /* Easing Functions */
        --size-ease-linear: linear;
        --size-ease-in: cubic-bezier(0.4, 0, 1, 1);
        --size-ease-out: cubic-bezier(0, 0, 0.2, 1);
        --size-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

        /* Button Sizes */
        --size-btn-height-tiny: ${getScaledSize(1.5)};
        --size-btn-height-small: ${getScaledSize(1.75)};
        --size-btn-height-medium: ${getScaledSize(2)};
        --size-btn-height-large: ${getScaledSize(2.25)};
        --size-btn-height-huge: ${getScaledSize(2.5)};
        --size-btn-padding-tiny: 0 ${getScaledSize(0.5)};
        --size-btn-padding-small: 0 ${getScaledSize(0.625)};
        --size-btn-padding-medium: 0 ${getScaledSize(0.875)};
        --size-btn-padding-large: 0 ${getScaledSize(1)};
        --size-btn-padding-huge: 0 ${getScaledSize(1.25)};

        /* Input Sizes */
        --size-input-height-small: ${getScaledSize(1.75)};
        --size-input-height-medium: ${getScaledSize(2)};
        --size-input-height-large: ${getScaledSize(2.25)};
        --size-input-padding-small: ${getScaledSize(0.25)} ${getScaledSize(0.5)};
        --size-input-padding-medium: ${getScaledSize(0.375)} ${getScaledSize(0.625)};
        --size-input-padding-large: ${getScaledSize(0.5)} ${getScaledSize(0.75)};

        /* Icon Sizes */
        --size-icon-tiny: ${getScaledSize(0.75)};
        --size-icon-small: ${getScaledSize(0.875)};
        --size-icon-medium: ${getScaledSize(1)};
        --size-icon-large: ${getScaledSize(1.25)};
        --size-icon-huge: ${getScaledSize(1.5)};
        --size-icon-giant: ${getScaledSize(2)};

        /* Avatar Sizes */
        --size-avatar-tiny: ${getScaledSize(1.25)};
        --size-avatar-small: ${getScaledSize(1.5)};
        --size-avatar-medium: ${getScaledSize(2)};
        --size-avatar-large: ${getScaledSize(2.5)};
        --size-avatar-huge: ${getScaledSize(3)};
        --size-avatar-giant: ${getScaledSize(4)};

        /* Card Padding */
        --size-card-padding-small: ${getScaledSize(0.5)};
        --size-card-padding-medium: ${getScaledSize(0.75)};
        --size-card-padding-large: ${getScaledSize(1)};

        /* Table Sizes */
        --size-table-row-height-small: ${getScaledSize(2.25)};
        --size-table-row-height-medium: ${getScaledSize(2.75)};
        --size-table-row-height-large: ${getScaledSize(3.25)};

        /* Form Sizes */
        --size-form-label-margin: 0 0 ${getScaledSize(0.125)} 0;
        --size-form-group-margin: 0 0 ${getScaledSize(1)} 0;

        /* Tag/Badge Sizes */
        --size-tag-height: ${getScaledSize(1.5)};
        --size-tag-padding: 0 ${getScaledSize(0.25)};

        /* Modal Sizes */
        --size-modal-width-small: ${getScaledSize(25)};
        --size-modal-width-medium: ${getScaledSize(37.5)};
        --size-modal-width-large: ${getScaledSize(50)};

        /* Drawer Sizes */
        --size-drawer-width-small: ${getScaledSize(20)};
        --size-drawer-width-medium: ${getScaledSize(30)};
        --size-drawer-width-large: ${getScaledSize(40)};

        /* Container Widths */
        --size-container-sm: 640px;
        --size-container-md: 768px;
        --size-container-lg: 1024px;
        --size-container-xl: 1280px;
        --size-container-xxl: 1536px;
      }
    `

    // 缓存生成的CSS
    if (this.cssCache.size > 20) {
      // 限制缓存大小
      const firstKey = this.cssCache.keys().next().value
      if (firstKey !== undefined) {
        this.cssCache.delete(firstKey)
      }
    }
    this.cssCache.set(cacheKey, css)
    this.lastGeneratedCSS = css

    return css
  }

  /**
   * 从 localStorage 加载保存的配置
   * 
   * @private
   */
  private loadFromStorage(): void {
    // 服务端渲染环境跳过
    if (typeof localStorage === 'undefined') return

    try {
      const saved = localStorage.getItem(this.storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.config) {
          this.config = data.config
        }
        if (data.presetName) {
          this.currentPresetName = data.presetName
        }
      }
    } catch (e) {
      console.error('[SizeManager] Failed to load config from storage:', e)
    }
  }

  /**
   * 保存当前配置到 localStorage
   * 
   * @private
   */
  private saveToStorage(): void {
    // 服务端渲染环境跳过
    if (typeof localStorage === 'undefined') return

    try {
      const data = {
        config: this.config,
        presetName: this.currentPresetName
      }
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (e) {
      console.error('[SizeManager] Failed to save config to storage:', e)
    }
  }

  /**
   * 订阅配置变化事件
   * 
   * @param listener - 变化监听器函数
   * @returns 取消订阅函数
   * 
   * @example
   * ```ts
   * const unsubscribe = manager.subscribe((config) => {
   *   console.log('Size changed:', config.baseSize)
   * })
   * 
   * // 取消订阅
   * unsubscribe()
   * ```
   */
  subscribe(listener: SizeChangeListener): () => void {
    if (!this.listeners || this.isDestroyed) {
      console.warn('[SizeManager] Cannot subscribe: manager not initialized or destroyed')
      return () => { }
    }

    this.listeners.add(listener)

    // 返回清理函数，确保内存正确释放
    return () => {
      if (this.listeners && !this.isDestroyed) {
        this.listeners.delete(listener)
      }
    }
  }

  /**
   * 监听配置变化（subscribe 的别名）
   * 
   * @param listener - 变化监听器函数
   * @returns 取消订阅函数
   */
  onChange(listener: SizeChangeListener): () => void {
    return this.subscribe(listener)
  }

  /**
   * 通知所有监听器配置已变化
   * 
   * 性能优化：
   * - 使用 requestIdleCallback 在空闲时执行，不阻塞主线程
   * - 批量处理监听器，每批处理固定数量
   * - 防止重复调度
   * 
   * @private
   */
  private notifyListeners(): void {
    // 如果已经调度或没有监听器，直接返回
    if (this.notificationScheduled || this.listeners.size === 0) {
      return
    }

    // 标记为已调度，防止重复
    this.notificationScheduled = true
    this.pendingListenerNotifications = Array.from(this.listeners)

    // 使用 requestIdleCallback 在空闲时通知（优先级低）
    // 如果不支持则降级到 setTimeout
    const scheduleNotification = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 0)

    scheduleNotification(() => {
      const listeners = this.pendingListenerNotifications
      this.pendingListenerNotifications = []
      this.notificationScheduled = false

      // 如果管理器已销毁，不再通知
      if (this.isDestroyed) {
        return
      }

      // 批量执行监听器
      const batchSize = LISTENER_BATCH_SIZE
      let index = 0

      /**
       * 处理一批监听器
       */
      const processBatch = () => {
        const startTime = performance.now()
        const maxTime = PERFORMANCE_CONFIG.MAX_BATCH_TIME

        // 处理当前批次
        while (index < listeners.length) {
          try {
            listeners[index](this.config)
          } catch (error) {
            console.error('[SizeManager] Listener error:', error)
          }
          index++

          // 如果超过时间预算，让出主线程
          if (performance.now() - startTime > maxTime && index < listeners.length) {
            scheduleNotification(processBatch)
            return
          }
        }
      }

      processBatch()
    })
  }

  /**
   * 销毁管理器，清理所有资源
   * 
   * 包括：
   * - 移除 DOM 中的 style 元素
   * - 清理所有监听器
   * - 清空预设和缓存
   * - 标记为已销毁状态
   * 
   * @example
   * ```ts
   * const manager = new SizeManager()
   * // ... 使用管理器
   * manager.destroy() // 清理资源
   * ```
   */
  destroy(): void {
    if (this.isDestroyed) return

    // 清理 DOM 元素
    if (this.styleElement?.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement)
      this.styleElement = null
    }

    // 清理监听器
    if (this.listeners instanceof Set) {
      this.listeners.clear()
    }
    this.pendingListenerNotifications = []

    // 清理预设映射表
    this.presets.clear()

    // 清理缓存
    this.cssCache.clear()
    this.lastGeneratedCSS = ''

    // 标记为已销毁
    this.isDestroyed = true
  }
}

/**
 * 默认导出的单例实例
 * 
 * 可以在整个应用中共享使用
 * 
 * @example
 * ```ts
 * import { sizeManager } from '@ldesign/size'
 * 
 * sizeManager.applyPreset('comfortable')
 * ```
 */
export const sizeManager = new SizeManager()