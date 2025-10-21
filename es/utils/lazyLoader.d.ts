/**
 * @ldesign/size - 懒加载工具
 *
 * 实现按需加载，减少初始内存占用
 */
/**
 * 设置懒加载缓存上限（LRU）
 */
export declare function setCacheLimit(limit: number): void;
/**
 * 懒加载模块
 */
export declare function lazyLoad<T>(moduleId: string, loader: () => Promise<T>): Promise<T>;
/**
 * 预加载模块（空闲时加载）
 */
export declare function preload<T>(moduleId: string, loader: () => Promise<T>): void;
/**
 * 清理缓存
 */
export declare function clearCache(moduleId?: string): void;
/**
 * 创建懒加载代理
 */
export declare function createLazyProxy<T extends object>(target: () => Promise<T>, moduleId: string): T;
/**
 * 获取缓存状态
 */
export declare function getCacheStatus(): {
    cached: string[];
    loading: string[];
    totalSize: number;
};
