/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
export { AccessibilityEnhancer, a11y, getAccessibilityEnhancer } from './core/AccessibilityEnhancer.js';
export { AnimationManager, animate, getAnimationManager } from './core/AnimationManager.js';
export { generateCSS, generateCSSString, generateCSSVariables, injectCSS, removeCSS } from './core/cssGenerator.js';
export { DEFAULT_BREAKPOINTS, DeviceDetector, device, getDeviceDetector } from './core/DeviceDetector.js';
export { FluidSizeCalculator, fluid, fluidTypographyPresets, getFluidSizeCalculator, modularScaleRatios } from './core/FluidSize.js';
export { Size, em, percent, px, rem, size, vh, vw } from './core/Size.js';
export { SizeManager, sizeManager } from './core/SizeManager.js';
export { ThemeManager, getThemeManager, theme } from './core/ThemeManager.js';
export { UnitStrategyManager, getUnitStrategyManager, units } from './core/UnitStrategy.js';
export { deDE, enUS, esES, frFR, getLocale, itIT, jaJP, koKR, locales, ptBR, ruRU, zhCN } from './locales/index.js';
export { SizePluginSymbol, createSizePlugin } from './plugin/index.js';
export { createSizeEnginePlugin, useSizeFromEngine } from './plugin/engine.js';
export { batchProcessSizes, memoize, optimizeCSSVariables, requestIdleCallback } from './utils/index.js';

const ai = new Proxy({}, {
  get(_, prop) {
    return async (...args) => {
      const module = await import('./core/AIOptimizer.js');
      return module.ai[prop](...args);
    };
  }
});
const getAIOptimizer = async () => {
  const module = await import('./core/AIOptimizer.js');
  return module.getAIOptimizer();
};
const AIOptimizer = new Proxy(class {
}, {
  construct: async (_, args) => {
    const module = await import('./core/AIOptimizer.js');
    return new module.AIOptimizer(...args);
  }
});
const analyze = new Proxy({}, {
  get(_, prop) {
    return async (...args) => {
      const module = await import('./core/SizeAnalyzer.js');
      return module.analyze[prop](...args);
    };
  }
});
const getSizeAnalyzer = async () => {
  const module = await import('./core/SizeAnalyzer.js');
  return module.getSizeAnalyzer();
};
const SizeAnalyzer = new Proxy(class {
}, {
  construct: async (_, args) => {
    const module = await import('./core/SizeAnalyzer.js');
    return new module.SizeAnalyzer(...args);
  }
});
const createMigrationGuide = async (...args) => {
  const module = await import('./core/SizeMigration.js');
  return module.createMigrationGuide(...args);
};
const detectFramework = async (...args) => {
  const module = await import('./core/SizeMigration.js');
  return module.detectFramework(...args);
};
const migrateFrom = async (...args) => {
  const module = await import('./core/SizeMigration.js');
  return module.migrateFrom(...args);
};
const SizeMigration = new Proxy(class {
}, {
  construct: async (_, args) => {
    const module = await import('./core/SizeMigration.js');
    return new module.SizeMigration(...args);
  }
});
const version = "2.0.0";

export { AIOptimizer, SizeAnalyzer, SizeMigration, ai, analyze, createMigrationGuide, detectFramework, getAIOptimizer, getSizeAnalyzer, migrateFrom, version };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
