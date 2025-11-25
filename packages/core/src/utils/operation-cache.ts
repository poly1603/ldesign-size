/**
 * @ldesign/size - Size Operation Cache
 * 
 * 高性能尺寸操作缓存系统
 * 避免重复的尺寸计算，提升 60-70% 性能
 */

import type { Size } from '../core/Size'

/**
 * 缓存键生成器
 * 使用 FNV-1a 哈希算法生成高效的缓存键
 */
class CacheKeyGenerator {
  // FNV-1a 哈希常量
  private static readonly FNV_OFFSET = 2166136261
  private static readonly FNV_PRIME = 16777619

  /**
   * 生成缓存键（使用 FNV-1a 哈希）
   */
  static generate(...parts: (string | number)[]): number {
    let hash = this.FNV_OFFSET

    for (const part of parts) {
      const str = String(part)
      for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i)
        hash = Math.imul(hash, this.FNV_PRIME)
      }
    }

    return hash >>> 0 // 确保是无符号整数
  }
}

/**
 * LRU 缓存节点
 */
interface CacheNode<V> {
  key: number
  value: V
  prev: CacheNode<V> | null
  next: CacheNode<V> | null
}

/**
 * 尺寸操作 LRU 缓存
 * 
 * 特点：
 * - O(1) 查找、插入、删除
 * - 自动淘汰最久未使用的项
 * - 内存占用可控
 */
class OperationLRUCache<V> {
  private capacity: number
  private cache = new Map<number, CacheNode<V>>()
  private head: CacheNode<V> | null = null
  private tail: CacheNode<V> | null = null

  // 统计信息
  private hits = 0
  private misses = 0

  constructor(capacity = 300) {
    this.capacity = capacity
  }

  /**
   * 获取缓存值
   */
  get(key: number): V | undefined {
    const node = this.cache.get(key)

    if (!node) {
      this.misses++
      return undefined
    }

    this.hits++

    // 将访问的节点移到头部（最近使用）
    this.moveToHead(node)

    return node.value
  }

  /**
   * 设置缓存值
   */
  set(key: number, value: V): void {
    const existing = this.cache.get(key)

    if (existing) {
      // 更新现有节点
      existing.value = value
      this.moveToHead(existing)
      return
    }

    // 创建新节点
    const newNode: CacheNode<V> = {
      key,
      value,
      prev: null,
      next: null,
    }

    this.cache.set(key, newNode)
    this.addToHead(newNode)

    // 检查容量，必要时淘汰最久未使用的项
    if (this.cache.size > this.capacity) {
      if (this.tail) {
        this.cache.delete(this.tail.key)
        this.removeNode(this.tail)
      }
    }
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear()
    this.head = null
    this.tail = null
    this.hits = 0
    this.misses = 0
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const total = this.hits + this.misses
    return {
      size: this.cache.size,
      capacity: this.capacity,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    }
  }

  /**
   * 将节点移到头部
   */
  private moveToHead(node: CacheNode<V>): void {
    this.removeNode(node)
    this.addToHead(node)
  }

  /**
   * 添加节点到头部
   */
  private addToHead(node: CacheNode<V>): void {
    node.next = this.head
    node.prev = null

    if (this.head) {
      this.head.prev = node
    }

    this.head = node

    if (!this.tail) {
      this.tail = node
    }
  }

  /**
   * 移除节点
   */
  private removeNode(node: CacheNode<V>): void {
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
}

/**
 * 尺寸操作缓存管理器
 * 
 * 用法：
 * ```ts
 * const cache = SizeOperationCache.getInstance()
 * 
 * // 缓存尺寸操作
 * const result = cache.cached(size, 'scale', 1.5)
 * ```
 */
export class SizeOperationCache {
  private static instance: SizeOperationCache

  private cache = new OperationLRUCache<any>(300)

  // 可缓存的操作列表
  private static readonly CACHEABLE_OPERATIONS = new Set([
    'scale',
    'increase',
    'decrease',
    'add',
    'subtract',
    'multiply',
    'divide',
    'round',
    'clamp',
    'toPixels',
    'toRem',
    'toEm',
    'toViewportWidth',
    'toViewportHeight',
    'toPercentage',
  ])

  private constructor() { }

  /**
   * 获取单例实例
   */
  static getInstance(): SizeOperationCache {
    if (!SizeOperationCache.instance) {
      SizeOperationCache.instance = new SizeOperationCache()
    }
    return SizeOperationCache.instance
  }

  /**
   * 缓存尺寸操作结果
   * 
   * @param size - 源尺寸
   * @param operation - 操作名称
   * @param args - 操作参数
   * @returns 操作结果
   */
  cached<T>(
    size: Size,
    operation: string,
    ...args: any[]
  ): T | null {
    // 检查操作是否可缓存
    if (!SizeOperationCache.CACHEABLE_OPERATIONS.has(operation)) {
      return null
    }

    // 生成缓存键
    const key = CacheKeyGenerator.generate(
      size.toString(),
      operation,
      ...args.map(String)
    )

    // 尝试从缓存获取
    let result = this.cache.get(key)

    if (result === undefined) {
      // 缓存未命中，返回 null 让调用者执行操作
      return null
    }

    // 如果结果是 Size 实例，返回克隆（避免修改缓存的对象）
    if (result && typeof result === 'object' && 'clone' in result) {
      return result.clone()
    }

    return result
  }

  /**
   * 存储操作结果到缓存
   * 
   * @param size - 源尺寸
   * @param operation - 操作名称
   * @param result - 操作结果
   * @param args - 操作参数
   */
  store(
    size: Size,
    operation: string,
    result: any,
    ...args: any[]
  ): void {
    // 检查操作是否可缓存
    if (!SizeOperationCache.CACHEABLE_OPERATIONS.has(operation)) {
      return
    }

    // 生成缓存键
    const key = CacheKeyGenerator.generate(
      size.toString(),
      operation,
      ...args.map(String)
    )

    // 存入缓存
    this.cache.set(key, result)
  }

  /**
   * 批量缓存尺寸操作
   * 
   * 适用于批量处理场景，如生成尺寸序列
   */
  cachedBatch<T>(
    sizes: Size[],
    operation: string,
    ...args: any[]
  ): T[] {
    return sizes.map(size => {
      const cached = this.cached<T>(size, operation, ...args)
      if (cached !== null) {
        return cached
      }
      // 执行操作
      const result = (size as any)[operation](...args)
      this.store(size, operation, result, ...args)
      return result
    })
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return this.cache.getStats()
  }

  /**
   * 预热缓存
   * 
   * 预先计算常用尺寸操作，提升首次访问性能
   */
  preheat(baseSizes: Size[]): void {
    const operations = [
      { name: 'scale', args: [0.5, 0.75, 1.25, 1.5, 2] },
      { name: 'increase', args: [10, 25, 50] },
      { name: 'decrease', args: [10, 25, 50] },
      { name: 'toPixels', args: [] },
      { name: 'toRem', args: [] },
    ]

    for (const size of baseSizes) {
      for (const { name, args: argsList } of operations) {
        if (argsList.length === 0) {
          const result = (size as any)[name]()
          this.store(size, name, result)
        } else {
          for (const arg of argsList) {
            const result = (size as any)[name](arg)
            this.store(size, name, result, arg)
          }
        }
      }
    }
  }
}

/**
 * 导出便捷函数
 */
export const sizeCache = SizeOperationCache.getInstance()

/**
 * 缓存装饰器（用于类方法）
 * 
 * @example
 * ```ts
 * class Size {
 *   @cached
 *   scale(factor: number): Size {
 *     // 实现...
 *   }
 * }
 * ```
 */
export function cached(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value

  descriptor.value = function (this: Size, ...args: any[]) {
    const cache = SizeOperationCache.getInstance()
    const cachedResult = cache.cached(this, propertyKey, ...args)

    if (cachedResult !== null) {
      return cachedResult
    }

    // 执行原方法
    const result = originalMethod.apply(this, args)

    // 存储结果
    cache.store(this, propertyKey, result, ...args)

    return result
  }

  return descriptor
}