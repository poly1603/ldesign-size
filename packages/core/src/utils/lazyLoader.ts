/**
 * @ldesign/size - 懒加载工具
 * 
 * 实现按需加载，减少初始内存占用
 */

// 模块缓存（LRU裁剪）
const moduleCache = new Map<string, unknown>();
const loadingPromises = new Map<string, Promise<unknown>>();
// 缓存上限（可调整）
let cacheLimit = 50;

/**
 * 设置懒加载缓存上限（LRU）
 */
export function setCacheLimit(limit: number): void {
  cacheLimit = Math.max(0, limit | 0);
  // 立即裁剪到上限，避免占用过多内存
  while (moduleCache.size > cacheLimit) {
    const firstKey = moduleCache.keys().next().value as string | undefined;
    if (firstKey) moduleCache.delete(firstKey);
    else break;
  }
}

/**
 * 懒加载模块
 */
export async function lazyLoad<T>(
  moduleId: string,
  loader: () => Promise<T>
): Promise<T> {
  // 检查缓存
  if (moduleCache.has(moduleId)) {
    return moduleCache.get(moduleId) as T;
  }

  // 检查是否正在加载
  if (loadingPromises.has(moduleId)) {
    return loadingPromises.get(moduleId) as Promise<T>;
  }

  // 开始加载
  const loadPromise = loader()
    .then((module) => {
      moduleCache.set(moduleId, module as unknown);
      // LRU：若超过上限，移除最早的条目以释放内存
      if (moduleCache.size > cacheLimit) {
        const firstKey = moduleCache.keys().next().value as string | undefined;
        if (firstKey) moduleCache.delete(firstKey);
      }
      loadingPromises.delete(moduleId);
      return module;
    })
    .catch((error) => {
      loadingPromises.delete(moduleId);
      throw error;
    });

  loadingPromises.set(moduleId, loadPromise);
  return loadPromise;
}

/**
 * 预加载模块（空闲时加载）
 */
export function preload<T>(
  moduleId: string,
  loader: () => Promise<T>
): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      lazyLoad(moduleId, loader);
    });
  } else {
    // 降级方案：使用 setTimeout
    setTimeout(() => {
      lazyLoad(moduleId, loader);
    }, 1);
  }
}

/**
 * 清理缓存
 */
export function clearCache(moduleId?: string): void {
  if (moduleId) {
    moduleCache.delete(moduleId);
    loadingPromises.delete(moduleId);
  } else {
    moduleCache.clear();
    loadingPromises.clear();
  }
}

/**
 * 创建懒加载代理
 *
 * @param target - 模块加载函数
 * @param moduleId - 模块标识符
 * @returns 懒加载代理对象
 */
export function createLazyProxy<T extends object>(
  target: () => Promise<T>,
  moduleId: string
): T {
  let instance: T | null = null;
  let loading = false;
  let loadError: Error | null = null;

  return new Proxy({} as T, {
    get(_, prop) {
      if (!instance && !loading && !loadError) {
        loading = true;
        lazyLoad(moduleId, target).then((module) => {
          instance = module;
          loading = false;
          loadError = null;
        }).catch((error: Error) => {
          // 保存错误信息,避免永久卡死
          loading = false;
          loadError = error;

          // 在开发模式下输出详细错误
          if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
            console.error(
              `[LazyLoader] 模块 "${moduleId}" 加载失败:`,
              '\n错误:', error.message,
              '\n堆栈:', error.stack,
              '\n建议: 检查模块路径是否正确,或网络连接是否正常'
            );
          }
        });
      }

      if (instance) {
        return (instance as any)[prop];
      }

      // 如果加载失败,抛出详细错误
      if (loadError) {
        throw new Error(
          `模块 "${moduleId}" 加载失败: ${loadError.message}\n` +
          `尝试访问属性: ${String(prop)}\n` +
          `建议: 请检查模块是否存在,或稍后重试`
        );
      }

      // 返回一个占位函数(仅在加载中时)
      return () => {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
          console.warn(
            `[LazyLoader] 模块 "${moduleId}" 正在加载中...`,
            `\n尝试访问: ${String(prop)}`,
            `\n建议: 等待模块加载完成后再调用`
          );
        }
        return Promise.resolve();
      };
    }
  });
}

/**
 * 获取缓存状态
 */
export function getCacheStatus(): {
  cached: string[];
  loading: string[];
  totalSize: number;
} {
  return {
    cached: Array.from(moduleCache.keys()),
    loading: Array.from(loadingPromises.keys()),
    totalSize: moduleCache.size
  };
}