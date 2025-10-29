/**
 * @ldesign/size - ResourceManager 单元测试
 * 
 * 测试覆盖：
 * - 资源管理基类
 * - 资源组
 * - using 模式
 * - 清理机制
 */

import { describe, it, expect, vi } from 'vitest'
import {
  ResourceManager,
  ResourceGroup,
  using,
  usingSync,
  type Disposable
} from '../utils/ResourceManager'

// 测试用的资源管理器
class TestManager extends ResourceManager {
  public cleanupCalled = false
  public resourcesCreated: Array<() => void> = []

  constructor() {
    super()

    // 创建一些模拟资源
    const cleanup1 = vi.fn()
    const cleanup2 = vi.fn()

    this.resourcesCreated.push(cleanup1, cleanup2)

    this.registerCleanup(cleanup1)
    this.registerCleanup(cleanup2)
    this.registerCleanup(() => {
      this.cleanupCalled = true
    })
  }

  doSomething(): string {
    if (this.destroyed) {
      throw new Error('Already destroyed')
    }
    return 'done'
  }
}

describe('ResourceManager', () => {
  describe('基础功能', () => {
    it('应该注册和执行清理回调', () => {
      const manager = new TestManager()

      expect(manager.isDestroyed()).toBe(false)
      expect(manager.cleanupCalled).toBe(false)

      manager.destroy()

      expect(manager.isDestroyed()).toBe(true)
      expect(manager.cleanupCalled).toBe(true)
      expect(manager.resourcesCreated[0]).toHaveBeenCalled()
      expect(manager.resourcesCreated[1]).toHaveBeenCalled()
    })

    it('应该防止重复销毁', () => {
      const manager = new TestManager()
      const cleanup = vi.fn()

      manager['registerCleanup'](cleanup)

      manager.destroy()
      expect(cleanup).toHaveBeenCalledTimes(1)

      manager.destroy() // 第二次销毁
      expect(cleanup).toHaveBeenCalledTimes(1) // 应该还是 1 次
    })

    it('应该在清理回调失败时继续执行后续回调', () => {
      class TestWithError extends ResourceManager {
        constructor() {
          super()

          this.registerCleanup(() => {
            throw new Error('Cleanup error')
          })
          this.registerCleanup(() => {
            // 这个应该仍然执行
          })
        }
      }

      const manager = new TestWithError()

      // 静默 console.error
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { })

      expect(() => {
        manager.destroy()
      }).not.toThrow()

      expect(consoleError).toHaveBeenCalled()
      consoleError.mockRestore()
    })

    it('应该在销毁后警告注册清理', () => {
      const manager = new TestManager()
      manager.destroy()

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => { })

      manager['registerCleanup'](() => { })

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('已销毁')
      )

      consoleWarn.mockRestore()
    })
  })
})

describe('ResourceGroup', () => {
  describe('基础功能', () => {
    it('应该添加和管理资源', () => {
      const group = new ResourceGroup()
      const manager1 = new TestManager()
      const manager2 = new TestManager()

      group.add(manager1)
      group.add(manager2)

      expect(group.size).toBe(2)
    })

    it('应该批量销毁所有资源', () => {
      const group = new ResourceGroup()
      const manager1 = new TestManager()
      const manager2 = new TestManager()

      group.add(manager1)
      group.add(manager2)

      expect(manager1.isDestroyed()).toBe(false)
      expect(manager2.isDestroyed()).toBe(false)

      group.destroy()

      expect(manager1.isDestroyed()).toBe(true)
      expect(manager2.isDestroyed()).toBe(true)
      expect(group.size).toBe(0)
    })

    it('应该支持移除资源', () => {
      const group = new ResourceGroup()
      const manager = new TestManager()

      group.add(manager)
      expect(group.size).toBe(1)

      const removed = group.remove(manager)
      expect(removed).toBe(true)
      expect(group.size).toBe(0)

      // 移除后不会被销毁
      group.destroy()
      expect(manager.isDestroyed()).toBe(false)
    })

    it('应该防止向已销毁的组添加资源', () => {
      const group = new ResourceGroup()
      group.destroy()

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => { })

      group.add(new TestManager())

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('已销毁')
      )

      consoleWarn.mockRestore()
    })

    it('clear 应该是 destroy 的别名', () => {
      const group = new ResourceGroup()
      const manager = new TestManager()

      group.add(manager)
      group.clear()

      expect(manager.isDestroyed()).toBe(true)
      expect(group.size).toBe(0)
    })
  })

  describe('错误处理', () => {
    it('应该在销毁资源失败时继续', () => {
      class FailingResource implements Disposable {
        destroy(): void {
          throw new Error('Destroy failed')
        }
      }

      const group = new ResourceGroup()
      const manager = new TestManager()
      const failing = new FailingResource()

      group.add(failing)
      group.add(manager)

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { })

      group.destroy()

      // failing 资源抛出错误，但 manager 仍然应该被销毁
      expect(manager.isDestroyed()).toBe(true)
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    })
  })
})

describe('using 模式', () => {
  describe('using (异步)', () => {
    it('应该自动销毁资源', async () => {
      const manager = new TestManager()

      const result = await using(manager, async (m) => {
        expect(m.isDestroyed()).toBe(false)
        return m.doSomething()
      })

      expect(result).toBe('done')
      expect(manager.isDestroyed()).toBe(true)
    })

    it('应该在回调抛出错误后仍然销毁资源', async () => {
      const manager = new TestManager()

      await expect(using(manager, async () => {
        throw new Error('Callback error')
      })).rejects.toThrow('Callback error')

      // 资源应该仍然被销毁
      expect(manager.isDestroyed()).toBe(true)
    })

    it('应该处理销毁失败', async () => {
      class FailingManager extends TestManager {
        destroy(): void {
          throw new Error('Destroy failed')
        }
      }

      const manager = new FailingManager()
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { })

      // 即使销毁失败，也不应该抛出错误
      const result = await using(manager, async (m) => 'success')

      expect(result).toBe('success')
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    })
  })

  describe('usingSync (同步)', () => {
    it('应该自动销毁资源', () => {
      const manager = new TestManager()

      const result = usingSync(manager, (m) => {
        expect(m.isDestroyed()).toBe(false)
        return m.doSomething()
      })

      expect(result).toBe('done')
      expect(manager.isDestroyed()).toBe(true)
    })

    it('应该在回调抛出错误后仍然销毁资源', () => {
      const manager = new TestManager()

      expect(() => {
        usingSync(manager, () => {
          throw new Error('Callback error')
        })
      }).toThrow('Callback error')

      // 资源应该仍然被销毁
      expect(manager.isDestroyed()).toBe(true)
    })
  })
})

