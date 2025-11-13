/**
 * Vue Size 常量定义
 * 
 * @module constants
 */

import type { InjectionKey } from 'vue'
import type { BaseSizeAdapter } from '@ldesign/size-core'

/**
 * Size 适配器注入键
 * 
 * 用于在 Vue 组件树中提供和注入 BaseSizeAdapter 实例
 */
export const SIZE_SYMBOL: InjectionKey<BaseSizeAdapter> = Symbol('size')

