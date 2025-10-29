/**
 * @ldesign/size - 错误处理系统
 * 
 * 提供统一的错误类型和错误处理机制
 */

/**
 * 错误代码枚举
 * 
 * 定义所有可能的错误类型
 */
export const ERROR_CODES = {
  /** 无效的尺寸值 */
  INVALID_SIZE: 'INVALID_SIZE',

  /** 预设未找到 */
  PRESET_NOT_FOUND: 'PRESET_NOT_FOUND',

  /** 管理器已销毁 */
  MANAGER_DESTROYED: 'MANAGER_DESTROYED',

  /** 无效的配置 */
  INVALID_CONFIG: 'INVALID_CONFIG',

  /** 单位转换失败 */
  CONVERSION_FAILED: 'CONVERSION_FAILED',

  /** CSS 注入失败 */
  CSS_INJECTION_FAILED: 'CSS_INJECTION_FAILED',

  /** 存储操作失败 */
  STORAGE_FAILED: 'STORAGE_FAILED',

  /** 监听器错误 */
  LISTENER_ERROR: 'LISTENER_ERROR',

  /** 插件初始化失败 */
  PLUGIN_INIT_FAILED: 'PLUGIN_INIT_FAILED',
} as const

/**
 * 错误代码类型
 */
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

/**
 * 错误上下文接口
 * 
 * 提供错误发生时的额外信息
 */
export interface ErrorContext {
  /** 错误发生的文件/模块 */
  source?: string

  /** 错误发生时的相关数据 */
  data?: any

  /** 错误堆栈信息 */
  stack?: string

  /** 时间戳 */
  timestamp?: number

  /** 额外的调试信息 */
  [key: string]: any
}

/**
 * Size 错误类
 * 
 * 扩展标准 Error，添加错误代码和上下文信息
 * 
 * @example
 * ```ts
 * throw new SizeError(
 *   '无效的基础尺寸',
 *   ERROR_CODES.INVALID_SIZE,
 *   { value: -1, expected: '> 0' }
 * )
 * ```
 */
export class SizeError extends Error {
  /** 错误代码 */
  public readonly code: ErrorCode

  /** 错误上下文 */
  public readonly context: ErrorContext

  /** 错误发生时间 */
  public readonly timestamp: number

  /**
   * 构造函数
   * 
   * @param message - 错误消息
   * @param code - 错误代码
   * @param context - 错误上下文（可选）
   */
  constructor(
    message: string,
    code: ErrorCode,
    context: ErrorContext = {}
  ) {
    super(message)

    this.name = 'SizeError'
    this.code = code
    this.timestamp = Date.now()
    this.context = {
      ...context,
      timestamp: this.timestamp,
      stack: this.stack,
    }

    // 维护正确的原型链（TypeScript/Babel 转译需要）
    Object.setPrototypeOf(this, SizeError.prototype)
  }

  /**
   * 转换为 JSON 格式
   * 
   * 便于日志记录和序列化
   * 
   * @returns JSON 对象
   */
  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
    }
  }

  /**
   * 转换为字符串
   * 
   * @returns 格式化的错误字符串
   */
  toString(): string {
    return `${this.name} [${this.code}]: ${this.message}`
  }
}

/**
 * 错误处理器函数类型
 */
export type ErrorHandler = (error: SizeError) => void

/**
 * 全局错误处理器管理类
 * 
 * 统一管理错误处理逻辑
 */
export class ErrorHandlerManager {
  /** 单例实例 */
  private static instance: ErrorHandlerManager

  /** 错误处理器映射表（按错误代码） */
  private handlers = new Map<ErrorCode, Set<ErrorHandler>>()

  /** 全局错误处理器（捕获所有错误） */
  private globalHandlers = new Set<ErrorHandler>()

  /** 是否在开发模式 */
  private isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'

  /**
   * 私有构造函数（单例模式）
   */
  private constructor() { }

  /**
   * 获取单例实例
   * 
   * @returns ErrorHandlerManager 实例
   */
  static getInstance(): ErrorHandlerManager {
    if (!ErrorHandlerManager.instance) {
      ErrorHandlerManager.instance = new ErrorHandlerManager()
    }
    return ErrorHandlerManager.instance
  }

  /**
   * 注册错误处理器
   * 
   * @param code - 错误代码（可选，不提供则为全局处理器）
   * @param handler - 错误处理函数
   * @returns 取消注册函数
   * 
   * @example
   * ```ts
   * // 注册特定错误的处理器
   * const unregister = errorHandler.register(ERROR_CODES.INVALID_SIZE, (error) => {
   *   console.error('尺寸错误:', error.message)
   * })
   * 
   * // 取消注册
   * unregister()
   * 
   * // 注册全局处理器（捕获所有错误）
   * errorHandler.register(null, (error) => {
   *   logToServer(error)
   * })
   * ```
   */
  register(code: ErrorCode | null, handler: ErrorHandler): () => void {
    if (code === null) {
      // 全局处理器
      this.globalHandlers.add(handler)
      return () => {
        this.globalHandlers.delete(handler)
      }
    }

    // 特定错误代码的处理器
    if (!this.handlers.has(code)) {
      this.handlers.set(code, new Set())
    }
    this.handlers.get(code)!.add(handler)

    return () => {
      const handlers = this.handlers.get(code)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) {
          this.handlers.delete(code)
        }
      }
    }
  }

  /**
   * 处理错误
   * 
   * 触发相关的错误处理器
   * 
   * @param error - SizeError 实例
   * 
   * @example
   * ```ts
   * try {
   *   // ... 可能出错的代码
   * } catch (err) {
   *   errorHandler.handle(new SizeError(
   *     '操作失败',
   *     ERROR_CODES.INVALID_CONFIG,
   *     { originalError: err }
   *   ))
   * }
   * ```
   */
  handle(error: SizeError): void {
    // 开发模式下打印到控制台
    if (this.isDevelopment) {
      console.error('[SizeError]', error.toString())
      console.error('Context:', error.context)
    }

    // 触发特定错误代码的处理器
    const handlers = this.handlers.get(error.code)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(error)
        } catch (handlerError) {
          console.error('[ErrorHandler] Handler execution failed:', handlerError)
        }
      })
    }

    // 触发全局处理器
    this.globalHandlers.forEach(handler => {
      try {
        handler(error)
      } catch (handlerError) {
        console.error('[ErrorHandler] Global handler execution failed:', handlerError)
      }
    })

    // 如果没有任何处理器，记录警告
    if (!handlers && this.globalHandlers.size === 0) {
      console.warn('[ErrorHandler] No handler registered for error code:', error.code)
    }
  }

  /**
   * 清除所有错误处理器
   */
  clearAll(): void {
    this.handlers.clear()
    this.globalHandlers.clear()
  }

  /**
   * 清除特定错误代码的处理器
   * 
   * @param code - 错误代码
   */
  clear(code: ErrorCode): void {
    this.handlers.delete(code)
  }

  /**
   * 获取统计信息
   * 
   * @returns 处理器统计数据
   */
  getStats() {
    const specificHandlers = Array.from(this.handlers.entries()).map(([code, handlers]) => ({
      code,
      handlerCount: handlers.size,
    }))

    return {
      specificHandlers,
      globalHandlerCount: this.globalHandlers.size,
      totalHandlerTypes: this.handlers.size,
    }
  }
}

/**
 * 全局错误处理器实例
 * 
 * @example
 * ```ts
 * import { globalErrorHandler, ERROR_CODES } from '@ldesign/size/utils/error'
 * 
 * // 注册错误处理器
 * globalErrorHandler.register(ERROR_CODES.INVALID_SIZE, (error) => {
 *   // 处理无效尺寸错误
 * })
 * ```
 */
export const globalErrorHandler = ErrorHandlerManager.getInstance()

/**
 * 辅助函数：创建并处理错误
 * 
 * @param message - 错误消息
 * @param code - 错误代码
 * @param context - 错误上下文
 * 
 * @example
 * ```ts
 * handleError('配置无效', ERROR_CODES.INVALID_CONFIG, { config })
 * ```
 */
export function handleError(
  message: string,
  code: ErrorCode,
  context?: ErrorContext
): void {
  const error = new SizeError(message, code, context)
  globalErrorHandler.handle(error)
}

/**
 * 辅助函数：创建错误但不立即处理
 * 
 * @param message - 错误消息
 * @param code - 错误代码
 * @param context - 错误上下文
 * @returns SizeError 实例
 * 
 * @example
 * ```ts
 * throw createError('无效的尺寸', ERROR_CODES.INVALID_SIZE)
 * ```
 */
export function createError(
  message: string,
  code: ErrorCode,
  context?: ErrorContext
): SizeError {
  return new SizeError(message, code, context)
}

