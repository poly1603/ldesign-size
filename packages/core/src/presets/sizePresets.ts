/**
 * 尺寸预设主题管理
 * 
 * 提供内置的尺寸预设主题，以及预设的排序、合并等工具函数
 * 
 * @module presets/sizePresets
 */

/**
 * 尺寸预设主题配置
 */
export interface SizePresetConfig {
  /** 基础尺寸（像素） */
  baseSize: number
  /** 缩放比例 */
  scale: number
  /** 单位 */
  unit: 'px' | 'rem' | 'em'
  /** 行高 */
  lineHeight?: number
  /** 字间距 */
  letterSpacing?: number
}

/**
 * 尺寸预设主题
 */
export interface SizePresetTheme {
  /** 预设名称（唯一标识） */
  name: string
  /** 显示标签 */
  label: string
  /** 描述信息 */
  description?: string
  /** 排序字段（数字越小越靠前） */
  order?: number
  /** 是否为自定义主题 */
  custom?: boolean
  /** 尺寸配置 */
  config: SizePresetConfig
}

/**
 * 内置尺寸预设主题列表
 */
export const sizePresetThemes: SizePresetTheme[] = [
  {
    name: 'compact',
    label: 'Compact',
    description: 'Compact size system for information-dense interfaces',
    order: 1,
    config: {
      baseSize: 14,
      scale: 1.2,
      unit: 'px',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
  },
  {
    name: 'default',
    label: 'Default',
    description: 'Default size system balancing aesthetics and practicality',
    order: 2,
    config: {
      baseSize: 16,
      scale: 1.25,
      unit: 'px',
      lineHeight: 1.6,
      letterSpacing: 0,
    },
  },
  {
    name: 'comfortable',
    label: 'Comfortable',
    description: 'Comfortable size system for extended reading',
    order: 3,
    config: {
      baseSize: 18,
      scale: 1.333,
      unit: 'px',
      lineHeight: 1.7,
      letterSpacing: 0.02,
    },
  },
  {
    name: 'large',
    label: 'Large',
    description: 'Large size system for elderly and visually impaired',
    order: 4,
    config: {
      baseSize: 20,
      scale: 1.414,
      unit: 'px',
      lineHeight: 1.8,
      letterSpacing: 0.03,
    },
  },
]

/**
 * 按 order 字段对预设进行排序
 * 
 * @param presets - 预设数组
 * @returns 排序后的预设数组
 * 
 * @example
 * ```ts
 * const sorted = sortPresets([
 *   { name: 'a', order: 10, ... },
 *   { name: 'b', order: 1, ... },
 * ])
 * // sorted[0].name === 'b'
 * ```
 */
export function sortPresets(presets: SizePresetTheme[]): SizePresetTheme[] {
  return [...presets].sort((a, b) => {
    // 有 order 的排在前面
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) {
      return -1
    }
    if (b.order !== undefined) {
      return 1
    }
    // 都没有 order，保持原顺序
    return 0
  })
}

/**
 * 合并内置预设和自定义预设
 * 
 * 如果自定义预设的 name 与内置预设重复，自定义预设会覆盖内置预设
 * 
 * @param customPresets - 自定义预设数组
 * @returns 合并并排序后的预设数组
 * 
 * @example
 * ```ts
 * const merged = mergePresets([
 *   { name: 'default', label: '自定义默认', ... }, // 覆盖内置
 *   { name: 'custom', label: '自定义', ... },      // 新增
 * ])
 * ```
 */
export function mergePresets(customPresets: SizePresetTheme[] = []): SizePresetTheme[] {
  const presetsMap = new Map<string, SizePresetTheme>()

  // 先添加内置预设
  for (const preset of sizePresetThemes) {
    presetsMap.set(preset.name, preset)
  }

  // 再添加自定义预设（会覆盖同名的内置预设）
  for (const preset of customPresets) {
    presetsMap.set(preset.name, {
      ...preset,
      custom: preset.custom !== undefined ? preset.custom : true,
    })
  }

  // 转换为数组并排序
  const mergedPresets = Array.from(presetsMap.values())
  return sortPresets(mergedPresets)
}

/**
 * 根据名称获取预设
 *
 * @param name - 预设名称
 * @param presets - 预设数组（可选，默认使用内置预设）
 * @returns 预设对象，如果不存在则返回 undefined
 *
 * @example
 * ```ts
 * const preset = getPresetByName('default')
 * console.log(preset?.config.baseSize) // 16
 * ```
 */
export function getPresetByName(
  name: string,
  presets: SizePresetTheme[] = sizePresetThemes,
): SizePresetTheme | undefined {
  return presets.find(preset => preset.name === name)
}

/**
 * 根据预设名称获取配置
 *
 * @param name - 预设名称
 * @param presets - 预设数组（可选，默认使用内置预设）
 * @returns 预设配置，如果不存在则返回 undefined
 *
 * @example
 * ```ts
 * const config = getPresetConfig('default')
 * console.log(config?.baseSize) // 16
 * ```
 */
export function getPresetConfig(
  name: string,
  presets: SizePresetTheme[] = sizePresetThemes,
): SizePresetConfig | undefined {
  return getPresetByName(name, presets)?.config
}

/**
 * 预设名称类型（用于 TypeScript 类型提示）
 */
export type SizePresetName =
  | 'compact'
  | 'default'
  | 'comfortable'
  | 'large'


