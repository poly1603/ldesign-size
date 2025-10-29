/**
 * @ldesign/size - 尺寸配置常量
 * 
 * 定义所有尺寸相关的默认值和约束
 */

/**
 * 尺寸配置常量
 */
export const SIZE_CONFIG = {
  // ==================== 基础尺寸配置 ====================

  /** 默认根字体大小（浏览器标准） */
  DEFAULT_ROOT_FONT_SIZE: 16,

  /** 默认基础尺寸 */
  DEFAULT_BASE_SIZE: 14,

  /** 最小基础尺寸 */
  MIN_BASE_SIZE: 10,

  /** 最大基础尺寸 */
  MAX_BASE_SIZE: 24,

  // ==================== 预设尺寸 ====================

  /** 紧凑预设基础尺寸 */
  PRESET_COMPACT_SIZE: 14,

  /** 舒适预设基础尺寸 */
  PRESET_COMFORTABLE_SIZE: 16,

  /** 默认预设基础尺寸 */
  PRESET_DEFAULT_SIZE: 16,

  /** 宽松预设基础尺寸 */
  PRESET_SPACIOUS_SIZE: 18,

  // ==================== 单位转换 ====================

  /** Points 到 Pixels 的转换因子 */
  PT_TO_PX: 96 / 72,

  /** Pixels 到 Points 的转换因子 */
  PX_TO_PT: 72 / 96,

  // ==================== 存储配置 ====================

  /** localStorage 默认键名 */
  DEFAULT_STORAGE_KEY: 'ldesign-size-scheme',

  /** 主题 localStorage 键名 */
  DEFAULT_THEME_STORAGE_KEY: 'ldesign-theme',
} as const

/**
 * 尺寸单位常量
 * 
 * 预定义的单位字符串，减少重复字符串创建
 */
export const UNITS = {
  /** 像素单位 */
  PX: 'px' as const,

  /** rem 单位（相对根元素） */
  REM: 'rem' as const,

  /** em 单位（相对父元素） */
  EM: 'em' as const,

  /** 视口宽度单位 */
  VW: 'vw' as const,

  /** 视口高度单位 */
  VH: 'vh' as const,

  /** 百分比单位 */
  PERCENT: '%' as const,

  /** Points 单位（打印） */
  PT: 'pt' as const,
} as const

/**
 * CSS 选择器和 ID 常量
 */
export const CSS_IDENTIFIERS = {
  /** Size 样式元素 ID */
  SIZE_STYLE_ID: 'ldesign-size-styles',

  /** 过渡动画样式元素 ID */
  TRANSITION_STYLE_ID: 'ldesign-size-transitions',

  /** 主题样式元素 ID */
  THEME_STYLE_ID: 'ldesign-theme-styles',

  /** 默认根选择器 */
  ROOT_SELECTOR: ':root',

  /** 无过渡 class */
  NO_TRANSITION_CLASS: 'no-transition',
} as const

/**
 * 预定义的常用尺寸值（用于初始化缓存）
 */
export const COMMON_SIZES = Object.freeze([
  0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64,
]) as readonly number[]

/**
 * 尺寸倍数表（用于 CSS 变量生成）
 * 
 * 这些倍数用于根据基础尺寸计算各种派生尺寸
 */
export const SIZE_MULTIPLIERS = Object.freeze([
  0, 0.0625, 0.125, 0.25, 0.375, 0.5, 0.625, 0.6875, 0.75, 0.8125,
  0.875, 1, 1.125, 1.25, 1.375, 1.5, 1.625, 1.75, 1.875, 2,
  2.25, 2.5, 2.625, 2.75, 3, 3.5, 4, 4.5, 5, 6, 7, 8,
  12, 16, 20, 24, 28, 32,
]) as readonly number[]

/**
 * 尺寸配置类型
 */
export type SizeConfig = typeof SIZE_CONFIG

/**
 * 获取尺寸配置
 * 
 * @param key - 配置键名
 * @returns 配置值
 */
export function getSizeConfig<K extends keyof SizeConfig>(key: K): SizeConfig[K] {
  return SIZE_CONFIG[key]
}


