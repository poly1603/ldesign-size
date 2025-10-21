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

var AccessibilityEnhancer = require('./core/AccessibilityEnhancer.cjs');
var AnimationManager = require('./core/AnimationManager.cjs');
var cssGenerator = require('./core/cssGenerator.cjs');
var DeviceDetector = require('./core/DeviceDetector.cjs');
var FluidSize = require('./core/FluidSize.cjs');
var Size = require('./core/Size.cjs');
var SizeManager = require('./core/SizeManager.cjs');
var ThemeManager = require('./core/ThemeManager.cjs');
var UnitStrategy = require('./core/UnitStrategy.cjs');
var index = require('./locales/index.cjs');
var index$1 = require('./plugin/index.cjs');
var engine = require('./plugin/engine.cjs');
var index$2 = require('./utils/index.cjs');

const ai = new Proxy({}, {
  get(_, prop) {
    return async (...args) => {
      const module = await Promise.resolve().then(function () { return require('./core/AIOptimizer.cjs'); });
      return module.ai[prop](...args);
    };
  }
});
const getAIOptimizer = async () => {
  const module = await Promise.resolve().then(function () { return require('./core/AIOptimizer.cjs'); });
  return module.getAIOptimizer();
};
const AIOptimizer = new Proxy(class {
}, {
  construct: async (_, args) => {
    const module = await Promise.resolve().then(function () { return require('./core/AIOptimizer.cjs'); });
    return new module.AIOptimizer(...args);
  }
});
const analyze = new Proxy({}, {
  get(_, prop) {
    return async (...args) => {
      const module = await Promise.resolve().then(function () { return require('./core/SizeAnalyzer.cjs'); });
      return module.analyze[prop](...args);
    };
  }
});
const getSizeAnalyzer = async () => {
  const module = await Promise.resolve().then(function () { return require('./core/SizeAnalyzer.cjs'); });
  return module.getSizeAnalyzer();
};
const SizeAnalyzer = new Proxy(class {
}, {
  construct: async (_, args) => {
    const module = await Promise.resolve().then(function () { return require('./core/SizeAnalyzer.cjs'); });
    return new module.SizeAnalyzer(...args);
  }
});
const createMigrationGuide = async (...args) => {
  const module = await Promise.resolve().then(function () { return require('./core/SizeMigration.cjs'); });
  return module.createMigrationGuide(...args);
};
const detectFramework = async (...args) => {
  const module = await Promise.resolve().then(function () { return require('./core/SizeMigration.cjs'); });
  return module.detectFramework(...args);
};
const migrateFrom = async (...args) => {
  const module = await Promise.resolve().then(function () { return require('./core/SizeMigration.cjs'); });
  return module.migrateFrom(...args);
};
const SizeMigration = new Proxy(class {
}, {
  construct: async (_, args) => {
    const module = await Promise.resolve().then(function () { return require('./core/SizeMigration.cjs'); });
    return new module.SizeMigration(...args);
  }
});
const version = "2.0.0";

exports.AccessibilityEnhancer = AccessibilityEnhancer.AccessibilityEnhancer;
exports.a11y = AccessibilityEnhancer.a11y;
exports.getAccessibilityEnhancer = AccessibilityEnhancer.getAccessibilityEnhancer;
exports.AnimationManager = AnimationManager.AnimationManager;
exports.animate = AnimationManager.animate;
exports.getAnimationManager = AnimationManager.getAnimationManager;
exports.generateCSS = cssGenerator.generateCSS;
exports.generateCSSString = cssGenerator.generateCSSString;
exports.generateCSSVariables = cssGenerator.generateCSSVariables;
exports.injectCSS = cssGenerator.injectCSS;
exports.removeCSS = cssGenerator.removeCSS;
exports.DEFAULT_BREAKPOINTS = DeviceDetector.DEFAULT_BREAKPOINTS;
exports.DeviceDetector = DeviceDetector.DeviceDetector;
exports.device = DeviceDetector.device;
exports.getDeviceDetector = DeviceDetector.getDeviceDetector;
exports.FluidSizeCalculator = FluidSize.FluidSizeCalculator;
exports.fluid = FluidSize.fluid;
exports.fluidTypographyPresets = FluidSize.fluidTypographyPresets;
exports.getFluidSizeCalculator = FluidSize.getFluidSizeCalculator;
exports.modularScaleRatios = FluidSize.modularScaleRatios;
exports.Size = Size.Size;
exports.em = Size.em;
exports.percent = Size.percent;
exports.px = Size.px;
exports.rem = Size.rem;
exports.size = Size.size;
exports.vh = Size.vh;
exports.vw = Size.vw;
exports.SizeManager = SizeManager.SizeManager;
exports.sizeManager = SizeManager.sizeManager;
exports.ThemeManager = ThemeManager.ThemeManager;
exports.getThemeManager = ThemeManager.getThemeManager;
exports.theme = ThemeManager.theme;
exports.UnitStrategyManager = UnitStrategy.UnitStrategyManager;
exports.getUnitStrategyManager = UnitStrategy.getUnitStrategyManager;
exports.units = UnitStrategy.units;
exports.deDE = index.deDE;
exports.enUS = index.enUS;
exports.esES = index.esES;
exports.frFR = index.frFR;
exports.getLocale = index.getLocale;
exports.itIT = index.itIT;
exports.jaJP = index.jaJP;
exports.koKR = index.koKR;
exports.locales = index.locales;
exports.ptBR = index.ptBR;
exports.ruRU = index.ruRU;
exports.zhCN = index.zhCN;
exports.SizePluginSymbol = index$1.SizePluginSymbol;
exports.createSizePlugin = index$1.createSizePlugin;
exports.createSizeEnginePlugin = engine.createSizeEnginePlugin;
exports.useSizeFromEngine = engine.useSizeFromEngine;
exports.batchProcessSizes = index$2.batchProcessSizes;
exports.memoize = index$2.memoize;
exports.optimizeCSSVariables = index$2.optimizeCSSVariables;
exports.requestIdleCallback = index$2.requestIdleCallback;
exports.AIOptimizer = AIOptimizer;
exports.SizeAnalyzer = SizeAnalyzer;
exports.SizeMigration = SizeMigration;
exports.ai = ai;
exports.analyze = analyze;
exports.createMigrationGuide = createMigrationGuide;
exports.detectFramework = detectFramework;
exports.getAIOptimizer = getAIOptimizer;
exports.getSizeAnalyzer = getSizeAnalyzer;
exports.migrateFrom = migrateFrom;
exports.version = version;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
