/**
 * @ldesign/size - 内存监控器
 * 
 * 监控和管理整个 size 系统的内存使用情况
 * 
 * 功能：
 * - 监控各缓存的内存使用
 * - 自动警告和强制清理
 * - 提供内存使用报告
 * - 内存压力级别评估
 * 
 * @packageDocumentation
 */

import { formatMemorySize, formatPercent, createSafeInterval } from './SharedUtils'
import { globalCacheManager } from './CacheManager'

/**
 * 内存压力级别
 */
export type MemoryPressureLevel = 'normal' | 'moderate' | 'high' | 'critical'

/**
 * 内存使用报告
 */
export interface MemoryReport {
  /** 总内存使用（估算，字节） */
  totalMemory: number
  /** 内存限制（字节） */
  memoryLimit: number
  /** 使用比例（0-1） */
  usageRatio: number
  /** 压力级别 */
  pressureLevel: MemoryPressureLevel
  /** 各缓存的内存使用详情 */
  caches: Record<string, {
    size: number
    maxSize: number
    memoryUsage: number
    maxMemory?: number
  }>
  /** JS 堆内存使用（如果可用） */
  heapUsage?: {
    used: number
    total: number
    limit: number
  }
}

/**
 * 内存监控器配置
 */
export interface MemoryMonitorConfig {
  /** 内存限制（字节），默认 50MB */
  memoryLimit?: number
  /** 普通压力阈值，默认 0.6 (60%) */
  normalThreshold?: number
  /** 中等压力阈值，默认 0.7 (70%) */
  moderateThreshold?: number
  /** 高压力阈值，默认 0.85 (85%) */
  highThreshold?: number
  /** 临界压力阈值，默认 0.95 (95%) */
  criticalThreshold?: number
  /** 监控间隔（毫秒），默认 30000 (30秒) */
  monitorInterval?: number
  /** 是否自动清理，默认 true */
  autoCleanup?: boolean
}

/**
 * 内存监控器
 * 
 * 监控整个 @ldesign/size 包的内存使用情况，
 * 提供自动清理和警告机制
 * 
 * @example
 * ```ts
 * import { memoryMonitor } from '@ldesign/size'
 * 
 * // 获取内存报告
 * const report = memoryMonitor.getReport()
 * console.log(`内存使用: ${report.totalMemory / 1024 / 1024}MB`)
 * 
 * // 打印内存报告
 * memoryMonitor.printReport()
 * 
 * // 手动触发清理
 * memoryMonitor.triggerCleanup()
 * ```
 */
export class MemoryMonitor {
  /** 单例实例 */
  private static instance: MemoryMonitor

  /** 配置 */
  private config: Required<MemoryMonitorConfig>

  /** 当前压力级别 */
  private currentPressureLevel: MemoryPressureLevel = 'normal'

  /** 监控定时器 */
  private monitorTimer: (() => void) | null = null

  /** 上次警告时间 */
  private lastWarningTime = 0

  /** 警告间隔（避免频繁警告） */
  private readonly WARNING_INTERVAL = 60000 // 1分钟

  /** 是否已销毁 */
  private destroyed = false

  /**
   * 构造函数（私有，单例模式）
   * 
   * @param config - 监控器配置
   */
  private constructor(config: MemoryMonitorConfig = {}) {
    this.config = {
      memoryLimit: config.memoryLimit ?? 50 * 1024 * 1024, // 50MB
      normalThreshold: config.normalThreshold ?? 0.6,
      moderateThreshold: config.moderateThreshold ?? 0.7,
      highThreshold: config.highThreshold ?? 0.85,
      criticalThreshold: config.criticalThreshold ?? 0.95,
      monitorInterval: config.monitorInterval ?? 30000, // 30秒
      autoCleanup: config.autoCleanup ?? true,
    }
  }

  /**
   * 获取单例实例
   * 
   * @param config - 监控器配置（仅首次调用时有效）
   * @returns MemoryMonitor 实例
   */
  static getInstance(config?: MemoryMonitorConfig): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor(config)
    }
    return MemoryMonitor.instance
  }

  /**
   * 启动内存监控
   * 
   * 定期检查内存使用情况并自动清理
   */
  start(): void {
    if (this.destroyed) {
      console.warn('[MemoryMonitor] 无法启动已销毁的监控器')
      return
    }

    if (this.monitorTimer) {
      return // 已经在运行
    }

    this.monitorTimer = createSafeInterval(() => {
      this.checkMemoryUsage()
    }, this.config.monitorInterval)

    console.info('[MemoryMonitor] 内存监控已启动')
  }

  /**
   * 停止内存监控
   */
  stop(): void {
    if (this.monitorTimer) {
      this.monitorTimer()
      this.monitorTimer = null
      console.info('[MemoryMonitor] 内存监控已停止')
    }
  }

  /**
   * 检查内存使用情况
   * 
   * 评估压力级别并采取相应措施
   */
  checkMemoryUsage(): void {
    if (this.destroyed) {
      return
    }

    const report = this.getReport()
    const pressureLevel = this.evaluatePressureLevel(report.usageRatio)

    // 更新压力级别
    if (pressureLevel !== this.currentPressureLevel) {
      console.info(
        `[MemoryMonitor] 内存压力级别变化: ${this.currentPressureLevel} -> ${pressureLevel}`
      )
      this.currentPressureLevel = pressureLevel
    }

    // 根据压力级别采取措施
    switch (pressureLevel) {
      case 'normal':
        // 正常，无需操作
        break

      case 'moderate':
        // 中等压力，发出警告
        this.warn(report)
        break

      case 'high':
        // 高压力，警告并建议清理
        this.warn(report)
        if (this.config.autoCleanup) {
          console.info('[MemoryMonitor] 触发预防性清理')
          this.triggerCleanup()
        }
        break

      case 'critical':
        // 临界压力，强制清理
        this.warn(report)
        console.error('[MemoryMonitor] 内存使用达到临界值，强制清理')
        this.triggerEmergencyCleanup()
        break
    }
  }

  /**
   * 评估内存压力级别
   * 
   * @param usageRatio - 内存使用比例（0-1）
   * @returns 压力级别
   * @private
   */
  private evaluatePressureLevel(usageRatio: number): MemoryPressureLevel {
    if (usageRatio >= this.config.criticalThreshold) {
      return 'critical'
    } else if (usageRatio >= this.config.highThreshold) {
      return 'high'
    } else if (usageRatio >= this.config.moderateThreshold) {
      return 'moderate'
    } else {
      return 'normal'
    }
  }

  /**
   * 发出内存警告
   * 
   * @param report - 内存报告
   * @private
   */
  private warn(report: MemoryReport): void {
    const now = Date.now()

    // 避免频繁警告
    if (now - this.lastWarningTime < this.WARNING_INTERVAL) {
      return
    }

    this.lastWarningTime = now

    const icon = {
      normal: '✅',
      moderate: '⚠️',
      high: '🟠',
      critical: '🔴',
    }[report.pressureLevel]

    console.warn(
      `${icon} [MemoryMonitor] 内存使用 ${formatMemorySize(report.totalMemory)} / ${formatMemorySize(report.memoryLimit)} (${formatPercent(report.usageRatio)})`
    )
  }

  /**
   * 触发常规清理
   * 
   * 清理各缓存中较少使用的项
   */
  triggerCleanup(): void {
    console.info('[MemoryMonitor] 开始清理缓存')

    // 获取所有缓存的统计信息
    const stats = globalCacheManager.getAllStats()

    // 对命中率低的缓存进行清理
    stats.forEach((stat, cacheName) => {
      if (stat.hitRate < 0.5 && stat.size > 10) {
        console.info(`[MemoryMonitor] 清理低命中率缓存: ${cacheName}`)
        globalCacheManager.clear(cacheName)
      }
    })
  }

  /**
   * 触发紧急清理
   * 
   * 清理所有可清理的缓存
   */
  triggerEmergencyCleanup(): void {
    console.warn('[MemoryMonitor] 开始紧急清理')

    // 清理所有缓存
    globalCacheManager.clearAll()

    // 触发垃圾回收（如果可用）
    if (typeof global !== 'undefined' && typeof (global as any).gc === 'function') {
      console.info('[MemoryMonitor] 触发垃圾回收')
      try {
        (global as any).gc()
      } catch (error) {
        console.error('[MemoryMonitor] 垃圾回收失败:', error)
      }
    }
  }

  /**
   * 获取总内存使用（估算）
   * 
   * @returns 估算的总内存使用（字节）
   * @private
   */
  private getTotalMemoryUsage(): number {
    let total = 0

    // 汇总所有缓存的内存使用
    const stats = globalCacheManager.getAllStats()
    stats.forEach((stat) => {
      total += stat.memoryUsage || 0
    })

    return total
  }

  /**
   * 获取 JS 堆内存使用情况
   * 
   * @returns 堆内存使用情况，如果不可用则返回 undefined
   * @private
   */
  private getHeapUsage(): MemoryReport['heapUsage'] | undefined {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      }
    }

    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage()
      return {
        used: usage.heapUsed,
        total: usage.heapTotal,
        limit: usage.heapTotal * 2, // 估算值
      }
    }

    return undefined
  }

  /**
   * 获取内存使用报告
   * 
   * @returns 内存报告
   */
  getReport(): MemoryReport {
    const totalMemory = this.getTotalMemoryUsage()
    const usageRatio = totalMemory / this.config.memoryLimit
    const pressureLevel = this.evaluatePressureLevel(usageRatio)

    // 收集各缓存的详细信息
    const caches: MemoryReport['caches'] = {}
    const stats = globalCacheManager.getAllStats()

    stats.forEach((stat, cacheName) => {
      caches[cacheName] = {
        size: stat.size,
        maxSize: stat.maxSize,
        memoryUsage: stat.memoryUsage || 0,
        maxMemory: stat.maxMemory,
      }
    })

    return {
      totalMemory,
      memoryLimit: this.config.memoryLimit,
      usageRatio,
      pressureLevel,
      caches,
      heapUsage: this.getHeapUsage(),
    }
  }

  /**
   * 打印内存报告到控制台
   */
  printReport(): void {
    const report = this.getReport()

    console.group('📊 内存使用报告')

    // 总览
    console.group('总览')
    console.log(`总内存使用: ${formatMemorySize(report.totalMemory)}`)
    console.log(`内存限制: ${formatMemorySize(report.memoryLimit)}`)
    console.log(`使用比例: ${formatPercent(report.usageRatio)}`)
    console.log(`压力级别: ${report.pressureLevel}`)
    console.groupEnd()

    // 各缓存详情
    console.group('缓存详情')
    Object.entries(report.caches).forEach(([name, cache]) => {
      console.log(
        `${name}: ${cache.size}/${cache.maxSize} 项, ${formatMemorySize(cache.memoryUsage)}`
      )
    })
    console.groupEnd()

    // JS 堆内存
    if (report.heapUsage) {
      console.group('JS 堆内存')
      console.log(`已使用: ${formatMemorySize(report.heapUsage.used)}`)
      console.log(`总量: ${formatMemorySize(report.heapUsage.total)}`)
      console.log(`限制: ${formatMemorySize(report.heapUsage.limit)}`)
      console.groupEnd()
    }

    console.groupEnd()
  }

  /**
   * 更新配置
   * 
   * @param config - 新配置（部分）
   */
  updateConfig(config: Partial<MemoryMonitorConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }

    console.info('[MemoryMonitor] 配置已更新')
  }

  /**
   * 获取当前配置
   * 
   * @returns 当前配置的副本
   */
  getConfig(): Required<MemoryMonitorConfig> {
    return { ...this.config }
  }

  /**
   * 销毁监控器，清理所有资源
   */
  destroy(): void {
    if (this.destroyed) {
      return
    }

    this.destroyed = true

    // 停止监控
    this.stop()

    console.info('[MemoryMonitor] 已销毁')
  }
}

/**
 * 全局内存监控器单例实例
 * 
 * @example
 * ```ts
 * import { memoryMonitor } from '@ldesign/size'
 * 
 * memoryMonitor.start()
 * memoryMonitor.printReport()
 * ```
 */
export const memoryMonitor = MemoryMonitor.getInstance()

