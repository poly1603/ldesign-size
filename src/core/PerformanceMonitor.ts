/**
 * @ldesign/size - 性能监控器
 * 
 * 功能：
 * - 跟踪和报告性能指标
 * - 性能预算检查
 * - 性能趋势分析
 * - 自动优化建议
 * 
 * @example
 * ```ts
 * import { performanceMonitor } from '@ldesign/size'
 * 
 * // 开始计时
 * performanceMonitor.startTiming('cssGeneration')
 * // ... 执行操作
 * performanceMonitor.endTiming('cssGeneration')
 * 
 * // 获取报告
 * performanceMonitor.logReport()
 * ```
 */

import { PERFORMANCE_CONFIG } from '../constants/performance'
import { globalCacheManager } from '../utils/CacheManager'

/**
 * 环形缓冲区
 * 
 * 用于存储固定大小的历史数据，避免 shift/unshift 操作的 O(n) 复杂度
 * 
 * ⚡ 性能：
 * - push: O(1)
 * - 无需 shift 操作
 * - 固定内存占用
 * 
 * @template T - 数据类型
 */
class CircularBuffer<T> {
  /** 内部缓冲区数组 */
  private buffer: T[]

  /** 头指针（下一个写入位置） */
  private head = 0

  /** 当前大小 */
  private _size = 0

  /** 缓冲区容量 */
  private readonly capacity: number

  /**
   * 构造函数
   * 
   * @param capacity - 缓冲区容量
   */
  constructor(capacity: number) {
    this.capacity = capacity
    this.buffer = new Array(capacity)
  }

  /**
   * 添加元素到缓冲区
   * 
   * ⚡ 性能: O(1)
   * 
   * @param item - 要添加的元素
   */
  push(item: T): void {
    this.buffer[this.head] = item
    this.head = (this.head + 1) % this.capacity

    if (this._size < this.capacity) {
      this._size++
    }
  }

  /**
   * 获取当前大小
   */
  get size(): number {
    return this._size
  }

  /**
   * 转换为数组（按照插入顺序）
   * 
   * ⚡ 性能: O(n)
   * 
   * @returns 数组
   */
  toArray(): T[] {
    if (this._size === 0) {
      return []
    }

    const result: T[] = []

    if (this._size < this.capacity) {
      // 未满，直接返回前面的元素
      for (let i = 0; i < this._size; i++) {
        result.push(this.buffer[i])
      }
    } else {
      // 已满，从 head 开始读取
      for (let i = 0; i < this.capacity; i++) {
        const index = (this.head + i) % this.capacity
        result.push(this.buffer[index])
      }
    }

    return result
  }

  /**
   * 清空缓冲区
   */
  clear(): void {
    this.head = 0
    this._size = 0
    // 不清空数组内容，只重置指针（性能优化）
  }
}

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  /** 内存使用情况 */
  memoryUsage: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
  /** 缓存统计 */
  cacheStats: {
    sizePoolHitRate: number
    cssCache: number
    fluidSizeCache: number
  }
  /** 时间统计 */
  timing: {
    cssGeneration: number
    sizeCalculation: number
    viewportUpdate: number
  }
  /** 资源计数 */
  counts: {
    domNodes: number
    cssRules: number
    listeners: number
    pooledObjects: number
  }
}

/**
 * 性能预算配置
 */
export interface PerformanceBudget {
  /** CSS 生成最大时间（毫秒） */
  cssGeneration?: number
  /** 尺寸计算最大时间（毫秒） */
  sizeCalculation?: number
  /** 视口更新最大时间（毫秒） */
  viewportUpdate?: number
  /** 最小缓存命中率 */
  minCacheHitRate?: number
  /** 最大内存使用（MB） */
  maxMemoryUsage?: number
}

/**
 * 性能趋势类型
 */
export type PerformanceTrend = 'improving' | 'stable' | 'degrading'

/**
 * 优化建议接口
 */
export interface OptimizationSuggestion {
  /** 严重程度 */
  severity: 'low' | 'medium' | 'high' | 'critical'
  /** 建议标题 */
  title: string
  /** 建议描述 */
  description: string
  /** 预期收益 */
  expectedBenefit?: string
  /** 实施难度 */
  difficulty?: 'easy' | 'medium' | 'hard'
}

/**
 * 性能监控器类
 * 
 * 提供完整的性能监控和分析功能
 */
export class PerformanceMonitor {
  /** 单例实例 */
  private static instance: PerformanceMonitor

  /** 性能指标映射表 */
  private metrics: Map<string, number> = new Map()

  /** 开始时间映射表 */
  private startTimes: Map<string, number> = new Map()

  /** 性能历史记录（用于趋势分析） - 使用环形缓冲区优化 */
  private history: Map<string, CircularBuffer<number>> = new Map()

  /** 性能预算配置 */
  private budget: PerformanceBudget = {
    cssGeneration: PERFORMANCE_CONFIG.PERFORMANCE_BUDGET_WARNING,
    sizeCalculation: 5,
    viewportUpdate: 10,
    minCacheHitRate: PERFORMANCE_CONFIG.CACHE_HIT_RATE_WARNING,
    maxMemoryUsage: 50, // 50 MB
  }

  /** 最大历史记录数 */
  private readonly MAX_HISTORY_SIZE = PERFORMANCE_CONFIG.TREND_ANALYSIS_SAMPLES

  /**
   * 获取单例实例
   * 
   * @returns PerformanceMonitor 实例
   */
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * Start timing an operation
   */
  startTiming(operation: string): void {
    this.startTimes.set(operation, performance.now());
  }

  /**
   * 结束计时并记录持续时间
   * 
   * @param operation - 操作名称
   * @returns 操作持续时间（毫秒）
   */
  endTiming(operation: string): number {
    const startTime = this.startTimes.get(operation)
    if (startTime === undefined) {
      console.warn(`[PerformanceMonitor] No start time for operation: ${operation}`)
      return 0
    }

    const duration = performance.now() - startTime
    this.metrics.set(operation, duration)
    this.startTimes.delete(operation)

    // 记录到历史（用于趋势分析）
    this.recordToHistory(operation, duration)

    // 检查性能预算
    this.checkBudget(operation, duration)

    return duration
  }

  /**
   * 记录指标到历史记录
   * 
   * ⚡ 性能: O(1) - 使用环形缓冲区避免 shift 操作
   * 
   * @param operation - 操作名称
   * @param value - 指标值
   * @private
   */
  private recordToHistory(operation: string, value: number): void {
    let buffer = this.history.get(operation)

    if (!buffer) {
      buffer = new CircularBuffer<number>(this.MAX_HISTORY_SIZE)
      this.history.set(operation, buffer)
    }

    buffer.push(value) // O(1) 操作，无需 shift
  }

  /**
   * Record a metric value
   */
  recordMetric(name: string, value: number): void {
    this.metrics.set(name, value);
  }

  /**
   * Get memory usage information
   */
  private getMemoryUsage(): PerformanceMetrics['memoryUsage'] | null {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  /**
   * Count DOM nodes
   */
  private countDOMNodes(): number {
    if (typeof document === 'undefined') return 0;
    return document.querySelectorAll('*').length;
  }

  /**
   * Count CSS rules
   */
  private countCSSRules(): number {
    if (typeof document === 'undefined') return 0;

    let count = 0;
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        count += sheet.cssRules?.length || 0;
      } catch {
        // Cross-origin stylesheets
      }
    });

    return count;
  }

  /**
   * Get comprehensive performance report
   */
  getReport(): PerformanceMetrics {
    const memory = this.getMemoryUsage();

    // Import size pool stats
    const SizePool = (globalThis as any).__sizePool;
    const poolStats = SizePool?.getStats?.() || { hitRate: 0 };

    return {
      memoryUsage: memory || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
      },
      cacheStats: {
        sizePoolHitRate: poolStats.hitRate,
        cssCache: this.metrics.get('cssCacheSize') || 0,
        fluidSizeCache: this.metrics.get('fluidCacheSize') || 0
      },
      timing: {
        cssGeneration: this.metrics.get('cssGeneration') || 0,
        sizeCalculation: this.metrics.get('sizeCalculation') || 0,
        viewportUpdate: this.metrics.get('viewportUpdate') || 0
      },
      counts: {
        domNodes: this.countDOMNodes(),
        cssRules: this.countCSSRules(),
        listeners: this.metrics.get('listenerCount') || 0,
        pooledObjects: poolStats.poolSize || 0
      }
    };
  }

  /**
   * Log performance report to console
   */
  logReport(): void {
    const report = this.getReport();

    console.group('🚀 Performance Report');

    if (report.memoryUsage) {
      console.group('Memory Usage');
      console.log(`Used Heap: ${(report.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Total Heap: ${(report.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Heap Limit: ${(report.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
      console.groupEnd();
    }

    console.group('Cache Performance');
    console.log(`Size Pool Hit Rate: ${(report.cacheStats.sizePoolHitRate * 100).toFixed(1)}%`);
    console.log(`CSS Cache Entries: ${report.cacheStats.cssCache}`);
    console.log(`Fluid Size Cache: ${report.cacheStats.fluidSizeCache}`);
    console.groupEnd();

    console.group('Timing Metrics');
    console.log(`CSS Generation: ${report.timing.cssGeneration.toFixed(2)}ms`);
    console.log(`Size Calculation: ${report.timing.sizeCalculation.toFixed(2)}ms`);
    console.log(`Viewport Update: ${report.timing.viewportUpdate.toFixed(2)}ms`);
    console.groupEnd();

    console.group('Resource Counts');
    console.log(`DOM Nodes: ${report.counts.domNodes}`);
    console.log(`CSS Rules: ${report.counts.cssRules}`);
    console.log(`Active Listeners: ${report.counts.listeners}`);
    console.log(`Pooled Objects: ${report.counts.pooledObjects}`);
    console.groupEnd();

    console.groupEnd();
  }

  /**
   * 重置所有指标
   */
  reset(): void {
    this.metrics.clear()
    this.startTimes.clear()
    this.history.clear()
  }

  /**
   * 设置性能预算
   * 
   * @param budget - 性能预算配置
   * 
   * @example
   * ```ts
   * monitor.setBudget({
   *   cssGeneration: 20,
   *   minCacheHitRate: 0.8
   * })
   * ```
   */
  setBudget(budget: PerformanceBudget): void {
    this.budget = { ...this.budget, ...budget }
  }

  /**
   * 获取当前性能预算
   * 
   * @returns 性能预算配置
   */
  getBudget(): PerformanceBudget {
    return { ...this.budget }
  }

  /**
   * 检查操作是否超出性能预算
   * 
   * @param operation - 操作名称
   * @param actualTime - 实际耗时（可选，不提供则从 metrics 获取）
   * @returns 是否在预算内
   */
  checkBudget(operation: string, actualTime?: number): boolean {
    const time = actualTime ?? this.metrics.get(operation)
    if (time === undefined) return true

    let budgetTime: number | undefined

    // 根据操作类型获取预算时间
    switch (operation) {
      case 'cssGeneration':
        budgetTime = this.budget.cssGeneration
        break
      case 'sizeCalculation':
        budgetTime = this.budget.sizeCalculation
        break
      case 'viewportUpdate':
        budgetTime = this.budget.viewportUpdate
        break
    }

    if (budgetTime !== undefined && time > budgetTime) {
      console.warn(
        `[PerformanceMonitor] ⚠️ ${operation} 超出预算: ${time.toFixed(2)}ms > ${budgetTime}ms`
      )
      return false
    }

    return true
  }

  /**
   * 分析性能趋势
   * 
   * 基于历史数据分析性能是改善、稳定还是退化
   * 
   * @param operation - 操作名称
   * @param samples - 样本数量（默认使用全部历史）
   * @returns 性能趋势
   * 
   * @example
   * ```ts
   * const trend = monitor.getTrend('cssGeneration')
   * if (trend === 'degrading') {
   *   console.warn('性能正在退化！')
   * }
   * ```
   */
  getTrend(operation: string, samples?: number): PerformanceTrend {
    const buffer = this.history.get(operation)
    if (!buffer || buffer.size < 3) {
      return 'stable' // 数据不足，假设稳定
    }

    // 转换为数组（O(n) 但只在需要时调用）
    const recentData = buffer.toArray()

    // 如果指定了样本数，只使用最近的样本
    const sampleSize = samples ?? recentData.length
    const dataToAnalyze = samples && samples < recentData.length
      ? recentData.slice(-samples)
      : recentData

    // 计算前半部分和后半部分的平均值
    const mid = Math.floor(dataToAnalyze.length / 2)
    const firstHalf = dataToAnalyze.slice(0, mid)
    const secondHalf = dataToAnalyze.slice(mid)

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

    // 计算变化百分比
    const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100

    // 判断趋势
    if (changePercent < -5) {
      return 'improving' // 改善（时间减少）
    } else if (changePercent > 5) {
      return 'degrading' // 退化（时间增加）
    } else {
      return 'stable' // 稳定
    }
  }

  /**
   * 获取自动优化建议
   * 
   * 基于当前性能指标提供优化建议
   * 
   * @returns 优化建议数组
   * 
   * @example
   * ```ts
   * const suggestions = monitor.getSuggestions()
   * suggestions.forEach(s => {
   *   console.log(`[${s.severity}] ${s.title}: ${s.description}`)
   * })
   * ```
   */
  getSuggestions(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []
    const report = this.getReport()

    // 检查缓存命中率
    if (report.cacheStats.sizePoolHitRate < (this.budget.minCacheHitRate || 0.7)) {
      suggestions.push({
        severity: 'high',
        title: '缓存命中率过低',
        description: `Size 对象池命中率仅为 ${(report.cacheStats.sizePoolHitRate * 100).toFixed(1)}%，建议增加对象池大小`,
        expectedBenefit: '提升 10-15% 性能',
        difficulty: 'easy',
      })
    }

    // 检查所有缓存的命中率
    const cacheStats = globalCacheManager.getAllStats()
    cacheStats.forEach((stats, cacheName) => {
      if (stats.hitRate < 0.6 && stats.hits + stats.misses > 100) {
        suggestions.push({
          severity: 'medium',
          title: `${cacheName} 缓存命中率低`,
          description: `命中率仅为 ${(stats.hitRate * 100).toFixed(1)}%，建议增加缓存大小或优化缓存键`,
          expectedBenefit: '提升 5-10% 性能',
          difficulty: 'easy',
        })
      }
    })

    // 检查 CSS 生成时间
    const cssGenTime = this.metrics.get('cssGeneration')
    if (cssGenTime && cssGenTime > (this.budget.cssGeneration || 16)) {
      suggestions.push({
        severity: 'high',
        title: 'CSS 生成时间过长',
        description: `CSS 生成耗时 ${cssGenTime.toFixed(2)}ms，超出预算 ${this.budget.cssGeneration}ms`,
        expectedBenefit: '减少 30-50% 生成时间',
        difficulty: 'medium',
      })
    }

    // 检查内存使用
    if (report.memoryUsage.usedJSHeapSize > 0) {
      const usedMB = report.memoryUsage.usedJSHeapSize / 1024 / 1024
      if (usedMB > (this.budget.maxMemoryUsage || 50)) {
        suggestions.push({
          severity: 'critical',
          title: '内存使用过高',
          description: `当前使用 ${usedMB.toFixed(2)} MB，超出预算 ${this.budget.maxMemoryUsage} MB`,
          expectedBenefit: '减少 20-30% 内存占用',
          difficulty: 'hard',
        })
      }
    }

    // 检查 DOM 节点数
    if (report.counts.domNodes > 10000) {
      suggestions.push({
        severity: 'medium',
        title: 'DOM 节点过多',
        description: `当前有 ${report.counts.domNodes} 个 DOM 节点，可能影响性能`,
        expectedBenefit: '提升渲染性能',
        difficulty: 'medium',
      })
    }

    // 检查 CSS 规则数
    if (report.counts.cssRules > 5000) {
      suggestions.push({
        severity: 'low',
        title: 'CSS 规则过多',
        description: `当前有 ${report.counts.cssRules} 条 CSS 规则，建议优化样式表`,
        expectedBenefit: '提升样式计算速度',
        difficulty: 'medium',
      })
    }

    // 检查趋势
    const cssGenTrend = this.getTrend('cssGeneration')
    if (cssGenTrend === 'degrading') {
      suggestions.push({
        severity: 'medium',
        title: 'CSS 生成性能退化',
        description: 'CSS 生成时间呈上升趋势，建议检查缓存配置',
        expectedBenefit: '恢复原有性能水平',
        difficulty: 'easy',
      })
    }

    return suggestions
  }

  /**
   * 打印优化建议到控制台
   */
  printSuggestions(): void {
    const suggestions = this.getSuggestions()

    if (suggestions.length === 0) {
      console.log('✅ 性能良好，无优化建议')
      return
    }

    console.group(`💡 优化建议 (${suggestions.length} 条)`)

    suggestions.forEach((s, index) => {
      const icon = {
        critical: '🔴',
        high: '🟠',
        medium: '🟡',
        low: '🟢',
      }[s.severity]

      console.group(`${index + 1}. ${icon} [${s.severity.toUpperCase()}] ${s.title}`)
      console.log(`描述: ${s.description}`)
      if (s.expectedBenefit) {
        console.log(`预期收益: ${s.expectedBenefit}`)
      }
      if (s.difficulty) {
        console.log(`实施难度: ${s.difficulty}`)
      }
      console.groupEnd()
    })

    console.groupEnd()
  }

  /**
   * 比较两个性能快照
   * 
   * @param before - 优化前的性能快照
   * @param after - 优化后的性能快照
   */
  static compareSnapshots(before: PerformanceMetrics, after: PerformanceMetrics): void {
    console.group('📊 性能对比')

    // 内存对比
    if (before.memoryUsage && after.memoryUsage) {
      const memoryDiff = after.memoryUsage.usedJSHeapSize - before.memoryUsage.usedJSHeapSize
      const sign = memoryDiff > 0 ? '+' : ''
      console.log(`内存变化: ${sign}${(memoryDiff / 1024 / 1024).toFixed(2)} MB`)
    }

    // 缓存命中率对比
    const hitRateDiff = after.cacheStats.sizePoolHitRate - before.cacheStats.sizePoolHitRate
    console.log(`缓存命中率变化: ${hitRateDiff > 0 ? '+' : ''}${(hitRateDiff * 100).toFixed(1)}%`)

    // 时间指标对比
    const timingDiff = {
      css: after.timing.cssGeneration - before.timing.cssGeneration,
      size: after.timing.sizeCalculation - before.timing.sizeCalculation,
      viewport: after.timing.viewportUpdate - before.timing.viewportUpdate
    }

    console.log(`CSS 生成: ${timingDiff.css > 0 ? '+' : ''}${timingDiff.css.toFixed(2)}ms`)
    console.log(`尺寸计算: ${timingDiff.size > 0 ? '+' : ''}${timingDiff.size.toFixed(2)}ms`)
    console.log(`视口更新: ${timingDiff.viewport > 0 ? '+' : ''}${timingDiff.viewport.toFixed(2)}ms`)

    console.groupEnd()
  }
}

/**
 * 导出全局性能监控器单例实例
 * 
 * @example
 * ```ts
 * import { performanceMonitor } from '@ldesign/size'
 * 
 * performanceMonitor.startTiming('operation')
 * // ... 执行操作
 * performanceMonitor.endTiming('operation')
 * performanceMonitor.logReport()
 * ```
 */
export const performanceMonitor = PerformanceMonitor.getInstance()

/**
 * 便捷性能监控函数集合
 * 
 * 提供更简洁的 API 调用方式
 * 
 * @example
 * ```ts
 * import { perf } from '@ldesign/size'
 * 
 * perf.start('cssGen')
 * // ... 生成 CSS
 * perf.end('cssGen')
 * perf.log() // 打印报告
 * perf.suggestions() // 获取优化建议
 * ```
 */
export const perf = {
  /** 开始计时 */
  start: (operation: string) => performanceMonitor.startTiming(operation),

  /** 结束计时 */
  end: (operation: string) => performanceMonitor.endTiming(operation),

  /** 记录指标 */
  record: (name: string, value: number) => performanceMonitor.recordMetric(name, value),

  /** 获取报告 */
  report: () => performanceMonitor.getReport(),

  /** 打印报告到控制台 */
  log: () => performanceMonitor.logReport(),

  /** 重置所有指标 */
  reset: () => performanceMonitor.reset(),

  /** 设置性能预算 */
  setBudget: (budget: PerformanceBudget) => performanceMonitor.setBudget(budget),

  /** 获取性能趋势 */
  trend: (operation: string) => performanceMonitor.getTrend(operation),

  /** 获取优化建议 */
  suggestions: () => performanceMonitor.getSuggestions(),

  /** 打印优化建议 */
  printSuggestions: () => performanceMonitor.printSuggestions(),
}