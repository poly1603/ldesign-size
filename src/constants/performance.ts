/**
 * @ldesign/size - 性能配置常量
 * 
 * 统一管理所有性能相关的配置参数，便于调优和维护
 */

/**
 * 性能配置常量
 * 
 * 这些常量用于控制缓存大小、时间阈值、批处理等性能关键参数
 */
export const PERFORMANCE_CONFIG = {
  // ==================== 缓存大小配置 ====================

  /** Size 对象池最大大小 - 控制内存占用 */
  MAX_SIZE_POOL: 200,

  /** 字符串解析缓存大小 - 缓存常见的尺寸字符串解析结果 */
  MAX_PARSE_CACHE: 200,

  /** 格式化缓存大小 - 缓存 SizeValue 到字符串的转换结果 */
  MAX_FORMAT_CACHE: 200,

  /** 单位转换缓存大小 - 最常用，设置较大值提高命中率 */
  MAX_CONVERSION_CACHE: 500,

  /** CSS 生成缓存大小 - 缓存完整的 CSS 字符串 */
  MAX_CSS_CACHE_SIZE: 50,

  /** 常用值缓存大小 - 缓存 0-100 之间常用的 Size 对象 */
  MAX_COMMON_VALUES_CACHE: 100,

  /** 工具类缓存大小 - memoize 等工具函数的默认缓存大小 */
  MAX_UTILITY_CACHE: 100,

  // ==================== 时间相关配置（毫秒） ====================

  /** 对象池自动清理间隔 - 定期清理未使用的池化对象 */
  CLEANUP_INTERVAL: 60_000, // 1分钟

  /** 单帧预算时间 - 60fps 下每帧的理想时间 */
  FRAME_BUDGET: 16,

  /** requestIdleCallback 超时时间 */
  IDLE_CALLBACK_TIMEOUT: 50,

  /** 防抖默认延迟 */
  DEFAULT_DEBOUNCE_DELAY: 300,

  /** 节流默认间隔 */
  DEFAULT_THROTTLE_INTERVAL: 100,

  // ==================== 批处理配置 ====================

  /** 监听器批处理大小 - 每批处理的监听器数量 */
  LISTENER_BATCH_SIZE: 10,

  /** 批处理最大执行时间 - 避免长时间阻塞主线程 */
  MAX_BATCH_TIME: 16,

  /** 尺寸值批处理大小 */
  SIZE_BATCH_SIZE: 10,

  // ==================== 精度配置 ====================

  /** 浮点数比较精度 - 用于 equals 等比较操作 */
  EPSILON: 0.001,

  /** 默认小数精度 - round 操作的默认精度 */
  DECIMAL_PRECISION: 2,

  // ==================== 性能监控配置 ====================

  /** 性能趋势分析的样本数 */
  TREND_ANALYSIS_SAMPLES: 10,

  /** 性能预算警告阈值（毫秒） */
  PERFORMANCE_BUDGET_WARNING: 16,

  /** 缓存命中率警告阈值 */
  CACHE_HIT_RATE_WARNING: 0.7,
} as const

/**
 * 性能配置类型
 */
export type PerformanceConfig = typeof PERFORMANCE_CONFIG

/**
 * 获取性能配置
 * 
 * @param key - 配置键名
 * @returns 配置值
 */
export function getPerformanceConfig<K extends keyof PerformanceConfig>(
  key: K
): PerformanceConfig[K] {
  return PERFORMANCE_CONFIG[key]
}


