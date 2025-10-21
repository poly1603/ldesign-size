/**
 * @ldesign/size - Utility Functions
 */
import type { SizeInput, SizeUnit, SizeValue } from '../types';
/**
 * Parse size input to SizeValue
 */
export declare function parseSizeInput(input: SizeInput): SizeValue;
/**
 * Format SizeValue to string
 */
export declare function formatSize(size: SizeValue): string;
/**
 * Convert size between units
 */
export declare function convertSize(size: SizeValue, targetUnit: SizeUnit, rootFontSize?: number): SizeValue;
/**
 * Scale a size by a factor
 */
export declare function scaleSize(size: SizeValue, factor: number): SizeValue;
/**
 * Add two sizes (must be same unit or convertible)
 */
export declare function addSizes(a: SizeValue, b: SizeValue, rootFontSize?: number): SizeValue;
/**
 * Subtract two sizes
 */
export declare function subtractSizes(a: SizeValue, b: SizeValue, rootFontSize?: number): SizeValue;
/**
 * Clamp a size value between min and max
 */
export declare function clampSize(size: SizeValue, min?: SizeInput, max?: SizeInput, rootFontSize?: number): SizeValue;
/**
 * Round size value to specified precision
 */
export declare function roundSize(size: SizeValue, precision?: number): SizeValue;
/**
 * Generate a size scale
 */
export declare function generateSizeScale(base: number, ratio: number, steps: number, unit?: SizeUnit): SizeValue[];
/**
 * Check if a size is valid
 */
export declare function isValidSize(input: any): input is SizeInput;
/**
 * Get CSS custom property name
 */
export declare function getCSSVarName(name: string, prefix?: string): string;
/**
 * Generate CSS value with fallback
 */
export declare function cssVar(name: string, fallback?: string): string;
/**
 * Deep merge objects
 */
export declare function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T;
export declare function memoize<T extends (...args: any[]) => any>(fn: T, getKey?: (...args: Parameters<T>) => string, maxCacheSize?: number): T;
/**
 * Batch process size values for performance
 */
export declare function batchProcessSizes<T>(items: T[], processor: (item: T) => void, _batchSize?: number): Promise<void>;
/**
 * Request idle callback polyfill
 */
export declare const requestIdleCallback: ((callback: IdleRequestCallback, options?: IdleRequestOptions) => number) & typeof globalThis.requestIdleCallback;
export * from './benchmark';
export * from './lazyLoader';
export * from './memoryOptimizer';
export * from './performanceDiagnostics';
/**
 * Optimize CSS variable generation with deduplication
 */
export declare function optimizeCSSVariables(variables: Record<string, string>): Record<string, string>;
/**
 * Throttle function execution
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T;
/**
 * Debounce function execution
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T;
