/**
 * @ldesign/size - SizeManager 单元测试
 * 
 * 测试覆盖：
 * - 预设管理
 * - 配置设置和获取
 * - CSS 生成和缓存
 * - 监听器管理
 * - 持久化存储
 * - 资源清理
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { SizeManager, type SizePreset } from '../core/SizeManager'

describe('SizeManager', () => {
  let manager: SizeManager

  beforeEach(() => {
    // 清理 localStorage
    localStorage.clear()

    // 清理 DOM 中的样式元素
    const existingStyle = document.getElementById('ldesign-size-styles')
    if (existingStyle) {
      existingStyle.remove()
    }

    // 创建新的管理器实例
    manager = new SizeManager({ storageKey: 'test-size' })
  })

  afterEach(() => {
    // 清理资源
    manager.destroy()
  })

  describe('预设管理', () => {
    it('应该加载默认预设', () => {
      const presets = manager.getPresets()
      expect(presets.length).toBeGreaterThan(0)

      const presetNames = manager.getSizes()
      expect(presetNames).toContain('compact')
      expect(presetNames).toContain('comfortable')
      expect(presetNames).toContain('default')
      expect(presetNames).toContain('spacious')
    })

    it('应该正确获取当前预设', () => {
      const current = manager.getCurrentPreset()
      expect(current).toBe('default')
    })

    it('应该正确切换预设', () => {
      manager.applyPreset('compact')
      expect(manager.getCurrentPreset()).toBe('compact')

      const config = manager.getConfig()
      expect(config.baseSize).toBe(14)
    })

    it('应该支持添加自定义预设', () => {
      const customPreset: SizePreset = {
        name: 'custom',
        label: 'Custom',
        baseSize: 20
      }

      manager.addPreset(customPreset)
      manager.applyPreset('custom')

      expect(manager.getCurrentPreset()).toBe('custom')
      expect(manager.getConfig().baseSize).toBe(20)
    })

    it('应该处理不存在的预设', () => {
      const consoleSpy = vi.spyOn(console, 'warn')

      manager.applyPreset('non-existent')

      expect(consoleSpy).toHaveBeenCalled()
      // 预设不变
      expect(manager.getCurrentPreset()).toBe('default')
    })
  })

  describe('配置管理', () => {
    it('应该正确获取配置', () => {
      const config = manager.getConfig()
      expect(config).toHaveProperty('baseSize')
      expect(config.baseSize).toBe(16)
    })

    it('应该正确设置配置', () => {
      manager.setConfig({ baseSize: 18 })
      expect(manager.getConfig().baseSize).toBe(18)
    })

    it('应该正确设置基础尺寸', () => {
      manager.setBaseSize(20)
      expect(manager.getConfig().baseSize).toBe(20)
    })

    it('应该验证无效的配置', () => {
      expect(() => {
        manager.setConfig({ baseSize: -1 })
      }).toThrow('Invalid baseSize')

      expect(() => {
        manager.setConfig({ baseSize: 101 })
      }).toThrow('Invalid baseSize')
    })

    it('应该返回配置的副本', () => {
      const config1 = manager.getConfig()
      const config2 = manager.getConfig()

      expect(config1).not.toBe(config2) // 不同的对象引用
      expect(config1).toEqual(config2) // 但值相同
    })
  })

  describe('CSS 生成和注入', () => {
    it('应该在 DOM 中注入样式元素', () => {
      const styleElement = document.getElementById('ldesign-size-styles')
      expect(styleElement).toBeTruthy()
      expect(styleElement?.tagName).toBe('STYLE')
    })

    it('应该生成包含 CSS 变量的样式', () => {
      const styleElement = document.getElementById('ldesign-size-styles')
      const css = styleElement?.textContent || ''

      expect(css).toContain(':root')
      expect(css).toContain('--size-base')
      expect(css).toContain('--size-font-base')
      expect(css).toContain('--size-spacing-md')
    })

    it('应该在切换预设时更新 CSS', () => {
      manager.applyPreset('compact')

      const styleElement = document.getElementById('ldesign-size-styles')
      const css = styleElement?.textContent || ''

      // 紧凑模式应该有较小的基础尺寸
      expect(css).toContain('--size-base: 14px')
    })

    it('应该缓存生成的 CSS', () => {
      // 第一次生成
      manager.applyPreset('comfortable')
      const style1 = document.getElementById('ldesign-size-styles')?.textContent

      // 再次应用相同预设
      manager.applyPreset('comfortable')
      const style2 = document.getElementById('ldesign-size-styles')?.textContent

      // CSS 应该相同（来自缓存）
      expect(style1).toBe(style2)
    })
  })

  describe('监听器管理', () => {
    it('应该正确订阅配置变化', () => {
      const listener = vi.fn()
      const unsubscribe = manager.subscribe(listener)

      manager.setBaseSize(18)

      // 异步通知，需要等待
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(listener).toHaveBeenCalled()
          expect(listener).toHaveBeenCalledWith(expect.objectContaining({ baseSize: 18 }))
          unsubscribe()
          resolve()
        }, 100)
      })
    })

    it('应该支持多个监听器', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      manager.subscribe(listener1)
      manager.subscribe(listener2)

      manager.setBaseSize(20)

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(listener1).toHaveBeenCalled()
          expect(listener2).toHaveBeenCalled()
          resolve()
        }, 100)
      })
    })

    it('应该正确取消订阅', () => {
      const listener = vi.fn()
      const unsubscribe = manager.subscribe(listener)

      unsubscribe()
      manager.setBaseSize(22)

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(listener).not.toHaveBeenCalled()
          resolve()
        }, 100)
      })
    })

    it('onChange 应该是 subscribe 的别名', () => {
      const listener = vi.fn()
      const unsubscribe = manager.onChange(listener)

      manager.setBaseSize(24)

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(listener).toHaveBeenCalled()
          unsubscribe()
          resolve()
        }, 100)
      })
    })
  })

  describe('持久化存储', () => {
    it('应该保存配置到 localStorage', () => {
      manager.setBaseSize(18)

      const saved = localStorage.getItem('test-size')
      expect(saved).toBeTruthy()

      const data = JSON.parse(saved!)
      expect(data.config.baseSize).toBe(18)
    })

    it('应该从 localStorage 加载配置', () => {
      // 先保存
      localStorage.setItem('test-size', JSON.stringify({
        config: { baseSize: 20 },
        presetName: 'spacious'
      }))

      // 创建新实例
      const newManager = new SizeManager({ storageKey: 'test-size' })

      expect(newManager.getConfig().baseSize).toBe(20)
      expect(newManager.getCurrentPreset()).toBe('spacious')

      newManager.destroy()
    })

    it('应该处理损坏的存储数据', () => {
      localStorage.setItem('test-size', 'invalid json')

      const consoleSpy = vi.spyOn(console, 'error')

      // 不应该崩溃
      const newManager = new SizeManager({ storageKey: 'test-size' })
      expect(newManager.getConfig().baseSize).toBe(14) // 使用默认值

      expect(consoleSpy).toHaveBeenCalled()
      newManager.destroy()
    })
  })

  describe('资源清理', () => {
    it('应该在销毁时清理 DOM 元素', () => {
      const styleElement = document.getElementById('ldesign-size-styles')
      expect(styleElement).toBeTruthy()

      manager.destroy()

      const afterDestroy = document.getElementById('ldesign-size-styles')
      expect(afterDestroy).toBeFalsy()
    })

    it('应该在销毁时清理监听器', () => {
      const listener = vi.fn()
      manager.subscribe(listener)

      manager.destroy()

      // 尝试触发（不应该调用监听器）
      // 注意：销毁后调用 setConfig 可能会抛出错误或被忽略
      try {
        manager.setBaseSize(20)
      } catch {
        // 忽略可能的错误
      }

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(listener).not.toHaveBeenCalled()
          resolve()
        }, 100)
      })
    })

    it('应该在销毁时清理缓存', () => {
      // 生成一些缓存
      manager.applyPreset('compact')
      manager.applyPreset('comfortable')

      manager.destroy()

      // 验证销毁标志
      expect((manager as any).isDestroyed).toBe(true)
    })

    it('销毁后不应该接受新的订阅', () => {
      manager.destroy()

      const consoleSpy = vi.spyOn(console, 'warn')
      const listener = vi.fn()
      const unsubscribe = manager.subscribe(listener)

      expect(consoleSpy).toHaveBeenCalled()
      expect(typeof unsubscribe).toBe('function')
    })
  })

  describe('性能优化', () => {
    it('应该缓存相同预设的 CSS', () => {
      // 清空 DOM
      const style = document.getElementById('ldesign-size-styles')
      if (style) style.remove()

      // 应用预设
      manager.applyPreset('comfortable')
      const css1 = document.getElementById('ldesign-size-styles')?.textContent

      // 再次应用相同预设
      manager.applyPreset('comfortable')
      const css2 = document.getElementById('ldesign-size-styles')?.textContent

      expect(css1).toBe(css2)
    })

    it('应该批量通知监听器', () => {
      const listeners: any[] = []
      const callOrder: number[] = []

      // 创建多个监听器
      for (let i = 0; i < 20; i++) {
        const listener = vi.fn(() => callOrder.push(i))
        listeners.push(listener)
        manager.subscribe(listener)
      }

      manager.setBaseSize(18)

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // 所有监听器都应该被调用
          listeners.forEach(listener => {
            expect(listener).toHaveBeenCalled()
          })
          resolve()
        }, 200)
      })
    })
  })

  describe('边界情况', () => {
    it('应该处理服务端渲染环境', () => {
      // 注意：在浏览器测试环境中模拟 SSR 比较困难
      // 这个测试主要验证代码不会崩溃
      expect(() => {
        const ssrManager = new SizeManager()
        ssrManager.destroy()
      }).not.toThrow()
    })

    it('应该处理多个实例', () => {
      const manager1 = new SizeManager({ storageKey: 'test-1' })
      const manager2 = new SizeManager({ storageKey: 'test-2' })

      manager1.setBaseSize(14)
      manager2.setBaseSize(18)

      expect(manager1.getConfig().baseSize).toBe(14)
      expect(manager2.getConfig().baseSize).toBe(18)

      manager1.destroy()
      manager2.destroy()
    })

    it('应该处理快速连续切换', () => {
      manager.applyPreset('compact')
      manager.applyPreset('comfortable')
      manager.applyPreset('spacious')
      manager.applyPreset('default')

      expect(manager.getCurrentPreset()).toBe('default')
    })
  })
})

