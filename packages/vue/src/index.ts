/**
 * @ldesign/size-vue - Vue 3 Size Management
 *
 * Vue 3 尺寸管理 - Composables、组件和插件
 */

// Constants exports
export { SIZE_SYMBOL } from './constants'

// Plugin exports
export {
  createSizePlugin,
  SizePluginSymbol,
  type SizePlugin,
  type SizePluginOptions,
} from './plugin'

// Engine integration (新的完整实现)
export {
  createSizeEnginePlugin,
  useSizeFromEngine,
} from './plugins'
export type { SizeEnginePluginOptions } from './plugins'

// Composables exports
export { useSize } from './composables/useSize'
export {
  useSizeWatch,
  useSizeCalc,
  useSizeTransition,
  useSizeBreakpoint,
  useAutoSize,
  useSizePersistence
} from './composables/useSizeExtended'

// Component exports
// 注意：SizeSelector 和 SimpleSizeSelector 依赖 @ldesign/shared，暂时不导出
// export { default as SizeSelector } from './components/SimpleSizeSelector.vue'
// export { default as SimpleSizeSelector } from './components/SimpleSizeSelector.vue'
export { default as SizePresetPicker } from './components/SizePresetPicker.vue'
export { default as SizeSwitcher } from './components/SizeSwitcher.vue'
export { default as SizeProvider } from './components/SizeProvider.vue'
export { default as SizeDebugPanel } from './components/SizeDebugPanel.vue'

// Directives exports
export { vSize } from './directives'

// Re-export commonly used core types
export type {
  SizeConfig,
  SizePreset,
  SizeManager
} from '@ldesign/size-core'

// Default plugin (for Vue.use())
export { createSizePlugin as VueSizePlugin } from './plugin'

// Version
export const version = '0.1.0'

