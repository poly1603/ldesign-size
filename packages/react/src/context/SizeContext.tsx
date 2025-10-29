/**
 * @ldesign/size-react - Size Context
 * 
 * React Context for size management
 */

import { createContext } from 'react'
import type { SizeManager } from '@ldesign/size-core'

/**
 * Size Context
 * 
 * 提供 SizeManager 实例给子组件
 */
export const SizeContext = createContext<SizeManager | null>(null)

/**
 * Context display name for debugging
 */
SizeContext.displayName = 'SizeContext'

