/**
 * @ldesign/size - SharedUtils 单元测试
 * 
 * 测试覆盖：
 * - 工具函数正确性
 * - 格式化函数
 * - 异步工具
 * - 定时器包装
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createSafeInterval,
  createSafeTimeout,
  formatMemorySize,
  formatPercent,
  formatDuration,
  batchProcess,
  throttle,
  debounce,
  deepClone,
  safeJSONParse,
  sleep,
  retry
} from '../utils/SharedUtils'

describe('SharedUtils', () => {
  describe('定时器包装', () => {
    it('createSafeInterval 应该创建定时器并返回清理函数', () => {
      const callback = vi.fn()
      const cleanup = createSafeInterval(callback, 100)

      expect(typeof cleanup).toBe('function')
      cleanup()
    })

    it('createSafeTimeout 应该创建超时并返回清理函数', () => {
      const callback = vi.fn()
      const cleanup = createSafeTimeout(callback, 100)

      expect(typeof cleanup).toBe('function')
      cleanup()
    })
  })

  describe('格式化函数', () => {
    it('formatMemorySize 应该正确格式化字节', () => {
      expect(formatMemorySize(0)).toBe('0B')
      expect(formatMemorySize(500)).toBe('500B')
      expect(formatMemorySize(1024)).toBe('1.00KB')
      expect(formatMemorySize(1024 * 1024)).toBe('1.00MB')
      expect(formatMemorySize(1024 * 1024 * 1024)).toBe('1.00GB')
    })

    it('formatMemorySize 应该支持自定义小数位', () => {
      expect(formatMemorySize(1536, 1)).toBe('1.5KB')
      expect(formatMemorySize(1536, 0)).toBe('2KB')
    })

    it('formatPercent 应该正确格式化百分比', () => {
      expect(formatPercent(0.5)).toBe('50.0%')
      expect(formatPercent(0.856)).toBe('85.6%')
      expect(formatPercent(1)).toBe('100.0%')
      expect(formatPercent(0.856, 2)).toBe('85.60%')
    })

    it('formatDuration 应该正确格式化时间', () => {
      expect(formatDuration(500)).toBe('500ms')
      expect(formatDuration(1500)).toBe('1.50s')
      expect(formatDuration(65000)).toBe('1m 5s')
    })
  })

  describe('批量处理', () => {
    it('batchProcess 应该批量处理数组', async () => {
      const items = Array.from({ length: 25 }, (_, i) => i)
      const processor = vi.fn((x: number) => x * 2)

      const results = await batchProcess(items, processor, 10)

      expect(results).toHaveLength(25)
      expect(results[0]).toBe(0)
      expect(results[24]).toBe(48)
      expect(processor).toHaveBeenCalledTimes(25)
    })

    it('batchProcess 应该支持异步处理器', async () => {
      const items = [1, 2, 3]
      const processor = async (x: number) => {
        await sleep(10)
        return x * 2
      }

      const results = await batchProcess(items, processor, 2)

      expect(results).toEqual([2, 4, 6])
    })
  })

  describe('节流和防抖', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
      vi.useRealTimers()
    })

    it('throttle 应该限制函数执行频率', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)

      // 快速连续调用
      throttled()
      throttled()
      throttled()

      expect(fn).toHaveBeenCalledTimes(1) // 只执行一次

      // 等待节流时间
      vi.advanceTimersByTime(100)
      throttled()

      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('debounce 应该延迟执行', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      // 快速连续调用
      debounced()
      debounced()
      debounced()

      expect(fn).toHaveBeenCalledTimes(0) // 还未执行

      // 等待防抖时间
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledTimes(1) // 只执行最后一次
    })

    it('debounce 应该重置计时器', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      vi.advanceTimersByTime(50)
      debounced() // 重置计时器

      vi.advanceTimersByTime(50)
      expect(fn).toHaveBeenCalledTimes(0) // 还没到时间

      vi.advanceTimersByTime(50)
      expect(fn).toHaveBeenCalledTimes(1) // 现在执行
    })
  })

  describe('深度克隆', () => {
    it('应该克隆基本类型', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('hello')).toBe('hello')
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })

    it('应该深度克隆对象', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)

      cloned.b.c = 3
      expect(original.b.c).toBe(2) // 原对象不受影响
    })

    it('应该深度克隆数组', () => {
      const original = [1, [2, 3], { a: 4 }]
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned[1]).not.toBe(original[1])

      cloned[1][0] = 99
      expect(original[1][0]).toBe(2)
    })

    it('应该克隆日期对象', () => {
      const original = new Date('2024-01-01')
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned instanceof Date).toBe(true)
    })
  })

  describe('safeJSONParse', () => {
    it('应该解析有效的 JSON', () => {
      const result = safeJSONParse('{"a":1}', {})
      expect(result).toEqual({ a: 1 })
    })

    it('应该在解析失败时返回默认值', () => {
      const result = safeJSONParse('invalid json', { default: true })
      expect(result).toEqual({ default: true })
    })

    it('应该处理空字符串', () => {
      const result = safeJSONParse('', null)
      expect(result).toBe(null)
    })
  })

  describe('sleep', () => {
    it('应该休眠指定时间', async () => {
      const start = Date.now()
      await sleep(50)
      const duration = Date.now() - start

      expect(duration).toBeGreaterThanOrEqual(45) // 允许一些误差
    })
  })

  describe('retry', () => {
    it('应该在成功时立即返回', async () => {
      const fn = vi.fn(() => 'success')

      const result = await retry(fn, { maxAttempts: 3 })

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('应该在失败时重试', async () => {
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        if (attempts < 3) {
          throw new Error('fail')
        }
        return 'success'
      })

      const result = await retry(fn, {
        maxAttempts: 3,
        delay: 10,
      })

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('应该在所有重试失败后抛出错误', async () => {
      const fn = vi.fn(() => {
        throw new Error('always fail')
      })

      await expect(retry(fn, {
        maxAttempts: 3,
        delay: 10,
      })).rejects.toThrow('always fail')

      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('应该调用 onError 回调', async () => {
      const onError = vi.fn()
      const fn = vi.fn(() => {
        throw new Error('fail')
      })

      try {
        await retry(fn, {
          maxAttempts: 2,
          delay: 10,
          onError,
        })
      } catch {
        // 预期抛出错误
      }

      expect(onError).toHaveBeenCalledTimes(2)
    })
  })
})

