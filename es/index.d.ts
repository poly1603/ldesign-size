/**
 * @ldesign/size - A powerful size management system for web applications
 */
export { a11y, AccessibilityEnhancer, type ColorBlindnessType, type ComplianceReport, type ContrastRatio, getAccessibilityEnhancer, type WCAGLevel } from './core/AccessibilityEnhancer';
export type { AIOptimizerConfig, OptimizationSuggestion, PageContext, ReadabilityOptions } from './core/AIOptimizer';
export declare const ai: Record<string, (...args: unknown[]) => Promise<unknown>>;
export declare const getAIOptimizer: () => Promise<import("./core/AIOptimizer").AIOptimizer>;
export declare const AIOptimizer: new (...args: unknown[]) => unknown;
export { animate, AnimationManager, type AnimationOptions, getAnimationManager } from './core/AnimationManager';
export { generateCSS, generateCSSString, generateCSSVariables, injectCSS, removeCSS } from './core/cssGenerator';
export { DEFAULT_BREAKPOINTS, device, DeviceDetector, getDeviceDetector } from './core/DeviceDetector';
export { fluid, FluidSizeCalculator, fluidTypographyPresets, getFluidSizeCalculator, modularScaleRatios } from './core/FluidSize';
export { em, percent, px, rem, Size, size, vh, vw } from './core/Size';
export type { PerformanceMetrics, SizeSpecDoc, SizeUsageReport, ValidationReport } from './core/SizeAnalyzer';
export declare const analyze: Record<string, (...args: unknown[]) => Promise<unknown>>;
export declare const getSizeAnalyzer: () => Promise<import("./core/SizeAnalyzer").SizeAnalyzer>;
export declare const SizeAnalyzer: new (...args: unknown[]) => unknown;
export { type SizeChangeListener, type SizeConfig, SizeManager, sizeManager, type SizePreset } from './core/SizeManager';
export type { Framework, MigrationConfig, MigrationReport } from './core/SizeMigration';
export declare const createMigrationGuide: (...args: unknown[]) => Promise<unknown>;
export declare const detectFramework: (...args: unknown[]) => Promise<unknown>;
export declare const migrateFrom: (...args: unknown[]) => Promise<unknown>;
export declare const SizeMigration: new (...args: unknown[]) => unknown;
export { getThemeManager, theme, type Theme, type ThemeConfig, ThemeManager, type ThemeManagerOptions } from './core/ThemeManager';
export { getUnitStrategyManager, units, UnitStrategyManager } from './core/UnitStrategy';
export { deDE, enUS, esES, frFR, getLocale, itIT, jaJP, koKR, locales, ptBR, ruRU, zhCN } from './locales';
export type { LocaleKey, SizeLocale } from './locales';
export { createSizePlugin, SizePluginSymbol } from './plugin';
export type { SizePlugin, SizePluginOptions } from './plugin';
export { createSizeEnginePlugin, useSizeFromEngine } from './plugin/engine';
export type { SizeEnginePluginOptions } from './plugin/engine';
export { batchProcessSizes, memoize, optimizeCSSVariables, requestIdleCallback } from './utils';
export declare const version = "2.0.0";
