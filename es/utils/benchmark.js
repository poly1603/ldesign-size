/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class Benchmark {
  constructor() {
    this.results = [];
  }
  /**
   * 运行单个基准测试
   */
  async run(name, fn, options = {}) {
    const {
      iterations = 1e3,
      warmup = 100,
      measureMemory = false
    } = options;
    for (let i = 0; i < warmup; i++) {
      await fn();
    }
    if (measureMemory && globalThis.gc) {
      globalThis.gc();
    }
    const memoryBefore = measureMemory ? this.getMemoryUsage() : 0;
    const times = [];
    const startTotal = performance.now();
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      times.push(performance.now() - start);
    }
    const totalTime = performance.now() - startTotal;
    const memoryAfter = measureMemory ? this.getMemoryUsage() : 0;
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const opsPerSecond = Math.round(1e3 / avgTime);
    const result = {
      name,
      iterations,
      totalTime,
      avgTime,
      minTime,
      maxTime,
      opsPerSecond
    };
    if (measureMemory) {
      result.memory = {
        before: memoryBefore,
        after: memoryAfter,
        delta: memoryAfter - memoryBefore
      };
    }
    this.results.push(result);
    return result;
  }
  /**
   * 比较多个实现
   */
  async compare(benchmarks, options = {}) {
    const results = [];
    for (const {
      name,
      fn
    } of benchmarks) {
      const result = await this.run(name, fn, options);
      results.push(result);
    }
    return results;
  }
  /**
   * 获取所有结果
   */
  getResults() {
    return [...this.results];
  }
  /**
   * 清除结果
   */
  clear() {
    this.results = [];
  }
  /**
   * 获取内存使用
   */
  getMemoryUsage() {
    if (typeof performance === "undefined") return 0;
    const memory = performance.memory;
    return memory?.usedJSHeapSize || 0;
  }
  /**
   * 生成报告
   */
  generateReport() {
    if (this.results.length === 0) {
      return "\u6CA1\u6709\u53EF\u7528\u7684\u57FA\u51C6\u6D4B\u8BD5\u7ED3\u679C";
    }
    const report = [];
    report.push("=".repeat(80));
    report.push("                          \u6027\u80FD\u57FA\u51C6\u6D4B\u8BD5\u62A5\u544A");
    report.push("=".repeat(80));
    report.push("");
    const sorted = [...this.results].sort((a, b) => a.avgTime - b.avgTime);
    const fastest = sorted[0];
    sorted.forEach((result, index) => {
      const isFastest = result === fastest;
      const ratio = result.avgTime / fastest.avgTime;
      report.push(`${index + 1}. ${result.name}${isFastest ? " \u26A1" : ""}`);
      report.push(`   \u8FED\u4EE3\u6B21\u6570: ${result.iterations.toLocaleString()}`);
      report.push(`   \u603B\u8017\u65F6: ${result.totalTime.toFixed(2)}ms`);
      report.push(`   \u5E73\u5747\u8017\u65F6: ${result.avgTime.toFixed(4)}ms`);
      report.push(`   \u6700\u5C0F\u8017\u65F6: ${result.minTime.toFixed(4)}ms`);
      report.push(`   \u6700\u5927\u8017\u65F6: ${result.maxTime.toFixed(4)}ms`);
      report.push(`   \u64CD\u4F5C/\u79D2: ${result.opsPerSecond.toLocaleString()} ops/s`);
      if (!isFastest) {
        report.push(`   \u6027\u80FD\u6BD4: ${ratio.toFixed(2)}x slower`);
      }
      if (result.memory) {
        const {
          before,
          after,
          delta
        } = result.memory;
        report.push(`   \u5185\u5B58 (\u5F00\u59CB): ${(before / 1024 / 1024).toFixed(2)} MB`);
        report.push(`   \u5185\u5B58 (\u7ED3\u675F): ${(after / 1024 / 1024).toFixed(2)} MB`);
        report.push(`   \u5185\u5B58\u589E\u957F: ${(delta / 1024 / 1024).toFixed(2)} MB`);
      }
      report.push("");
    });
    report.push("=".repeat(80));
    return report.join("\n");
  }
  /**
   * 输出报告到控制台
   */
  logReport() {
    console.log(this.generateReport());
  }
}
const benchmark = new Benchmark();
async function runBenchmark(name, fn, options) {
  return benchmark.run(name, fn, options);
}
async function compareBenchmarks(benchmarks, options) {
  return benchmark.compare(benchmarks, options);
}

export { Benchmark, benchmark, compareBenchmarks, runBenchmark };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=benchmark.js.map
