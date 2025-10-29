/**
 * @ldesign/size-solid - Size Context
 * 
 * Solid.js Context for size management
 */

import { createContext } from 'solid-js'
import type { SizeManager } from '@ldesign/size-core'

/**
 * Size Context
 * 
 * Provides SizeManager instance to child components
 */
export const SizeContext = createContext<SizeManager>()


