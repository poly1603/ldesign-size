/**
 * @ldesign/size - Plugin System
 *
 * Size system plugin for Vue 3 applications
 */
import type { App, ComputedRef, Ref } from 'vue';
import { SizeManager, type SizePreset } from '../core/SizeManager';
import { type SizeLocale } from '../locales';
/**
 * Size plugin configuration options
 */
export interface SizePluginOptions {
    /**
     * 语言设置 - 支持 string 或 Ref<string>
     * 如果传入 Ref，将直接使用（共享模式）
     * 如果传入 string 或不传，将创建新的 Ref（独立模式）
     */
    locale?: string | Ref<string>;
    /**
     * Initial size preset
     * @default 'default'
     */
    defaultSize?: string;
    /**
     * Available size presets
     */
    presets?: SizePreset[];
    /**
     * Storage key for persistence
     * @default 'ldesign-size'
     */
    storageKey?: string;
    /**
     * Enable size persistence
     * @default true
     */
    persistence?: boolean;
    /**
     * Custom storage adapter
     */
    storage?: {
        getItem: (key: string) => string | null | Promise<string | null>;
        setItem: (key: string, value: string) => void | Promise<void>;
        removeItem: (key: string) => void | Promise<void>;
    };
    /**
     * Hooks
     */
    hooks?: {
        beforeChange?: (newSize: string, oldSize: string) => boolean | Promise<boolean>;
        afterChange?: (newSize: string) => void | Promise<void>;
        onError?: (error: Error) => void;
    };
    /**
     * Default locale
     * @default 'zh-CN'
     */
    defaultLocale?: string;
    /**
     * Enable automatic detection based on device
     * @default false
     */
    autoDetect?: boolean;
    /**
     * Enable CSS variable generation
     * @default true
     */
    cssVariables?: boolean;
}
/**
 * Size plugin instance
 */
export interface SizePlugin {
    /**
     * Size manager instance
     */
    manager: SizeManager;
    /**
     * Plugin options
     */
    options: Required<Omit<SizePluginOptions, 'storage' | 'hooks'>> & {
        storage?: SizePluginOptions['storage'];
        hooks?: SizePluginOptions['hooks'];
    };
    /**
     * Current locale (reactive)
     */
    currentLocale: Ref<string>;
    /**
     * Current locale messages (computed)
     */
    localeMessages: ComputedRef<SizeLocale>;
    /**
     * Current size (reactive)
     */
    currentSize: Ref<string>;
    /**
     * Set size
     */
    setSize: (size: string) => Promise<void>;
    /**
     * Get current size
     */
    getSize: () => string;
    /**
     * Listen to size changes
     */
    onChange: (listener: (size: string) => void) => () => void;
    /**
     * Install the plugin
     */
    install: (app: App) => void;
    /**
     * Destroy the plugin and clean up resources
     */
    destroy: () => void;
}
/**
 * Symbol for plugin injection
 */
export declare const SizePluginSymbol: unique symbol;
/**
 * Create size plugin
 */
export declare function createSizePlugin(options?: SizePluginOptions): SizePlugin;
/**
 * Default export
 */
export default createSizePlugin;
