/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { formatSize, parseSizeInput } from '../utils/index.js';
import { getDeviceDetector } from './DeviceDetector.js';

class FluidSizeCalculator {
  constructor() {
    this.unsubscribe = null;
    this.calculationCache = /* @__PURE__ */ new Map();
    this.isDestroyed = false;
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.lastViewport = null;
    this.stats = new Uint32Array(4);
    this.slopeCache = /* @__PURE__ */ new Map();
    this.viewport = getDeviceDetector().getViewport();
    this.lastViewport = {
      ...this.viewport
    };
    this.unsubscribe = getDeviceDetector().onChange((viewport) => {
      if (!this.isDestroyed) {
        if (this.hasViewportChanged(viewport)) {
          this.viewport = viewport;
          this.lastViewport = {
            ...viewport
          };
          this.partialCacheClear();
        }
      }
    });
  }
  /**
   * Check if viewport has actually changed
   */
  hasViewportChanged(viewport) {
    if (!this.lastViewport) return true;
    return viewport.width !== this.lastViewport.width || viewport.height !== this.lastViewport.height || viewport.device !== this.lastViewport.device;
  }
  /**
   * Partial cache clear - keep frequently used items
   */
  partialCacheClear() {
    if (this.calculationCache.size > 50) {
      const entries = Array.from(this.calculationCache.entries());
      this.calculationCache.clear();
      entries.slice(0, 50).forEach(([key, value]) => {
        this.calculationCache.set(key, value);
      });
    }
  }
  /**
   * Create a fluid size using CSS clamp
   */
  createFluidSize(config) {
    const cacheKey = this.generateCacheKey(config);
    if (this.calculationCache.has(cacheKey)) {
      this.stats[0]++;
      return this.calculationCache.get(cacheKey);
    }
    this.stats[1]++;
    this.stats[3]++;
    const min = this.formatSizeValue(config.min);
    const max = this.formatSizeValue(config.max);
    const viewportMin = config.viewportMin || 320;
    const viewportMax = config.viewportMax || 1920;
    const minValue = config.min.value;
    const maxValue = config.max.value;
    const slopeKey = `${minValue}:${maxValue}:${viewportMin}:${viewportMax}`;
    let slope = this.slopeCache.get(slopeKey);
    if (slope === void 0) {
      slope = (maxValue - minValue) / (viewportMax - viewportMin);
      if (this.slopeCache.size >= 100) {
        const firstKey = this.slopeCache.keys().next().value;
        if (firstKey) this.slopeCache.delete(firstKey);
      }
      this.slopeCache.set(slopeKey, slope);
    }
    const preferred = this.createFluidCalc(minValue, slope, viewportMin, config.preferredUnit || "rem");
    let result;
    if (config.clamp !== false) {
      result = `clamp(${min}, ${preferred}, ${max})`;
    } else {
      result = preferred;
    }
    this.addToCache(cacheKey, result);
    return result;
  }
  /**
   * Create fluid calc expression
   */
  createFluidCalc(minValue, slope, viewportMin, unit) {
    const baseValue = unit === "rem" ? minValue : minValue / 16;
    const viewportValue = slope * 100;
    const offset = -slope * viewportMin / 16;
    return `calc(${baseValue + offset}rem + ${viewportValue.toFixed(4)}vw)`;
  }
  /**
   * Format size value
   */
  formatSizeValue(size) {
    return formatSize(size);
  }
  /**
   * Create responsive size with breakpoints
   */
  createResponsiveSize(config) {
    const device = getDeviceDetector().getDevice();
    let selectedSize = config.base;
    switch (device) {
      case "mobile":
        selectedSize = config.xs || config.sm || config.base;
        break;
      case "tablet":
        selectedSize = config.md || config.base;
        break;
      case "laptop":
        selectedSize = config.lg || config.base;
        break;
      case "desktop":
        selectedSize = config.xl || config.base;
        break;
      case "widescreen":
      case "tv":
        selectedSize = config.xxl || config.xl || config.base;
        break;
    }
    if (config.fluid) {
      return this.createFluidSize(config.fluid);
    }
    const parsed = parseSizeInput(selectedSize);
    return formatSize(parsed);
  }
  /**
   * Generate modular scale
   */
  generateModularScale(base, ratio, steps, unit = "rem") {
    const cacheKey = `scale-${base}-${ratio}-${steps}-${unit}`;
    const cached = this.calculationCache.get(cacheKey);
    if (cached) {
      this.cacheHits++;
      return JSON.parse(cached);
    }
    this.cacheMisses++;
    const sizes = [];
    const powers = /* @__PURE__ */ new Map();
    for (let i = -steps; i <= steps; i++) {
      let value;
      if (powers.has(i)) {
        value = base * powers.get(i);
      } else {
        const power = ratio ** i;
        powers.set(i, power);
        value = base * power;
      }
      sizes.push(`${value.toFixed(3)}${unit}`);
    }
    this.addToCache(cacheKey, JSON.stringify(sizes));
    return sizes;
  }
  /**
   * Create fluid modular scale
   */
  createFluidModularScale(baseMin, baseMax, ratio, steps) {
    const scales = [];
    for (let i = -steps; i <= steps; i++) {
      const minValue = baseMin * ratio ** i;
      const maxValue = baseMax * ratio ** i;
      const fluid2 = this.createFluidSize({
        min: {
          value: minValue,
          unit: "rem"
        },
        max: {
          value: maxValue,
          unit: "rem"
        },
        viewportMin: 320,
        viewportMax: 1920,
        clamp: true
      });
      scales.push(fluid2);
    }
    return scales;
  }
  /**
   * Get optimal line height for font size
   */
  getOptimalLineHeight(fontSize, unit = "px") {
    let lineHeight;
    if (unit === "px") {
      if (fontSize < 12) lineHeight = 1.8;
      else if (fontSize < 16) lineHeight = 1.6;
      else if (fontSize < 20) lineHeight = 1.5;
      else if (fontSize < 32) lineHeight = 1.4;
      else if (fontSize < 48) lineHeight = 1.3;
      else lineHeight = 1.2;
    } else {
      if (fontSize < 0.75) lineHeight = 1.8;
      else if (fontSize < 1) lineHeight = 1.6;
      else if (fontSize < 1.25) lineHeight = 1.5;
      else if (fontSize < 2) lineHeight = 1.4;
      else if (fontSize < 3) lineHeight = 1.3;
      else lineHeight = 1.2;
    }
    return lineHeight;
  }
  /**
   * Calculate responsive spacing
   */
  calculateResponsiveSpacing(base, device, context) {
    let multiplier = 1;
    switch (device) {
      case "mobile":
        multiplier = context === "padding" ? 0.75 : 0.5;
        break;
      case "tablet":
        multiplier = context === "padding" ? 0.875 : 0.75;
        break;
      case "laptop":
      case "desktop":
        multiplier = 1;
        break;
      case "widescreen":
      case "tv":
        multiplier = context === "padding" ? 1.25 : 1.5;
        break;
    }
    const value = base * multiplier;
    return `${(value / 16).toFixed(3)}rem`;
  }
  /**
   * Generate optimized cache key
   */
  generateCacheKey(config) {
    return [config.min.value, config.min.unit, config.max.value, config.max.unit, config.viewportMin || 320, config.viewportMax || 1920, config.clamp !== false ? 1 : 0].join("|");
  }
  /**
   * Add to cache with LRU management
   */
  addToCache(key, value) {
    this.calculationCache.delete(key);
    if (this.calculationCache.size >= FluidSizeCalculator.MAX_CACHE_SIZE) {
      const firstKey = this.calculationCache.keys().next().value;
      if (firstKey) {
        this.calculationCache.delete(firstKey);
      }
    }
    this.calculationCache.set(key, value);
  }
  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.calculationCache.size,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0
    };
  }
  /**
   * Destroy and clean up resources
   */
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.calculationCache.clear();
    this.lastViewport = null;
  }
}
FluidSizeCalculator.MAX_CACHE_SIZE = 500;
const fluidTypographyPresets = {
  // Heading scales
  h1: {
    min: {
      value: 2,
      unit: "rem"
    },
    max: {
      value: 4,
      unit: "rem"
    },
    viewportMin: 320,
    viewportMax: 1920
  },
  h2: {
    min: {
      value: 1.75,
      unit: "rem"
    },
    max: {
      value: 3,
      unit: "rem"
    },
    viewportMin: 320,
    viewportMax: 1920
  },
  h3: {
    min: {
      value: 1.5,
      unit: "rem"
    },
    max: {
      value: 2.25,
      unit: "rem"
    },
    viewportMin: 320,
    viewportMax: 1920
  },
  h4: {
    min: {
      value: 1.25,
      unit: "rem"
    },
    max: {
      value: 1.75,
      unit: "rem"
    },
    viewportMin: 320,
    viewportMax: 1920
  },
  h5: {
    min: {
      value: 1.125,
      unit: "rem"
    },
    max: {
      value: 1.5,
      unit: "rem"
    },
    viewportMin: 320,
    viewportMax: 1920
  },
  h6: {
    min: {
      value: 1,
      unit: "rem"
    },
    max: {
      value: 1.25,
      unit: "rem"
    },
    viewportMin: 320,
    viewportMax: 1920
  },
  // Body text scales
  body: {
    min: {
      value: 1,
      unit: "rem"
    },
    max: {
      value: 1.125,
      unit: "rem"
    },
    viewportMin: 320,
    viewportMax: 1920
  },
  small: {
    min: {
      value: 0.875,
      unit: "rem"
    },
    max: {
      value: 1,
      unit: "rem"
    },
    viewportMin: 320,
    viewportMax: 1920
  },
  tiny: {
    min: {
      value: 0.75,
      unit: "rem"
    },
    max: {
      value: 0.875,
      unit: "rem"
    },
    viewportMin: 320,
    viewportMax: 1920
  }
};
const modularScaleRatios = {
  minorSecond: 1.067,
  // 15:16
  majorSecond: 1.125,
  // 8:9
  minorThird: 1.2,
  // 5:6
  majorThird: 1.25,
  // 4:5
  perfectFourth: 1.333,
  // 3:4
  augmentedFourth: 1.414,
  // √2
  perfectFifth: 1.5,
  // 2:3
  goldenRatio: 1.618,
  // φ
  majorSixth: 1.667,
  // 3:5
  minorSeventh: 1.778,
  // 9:16
  majorSeventh: 1.875,
  // 8:15
  octave: 2,
  // 1:2
  majorTenth: 2.5,
  // 2:5
  majorEleventh: 2.667,
  // 3:8
  majorTwelfth: 3,
  // 1:3
  doubleOctave: 4
  // 1:4
};
let calculator = null;
function getFluidSizeCalculator() {
  if (!calculator) {
    calculator = new FluidSizeCalculator();
  }
  return calculator;
}
const fluid = {
  /**
   * Create fluid size
   */
  size: (min, max, unit = "rem") => {
    return getFluidSizeCalculator().createFluidSize({
      min: {
        value: min,
        unit
      },
      max: {
        value: max,
        unit
      },
      clamp: true
    });
  },
  /**
   * Create fluid typography
   */
  text: (preset) => {
    const config = fluidTypographyPresets[preset];
    return getFluidSizeCalculator().createFluidSize(config);
  },
  /**
   * Create modular scale
   */
  scale: (base, ratio, steps = 5) => {
    const r = typeof ratio === "number" ? ratio : modularScaleRatios[ratio];
    return getFluidSizeCalculator().generateModularScale(base, r, steps);
  },
  /**
   * Create fluid modular scale
   */
  fluidScale: (baseMin, baseMax, ratio, steps = 5) => {
    const r = typeof ratio === "number" ? ratio : modularScaleRatios[ratio];
    return getFluidSizeCalculator().createFluidModularScale(baseMin, baseMax, r, steps);
  },
  /**
   * Get optimal line height
   */
  lineHeight: (fontSize, unit = "px") => {
    return getFluidSizeCalculator().getOptimalLineHeight(fontSize, unit);
  }
};

export { FluidSizeCalculator, fluid, fluidTypographyPresets, getFluidSizeCalculator, modularScaleRatios };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=FluidSize.js.map
