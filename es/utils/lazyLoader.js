/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
const moduleCache = /* @__PURE__ */ new Map();
const loadingPromises = /* @__PURE__ */ new Map();
let cacheLimit = 50;
function setCacheLimit(limit) {
  cacheLimit = Math.max(0, limit | 0);
  while (moduleCache.size > cacheLimit) {
    const firstKey = moduleCache.keys().next().value;
    if (firstKey) moduleCache.delete(firstKey);
    else break;
  }
}
async function lazyLoad(moduleId, loader) {
  if (moduleCache.has(moduleId)) {
    return moduleCache.get(moduleId);
  }
  if (loadingPromises.has(moduleId)) {
    return loadingPromises.get(moduleId);
  }
  const loadPromise = loader().then((module) => {
    moduleCache.set(moduleId, module);
    if (moduleCache.size > cacheLimit) {
      const firstKey = moduleCache.keys().next().value;
      if (firstKey) moduleCache.delete(firstKey);
    }
    loadingPromises.delete(moduleId);
    return module;
  }).catch((error) => {
    loadingPromises.delete(moduleId);
    throw error;
  });
  loadingPromises.set(moduleId, loadPromise);
  return loadPromise;
}
function preload(moduleId, loader) {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    requestIdleCallback(() => {
      lazyLoad(moduleId, loader);
    });
  } else {
    setTimeout(() => {
      lazyLoad(moduleId, loader);
    }, 1);
  }
}
function clearCache(moduleId) {
  if (moduleId) {
    moduleCache.delete(moduleId);
    loadingPromises.delete(moduleId);
  } else {
    moduleCache.clear();
    loadingPromises.clear();
  }
}
function createLazyProxy(target, moduleId) {
  let instance = null;
  let loading = false;
  return new Proxy({}, {
    get(_, prop) {
      if (!instance && !loading) {
        loading = true;
        lazyLoad(moduleId, target).then((module) => {
          instance = module;
          loading = false;
        }).catch(() => {
          loading = false;
        });
      }
      if (instance) {
        return instance[prop];
      }
      return () => {
        console.warn(`Module ${moduleId} is still loading`);
        return Promise.resolve();
      };
    }
  });
}
function getCacheStatus() {
  return {
    cached: Array.from(moduleCache.keys()),
    loading: Array.from(loadingPromises.keys()),
    totalSize: moduleCache.size
  };
}

export { clearCache, createLazyProxy, getCacheStatus, lazyLoad, preload, setCacheLimit };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=lazyLoader.js.map
