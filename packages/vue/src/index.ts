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

// Component exports (TSX 组件)
export { default as SizePresetPicker } from './size-preset-picker'
export { default as SizeSwitcher } from './size-switcher'

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

