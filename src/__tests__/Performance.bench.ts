/**
 * @ldesign/size - 性能基准测试
 * 
 * 使用 Vitest 的 bench API 测试关键操作的性能
 * 
 * 运行方式:
 * ```bash
 * pnpm vitest bench
 * ```
 */

import { describe, bench } from 'vitest'
import { LRUCache } from '../utils/CacheManager'
import { Size } from '../core/Size'
import { sizeManager } from '../core/SizeManager'

describe('LRU Cache Performance', () => {
  bench('1k get operations (cache hit)', () => {
    const cache = new LRUCache<string, number>(1000)

    // 预填充缓存
    for (let i = 0; i < 100; i++) {
      cache.set(`key${i}`, i)
    }

    // 测试 get 操作
    for (let i = 0; i < 1000; i++) {
      cache.get(`key${i % 100}`)
    }
  })

  bench('1k set operations', () => {
    const cache = new LRUCache<string, number>(1000)

    for (let i = 0; i < 1000; i++) {
      cache.set(`key${i}`, i)
    }
  })

  bench('1k set operations with eviction', () => {
    const cache = new LRUCache<string, number>(100) // 小容量，触发淘汰

    for (let i = 0; i < 1000; i++) {
      cache.set(`key${i}`, i)
    }
  })

  bench('10k mixed operations', () => {
    const cache = new LRUCache<string, number>(1000)

    for (let i = 0; i < 10000; i++) {
      if (i % 3 === 0) {
        cache.set(`key${i}`, i)
      } else {
        cache.get(`key${i % 1000}`)
      }
    }
  })

  bench('Memory-limited cache (1KB)', () => {
    const cache = new LRUCache<string, string>(1000, 1024) // 1KB limit

    for (let i = 0; i < 100; i++) {
      cache.set(`key${i}`, 'x'.repeat(50)) // 约 50 字节
    }
  })
})

describe('Size Object Performance', () => {
  bench('Create 1k Size objects (no pool)', () => {
    for (let i = 0; i < 1000; i++) {
      new Size(16, 'px')
    }
  })

  bench('Size arithmetic operations (1k)', () => {
    const size1 = new Size(16, 'px')
    const size2 = new Size(8, 'px')

    for (let i = 0; i < 1000; i++) {
      size1.add(size2)
      size1.multiply(1.5)
      size1.toPixels()
    }
  })

  bench('Size unit conversion (1k)', () => {
    const size = new Size(16, 'px')

    for (let i = 0; i < 1000; i++) {
      size.toRem()
      size.toEm()
      size.toPixels()
    }
  })
})

describe('SizeManager Performance', () => {
  bench('CSS generation', () => {
    sizeManager.setBaseSize(16)
  })

  bench('CSS generation (different sizes)', () => {
    const sizes = [12, 14, 16, 18, 20]

    for (let i = 0; i < sizes.length; i++) {
      sizeManager.setBaseSize(sizes[i])
    }
  })

  bench('Preset application', () => {
    const presets = ['compact', 'comfortable', 'spacious']

    for (let i = 0; i < presets.length; i++) {
      sizeManager.applyPreset(presets[i])
    }
  })
})

describe('Memory Operations Performance', () => {
  bench('Memory size estimation (objects)', () => {
    const objects = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Object ${i}`,
      data: { value: i * 2 }
    }))

    const cache = new LRUCache<number, typeof objects[0]>(1000)

    for (const obj of objects) {
      cache.set(obj.id, obj)
    }
  })

  bench('Memory size estimation (strings)', () => {
    const cache = new LRUCache<string, string>(1000)

    for (let i = 0; i < 100; i++) {
      cache.set(`key${i}`, 'a'.repeat(i * 10))
    }
  })
})

describe('CircularBuffer Performance', () => {
  // 测试环形缓冲区 vs 数组 shift
  bench('CircularBuffer: 1k pushes', () => {
    // 创建一个简单的环形缓冲区模拟
    const buffer = new Array(100)
    let head = 0

    for (let i = 0; i < 1000; i++) {
      buffer[head] = i
      head = (head + 1) % 100
    }
  })

  bench('Array shift: 1k operations', () => {
    const arr: number[] = []
    const maxSize = 100

    for (let i = 0; i < 1000; i++) {
      arr.push(i)
      if (arr.length > maxSize) {
        arr.shift() // O(n) 操作
      }
    }
  })
})

describe('Batch Operations Performance', () => {
  bench('Sequential operations (1k)', () => {
    const cache = new LRUCache<number, number>(1000)

    for (let i = 0; i < 1000; i++) {
      cache.set(i, i * 2)
    }
  })

  bench('Random access pattern (1k)', () => {
    const cache = new LRUCache<number, number>(1000)

    // 预填充
    for (let i = 0; i < 100; i++) {
      cache.set(i, i)
    }

    // 随机访问
    for (let i = 0; i < 1000; i++) {
      const key = Math.floor(Math.random() * 100)
      cache.get(key)
    }
  })
})

