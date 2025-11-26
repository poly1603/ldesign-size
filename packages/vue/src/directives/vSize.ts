/**
 * @ldesign/size-vue - v-size 指令
 * 
 * 提供声明式的尺寸样式控制
 * 
 * @example
 * ```vue
 * <!-- 单一属性 -->
 * <div v-size:font="'large'">大字体文本</div>
 * <div v-size:spacing="'md'">中等间距</div>
 * 
 * <!-- 组合属性 -->
 * <div v-size="{ font: 'lg', spacing: 'md', radius: 'sm' }">组合样式</div>
 * 
 * <!-- 响应式绑定 -->
 * <div v-size:font="currentSize">动态字体</div>
 * ```
 */

import type { Directive, DirectiveBinding } from 'vue'

/**
 * 尺寸属性类型
 */
export type SizeProperty = 
  | 'font'        // 字体大小
  | 'spacing'     // 间距（padding）
  | 'margin'      // 外边距
  | 'radius'      // 圆角
  | 'width'       // 宽度
  | 'height'      // 高度
  | 'gap'         // 间隙（grid/flex）
  | 'border'      // 边框宽度

/**
 * 尺寸值对象
 */
export interface SizeValue {
  font?: string
  spacing?: string
  margin?: string
  radius?: string
  width?: string
  height?: string
  gap?: string
  border?: string
}

/**
 * 应用尺寸样式到元素
 */
function applySizeStyle(
  el: HTMLElement,
  property: SizeProperty,
  value: string
): void {
  const cssVarMap: Record<SizeProperty, string> = {
    font: 'fontSize',
    spacing: 'padding',
    margin: 'margin',
    radius: 'borderRadius',
    width: 'width',
    height: 'height',
    gap: 'gap',
    border: 'borderWidth'
  }

  const cssProperty = cssVarMap[property]
  const cssValue = `var(--size-${property}-${value})`

  el.style[cssProperty as any] = cssValue
}

/**
 * 移除尺寸样式
 */
function removeSizeStyle(
  el: HTMLElement,
  property: SizeProperty
): void {
  const cssVarMap: Record<SizeProperty, string> = {
    font: 'fontSize',
    spacing: 'padding',
    margin: 'margin',
    radius: 'borderRadius',
    width: 'width',
    height: 'height',
    gap: 'gap',
    border: 'borderWidth'
  }

  const cssProperty = cssVarMap[property]
  el.style[cssProperty as any] = ''
}

/**
 * v-size 指令实现
 */
export const vSize: Directive<HTMLElement, string | SizeValue> = {
  /**
   * 元素挂载时
   */
  mounted(el: HTMLElement, binding: DirectiveBinding<string | SizeValue>) {
    const { value, arg, modifiers } = binding

    // 单一属性模式: v-size:font="'large'"
    if (arg && typeof value === 'string') {
      applySizeStyle(el, arg as SizeProperty, value)
    }
    // 对象模式: v-size="{ font: 'lg', spacing: 'md' }"
    else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([property, val]) => {
        if (val) {
          applySizeStyle(el, property as SizeProperty, val as string)
        }
      })
    }

    // 处理修饰符
    if (modifiers.important) {
      // 添加 !important
      Object.keys(el.style).forEach(key => {
        const value = el.style[key as any]
        if (value && value.includes('var(--size-')) {
          el.style.setProperty(key, value, 'important')
        }
      })
    }
  },

  /**
   * 元素更新时
   */
  updated(el: HTMLElement, binding: DirectiveBinding<string | SizeValue>) {
    const { value, arg, oldValue } = binding

    // 如果值没变，不做处理
    if (value === oldValue) return

    // 单一属性模式
    if (arg && typeof value === 'string') {
      applySizeStyle(el, arg as SizeProperty, value)
    }
    // 对象模式
    else if (typeof value === 'object' && value !== null) {
      // 清除旧样式
      if (typeof oldValue === 'object' && oldValue !== null) {
        Object.keys(oldValue).forEach(property => {
          if (!(property in value)) {
            removeSizeStyle(el, property as SizeProperty)
          }
        })
      }

      // 应用新样式
      Object.entries(value).forEach(([property, val]) => {
        if (val) {
          applySizeStyle(el, property as SizeProperty, val as string)
        }
      })
    }
  },

  /**
   * 元素卸载前
   */
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding<string | SizeValue>) {
    const { value, arg } = binding

    // 清理样式
    if (arg) {
      removeSizeStyle(el, arg as SizeProperty)
    } else if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(property => {
        removeSizeStyle(el, property as SizeProperty)
      })
    }
  }
}

/**
 * 默认导出
 */
export default vSize