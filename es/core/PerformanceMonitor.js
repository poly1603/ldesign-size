/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = /* @__PURE__ */ new Map();
    this.startTimes = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  /**
   * Start timing an operation
   */
  startTiming(operation) {
    this.startTimes.set(operation, performance.now());
  }
  /**
   * End timing and record the duration
   */
  endTiming(operation) {
    const startTime = this.startTimes.get(operation);
    if (startTime === void 0) {
      console.warn(`[PerformanceMonitor] No start time for operation: ${operation}`);
      return 0;
    }
    const duration = performance.now() - startTime;
    this.metrics.set(operation, duration);
    this.startTimes.delete(operation);
    return duration;
  }
  /**
   * Record a metric value
   */
  recordMetric(name, value) {
    this.metrics.set(name, value);
  }
  /**
   * Get memory usage information
   */
  getMemoryUsage() {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = performance.memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }
  /**
   * Count DOM nodes
   */
  countDOMNodes() {
    if (typeof document === "undefined") return 0;
    return document.querySelectorAll("*").length;
  }
  /**
   * Count CSS rules
   */
  countCSSRules() {
    if (typeof document === "undefined") return 0;
    let count = 0;
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        count += sheet.cssRules?.length || 0;
      } catch {
      }
    });
    return count;
  }
  /**
   * Get comprehensive performance report
   */
  getReport() {
    const memory = this.getMemoryUsage();
    const SizePool = globalThis.__sizePool;
    const poolStats = SizePool?.getStats?.() || {
      hitRate: 0
    };
    return {
      memoryUsage: memory || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
      },
      cacheStats: {
        sizePoolHitRate: poolStats.hitRate,
        cssCache: this.metrics.get("cssCacheSize") || 0,
        fluidSizeCache: this.metrics.get("fluidCacheSize") || 0
      },
      timing: {
        cssGeneration: this.metrics.get("cssGeneration") || 0,
        sizeCalculation: this.metrics.get("sizeCalculation") || 0,
        viewportUpdate: this.metrics.get("viewportUpdate") || 0
      },
      counts: {
        domNodes: this.countDOMNodes(),
        cssRules: this.countCSSRules(),
        listeners: this.metrics.get("listenerCount") || 0,
        pooledObjects: poolStats.poolSize || 0
      }
    };
  }
  /**
   * Log performance report to console
   */
  logReport() {
    const report = this.getReport();
    console.group("\u{1F680} Performance Report");
    if (report.memoryUsage) {
      console.group("Memory Usage");
      console.log(`Used Heap: ${(report.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Total Heap: ${(report.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Heap Limit: ${(report.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
      console.groupEnd();
    }
    console.group("Cache Performance");
    console.log(`Size Pool Hit Rate: ${(report.cacheStats.sizePoolHitRate * 100).toFixed(1)}%`);
    console.log(`CSS Cache Entries: ${report.cacheStats.cssCache}`);
    console.log(`Fluid Size Cache: ${report.cacheStats.fluidSizeCache}`);
    console.groupEnd();
    console.group("Timing Metrics");
    console.log(`CSS Generation: ${report.timing.cssGeneration.toFixed(2)}ms`);
    console.log(`Size Calculation: ${report.timing.sizeCalculation.toFixed(2)}ms`);
    console.log(`Viewport Update: ${report.timing.viewportUpdate.toFixed(2)}ms`);
    console.groupEnd();
    console.group("Resource Counts");
    console.log(`DOM Nodes: ${report.counts.domNodes}`);
    console.log(`CSS Rules: ${report.counts.cssRules}`);
    console.log(`Active Listeners: ${report.counts.listeners}`);
    console.log(`Pooled Objects: ${report.counts.pooledObjects}`);
    console.groupEnd();
    console.groupEnd();
  }
  /**
   * Reset all metrics
   */
  reset() {
    this.metrics.clear();
    this.startTimes.clear();
  }
  /**
   * Compare two performance snapshots
   */
  static compareSnapshots(before, after) {
    console.group("\u{1F4CA} Performance Comparison");
    if (before.memoryUsage && after.memoryUsage) {
      const memoryDiff = after.memoryUsage.usedJSHeapSize - before.memoryUsage.usedJSHeapSize;
      const sign = memoryDiff > 0 ? "+" : "";
      console.log(`Memory Change: ${sign}${(memoryDiff / 1024 / 1024).toFixed(2)} MB`);
    }
    const hitRateDiff = after.cacheStats.sizePoolHitRate - before.cacheStats.sizePoolHitRate;
    console.log(`Cache Hit Rate Change: ${hitRateDiff > 0 ? "+" : ""}${(hitRateDiff * 100).toFixed(1)}%`);
    const timingDiff = {
      css: after.timing.cssGeneration - before.timing.cssGeneration,
      size: after.timing.sizeCalculation - before.timing.sizeCalculation,
      viewport: after.timing.viewportUpdate - before.timing.viewportUpdate
    };
    console.log(`CSS Generation: ${timingDiff.css > 0 ? "+" : ""}${timingDiff.css.toFixed(2)}ms`);
    console.log(`Size Calculation: ${timingDiff.size > 0 ? "+" : ""}${timingDiff.size.toFixed(2)}ms`);
    console.log(`Viewport Update: ${timingDiff.viewport > 0 ? "+" : ""}${timingDiff.viewport.toFixed(2)}ms`);
    console.groupEnd();
  }
}
const performanceMonitor = PerformanceMonitor.getInstance();
const perf = {
  start: (operation) => performanceMonitor.startTiming(operation),
  end: (operation) => performanceMonitor.endTiming(operation),
  record: (name, value) => performanceMonitor.recordMetric(name, value),
  report: () => performanceMonitor.getReport(),
  log: () => performanceMonitor.logReport(),
  reset: () => performanceMonitor.reset()
};

export { PerformanceMonitor, perf, performanceMonitor };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=PerformanceMonitor.js.map
