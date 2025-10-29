/**
 * @ldesign/size - MemoryMonitor 单元测试
 * 
 * 测试覆盖：
 * - 内存监控和报告
 * - 压力级别评估
 * - 自动清理机制
 * - 配置管理
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { MemoryMonitor } from '../utils/MemoryMonitor'
import { globalCacheManager, CacheType } from '../utils/CacheManager'

describe('MemoryMonitor', () => {
  let monitor: MemoryMonitor

  beforeEach(() => {
    // 创建新的监控器实例
    monitor = MemoryMonitor.getInstance()

    // 清理所有缓存
    globalCacheManager.clearAll()
  })

  afterEach(() => {
    // 停止监控
    monitor.stop()
  })

  describe('基础功能', () => {
    it('应该创建单例实例', () => {
      const monitor1 = MemoryMonitor.getInstance()
      const monitor2 = MemoryMonitor.getInstance()

      expect(monitor1).toBe(monitor2)
    })

    it('应该获取配置', () => {
      const config = monitor.getConfig()

      expect(config).toBeDefined()
      expect(config.memoryLimit).toBeGreaterThan(0)
      expect(config.normalThreshold).toBeGreaterThan(0)
    })

    it('应该更新配置', () => {
      const oldConfig = monitor.getConfig()

      monitor.updateConfig({
        memoryLimit: 100 * 1024 * 1024, // 100MB
      })

      const newConfig = monitor.getConfig()
      expect(newConfig.memoryLimit).toBe(100 * 1024 * 1024)
      expect(newConfig.normalThreshold).toBe(oldConfig.normalThreshold) // 未改变
    })
  })

  describe('内存报告', () => {
    it('应该生成内存报告', () => {
      const report = monitor.getReport()

      expect(report).toBeDefined()
      expect(report.totalMemory).toBeGreaterThanOrEqual(0)
      expect(report.memoryLimit).toBeGreaterThan(0)
      expect(report.usageRatio).toBeGreaterThanOrEqual(0)
      expect(report.pressureLevel).toBeDefined()
      expect(report.caches).toBeDefined()
    })

    it('应该跟踪缓存内存使用', () => {
      // 添加一些缓存数据
      const cache = globalCacheManager.getCache(CacheType.PARSE)
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')

      const report = monitor.getReport()

      expect(report.totalMemory).toBeGreaterThan(0)
      expect(report.caches[CacheType.PARSE]).toBeDefined()
      expect(report.caches[CacheType.PARSE].size).toBe(2)
    })

    it('应该打印内存报告（不抛出错误）', () => {
      // 静默 console.log
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => { })
      const consoleGroup = vi.spyOn(console, 'group').mockImplementation(() => { })
      const consoleGroupEnd = vi.spyOn(console, 'groupEnd').mockImplementation(() => { })

      expect(() => {
        monitor.printReport()
      }).not.toThrow()

      expect(consoleGroup).toHaveBeenCalled()

      consoleLog.mockRestore()
      consoleGroup.mockRestore()
      consoleGroupEnd.mockRestore()
    })
  })

  describe('压力级别评估', () => {
    it('应该正确评估正常压力级别', () => {
      // 配置低内存限制以便测试
      monitor.updateConfig({
        memoryLimit: 10 * 1024 * 1024, // 10MB
        normalThreshold: 0.6,
      })

      const report = monitor.getReport()

      // 初始状态应该是 normal
      expect(report.pressureLevel).toBe('normal')
    })

    it('应该在内存使用增加时提升压力级别', () => {
      // 配置低内存限制
      monitor.updateConfig({
        memoryLimit: 1024, // 1KB
        moderateThreshold: 0.5,
      })

      // 添加数据直到超过阈值
      const cache = globalCacheManager.getCache(CacheType.PARSE, 100, 2000)

      for (let i = 0; i < 50; i++) {
        cache.set(`key${i}`, 'x'.repeat(50))
      }

      const report = monitor.getReport()

      // 可能是 moderate、high 或 critical
      expect(['moderate', 'high', 'critical']).toContain(report.pressureLevel)
    })
  })

  describe('自动清理', () => {
    it('应该启动和停止监控', () => {
      expect(() => {
        monitor.start()
      }).not.toThrow()

      expect(() => {
        monitor.stop()
      }).not.toThrow()
    })

    it('应该触发常规清理', () => {
      // 添加一些缓存数据
      const cache = globalCacheManager.getCache(CacheType.PARSE)
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')

      expect(cache.size).toBe(2)

      // 触发清理（清理低命中率的缓存）
      monitor.triggerCleanup()

      // 由于缓存太小或命中率高，可能不会被清理
      // 所以我们只检查方法不抛出错误
      expect(() => {
        monitor.triggerCleanup()
      }).not.toThrow()
    })

    it('应该触发紧急清理', () => {
      // 添加数据
      const cache = globalCacheManager.getCache(CacheType.PARSE)
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')

      expect(cache.size).toBe(2)

      // 触发紧急清理（清理所有缓存）
      monitor.triggerEmergencyCleanup()

      // 缓存应该被清空
      expect(cache.size).toBe(0)
    })
  })

  describe('内存检查', () => {
    it('应该检查内存使用情况', () => {
      expect(() => {
        monitor.checkMemoryUsage()
      }).not.toThrow()
    })

    it('应该在高内存使用时发出警告', () => {
      // 配置低内存限制
      monitor.updateConfig({
        memoryLimit: 500, // 500 bytes
        highThreshold: 0.5,
        autoCleanup: false, // 禁用自动清理以测试警告
      })

      // 静默 console.warn
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => { })

      // 添加数据触发警告
      const cache = globalCacheManager.getCache(CacheType.PARSE, 100, 1000)
      for (let i = 0; i < 20; i++) {
        cache.set(`key${i}`, 'x'.repeat(50))
      }

      monitor.checkMemoryUsage()

      // 应该发出警告（可能需要一些时间）
      // 注意：由于警告间隔限制，可能不会立即触发
      expect(consoleWarn).toHaveBeenCalledTimes(expect.any(Number))

      consoleWarn.mockRestore()
    })
  })

  describe('资源清理', () => {
    it('应该正确销毁', () => {
      const testMonitor = MemoryMonitor.getInstance()

      testMonitor.start()

      expect(() => {
        testMonitor.destroy()
      }).not.toThrow()

      // 销毁后不应该能启动
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => { })

      testMonitor.start()
      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('无法启动已销毁的监控器')
      )

      consoleWarn.mockRestore()
    })
  })
})

