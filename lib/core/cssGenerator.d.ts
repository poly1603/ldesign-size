/**
 * @ldesign/size - CSS Variable Generator
 *
 * Generates CSS custom properties from size schemes
 */
import type { CSSVariableOptions, GeneratedCSS, SizeScheme } from '../types';
/**
 * Generate CSS variables from size scheme
 */
export declare function generateCSSVariables(scheme: SizeScheme, options?: CSSVariableOptions): Record<string, string>;
/**
 * Generate CSS string from variables
 */
export declare function generateCSSString(variables: Record<string, string>, options?: CSSVariableOptions): string;
/**
 * Generate complete CSS with utilities
 */
export declare function generateCSS(scheme: SizeScheme, options?: CSSVariableOptions): GeneratedCSS;
/**
 * Inject CSS into document
 */
export declare function injectCSS(css: string, id?: string): void;
/**
 * Remove injected CSS
 */
export declare function removeCSS(id?: string): void;
