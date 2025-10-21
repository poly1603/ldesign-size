/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

class CSSOptimizer {
  /**
   * 初始化CSS模板（只执行一次）
   */
  static initializeTemplates() {
    if (this.isInitialized) return;
    this.CSS_TEMPLATE.set("base", "--size-base");
    this.CSS_TEMPLATE.set("base-rem", "--size-base-rem");
    this.CSS_TEMPLATE.set("scale", "--size-scale");
    for (let i = 0; i <= 64; i++) {
      this.CSS_TEMPLATE.set(`size-${i}`, `--size-${i}`);
    }
    this.isInitialized = true;
  }
  /**
   * 预计算并缓存所有值（使用 Uint16Array）
   */
  static getCachedValues(baseSize) {
    const cacheKey = baseSize.toString();
    let cached = this.VALUE_CACHE.get(cacheKey);
    if (!cached) {
      const multipliers = [0, 0.0625, 0.125, 0.25, 0.375, 0.5, 0.625, 0.6875, 0.75, 0.8125, 0.875, 1, 1.125, 1.25, 1.375, 1.5, 1.625, 1.75, 1.875, 2, 2.25, 2.5, 2.625, 2.75, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 12, 16, 20, 24, 28, 32];
      cached = new Uint16Array(multipliers.length);
      for (let i = 0; i < multipliers.length; i++) {
        cached[i] = Math.round(baseSize * multipliers[i]);
      }
      if (this.VALUE_CACHE.size >= 20) {
        const firstKey = this.VALUE_CACHE.keys().next().value;
        if (firstKey) this.VALUE_CACHE.delete(firstKey);
      }
      this.VALUE_CACHE.set(cacheKey, cached);
    }
    return cached;
  }
  /**
   * 压缩CSS字符串，移除不必要的空白
   */
  static compressCSS(css) {
    return css.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, "").replace(/\s+/g, " ").replace(/:\s+/g, ":").replace(/;\s+/g, ";").replace(/\s*\{\s*/g, "{").replace(/\s*\}\s*/g, "}").replace(/;\}/g, "}").trim();
  }
  /**
   * 生成优化的CSS变量
   */
  static generateOptimizedCSS(baseSize) {
    this.initializeTemplates();
    const precomputedValues = this.precomputeValues(baseSize);
    const parts = [];
    parts.push(":root{");
    parts.push(`--size-base:${baseSize}px;`);
    parts.push(`--size-base-rem:${(baseSize / 16).toFixed(3)}rem;`);
    parts.push(`--size-scale:${(baseSize / 16).toFixed(3)};`);
    this.appendSizeVariables(parts, precomputedValues);
    this.appendFontVariables(parts, precomputedValues);
    this.appendSpacingVariables(parts, precomputedValues);
    parts.push("}");
    return parts.join("");
  }
  /**
   * 预计算所有需要的值
   */
  static precomputeValues(baseSize) {
    const cache = /* @__PURE__ */ new Map();
    const multipliers = [0, 0.0625, 0.125, 0.25, 0.375, 0.5, 0.625, 0.6875, 0.75, 0.8125, 0.875, 1, 1.125, 1.25, 1.375, 1.5, 1.625, 1.75, 1.875, 2, 2.25, 2.5, 2.625, 2.75, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 12, 16, 20, 24, 28, 32];
    for (const mult of multipliers) {
      const value = Math.round(baseSize * mult);
      cache.set(mult, value === 0 ? "0" : `${value}px`);
    }
    return cache;
  }
  /**
   * 添加size变量
   */
  static appendSizeVariables(parts, values) {
    const sizeMap = [[0, 0], [1, 0.125], [2, 0.25], [3, 0.375], [4, 0.5], [5, 0.75], [6, 1], [7, 1.25], [8, 1.5], [9, 1.75], [10, 2], [11, 2.25], [12, 2.5], [13, 3], [14, 3.5], [15, 4], [16, 4.5], [17, 5], [18, 6], [19, 7], [20, 8], [24, 12], [32, 16], [40, 20], [48, 24], [56, 28], [64, 32]];
    for (const [num, mult] of sizeMap) {
      parts.push(`--size-${num}:${values.get(mult) || "0"};`);
    }
  }
  /**
   * 添加font变量
   */
  static appendFontVariables(parts, values) {
    const fontMap = /* @__PURE__ */ new Map([["2xs", 0.625], ["xs", 0.6875], ["sm", 0.75], ["base", 0.875], ["md", 1], ["lg", 1.125], ["xl", 1.25], ["2xl", 1.5], ["3xl", 1.875], ["4xl", 2.25]]);
    for (const [name, mult] of fontMap) {
      parts.push(`--size-font-${name}:${values.get(mult) || "0"};`);
    }
    const headingMap = [[1, 1.75], [2, 1.5], [3, 1.25], [4, 1.125], [5, 1], [6, 0.875]];
    for (const [num, mult] of headingMap) {
      parts.push(`--size-font-h${num}:${values.get(mult) || "0"};`);
    }
  }
  /**
   * 添加spacing变量
   */
  static appendSpacingVariables(parts, values) {
    const spacingMap = /* @__PURE__ */ new Map([["none", 0], ["3xs", 0.0625], ["2xs", 0.125], ["xs", 0.25], ["sm", 0.375], ["md", 0.5], ["lg", 0.75], ["xl", 1], ["2xl", 1.5], ["3xl", 2], ["4xl", 3]]);
    for (const [name, mult] of spacingMap) {
      parts.push(`--size-spacing-${name}:${values.get(mult) || "0"};`);
    }
  }
  /**
   * 生成最小化的CSS（生产环境）
   */
  static generateMinifiedCSS(baseSize) {
    const css = this.generateOptimizedCSS(baseSize);
    return this.compressCSS(css);
  }
  /**
   * 估算CSS字符串的内存占用
   */
  static estimateMemoryUsage(css) {
    return 24 + css.length * 2;
  }
  /**
   * 比较优化前后的内存占用
   */
  static compareMemoryUsage(originalCSS, optimizedCSS) {
    const originalSize = this.estimateMemoryUsage(originalCSS);
    const optimizedSize = this.estimateMemoryUsage(optimizedCSS);
    const saved = originalSize - optimizedSize;
    const percentage = (saved / originalSize * 100).toFixed(1);
    console.info("CSS Memory Optimization:");
    console.info(`Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.info(`Optimized: ${(optimizedSize / 1024).toFixed(2)} KB`);
    console.info(`Saved: ${(saved / 1024).toFixed(2)} KB (${percentage}%)`);
  }
}
CSSOptimizer.CSS_TEMPLATE = /* @__PURE__ */ new Map();
CSSOptimizer.VALUE_CACHE = /* @__PURE__ */ new Map();
CSSOptimizer.isInitialized = false;

exports.CSSOptimizer = CSSOptimizer;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=CSSOptimizer.cjs.map
