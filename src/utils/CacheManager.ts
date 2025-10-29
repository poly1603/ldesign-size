/**
 * @ldesign/size - 缓存管理器
 * 
 * 统一管理所有缓存实例，提供统一的缓存策略和监控
 * 
 * 性能优化：
 * - 双向链表实现 O(1) LRU
 * - 内存占用估算和限制
 * - 自动清理和监控
 */

import { PERFORMANCE_CONFIG } from '../constants/performance'

/**
 * 双向链表节点
 * 
 * @template K - 键类型
 * @template V - 值类型
 */
class LRUNode<K, V> {
  key: K
  value: V
  prev: LRUNode<K, V> | null = null
  next: LRUNode<K, V> | null = null
  /** 节点大小（字节） */
  size: number = 0

  constructor(key: K, value: V, size: number = 0) {
    this.key = key
    this.value = value
    this.size = size
  }
}

/**
 * 估算数据大小（字节）
 * 
 * @param value - 要估算的值
 * @returns 估算的字节数
 * 
 * ⚡ 性能: O(n) 其中 n 是对象的属性数量
 */
function estimateSize(value: any): number {
  if (value === null || value === undefined) {
    return 0
  }

  const type = typeof value

  switch (type) {
    case 'boolean':
      return 4
    case 'number':
      return 8
    case 'string':
      return value.length * 2 // UTF-16 编码
    case 'object':
      if (Array.isArray(value)) {
        return value.reduce((sum, item) => sum + estimateSize(item), 40)
      }
      // 对象：估算键和值的大小
      return Object.entries(value).reduce(
        (sum, [k, v]) => sum + k.length * 2 + estimateSize(v),
        40 // 对象本身的开销
      )
    default:
      return 40 // 默认估算
  }
}

/**
 * LRU 缓存实现（双向链表 + Map）
 * 
 * 最近最少使用（Least Recently Used）缓存策略
 * 当缓存满时，删除最久未使用的项
 * 
 * 性能特性：
 * - get: O(1) - 通过 Map 查找节点，链表操作移动到头部
 * - set: O(1) - 插入节点到头部，可能删除尾部
 * - delete: O(1) - 从 Map 和链表中删除
 * 
 * 内存管理：
 * - 支持基于条目数量的限制（maxSize）
 * - 支持基于内存占用的限制（maxMemory）
 * - 自动估算每个条目的内存占用
 * 
 * @template K - 键类型
 * @template V - 值类型
 * 
 * @example
 * ```ts
 * // 限制条目数量
 * const cache = new LRUCache<string, any>(100)
 * 
 * // 限制内存占用
 * const cache = new LRUCache<string, any>(100, 10 * 1024 * 1024) // 10MB
 * ```
 */
export class LRUCache<K, V> {
  /** 缓存存储（键 -> 节点） */
  private cache = new Map<K, LRUNode<K, V>>()

  /** 双向链表头部（最近使用） */
  private head: LRUNode<K, V> | null = null

  /** 双向链表尾部（最久未使用） */
  private tail: LRUNode<K, V> | null = null

  /** 最大缓存条目数 */
  private maxSize: number

  /** 最大内存占用（字节），undefined 表示不限制 */
  private maxMemory: number | undefined

  /** 当前内存占用（字节） */
  private memoryUsage = 0

  /** 命中次数统计 */
  private hits = 0

  /** 未命中次数统计 */
  private misses = 0

  /** 淘汰次数统计 */
  private evictions = 0

  /**
   * 构造函数
   * 
   * @param maxSize - 最大缓存条目数
   * @param maxMemory - 最大内存占用（字节），可选
   */
  constructor(maxSize = 100, maxMemory?: number) {
    this.maxSize = maxSize
    this.maxMemory = maxMemory
  }

  /**
   * 获取缓存项
   * 
   * ⚡ 性能: O(1)
   * 
   * @param key - 缓存键
   * @returns 缓存值或 undefined
   */
  get(key: K): V | undefined {
    const node = this.cache.get(key)

    if (node !== undefined) {
      // 命中：移动到头部表示最近使用
      this.moveToHead(node)
      this.hits++
      return node.value
    }

    // 未命中
    this.misses++
    return undefined
  }

  /**
   * 设置缓存项
   * 
   * ⚡ 性能: O(1)
   * 
   * @param key - 缓存键
   * @param value - 缓存值
   */
  set(key: K, value: V): void {
    const existingNode = this.cache.get(key)

    if (existingNode) {
      // 更新现有节点
      const oldSize = existingNode.size
      const newSize = this.estimateNodeSize(key, value)

      existingNode.value = value
      existingNode.size = newSize

      this.memoryUsage = this.memoryUsage - oldSize + newSize
      this.moveToHead(existingNode)
      return
    }

    // 创建新节点
    const nodeSize = this.estimateNodeSize(key, value)
    const newNode = new LRUNode(key, value, nodeSize)

    // 检查内存限制
    if (this.maxMemory !== undefined) {
      while (this.memoryUsage + nodeSize > this.maxMemory && this.tail) {
        this.removeTail()
      }
    }

    // 检查条目数限制
    if (this.cache.size >= this.maxSize && this.tail) {
      this.removeTail()
    }

    // 添加新节点到头部
    this.addToHead(newNode)
    this.cache.set(key, newNode)
    this.memoryUsage += nodeSize
  }

  /**
   * 检查缓存是否包含指定键
   * 
   * ⚡ 性能: O(1)
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
   * ⚡ 性能: O(1)
   * 
   * @param key - 缓存键
   * @returns 是否成功删除
   */
  delete(key: K): boolean {
    const node = this.cache.get(key)

    if (!node) {
      return false
    }

    this.removeNode(node)
    this.cache.delete(key)
    this.memoryUsage -= node.size

    return true
  }

  /**
   * 清空所有缓存
   * 
   * ⚡ 性能: O(1)
   */
  clear(): void {
    this.cache.clear()
    this.head = null
    this.tail = null
    this.memoryUsage = 0
    this.hits = 0
    this.misses = 0
    this.evictions = 0
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
      memoryUsage: this.memoryUsage,
      maxMemory: this.maxMemory,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hitRate: this.getHitRate(),
    }
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.hits = 0
    this.misses = 0
    this.evictions = 0
  }

  /**
   * 估算节点大小（包括键、值和节点开销）
   * 
   * @param key - 缓存键
   * @param value - 缓存值
   * @returns 估算的字节数
   * @private
   */
  private estimateNodeSize(key: K, value: V): number {
    let size = 48 // 节点对象基础开销（prev, next, key, value, size 字段）

    // 估算键的大小
    if (typeof key === 'string') {
      size += key.length * 2
    } else if (typeof key === 'number') {
      size += 8
    } else {
      size += 40 // 对象键默认估算
    }

    // 估算值的大小
    size += estimateSize(value)

    return size
  }

  /**
   * 将节点移动到头部（标记为最近使用）
   * 
   * ⚡ 性能: O(1)
   * 
   * @param node - 要移动的节点
   * @private
   */
  private moveToHead(node: LRUNode<K, V>): void {
    // 如果已经是头节点，无需移动
    if (node === this.head) {
      return
    }

    // 从当前位置移除
    this.removeNode(node)

    // 添加到头部
    this.addToHead(node)
  }

  /**
   * 添加节点到头部
   * 
   * ⚡ 性能: O(1)
   * 
   * @param node - 要添加的节点
   * @private
   */
  private addToHead(node: LRUNode<K, V>): void {
    node.prev = null
    node.next = this.head

    if (this.head) {
      this.head.prev = node
    }

    this.head = node

    if (!this.tail) {
      this.tail = node
    }
  }

  /**
   * 从链表中移除节点（不删除 Map 中的条目）
   * 
   * ⚡ 性能: O(1)
   * 
   * @param node - 要移除的节点
   * @private
   */
  private removeNode(node: LRUNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next
    } else {
      this.head = node.next
    }

    if (node.next) {
      node.next.prev = node.prev
    } else {
      this.tail = node.prev
    }
  }

  /**
   * 移除尾部节点（最久未使用）
   * 
   * ⚡ 性能: O(1)
   * 
   * @returns 被移除的节点，如果没有节点则返回 null
   * @private
   */
  private removeTail(): LRUNode<K, V> | null {
    if (!this.tail) {
      return null
    }

    const removed = this.tail
    this.removeNode(removed)
    this.cache.delete(removed.key)
    this.memoryUsage -= removed.size
    this.evictions++

    return removed
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
   * @param customMemory - 自定义内存限制（字节，可选）
   * @returns LRU 缓存实例
   * 
   * @example
   * ```ts
   * // 仅限制条目数
   * const cache = manager.getCache(CacheType.PARSE, 200)
   * 
   * // 同时限制条目数和内存
   * const cache = manager.getCache(CacheType.CSS, 100, 5 * 1024 * 1024) // 5MB
   * ```
   */
  getCache<K, V>(
    type: CacheType | string,
    customSize?: number,
    customMemory?: number
  ): LRUCache<K, V> {
    if (!this.caches.has(type)) {
      // 根据类型获取默认大小和内存限制
      const defaultSize = this.getDefaultSize(type)
      const defaultMemory = this.getDefaultMemory(type)

      const size = customSize ?? defaultSize
      const memory = customMemory ?? defaultMemory

      this.caches.set(type, new LRUCache<K, V>(size, memory))
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
   * 根据缓存类型获取默认内存限制
   * 
   * @param type - 缓存类型
   * @returns 默认内存限制（字节），undefined 表示不限制
   * @private
   */
  private getDefaultMemory(type: string): number | undefined {
    // 为不同类型的缓存设置合理的内存限制
    switch (type) {
      case CacheType.SIZE_POOL:
        return 2 * 1024 * 1024 // 2MB
      case CacheType.PARSE:
        return 5 * 1024 * 1024 // 5MB
      case CacheType.FORMAT:
        return 3 * 1024 * 1024 // 3MB
      case CacheType.CONVERSION:
        return 5 * 1024 * 1024 // 5MB
      case CacheType.CSS:
        return 10 * 1024 * 1024 // 10MB (CSS 字符串可能较大)
      case CacheType.COMMON_VALUES:
        return 1 * 1024 * 1024 // 1MB
      case CacheType.UTILITY:
        return 2 * 1024 * 1024 // 2MB
      default:
        return undefined // 不限制内存
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

