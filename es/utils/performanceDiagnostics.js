/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class PerformanceDiagnostics {
  constructor() {
    this.marks = /* @__PURE__ */ new Map();
    this.snapshots = [];
    this.maxSnapshots = 100;
    this.fpsHistory = [];
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.rafId = null;
    this.isMonitoring = false;
  }
  static getInstance() {
    if (!PerformanceDiagnostics.instance) {
      PerformanceDiagnostics.instance = new PerformanceDiagnostics();
    }
    return PerformanceDiagnostics.instance;
  }
  /**
   * 开始性能标记
   */
  mark(name, metadata) {
    const mark = {
      name,
      startTime: performance.now(),
      metadata
    };
    this.marks.set(name, mark);
    if (typeof performance.mark === "function") {
      try {
        performance.mark(name);
      } catch {
      }
    }
  }
  /**
   * 结束性能标记并计算持续时间
   */
  measure(name) {
    const mark = this.marks.get(name);
    if (!mark) {
      console.warn(`[PerformanceDiagnostics] No mark found for: ${name}`);
      return null;
    }
    const duration = performance.now() - mark.startTime;
    mark.duration = duration;
    if (typeof performance.measure === "function") {
      try {
        performance.measure(`${name}-measure`, name);
      } catch {
      }
    }
    return duration;
  }
  /**
   * 获取内存使用情况
   */
  getMemoryUsage() {
    if (typeof performance === "undefined") return null;
    const memory = performance.memory;
    if (!memory) return null;
    const used = memory.usedJSHeapSize;
    const limit = memory.jsHeapSizeLimit;
    return {
      usedJSHeapSize: used,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: limit,
      percentage: used / limit * 100
    };
  }
  /**
   * 开始 FPS 监控
   */
  startFPSMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    const measureFPS = (currentTime) => {
      if (!this.isMonitoring) return;
      this.frameCount++;
      const deltaTime = currentTime - this.lastFrameTime;
      if (deltaTime >= 1e3) {
        const fps = Math.round(this.frameCount / deltaTime * 1e3);
        this.fpsHistory.push(fps);
        if (this.fpsHistory.length > 60) {
          this.fpsHistory.shift();
        }
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }
      this.rafId = requestAnimationFrame(measureFPS);
    };
    this.rafId = requestAnimationFrame(measureFPS);
  }
  /**
   * 停止 FPS 监控
   */
  stopFPSMonitoring() {
    this.isMonitoring = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  /**
   * 获取平均 FPS
   */
  getAverageFPS() {
    if (this.fpsHistory.length === 0) return 0;
    return Math.round(this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length);
  }
  /**
   * 创建性能快照
   */
  createSnapshot(caches) {
    const snapshot = {
      timestamp: Date.now(),
      marks: Array.from(this.marks.values()),
      memory: this.getMemoryUsage() || void 0,
      caches: {
        size: /* @__PURE__ */ new Map(),
        fluidSize: /* @__PURE__ */ new Map(),
        conversion: /* @__PURE__ */ new Map()
      },
      fps: this.getAverageFPS() || void 0
    };
    if (caches) {
      Object.entries(caches).forEach(([name, cache]) => {
        if (cache instanceof Map) {
          const stats = /* @__PURE__ */ new Map();
          stats.set("size", cache.size);
          snapshot.caches[name] = stats;
        }
      });
    }
    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }
    return snapshot;
  }
  /**
   * 获取所有快照
   */
  getSnapshots() {
    return [...this.snapshots];
  }
  /**
   * 清除所有数据
   */
  clear() {
    this.marks.clear();
    this.snapshots = [];
    this.fpsHistory = [];
    this.stopFPSMonitoring();
    if (typeof performance.clearMarks === "function") {
      try {
        performance.clearMarks();
        performance.clearMeasures();
      } catch {
      }
    }
  }
  /**
   * 生成性能报告
   */
  generateReport() {
    const report = [];
    report.push("=".repeat(60));
    report.push("          \u6027\u80FD\u8BCA\u65AD\u62A5\u544A");
    report.push("=".repeat(60));
    report.push("");
    const memory = this.getMemoryUsage();
    if (memory) {
      report.push("\u{1F4CA} \u5185\u5B58\u4F7F\u7528\u60C5\u51B5:");
      report.push(`  \u5DF2\u7528\u5185\u5B58: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      report.push(`  \u603B\u5185\u5B58: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      report.push(`  \u5185\u5B58\u9650\u5236: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
      report.push(`  \u4F7F\u7528\u7387: ${memory.percentage.toFixed(1)}%`);
      report.push("");
    }
    const avgFPS = this.getAverageFPS();
    if (avgFPS > 0) {
      report.push("\u{1F3AF} \u5E27\u7387\u7EDF\u8BA1:");
      report.push(`  \u5E73\u5747 FPS: ${avgFPS}`);
      report.push(`  \u6700\u4F4E FPS: ${Math.min(...this.fpsHistory)}`);
      report.push(`  \u6700\u9AD8 FPS: ${Math.max(...this.fpsHistory)}`);
      report.push("");
    }
    if (this.marks.size > 0) {
      report.push("\u23F1\uFE0F  \u6027\u80FD\u6807\u8BB0:");
      const sortedMarks = Array.from(this.marks.values()).filter((m) => m.duration !== void 0).sort((a, b) => (b.duration || 0) - (a.duration || 0));
      sortedMarks.forEach((mark) => {
        report.push(`  ${mark.name}: ${mark.duration.toFixed(2)}ms`);
      });
      report.push("");
    }
    if (this.snapshots.length > 0) {
      report.push("\u{1F4F8} \u5FEB\u7167\u7EDF\u8BA1:");
      report.push(`  \u603B\u5FEB\u7167\u6570: ${this.snapshots.length}`);
      const latest = this.snapshots[this.snapshots.length - 1];
      if (latest) {
        report.push(`  \u6700\u65B0\u5FEB\u7167\u65F6\u95F4: ${new Date(latest.timestamp).toLocaleString()}`);
      }
      report.push("");
    }
    report.push("=".repeat(60));
    return report.join("\n");
  }
  /**
   * 控制台输出报告
   */
  logReport() {
    console.log(this.generateReport());
  }
  /**
   * 检测性能瓶颈
   */
  detectBottlenecks() {
    const bottlenecks = [];
    const memory = this.getMemoryUsage();
    if (memory) {
      if (memory.percentage > 90) {
        bottlenecks.push({
          type: "memory",
          severity: "high",
          message: `\u5185\u5B58\u4F7F\u7528\u7387\u8FC7\u9AD8: ${memory.percentage.toFixed(1)}%`
        });
      } else if (memory.percentage > 70) {
        bottlenecks.push({
          type: "memory",
          severity: "medium",
          message: `\u5185\u5B58\u4F7F\u7528\u7387\u8F83\u9AD8: ${memory.percentage.toFixed(1)}%`
        });
      }
    }
    const avgFPS = this.getAverageFPS();
    if (avgFPS > 0) {
      if (avgFPS < 30) {
        bottlenecks.push({
          type: "fps",
          severity: "high",
          message: `\u5E73\u5747 FPS \u8FC7\u4F4E: ${avgFPS}`
        });
      } else if (avgFPS < 50) {
        bottlenecks.push({
          type: "fps",
          severity: "medium",
          message: `\u5E73\u5747 FPS \u8F83\u4F4E: ${avgFPS}`
        });
      }
    }
    const slowMarks = Array.from(this.marks.values()).filter((m) => m.duration !== void 0 && m.duration > 100);
    if (slowMarks.length > 0) {
      bottlenecks.push({
        type: "slow-operation",
        severity: "medium",
        message: `\u68C0\u6D4B\u5230 ${slowMarks.length} \u4E2A\u6162\u64CD\u4F5C (>100ms)`
      });
    }
    return bottlenecks;
  }
}
const perf = PerformanceDiagnostics.getInstance();
const perfDiagnostics = {
  mark: (name, metadata) => perf.mark(name, metadata),
  measure: (name) => perf.measure(name),
  startFPS: () => perf.startFPSMonitoring(),
  stopFPS: () => perf.stopFPSMonitoring(),
  snapshot: (caches) => perf.createSnapshot(caches),
  report: () => perf.logReport(),
  bottlenecks: () => perf.detectBottlenecks(),
  clear: () => perf.clear()
};

export { PerformanceDiagnostics, perf, perfDiagnostics };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=performanceDiagnostics.js.map
