/**
 * @ldesign/size-vue - Vue 3 Size Management
 * 
 * Vue 3 尺寸管理 - Composables、组件和插件
 */

// Plugin exports
export {
  createSizePlugin,
  SizePluginSymbol,
  type SizePlugin,
  type SizePluginOptions
} from './plugin'

// Engine integration
export {
  createSizeEnginePlugin,
  useSizeFromEngine,
  type SizeEnginePluginOptions
} from './plugin/engine'

// Composables exports
export { useSize } from './composables/useSize'

// Component exports
export { default as SizeSelector } from './components/SimpleSizeSelector.vue'

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

