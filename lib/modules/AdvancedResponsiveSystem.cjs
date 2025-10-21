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

var DeviceDetector = require('../core/DeviceDetector.cjs');

const containerQueryCleanups = /* @__PURE__ */ new WeakMap();
class AdvancedResponsiveSystem {
  constructor() {
    this.detector = DeviceDetector.getDeviceDetector();
    this.breakpoints = /* @__PURE__ */ new Map();
    this.activeBreakpoints = /* @__PURE__ */ new Set();
    this.containerObservers = /* @__PURE__ */ new Map();
    this.mediaQueries = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new WeakSet();
    this.listenerRefs = /* @__PURE__ */ new Set();
    this.layoutConfigs = /* @__PURE__ */ new Map();
    this.visibilityRules = /* @__PURE__ */ new Map();
    this.mediaQueryHandlers = /* @__PURE__ */ new Map();
    this.initializeDefaultBreakpoints();
    this.setupMediaQueryListeners();
  }
  /**
   * Initialize default breakpoints
   */
  initializeDefaultBreakpoints() {
    const defaults = [{
      name: "xs",
      query: "(max-width: 575px)",
      priority: 1,
      sizeModifiers: {
        scale: 0.875
      }
    }, {
      name: "sm",
      query: "(min-width: 576px) and (max-width: 767px)",
      priority: 2,
      sizeModifiers: {
        scale: 0.9
      }
    }, {
      name: "md",
      query: "(min-width: 768px) and (max-width: 991px)",
      priority: 3,
      sizeModifiers: {
        scale: 1
      }
    }, {
      name: "lg",
      query: "(min-width: 992px) and (max-width: 1199px)",
      priority: 4,
      sizeModifiers: {
        scale: 1
      }
    }, {
      name: "xl",
      query: "(min-width: 1200px) and (max-width: 1399px)",
      priority: 5,
      sizeModifiers: {
        scale: 1.1
      }
    }, {
      name: "xxl",
      query: "(min-width: 1400px)",
      priority: 6,
      sizeModifiers: {
        scale: 1.2
      }
    }];
    defaults.forEach((bp) => this.addBreakpoint(bp));
  }
  /**
   * Add custom breakpoint
   */
  addBreakpoint(breakpoint) {
    this.breakpoints.set(breakpoint.name, breakpoint);
    this.cleanupBreakpointHandler(breakpoint.name);
    if (typeof window !== "undefined") {
      const mql = window.matchMedia(breakpoint.query);
      this.mediaQueries.set(breakpoint.name, mql);
      const handler = (e) => {
        this.handleBreakpointChange(breakpoint.name, e.matches);
      };
      this.mediaQueryHandlers.set(breakpoint.name, handler);
      mql.addEventListener("change", handler);
      if (mql.matches) {
        this.activeBreakpoints.add(breakpoint.name);
      }
    }
  }
  /**
   * Remove breakpoint
   */
  removeBreakpoint(name) {
    this.breakpoints.delete(name);
    this.activeBreakpoints.delete(name);
    this.cleanupBreakpointHandler(name);
  }
  /**
   * Cleanup breakpoint handler
   */
  cleanupBreakpointHandler(name) {
    const mql = this.mediaQueries.get(name);
    const handler = this.mediaQueryHandlers.get(name);
    if (mql && handler) {
      mql.removeEventListener("change", handler);
    }
    this.mediaQueries.delete(name);
    this.mediaQueryHandlers.delete(name);
  }
  /**
   * Setup media query listeners
   */
  setupMediaQueryListeners() {
    this.breakpoints.forEach((breakpoint, name) => {
      const existing = this.mediaQueries.get(name);
      if (!existing && typeof window !== "undefined") {
        const mql = window.matchMedia(breakpoint.query);
        this.mediaQueries.set(name, mql);
        const handler = (e) => {
          this.handleBreakpointChange(name, e.matches);
        };
        this.mediaQueryHandlers.set(name, handler);
        mql.addEventListener("change", handler);
        if (mql.matches) {
          this.activeBreakpoints.add(name);
        }
      }
    });
  }
  /**
   * Handle breakpoint change
   */
  handleBreakpointChange(name, matches) {
    const wasActive = this.activeBreakpoints.has(name);
    if (matches && !wasActive) {
      this.activeBreakpoints.add(name);
      this.notifyListeners();
    } else if (!matches && wasActive) {
      this.activeBreakpoints.delete(name);
      this.notifyListeners();
    }
  }
  /**
   * Notify listeners of breakpoint changes
   */
  notifyListeners() {
    const active = this.getActiveBreakpoints();
    const deadRefs = [];
    this.listenerRefs.forEach((ref) => {
      const listener = ref.deref();
      if (listener && this.listeners.has(listener)) {
        listener(active);
      } else {
        deadRefs.push(ref);
      }
    });
    deadRefs.forEach((ref) => this.listenerRefs.delete(ref));
  }
  // ============================================
  // Container Queries
  // ============================================
  /**
   * Setup container query observer
   */
  setupContainerQuery(containerSelector, queries, callback) {
    if (typeof window === "undefined" || !("ResizeObserver" in window)) {
      return () => {
      };
    }
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.warn(`Container ${containerSelector} not found`);
      return () => {
      };
    }
    let currentMatch = null;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const match = queries.find((q) => {
          if (q.min !== void 0 && q.max !== void 0) {
            return width >= q.min && width <= q.max;
          }
          if (q.min !== void 0) {
            return width >= q.min;
          }
          if (q.max !== void 0) {
            return width <= q.max;
          }
          return false;
        });
        const newMatch = match?.name || null;
        if (newMatch !== currentMatch) {
          currentMatch = newMatch;
          callback(currentMatch);
        }
      }
    });
    observer.observe(container);
    this.containerObservers.set(containerSelector, observer);
    return () => {
      observer.disconnect();
      this.containerObservers.delete(containerSelector);
    };
  }
  /**
   * Apply container-based sizing
   */
  applyContainerSizing(element, containerQuery) {
    const cleanup = this.setupContainerQuery(containerQuery.container, containerQuery.breakpoints, (matchedQuery) => {
      if (matchedQuery) {
        const breakpoint = containerQuery.breakpoints.find((bp) => bp.name === matchedQuery);
        if (breakpoint?.sizeConfig) {
          Object.entries(breakpoint.sizeConfig).forEach(([prop, value]) => {
            if (typeof value === "number") {
              element.style.setProperty(prop, `${value}px`);
            } else {
              element.style.setProperty(prop, String(value));
            }
          });
        }
      }
    });
    if (!containerQueryCleanups.has(element)) {
      containerQueryCleanups.set(element, []);
    }
    containerQueryCleanups.get(element).push(cleanup);
  }
  // ============================================
  // Size Calculation
  // ============================================
  /**
   * Calculate responsive size
   */
  calculateResponsiveSize(config) {
    const activeBreakpoint = this.getActiveBreakpoint();
    if (!activeBreakpoint) {
      return config.base;
    }
    if (config.breakpoints && config.breakpoints[activeBreakpoint]) {
      return config.breakpoints[activeBreakpoint];
    }
    return this.applySizeStrategy(config, activeBreakpoint);
  }
  /**
   * Apply size strategy
   */
  applySizeStrategy(config, breakpoint) {
    const strategy = config.strategy || "fluid";
    const bp = this.breakpoints.get(breakpoint);
    const baseValue = typeof config.base === "number" ? config.base : 16;
    switch (strategy) {
      case "fluid":
        return {
          value: baseValue,
          unit: "px"
        };
      case "stepped":
        return {
          value: this.calculateSteppedSize(baseValue, bp),
          unit: "px"
        };
      case "adaptive":
        return {
          value: this.calculateAdaptiveSize(baseValue, bp),
          unit: "px"
        };
      case "elastic":
        return {
          value: baseValue,
          unit: "em"
        };
      case "hybrid":
        return {
          value: baseValue,
          unit: "px"
        };
      default:
        return config.base;
    }
  }
  /**
   * Calculate fluid size
   */
  calculateFluidSize(base, breakpoint) {
    const vw = this.detector.getViewport().width;
    const scale = breakpoint?.sizeModifiers?.scale || 1;
    const fluidValue = base * scale * (vw / 1200);
    return `clamp(${base * 0.75}px, ${fluidValue}px, ${base * 1.5}px)`;
  }
  /**
   * Calculate stepped size
   */
  calculateSteppedSize(base, breakpoint) {
    const scale = breakpoint?.sizeModifiers?.scale || 1;
    const stepped = Math.round(base * scale / 4) * 4;
    return stepped;
  }
  /**
   * Calculate adaptive size
   */
  calculateAdaptiveSize(base, breakpoint) {
    const viewport = this.detector.getViewport();
    const scale = breakpoint?.sizeModifiers?.scale || 1;
    let adaptive = base * scale;
    if (viewport.pixelRatio > 2) {
      adaptive *= 1.1;
    }
    if (viewport.touch) {
      adaptive *= 1.15;
    }
    return Math.round(adaptive);
  }
  /**
   * Calculate elastic size
   */
  calculateElasticSize(base, breakpoint) {
    const scale = breakpoint?.sizeModifiers?.scale || 1;
    const em = base / 16;
    return `${em * scale}em`;
  }
  /**
   * Calculate hybrid size
   */
  calculateHybridSize(config, breakpoint) {
    const base = typeof config.base === "number" ? config.base : 16;
    const scale = breakpoint?.sizeModifiers?.scale || 1;
    const vw = this.detector.getViewport().width;
    const stepped = Math.round(base * scale / 4) * 4;
    const fluid = base * scale * (vw / 1200);
    if (config.clamp) {
      const min = typeof config.clamp.min === "number" ? config.clamp.min : stepped * 0.75;
      const max = typeof config.clamp.max === "number" ? config.clamp.max : stepped * 1.5;
      const preferred = config.clamp.preferred || `${fluid}px`;
      return `clamp(${min}px, ${preferred}, ${max}px)`;
    }
    return `${fluid}px`;
  }
  // ============================================
  // Layout Management
  // ============================================
  /**
   * Create responsive layout
   */
  createResponsiveLayout(container, config) {
    this.layoutConfigs.set(container.id || "default", config);
    switch (config.type) {
      case "grid":
        this.applyGridLayout(container, config);
        break;
      case "flex":
        this.applyFlexLayout(container, config);
        break;
      case "columns":
        this.applyColumnsLayout(container, config);
        break;
      case "masonry":
        this.applyMasonryLayout(container, config);
        break;
    }
    if (config.responsive) {
      this.makeLayoutResponsive(container, config);
    }
  }
  /**
   * Apply grid layout
   */
  applyGridLayout(container, config) {
    container.style.display = "grid";
    if (config.columns === "auto") {
      container.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
    } else if (typeof config.columns === "number") {
      container.style.gridTemplateColumns = `repeat(${config.columns}, 1fr)`;
    }
    if (config.gap) {
      const gapValue = typeof config.gap === "number" ? `${config.gap}px` : String(config.gap);
      container.style.gap = gapValue;
    }
  }
  /**
   * Apply flex layout
   */
  applyFlexLayout(container, config) {
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    if (config.gap) {
      const gapValue = typeof config.gap === "number" ? `${config.gap}px` : String(config.gap);
      container.style.gap = gapValue;
    }
    if (config.itemSizing === "equal") {
      const children = container.children;
      Array.from(children).forEach((child) => {
        child.style.flex = "1 1 0";
      });
    }
  }
  /**
   * Apply columns layout
   */
  applyColumnsLayout(container, config) {
    if (typeof config.columns === "number") {
      container.style.columnCount = config.columns.toString();
    } else {
      container.style.columnWidth = "250px";
    }
    if (config.gap) {
      const gapValue = typeof config.gap === "number" ? `${config.gap}px` : String(config.gap);
      container.style.columnGap = gapValue;
    }
  }
  /**
   * Apply masonry layout
   */
  applyMasonryLayout(container, config) {
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${config.columns || "auto-fill"}, minmax(250px, 1fr))`;
    container.style.gridAutoRows = "10px";
    const children = container.children;
    Array.from(children).forEach((child) => {
      const element = child;
      const height = element.offsetHeight;
      const rowSpan = Math.ceil(height / 10);
      element.style.gridRowEnd = `span ${rowSpan}`;
    });
  }
  /**
   * Make layout responsive
   */
  makeLayoutResponsive(container, config) {
    const updateLayout = () => {
      const breakpoint = this.getActiveBreakpoint();
      const bp = breakpoint ? this.breakpoints.get(breakpoint) : void 0;
      if (bp?.layoutOverrides) {
        const merged = {
          ...config,
          ...bp.layoutOverrides
        };
        this.createResponsiveLayout(container, merged);
      }
    };
    updateLayout();
    this.onChange(() => {
      updateLayout();
    });
  }
  // ============================================
  // Visibility Management
  // ============================================
  /**
   * Set element visibility rules
   */
  setVisibilityRules(element, config) {
    const id = element.id || `element-${Date.now()}`;
    element.id = id;
    this.visibilityRules.set(id, config);
    this.updateElementVisibility(element, config);
    this.onChange(() => {
      this.updateElementVisibility(element, config);
    });
  }
  /**
   * Update element visibility
   */
  updateElementVisibility(element, config) {
    const activeBreakpoints = this.getActiveBreakpoints();
    const shouldShow = this.shouldShowElement(activeBreakpoints, config);
    if (config.transition) {
      element.style.transition = `opacity ${config.transition.duration}ms ${config.transition.easing}`;
    }
    if (shouldShow) {
      element.style.display = config.displayType || "block";
      setTimeout(() => {
        element.style.opacity = "1";
      }, 10);
    } else {
      element.style.opacity = "0";
      setTimeout(() => {
        element.style.display = "none";
      }, config.transition?.duration || 0);
    }
  }
  /**
   * Check if element should be shown
   */
  shouldShowElement(activeBreakpoints, config) {
    if (config.hideOn) {
      const shouldHide = config.hideOn.some((bp) => activeBreakpoints.includes(bp));
      if (shouldHide) return false;
    }
    if (config.showOn) {
      return config.showOn.some((bp) => activeBreakpoints.includes(bp));
    }
    return true;
  }
  // ============================================
  // Public API
  // ============================================
  /**
   * Get active breakpoints
   */
  getActiveBreakpoints() {
    return Array.from(this.activeBreakpoints).sort((a, b) => {
      const priorityA = this.breakpoints.get(a)?.priority || 0;
      const priorityB = this.breakpoints.get(b)?.priority || 0;
      return priorityA - priorityB;
    });
  }
  /**
   * Get active breakpoint (highest priority)
   */
  getActiveBreakpoint() {
    const active = this.getActiveBreakpoints();
    return active[active.length - 1] || null;
  }
  /**
   * Check if breakpoint is active
   */
  isBreakpointActive(name) {
    return this.activeBreakpoints.has(name);
  }
  /**
   * Subscribe to breakpoint changes
   */
  onChange(listener) {
    this.listeners.add(listener);
    const ref = typeof globalThis !== "undefined" && typeof globalThis.WeakRef !== "undefined" ? new globalThis.WeakRef(listener) : {
      deref: () => listener
    };
    this.listenerRefs.add(ref);
    return () => {
      this.listeners.delete(listener);
      this.listenerRefs.forEach((r) => {
        if (r.deref() === listener) {
          this.listenerRefs.delete(r);
        }
      });
    };
  }
  /**
   * Get CSS custom properties for current state
   */
  getCSSVariables() {
    const variables = {};
    const activeBreakpoint = this.getActiveBreakpoint();
    if (activeBreakpoint) {
      const bp = this.breakpoints.get(activeBreakpoint);
      if (bp?.sizeModifiers) {
        variables["--responsive-scale"] = bp.sizeModifiers.scale?.toString() || "1";
        if (bp.sizeModifiers.minSize) {
          variables["--responsive-min-size"] = `${bp.sizeModifiers.minSize}px`;
        }
        if (bp.sizeModifiers.maxSize) {
          variables["--responsive-max-size"] = `${bp.sizeModifiers.maxSize}px`;
        }
      }
    }
    variables["--active-breakpoint"] = activeBreakpoint || "none";
    variables["--viewport-width"] = `${this.detector.getViewport().width}px`;
    variables["--viewport-height"] = `${this.detector.getViewport().height}px`;
    return variables;
  }
  /**
   * Apply CSS variables to element
   */
  applyCSSVariables(element = document.documentElement) {
    const variables = this.getCSSVariables();
    Object.entries(variables).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });
  }
  /**
   * Destroy the system
   */
  destroy() {
    this.containerObservers.forEach((observer) => observer.disconnect());
    this.containerObservers.clear();
    this.mediaQueryHandlers.forEach((handler, name) => {
      const mql = this.mediaQueries.get(name);
      if (mql) {
        mql.removeEventListener("change", handler);
      }
    });
    this.mediaQueries.clear();
    this.mediaQueryHandlers.clear();
    this.breakpoints.clear();
    this.activeBreakpoints.clear();
    this.listenerRefs.clear();
    this.layoutConfigs.clear();
    this.visibilityRules.clear();
    if (typeof containerQueryCleanups.clear === "function") {
      containerQueryCleanups.clear();
    }
  }
}
function createResponsiveSystem() {
  return new AdvancedResponsiveSystem();
}
const responsive = createResponsiveSystem();

exports.AdvancedResponsiveSystem = AdvancedResponsiveSystem;
exports.createResponsiveSystem = createResponsiveSystem;
exports.responsive = responsive;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=AdvancedResponsiveSystem.cjs.map
