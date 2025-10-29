/**
 * @ldesign/size-solid - Solid.js Size Management
 * 
 * Size management for Solid.js using signals and context
 */

// Context exports
export { SizeContext, SizeProvider, type SizeProviderProps } from './context'

// Hooks exports
export {
  useSize,
  useSizeConfig,
  useSizePresets,
  type UseSizeReturn,
  type UseSizeConfigReturn,
  type UseSizePresetsReturn
} from './hooks'

// Component exports
export {
  SizeSelector,
  SizeControlPanel,
  type SizeSelectorProps,
  type SizeControlPanelProps
} from './components'

// Re-export commonly used core types
export type {
  SizeConfig,
  SizePreset,
  SizeManager,
  SizeChangeListener
} from '@ldesign/size-core'

// Version
export const version = '0.1.0'


