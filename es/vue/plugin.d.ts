/**
 * @deprecated 请使用 '../plugin' 中的 createSizePlugin
 * This file is kept for backward compatibility only.
 * Please use createSizePlugin from '../plugin' instead.
 */
import type { Plugin } from 'vue';
import type { SizePluginOptions as NewSizePluginOptions } from '../plugin';
export type SizePluginOptions = NewSizePluginOptions;
export declare const SIZE_MANAGER_KEY: unique symbol;
export declare const SIZE_LOCALE_KEY: unique symbol;
export declare const SIZE_CUSTOM_LOCALE_KEY: unique symbol;
export declare const sizePlugin: Plugin;
