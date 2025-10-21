/**
 * @ldesign/size - Memory Optimizer
 *
 * 使用 WeakMap 和 WeakRef 优化内存占用
 */
declare global {
    interface WeakRefConstructor {
        new <T extends object>(target: T): WeakRef<T>;
    }
    interface WeakRef<T extends object> {
        deref: () => T | undefined;
    }
    interface FinalizationRegistryConstructor {
        new <T>(cleanupCallback: (heldValue: T) => void): FinalizationRegistry<T>;
    }
    interface FinalizationRegistry<T> {
        register: (target: object, heldValue: T, unregisterToken?: object) => void;
        unregister: (unregisterToken: object) => void;
    }
    const WeakRef: WeakRefConstructor;
    const FinalizationRegistry: FinalizationRegistryConstructor;
}
/**
 * WeakRef 缓存管理器
 * 使用 WeakRef 避免强引用导致的内存泄漏
 */
export declare class WeakRefCache<K, V extends object> {
    private cache;
    private finalizationRegistry?;
    constructor();
    set(key: K, value: V): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    get size(): number;
    private cleanup;
}
/**
 * 对象关联的弱映射缓存
 * 当对象被回收时，相关缓存会自动清理
 */
export declare class ObjectAssociatedCache<K extends object, V> {
    private cache;
    set(key: K, value: V): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
}
/**
 * 自动过期的缓存
 * 结合 WeakRef 和 TTL 策略
 */
export declare class ExpiringCache<K, V extends object> {
    private cache;
    private defaultTTL;
    private cleanupInterval;
    private cleanupTimer?;
    constructor(ttl?: number, cleanupInterval?: number);
    set(key: K, value: V, ttl?: number): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    private startCleanup;
    private cleanup;
    destroy(): void;
}
/**
 * 双层缓存：强引用 + 弱引用
 * 热数据使用强引用，冷数据降级为弱引用
 */
export declare class TieredCache<K, V extends object> {
    private hotCache;
    private coldCache;
    private maxHotSize;
    private accessCount;
    private readonly PROMOTION_THRESHOLD;
    constructor(maxHotSize?: number);
    set(key: K, value: V): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    private incrementAccessCount;
    private promoteToHot;
    private demoteLeastAccessed;
    getStats(): {
        hotSize: number;
        coldSize: number;
        totalAccessCount: number;
    };
}
export declare const memoryOptimizer: {
    createWeakRefCache: <K, V extends object>() => WeakRefCache<K, V>;
    createObjectCache: <K extends object, V>() => ObjectAssociatedCache<K, V>;
    createExpiringCache: <K, V extends object>(ttl?: number) => ExpiringCache<K, V>;
    createTieredCache: <K, V extends object>(maxHotSize?: number) => TieredCache<K, V>;
};
