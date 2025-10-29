/**
 * @ldesign/size-react - React Size Management
 * 
 * React hooks, context, components, and HOC for size management
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

// HOC exports
export { withSize, type WithSizeProps } from './hoc'

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

