/**
 * 基础尺寸适配器
 * 
 * 框架无关的尺寸主题管理基类，提供核心逻辑
 * 
 * @module adapter/BaseSizeAdapter
 */

import { SizeManager } from '../core/SizeManager'
import type { SizeConfig } from '../core/SizeManager'
import {
  getPresetByName,
  getPresetConfig,
  mergePresets,
  sizePresetThemes,
} from '../presets/sizePresets'
import type { SizePresetConfig, SizePresetTheme } from '../presets/sizePresets'

/**
 * 持久化配置
 */
export interface SizePersistenceConfig {
  /** 是否启用持久化 */
  enabled?: boolean
  /** 存储键名 */
  key?: string
  /** 存储类型 */
  storage?: 'localStorage' | 'sessionStorage'
}

/**
 * 尺寸适配器选项
 */
export interface SizeAdapterOptions {
  /** 基础尺寸（像素） */
  baseSize?: number
  /** 缩放比例 */
  scale?: number
  /** 单位 */
  unit?: 'px' | 'rem' | 'em'
  /** 自定义预设数组 */
  customPresets?: SizePresetTheme[]
  /** 持久化配置 */
  persistence?: SizePersistenceConfig
  /** 是否立即初始化 */
  immediate?: boolean
  /** 预设名称（用于初始化） */
  presetName?: string
}

/**
 * 适配器状态
 */
export interface SizeAdapterState {
  /** 当前预设 */
  currentPreset: SizePresetTheme | null
  /** 所有预设（内置 + 自定义） */
  presets: SizePresetTheme[]
  /** 是否正在加载 */
  isLoading: boolean
  /** 当前基础尺寸 */
  baseSize: number
  /** 当前缩放比例 */
  scale: number
  /** 当前单位 */
  unit: 'px' | 'rem' | 'em'
}

/**
 * 基础尺寸适配器
 * 
 * 提供框架无关的尺寸主题管理功能
 */
export class BaseSizeAdapter {
  /** 尺寸管理器 */
  protected manager: SizeManager

  /** 适配器状态 */
  protected state: SizeAdapterState

  /** 持久化配置 */
  protected persistenceConfig: SizePersistenceConfig

  /**
   * 构造函数
   * 
   * @param options - 适配器选项
   */
  constructor(options: SizeAdapterOptions = {}) {
    const {
      baseSize = 16,
      scale = 1.25,
      unit = 'px',
      customPresets,
      persistence = {},
      immediate = true,
      presetName,
    } = options

    // 初始化管理器
    this.manager = new SizeManager({
      baseSize,
      scale,
      unit,
    } as SizeConfig)

    // 合并内置预设和自定义预设
    const mergedPresets = customPresets
      ? mergePresets(customPresets)
      : sizePresetThemes

    // 初始化状态
    this.state = {
      currentPreset: null,
      presets: mergedPresets,
      isLoading: false,
      baseSize,
      scale,
      unit,
    }

    // 持久化配置
    this.persistenceConfig = {
      enabled: persistence.enabled ?? false,
      key: persistence.key ?? 'ldesign-size-preset',
      storage: persistence.storage ?? 'localStorage',
    }

    // 立即初始化
    if (immediate) {
      this.initialize(presetName)
    }
  }

  /**
   * 初始化适配器
   * 
   * @param presetName - 预设名称（可选）
   */
  initialize(presetName?: string): void {
    // 1. 尝试从存储加载
    if (this.persistenceConfig.enabled) {
      const loaded = this.loadFromStorage()
      if (loaded) {
        return
      }
    }

    // 2. 使用指定的预设
    if (presetName) {
      this.applyPreset(presetName)
      return
    }

    // 3. 使用默认预设
    this.applyPreset('default')
  }

  /**
   * 应用预设
   *
   * @param name - 预设名称
   */
  applyPreset(name: string): void {
    const preset = getPresetByName(name, this.state.presets)

    if (!preset) {
      console.warn(`[BaseSizeAdapter] Preset "${name}" not found`)
      return
    }

    // 更新状态
    this.state.currentPreset = preset
    this.state.baseSize = preset.config.baseSize
    this.state.scale = preset.config.scale
    this.state.unit = preset.config.unit

    // 应用到管理器
    this.manager.setConfig({
      baseSize: preset.config.baseSize,
      scale: preset.config.scale,
      unit: preset.config.unit,
    } as SizeConfig)

    // 保存到存储
    if (this.persistenceConfig.enabled) {
      this.saveToStorage()
    }
  }

  /**
   * 获取所有预设
   *
   * @returns 预设数组
   */
  getPresets(): SizePresetTheme[] {
    return this.state.presets
  }

  /**
   * 获取当前预设
   *
   * @returns 当前预设，如果没有则返回 null
   */
  getCurrentPreset(): SizePresetTheme | null {
    return this.state.currentPreset
  }

  /**
   * 获取当前状态
   *
   * @returns 适配器状态
   */
  getState(): SizeAdapterState {
    return { ...this.state }
  }

  /**
   * 设置基础尺寸
   *
   * @param size - 基础尺寸（像素）
   */
  setBaseSize(size: number): void {
    this.state.baseSize = size
    this.manager.setConfig({ baseSize: size } as SizeConfig)

    if (this.persistenceConfig.enabled) {
      this.saveToStorage()
    }
  }

  /**
   * 获取基础尺寸
   *
   * @returns 基础尺寸
   */
  getBaseSize(): number {
    return this.state.baseSize
  }

  /**
   * 设置缩放比例
   *
   * @param scale - 缩放比例
   */
  setScale(scale: number): void {
    this.state.scale = scale
    this.manager.setConfig({ scale } as SizeConfig)

    if (this.persistenceConfig.enabled) {
      this.saveToStorage()
    }
  }

  /**
   * 获取缩放比例
   *
   * @returns 缩放比例
   */
  getScale(): number {
    return this.state.scale
  }

  /**
   * 计算尺寸值
   *
   * @param level - 尺寸等级
   * @returns 计算后的尺寸值
   */
  compute(level: number): number {
    return this.manager.compute(level)
  }

  /**
   * 保存到存储
   */
  saveToStorage(): void {
    if (!this.persistenceConfig.enabled) {
      return
    }

    const { key, storage } = this.persistenceConfig
    const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage

    const data = {
      presetName: this.state.currentPreset?.name,
      baseSize: this.state.baseSize,
      scale: this.state.scale,
      unit: this.state.unit,
    }

    try {
      storageObj.setItem(key!, JSON.stringify(data))
    }
    catch (error) {
      console.error('[BaseSizeAdapter] Failed to save to storage:', error)
    }
  }

  /**
   * 从存储加载
   *
   * @returns 是否成功加载
   */
  loadFromStorage(): boolean {
    if (!this.persistenceConfig.enabled) {
      return false
    }

    const { key, storage } = this.persistenceConfig
    const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage

    try {
      const dataStr = storageObj.getItem(key!)
      if (!dataStr) {
        return false
      }

      const data = JSON.parse(dataStr)

      // 如果有预设名称，应用预设
      if (data.presetName) {
        this.applyPreset(data.presetName)
        return true
      }

      // 否则应用自定义配置
      this.state.baseSize = data.baseSize ?? 16
      this.state.scale = data.scale ?? 1.25
      this.state.unit = data.unit ?? 'px'

      this.manager.setConfig({
        baseSize: this.state.baseSize,
        scale: this.state.scale,
        unit: this.state.unit,
      } as SizeConfig)

      return true
    }
    catch (error) {
      console.error('[BaseSizeAdapter] Failed to load from storage:', error)
      return false
    }
  }

  /**
   * 清除存储
   */
  clearStorage(): void {
    if (!this.persistenceConfig.enabled) {
      return
    }

    const { key, storage } = this.persistenceConfig
    const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage

    try {
      storageObj.removeItem(key!)
    }
    catch (error) {
      console.error('[BaseSizeAdapter] Failed to clear storage:', error)
    }
  }
}

