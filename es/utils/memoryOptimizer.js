/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class WeakRefCache {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    if (typeof globalThis !== "undefined" && "FinalizationRegistry" in globalThis) {
      this.finalizationRegistry = new FinalizationRegistry((key) => {
        this.cache.delete(key);
      });
    }
  }
  set(key, value) {
    const ref = new WeakRef(value);
    this.cache.set(key, ref);
    if (this.finalizationRegistry) {
      this.finalizationRegistry.register(value, key);
    }
  }
  get(key) {
    const ref = this.cache.get(key);
    if (!ref) return void 0;
    const value = ref.deref();
    if (!value) {
      this.cache.delete(key);
      return void 0;
    }
    return value;
  }
  has(key) {
    return this.get(key) !== void 0;
  }
  delete(key) {
    return this.cache.delete(key);
  }
  clear() {
    this.cache.clear();
  }
  get size() {
    this.cleanup();
    return this.cache.size;
  }
  cleanup() {
    const keysToDelete = [];
    for (const [key, ref] of this.cache.entries()) {
      if (!ref.deref()) {
        keysToDelete.push(key);
      }
    }
    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }
}
class ObjectAssociatedCache {
  constructor() {
    this.cache = /* @__PURE__ */ new WeakMap();
  }
  set(key, value) {
    this.cache.set(key, value);
  }
  get(key) {
    return this.cache.get(key);
  }
  has(key) {
    return this.cache.has(key);
  }
  delete(key) {
    return this.cache.delete(key);
  }
}
class ExpiringCache {
  constructor(ttl = 6e4, cleanupInterval = 3e4) {
    this.cache = /* @__PURE__ */ new Map();
    this.defaultTTL = ttl;
    this.cleanupInterval = cleanupInterval;
    this.startCleanup();
  }
  set(key, value, ttl) {
    const expires = Date.now() + (ttl ?? this.defaultTTL);
    const ref = new WeakRef(value);
    this.cache.set(key, {
      ref,
      expires
    });
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return void 0;
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return void 0;
    }
    const value = entry.ref.deref();
    if (!value) {
      this.cache.delete(key);
      return void 0;
    }
    return value;
  }
  has(key) {
    return this.get(key) !== void 0;
  }
  delete(key) {
    return this.cache.delete(key);
  }
  clear() {
    this.cache.clear();
  }
  startCleanup() {
    if (typeof setInterval === "undefined") return;
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        keysToDelete.push(key);
        continue;
      }
      if (!entry.ref.deref()) {
        keysToDelete.push(key);
      }
    }
    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = void 0;
    }
    this.cache.clear();
  }
}
class TieredCache {
  constructor(maxHotSize = 100) {
    this.hotCache = /* @__PURE__ */ new Map();
    this.coldCache = /* @__PURE__ */ new Map();
    this.accessCount = /* @__PURE__ */ new Map();
    this.PROMOTION_THRESHOLD = 3;
    this.maxHotSize = maxHotSize;
  }
  set(key, value) {
    this.coldCache.set(key, new WeakRef(value));
    this.accessCount.set(key, 1);
  }
  get(key) {
    let value = this.hotCache.get(key);
    if (value) {
      this.incrementAccessCount(key);
      return value;
    }
    const ref = this.coldCache.get(key);
    if (ref) {
      value = ref.deref();
      if (value) {
        this.incrementAccessCount(key);
        const count = this.accessCount.get(key) ?? 0;
        if (count >= this.PROMOTION_THRESHOLD) {
          this.promoteToHot(key, value);
        }
        return value;
      } else {
        this.coldCache.delete(key);
        this.accessCount.delete(key);
      }
    }
    return void 0;
  }
  has(key) {
    return this.get(key) !== void 0;
  }
  delete(key) {
    this.accessCount.delete(key);
    const hot = this.hotCache.delete(key);
    const cold = this.coldCache.delete(key);
    return hot || cold;
  }
  clear() {
    this.hotCache.clear();
    this.coldCache.clear();
    this.accessCount.clear();
  }
  incrementAccessCount(key) {
    const count = this.accessCount.get(key) ?? 0;
    this.accessCount.set(key, count + 1);
  }
  promoteToHot(key, value) {
    if (this.hotCache.size >= this.maxHotSize) {
      this.demoteLeastAccessed();
    }
    this.coldCache.delete(key);
    this.hotCache.set(key, value);
  }
  demoteLeastAccessed() {
    let minKey;
    let minCount = Infinity;
    for (const key of this.hotCache.keys()) {
      const count = this.accessCount.get(key) ?? 0;
      if (count < minCount) {
        minCount = count;
        minKey = key;
      }
    }
    if (minKey !== void 0) {
      const value = this.hotCache.get(minKey);
      if (value) {
        this.hotCache.delete(minKey);
        this.coldCache.set(minKey, new WeakRef(value));
        this.accessCount.set(minKey, 0);
      }
    }
  }
  getStats() {
    const coldSize = Array.from(this.coldCache.values()).filter((ref) => ref.deref()).length;
    const totalAccessCount = Array.from(this.accessCount.values()).reduce((sum, count) => sum + count, 0);
    return {
      hotSize: this.hotCache.size,
      coldSize,
      totalAccessCount
    };
  }
}
const memoryOptimizer = {
  createWeakRefCache: () => new WeakRefCache(),
  createObjectCache: () => new ObjectAssociatedCache(),
  createExpiringCache: (ttl) => new ExpiringCache(ttl),
  createTieredCache: (maxHotSize) => new TieredCache(maxHotSize)
};

export { ExpiringCache, ObjectAssociatedCache, TieredCache, WeakRefCache, memoryOptimizer };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=memoryOptimizer.js.map
