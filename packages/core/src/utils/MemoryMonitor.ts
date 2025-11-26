/**
 * @ldesign/size-core - Memory Monitor
 * 
 * 内存压力监测和自动清理工具
 * 
 * 特性：
 * - 监测 JS 堆内存使用情况
 * - 自动清理缓存以释放内存
 * - 可配置的阈值和清理策略
 * - 支持自定义清理回调
 * 
 * @example
 * ```ts
 * const monitor = new MemoryMonitor({
 *   threshold: 0.8,
 *   checkInterval: 30000
 * })
 * 
 * monitor.registerCleanupHandler('cache', () => {
 *   cache.clear()
 * })
 * 
 * monitor.start()
 * ```
 */

export interface MemoryInfo {
  /** 已使用的 JS 堆大小（字节） */
  usedJSHeapSize: number
  /** JS 堆大小限制（字节） */
  jsHeapSizeLimit: number
  /** 总的 JS 堆大小（字节） */
  totalJSHeapSize: number
  /** 内存使用率（0-1） */
  utilization: number
}

export interface MemoryMonitorOptions {
  /** 内存使用率阈值（0-1），超过此值触发清理 */
  threshold?: number
  /** 检查间隔（毫秒） */
  checkInterval?: number
  /** 是否启用自动清理 */
  autoCleanup?: boolean
  /** 是否在控制台输出日志 */
  verbose?: boolean
}

export type CleanupHandler = () => void | Promise<void>

/**
 * 内存监测器类
 */
export class MemoryMonitor {
  private threshold: number
  private checkInterval: number
  private autoCleanup: boolean
  private verbose: boolean
  private cleanupHandlers: Map<string, CleanupHandler>
  private intervalId: number | null = null
  private isRunning = false
  private lastMemoryInfo: MemoryInfo | null = null

  /**
   * 创建内存监测器实例
   * 
   * @param options - 配置选项
   */
  constructor(options: MemoryMonitorOptions = {}) {
    this.threshold = options.threshold ?? 0.8 // 默认 80% 内存使用率
    this.checkInterval = options.checkInterval ?? 30000 // 默认 30 秒
    this.autoCleanup = options.autoCleanup ?? true
    this.verbose = options.verbose ?? false
    this.cleanupHandlers = new Map()
  }

  /**
   * 检查当前环境是否支持内存监测
   * 
   * @returns 是否支持
   */
  static isSupported(): boolean {
    return typeof performance !== 'undefined' && 
           'memory' in performance &&
           typeof (performance as any).memory === 'object'
  }

  /**
   * 获取当前内存信息
   * 
   * @returns 内存信息对象，如果不支持返回 null
   */
  getMemoryInfo(): MemoryInfo | null {
    if (!MemoryMonitor.isSupported()) {
      return null
    }

    const memory = (performance as any).memory
    const info: MemoryInfo = {
      usedJSHeapSize: memory.usedJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      totalJSHeapSize: memory.totalJSHeapSize,
      utilization: memory.usedJSHeapSize / memory.jsHeapSizeLimit
    }

    this.lastMemoryInfo = info
    return info
  }

  /**
   * 注册清理回调函数
   * 
   * @param name - 清理器名称（用于标识和管理）
   * @param handler - 清理函数
   */
  registerCleanupHandler(name: string, handler: CleanupHandler): void {
    this.cleanupHandlers.set(name, handler)
    if (this.verbose) {
      console.log(`[MemoryMonitor] Registered cleanup handler: ${name}`)
    }
  }

  /**
   * 注销清理回调函数
   * 
   * @param name - 清理器名称
   * @returns 是否成功注销
   */
  unregisterCleanupHandler(name: string): boolean {
    const result = this.cleanupHandlers.delete(name)
    if (result && this.verbose) {
      console.log(`[MemoryMonitor] Unregistered cleanup handler: ${name}`)
    }
    return result
  }

  /**
   * 执行内存清理
   * 
   * 调用所有注册的清理回调函数
   * 
   * @returns 清理前后的内存信息
   */
  async cleanup(): Promise<{
    before: MemoryInfo | null
    after: MemoryInfo | null
    freed: number
  }> {
    const before = this.getMemoryInfo()

    if (this.verbose) {
      console.log('[MemoryMonitor] Starting memory cleanup...')
    }

    // 执行所有清理回调
    for (const [name, handler] of this.cleanupHandlers.entries()) {
      try {
        await handler()
        if (this.verbose) {
          console.log(`[MemoryMonitor] Executed cleanup handler: ${name}`)
        }
      } catch (error) {
        console.error(`[MemoryMonitor] Error in cleanup handler ${name}:`, error)
      }
    }

    // 建议浏览器进行垃圾回收（仅在某些浏览器和开发模式下有效）
    if (typeof gc !== 'undefined') {
      try {
        gc()
      } catch (e) {
        // gc() 可能不可用，忽略错误
      }
    }

    const after = this.getMemoryInfo()
    const freed = before && after 
      ? before.usedJSHeapSize - after.usedJSHeapSize 
      : 0

    if (this.verbose) {
      console.log(`[MemoryMonitor] Cleanup completed. Freed: ${this.formatBytes(freed)}`)
    }

    return { before, after, freed }
  }

  /**
   * 检查内存使用情况
   * 
   * 如果超过阈值且启用自动清理，会自动执行清理
   * 
   * @returns 当前内存信息和是否触发清理
   */
  async check(): Promise<{
    memoryInfo: MemoryInfo | null
    triggeredCleanup: boolean
  }> {
    const memoryInfo = this.getMemoryInfo()

    if (!memoryInfo) {
      return { memoryInfo: null, triggeredCleanup: false }
    }

    if (this.verbose) {
      console.log('[MemoryMonitor] Memory check:', {
        used: this.formatBytes(memoryInfo.usedJSHeapSize),
        limit: this.formatBytes(memoryInfo.jsHeapSizeLimit),
        utilization: `${(memoryInfo.utilization * 100).toFixed(2)}%`,
        threshold: `${(this.threshold * 100).toFixed(2)}%`
      })
    }

    // 检查是否超过阈值
    if (memoryInfo.utilization > this.threshold) {
      if (this.verbose) {
        console.warn(`[MemoryMonitor] Memory usage (${(memoryInfo.utilization * 100).toFixed(2)}%) exceeded threshold (${(this.threshold * 100).toFixed(2)}%)`)
      }

      if (this.autoCleanup) {
        await this.cleanup()
        return { memoryInfo, triggeredCleanup: true }
      }
    }

    return { memoryInfo, triggeredCleanup: false }
  }

  /**
   * 启动定期监测
   */
  start(): void {
    if (this.isRunning) {
      if (this.verbose) {
        console.warn('[MemoryMonitor] Monitor already running')
      }
      return
    }

    if (!MemoryMonitor.isSupported()) {
      console.warn('[MemoryMonitor] Memory API not supported in this environment')
      return
    }

    this.isRunning = true
    this.intervalId = window.setInterval(() => {
      this.check()
    }, this.checkInterval) as any

    if (this.verbose) {
      console.log(`[MemoryMonitor] Started monitoring (interval: ${this.checkInterval}ms, threshold: ${(this.threshold * 100).toFixed(2)}%)`)
    }
  }

  /**
   * 停止监测
   */
  stop(): void {
    if (!this.isRunning) {
      return
    }

    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    this.isRunning = false

    if (this.verbose) {
      console.log('[MemoryMonitor] Stopped monitoring')
    }
  }

  /**
   * 获取上次检查的内存信息
   * 
   * @returns 内存信息对象，如果未检查过返回 null
   */
  getLastMemoryInfo(): MemoryInfo | null {
    return this.lastMemoryInfo
  }

  /**
   * 更新配置
   * 
   * @param options - 新的配置选项
   */
  updateOptions(options: Partial<MemoryMonitorOptions>): void {
    if (options.threshold !== undefined) {
      this.threshold = options.threshold
    }
    if (options.checkInterval !== undefined) {
      this.checkInterval = options.checkInterval
      
      // 如果正在运行，重启以应用新的间隔
      if (this.isRunning) {
        this.stop()
        this.start()
      }
    }
    if (options.autoCleanup !== undefined) {
      this.autoCleanup = options.autoCleanup
    }
    if (options.verbose !== undefined) {
      this.verbose = options.verbose
    }

    if (this.verbose) {
      console.log('[MemoryMonitor] Options updated:', {
        threshold: `${(this.threshold * 100).toFixed(2)}%`,
        checkInterval: `${this.checkInterval}ms`,
        autoCleanup: this.autoCleanup
      })
    }
  }

  /**
   * 格式化字节数为可读字符串
   * 
   * @param bytes - 字节数
   * @returns 格式化的字符串
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  /**
   * 销毁监测器
   * 
   * 停止监测并清理所有资源
   */
  destroy(): void {
    this.stop()
    this.cleanupHandlers.clear()
    this.lastMemoryInfo = null

    if (this.verbose) {
      console.log('[MemoryMonitor] Destroyed')
    }
  }
}

/**
 * 创建全局单例实例
 */
let globalMonitor: MemoryMonitor | null = null

/**
 * 获取全局内存监测器实例
 * 
 * @param options - 配置选项（仅在首次调用时生效）
 * @returns 全局监测器实例
 */
export function getGlobalMemoryMonitor(options?: MemoryMonitorOptions): MemoryMonitor {
  if (!globalMonitor) {
    globalMonitor = new MemoryMonitor(options)
  }
  return globalMonitor
}

/**
 * 销毁全局监测器实例
 */
export function destroyGlobalMemoryMonitor(): void {
  if (globalMonitor) {
    globalMonitor.destroy()
    globalMonitor = null
  }
}