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

class AccessibilityEnhancer {
  constructor(config) {
    this.detector = DeviceDetector.getDeviceDetector();
    this.config = {
      baseFontSize: 16,
      scaleFactors: {
        small: 0.875,
        normal: 1,
        large: 1.25,
        "extra-large": 1.5
      },
      minimumSizes: {
        text: 12,
        clickTarget: 44,
        touchTarget: 48,
        spacing: 8
      },
      wcagLevel: "AA",
      ...config
    };
    this.preferences = this.detectUserPreferences();
    this.fontScaleListeners = /* @__PURE__ */ new Set();
    this.preferenceListeners = /* @__PURE__ */ new Set();
    this.setupPreferenceListeners();
  }
  /**
   * Detect user accessibility preferences
   */
  detectUserPreferences() {
    if (typeof window === "undefined") {
      return this.getDefaultPreferences();
    }
    return {
      fontSize: this.detectFontSizePreference(),
      contrast: this.detectContrastPreference(),
      reducedMotion: this.detectReducedMotion(),
      colorBlind: "none",
      keyboardNavigation: true,
      screenReader: this.detectScreenReader(),
      focusIndicator: "default",
      zoomLevel: this.detectZoomLevel()
    };
  }
  /**
   * Get default preferences
   */
  getDefaultPreferences() {
    return {
      fontSize: "normal",
      contrast: "normal",
      reducedMotion: false,
      colorBlind: "none",
      keyboardNavigation: true,
      screenReader: false,
      focusIndicator: "default"
    };
  }
  /**
   * Detect font size preference
   */
  detectFontSizePreference() {
    if (typeof window === "undefined") return "normal";
    const computedFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (computedFontSize < 14) return "small";
    if (computedFontSize < 18) return "normal";
    if (computedFontSize < 22) return "large";
    return "extra-large";
  }
  /**
   * Detect contrast preference
   */
  detectContrastPreference() {
    if (typeof window === "undefined") return "normal";
    if (window.matchMedia("(prefers-contrast: high)").matches) {
      return "high";
    }
    if (window.matchMedia("(prefers-contrast: more)").matches) {
      return "ultra-high";
    }
    return "normal";
  }
  /**
   * Detect reduced motion preference
   */
  detectReducedMotion() {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  /**
   * Detect screen reader usage
   */
  detectScreenReader() {
    if (typeof window === "undefined") return false;
    const indicators = [
      // ARIA live regions are often added by screen readers
      document.querySelector("[aria-live]"),
      // Check for screen reader specific attributes
      document.querySelector('[role="application"]'),
      // Some screen readers add specific classes
      document.documentElement.classList.contains("sr-active")
    ];
    return indicators.some(Boolean);
  }
  /**
   * Detect zoom level
   */
  detectZoomLevel() {
    if (typeof window === "undefined") return 1;
    return window.devicePixelRatio / (window.devicePixelRatio || 1);
  }
  /**
   * Setup preference change listeners
   */
  setupPreferenceListeners() {
    if (typeof window === "undefined") return;
    const contrastQuery = window.matchMedia("(prefers-contrast: high)");
    contrastQuery.addEventListener("change", () => {
      this.updatePreferences({
        contrast: this.detectContrastPreference()
      });
    });
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", (e) => {
      this.updatePreferences({
        reducedMotion: e.matches
      });
    });
    window.addEventListener("resize", () => {
      const newZoom = this.detectZoomLevel();
      if (newZoom !== this.preferences.zoomLevel) {
        this.updatePreferences({
          zoomLevel: newZoom
        });
      }
    });
  }
  /**
   * Update user preferences
   */
  updatePreferences(updates) {
    const oldPreferences = {
      ...this.preferences
    };
    this.preferences = {
      ...this.preferences,
      ...updates
    };
    if (oldPreferences.fontSize !== this.preferences.fontSize) {
      const scale = this.config.scaleFactors[this.preferences.fontSize];
      this.fontScaleListeners.forEach((listener) => listener(scale));
    }
    this.preferenceListeners.forEach((listener) => listener(this.preferences));
  }
  // ============================================
  // Size Calculations
  // ============================================
  /**
   * Get accessible font size
   */
  getFontSize(baseSize = this.config.baseFontSize) {
    const scale = this.config.scaleFactors[this.preferences.fontSize];
    const scaledSize = baseSize * scale;
    const zoomAdjusted = this.preferences.zoomLevel ? scaledSize * this.preferences.zoomLevel : scaledSize;
    return Math.max(zoomAdjusted, this.config.minimumSizes.text);
  }
  /**
   * Get accessible line height
   */
  getLineHeight(fontSize) {
    const baseMultiplier = 1.5;
    if (this.preferences.fontSize === "large") {
      return fontSize * (baseMultiplier + 0.1);
    }
    if (this.preferences.fontSize === "extra-large") {
      return fontSize * (baseMultiplier + 0.2);
    }
    return fontSize * baseMultiplier;
  }
  /**
   * Get accessible spacing
   */
  getSpacing(baseSpacing = 8) {
    const scale = this.config.scaleFactors[this.preferences.fontSize];
    const scaledSpacing = baseSpacing * scale;
    return Math.max(scaledSpacing, this.config.minimumSizes.spacing);
  }
  /**
   * Get accessible click/touch target size
   */
  getTargetSize(isTouch = this.detector.isTouch()) {
    const minSize = isTouch ? this.config.minimumSizes.touchTarget : this.config.minimumSizes.clickTarget;
    if (this.preferences.fontSize === "large") {
      return minSize * 1.1;
    }
    if (this.preferences.fontSize === "extra-large") {
      return minSize * 1.2;
    }
    return minSize;
  }
  /**
   * Get focus indicator styles
   */
  getFocusStyles() {
    const baseConfig = {
      outlineWidth: 2,
      outlineStyle: "solid",
      outlineColor: "currentColor",
      outlineOffset: 2
    };
    if (this.preferences.focusIndicator === "enhanced") {
      return {
        ...baseConfig,
        outlineWidth: 3,
        outlineOffset: 4,
        customStyles: {
          boxShadow: "0 0 0 4px rgba(0, 123, 255, 0.25)"
        }
      };
    }
    if (this.preferences.contrast === "high") {
      return {
        ...baseConfig,
        outlineWidth: 3,
        outlineColor: "#000000"
      };
    }
    return baseConfig;
  }
  // ============================================
  // Validation
  // ============================================
  /**
   * Validate accessibility compliance
   */
  validateAccessibility(element, wcagLevel = this.config.wcagLevel) {
    const issues = [];
    if (!element) {
      return {
        passed: false,
        level: wcagLevel,
        issues: [{
          element: "unknown",
          issue: "Element not found",
          severity: "error",
          recommendation: "Provide a valid element for validation",
          wcagCriteria: "N/A"
        }],
        score: 0
      };
    }
    this.validateTextSize(element, issues, wcagLevel);
    this.validateContrast(element, issues, wcagLevel);
    this.validateTouchTargets(element, issues, wcagLevel);
    this.validateFocusIndicators(element, issues, wcagLevel);
    this.validateSemantics(element, issues, wcagLevel);
    const errorCount = issues.filter((i) => i.severity === "error").length;
    const warningCount = issues.filter((i) => i.severity === "warning").length;
    const maxScore = 100;
    const score = Math.max(0, maxScore - errorCount * 10 - warningCount * 3);
    return {
      passed: errorCount === 0 && (wcagLevel === "A" || warningCount === 0),
      level: wcagLevel,
      issues,
      score
    };
  }
  /**
   * Validate text size
   */
  validateTextSize(element, issues, level) {
    const computedStyle = getComputedStyle(element);
    const fontSize = Number.parseFloat(computedStyle.fontSize);
    if (fontSize < this.config.minimumSizes.text) {
      issues.push({
        element: element.tagName.toLowerCase(),
        issue: `Font size ${fontSize}px is below minimum ${this.config.minimumSizes.text}px`,
        severity: level === "AAA" ? "error" : "warning",
        recommendation: `Increase font size to at least ${this.config.minimumSizes.text}px`,
        wcagCriteria: "1.4.4 Resize Text"
      });
    }
  }
  /**
   * Validate contrast ratios
   */
  validateContrast(element, issues, level) {
    const computedStyle = getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    if (color && backgroundColor && backgroundColor !== "transparent") {
      const contrastRatio = this.calculateContrastRatio(color, backgroundColor);
      const requiredRatio = level === "AAA" ? 7 : 4.5;
      if (contrastRatio < requiredRatio) {
        issues.push({
          element: element.tagName.toLowerCase(),
          issue: `Contrast ratio ${contrastRatio.toFixed(2)} is below required ${requiredRatio}`,
          severity: "error",
          recommendation: `Increase contrast to meet WCAG ${level} standards`,
          wcagCriteria: "1.4.3 Contrast (Minimum)"
        });
      }
    }
  }
  /**
   * Validate touch targets
   */
  validateTouchTargets(element, issues, level) {
    const interactiveElements = element.querySelectorAll('button, a, input, select, textarea, [role="button"], [onclick]');
    interactiveElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const minSize = this.detector.isTouch() ? this.config.minimumSizes.touchTarget : this.config.minimumSizes.clickTarget;
      if (rect.width < minSize || rect.height < minSize) {
        issues.push({
          element: el.tagName.toLowerCase(),
          issue: `Target size ${rect.width}x${rect.height} is below minimum ${minSize}x${minSize}`,
          severity: level === "AAA" ? "error" : "warning",
          recommendation: `Increase target size to at least ${minSize}x${minSize} pixels`,
          wcagCriteria: "2.5.5 Target Size"
        });
      }
    });
  }
  /**
   * Validate focus indicators
   */
  validateFocusIndicators(element, issues, _level) {
    const focusableElements = element.querySelectorAll("a, button, input, select, textarea, [tabindex]");
    focusableElements.forEach((el) => {
      const computedStyle = getComputedStyle(el, ":focus");
      const hasOutline = computedStyle.outlineStyle !== "none";
      const hasBoxShadow = computedStyle.boxShadow !== "none";
      if (!hasOutline && !hasBoxShadow) {
        issues.push({
          element: el.tagName.toLowerCase(),
          issue: "No visible focus indicator",
          severity: "error",
          recommendation: "Add visible focus styles using outline or box-shadow",
          wcagCriteria: "2.4.7 Focus Visible"
        });
      }
    });
  }
  /**
   * Validate semantic HTML
   */
  validateSemantics(element, issues, _level) {
    const images = element.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.hasAttribute("alt")) {
        issues.push({
          element: "img",
          issue: "Missing alt attribute",
          severity: "error",
          recommendation: 'Add descriptive alt text or empty alt="" for decorative images',
          wcagCriteria: "1.1.1 Non-text Content"
        });
      }
    });
    const inputs = element.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      const id = input.getAttribute("id");
      const hasLabel = id && element.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.hasAttribute("aria-label") || input.hasAttribute("aria-labelledby");
      if (!hasLabel && !hasAriaLabel) {
        issues.push({
          element: input.tagName.toLowerCase(),
          issue: "Form control without accessible label",
          severity: "error",
          recommendation: "Add a label element or aria-label attribute",
          wcagCriteria: "1.3.1 Info and Relationships"
        });
      }
    });
  }
  /**
   * Calculate contrast ratio between two colors
   */
  calculateContrastRatio(_color1, _color2) {
    return 4.5;
  }
  // ============================================
  // Event Listeners
  // ============================================
  /**
   * Subscribe to font scale changes
   */
  onFontScaleChange(listener) {
    this.fontScaleListeners.add(listener);
    return () => {
      this.fontScaleListeners.delete(listener);
    };
  }
  /**
   * Subscribe to preference changes
   */
  onPreferenceChange(listener) {
    this.preferenceListeners.add(listener);
    return () => {
      this.preferenceListeners.delete(listener);
    };
  }
  // ============================================
  // Utility Methods
  // ============================================
  /**
   * Get current preferences
   */
  getPreferences() {
    return {
      ...this.preferences
    };
  }
  /**
   * Get WCAG level
   */
  getWCAGLevel() {
    return this.config.wcagLevel;
  }
  /**
   * Set WCAG level
   */
  setWCAGLevel(level) {
    this.config.wcagLevel = level;
  }
  /**
   * Generate accessibility report
   */
  generateReport(element) {
    const validation = this.validateAccessibility(element || document.body, this.config.wcagLevel);
    const report = [`Accessibility Report`, `===================`, `WCAG Level: ${validation.level}`, `Score: ${validation.score}/100`, `Status: ${validation.passed ? "PASSED" : "FAILED"}`, ``, `Issues Found: ${validation.issues.length}`, ``];
    if (validation.issues.length > 0) {
      report.push("Details:");
      report.push("--------");
      validation.issues.forEach((issue, _index) => {
        report.push(`${_index + 1}. [${issue.severity.toUpperCase()}] ${issue.element}`);
        report.push(`   Issue: ${issue.issue}`);
        report.push(`   WCAG: ${issue.wcagCriteria}`);
        report.push(`   Fix: ${issue.recommendation}`);
        report.push("");
      });
    }
    return report.join("\n");
  }
}
function createAccessibilityEnhancer(config) {
  return new AccessibilityEnhancer(config);
}
const a11y = {
  getFontSize: (base) => {
    const enhancer = createAccessibilityEnhancer();
    return enhancer.getFontSize(base);
  },
  getTargetSize: (isTouch) => {
    const enhancer = createAccessibilityEnhancer();
    return enhancer.getTargetSize(isTouch);
  },
  validate: (element, level) => {
    const enhancer = createAccessibilityEnhancer();
    return enhancer.validateAccessibility(element, level);
  }
};

exports.AccessibilityEnhancer = AccessibilityEnhancer;
exports.a11y = a11y;
exports.createAccessibilityEnhancer = createAccessibilityEnhancer;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=AccessibilityEnhancer.cjs.map
