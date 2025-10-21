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

var DeviceDetector = require('./DeviceDetector.cjs');
var SizeManager = require('./SizeManager.cjs');

class SizeAnalyzer {
  constructor() {
    this.usageMap = /* @__PURE__ */ new Map();
    this.performanceObserver = null;
    this.debugPanel = null;
    this.panelStyleEl = null;
    this.variableObserver = null;
    this.rafId = null;
    this.isMonitoring = false;
    this.setupPerformanceObserver();
  }
  /**
   * Show visual debug panel
   */
  showDebugPanel() {
    if (typeof document === "undefined") return;
    if (this.debugPanel) {
      this.debugPanel.style.display = "block";
      return;
    }
    this.debugPanel = this.createDebugPanel();
    document.body.appendChild(this.debugPanel);
    this.startMonitoring();
    this.updateDebugPanel();
  }
  /**
   * Hide debug panel
   */
  hideDebugPanel() {
    if (this.debugPanel) {
      this.debugPanel.style.display = "none";
      this.stopMonitoring();
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }
  /**
   * Create debug panel UI
   */
  createDebugPanel() {
    const panel = document.createElement("div");
    panel.id = "ldesign-size-debug-panel";
    panel.innerHTML = `
      <div class="ldesign-debug-header">
        <h3>Size Analyzer</h3>
        <button class="ldesign-debug-close">\xD7</button>
      </div>
      <div class="ldesign-debug-tabs">
        <button class="ldesign-debug-tab active" data-tab="overview">Overview</button>
        <button class="ldesign-debug-tab" data-tab="variables">Variables</button>
        <button class="ldesign-debug-tab" data-tab="performance">Performance</button>
        <button class="ldesign-debug-tab" data-tab="validation">Validation</button>
      </div>
      <div class="ldesign-debug-content">
        <div class="ldesign-debug-pane active" data-pane="overview"></div>
        <div class="ldesign-debug-pane" data-pane="variables"></div>
        <div class="ldesign-debug-pane" data-pane="performance"></div>
        <div class="ldesign-debug-pane" data-pane="validation"></div>
      </div>
    `;
    const style = document.createElement("style");
    this.panelStyleEl = style;
    style.textContent = `
      #ldesign-size-debug-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        max-height: 600px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 14px;
      }
      .ldesign-debug-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
        background: #f8f9fa;
        border-radius: 8px 8px 0 0;
      }
      .ldesign-debug-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      .ldesign-debug-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ldesign-debug-tabs {
        display: flex;
        border-bottom: 1px solid #eee;
        background: #fafafa;
      }
      .ldesign-debug-tab {
        flex: 1;
        padding: 10px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 13px;
        color: #666;
        transition: all 0.2s;
      }
      .ldesign-debug-tab.active {
        color: #1890ff;
        border-bottom: 2px solid #1890ff;
        font-weight: 500;
      }
      .ldesign-debug-content {
        max-height: 400px;
        overflow-y: auto;
      }
      .ldesign-debug-pane {
        display: none;
        padding: 16px;
      }
      .ldesign-debug-pane.active {
        display: block;
      }
      .ldesign-debug-metric {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 8px 12px;
        background: #f8f9fa;
        border-radius: 4px;
      }
      .ldesign-debug-metric-label {
        color: #666;
        font-weight: 500;
      }
      .ldesign-debug-metric-value {
        font-weight: 600;
        color: #333;
      }
      .ldesign-debug-warning {
        padding: 8px 12px;
        background: #fff3cd;
        border-left: 3px solid #ffc107;
        margin-bottom: 8px;
        border-radius: 4px;
      }
      .ldesign-debug-error {
        padding: 8px 12px;
        background: #f8d7da;
        border-left: 3px solid #dc3545;
        margin-bottom: 8px;
        border-radius: 4px;
      }
      .ldesign-debug-success {
        padding: 8px 12px;
        background: #d4edda;
        border-left: 3px solid #28a745;
        margin-bottom: 8px;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
    panel.querySelector(".ldesign-debug-close")?.addEventListener("click", () => {
      this.hideDebugPanel();
    });
    panel.querySelectorAll(".ldesign-debug-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const target = e.target;
        const tabName = target.dataset.tab;
        panel.querySelectorAll(".ldesign-debug-tab").forEach((t) => {
          t.classList.remove("active");
        });
        target.classList.add("active");
        panel.querySelectorAll(".ldesign-debug-pane").forEach((p) => {
          p.classList.remove("active");
        });
        panel.querySelector(`[data-pane="${tabName}"]`)?.classList.add("active");
      });
    });
    return panel;
  }
  /**
   * Update debug panel content
   */
  updateDebugPanel() {
    if (!this.debugPanel) return;
    const stats = this.getUsageStats();
    const perf = this.measurePerformance();
    const validation = this.validateConsistency();
    const overviewPane = this.debugPanel.querySelector('[data-pane="overview"]');
    if (overviewPane) {
      overviewPane.innerHTML = `
        <div class="ldesign-debug-metric">
          <span class="ldesign-debug-metric-label">Current Preset</span>
          <span class="ldesign-debug-metric-value">${SizeManager.sizeManager.getCurrentPreset()}</span>
        </div>
        <div class="ldesign-debug-metric">
          <span class="ldesign-debug-metric-label">Base Size</span>
          <span class="ldesign-debug-metric-value">${SizeManager.sizeManager.getConfig().baseSize}px</span>
        </div>
        <div class="ldesign-debug-metric">
          <span class="ldesign-debug-metric-label">Device Type</span>
          <span class="ldesign-debug-metric-value">${DeviceDetector.getDeviceDetector().getDevice()}</span>
        </div>
        <div class="ldesign-debug-metric">
          <span class="ldesign-debug-metric-label">Variables Used</span>
          <span class="ldesign-debug-metric-value">${stats.variables.used}/${stats.variables.total}</span>
        </div>
        <div class="ldesign-debug-metric">
          <span class="ldesign-debug-metric-label">Memory Usage</span>
          <span class="ldesign-debug-metric-value">${(perf.memoryUsage / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      `;
    }
    const variablesPane = this.debugPanel.querySelector('[data-pane="variables"]');
    if (variablesPane) {
      const mostUsed = stats.variables.mostUsed.slice(0, 10);
      variablesPane.innerHTML = `
        <h4 style="margin-top: 0;">Most Used Variables</h4>
        ${mostUsed.map((v) => `
          <div class="ldesign-debug-metric">
            <span class="ldesign-debug-metric-label">${v.name}</span>
            <span class="ldesign-debug-metric-value">${v.count} times</span>
          </div>
        `).join("")}
        ${stats.variables.unused.length > 0 ? `
          <h4>Unused Variables (${stats.variables.unused.length})</h4>
          <div style="max-height: 150px; overflow-y: auto;">
            ${stats.variables.unused.slice(0, 20).map((v) => `
              <div style="padding: 4px 8px; background: #f5f5f5; margin-bottom: 4px; border-radius: 3px; font-size: 12px;">
                ${v}
              </div>
            `).join("")}
          </div>
        ` : ""}
      `;
    }
    const performancePane = this.debugPanel.querySelector('[data-pane="performance"]');
    if (performancePane) {
      performancePane.innerHTML = `
        <div class="ldesign-debug-metric">
          <span class="ldesign-debug-metric-label">Render Time</span>
          <span class="ldesign-debug-metric-value">${perf.renderTime.toFixed(2)} ms</span>
        </div>
        <div class="ldesign-debug-metric">
          <span class="ldesign-debug-metric-label">Recalc Time</span>
          <span class="ldesign-debug-metric-value">${perf.recalcTime.toFixed(2)} ms</span>
        </div>
        <div class="ldesign-debug-metric">
          <span class="ldesign-debug-metric-label">DOM Nodes</span>
          <span class="ldesign-debug-metric-value">${perf.domNodes}</span>
        </div>
        <div class="ldesign-debug-metric">
          <span class="ldesign-debug-metric-label">CSS Rules</span>
          <span class="ldesign-debug-metric-value">${perf.cssRules}</span>
        </div>
        <div class="ldesign-debug-metric">
          <span class="ldesign-debug-metric-label">Unused CSS</span>
          <span class="ldesign-debug-metric-value">${perf.unusedCss} rules</span>
        </div>
      `;
    }
    const validationPane = this.debugPanel.querySelector('[data-pane="validation"]');
    if (validationPane) {
      validationPane.innerHTML = `
        ${validation.passed ? '<div class="ldesign-debug-success">\u2713 All validation checks passed</div>' : ""}
        ${validation.errors.map((e) => `
          <div class="ldesign-debug-error">
            <strong>${e.type}</strong>: ${e.message}
          </div>
        `).join("")}
        ${validation.warnings.map((w) => `
          <div class="ldesign-debug-warning">
            <strong>${w.type}</strong>: ${w.message}
            ${w.suggestion ? `<br><small>Suggestion: ${w.suggestion}</small>` : ""}
          </div>
        `).join("")}
      `;
    }
    if (this.isMonitoring) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.updateDebugPanel();
      });
    }
  }
  /**
   * Start monitoring
   */
  startMonitoring() {
    this.isMonitoring = true;
    this.trackVariableUsage();
  }
  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
  }
  /**
   * Track CSS variable usage
   */
  trackVariableUsage() {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver(() => {
      this.scanVariableUsage();
    });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["style", "class"]
    });
    this.variableObserver = observer;
  }
  /**
   * Scan for variable usage
   */
  scanVariableUsage() {
    const allElements = document.querySelectorAll("*");
    this.usageMap.clear();
    allElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const cssText = styles.cssText;
      const varMatches = cssText.matchAll(/var\(([^)]+)\)/g);
      for (const match of varMatches) {
        const varName = match[1].split(",")[0].trim();
        this.usageMap.set(varName, (this.usageMap.get(varName) || 0) + 1);
      }
    });
  }
  /**
   * Get usage statistics
   */
  getUsageStats() {
    this.scanVariableUsage();
    const allVariables = this.getAllCSSVariables();
    const used = Array.from(this.usageMap.keys());
    const unused = allVariables.filter((v) => !used.includes(v));
    const mostUsed = Array.from(this.usageMap.entries()).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({
      name,
      count
    }));
    return {
      variables: {
        total: allVariables.length,
        used: used.length,
        unused,
        mostUsed
      },
      presets: {
        current: SizeManager.sizeManager.getCurrentPreset(),
        history: []
        // Would need to implement history tracking
      },
      performance: {
        cssGenerationTime: 0,
        applyTime: 0,
        memoryUsage: performance.memory?.usedJSHeapSize || 0
      }
    };
  }
  /**
   * Get all CSS variables
   */
  getAllCSSVariables() {
    const variables = [];
    if (typeof document === "undefined") return variables;
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        Array.from(sheet.cssRules || []).forEach((rule) => {
          if (rule.type === CSSRule.STYLE_RULE) {
            const style = rule.style;
            for (let i = 0; i < style.length; i++) {
              const prop = style[i];
              if (prop.startsWith("--")) {
                variables.push(prop);
              }
            }
          }
        });
      } catch {
      }
    });
    return [...new Set(variables)];
  }
  /**
   * Measure performance
   */
  measurePerformance() {
    const renderTime = performance.getEntriesByType("paint")[0]?.startTime || 0;
    const recalcTime = performance.getEntriesByType("measure").filter((m) => m.name.includes("recalc")).reduce((acc, m) => acc + m.duration, 0);
    return {
      renderTime,
      recalcTime,
      memoryUsage: performance.memory?.usedJSHeapSize || 0,
      domNodes: document.querySelectorAll("*").length,
      cssRules: this.countCSSRules(),
      unusedCss: this.countUnusedCSS()
    };
  }
  /**
   * Count CSS rules
   */
  countCSSRules() {
    let count = 0;
    if (typeof document === "undefined") return count;
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        count += sheet.cssRules?.length || 0;
      } catch {
      }
    });
    return count;
  }
  /**
   * Count unused CSS
   */
  countUnusedCSS() {
    const stats = this.getUsageStats();
    return stats.variables.unused.length;
  }
  /**
   * Validate consistency
   */
  validateConsistency() {
    const errors = [];
    const warnings = [];
    if (typeof document !== "undefined") {
      const buttons = document.querySelectorAll("button, a, input, select, textarea");
      buttons.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          warnings.push({
            type: "Touch Target",
            message: `Element too small for touch (${rect.width}x${rect.height}px)`,
            suggestion: "Minimum touch target should be 44x44px"
          });
        }
      });
      const allElements = document.querySelectorAll("*");
      allElements.forEach((element) => {
        const fontSize = Number.parseFloat(window.getComputedStyle(element).fontSize);
        if (fontSize < 12 && element.textContent?.trim()) {
          warnings.push({
            type: "Font Size",
            message: `Font size too small (${fontSize}px)`,
            suggestion: "Minimum font size should be 12px for readability"
          });
        }
      });
    }
    const variables = this.getAllCSSVariables();
    const inconsistent = variables.filter((v) => {
      return !v.startsWith("--size-") && !v.startsWith("--") && v.startsWith("--");
    });
    if (inconsistent.length > 0) {
      warnings.push({
        type: "Naming",
        message: `${inconsistent.length} variables don't follow naming convention`,
        suggestion: "Use --size- prefix for size-related variables"
      });
    }
    return {
      errors,
      warnings,
      passed: errors.length === 0
    };
  }
  /**
   * Generate specification document
   */
  generateSpecification() {
    return {
      version: "1.0.0",
      generated: /* @__PURE__ */ new Date(),
      config: SizeManager.sizeManager.getConfig(),
      presets: SizeManager.sizeManager.getPresets(),
      variables: this.getAllCSSVariablesWithValues(),
      usage: this.getUsageStats()
    };
  }
  /**
   * Get all CSS variables with values
   */
  getAllCSSVariablesWithValues() {
    const variables = {};
    if (typeof document === "undefined") return variables;
    const computed = window.getComputedStyle(document.documentElement);
    this.getAllCSSVariables().forEach((varName) => {
      const value = computed.getPropertyValue(varName);
      if (value) {
        variables[varName] = value;
      }
    });
    return variables;
  }
  /**
   * Export specification as JSON
   */
  exportSpecification() {
    const spec = this.generateSpecification();
    return JSON.stringify(spec, null, 2);
  }
  /**
   * Export specification as Markdown
   */
  exportSpecificationAsMarkdown() {
    const spec = this.generateSpecification();
    return `# Size Specification

## Version: ${spec.version}
## Generated: ${spec.generated.toISOString()}

## Current Configuration

- Base Size: ${spec.config.baseSize}px

## Available Presets

${spec.presets.map((p) => `- **${p.label}** (${p.name}): ${p.description || "No description"}`).join("\n")}

## CSS Variables

| Variable | Value | Usage |
|----------|-------|--------|
${Object.entries(spec.variables).map(([name, value]) => {
      const usage = this.usageMap.get(name) || 0;
      return `| ${name} | ${value} | ${usage} times |`;
    }).join("\n")}

## Usage Statistics

- Total Variables: ${spec.usage.variables.total}
- Used Variables: ${spec.usage.variables.used}
- Unused Variables: ${spec.usage.variables.unused.length}

### Most Used Variables

${spec.usage.variables.mostUsed.slice(0, 10).map((v, i) => `${i + 1}. ${v.name}: ${v.count} times`).join("\n")}
`;
  }
  /**
   * Setup performance observer
   */
  setupPerformanceObserver() {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;
    this.performanceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.debug("[SizeAnalyzer] Performance:", entry.name, entry.duration);
      }
    });
    this.performanceObserver.observe({
      entryTypes: ["measure", "navigation", "paint"]
    });
  }
  /**
   * Cleanup
   */
  destroy() {
    this.hideDebugPanel();
    if (this.debugPanel?.parentNode) {
      this.debugPanel.parentNode.removeChild(this.debugPanel);
    }
    this.debugPanel = null;
    if (this.panelStyleEl?.parentNode) {
      this.panelStyleEl.parentNode.removeChild(this.panelStyleEl);
    }
    this.panelStyleEl = null;
    if (this.variableObserver) {
      this.variableObserver.disconnect();
      this.variableObserver = null;
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.performanceObserver?.disconnect();
    this.usageMap.clear();
  }
}
let analyzer = null;
function getSizeAnalyzer() {
  if (!analyzer) {
    analyzer = new SizeAnalyzer();
  }
  return analyzer;
}
const analyze = {
  show: () => getSizeAnalyzer().showDebugPanel(),
  hide: () => getSizeAnalyzer().hideDebugPanel(),
  stats: () => getSizeAnalyzer().getUsageStats(),
  performance: () => getSizeAnalyzer().measurePerformance(),
  validate: () => getSizeAnalyzer().validateConsistency(),
  export: () => getSizeAnalyzer().exportSpecification(),
  exportMarkdown: () => getSizeAnalyzer().exportSpecificationAsMarkdown()
};

exports.SizeAnalyzer = SizeAnalyzer;
exports.analyze = analyze;
exports.getSizeAnalyzer = getSizeAnalyzer;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=SizeAnalyzer.cjs.map
