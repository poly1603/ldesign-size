/**
 * @ldesign/size - 工具函数集合
 * 
 * 提供尺寸相关的工具函数：
 * - 解析和格式化
 * - 单位转换
 * - 尺寸计算
 * - 缓存管理
 */

import type { SizeInput, SizeUnit, SizeValue } from '../types'
import { SIZE_CONFIG } from '../constants/sizes'
import { CacheType, globalCacheManager } from './CacheManager'

// 使用全局缓存管理器获取各类缓存
const parseCache = globalCacheManager.getCache<string, SizeValue>(CacheType.PARSE)
const formatCache = globalCacheManager.getCache<string, string>(CacheType.FORMAT)
const conversionCache = globalCacheManager.getCache<string, SizeValue>(CacheType.CONVERSION)

// 预计算常用转换因子
const { PT_TO_PX, PX_TO_PT } = SIZE_CONFIG

/**
 * 解析尺寸输入为 SizeValue 对象
 * 
 * 支持多种输入格式：
 * - 数字：默认为 px 单位
 * - 字符串：解析单位（如 "16px", "1rem"）
 * - SizeValue 对象：直接返回
 * 
 * @param input - 尺寸输入
 * @returns SizeValue 对象
 * 
 * @example
 * ```ts
 * parseSizeInput(16) // { value: 16, unit: 'px' }
 * parseSizeInput('1rem') // { value: 1, unit: 'rem' }
 * ```
 */
export function parseSizeInput(input: SizeInput): SizeValue {
  // 快速路径：数字
  if (typeof input === 'number') {
    return { value: input, unit: 'px' }
  }

  // 快速路径：已经是 SizeValue 对象
  if (typeof input === 'object' && 'value' in input && 'unit' in input) {
    return input
  }

  // 字符串解析路径
  if (typeof input === 'string') {
    // 检查缓存
    const cached = parseCache.get(input)
    if (cached) return cached

    // 解析字符串（支持常见单位）
    const match = input.match(/^(-?(?:\d+(?:\.\d+)?|\.\d+))(px|rem|em|vw|vh|%|pt|vmin|vmax)?$/)
    if (match) {
      const value = Number.parseFloat(match[1])
      const unit = (match[2] || 'px') as SizeUnit
      const result = { value, unit }

      // 使用 LRUCache（自动管理大小）
      parseCache.set(input, result)

      return result
    }
  }

  // 默认回退值
  return { value: 0, unit: 'px' }
}

/**
 * 格式化 SizeValue 为字符串
 * 
 * @param size - SizeValue 对象
 * @returns 格式化的字符串（如 "16px"）
 * 
 * @example
 * ```ts
 * formatSize({ value: 16, unit: 'px' }) // "16px"
 * formatSize({ value: 0, unit: 'px' }) // "0"
 * ```
 */
export function formatSize(size: SizeValue): string {
  // 快速路径：0 值（任何单位的 0 都可以简写为 "0"）
  if (size.value === 0) return '0'

  // 检查缓存
  const cacheKey = `${size.value}:${size.unit}`
  const cached = formatCache.get(cacheKey)
  if (cached) return cached

  // 格式化
  const result = `${size.value}${size.unit}`

  // 使用 LRUCache（自动管理大小）
  formatCache.set(cacheKey, result)

  return result
}

/**
 * 在单位之间转换尺寸
 * 
 * 支持 px, rem, em, pt 等单位的互相转换
 * 对于视口单位（vw, vh）和百分比，保持原值
 * 
 * @param size - 源尺寸值
 * @param targetUnit - 目标单位
 * @param rootFontSize - 根字体大小（用于 rem/em 转换）
 * @returns 转换后的尺寸值
 * 
 * @example
 * ```ts
 * convertSize({ value: 16, unit: 'px' }, 'rem', 16) // { value: 1, unit: 'rem' }
 * convertSize({ value: 1, unit: 'rem' }, 'px', 16) // { value: 16, unit: 'px' }
 * ```
 */
export function convertSize(
  size: SizeValue,
  targetUnit: SizeUnit,
  rootFontSize = SIZE_CONFIG.DEFAULT_ROOT_FONT_SIZE
): SizeValue {
  // 快速路径：相同单位，直接返回
  if (size.unit === targetUnit) {
    return size
  }

  // 检查缓存
  const cacheKey = `${size.value}:${size.unit}:${targetUnit}:${rootFontSize}`
  const cached = conversionCache.get(cacheKey)
  if (cached) return cached

  // 第一步：转换为像素值（中间格式）
  let pxValue = size.value

  switch (size.unit) {
    case 'rem':
      pxValue = size.value * rootFontSize
      break
    case 'em':
      // 假设 1em = rootFontSize（简化处理）
      pxValue = size.value * rootFontSize
      break
    case 'pt':
      pxValue = size.value * PT_TO_PX
      break
    case '%':
    case 'vw':
    case 'vh':
    case 'vmin':
    case 'vmax':
      // 这些单位需要上下文，保持原值
      return { value: size.value, unit: targetUnit }
  }

  // 第二步：从像素值转换为目标单位
  let targetValue = pxValue

  switch (targetUnit) {
    case 'rem':
      targetValue = pxValue / rootFontSize
      break
    case 'em':
      targetValue = pxValue / rootFontSize
      break
    case 'pt':
      targetValue = pxValue * PX_TO_PT
      break
    case 'px':
      targetValue = pxValue
      break
    default:
      // 对于视口单位和百分比，保持原值
      return { value: size.value, unit: targetUnit }
  }

  const result = { value: targetValue, unit: targetUnit }

  // 使用 LRUCache（自动管理大小）
  conversionCache.set(cacheKey, result)

  return result
}

/**
 * Scale a size by a factor
 */
export function scaleSize(size: SizeValue, factor: number): SizeValue {
  return {
    value: size.value * factor,
    unit: size.unit
  };
}

/**
 * Add two sizes (must be same unit or convertible)
 */
export function addSizes(a: SizeValue, b: SizeValue, rootFontSize = 16): SizeValue {
  if (a.unit === b.unit) {
    return { value: a.value + b.value, unit: a.unit };
  }

  // Convert b to a's unit
  const convertedB = convertSize(b, a.unit, rootFontSize);
  return { value: a.value + convertedB.value, unit: a.unit };
}

/**
 * Subtract two sizes
 */
export function subtractSizes(a: SizeValue, b: SizeValue, rootFontSize = 16): SizeValue {
  if (a.unit === b.unit) {
    return { value: a.value - b.value, unit: a.unit };
  }

  const convertedB = convertSize(b, a.unit, rootFontSize);
  return { value: a.value - convertedB.value, unit: a.unit };
}

/**
 * Clamp a size value between min and max
 */
export function clampSize(
  size: SizeValue,
  min?: SizeInput,
  max?: SizeInput,
  rootFontSize = 16
): SizeValue {
  let value = size.value;

  if (min !== undefined) {
    const minSize = parseSizeInput(min);
    const convertedMin = convertSize(minSize, size.unit, rootFontSize);
    value = Math.max(value, convertedMin.value);
  }

  if (max !== undefined) {
    const maxSize = parseSizeInput(max);
    const convertedMax = convertSize(maxSize, size.unit, rootFontSize);
    value = Math.min(value, convertedMax.value);
  }

  return { value, unit: size.unit };
}

// 预计算常用的精度因子
const precisionFactors = new Map<number, number>();
for (let i = 0; i <= 10; i++) {
  precisionFactors.set(i, 10 ** i);
}

/**
 * Round size value to specified precision
 */
export function roundSize(size: SizeValue, precision = 2): SizeValue {
  const factor = precisionFactors.get(precision) ?? (10 ** precision);
  return {
    value: Math.round(size.value * factor) / factor,
    unit: size.unit
  };
}

/**
 * Generate a size scale
 */
export function generateSizeScale(
  base: number,
  ratio: number,
  steps: number,
  unit: SizeUnit = 'px'
): SizeValue[] {
  const sizes: SizeValue[] = [];

  // Generate sizes below base
  for (let i = steps; i > 0; i--) {
    const value = base / ratio ** i;
    sizes.push({ value: Math.round(value * 100) / 100, unit });
  }

  // Add base
  sizes.push({ value: base, unit });

  // Generate sizes above base
  for (let i = 1; i <= steps; i++) {
    const value = base * ratio ** i;
    sizes.push({ value: Math.round(value * 100) / 100, unit });
  }

  return sizes;
}

/**
 * Check if a size is valid
 */
export function isValidSize(input: any): input is SizeInput {
  if (typeof input === 'number') {
    return !Number.isNaN(input) && Number.isFinite(input);
  }

  if (typeof input === 'string') {
    const match = input.match(/^(-?(?:\d+(?:\.\d+)?|\.\d+))(px|rem|em|vw|vh|%|pt|vmin|vmax)?$/);
    return !!match;
  }

  if (typeof input === 'object' && input !== null) {
    return (
      'value' in input &&
      'unit' in input &&
      typeof input.value === 'number' &&
      typeof input.unit === 'string'
    );
  }

  return false;
}

/**
 * Get CSS custom property name
 */
export function getCSSVarName(name: string, prefix = 'size'): string {
  // Convert camelCase to kebab-case
  const kebab = name.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `--${prefix}-${kebab}`;
}

/**
 * Generate CSS value with fallback
 */
export function cssVar(name: string, fallback?: string): string {
  return fallback ? `var(${name}, ${fallback})` : `var(${name})`;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;

  // 使用迭代替代递归，减少调用栈开销
  for (const source of sources) {
    if (!isObject(source)) continue;

    const stack: Array<{ target: any; source: any }> = [{ target, source }];

    while (stack.length > 0) {
      const { target: currentTarget, source: currentSource } = stack.pop()!;

      for (const key in currentSource) {
        if (Object.prototype.hasOwnProperty.call(currentSource, key)) {
          const sourceValue = currentSource[key];

          if (isObject(sourceValue)) {
            if (!currentTarget[key] || !isObject(currentTarget[key])) {
              currentTarget[key] = {};
            }
            stack.push({ target: currentTarget[key], source: sourceValue });
          } else {
            currentTarget[key] = sourceValue;
          }
        }
      }
    }
  }

  return target;
}

/**
 * Check if value is a plain object
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 记忆化函数，缓存计算结果
 * 
 * 用于优化重复计算，自动使用 LRU 缓存策略
 * 
 * @template T - 函数类型
 * @param fn - 要记忆化的函数
 * @param getKey - 自定义缓存键生成函数
 * @param maxCacheSize - 最大缓存大小
 * @returns 记忆化后的函数
 * 
 * @example
 * ```ts
 * const expensiveCalc = memoize((x: number, y: number) => {
 *   console.log('Calculating...')
 *   return x * y
 * })
 * 
 * expensiveCalc(2, 3) // "Calculating..." -> 6
 * expensiveCalc(2, 3) // 直接从缓存返回 -> 6
 * ```
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string,
  maxCacheSize?: number
): T {
  // 使用全局缓存管理器创建缓存
  const cache = globalCacheManager.getCache<string, ReturnType<T>>(
    CacheType.UTILITY,
    maxCacheSize
  )

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    // 生成缓存键
    const key = getKey ? getKey(...args) : JSON.stringify(args)

    // 检查缓存
    const cached = cache.get(key)
    if (cached !== undefined) {
      return cached
    }

    // 执行函数并缓存结果
    const result = fn.apply(this, args)
    cache.set(key, result)

    return result
  } as T
}

/**
 * Batch process size values for performance
 */
export function batchProcessSizes<T>(
  items: T[],
  processor: (item: T) => void,
  _batchSize = 10
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!items || items.length === 0) {
      resolve();
      return;
    }

    let index = 0;
    let rafId: number | null = null;

    function processBatch() {
      try {
        const startTime = performance.now();
        const maxTime = 16; // 每帧最多处琇16ms

        while (index < items.length) {
          processor(items[index]);
          index++;

          // 如果超过时间限制，让出执行权
          if (performance.now() - startTime > maxTime && index < items.length) {
            rafId = requestAnimationFrame(processBatch);
            return;
          }
        }

        resolve();
      } catch (error) {
        // 清理
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        reject(error);
      }
    }

    rafId = requestAnimationFrame(processBatch);
  });
}

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (callback: IdleRequestCallback) => setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline), 1);

// 导出缓存管理器
export { CacheManager, CacheType, globalCacheManager } from './CacheManager'
export type { } from './CacheManager'

// 导出错误处理
export {
  SizeError,
  ErrorHandlerManager,
  globalErrorHandler,
  ERROR_CODES,
  handleError,
  createError,
} from './error'
export type { ErrorCode, ErrorContext, ErrorHandler } from './error'

// 导出性能基准测试
export * from './benchmark'

// 导出懒加载工具
export * from './lazyLoader'

// 导出内存优化工具
export * from './memoryOptimizer'

// 导出性能诊断工具
export * from './performanceDiagnostics'

// 导出独立的 LRU 缓存实现（优化版本）
export { LRUCache as LRUCacheOptimized } from './LRUCache'

// 导出内存监测工具
export { MemoryMonitor, getGlobalMemoryMonitor, destroyGlobalMemoryMonitor } from './MemoryMonitor'
export type { MemoryInfo, MemoryMonitorOptions, CleanupHandler } from './MemoryMonitor'

/**
 * Optimize CSS variable generation with deduplication
 */
export function optimizeCSSVariables(variables: Record<string, string>): Record<string, string> {
  // 快速返回空对象
  if (!variables || Object.keys(variables).length === 0) {
    return {};
  }

  const optimized: Record<string, string> = {};
  const valueMap = new Map<string, string[]>();

  // 使用 for...in 替代 Object.entries 减少中间数组创建
  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      const value = variables[key];
      if (!valueMap.has(value)) {
        valueMap.set(value, []);
      }
      valueMap.get(value)!.push(key);
    }
  }

  // 创建引用以减少重复值
  for (const [value, keys] of valueMap) {
    if (keys.length > 1) {
      // 使用第一个键作为基础
      const baseKey = keys[0];
      optimized[baseKey] = value;

      // 其他键引用基础键
      for (let i = 1; i < keys.length; i++) {
        optimized[keys[i]] = `var(${baseKey})`;
      }
    } else {
      optimized[keys[0]] = value;
    }
  }

  return optimized;
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastTime: number;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastTime >= limit) {
          func.apply(this, args);
          lastTime = Date.now();
        }
      }, Math.max(limit - (Date.now() - lastTime), 0));
    }
  } as T;
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  } as T;
}