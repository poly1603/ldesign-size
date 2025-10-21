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

const DEFAULT_THEMES = {
  light: {
    name: "Light",
    baseSizeAdjustment: 0,
    spacingScale: 1,
    radiusScale: 1,
    lineHeightScale: 1
  },
  dark: {
    name: "Dark",
    baseSizeAdjustment: 0.5,
    // Slightly larger for better readability in dark mode
    spacingScale: 1.1,
    radiusScale: 1,
    lineHeightScale: 1.05,
    cssVariables: {
      "--size-shadow-strength": "0.2",
      "--size-border-strength": "0.8"
    }
  },
  "high-contrast": {
    name: "High Contrast",
    baseSizeAdjustment: 1,
    spacingScale: 1.2,
    radiusScale: 0.5,
    // Sharper edges
    lineHeightScale: 1.2,
    cssVariables: {
      "--size-border-width-base": "2px",
      "--size-font-weight-base": "500"
    }
  }
};
class ThemeManager {
  constructor(options = {}) {
    this.styleElement = null;
    this.mediaQuery = null;
    this.hcQuery = null;
    this.listeners = /* @__PURE__ */ new Set();
    this.mediaHandlers = [];
    this.isDestroyed = false;
    this.cssCache = /* @__PURE__ */ new WeakMap();
    this.generatedCSSCache = /* @__PURE__ */ new Map();
    this.maxCacheSize = 20;
    this.options = {
      defaultTheme: "light",
      autoDetect: true,
      storageKey: "ldesign-theme",
      ...options
    };
    this.themes = /* @__PURE__ */ new Map();
    const defaultEntries = Object.entries(DEFAULT_THEMES);
    defaultEntries.forEach(([key, config]) => {
      this.themes.set(key, Object.freeze(config));
    });
    if (options.themes) {
      const customEntries = Object.entries(options.themes);
      customEntries.forEach(([key, config]) => {
        this.themes.set(key, Object.freeze(config));
      });
    }
    this.currentTheme = this.detectInitialTheme();
    this.applyTheme(this.currentTheme);
    if (this.options.autoDetect) {
      this.setupAutoDetection();
    }
  }
  /**
   * Detect initial theme
   */
  detectInitialTheme() {
    if (typeof localStorage !== "undefined" && this.options.storageKey) {
      const stored = localStorage.getItem(this.options.storageKey);
      if (stored && this.themes.has(stored)) {
        return stored;
      }
    }
    if (this.options.defaultTheme === "auto" || this.options.autoDetect) {
      return this.getSystemTheme();
    }
    return this.options.defaultTheme || "light";
  }
  /**
   * Get system theme preference
   */
  getSystemTheme() {
    if (typeof window === "undefined") return "light";
    if (window.matchMedia("(prefers-contrast: high)").matches) {
      return "high-contrast";
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }
  /**
   * Setup auto detection for theme changes
   */
  setupAutoDetection() {
    if (typeof window === "undefined") return;
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const darkModeHandler = (e) => {
      if (!this.isDestroyed && (this.currentTheme === "auto" || this.options.autoDetect)) {
        requestAnimationFrame(() => {
          if (!this.isDestroyed) {
            this.setTheme(e.matches ? "dark" : "light");
          }
        });
      }
    };
    this.mediaQuery.addEventListener("change", darkModeHandler);
    this.mediaHandlers.push({
      query: this.mediaQuery,
      handler: darkModeHandler
    });
    this.hcQuery = window.matchMedia("(prefers-contrast: high)");
    const hcHandler = (e) => {
      if (!this.isDestroyed && e.matches && (this.currentTheme === "auto" || this.options.autoDetect)) {
        requestAnimationFrame(() => {
          if (!this.isDestroyed) {
            this.setTheme("high-contrast");
          }
        });
      }
    };
    this.hcQuery.addEventListener("change", hcHandler);
    this.mediaHandlers.push({
      query: this.hcQuery,
      handler: hcHandler
    });
  }
  /**
   * Set theme
   */
  setTheme(theme2) {
    if (theme2 === "auto") {
      theme2 = this.getSystemTheme();
    }
    if (!this.themes.has(theme2)) {
      console.warn(`Theme '${theme2}' not found, falling back to 'light'`);
      theme2 = "light";
    }
    this.currentTheme = theme2;
    this.applyTheme(theme2);
    this.saveToStorage();
    this.notifyListeners(theme2);
  }
  /**
   * Apply theme adjustments
   */
  applyTheme(theme2) {
    const config = this.themes.get(theme2);
    if (!config) return;
    let css = this.generatedCSSCache.get(theme2);
    if (!css) {
      css = this.generateThemeCSS(config);
      if (this.generatedCSSCache.size >= this.maxCacheSize) {
        const firstKey = this.generatedCSSCache.keys().next().value;
        if (firstKey) this.generatedCSSCache.delete(firstKey);
      }
      this.generatedCSSCache.set(theme2, css);
    }
    if (typeof document === "undefined") return;
    if (!this.styleElement) {
      this.styleElement = document.createElement("style");
      this.styleElement.id = "ldesign-theme-styles";
      document.head.appendChild(this.styleElement);
    }
    this.styleElement.textContent = css;
    const themeClasses = Array.from(this.themes.keys()).map((k) => `theme-${k}`);
    const classList = document.body.classList;
    classList.remove(...themeClasses);
    classList.add(`theme-${theme2}`);
    document.body.setAttribute("data-theme", theme2);
  }
  /**
   * Generate theme CSS
   */
  generateThemeCSS(config) {
    const cached = this.cssCache.get(config);
    if (cached) return cached;
    const vars = [];
    if (config.baseSizeAdjustment) {
      vars.push(`--size-theme-adjustment: ${config.baseSizeAdjustment}`);
    }
    if (config.spacingScale && config.spacingScale !== 1) {
      vars.push(`--size-spacing-scale: ${config.spacingScale}`);
    }
    if (config.radiusScale && config.radiusScale !== 1) {
      vars.push(`--size-radius-scale: ${config.radiusScale}`);
    }
    if (config.lineHeightScale && config.lineHeightScale !== 1) {
      vars.push(`--size-line-scale: ${config.lineHeightScale}`);
    }
    if (config.cssVariables) {
      for (const [key, value] of Object.entries(config.cssVariables)) {
        vars.push(`${key}: ${value}`);
      }
    }
    const cssVars = vars.map((v) => `        ${v};`).join("\n");
    const css = `
      :root,
      [data-theme="${this.currentTheme}"] {
${cssVars}
      }
      
      /* Theme-specific adjustments */
      .theme-${this.currentTheme} {
        /* Adjusted base calculations */
        --size-base-adjusted: calc(var(--size-base) + var(--size-theme-adjustment, 0) * 1px);
        
        /* Adjusted spacing with scale */
        --size-spacing-adjusted: calc(var(--size-spacing-md) * var(--size-spacing-scale, 1));
        
        /* Adjusted radius with scale */
        --size-radius-adjusted: calc(var(--size-radius-md) * var(--size-radius-scale, 1));
      }
    `.trim();
    this.cssCache.set(config, css);
    return css;
  }
  /**
   * Save theme to storage
   */
  saveToStorage() {
    if (typeof localStorage === "undefined" || !this.options.storageKey) return;
    try {
      localStorage.setItem(this.options.storageKey, this.currentTheme);
    } catch (e) {
      console.error("Failed to save theme:", e);
    }
  }
  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  }
  /**
   * Get theme config
   */
  getThemeConfig(theme2) {
    return this.themes.get(theme2 || this.currentTheme);
  }
  /**
   * Register custom theme
   */
  registerTheme(name, config) {
    this.themes.set(name, config);
  }
  /**
   * Get all available themes
   */
  getAvailableThemes() {
    return Array.from(this.themes.keys());
  }
  /**
   * Subscribe to theme changes
   */
  onChange(listener) {
    if (this.isDestroyed) {
      console.warn("Cannot add listener to destroyed ThemeManager");
      return () => {
      };
    }
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  /**
   * Notify listeners
   */
  notifyListeners(theme2) {
    if (this.isDestroyed) return;
    this.listeners.forEach((listener) => {
      try {
        listener(theme2);
      } catch (e) {
        console.error("Theme listener error:", e);
      }
    });
  }
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
  }
  /**
   * Destroy theme manager
   */
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    if (this.styleElement?.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }
    this.mediaHandlers.forEach(({
      query,
      handler
    }) => {
      try {
        query.removeEventListener("change", handler);
      } catch {
      }
    });
    this.mediaHandlers.length = 0;
    this.mediaQuery = null;
    this.hcQuery = null;
    if (typeof document !== "undefined" && document.body) {
      const themeClasses = Array.from(this.themes.keys()).map((k) => `theme-${k}`);
      document.body.classList.remove(...themeClasses);
      document.body.removeAttribute("data-theme");
    }
    this.listeners.clear();
    this.themes.clear();
    this.generatedCSSCache.clear();
  }
}
let themeManager = null;
function getThemeManager() {
  if (!themeManager) {
    themeManager = new ThemeManager();
  }
  return themeManager;
}
function destroyThemeManager() {
  if (themeManager) {
    themeManager.destroy();
    themeManager = null;
  }
}
const theme = {
  /**
   * Set theme
   */
  set: (t) => getThemeManager().setTheme(t),
  /**
   * Get current theme
   */
  get: () => getThemeManager().getTheme(),
  /**
   * Toggle theme
   */
  toggle: () => getThemeManager().toggleTheme(),
  /**
   * Register custom theme
   */
  register: (name, config) => getThemeManager().registerTheme(name, config),
  /**
   * Listen to theme changes
   */
  onChange: (fn) => getThemeManager().onChange(fn)
};

exports.ThemeManager = ThemeManager;
exports.destroyThemeManager = destroyThemeManager;
exports.getThemeManager = getThemeManager;
exports.theme = theme;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=ThemeManager.cjs.map
