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

const DEFAULT_BREAKPOINTS = {
  xs: {
    name: "xs",
    min: 0,
    max: 575,
    unit: "px",
    device: "mobile"
  },
  sm: {
    name: "sm",
    min: 576,
    max: 767,
    unit: "px",
    device: "mobile"
  },
  md: {
    name: "md",
    min: 768,
    max: 991,
    unit: "px",
    device: "tablet"
  },
  lg: {
    name: "lg",
    min: 992,
    max: 1199,
    unit: "px",
    device: "laptop"
  },
  xl: {
    name: "xl",
    min: 1200,
    max: 1919,
    unit: "px",
    device: "desktop"
  },
  xxl: {
    name: "xxl",
    min: 1920,
    max: 2559,
    unit: "px",
    device: "desktop"
  },
  xxxl: {
    name: "xxxl",
    min: 2560,
    unit: "px",
    device: "widescreen"
  }
};
class DeviceDetector {
  constructor(breakpoints = DEFAULT_BREAKPOINTS) {
    this.listeners = /* @__PURE__ */ new Set();
    this.resizeObserver = null;
    this.mediaQueries = /* @__PURE__ */ new Map();
    this.mediaQueryHandlers = /* @__PURE__ */ new Map();
    this.resizeHandler = null;
    this.isDestroyed = false;
    this.resizeTimeout = null;
    this.observerTimeout = null;
    this.breakpoints = breakpoints;
    this.viewport = this.detectViewport();
    if (typeof window !== "undefined") {
      this.setupListeners();
      this.setupMediaQueries();
    }
  }
  /**
   * Detect current viewport information
   */
  detectViewport() {
    if (typeof window === "undefined") {
      return this.getDefaultViewport();
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
      width,
      height,
      device: this.getDeviceType(width),
      orientation: this.getDeviceOrientation(width, height),
      pixelRatio: window.devicePixelRatio || 1,
      touch: this.isTouchDevice()
    };
  }
  /**
   * Get device type based on width
   */
  getDeviceType(width) {
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    if (width < 1440) return "laptop";
    if (width < 1920) return "desktop";
    if (width < 2560) return "widescreen";
    return "tv";
  }
  /**
   * Get device orientation
   */
  getDeviceOrientation(width, height) {
    return width > height ? "landscape" : "portrait";
  }
  /**
   * Check if device supports touch
   */
  isTouchDevice() {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || // @ts-expect-error Safari-specific
    navigator.msMaxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
  }
  /**
   * Get default viewport for SSR
   */
  getDefaultViewport() {
    return {
      width: 1366,
      height: 768,
      device: "laptop",
      orientation: "landscape",
      pixelRatio: 1,
      touch: false
    };
  }
  /**
   * Setup viewport change listeners
   */
  setupListeners() {
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    let rafId = null;
    this.resizeHandler = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      if (newWidth === lastWidth && newHeight === lastHeight) {
        return;
      }
      lastWidth = newWidth;
      lastHeight = newHeight;
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      rafId = requestAnimationFrame(() => {
        this.resizeTimeout = setTimeout(() => {
          if (!this.isDestroyed) {
            this.updateViewport();
          }
          this.resizeTimeout = null;
          rafId = null;
        }, 100);
      });
    };
    window.addEventListener("resize", this.resizeHandler, {
      passive: true
    });
    window.addEventListener("orientationchange", this.resizeHandler, {
      passive: true
    });
    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.observerTimeout) {
          clearTimeout(this.observerTimeout);
        }
        this.observerTimeout = setTimeout(() => {
          if (!this.isDestroyed) {
            this.updateViewport();
          }
          this.observerTimeout = null;
        }, 50);
      });
      this.resizeObserver.observe(document.documentElement);
    }
  }
  /**
   * Setup media query listeners
   */
  setupMediaQueries() {
    Object.entries(this.breakpoints).forEach(([key, breakpoint]) => {
      if (!breakpoint) return;
      let query = "";
      if (breakpoint.min !== void 0 && breakpoint.max !== void 0) {
        query = `(min-width: ${breakpoint.min}${breakpoint.unit || "px"}) and (max-width: ${breakpoint.max}${breakpoint.unit || "px"})`;
      } else if (breakpoint.min !== void 0) {
        query = `(min-width: ${breakpoint.min}${breakpoint.unit || "px"})`;
      } else if (breakpoint.max !== void 0) {
        query = `(max-width: ${breakpoint.max}${breakpoint.unit || "px"})`;
      }
      if (query) {
        const mql = window.matchMedia(query);
        this.mediaQueries.set(key, mql);
        const handler = () => {
          this.updateViewport();
        };
        this.mediaQueryHandlers.set(key, handler);
        mql.addEventListener("change", handler);
      }
    });
  }
  /**
   * Update viewport information
   */
  updateViewport() {
    const newViewport = this.detectViewport();
    const hasChanged = this.viewport.width !== newViewport.width || this.viewport.height !== newViewport.height || this.viewport.device !== newViewport.device || this.viewport.orientation !== newViewport.orientation;
    if (hasChanged) {
      this.viewport = newViewport;
      queueMicrotask(() => this.notifyListeners());
    }
  }
  /**
   * Notify listeners of viewport changes
   */
  notifyListeners() {
    if (this.isDestroyed) return;
    const listenersArray = Array.from(this.listeners);
    for (const listener of listenersArray) {
      try {
        listener(this.viewport);
      } catch (error) {
        console.error("[DeviceDetector] Listener error:", error);
      }
    }
  }
  // 删除不再使用的debounce方法，直接在setupListeners中处理
  // ============================================
  // Public API
  // ============================================
  /**
   * Get current viewport
   */
  getViewport() {
    return {
      ...this.viewport
    };
  }
  /**
   * Get current device type
   */
  getDevice() {
    return this.viewport.device;
  }
  /**
   * Get current orientation
   */
  getOrientation() {
    return this.viewport.orientation;
  }
  /**
   * Check if viewport matches breakpoint
   */
  matchesBreakpoint(breakpoint) {
    const mql = this.mediaQueries.get(breakpoint);
    return mql ? mql.matches : false;
  }
  /**
   * Get active breakpoint
   */
  getActiveBreakpoint() {
    for (const [key, mql] of this.mediaQueries.entries()) {
      if (mql.matches) return key;
    }
    return null;
  }
  /**
   * Check if device is mobile
   */
  isMobile() {
    return this.viewport.device === "mobile";
  }
  /**
   * Check if device is tablet
   */
  isTablet() {
    return this.viewport.device === "tablet";
  }
  /**
   * Check if device is desktop
   */
  isDesktop() {
    return ["laptop", "desktop", "widescreen", "tv"].includes(this.viewport.device);
  }
  /**
   * Check if device supports touch
   */
  isTouch() {
    return this.viewport.touch;
  }
  /**
   * Check if device supports hover
   */
  supportsHover() {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(hover: hover)").matches;
  }
  /**
   * Get pixel density
   */
  getPixelRatio() {
    return this.viewport.pixelRatio;
  }
  /**
   * Check if high DPI screen
   */
  isRetina() {
    return this.viewport.pixelRatio >= 2;
  }
  /**
   * Subscribe to viewport changes
   */
  onChange(listener) {
    if (this.isDestroyed) {
      console.warn("DeviceDetector is destroyed");
      return () => {
      };
    }
    this.listeners.add(listener);
    return () => {
      if (!this.isDestroyed) {
        this.listeners.delete(listener);
      }
    };
  }
  /**
   * Get viewport size category
   */
  getSizeCategory() {
    const width = this.viewport.width;
    if (width < 768) return "small";
    if (width < 1200) return "medium";
    if (width < 1920) return "large";
    return "extra-large";
  }
  /**
   * Get recommended base font size
   */
  getBaseFontSize() {
    const device2 = this.viewport.device;
    const isHighDPI = this.isRetina();
    switch (device2) {
      case "mobile":
        return isHighDPI ? 16 : 14;
      case "tablet":
        return 16;
      case "laptop":
      case "desktop":
        return 16;
      case "widescreen":
      case "tv":
        return isHighDPI ? 18 : 16;
      default:
        return 16;
    }
  }
  /**
   * Get recommended touch target size
   */
  getTouchTargetSize() {
    if (!this.isTouch()) return 32;
    const device2 = this.viewport.device;
    switch (device2) {
      case "mobile":
        return 44;
      // iOS Human Interface Guidelines
      case "tablet":
        return 48;
      // Material Design
      default:
        return 44;
    }
  }
  /**
   * Destroy detector
   */
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    if (this.observerTimeout) {
      clearTimeout(this.observerTimeout);
      this.observerTimeout = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.resizeHandler && typeof window !== "undefined") {
      window.removeEventListener("resize", this.resizeHandler);
      window.removeEventListener("orientationchange", this.resizeHandler);
      this.resizeHandler = null;
    }
    this.mediaQueryHandlers.forEach((handler, key) => {
      const mql = this.mediaQueries.get(key);
      if (mql) {
        try {
          mql.removeEventListener("change", handler);
        } catch {
        }
      }
    });
    this.mediaQueryHandlers.clear();
    this.mediaQueries.clear();
    this.listeners.clear();
  }
}
let detector = null;
function getDeviceDetector() {
  if (!detector) {
    detector = new DeviceDetector();
  }
  return detector;
}
function destroyDeviceDetector() {
  if (detector) {
    detector.destroy();
    detector = null;
  }
}
const device = {
  get viewport() {
    return getDeviceDetector().getViewport();
  },
  get type() {
    return getDeviceDetector().getDevice();
  },
  get orientation() {
    return getDeviceDetector().getOrientation();
  },
  get isMobile() {
    return getDeviceDetector().isMobile();
  },
  get isTablet() {
    return getDeviceDetector().isTablet();
  },
  get isDesktop() {
    return getDeviceDetector().isDesktop();
  },
  get isTouch() {
    return getDeviceDetector().isTouch();
  },
  get isRetina() {
    return getDeviceDetector().isRetina();
  },
  get baseFontSize() {
    return getDeviceDetector().getBaseFontSize();
  }
};

exports.DEFAULT_BREAKPOINTS = DEFAULT_BREAKPOINTS;
exports.DeviceDetector = DeviceDetector;
exports.destroyDeviceDetector = destroyDeviceDetector;
exports.device = device;
exports.getDeviceDetector = getDeviceDetector;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=DeviceDetector.cjs.map
