/**
 * @ldesign/size-react - withSize HOC
 * 
 * Higher-Order Component for size management
 */

import React from 'react'
import { useSize, type UseSizeReturn } from '../hooks/useSize'

/**
 * Size Props Interface
 * 
 * Props that will be injected by withSize HOC
 */
export interface WithSizeProps {
  size: UseSizeReturn
}

/**
 * withSize HOC
 * 
 * 高阶组件，为组件注入 size 属性
 * 
 * @param Component - 要包装的组件
 * @returns 包装后的组件
 * 
 * @example
 * ```tsx
 * interface MyComponentProps extends WithSizeProps {
 *   title: string
 * }
 * 
 * function MyComponent({ title, size }: MyComponentProps) {
 *   return (
 *     <div>
 *       <h1>{title}</h1>
 *       <p>Current size: {size.currentPreset}</p>
 *       <button onClick={() => size.applyPreset('large')}>
 *         Set Large
 *       </button>
 *     </div>
 *   )
 * }
 * 
 * export default withSize(MyComponent)
 * ```
 */
export function withSize<P extends WithSizeProps>(
  Component: React.ComponentType<P>
): React.ComponentType<Omit<P, 'size'>> {
  const WrappedComponent = (props: Omit<P, 'size'>) => {
    const size = useSize()

    return <Component {...(props as P)} size={size} />
  }

  // 保留原组件的显示名称（用于调试）
  const componentName = Component.displayName || Component.name || 'Component'
  WrappedComponent.displayName = `withSize(${componentName})`

  return WrappedComponent
}

