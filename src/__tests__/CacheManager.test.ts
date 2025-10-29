/**
 * @ldesign/size - CacheManager 单元测试
 * 
 * 测试覆盖：
 * - LRU 缓存机制
 * - 缓存大小限制
 * - 统计信息
 * - 缓存管理器
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { LRUCache, CacheManager, CacheType } from '../utils/CacheManager'

describe('LRUCache', () => {
  let cache: LRUCache<string, number>

  beforeEach(() => {
    cache = new LRUCache<string, number>(3) // 最大 3 个项
  })

  describe('基本操作', () => {
    it('应该正确设置和获取值', () => {
      cache.set('a', 1)
      expect(cache.get('a')).toBe(1)
    })

    it('应该在值不存在时返回 undefined', () => {
      expect(cache.get('nonexistent')).toBeUndefined()
    })

    it('应该正确检查值是否存在', () => {
      cache.set('a', 1)
      expect(cache.has('a')).toBe(true)
      expect(cache.has('b')).toBe(false)
    })

    it('应该正确删除值', () => {
      cache.set('a', 1)
      expect(cache.delete('a')).toBe(true)
      expect(cache.get('a')).toBeUndefined()
    })

    it('应该正确返回缓存大小', () => {
      expect(cache.size).toBe(0)

      cache.set('a', 1)
      cache.set('b', 2)

      expect(cache.size).toBe(2)
    })

    it('应该正确清空缓存', () => {
      cache.set('a', 1)
      cache.set('b', 2)

      cache.clear()

      expect(cache.size).toBe(0)
      expect(cache.get('a')).toBeUndefined()
    })
  })

  describe('LRU 策略', () => {
    it('应该在超出大小限制时删除最旧的项', () => {
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // 超出限制，应删除 'a'

      expect(cache.get('a')).toBeUndefined()
      expect(cache.get('b')).toBe(2)
      expect(cache.get('c')).toBe(3)
      expect(cache.get('d')).toBe(4)
    })

    it('访问应该更新项的使用顺序', () => {
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      // 访问 'a'，使其成为最近使用
      cache.get('a')

      // 添加新项，应该删除 'b'（最久未使用）
      cache.set('d', 4)

      expect(cache.get('a')).toBe(1) // 'a' 应该还在
      expect(cache.get('b')).toBeUndefined() // 'b' 应该被删除
      expect(cache.get('c')).toBe(3)
      expect(cache.get('d')).toBe(4)
    })

    it('重新设置相同键应该更新值和顺序', () => {
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      // 重新设置 'a'
      cache.set('a', 10)

      // 添加新项
      cache.set('d', 4)

      // 'a' 被更新后移到末尾，所以 'b' 应该被删除
      expect(cache.get('a')).toBe(10)
      expect(cache.get('b')).toBeUndefined()
    })
  })

  describe('统计功能', () => {
    it('应该正确统计命中和未命中', () => {
      cache.set('a', 1)

      cache.get('a') // 命中
      cache.get('b') // 未命中
      cache.get('a') // 命中

      const stats = cache.getStats()
      expect(stats.hits).toBe(2)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBeCloseTo(2 / 3, 2)
    })

    it('应该正确计算命中率', () => {
      const stats1 = cache.getStats()
      expect(stats1.hitRate).toBe(0) // 无访问时为 0

      cache.set('a', 1)
      cache.get('a') // 命中

      const stats2 = cache.getStats()
      expect(stats2.hitRate).toBe(1) // 100% 命中
    })

    it('应该支持重置统计', () => {
      cache.set('a', 1)
      cache.get('a')
      cache.get('b')

      expect(cache.getStats().hits).toBeGreaterThan(0)

      cache.resetStats()

      const stats = cache.getStats()
      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
    })

    it('应该统计内存使用', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')

      const stats = cache.getStats()
      expect(stats.memoryUsage).toBeGreaterThan(0)
      expect(stats.maxMemory).toBeUndefined() // 未设置内存限制
    })

    it('应该统计淘汰次数', () => {
      // 填满缓存
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      // 超出限制，触发淘汰
      cache.set('d', 4)

      const stats = cache.getStats()
      expect(stats.evictions).toBe(1)
    })
  })

  describe('内存管理', () => {
    it('应该支持基于内存的限制', () => {
      // 创建一个有内存限制的缓存（1KB）
      const memCache = new LRUCache<string, string>(100, 1024)

      // 添加大量数据直到触发内存限制
      for (let i = 0; i < 100; i++) {
        memCache.set(`key${i}`, 'x'.repeat(100)) // 每个约 100 字节
      }

      const stats = memCache.getStats()
      expect(stats.memoryUsage).toBeLessThanOrEqual(1024 * 1.1) // 允许 10% 误差
      expect(stats.evictions).toBeGreaterThan(0) // 应该触发淘汰
    })

    it('应该优先按内存限制淘汰', () => {
      const memCache = new LRUCache<string, string>(10, 500)

      // 添加会超出内存限制的数据
      memCache.set('big1', 'x'.repeat(200))
      memCache.set('big2', 'x'.repeat(200))
      memCache.set('big3', 'x'.repeat(200)) // 应该触发淘汰

      const stats = memCache.getStats()
      expect(stats.size).toBeLessThan(3) // 应该淘汰了至少一个
      expect(stats.memoryUsage).toBeLessThanOrEqual(500 * 1.1)
    })
  })

  describe('双向链表操作', () => {
    it('应该保持正确的 LRU 顺序', () => {
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      // 访问 'a'，使其成为最近使用
      cache.get('a')

      // 再添加一个，应该淘汰 'b'
      cache.set('d', 4)

      expect(cache.has('a')).toBe(true)
      expect(cache.has('b')).toBe(false) // 应该被淘汰
      expect(cache.has('c')).toBe(true)
      expect(cache.has('d')).toBe(true)
    })

    it('应该在大量操作后保持性能 (O(1))', () => {
      const largeCache = new LRUCache<number, number>(1000)

      const startTime = performance.now()

      // 10000 次操作
      for (let i = 0; i < 10000; i++) {
        largeCache.set(i % 1000, i)
        largeCache.get(i % 500)
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // 10000 次操作应该在 100ms 内完成（O(1) 操作）
      expect(duration).toBeLessThan(100)
    })
  })
})

describe('CacheManager', () => {
  let manager: CacheManager

  beforeEach(() => {
    manager = CacheManager.getInstance()
    // 清理所有缓存
    manager.clearAll()
  })

  describe('缓存获取', () => {
    it('应该创建并返回缓存实例', () => {
      const cache = manager.getCache(CacheType.PARSE)
      expect(cache).toBeInstanceOf(LRUCache)
    })

    it('应该为同一类型返回相同的缓存实例', () => {
      const cache1 = manager.getCache(CacheType.PARSE)
      const cache2 = manager.getCache(CacheType.PARSE)

      expect(cache1).toBe(cache2)
    })

    it('应该为不同类型返回不同的缓存实例', () => {
      const cache1 = manager.getCache(CacheType.PARSE)
      const cache2 = manager.getCache(CacheType.FORMAT)

      expect(cache1).not.toBe(cache2)
    })

    it('应该支持自定义缓存大小', () => {
      const cache = manager.getCache('custom', 50)

      // 添加超过 50 个项，验证大小限制
      for (let i = 0; i < 60; i++) {
        cache.set(`key${i}`, i)
      }

      expect(cache.size).toBeLessThanOrEqual(50)
    })
  })

  describe('缓存清理', () => {
    it('应该清空所有缓存', () => {
      const cache1 = manager.getCache(CacheType.PARSE)
      const cache2 = manager.getCache(CacheType.FORMAT)

      cache1.set('a', 'value1')
      cache2.set('b', 'value2')

      manager.clearAll()

      expect(cache1.size).toBe(0)
      expect(cache2.size).toBe(0)
    })

    it('应该清空指定类型的缓存', () => {
      const cache1 = manager.getCache(CacheType.PARSE)
      const cache2 = manager.getCache(CacheType.FORMAT)

      cache1.set('a', 'value1')
      cache2.set('b', 'value2')

      manager.clear(CacheType.PARSE)

      expect(cache1.size).toBe(0)
      expect(cache2.size).toBe(1) // FORMAT 缓存不受影响
    })
  })

  describe('统计功能', () => {
    it('应该获取单个缓存的统计信息', () => {
      const cache = manager.getCache(CacheType.PARSE)
      cache.set('a', 'value')
      cache.get('a')

      const stats = manager.getStats(CacheType.PARSE)
      expect(stats).toBeDefined()
      expect(stats?.hits).toBeGreaterThan(0)
    })

    it('应该获取所有缓存的统计信息', () => {
      manager.getCache(CacheType.PARSE).set('a', 'value1')
      manager.getCache(CacheType.FORMAT).set('b', 'value2')

      const allStats = manager.getAllStats()
      expect(allStats.size).toBeGreaterThan(0)
    })

    it('应该生成缓存健康报告', () => {
      const cache = manager.getCache(CacheType.PARSE)

      // 创建低命中率场景
      cache.set('a', 'value')
      for (let i = 0; i < 100; i++) {
        cache.get('a') // 命中
      }
      for (let i = 0; i < 200; i++) {
        cache.get(`nonexistent${i}`) // 未命中
      }

      const warnings = manager.getHealthReport(0.5) // 50% 阈值
      expect(warnings.length).toBeGreaterThan(0)
    })
  })

  describe('资源清理', () => {
    it('应该正确销毁', () => {
      const cache = manager.getCache(CacheType.PARSE)
      cache.set('a', 'value')

      manager.destroy()

      // 验证缓存已清理
      const stats = manager.getAllStats()
      expect(stats.size).toBe(0)
    })
  })
})

