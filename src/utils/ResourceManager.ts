/**
 * @ldesign/size - 资源管理基类
 * 
 * 提供统一的资源清理接口，确保所有资源正确释放
 * 
 * @packageDocumentation
 */

/**
 * 可销毁资源接口
 * 
 * 所有需要手动清理资源的类都应该实现此接口
 */
export interface Disposable {
  /**
   * 销毁并清理所有资源
   */
  destroy(): void
}

/**
 * 资源管理基类
 * 
 * 提供统一的资源清理机制，子类只需注册清理回调即可
 * 
 * 特性：
 * - 统一的 destroy 方法
 * - 防止重复销毁
 * - 异常安全的清理过程
 * - 自动收集清理回调
 * 
 * @example
 * ```ts
 * class MyManager extends ResourceManager {
 *   private timer: NodeJS.Timeout
 *   
 *   constructor() {
 *     super()
 *     
 *     // 创建资源
 *     this.timer = setInterval(() => {}, 1000)
 *     
 *     // 注册清理回调
 *     this.registerCleanup(() => {
 *       clearInterval(this.timer)
 *     })
 *   }
 * }
 * 
 * const manager = new MyManager()
 * manager.destroy() // 自动调用所有清理回调
 * ```
 */
export abstract class ResourceManager implements Disposable {
  /** 是否已销毁 */
  protected destroyed = false

  /** 清理回调函数列表 */
  protected cleanupCallbacks: Array<() => void> = []

  /**
   * 注册清理回调
   * 
   * 在 destroy 时自动调用
   * 
   * @param callback - 清理回调函数
   * 
   * @example
   * ```ts
   * this.registerCleanup(() => {
   *   this.resource.dispose()
   * })
   * ```
   */
  protected registerCleanup(callback: () => void): void {
    if (this.destroyed) {
      console.warn('[ResourceManager] 尝试在已销毁的资源上注册清理回调')
      return
    }

    this.cleanupCallbacks.push(callback)
  }

  /**
   * 检查资源是否已销毁
   * 
   * @returns 是否已销毁
   */
  isDestroyed(): boolean {
    return this.destroyed
  }

  /**
   * 销毁并清理所有资源
   * 
   * 按照注册顺序依次调用所有清理回调
   * 即使某个回调抛出异常，也会继续执行后续回调
   * 
   * 子类可以重写此方法以添加额外的清理逻辑，
   * 但必须调用 super.destroy()
   */
  destroy(): void {
    // 防止重复销毁
    if (this.destroyed) {
      return
    }

    // 标记为已销毁（先标记，防止清理过程中再次调用）
    this.destroyed = true

    // 依次执行清理回调
    const errors: Error[] = []

    for (const callback of this.cleanupCallbacks) {
      try {
        callback()
      } catch (error) {
        // 记录错误但继续清理
        errors.push(error as Error)
        console.error('[ResourceManager] 清理回调执行失败:', error)
      }
    }

    // 清空回调列表
    this.cleanupCallbacks = []

    // 如果有错误，抛出第一个错误
    if (errors.length > 0) {
      console.error(`[ResourceManager] 共 ${errors.length} 个清理回调失败`)
    }
  }
}

/**
 * 自动清理装饰器
 * 
 * 自动将方法返回的定时器 ID 注册到清理列表
 * 
 * @example
 * ```ts
 * class MyManager extends ResourceManager {
 *   @AutoCleanup
 *   startTimer() {
 *     return setInterval(() => {}, 1000)
 *   }
 * }
 * ```
 */
export function AutoCleanup(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value

  descriptor.value = function (this: ResourceManager, ...args: any[]) {
    const result = originalMethod.apply(this, args)

    // 如果返回值看起来像定时器 ID，注册清理回调
    if (typeof result === 'number' || typeof result === 'object') {
      this.registerCleanup(() => {
        if (typeof result === 'number') {
          clearInterval(result)
          clearTimeout(result)
        }
      })
    }

    return result
  }

  return descriptor
}

/**
 * 资源组
 * 
 * 管理一组可销毁的资源，支持批量销毁
 * 
 * @example
 * ```ts
 * const group = new ResourceGroup()
 * group.add(managerA)
 * group.add(managerB)
 * 
 * // 批量销毁
 * group.destroy()
 * ```
 */
export class ResourceGroup implements Disposable {
  private resources: Set<Disposable> = new Set()
  private destroyed = false

  /**
   * 添加资源到组
   * 
   * @param resource - 可销毁的资源
   */
  add(resource: Disposable): void {
    if (this.destroyed) {
      console.warn('[ResourceGroup] 尝试向已销毁的资源组添加资源')
      return
    }

    this.resources.add(resource)
  }

  /**
   * 从组中移除资源（不销毁）
   * 
   * @param resource - 要移除的资源
   * @returns 是否成功移除
   */
  remove(resource: Disposable): boolean {
    return this.resources.delete(resource)
  }

  /**
   * 获取资源数量
   * 
   * @returns 资源数量
   */
  get size(): number {
    return this.resources.size
  }

  /**
   * 销毁组中的所有资源
   */
  destroy(): void {
    if (this.destroyed) {
      return
    }

    this.destroyed = true

    // 批量销毁所有资源
    for (const resource of this.resources) {
      try {
        resource.destroy()
      } catch (error) {
        console.error('[ResourceGroup] 销毁资源失败:', error)
      }
    }

    // 清空资源集合
    this.resources.clear()
  }

  /**
   * 销毁并清空组（destroy 的别名）
   */
  clear(): void {
    this.destroy()
  }
}

/**
 * 使用 with 模式自动清理资源
 * 
 * @template T - 资源类型
 * @param resource - 可销毁的资源
 * @param callback - 使用资源的回调函数
 * @returns 回调函数的返回值
 * 
 * @example
 * ```ts
 * const result = await using(new MyManager(), async (manager) => {
 *   await manager.doSomething()
 *   return manager.getResult()
 * })
 * // manager 自动销毁
 * ```
 */
export async function using<T extends Disposable, R>(
  resource: T,
  callback: (resource: T) => R | Promise<R>
): Promise<R> {
  try {
    return await callback(resource)
  } finally {
    // 无论成功还是失败，都销毁资源
    try {
      resource.destroy()
    } catch (error) {
      console.error('[using] 清理资源失败:', error)
    }
  }
}

/**
 * 同步版本的 using 模式
 * 
 * @template T - 资源类型
 * @param resource - 可销毁的资源
 * @param callback - 使用资源的回调函数
 * @returns 回调函数的返回值
 * 
 * @example
 * ```ts
 * const result = usingSync(new MyManager(), (manager) => {
 *   manager.doSomething()
 *   return manager.getResult()
 * })
 * ```
 */
export function usingSync<T extends Disposable, R>(
  resource: T,
  callback: (resource: T) => R
): R {
  try {
    return callback(resource)
  } finally {
    // 无论成功还是失败，都销毁资源
    try {
      resource.destroy()
    } catch (error) {
      console.error('[usingSync] 清理资源失败:', error)
    }
  }
}

