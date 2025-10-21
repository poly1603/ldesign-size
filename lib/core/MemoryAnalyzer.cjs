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

class MemoryAnalyzer {
  /**
   * 估算字符串内存占用
   */
  static estimateString(str) {
    if (!str) return 0;
    return this.SIZES.STRING_HEADER + str.length * 2;
  }
  /**
   * 估算对象内存占用
   */
  static estimateObject(obj) {
    if (!obj) return 0;
    let size = this.SIZES.OBJECT_HEADER;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        size += this.estimateString(key);
        size += this.estimateValue(obj[key]);
        size += this.SIZES.POINTER;
      }
    }
    return size;
  }
  /**
   * 估算数组内存占用
   */
  static estimateArray(arr) {
    if (!arr) return 0;
    let size = this.SIZES.ARRAY_HEADER;
    const capacity = Math.ceil(arr.length * 1.5);
    size += capacity * this.SIZES.POINTER;
    for (const item of arr) {
      size += this.estimateValue(item);
    }
    return size;
  }
  /**
   * 估算Map内存占用
   */
  static estimateMap(map) {
    let size = this.SIZES.OBJECT_HEADER;
    size += map.size * this.SIZES.MAP_ENTRY;
    map.forEach((value, key) => {
      size += this.estimateValue(key);
      size += this.estimateValue(value);
    });
    size += Math.ceil(map.size * 1.5) * this.SIZES.POINTER;
    return size;
  }
  /**
   * 估算Set内存占用
   */
  static estimateSet(set) {
    let size = this.SIZES.OBJECT_HEADER;
    size += set.size * this.SIZES.SET_ENTRY;
    set.forEach((value) => {
      size += this.estimateValue(value);
    });
    size += Math.ceil(set.size * 1.5) * this.SIZES.POINTER;
    return size;
  }
  /**
   * 估算函数内存占用
   */
  static estimateFunction(fn) {
    let size = this.SIZES.FUNCTION_CLOSURE;
    const fnString = fn.toString();
    size += this.estimateString(fnString);
    size += 200;
    return size;
  }
  /**
   * 估算任意值的内存占用
   */
  static estimateValue(value) {
    if (value === null || value === void 0) {
      return 0;
    }
    const type = typeof value;
    switch (type) {
      case "number":
        return this.SIZES.NUMBER;
      case "boolean":
        return this.SIZES.BOOLEAN;
      case "string":
        return this.estimateString(value);
      case "function":
        return this.estimateFunction(value);
      case "object":
        if (Array.isArray(value)) {
          return this.estimateArray(value);
        } else if (value instanceof Map) {
          return this.estimateMap(value);
        } else if (value instanceof Set) {
          return this.estimateSet(value);
        } else if (value instanceof WeakMap || value instanceof WeakSet) {
          return this.SIZES.OBJECT_HEADER + 100;
        } else {
          return this.estimateObject(value);
        }
      default:
        return this.SIZES.POINTER;
    }
  }
  /**
   * 分析Size类的内存占用
   */
  static analyzeSizeClass() {
    const estimates = [];
    estimates.push({
      variable: "Size instance",
      type: "object",
      sizeInBytes: this.SIZES.OBJECT_HEADER + this.SIZES.POINTER * 5 + // 5个属性
      this.SIZES.NUMBER * 3 + // value, rootFontSize, cachedPixels
      this.estimateString("px") + // unit字符串
      this.SIZES.BOOLEAN,
      // isPooled
      description: "\u5355\u4E2ASize\u5BF9\u8C61\u5B9E\u4F8B",
      optimization: "\u4F7F\u7528\u5BF9\u8C61\u6C60\u590D\u7528\u5B9E\u4F8B"
    });
    estimates.push({
      variable: "SizePool.pool",
      type: "array",
      sizeInBytes: this.SIZES.ARRAY_HEADER + 100 * this.SIZES.POINTER,
      // 最多100个对象引用
      description: "\u5BF9\u8C61\u6C60\u6570\u7EC4",
      optimization: "\u52A8\u6001\u8C03\u6574\u6C60\u5927\u5C0F"
    });
    estimates.push({
      variable: "sizeCache",
      type: "Map",
      sizeInBytes: this.estimateMap(/* @__PURE__ */ new Map()),
      description: "\u5168\u5C40Size\u7F13\u5B58",
      optimization: "\u4F7F\u7528LRU\u7B56\u7565\u9650\u5236\u5927\u5C0F"
    });
    return estimates;
  }
  /**
   * 分析SizeManager的内存占用
   */
  static analyzeSizeManager() {
    const estimates = [];
    estimates.push({
      variable: "cssCache",
      type: "Map<string, string>",
      sizeInBytes: this.SIZES.MAP_ENTRY * 20 + // 假设20个条目
      this.estimateString("x".repeat(5e3)) * 20,
      // 每个CSS约5KB
      description: "CSS\u751F\u6210\u7F13\u5B58",
      optimization: "\u538B\u7F29CSS\u5B57\u7B26\u4E32\uFF0C\u4F7F\u7528WeakMap"
    });
    estimates.push({
      variable: "presets",
      type: "Map<string, SizePreset>",
      sizeInBytes: this.SIZES.MAP_ENTRY * 10 + // 假设10个预设
      this.estimateObject({
        name: "",
        baseSize: 0
      }) * 10,
      description: "\u5C3A\u5BF8\u9884\u8BBE\u914D\u7F6E",
      optimization: "\u4F7F\u7528frozen\u5BF9\u8C61\u51CF\u5C11\u5185\u5B58"
    });
    estimates.push({
      variable: "listeners",
      type: "Set<Function>",
      sizeInBytes: this.SIZES.SET_ENTRY * 50 + // 假设50个监听器
      this.SIZES.FUNCTION_CLOSURE * 50,
      description: "\u4E8B\u4EF6\u76D1\u542C\u5668\u96C6\u5408",
      optimization: "\u4F7F\u7528WeakRef\u5F31\u5F15\u7528"
    });
    estimates.push({
      variable: "styleElement",
      type: "HTMLStyleElement",
      sizeInBytes: 500,
      // DOM元素基础开销
      description: "DOM\u6837\u5F0F\u5143\u7D20",
      optimization: "\u590D\u7528\u5355\u4E2A\u5143\u7D20"
    });
    return estimates;
  }
  /**
   * 分析字符串拼接的内存开销
   */
  static analyzeStringConcatenation(operations) {
    const intermediateStrings = operations - 1;
    const avgStringSize = 100;
    return {
      variable: "String concatenation",
      type: "operation",
      sizeInBytes: intermediateStrings * this.estimateString("x".repeat(avgStringSize)),
      description: `${operations}\u6B21\u5B57\u7B26\u4E32\u62FC\u63A5\u64CD\u4F5C`,
      optimization: "\u4F7F\u7528\u6570\u7EC4join()\u66FF\u4EE3"
    };
  }
  /**
   * 生成内存优化建议
   */
  static generateOptimizationReport() {
    const sizeEstimates = this.analyzeSizeClass();
    const managerEstimates = this.analyzeSizeManager();
    let report = "# \u5185\u5B58\u5360\u7528\u5206\u6790\u62A5\u544A\n\n";
    report += "## Size\u7C7B\u5185\u5B58\u5206\u6790\n";
    let totalSize = 0;
    for (const estimate of sizeEstimates) {
      totalSize += estimate.sizeInBytes;
      report += `
### ${estimate.variable}
`;
      report += `- \u7C7B\u578B: ${estimate.type}
`;
      report += `- \u5360\u7528: ${(estimate.sizeInBytes / 1024).toFixed(2)} KB
`;
      report += `- \u8BF4\u660E: ${estimate.description}
`;
      if (estimate.optimization) {
        report += `- \u4F18\u5316: ${estimate.optimization}
`;
      }
    }
    report += `
**Size\u7C7B\u603B\u5360\u7528: ${(totalSize / 1024).toFixed(2)} KB**
`;
    report += "\n## SizeManager\u5185\u5B58\u5206\u6790\n";
    totalSize = 0;
    for (const estimate of managerEstimates) {
      totalSize += estimate.sizeInBytes;
      report += `
### ${estimate.variable}
`;
      report += `- \u7C7B\u578B: ${estimate.type}
`;
      report += `- \u5360\u7528: ${(estimate.sizeInBytes / 1024).toFixed(2)} KB
`;
      report += `- \u8BF4\u660E: ${estimate.description}
`;
      if (estimate.optimization) {
        report += `- \u4F18\u5316: ${estimate.optimization}
`;
      }
    }
    report += `
**SizeManager\u603B\u5360\u7528: ${(totalSize / 1024).toFixed(2)} KB**
`;
    return report;
  }
  /**
   * 实时内存监控
   */
  static monitorMemory() {
    if (typeof window !== "undefined" && "performance" in window && "memory" in performance) {
      const memory = performance.memory;
      console.table({
        "\u5DF2\u7528JS\u5806": `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        "\u603BJS\u5806": `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        "JS\u5806\u9650\u5236": `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
        "\u4F7F\u7528\u7387": `${(memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(1)}%`
      });
    }
  }
}
MemoryAnalyzer.SIZES = {
  // 基础类型大小（字节）
  POINTER: 8,
  // 64位系统指针
  OBJECT_HEADER: 24,
  // V8对象头部开销
  STRING_HEADER: 24,
  // 字符串对象头部
  ARRAY_HEADER: 32,
  // 数组对象头部
  MAP_ENTRY: 32,
  // Map单个条目
  SET_ENTRY: 24,
  // Set单个条目
  WEAKMAP_ENTRY: 16,
  // WeakMap条目（不计算值）
  FUNCTION_CLOSURE: 96,
  // 函数闭包基础大小
  NUMBER: 8,
  // 数字类型
  BOOLEAN: 4,
  // 布尔类型
  UNDEFINED: 0,
  // undefined不占用额外空间
  NULL: 0
  // null不占用额外空间
};
const memoryAnalyzer = {
  estimate: (value) => MemoryAnalyzer.estimateValue(value),
  analyzeSize: () => MemoryAnalyzer.analyzeSizeClass(),
  analyzeManager: () => MemoryAnalyzer.analyzeSizeManager(),
  report: () => MemoryAnalyzer.generateOptimizationReport(),
  monitor: () => MemoryAnalyzer.monitorMemory()
};

exports.MemoryAnalyzer = MemoryAnalyzer;
exports.memoryAnalyzer = memoryAnalyzer;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=MemoryAnalyzer.cjs.map
