/**
 * @ldesign/size-svelte - Svelte 5 Size Management
 * 
 * Size management for Svelte 5 using runes
 */

// Stores exports
export {
  createSizeStore,
  getGlobalSizeStore,
  resetGlobalSizeStore,
  type SizeStore,
  type SizeStoreOptions
} from './stores'

// Components exports
export { default as SizeSelector } from './components/SizeSelector.svelte'

// Utils exports
export { isBrowser, storage } from './utils'

// Re-export commonly used core types
export type {
  SizeConfig,
  SizePreset,
  SizeManager,
  SizeChangeListener
} from '@ldesign/size-core'

// Version
export const version = '0.1.0'


