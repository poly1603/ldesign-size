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

class UnitStrategyManager {
  constructor() {
    this.strategies = /* @__PURE__ */ new Map();
    this.initializeDefaultStrategies();
  }
  /**
   * Initialize default strategies for different contexts
   */
  initializeDefaultStrategies() {
    this.strategies.set("font", {
      default: "rem",
      mobile: "rem",
      tablet: "rem",
      desktop: "rem",
      print: "pt",
      fallback: "px"
    });
    this.strategies.set("spacing", {
      default: "rem",
      mobile: "rem",
      tablet: "rem",
      desktop: "rem",
      print: "mm",
      fallback: "px"
    });
    this.strategies.set("layout", {
      default: "%",
      mobile: "vw",
      tablet: "%",
      desktop: "px",
      print: "cm",
      fallback: "px"
    });
    this.strategies.set("component", {
      default: "px",
      mobile: "px",
      tablet: "px",
      desktop: "px",
      print: "mm",
      fallback: "px"
    });
    this.strategies.set("border", {
      default: "px",
      mobile: "px",
      tablet: "px",
      desktop: "px",
      print: "pt",
      fallback: "px"
    });
    this.strategies.set("icon", {
      default: "em",
      mobile: "em",
      tablet: "em",
      desktop: "em",
      print: "pt",
      fallback: "px"
    });
  }
  /**
   * Get recommended unit for context
   */
  getRecommendedUnit(context) {
    const strategy = this.strategies.get(context.type) || this.getDefaultStrategy();
    const device = context.device || DeviceDetector.getDeviceDetector().getDevice();
    if (context.responsive) {
      return this.getResponsiveUnit(context.type, device);
    }
    let unit;
    switch (device) {
      case "mobile":
        unit = strategy.mobile;
        break;
      case "tablet":
        unit = strategy.tablet;
        break;
      case "laptop":
      case "desktop":
      case "widescreen":
      case "tv":
        unit = strategy.desktop;
        break;
    }
    return unit || strategy.default || strategy.fallback || "px";
  }
  /**
   * Get responsive unit for context
   */
  getResponsiveUnit(type, device) {
    switch (type) {
      case "font":
        return "rem";
      case "spacing":
        return device === "mobile" ? "vw" : "rem";
      case "layout":
        return device === "mobile" ? "vw" : "%";
      case "component":
        return device === "mobile" ? "vw" : "rem";
      default:
        return "rem";
    }
  }
  /**
   * Get default strategy
   */
  getDefaultStrategy() {
    return {
      default: "px",
      mobile: "px",
      tablet: "px",
      desktop: "px",
      print: "pt",
      fallback: "px"
    };
  }
  /**
   * Register custom strategy
   */
  registerStrategy(contextType, strategy) {
    this.strategies.set(contextType, strategy);
  }
  /**
   * Convert value between units with context awareness
   */
  convertWithContext(value, fromUnit, toContext, rootFontSize = 16) {
    const targetUnit = this.getRecommendedUnit(toContext);
    if (fromUnit === targetUnit) {
      return {
        value,
        unit: fromUnit
      };
    }
    let convertedValue = value;
    if (fromUnit === "px") {
      const viewport = DeviceDetector.getDeviceDetector().getViewport();
      switch (targetUnit) {
        case "rem":
          convertedValue = value / rootFontSize;
          break;
        case "em":
          convertedValue = value / rootFontSize;
          break;
        case "vw":
          convertedValue = value / viewport.width * 100;
          break;
        case "vh":
          convertedValue = value / viewport.height * 100;
          break;
        case "%":
          convertedValue = value / viewport.width * 100;
          break;
        case "pt":
          convertedValue = value * 0.75;
          break;
      }
    } else if (fromUnit === "rem") {
      const pxValue = value * rootFontSize;
      return this.convertWithContext(pxValue, "px", toContext, rootFontSize);
    }
    return {
      value: convertedValue,
      unit: targetUnit,
      context: toContext
    };
  }
  /**
   * Get best unit for accessibility
   */
  getAccessibleUnit(context) {
    switch (context.type) {
      case "font":
        return "rem";
      // Respects user font size preferences
      case "spacing":
        return "rem";
      // Scales with font size
      case "layout":
        return "%";
      // Flexible layout
      case "component":
        return "rem";
      // Scales with user preferences
      case "border":
        return "px";
      // Borders should be precise
      case "icon":
        return "em";
      // Scales with parent font size
      default:
        return "rem";
    }
  }
  /**
   * Check if unit is appropriate for context
   */
  isAppropriateUnit(unit, context) {
    const recommended = this.getRecommendedUnit(context);
    const accessible = this.getAccessibleUnit(context);
    if (unit === recommended || unit === accessible) {
      return true;
    }
    switch (context.type) {
      case "font":
        return !["px", "cm", "mm", "in"].includes(unit);
      case "border":
        return ["px", "pt"].includes(unit);
      case "layout":
        return !["px", "pt", "cm", "mm", "in"].includes(unit);
      default:
        return true;
    }
  }
  /**
   * Get unit recommendations for context
   */
  getRecommendations(context) {
    const recommended = this.getRecommendedUnit(context);
    const accessible = this.getAccessibleUnit(context);
    let alternatives = [];
    let avoid = [];
    switch (context.type) {
      case "font":
        alternatives = ["rem", "em", "%"];
        avoid = ["px", "cm", "mm", "in"];
        break;
      case "spacing":
        alternatives = ["rem", "em", "vw", "vh"];
        avoid = ["cm", "mm", "in", "pt"];
        break;
      case "layout":
        alternatives = ["%", "vw", "vh", "ch"];
        avoid = ["px", "pt", "cm", "mm", "in"];
        break;
      case "component":
        alternatives = ["rem", "em", "px"];
        avoid = ["cm", "mm", "in"];
        break;
      case "border":
        alternatives = ["px", "rem"];
        avoid = ["%", "vw", "vh"];
        break;
      case "icon":
        alternatives = ["em", "rem"];
        avoid = ["%", "vw", "vh"];
        break;
    }
    return {
      recommended,
      accessible,
      alternatives: alternatives.filter((u) => u !== recommended && u !== accessible),
      avoid
    };
  }
}
let manager = null;
function getUnitStrategyManager() {
  if (!manager) {
    manager = new UnitStrategyManager();
  }
  return manager;
}
const units = {
  /**
   * Get recommended unit for context
   */
  recommend: (context) => {
    return getUnitStrategyManager().getRecommendedUnit(context);
  },
  /**
   * Get accessible unit
   */
  accessible: (context) => {
    return getUnitStrategyManager().getAccessibleUnit(context);
  },
  /**
   * Check if unit is appropriate
   */
  isAppropriate: (unit, context) => {
    return getUnitStrategyManager().isAppropriateUnit(unit, context);
  },
  /**
   * Get all recommendations
   */
  getRecommendations: (context) => {
    return getUnitStrategyManager().getRecommendations(context);
  },
  /**
   * Convert with context
   */
  convert: (value, fromUnit, toContext) => {
    return getUnitStrategyManager().convertWithContext(value, fromUnit, toContext);
  }
};

exports.UnitStrategyManager = UnitStrategyManager;
exports.getUnitStrategyManager = getUnitStrategyManager;
exports.units = units;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=UnitStrategy.cjs.map
