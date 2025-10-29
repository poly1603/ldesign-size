/**
 * @ldesign/size - 共享工具函数
 * 
 * 提供跨模块复用的通用工具函数，减少代码重复
 * 
 * @packageDocumentation
 */

/**
 * 安全的定时器包装（自动 unref）
 * 
 * 在 Node.js 环境中自动调用 unref()，防止定时器阻止进程退出
 * 在浏览器环境中正常工作（unref 方法不存在）
 * 
 * @param callback - 回调函数
 * @param interval - 间隔时间（毫秒）
 * @returns 清理函数，调用后停止定时器
 * 
 * @example
 * ```ts
 * const cleanup = createSafeInterval(() => {
 *   console.log('tick')
 * }, 1000)
 * 
 * // 停止定时器
 * cleanup()
 * ```
 */
export function createSafeInterval(
  callback: () => void,
  interval: number
): () => void {
  const timer = setInterval(callback, interval)

  // ✅ 使用 unref() 防止阻止 Node.js 进程退出
  // 在浏览器环境中 unref() 不存在，使用类型断言和可选检查
  if (typeof (timer as any).unref === 'function') {
    (timer as any).unref()
  }

  // 返回清理函数
  return () => clearInterval(timer)
}

/**
 * 安全的超时包装（自动 unref）
 * 
 * @param callback - 回调函数
 * @param delay - 延迟时间（毫秒）
 * @returns 清理函数，调用后取消超时
 * 
 * @example
 * ```ts
 * const cleanup = createSafeTimeout(() => {
 *   console.log('timeout')
 * }, 5000)
 * 
 * // 取消超时
 * cleanup()
 * ```
 */
export function createSafeTimeout(
  callback: () => void,
  delay: number
): () => void {
  const timer = setTimeout(callback, delay)

  // ✅ 使用 unref() 防止阻止 Node.js 进程退出
  if (typeof (timer as any).unref === 'function') {
    (timer as any).unref()
  }

  // 返回清理函数
  return () => clearTimeout(timer)
}

/**
 * 内存大小格式化
 * 
 * 将字节数转换为人类可读的格式
 * 
 * @param bytes - 字节数
 * @param decimals - 小数位数（默认 2）
 * @returns 格式化后的字符串
 * 
 * @example
 * ```ts
 * formatMemorySize(1024)           // "1.00KB"
 * formatMemorySize(1024 * 1024)    // "1.00MB"
 * formatMemorySize(1536, 1)        // "1.5KB"
 * ```
 */
export function formatMemorySize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0B'
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(decimals)}KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(decimals)}MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(decimals)}GB`
}

/**
 * 百分比格式化
 * 
 * @param value - 数值（0-1 之间）
 * @param decimals - 小数位数（默认 1）
 * @returns 格式化后的百分比字符串
 * 
 * @example
 * ```ts
 * formatPercent(0.856)      // "85.6%"
 * formatPercent(0.856, 2)   // "85.60%"
 * formatPercent(1)          // "100.0%"
 * ```
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * 时间格式化
 * 
 * @param milliseconds - 毫秒数
 * @returns 格式化后的时间字符串
 * 
 * @example
 * ```ts
 * formatDuration(500)       // "500ms"
 * formatDuration(1500)      // "1.50s"
 * formatDuration(65000)     // "1m 5s"
 * ```
 */
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(0)}ms`
  }

  if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(2)}s`
  }

  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.floor((milliseconds % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

/**
 * 批量操作工具
 * 
 * 将大批量操作分批处理，避免阻塞主线程
 * 
 * @template T - 输入项类型
 * @template R - 输出结果类型
 * @param items - 要处理的项数组
 * @param processor - 处理函数
 * @param batchSize - 批次大小（默认 10）
 * @returns Promise 包含所有处理结果
 * 
 * @example
 * ```ts
 * const results = await batchProcess(
 *   largeArray,
 *   async (item) => processItem(item),
 *   50
 * )
 * ```
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T, index: number) => R | Promise<R>,
  batchSize = 10
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map((item, batchIndex) => processor(item, i + batchIndex))
    )
    results.push(...batchResults)
  }

  return results
}

/**
 * 节流函数
 * 
 * 限制函数执行频率，在指定时间内最多执行一次
 * 
 * @template T - 函数类型
 * @param fn - 要节流的函数
 * @param delay - 节流延迟（毫秒）
 * @returns 节流后的函数
 * 
 * @example
 * ```ts
 * const throttledScroll = throttle((e: Event) => {
 *   console.log('scroll event', e)
 * }, 100)
 * 
 * window.addEventListener('scroll', throttledScroll)
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>): void {
    const now = Date.now()

    if (now - lastCall >= delay) {
      // 立即执行
      lastCall = now
      fn.apply(this, args)
    } else {
      // 延迟执行（只保留最后一次调用）
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        fn.apply(this, args)
        timeoutId = null
      }, delay - (now - lastCall))
    }
  }
}

/**
 * 防抖函数
 * 
 * 在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发则重新计时
 * 
 * @template T - 函数类型
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 * 
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('search:', query)
 * }, 300)
 * 
 * input.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value)
 * })
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>): void {
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 设置新的定时器
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
      timeoutId = null
    }, delay)
  }
}

/**
 * 深度克隆
 * 
 * 创建对象的深拷贝（支持基本类型、数组、普通对象）
 * 
 * @template T - 对象类型
 * @param obj - 要克隆的对象
 * @returns 克隆后的对象
 * 
 * @example
 * ```ts
 * const original = { a: 1, b: { c: 2 } }
 * const cloned = deepClone(original)
 * cloned.b.c = 3
 * console.log(original.b.c) // 2 (不受影响)
 * ```
 */
export function deepClone<T>(obj: T): T {
  // 处理基本类型和 null
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // 处理日期
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T
  }

  // 处理普通对象
  const cloned = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }

  return cloned
}

/**
 * 安全的 JSON 解析
 * 
 * @param json - JSON 字符串
 * @param fallback - 解析失败时的默认值
 * @returns 解析结果或默认值
 * 
 * @example
 * ```ts
 * const data = safeJSONParse('{"a":1}', {})  // { a: 1 }
 * const invalid = safeJSONParse('invalid', {})  // {}
 * ```
 */
export function safeJSONParse<T = any>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * 休眠函数
 * 
 * @param ms - 休眠时间（毫秒）
 * @returns Promise
 * 
 * @example
 * ```ts
 * await sleep(1000)  // 休眠 1 秒
 * console.log('1 second later')
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 重试函数
 * 
 * @template T - 返回类型
 * @param fn - 要重试的函数
 * @param options - 重试选项
 * @returns Promise 包含函数结果
 * 
 * @example
 * ```ts
 * const result = await retry(
 *   () => fetchData(),
 *   { maxAttempts: 3, delay: 1000 }
 * )
 * ```
 */
export async function retry<T>(
  fn: () => T | Promise<T>,
  options: {
    maxAttempts?: number
    delay?: number
    onError?: (error: Error, attempt: number) => void
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    onError,
  } = options

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (onError) {
        onError(lastError, attempt)
      }

      // 如果还有重试机会，等待后继续
      if (attempt < maxAttempts) {
        await sleep(delay)
      }
    }
  }

  // 所有重试都失败，抛出最后一个错误
  throw lastError
}

