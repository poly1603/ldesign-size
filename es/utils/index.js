/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
export { Benchmark, benchmark, compareBenchmarks, runBenchmark } from './benchmark.js';
export { clearCache, createLazyProxy, getCacheStatus, lazyLoad, preload, setCacheLimit } from './lazyLoader.js';
export { ExpiringCache, ObjectAssociatedCache, TieredCache, WeakRefCache, memoryOptimizer } from './memoryOptimizer.js';
export { PerformanceDiagnostics, perf, perfDiagnostics } from './performanceDiagnostics.js';

const parseCache = /* @__PURE__ */ new Map();
const MAX_PARSE_CACHE = 200;
function parseSizeInput(input) {
  if (typeof input === "number") {
    return {
      value: input,
      unit: "px"
    };
  }
  if (typeof input === "object" && "value" in input && "unit" in input) {
    return input;
  }
  if (typeof input === "string") {
    const cached = parseCache.get(input);
    if (cached) return cached;
    const match = input.match(/^(-?(?:\d+(?:\.\d+)?|\.\d+))(px|rem|em|vw|vh|%|pt|vmin|vmax)?$/);
    if (match) {
      const value = Number.parseFloat(match[1]);
      const unit = match[2] || "px";
      const result = {
        value,
        unit
      };
      if (parseCache.size >= MAX_PARSE_CACHE) {
        const firstKey = parseCache.keys().next().value;
        if (firstKey !== void 0) {
          parseCache.delete(firstKey);
        }
      }
      parseCache.set(input, result);
      return result;
    }
  }
  return {
    value: 0,
    unit: "px"
  };
}
const formatCache = /* @__PURE__ */ new Map();
const MAX_FORMAT_CACHE = 200;
function formatSize(size) {
  if (size.value === 0) return "0";
  const cacheKey = `${size.value}:${size.unit}`;
  const cached = formatCache.get(cacheKey);
  if (cached) return cached;
  const result = `${size.value}${size.unit}`;
  if (formatCache.size >= MAX_FORMAT_CACHE) {
    const firstKey = formatCache.keys().next().value;
    if (firstKey !== void 0) {
      formatCache.delete(firstKey);
    }
  }
  formatCache.set(cacheKey, result);
  return result;
}
const conversionCache = /* @__PURE__ */ new Map();
const MAX_CONVERSION_CACHE = 500;
const PT_TO_PX = 96 / 72;
const PX_TO_PT = 72 / 96;
function convertSize(size, targetUnit, rootFontSize = 16) {
  if (size.unit === targetUnit) {
    return size;
  }
  const cacheKey = `${size.value}:${size.unit}:${targetUnit}:${rootFontSize}`;
  const cached = conversionCache.get(cacheKey);
  if (cached) return cached;
  let pxValue = size.value;
  switch (size.unit) {
    case "rem":
      pxValue = size.value * rootFontSize;
      break;
    case "em":
      pxValue = size.value * rootFontSize;
      break;
    case "pt":
      pxValue = size.value * PT_TO_PX;
      break;
    case "%":
    case "vw":
    case "vh":
    case "vmin":
    case "vmax":
      return {
        value: size.value,
        unit: targetUnit
      };
  }
  let targetValue = pxValue;
  switch (targetUnit) {
    case "rem":
      targetValue = pxValue / rootFontSize;
      break;
    case "em":
      targetValue = pxValue / rootFontSize;
      break;
    case "pt":
      targetValue = pxValue * PX_TO_PT;
      break;
    case "px":
      targetValue = pxValue;
      break;
    default:
      return {
        value: size.value,
        unit: targetUnit
      };
  }
  const result = {
    value: targetValue,
    unit: targetUnit
  };
  if (conversionCache.size >= MAX_CONVERSION_CACHE) {
    const firstKey = conversionCache.keys().next().value;
    if (firstKey !== void 0) {
      conversionCache.delete(firstKey);
    }
  }
  conversionCache.set(cacheKey, result);
  return result;
}
function scaleSize(size, factor) {
  return {
    value: size.value * factor,
    unit: size.unit
  };
}
function addSizes(a, b, rootFontSize = 16) {
  if (a.unit === b.unit) {
    return {
      value: a.value + b.value,
      unit: a.unit
    };
  }
  const convertedB = convertSize(b, a.unit, rootFontSize);
  return {
    value: a.value + convertedB.value,
    unit: a.unit
  };
}
function subtractSizes(a, b, rootFontSize = 16) {
  if (a.unit === b.unit) {
    return {
      value: a.value - b.value,
      unit: a.unit
    };
  }
  const convertedB = convertSize(b, a.unit, rootFontSize);
  return {
    value: a.value - convertedB.value,
    unit: a.unit
  };
}
function clampSize(size, min, max, rootFontSize = 16) {
  let value = size.value;
  if (min !== void 0) {
    const minSize = parseSizeInput(min);
    const convertedMin = convertSize(minSize, size.unit, rootFontSize);
    value = Math.max(value, convertedMin.value);
  }
  if (max !== void 0) {
    const maxSize = parseSizeInput(max);
    const convertedMax = convertSize(maxSize, size.unit, rootFontSize);
    value = Math.min(value, convertedMax.value);
  }
  return {
    value,
    unit: size.unit
  };
}
const precisionFactors = /* @__PURE__ */ new Map();
for (let i = 0; i <= 10; i++) {
  precisionFactors.set(i, 10 ** i);
}
function roundSize(size, precision = 2) {
  const factor = precisionFactors.get(precision) ?? 10 ** precision;
  return {
    value: Math.round(size.value * factor) / factor,
    unit: size.unit
  };
}
function generateSizeScale(base, ratio, steps, unit = "px") {
  const sizes = [];
  for (let i = steps; i > 0; i--) {
    const value = base / ratio ** i;
    sizes.push({
      value: Math.round(value * 100) / 100,
      unit
    });
  }
  sizes.push({
    value: base,
    unit
  });
  for (let i = 1; i <= steps; i++) {
    const value = base * ratio ** i;
    sizes.push({
      value: Math.round(value * 100) / 100,
      unit
    });
  }
  return sizes;
}
function isValidSize(input) {
  if (typeof input === "number") {
    return !Number.isNaN(input) && Number.isFinite(input);
  }
  if (typeof input === "string") {
    const match = input.match(/^(-?(?:\d+(?:\.\d+)?|\.\d+))(px|rem|em|vw|vh|%|pt|vmin|vmax)?$/);
    return !!match;
  }
  if (typeof input === "object" && input !== null) {
    return "value" in input && "unit" in input && typeof input.value === "number" && typeof input.unit === "string";
  }
  return false;
}
function getCSSVarName(name, prefix = "size") {
  const kebab = name.replace(/([A-Z])/g, "-$1").toLowerCase();
  return `--${prefix}-${kebab}`;
}
function cssVar(name, fallback) {
  return fallback ? `var(${name}, ${fallback})` : `var(${name})`;
}
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  for (const source of sources) {
    if (!isObject(source)) continue;
    const stack = [{
      target,
      source
    }];
    while (stack.length > 0) {
      const {
        target: currentTarget,
        source: currentSource
      } = stack.pop();
      for (const key in currentSource) {
        if (Object.prototype.hasOwnProperty.call(currentSource, key)) {
          const sourceValue = currentSource[key];
          if (isObject(sourceValue)) {
            if (!currentTarget[key] || !isObject(currentTarget[key])) {
              currentTarget[key] = {};
            }
            stack.push({
              target: currentTarget[key],
              source: sourceValue
            });
          } else {
            currentTarget[key] = sourceValue;
          }
        }
      }
    }
  }
  return target;
}
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
class LRUCache {
  constructor(maxSize = 100) {
    this.cache = /* @__PURE__ */ new Map();
    this.maxSize = maxSize;
  }
  get(key) {
    const value = this.cache.get(key);
    if (value !== void 0) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }
  set(key, value) {
    this.cache.delete(key);
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== void 0) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }
  clear() {
    this.cache.clear();
  }
}
function memoize(fn, getKey, maxCacheSize = 100) {
  const cache = new LRUCache(maxCacheSize);
  return function(...args) {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    const cached = cache.get(key);
    if (cached !== void 0) {
      return cached;
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
function batchProcessSizes(items, processor, _batchSize = 10) {
  return new Promise((resolve, reject) => {
    if (!items || items.length === 0) {
      resolve();
      return;
    }
    let index = 0;
    let rafId = null;
    function processBatch() {
      try {
        const startTime = performance.now();
        const maxTime = 16;
        while (index < items.length) {
          processor(items[index]);
          index++;
          if (performance.now() - startTime > maxTime && index < items.length) {
            rafId = requestAnimationFrame(processBatch);
            return;
          }
        }
        resolve();
      } catch (error) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        reject(error);
      }
    }
    rafId = requestAnimationFrame(processBatch);
  });
}
const requestIdleCallback = typeof window !== "undefined" && "requestIdleCallback" in window ? window.requestIdleCallback : (callback) => setTimeout(() => callback({
  didTimeout: false,
  timeRemaining: () => 50
}), 1);
function optimizeCSSVariables(variables) {
  if (!variables || Object.keys(variables).length === 0) {
    return {};
  }
  const optimized = {};
  const valueMap = /* @__PURE__ */ new Map();
  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      const value = variables[key];
      if (!valueMap.has(value)) {
        valueMap.set(value, []);
      }
      valueMap.get(value).push(key);
    }
  }
  for (const [value, keys] of valueMap) {
    if (keys.length > 1) {
      const baseKey = keys[0];
      optimized[baseKey] = value;
      for (let i = 1; i < keys.length; i++) {
        optimized[keys[i]] = `var(${baseKey})`;
      }
    } else {
      optimized[keys[0]] = value;
    }
  }
  return optimized;
}
function throttle(func, limit) {
  let inThrottle;
  let lastFunc;
  let lastTime;
  return function(...args) {
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
  };
}
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export { addSizes, batchProcessSizes, clampSize, convertSize, cssVar, debounce, deepMerge, formatSize, generateSizeScale, getCSSVarName, isValidSize, memoize, optimizeCSSVariables, parseSizeInput, requestIdleCallback, roundSize, scaleSize, subtractSizes, throttle };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
