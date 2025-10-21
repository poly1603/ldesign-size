/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { parseSizeInput, convertSize, formatSize, scaleSize, addSizes, subtractSizes, roundSize, clampSize } from '../utils/index.js';

const UNIT_PX = "px";
const UNIT_REM = "rem";
const UNIT_EM = "em";
const UNIT_VW = "vw";
const UNIT_VH = "vh";
const UNIT_PERCENT = "%";
const ZERO_PX = Object.freeze({
  value: 0,
  unit: UNIT_PX
});
const ONE_PX = Object.freeze({
  value: 1,
  unit: UNIT_PX
});
const DEFAULT_FONT_SIZE = 16;
const FLAG_POOLED = 1 << 0;
const FLAG_PIXELS_CACHED = 1 << 1;
const FLAG_REM_CACHED = 1 << 2;
const COMMON_VALUES_CACHE = /* @__PURE__ */ new Map();
class SizePool {
  constructor() {
    this.pool = [];
    this.maxSize = 200;
    this.hits = 0;
    this.misses = 0;
    this.created = 0;
    this.stats = new Uint32Array(5);
    this.lastCleanup = Date.now();
    this.CLEANUP_INTERVAL = 6e4;
  }
  static getInstance() {
    if (!SizePool.instance) {
      SizePool.instance = new SizePool();
    }
    return SizePool.instance;
  }
  cleanup() {
    const now = Date.now();
    if (now - this.lastCleanup > this.CLEANUP_INTERVAL) {
      const keepSize = Math.floor(this.maxSize / 2);
      if (this.pool.length > keepSize) {
        this.pool.length = keepSize;
      }
      this.lastCleanup = now;
    }
  }
  acquire(input, rootFontSize = 16) {
    this.cleanup();
    if (this.pool.length > 0) {
      this.hits++;
      const size3 = this.pool.pop();
      size3.reset(input, rootFontSize);
      return size3;
    }
    this.misses++;
    this.created++;
    const size2 = new Size(input, rootFontSize);
    size2._isPooled = true;
    return size2;
  }
  release(size2) {
    if (size2._isPooled && this.pool.length < this.maxSize) {
      size2._value = ZERO_PX;
      size2._rootFontSize = DEFAULT_FONT_SIZE;
      size2._flags = FLAG_POOLED;
      size2._cachedPixels = void 0;
      size2._cachedRem = void 0;
      this.pool.push(size2);
    }
  }
  clear() {
    this.pool.length = 0;
  }
  getStats() {
    const total = this.hits + this.misses;
    return {
      poolSize: this.pool.length,
      hits: this.hits,
      misses: this.misses,
      created: this.created,
      hitRate: total ? this.hits / total : 0
    };
  }
}
class Size {
  // 使用getter/setter访问标记
  get _isPooled() {
    return (this._flags & FLAG_POOLED) !== 0;
  }
  set _isPooled(value) {
    if (value) {
      this._flags |= FLAG_POOLED;
    } else {
      this._flags &= ~FLAG_POOLED;
    }
  }
  constructor(input = 0, rootFontSize = DEFAULT_FONT_SIZE) {
    this._flags = 0;
    this._value = parseSizeInput(input);
    this._rootFontSize = rootFontSize;
  }
  /**
   * 重置对象状态（供对象池使用）
   */
  reset(input = 0, rootFontSize = DEFAULT_FONT_SIZE) {
    this._value = parseSizeInput(input);
    this._rootFontSize = rootFontSize;
    this._flags = FLAG_POOLED;
    this._cachedPixels = void 0;
    this._cachedRem = void 0;
  }
  // ============================================
  // Static Factory Methods
  // ============================================
  /**
   * Create a Size from pixels
   */
  static fromPixels(value) {
    if (value === 0) return new Size(ZERO_PX);
    if (value === 1) return new Size(ONE_PX);
    const cacheKey = `${value}:px:${DEFAULT_FONT_SIZE}`;
    const cached = COMMON_VALUES_CACHE.get(cacheKey);
    if (cached) return cached.clone();
    return new Size({
      value,
      unit: UNIT_PX
    });
  }
  /**
   * Create a Size from rem
   */
  static fromRem(value, rootFontSize = DEFAULT_FONT_SIZE) {
    return new Size({
      value,
      unit: UNIT_REM
    }, rootFontSize);
  }
  /**
   * Create a Size from em
   */
  static fromEm(value, rootFontSize = DEFAULT_FONT_SIZE) {
    return new Size({
      value,
      unit: UNIT_EM
    }, rootFontSize);
  }
  /**
   * Create a Size from viewport width percentage
   */
  static fromViewportWidth(value) {
    return new Size({
      value,
      unit: UNIT_VW
    });
  }
  /**
   * Create a Size from viewport height percentage
   */
  static fromViewportHeight(value) {
    return new Size({
      value,
      unit: UNIT_VH
    });
  }
  /**
   * Create a Size from percentage
   */
  static fromPercentage(value) {
    return new Size({
      value,
      unit: UNIT_PERCENT
    });
  }
  /**
   * Parse a string to Size
   */
  static parse(input, rootFontSize = DEFAULT_FONT_SIZE) {
    return new Size(input, rootFontSize);
  }
  // ============================================
  // Getters
  // ============================================
  get value() {
    return this._value.value;
  }
  get unit() {
    return this._value.unit;
  }
  get pixels() {
    if (!(this._flags & FLAG_PIXELS_CACHED)) {
      this._cachedPixels = this.toPixels().value;
      this._flags |= FLAG_PIXELS_CACHED;
    }
    return this._cachedPixels;
  }
  get rem() {
    if (!(this._flags & FLAG_REM_CACHED)) {
      this._cachedRem = this.toRem().value;
      this._flags |= FLAG_REM_CACHED;
    }
    return this._cachedRem;
  }
  get em() {
    return this.toEm().value;
  }
  // ============================================
  // Conversion Methods
  // ============================================
  /**
   * Convert to pixels
   */
  toPixels() {
    return convertSize(this._value, "px", this._rootFontSize);
  }
  /**
   * Convert to rem
   */
  toRem() {
    return convertSize(this._value, "rem", this._rootFontSize);
  }
  /**
   * Convert to em
   */
  toEm() {
    return convertSize(this._value, "em", this._rootFontSize);
  }
  /**
   * Convert to viewport width
   */
  toViewportWidth() {
    return convertSize(this._value, "vw", this._rootFontSize);
  }
  /**
   * Convert to viewport height
   */
  toViewportHeight() {
    return convertSize(this._value, "vh", this._rootFontSize);
  }
  /**
   * Convert to percentage
   */
  toPercentage() {
    return convertSize(this._value, "%", this._rootFontSize);
  }
  /**
   * Convert to specific unit
   */
  to(unit) {
    return convertSize(this._value, unit, this._rootFontSize);
  }
  /**
   * Convert to string
   */
  toString() {
    return formatSize(this._value);
  }
  /**
   * Convert to CSS value string
   */
  toCss() {
    return formatSize(this._value);
  }
  /**
   * Get numeric value in specific unit
   */
  valueOf(unit) {
    if (!unit || unit === this._value.unit) {
      return this._value.value;
    }
    return this.to(unit).value;
  }
  // ============================================
  // Manipulation Methods
  // ============================================
  /**
   * Scale the size by a factor
   */
  scale(factor) {
    const scaled = scaleSize(this._value, factor);
    return new Size(scaled, this._rootFontSize);
  }
  /**
   * Increase size by a percentage
   */
  increase(percentage) {
    return this.scale(1 + percentage / 100);
  }
  /**
   * Decrease size by a percentage
   */
  decrease(percentage) {
    return this.scale(1 - percentage / 100);
  }
  /**
   * Add another size
   */
  add(other) {
    const otherSize = this._isPooled ? SizePool.getInstance().acquire(other, this._rootFontSize) : new Size(other, this._rootFontSize);
    const result = addSizes(this._value, otherSize._value, this._rootFontSize);
    if (this._isPooled) {
      otherSize.dispose();
    }
    return this._isPooled ? SizePool.getInstance().acquire(result, this._rootFontSize) : new Size(result, this._rootFontSize);
  }
  /**
   * Subtract another size
   */
  subtract(other) {
    const otherSize = this._isPooled ? SizePool.getInstance().acquire(other, this._rootFontSize) : new Size(other, this._rootFontSize);
    const result = subtractSizes(this._value, otherSize._value, this._rootFontSize);
    if (this._isPooled) {
      otherSize.dispose();
    }
    return this._isPooled ? SizePool.getInstance().acquire(result, this._rootFontSize) : new Size(result, this._rootFontSize);
  }
  /**
   * Multiply by a number
   */
  multiply(factor) {
    return this.scale(factor);
  }
  /**
   * Divide by a number
   */
  divide(divisor) {
    if (divisor === 0) {
      throw new Error("Cannot divide by zero");
    }
    return this.scale(1 / divisor);
  }
  /**
   * Get the negative of the size
   */
  negate() {
    return this.scale(-1);
  }
  /**
   * Get the absolute value
   */
  abs() {
    if (this._value.value < 0) {
      return this.negate();
    }
    return this.clone();
  }
  /**
   * Round to specified precision
   */
  round(precision = 2) {
    const rounded = roundSize(this._value, precision);
    return new Size(rounded, this._rootFontSize);
  }
  /**
   * Clamp between min and max
   */
  clamp(min, max) {
    const clamped = clampSize(this._value, min, max, this._rootFontSize);
    return new Size(clamped, this._rootFontSize);
  }
  // ============================================
  // Comparison Methods
  // ============================================
  /**
   * Check if equal to another size
   */
  equals(other) {
    if (typeof other === "object" && "value" in other && "unit" in other) {
      if (other.unit === this._value.unit && Math.abs(other.value - this._value.value) < 1e-3) {
        return true;
      }
    }
    const otherSize = SizePool.getInstance().acquire(other, this._rootFontSize);
    const result = Math.abs(this.pixels - otherSize.pixels) < 1e-3;
    otherSize.dispose();
    return result;
  }
  /**
   * Check if greater than another size
   */
  greaterThan(other) {
    const otherSize = new Size(other, this._rootFontSize);
    return this.pixels > otherSize.pixels;
  }
  /**
   * Check if greater than or equal to another size
   */
  greaterThanOrEqual(other) {
    return this.greaterThan(other) || this.equals(other);
  }
  /**
   * Check if less than another size
   */
  lessThan(other) {
    const otherSize = new Size(other, this._rootFontSize);
    return this.pixels < otherSize.pixels;
  }
  /**
   * Check if less than or equal to another size
   */
  lessThanOrEqual(other) {
    return this.lessThan(other) || this.equals(other);
  }
  /**
   * Get the minimum of this and another size
   */
  min(other) {
    const otherSize = new Size(other, this._rootFontSize);
    return this.lessThan(otherSize) ? this.clone() : otherSize.clone();
  }
  /**
   * Get the maximum of this and another size
   */
  max(other) {
    const otherSize = new Size(other, this._rootFontSize);
    return this.greaterThan(otherSize) ? this.clone() : otherSize.clone();
  }
  // ============================================
  // Calculation Methods
  // ============================================
  /**
   * Calculate with options
   */
  calculate(options) {
    let result = this.clone();
    if (options.precision !== void 0) {
      result = result.round(options.precision);
    }
    if (options.unit) {
      const converted = result.to(options.unit);
      result = new Size(converted, this._rootFontSize);
    }
    if (options.clamp) {
      result = result.clamp(options.clamp.min, options.clamp.max);
    }
    return result;
  }
  /**
   * Interpolate between this and another size
   */
  interpolate(to, factor) {
    const toSize = new Size(to, this._rootFontSize);
    const fromPx = this.toPixels().value;
    const toPx = toSize.toPixels().value;
    const interpolated = fromPx + (toPx - fromPx) * factor;
    return new Size({
      value: interpolated,
      unit: "px"
    }, this._rootFontSize).calculate({
      unit: this._value.unit
    });
  }
  // ============================================
  // Utility Methods
  // ============================================
  /**
   * Clone the size
   */
  clone() {
    if (this._isPooled) {
      return SizePool.getInstance().acquire(this._value, this._rootFontSize);
    }
    return new Size(this._value, this._rootFontSize);
  }
  /**
   * 释放对象回池（手动管理）
   */
  dispose() {
    if (this._isPooled) {
      SizePool.getInstance().release(this);
    }
  }
  /**
   * Check if size is zero
   */
  isZero() {
    return Math.abs(this._value.value) < 1e-3;
  }
  /**
   * Check if size is positive
   */
  isPositive() {
    return this._value.value > 0;
  }
  /**
   * Check if size is negative
   */
  isNegative() {
    return this._value.value < 0;
  }
  /**
   * Check if size is valid
   */
  isValid() {
    return !Number.isNaN(this._value.value) && Number.isFinite(this._value.value);
  }
  /**
   * Export as JSON
   */
  toJSON() {
    return {
      value: this._value.value,
      unit: this._value.unit,
      pixels: this.pixels,
      rem: this.rem,
      string: this.toString()
    };
  }
  /**
   * Create CSS calc expression
   */
  static calc(expression) {
    return `calc(${expression})`;
  }
  /**
   * Create CSS min expression
   */
  static cssMin(...sizes) {
    const values = sizes.map((s) => new Size(s).toString());
    return `min(${values.join(", ")})`;
  }
  /**
   * Create CSS max expression
   */
  static cssMax(...sizes) {
    const values = sizes.map((s) => new Size(s).toString());
    return `max(${values.join(", ")})`;
  }
  /**
   * Create CSS clamp expression
   */
  static cssClamp(min, preferred, max) {
    const minStr = new Size(min).toString();
    const prefStr = new Size(preferred).toString();
    const maxStr = new Size(max).toString();
    return `clamp(${minStr}, ${prefStr}, ${maxStr})`;
  }
}
if (COMMON_VALUES_CACHE.size === 0) {
  for (let i = 0; i <= 100; i += 4) {
    const key = `${i}:px:${DEFAULT_FONT_SIZE}`;
    const size2 = new Size(i, DEFAULT_FONT_SIZE);
    COMMON_VALUES_CACHE.set(key, size2);
  }
}
const sizeCache = /* @__PURE__ */ new Map();
const MAX_CACHE_SIZE = 50;
const size = (input, rootFontSize = 16) => {
  if (typeof input === "number") {
    const cacheKey = `${input}:${rootFontSize}`;
    if (sizeCache.has(cacheKey)) {
      return sizeCache.get(cacheKey).clone();
    }
    if (input >= 0 && input <= 100) {
      const newSize = SizePool.getInstance().acquire(input, rootFontSize);
      if (sizeCache.size >= MAX_CACHE_SIZE) {
        const firstKey = sizeCache.keys().next().value;
        if (firstKey) sizeCache.delete(firstKey);
      }
      sizeCache.set(cacheKey, newSize);
      return newSize;
    }
  }
  return new Size(input, rootFontSize);
};
const px = (value) => Size.fromPixels(value);
const rem = (value, rootFontSize = 16) => Size.fromRem(value, rootFontSize);
const em = (value, rootFontSize = 16) => Size.fromEm(value, rootFontSize);
const vw = (value) => Size.fromViewportWidth(value);
const vh = (value) => Size.fromViewportHeight(value);
const percent = (value) => Size.fromPercentage(value);

export { Size, em, percent, px, rem, size, vh, vw };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=Size.js.map
