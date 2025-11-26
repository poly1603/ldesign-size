/**
 * @ldesign/size-core - LRU Cache Implementation
 * 
 * 真正的 LRU（Least Recently Used）缓存实现
 * 
 * 特性：
 * - O(1) 获取和设置操作
 * - 自动淘汰最少使用的条目
 * - 支持自定义最大容量
 * - 内存友好
 * 
 * @example
 * ```ts
 * const cache = new LRUCache<string, string>(100)
 * cache.set('key', 'value')
 * const value = cache.get('key')
 * ```
 */

export class LRUCache<K, V> {
  private maxSize: number
  private cache: Map<K, V>

  /**
   * 创建 LRU 缓存实例
   * 
   * @param maxSize - 最大缓存条目数量
   */
  constructor(maxSize: number) {
    if (maxSize <= 0) {
      throw new Error('maxSize must be positive')
    }
    this.maxSize = maxSize
    this.cache = new Map<K, V>()
  }

  /**
   * 获取缓存值
   * 
   * 如果键存在，会将其移到最新位置（Map 的末尾）
   * 
   * @param key - 缓存键
   * @returns 缓存值，如果不存在返回 undefined
   */
  get(key: K): V | undefined {
    const value = this.cache.get(key)
    
    if (value !== undefined) {
      // 删除后重新插入，将其移到最新位置
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    
    return value
  }

  /**
   * 设置缓存值
   * 
   * 如果超过容量限制，会自动删除最旧的条目
   * 
   * @param key - 缓存键
   * @param value - 缓存值
   */
  set(key: K, value: V): void {
    // 如果键已存在，先删除（稍后会重新插入到末尾）
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // 删除最旧的条目（Map 的第一个元素）
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
    
    // 插入到末尾（最新位置）
    this.cache.set(key, value)
  }

  /**
   * 检查键是否存在
   * 
   * 注意：此操作不会更新访问顺序
   * 
   * @param key - 缓存键
   * @returns 是否存在
   */
  has(key: K): boolean {
    return this.cache.has(key)
  }

  /**
   * 删除指定键
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
  }

  /**
   * 获取当前缓存大小
   * 
   * @returns 当前缓存条目数量
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * 获取最大容量
   * 
   * @returns 最大缓存条目数量
   */
  get capacity(): number {
    return this.maxSize
  }

  /**
   * 获取所有键
   * 
   * @returns 键的迭代器
   */
  keys(): IterableIterator<K> {
    return this.cache.keys()
  }

  /**
   * 获取所有值
   * 
   * @returns 值的迭代器
   */
  values(): IterableIterator<V> {
    return this.cache.values()
  }

  /**
   * 获取所有条目
   * 
   * @returns 条目的迭代器
   */
  entries(): IterableIterator<[K, V]> {
    return this.cache.entries()
  }

  /**
   * 遍历所有条目
   * 
   * @param callback - 回调函数
   */
  forEach(callback: (value: V, key: K, map: Map<K, V>) => void): void {
    this.cache.forEach(callback)
  }

  /**
   * 获取缓存统计信息
   * 
   * @returns 统计信息对象
   */
  getStats(): {
    size: number
    capacity: number
    utilization: number
  } {
    return {
      size: this.cache.size,
      capacity: this.maxSize,
      utilization: this.cache.size / this.maxSize
    }
  }

  /**
   * 调整最大容量
   * 
   * 如果新容量小于当前大小，会删除最旧的条目
   * 
   * @param newMaxSize - 新的最大容量
   */
  resize(newMaxSize: number): void {
    if (newMaxSize <= 0) {
      throw new Error('maxSize must be positive')
    }

    this.maxSize = newMaxSize

    // 如果当前大小超过新容量，删除最旧的条目
    while (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
  }

  /**
   * 获取最旧的键
   * 
   * @returns 最旧的键，如果缓存为空返回 undefined
   */
  getOldestKey(): K | undefined {
    return this.cache.keys().next().value
  }

  /**
   * 获取最新的键
   * 
   * @returns 最新的键，如果缓存为空返回 undefined
   */
  getNewestKey(): K | undefined {
    const keys = Array.from(this.cache.keys())
    return keys[keys.length - 1]
  }
}