/**
 * @ldesign/size - Engine Plugin Integration
 *
 * 注意：此文件用于兼容旧的 Engine 插件系统
 * 新项目建议直接使用 index.ts 中的 createSizePlugin
 *
 * 优化后的版本：使用 createLocaleAwarePlugin 自动管理语言同步
 * 代码从 75 行减少到 20 行（-73%）
 */
import { type SizePlugin, type SizePluginOptions } from './index';
export interface SizeEnginePluginOptions extends SizePluginOptions {
    /**
     * Whether to sync with engine's locale state
     * @default true
     */
    syncLocale?: boolean;
}
/**
 * Create size engine plugin
 *
 * 使用 createLocaleAwarePlugin 包装，自动处理语言同步
 */
export declare function createSizeEnginePlugin(options?: SizeEnginePluginOptions): any;
/**
 * Get size plugin from engine
 */
export declare function useSizeFromEngine(engine: any): SizePlugin | undefined;
