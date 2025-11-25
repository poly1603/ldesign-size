/**
 * @ldesign/size - Core Size Class
 * 
 * 核心 Size 类，提供尺寸计算、转换和操作功能
 * 
 * 主要功能：
 * - 单位转换（px, rem, em, vw, vh, % 等）
 * - 尺寸运算（加减乘除、缩放、取整等）
 * - 尺寸比较（大于、小于、等于等）
 * - 对象池优化（减少内存分配）
 * 
 * 性能优化：
 * - 使用对象池减少 GC 压力
 * - 缓存常用转换结果
 * - 预定义常用尺寸值
 */

import type {
  ScaleFactor,
  SizeCalculationOptions,
  SizeInput,
  SizeUnit,
  SizeValue
} from '../types'
import {
  addSizes,
  clampSize,
  convertSize,
  formatSize,
  parseSizeInput,
  roundSize,
  scaleSize,
  subtractSizes
} from '../utils'
import { PERFORMANCE_CONFIG } from '../constants/performance'
import { SIZE_CONFIG, UNITS } from '../constants/sizes'
import { SizeOperationCache } from '../utils/operation-cache'

/**
 * Size 对象池，减少频繁创建对象的开销
 * 
 * 使用对象池模式复用 Size 对象，减少内存分配和 GC 压力
 */

// 使用常量配置减少魔法数字
const { DEFAULT_ROOT_FONT_SIZE } = SIZE_CONFIG
const DEFAULT_FONT_SIZE = DEFAULT_ROOT_FONT_SIZE // 别名，保持向后兼容
const { EPSILON, MAX_SIZE_POOL } = PERFORMANCE_CONFIG

// 使用预定义单位常量减少重复字符串分配
const { PX: UNIT_PX, REM: UNIT_REM, EM: UNIT_EM, VW: UNIT_VW, VH: UNIT_VH, PERCENT: UNIT_PERCENT } = UNITS

// 预定义常用值，避免重复创建（冻结以防止意外修改）
const ZERO_PX: SizeValue = Object.freeze({ value: 0, unit: UNIT_PX })
const ONE_PX: SizeValue = Object.freeze({ value: 1, unit: UNIT_PX })

// 使用位标记减少布尔值内存占用
const FLAG_POOLED = 1 << 0;
const FLAG_PIXELS_CACHED = 1 << 1;
const FLAG_REM_CACHED = 1 << 2;

// 常用值缓存（避免频繁创建相同值的对象）
const COMMON_VALUES_CACHE = new Map<string, Size>()

/**
 * Size 对象池
 * 
 * 实现对象池模式以复用 Size 实例，减少内存分配和垃圾回收压力
 * 
 * 性能优化：
 * - 自动清理未使用的对象
 * - 统计命中率用于性能监控
 * - 限制池大小避免内存膨胀
 */
class SizePool {
  /** 单例实例 */
  private static instance: SizePool

  /** 对象池存储 */
  private pool: Size[] = []

  /** 对象池最大大小 */
  private maxSize = MAX_SIZE_POOL

  /** 命中次数（从池中获取） */
  private hits = 0

  /** 未命中次数（需要新建） */
  private misses = 0

  /** 总创建次数 */
  private created = 0

  /** 上次清理时间戳 */
  private lastCleanup = Date.now()

  /** 自动清理定时器 ID */
  private cleanupTimer: ReturnType<typeof setInterval> | null = null

  /** 是否已销毁 */
  private destroyed = false

  /**
   * 获取单例实例
   */
  static getInstance(): SizePool {
    if (!SizePool.instance) {
      SizePool.instance = new SizePool()
    }
    return SizePool.instance
  }

  /**
   * 构造函数 - 启动自动清理定时器
   */
  private constructor() {
    // 启动自动清理定时器（仅在浏览器环境）
    if (typeof setInterval !== 'undefined') {
      this.cleanupTimer = setInterval(() => {
        if (!this.destroyed) {
          this.cleanup()
        }
      }, PERFORMANCE_CONFIG.CLEANUP_INTERVAL)
    }
  }

  /**
   * 清理未使用的池化对象
   * 
   * 保留一半的对象，释放另一半以减少内存占用
   */
  private cleanup(): void {
    const now = Date.now()
    if (now - this.lastCleanup > PERFORMANCE_CONFIG.CLEANUP_INTERVAL) {
      // 只保留一半的对象，释放剩余对象
      const keepSize = Math.floor(this.maxSize / 2)
      if (this.pool.length > keepSize) {
        this.pool.length = keepSize
      }
      this.lastCleanup = now
    }
  }

  /**
   * 从对象池获取 Size 对象
   * 
   * @param input - 尺寸输入值
   * @param rootFontSize - 根字体大小
   * @returns Size 对象实例
   */
  acquire(input: SizeInput, rootFontSize = DEFAULT_ROOT_FONT_SIZE): Size {
    if (this.destroyed) {
      // 如果池已销毁，直接创建新对象
      return new Size(input, rootFontSize)
    }

    // 优先从池中获取
    if (this.pool.length > 0) {
      this.hits++
      const size = this.pool.pop()!
      size.reset(input, rootFontSize)
      return size
    }

    // 池为空时创建新对象
    this.misses++
    this.created++
    const size = new Size(input, rootFontSize)
    size._isPooled = true
    return size
  }

  /**
   * 将 Size 对象归还到对象池
   * 
   * @param size - 要归还的 Size 对象
   */
  release(size: Size): void {
    if (this.destroyed) {
      return // 池已销毁，不再接受归还
    }

    // 清理对象状态并归还到池中
    if ((size as any)._isPooled && this.pool.length < this.maxSize) {
      // 重置为零值状态
      (size as any)._value = ZERO_PX
        (size as any)._rootFontSize = DEFAULT_ROOT_FONT_SIZE
          (size as any)._flags = FLAG_POOLED
            (size as any)._cachedPixels = undefined
              (size as any)._cachedRem = undefined
      this.pool.push(size)
    }
  }

  /**
   * 清空对象池
   */
  clear(): void {
    this.pool.length = 0
  }

  /**
   * 获取对象池统计信息
   * 
   * @returns 统计数据对象
   */
  getStats() {
    const total = this.hits + this.misses
    return {
      poolSize: this.pool.length,
      hits: this.hits,
      misses: this.misses,
      created: this.created,
      hitRate: total ? this.hits / total : 0,
    }
  }

  /**
   * 销毁对象池，清理所有资源
   */
  destroy(): void {
    if (this.destroyed) return

    this.destroyed = true

    // 清除定时器
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }

    // 清空池
    this.pool.length = 0

    // 重置统计
    this.hits = 0
    this.misses = 0
    this.created = 0
  }
}

/**
 * Core Size class for size manipulation and conversion
 */
export class Size {
  private _value: SizeValue;
  private _rootFontSize: number;
  private _flags: number = 0; // 使用位标记替代多个布尔值
  private _cachedPixels?: number; // 缓存像素值
  private _cachedRem?: number; // 缓存rem值

  // Size operation cache for expensive calculations
  private static operationCache = SizeOperationCache.getInstance()

  // 使用getter/setter访问标记
  get _isPooled(): boolean {
    return (this._flags & FLAG_POOLED) !== 0;
  }

  set _isPooled(value: boolean) {
    if (value) {
      this._flags |= FLAG_POOLED;
    } else {
      this._flags &= ~FLAG_POOLED;
    }
  }

  constructor(input: SizeInput = 0, rootFontSize = DEFAULT_FONT_SIZE) {
    this._value = parseSizeInput(input);
    this._rootFontSize = rootFontSize;
  }

  /**
   * 重置对象状态（供对象池使用）
   */
  reset(input: SizeInput = 0, rootFontSize = DEFAULT_FONT_SIZE): void {
    this._value = parseSizeInput(input);
    this._rootFontSize = rootFontSize;
    // 使用位操作设置标记
    this._flags = FLAG_POOLED; // 重置所有标记，只设置POOLED
    // 清除缓存
    this._cachedPixels = undefined;
    this._cachedRem = undefined;
  }

  // ============================================
  // Static Factory Methods
  // ============================================

  /**
   * Create a Size from pixels
   */
  static fromPixels(value: number): Size {
    // 对常用值使用缓存
    if (value === 0) return new Size(ZERO_PX);
    if (value === 1) return new Size(ONE_PX);

    // 检查常用值缓存
    const cacheKey = `${value}:px:${DEFAULT_FONT_SIZE}`;
    const cached = COMMON_VALUES_CACHE.get(cacheKey);
    if (cached) return cached.clone();

    return new Size({ value, unit: UNIT_PX });
  }

  /**
   * Create a Size from rem
   */
  static fromRem(value: number, rootFontSize = DEFAULT_FONT_SIZE): Size {
    return new Size({ value, unit: UNIT_REM }, rootFontSize);
  }

  /**
   * Create a Size from em
   */
  static fromEm(value: number, rootFontSize = DEFAULT_FONT_SIZE): Size {
    return new Size({ value, unit: UNIT_EM }, rootFontSize);
  }

  /**
   * Create a Size from viewport width percentage
   */
  static fromViewportWidth(value: number): Size {
    return new Size({ value, unit: UNIT_VW });
  }

  /**
   * Create a Size from viewport height percentage
   */
  static fromViewportHeight(value: number): Size {
    return new Size({ value, unit: UNIT_VH });
  }

  /**
   * Create a Size from percentage
   */
  static fromPercentage(value: number): Size {
    return new Size({ value, unit: UNIT_PERCENT });
  }

  /**
   * Parse a string to Size
   */
  static parse(input: string, rootFontSize = DEFAULT_FONT_SIZE): Size {
    return new Size(input, rootFontSize);
  }

  // ============================================
  // Getters
  // ============================================

  get value(): number {
    return this._value.value;
  }

  get unit(): SizeUnit {
    return this._value.unit;
  }

  get pixels(): number {
    // 使用位标记检查缓存
    if (!(this._flags & FLAG_PIXELS_CACHED)) {
      this._cachedPixels = this.toPixels().value;
      this._flags |= FLAG_PIXELS_CACHED;
    }
    return this._cachedPixels!;
  }

  get rem(): number {
    // 使用位标记检查缓存
    if (!(this._flags & FLAG_REM_CACHED)) {
      this._cachedRem = this.toRem().value;
      this._flags |= FLAG_REM_CACHED;
    }
    return this._cachedRem!;
  }

  get em(): number {
    return this.toEm().value;
  }

  // ============================================
  // Conversion Methods
  // ============================================

  /**
   * Convert to pixels
   */
  toPixels(): SizeValue {
    return convertSize(this._value, 'px', this._rootFontSize);
  }

  /**
   * Convert to rem
   */
  toRem(): SizeValue {
    return convertSize(this._value, 'rem', this._rootFontSize);
  }

  /**
   * Convert to em
   */
  toEm(): SizeValue {
    return convertSize(this._value, 'em', this._rootFontSize);
  }

  /**
   * Convert to viewport width
   */
  toViewportWidth(): SizeValue {
    return convertSize(this._value, 'vw', this._rootFontSize);
  }

  /**
   * Convert to viewport height
   */
  toViewportHeight(): SizeValue {
    return convertSize(this._value, 'vh', this._rootFontSize);
  }

  /**
   * Convert to percentage
   */
  toPercentage(): SizeValue {
    return convertSize(this._value, '%', this._rootFontSize);
  }

  /**
   * Convert to specific unit
   */
  to(unit: SizeUnit): SizeValue {
    return convertSize(this._value, unit, this._rootFontSize);
  }

  /**
   * Convert to string
   */
  toString(): string {
    return formatSize(this._value);
  }

  /**
   * Convert to CSS value string
   */
  toCss(): string {
    return formatSize(this._value);
  }

  /**
   * Get numeric value in specific unit
   */
  valueOf(unit?: SizeUnit): number {
    if (!unit || unit === this._value.unit) {
      return this._value.value;
    }
    return this.to(unit).value;
  }

  // ============================================
  // Manipulation Methods
  // ============================================

  /**
   * Scale the size by a factor (with cache optimization)
   */
  scale(factor: ScaleFactor): Size {
    const cached = Size.operationCache.cached<Size>(this, 'scale', factor)
    if (cached) return cached

    const scaled = scaleSize(this._value, factor);
    const result = new Size(scaled, this._rootFontSize);
    Size.operationCache.store(this, 'scale', result, factor)
    return result;
  }

  /**
   * Increase size by a percentage
   */
  increase(percentage: number): Size {
    return this.scale(1 + percentage / 100);
  }

  /**
   * Decrease size by a percentage
   */
  decrease(percentage: number): Size {
    return this.scale(1 - percentage / 100);
  }

  /**
   * Add another size (with cache optimization)
   */
  add(other: SizeInput): Size {
    const cached = Size.operationCache.cached<Size>(this, 'add', other)
    if (cached) return cached

    // 使用池化对象减少内存分配
    const otherSize = this._isPooled
      ? SizePool.getInstance().acquire(other, this._rootFontSize)
      : new Size(other, this._rootFontSize);
    const result = addSizes(this._value, otherSize._value, this._rootFontSize);
    if (this._isPooled) {
      otherSize.dispose();
    }
    const finalResult = this._isPooled
      ? SizePool.getInstance().acquire(result, this._rootFontSize)
      : new Size(result, this._rootFontSize);

    Size.operationCache.store(this, 'add', finalResult, other)
    return finalResult;
  }

  /**
   * Subtract another size (with cache optimization)
   */
  subtract(other: SizeInput): Size {
    const cached = Size.operationCache.cached<Size>(this, 'subtract', other)
    if (cached) return cached

    // 使用池化对象减少内存分配
    const otherSize = this._isPooled
      ? SizePool.getInstance().acquire(other, this._rootFontSize)
      : new Size(other, this._rootFontSize);
    const result = subtractSizes(this._value, otherSize._value, this._rootFontSize);
    if (this._isPooled) {
      otherSize.dispose();
    }
    const finalResult = this._isPooled
      ? SizePool.getInstance().acquire(result, this._rootFontSize)
      : new Size(result, this._rootFontSize);

    Size.operationCache.store(this, 'subtract', finalResult, other)
    return finalResult;
  }

  /**
   * Multiply by a number
   */
  multiply(factor: number): Size {
    return this.scale(factor);
  }

  /**
   * Divide by a number
   */
  divide(divisor: number): Size {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return this.scale(1 / divisor);
  }

  /**
   * Get the negative of the size
   */
  negate(): Size {
    return this.scale(-1);
  }

  /**
   * Get the absolute value
   */
  abs(): Size {
    if (this._value.value < 0) {
      return this.negate();
    }
    return this.clone();
  }

  /**
   * Round to specified precision (with cache optimization)
   */
  round(precision = 2): Size {
    const cached = Size.operationCache.cached<Size>(this, 'round', precision)
    if (cached) return cached

    const rounded = roundSize(this._value, precision);
    const result = new Size(rounded, this._rootFontSize);
    Size.operationCache.store(this, 'round', result, precision)
    return result;
  }

  /**
   * Clamp between min and max
   */
  clamp(min?: SizeInput, max?: SizeInput): Size {
    const clamped = clampSize(this._value, min, max, this._rootFontSize);
    return new Size(clamped, this._rootFontSize);
  }

  // ============================================
  // Comparison Methods
  // ============================================

  /**
   * 检查是否等于另一个尺寸
   * 
   * 使用像素值进行比较，允许 EPSILON 精度误差
   * 
   * @param other - 要比较的尺寸
   * @returns 是否相等
   */
  equals(other: SizeInput): boolean {
    // 快速路径：如果是相同的对象类型且单位相同
    if (typeof other === 'object' && 'value' in other && 'unit' in other) {
      if (other.unit === this._value.unit && Math.abs(other.value - this._value.value) < EPSILON) {
        return true
      }
    }

    // 使用池化对象减少内存分配
    const otherSize = SizePool.getInstance().acquire(other, this._rootFontSize)
    const result = Math.abs(this.pixels - otherSize.pixels) < EPSILON
    otherSize.dispose() // ✅ 确保释放池化对象
    return result
  }

  /**
   * 检查是否大于另一个尺寸
   * 
   * @param other - 要比较的尺寸
   * @returns 是否大于
   */
  greaterThan(other: SizeInput): boolean {
    // ✅ 修复：使用池化对象并正确释放
    const otherSize = SizePool.getInstance().acquire(other, this._rootFontSize)
    const result = this.pixels > otherSize.pixels
    otherSize.dispose()
    return result
  }

  /**
   * 检查是否大于或等于另一个尺寸
   * 
   * @param other - 要比较的尺寸
   * @returns 是否大于或等于
   */
  greaterThanOrEqual(other: SizeInput): boolean {
    return this.greaterThan(other) || this.equals(other)
  }

  /**
   * 检查是否小于另一个尺寸
   * 
   * @param other - 要比较的尺寸
   * @returns 是否小于
   */
  lessThan(other: SizeInput): boolean {
    // ✅ 修复：使用池化对象并正确释放
    const otherSize = SizePool.getInstance().acquire(other, this._rootFontSize)
    const result = this.pixels < otherSize.pixels
    otherSize.dispose()
    return result
  }

  /**
   * 检查是否小于或等于另一个尺寸
   * 
   * @param other - 要比较的尺寸
   * @returns 是否小于或等于
   */
  lessThanOrEqual(other: SizeInput): boolean {
    return this.lessThan(other) || this.equals(other)
  }

  /**
   * 获取此尺寸与另一个尺寸的最小值
   * 
   * @param other - 要比较的尺寸
   * @returns 较小的尺寸
   */
  min(other: SizeInput): Size {
    // ✅ 修复：使用池化对象并正确释放
    const otherSize = SizePool.getInstance().acquire(other, this._rootFontSize)
    const result = this.lessThan(otherSize) ? this.clone() : otherSize.clone()
    otherSize.dispose()
    return result
  }

  /**
   * 获取此尺寸与另一个尺寸的最大值
   * 
   * @param other - 要比较的尺寸
   * @returns 较大的尺寸
   */
  max(other: SizeInput): Size {
    // ✅ 修复：使用池化对象并正确释放
    const otherSize = SizePool.getInstance().acquire(other, this._rootFontSize)
    const result = this.greaterThan(otherSize) ? this.clone() : otherSize.clone()
    otherSize.dispose()
    return result
  }

  // ============================================
  // Calculation Methods
  // ============================================

  /**
   * Calculate with options
   */
  calculate(options: SizeCalculationOptions): Size {
    let result = this.clone();

    // Apply precision
    if (options.precision !== undefined) {
      result = result.round(options.precision);
    }

    // Apply unit conversion
    if (options.unit) {
      const converted = result.to(options.unit);
      result = new Size(converted, this._rootFontSize);
    }

    // Apply clamping
    if (options.clamp) {
      result = result.clamp(options.clamp.min, options.clamp.max);
    }

    return result;
  }

  /**
   * Interpolate between this and another size
   */
  interpolate(to: SizeInput, factor: number): Size {
    const toSize = new Size(to, this._rootFontSize);
    const fromPx = this.toPixels().value;
    const toPx = toSize.toPixels().value;
    const interpolated = fromPx + (toPx - fromPx) * factor;

    return new Size({ value: interpolated, unit: 'px' }, this._rootFontSize)
      .calculate({ unit: this._value.unit });
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Clone the size
   */
  clone(): Size {
    // 如果来自对象池，使用池创建克隆
    if (this._isPooled) {
      return SizePool.getInstance().acquire(this._value, this._rootFontSize);
    }
    return new Size(this._value, this._rootFontSize);
  }

  /**
   * 释放对象回池（手动管理）
   */
  dispose(): void {
    if (this._isPooled) {
      SizePool.getInstance().release(this);
    }
  }

  /**
   * Check if size is zero
   */
  isZero(): boolean {
    return Math.abs(this._value.value) < 0.001;
  }

  /**
   * Check if size is positive
   */
  isPositive(): boolean {
    return this._value.value > 0;
  }

  /**
   * Check if size is negative
   */
  isNegative(): boolean {
    return this._value.value < 0;
  }

  /**
   * Check if size is valid
   */
  isValid(): boolean {
    return (
      !Number.isNaN(this._value.value) &&
      Number.isFinite(this._value.value)
    );
  }

  /**
   * Export as JSON
   */
  toJSON(): object {
    return {
      value: this._value.value,
      unit: this._value.unit,
      pixels: this.pixels,
      rem: this.rem,
      string: this.toString()
    };
  }

  /**
   * Create CSS calc expression
   */
  static calc(expression: string): string {
    return `calc(${expression})`;
  }

  /**
   * Create CSS min expression
   */
  static cssMin(...sizes: SizeInput[]): string {
    const values = sizes.map(s => new Size(s).toString());
    return `min(${values.join(', ')})`;
  }

  /**
   * Create CSS max expression
   */
  static cssMax(...sizes: SizeInput[]): string {
    const values = sizes.map(s => new Size(s).toString());
    return `max(${values.join(', ')})`;
  }

  /**
   * Create CSS clamp expression
   */
  static cssClamp(min: SizeInput, preferred: SizeInput, max: SizeInput): string {
    const minStr = new Size(min).toString();
    const prefStr = new Size(preferred).toString();
    const maxStr = new Size(max).toString();
    return `clamp(${minStr}, ${prefStr}, ${maxStr})`;
  }

  /**
   * 批量转换尺寸数组
   *
   * 性能优化: 使用对象池批量处理,减少内存分配
   *
   * @param inputs - 尺寸输入数组
   * @param targetUnit - 目标单位
   * @param options - 转换选项
   * @returns 转换后的尺寸数组
   *
   * @example
   * ```ts
   * const sizes = Size.convertBatch([16, 24, 32], 'rem')
   * // => [Size(1rem), Size(1.5rem), Size(2rem)]
   * ```
   */
  static convertBatch(
    inputs: SizeInput[],
    targetUnit: SizeUnit,
    options?: SizeCalculationOptions
  ): Size[] {
    return inputs.map(input => {
      const size = new Size(input, options?.rootFontSize)
      return size.to(targetUnit, options)
    })
  }

  /**
   * 生成尺寸比例序列
   *
   * 根据基础尺寸和比例因子生成一系列尺寸
   *
   * @param base - 基础尺寸
   * @param ratio - 比例因子
   * @param count - 生成数量
   * @returns 尺寸数组
   *
   * @example
   * ```ts
   * // 生成模块化比例尺寸 (1.5倍比例)
   * const scale = Size.generateScale(16, 1.5, 5)
   * // => [16px, 24px, 36px, 54px, 81px]
   * ```
   */
  static generateScale(base: SizeInput, ratio: number, count: number): Size[] {
    const baseSize = new Size(base)
    const sizes: Size[] = [baseSize.clone()]

    for (let i = 1; i < count; i++) {
      const scaleFactor = Math.pow(ratio, i)
      sizes.push(baseSize.scale(scaleFactor))
    }

    return sizes
  }

  /**
   * 获取对象池统计信息
   *
   * 返回尺寸对象池的详细统计信息,包括池大小、命中率等。
   *
   * @returns 对象池统计信息
   * @example
   * ```ts
   * const stats = Size.getPoolStats()
   * console.log(`池大小: ${stats.poolSize}`)
   * console.log(`命中率: ${(stats.hitRate * 100).toFixed(2)}%`)
   * ```
   */
  static getPoolStats() {
    return SizePool.getInstance().getStats()
  }

  /**
   * 检查对象池健康状态
   *
   * 在开发模式下检查对象池的健康状态,如果发现潜在问题会输出警告。
   *
   * @example
   * ```ts
   * if (import.meta.env.DEV) {
   *   setInterval(() => Size.checkPoolHealth(), 60000)
   * }
   * ```
   */
  static checkPoolHealth(): void {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      const stats = this.getPoolStats()
      const total = stats.hits + stats.misses

      if (total > 100 && stats.hitRate < 0.5) {
        console.warn(
          `[Size] 对象池命中率较低: ${(stats.hitRate * 100).toFixed(2)}%`,
          '\n建议: 考虑增加池大小或检查使用模式',
        )
      }

      if (stats.created > MAX_SIZE_POOL * 3) {
        console.warn(
          `[Size] 已创建对象数量较多: ${stats.created}`,
          '\n建议: 检查是否有对象未调用 release() 方法',
        )
      }

      const utilization = (stats.poolSize / MAX_SIZE_POOL) * 100
      if (utilization > 90) {
        console.warn(
          `[Size] 对象池利用率过高: ${utilization.toFixed(2)}%`,
          '\n建议: 考虑增加 MAX_SIZE_POOL 常量的值',
        )
      }
    }
  }

  /**
   * 获取操作缓存统计信息
   *
   * 返回尺寸操作缓存的详细统计信息，包括命中率、缓存大小等。
   *
   * @returns 操作缓存统计信息
   * @example
   * ```ts
   * const stats = Size.getOperationCacheStats()
   * console.log(`缓存大小: ${stats.size}/${stats.capacity}`)
   * console.log(`命中率: ${(stats.hitRate * 100).toFixed(2)}%`)
   * ```
   */
  static getOperationCacheStats() {
    return this.operationCache.getStats()
  }

  /**
   * 预热操作缓存
   *
   * 预先计算常用尺寸操作，提升首次访问性能。
   * 适合在应用初始化时调用。
   *
   * @param sizes - 要预热的尺寸数组
   * @example
   * ```ts
   * const baseSizes = [
   *   new Size(16),
   *   new Size('1rem'),
   *   new Size('24px')
   * ]
   * Size.preheatCache(baseSizes)
   * ```
   */
  static preheatCache(sizes: Size[]): void {
    this.operationCache.preheat(sizes)
  }

  /**
   * 清理静态资源
   *
   * 清空所有缓存和对象池。用于测试或释放内存。
   */
  static cleanup(): void {
    SizePool.getInstance().clear()
    this.operationCache.clear()
  }

  // ============================================
  // Instance Methods
  // ============================================

  /**
   * 获取尺寸信息摘要
   *
   * @returns 尺寸信息对象
   *
   * @example
   * ```ts
   * const size = new Size('1.5rem')
   * const info = size.getInfo()
   * console.log(info)
   * // {
   * //   value: 1.5,
   * //   unit: 'rem',
   * //   pixels: 24,
   * //   formatted: '1.5rem'
   * // }
   * ```
   */
  getInfo(): {
    value: number
    unit: SizeUnit
    pixels: number
    formatted: string
  } {
    return {
      value: this.value,
      unit: this.unit,
      pixels: this.toPixels(),
      formatted: this.toString(),
    }
  }

  /**
   * 检查尺寸是否在指定范围内
   *
   * @param min - 最小值
   * @param max - 最大值
   * @returns 是否在范围内
   *
   * @example
   * ```ts
   * const size = new Size(20)
   * console.log(size.inRange(10, 30)) // true
   * console.log(size.inRange(25, 50)) // false
   * ```
   */
  inRange(min: SizeInput, max: SizeInput): boolean {
    const minSize = new Size(min, this.rootFontSize)
    const maxSize = new Size(max, this.rootFontSize)
    return this.gte(minSize) && this.lte(maxSize)
  }

  /**
   * 获取调试信息
   *
   * 返回详细的尺寸调试信息
   *
   * @returns 调试信息对象
   *
   * @example
   * ```ts
   * const size = new Size('1.5rem')
   * console.log(size.debug())
   * // {
   * //   value: 1.5,
   * //   unit: 'rem',
   * //   rootFontSize: 16,
   * //   pixels: 24,
   * //   rem: 1.5,
   * //   formatted: '1.5rem',
   * //   isValid: true
   * // }
   * ```
   */
  debug(): {
    value: number
    unit: SizeUnit
    rootFontSize: number
    pixels: number
    rem: number
    formatted: string
    isValid: boolean
  } {
    return {
      value: this.value,
      unit: this.unit,
      rootFontSize: this.rootFontSize,
      pixels: this.toPixels(),
      rem: this.toRem(),
      formatted: this.toString(),
      isValid: this.value >= 0 && Number.isFinite(this.value),
    }
  }

  /**
   * 释放尺寸对象回对象池
   *
   * 当不再需要使用此尺寸对象时,调用此方法将其释放回对象池以供复用
   * 注意: 释放后不应再使用此对象
   *
   * @example
   * ```ts
   * const size = new Size(16)
   * // 使用尺寸...
   * size.release() // 释放回对象池
   * ```
   */
  release(): void {
    SizePool.getInstance().release(this)
  }
}

// 初始化常用值缓存
if (COMMON_VALUES_CACHE.size === 0) {
  for (let i = 0; i <= 100; i += 4) {
    const key = `${i}:px:${DEFAULT_FONT_SIZE}`;
    const size = new Size(i, DEFAULT_FONT_SIZE);
    COMMON_VALUES_CACHE.set(key, size);
  }
}

// Export convenience functions - 使用对象池优化
const sizeCache = new Map<string, Size>();
const MAX_CACHE_SIZE = 50;

export const size = (input: SizeInput, rootFontSize = 16) => {
  // 对于常用值使用缓存
  if (typeof input === 'number') {
    const cacheKey = `${input}:${rootFontSize}`;
    if (sizeCache.has(cacheKey)) {
      return sizeCache.get(cacheKey)!.clone();
    }

    // 对于小数值使用对象池
    if (input >= 0 && input <= 100) {
      const newSize = SizePool.getInstance().acquire(input, rootFontSize);

      // LRU缓存管理
      if (sizeCache.size >= MAX_CACHE_SIZE) {
        const firstKey = sizeCache.keys().next().value;
        if (firstKey) sizeCache.delete(firstKey);
      }
      sizeCache.set(cacheKey, newSize);
      return newSize;
    }
  }
  return new Size(input, rootFontSize);
};
export const px = (value: number) => Size.fromPixels(value);
export const rem = (value: number, rootFontSize = 16) => Size.fromRem(value, rootFontSize);
export const em = (value: number, rootFontSize = 16) => Size.fromEm(value, rootFontSize);
export const vw = (value: number) => Size.fromViewportWidth(value);
export const vh = (value: number) => Size.fromViewportHeight(value);
export const percent = (value: number) => Size.fromPercentage(value);
