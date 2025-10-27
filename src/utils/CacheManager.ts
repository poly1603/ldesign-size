/**
 * @ldesign/size - 缓存管理器
 * 
 * 统一管理所有缓存实例，提供统一的缓存策略和监控
 */

import { PERFORMANCE_CONFIG } from '../constants/performance'

/**
 * LRU 缓存实现
 * 
 * 最近最少使用（Least Recently Used）缓存策略
 * 当缓存满时，删除最久未使用的项
 * 
 * @template K - 键类型
 * @template V - 值类型
 */
export class LRUCache<K, V> {
  /** 缓存存储（使用 Map 保持插入顺序） */
  private cache = new Map<K, V>()

  /** 最大缓存大小 */
  private maxSize: number

  /** 命中次数统计 */
  private hits = 0

  /** 未命中次数统计 */
  private misses = 0

  /**
   * 构造函数
   * 
   * @param maxSize - 最大缓存数量
   */
  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }

  /**
   * 获取缓存项
   * 
   * 如果存在，会将该项移到最后（标记为最近使用）
   * 
   * @param key - 缓存键
   * @returns 缓存值或 undefined
   */
  get(key: K): V | undefined {
    const value = this.cache.get(key)

    if (value !== undefined) {
      // 命中：移动到末尾表示最近使用
      this.cache.delete(key)
      this.cache.set(key, value)
      this.hits++
    } else {
      // 未命中
      this.misses++
    }

    return value
  }

  /**
   * 设置缓存项
   * 
   * 如果缓存已满，删除最旧的项
   * 
   * @param key - 缓存键
   * @param value - 缓存值
   */
  set(key: K, value: V): void {
    // 如果已存在，先删除（后面会重新插入到末尾）
    this.cache.delete(key)

    // 如果达到最大大小，删除最旧的项（Map 的第一项）
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }

    // 插入新项到末尾
    this.cache.set(key, value)
  }

  /**
   * 检查缓存是否包含指定键
   * 
   * @param key - 缓存键
   * @returns 是否存在
   */
  has(key: K): boolean {
    return this.cache.has(key)
  }

  /**
   * 删除指定缓存项
   * 
   * @param key - 缓存键
   * @returns 是否成功删除
   */
  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
  }

  /**
   * 获取当前缓存大小
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * 获取缓存命中率
   * 
   * @returns 命中率（0-1之间）
   */
  getHitRate(): number {
    const total = this.hits + this.misses
    return total > 0 ? this.hits / total : 0
  }

  /**
   * 获取缓存统计信息
   * 
   * @returns 统计数据
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.getHitRate(),
    }
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.hits = 0
    this.misses = 0
  }
}

/**
 * 缓存类型枚举
 */
export enum CacheType {
  /** Size 对象池 */
  SIZE_POOL = 'SIZE_POOL',
  /** 字符串解析缓存 */
  PARSE = 'PARSE',
  /** 格式化缓存 */
  FORMAT = 'FORMAT',
  /** 单位转换缓存 */
  CONVERSION = 'CONVERSION',
  /** CSS 生成缓存 */
  CSS = 'CSS',
  /** 常用值缓存 */
  COMMON_VALUES = 'COMMON_VALUES',
  /** 工具函数缓存 */
  UTILITY = 'UTILITY',
}

/**
 * 缓存管理器
 * 
 * 统一管理所有缓存实例，提供：
 * - 缓存创建和获取
 * - 全局缓存清理
 * - 缓存统计和监控
 */
export class CacheManager {
  /** 单例实例 */
  private static instance: CacheManager

  /** 缓存实例映射表 */
  private caches = new Map<string, LRUCache<any, any>>()

  /**
   * 私有构造函数（单例模式）
   */
  private constructor() { }

  /**
   * 获取单例实例
   * 
   * @returns 缓存管理器实例
   */
  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  /**
   * 获取或创建缓存实例
   * 
   * @template K - 键类型
   * @template V - 值类型
   * @param type - 缓存类型
   * @param customSize - 自定义缓存大小（可选）
   * @returns LRU 缓存实例
   */
  getCache<K, V>(type: CacheType | string, customSize?: number): LRUCache<K, V> {
    if (!this.caches.has(type)) {
      // 根据类型获取默认大小
      const defaultSize = this.getDefaultSize(type)
      const size = customSize ?? defaultSize

      this.caches.set(type, new LRUCache<K, V>(size))
    }
    return this.caches.get(type)!
  }

  /**
   * 根据缓存类型获取默认大小
   * 
   * @param type - 缓存类型
   * @returns 默认缓存大小
   * @private
   */
  private getDefaultSize(type: string): number {
    // 使用配置常量
    switch (type) {
      case CacheType.SIZE_POOL:
        return PERFORMANCE_CONFIG.MAX_SIZE_POOL
      case CacheType.PARSE:
        return PERFORMANCE_CONFIG.MAX_PARSE_CACHE
      case CacheType.FORMAT:
        return PERFORMANCE_CONFIG.MAX_FORMAT_CACHE
      case CacheType.CONVERSION:
        return PERFORMANCE_CONFIG.MAX_CONVERSION_CACHE
      case CacheType.CSS:
        return PERFORMANCE_CONFIG.MAX_CSS_CACHE_SIZE
      case CacheType.COMMON_VALUES:
        return PERFORMANCE_CONFIG.MAX_COMMON_VALUES_CACHE
      case CacheType.UTILITY:
        return PERFORMANCE_CONFIG.MAX_UTILITY_CACHE
      default:
        return 100 // 默认大小
    }
  }

  /**
   * 清空所有缓存
   */
  clearAll(): void {
    this.caches.forEach(cache => cache.clear())
  }

  /**
   * 清空指定类型的缓存
   * 
   * @param type - 缓存类型
   */
  clear(type: CacheType | string): void {
    const cache = this.caches.get(type)
    if (cache) {
      cache.clear()
    }
  }

  /**
   * 获取所有缓存的统计信息
   * 
   * @returns 缓存统计映射表
   */
  getAllStats(): Map<string, ReturnType<LRUCache<any, any>['getStats']>> {
    const stats = new Map<string, ReturnType<LRUCache<any, any>['getStats']>>()

    this.caches.forEach((cache, type) => {
      stats.set(type, cache.getStats())
    })

    return stats
  }

  /**
   * 获取指定缓存的统计信息
   * 
   * @param type - 缓存类型
   * @returns 统计信息或 undefined
   */
  getStats(type: CacheType | string): ReturnType<LRUCache<any, any>['getStats']> | undefined {
    const cache = this.caches.get(type)
    return cache?.getStats()
  }

  /**
   * 打印所有缓存的统计信息到控制台
   */
  printStats(): void {
    console.group('📦 Cache Statistics')

    const stats = this.getAllStats()
    stats.forEach((stat, type) => {
      console.group(`${type}`)
      console.log(`Size: ${stat.size}/${stat.maxSize}`)
      console.log(`Hit Rate: ${(stat.hitRate * 100).toFixed(1)}%`)
      console.log(`Hits: ${stat.hits}, Misses: ${stat.misses}`)
      console.groupEnd()
    })

    console.groupEnd()
  }

  /**
   * 获取缓存健康报告
   * 
   * 检查哪些缓存命中率过低，可能需要调整大小
   * 
   * @param threshold - 命中率阈值（默认 0.7）
   * @returns 低命中率缓存列表
   */
  getHealthReport(threshold = PERFORMANCE_CONFIG.CACHE_HIT_RATE_WARNING): string[] {
    const warnings: string[] = []

    this.caches.forEach((cache, type) => {
      const stats = cache.getStats()
      if (stats.hitRate < threshold && stats.hits + stats.misses > 100) {
        warnings.push(
          `${type}: 命中率 ${(stats.hitRate * 100).toFixed(1)}% 低于阈值 ${(threshold * 100).toFixed(1)}%，建议增加缓存大小`
        )
      }
    })

    return warnings
  }

  /**
   * 销毁所有缓存（清理资源）
   */
  destroy(): void {
    this.clearAll()
    this.caches.clear()
  }
}

/**
 * 导出全局缓存管理器实例
 */
export const globalCacheManager = CacheManager.getInstance()

