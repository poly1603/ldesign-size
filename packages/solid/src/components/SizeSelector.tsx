/**
 * @ldesign/size-solid - SizeSelector Component
 * 
 * Solid.js component for size selection
 */

import { For, type JSX } from 'solid-js'
import { useSize } from '../hooks/useSize'

/**
 * SizeSelector Props
 */
export interface SizeSelectorProps {
  /**
   * Custom className
   */
  class?: string

  /**
   * Custom style
   */
  style?: JSX.CSSProperties | string

  /**
   * Render as dropdown (select) or buttons
   * @default 'select'
   */
  variant?: 'select' | 'buttons'

  /**
   * Size of the buttons (when variant is 'buttons')
   * @default 'medium'
   */
  buttonSize?: 'small' | 'medium' | 'large'

  /**
   * Callback when size changes
   */
  onChange?: (presetName: string) => void
}

/**
 * SizeSelector Component
 * 
 * 尺寸选择器组件
 * 
 * @example
 * ```tsx
 * // Select variant
 * <SizeSelector variant="select" />
 * 
 * // Buttons variant
 * <SizeSelector variant="buttons" />
 * 
 * // With callback
 * <SizeSelector
 *   onChange={(preset) => console.log('Size changed:', preset)}
 * />
 * ```
 */
export function SizeSelector(props: SizeSelectorProps) {
  const { currentPreset, presets, applyPreset } = useSize()

  const handleChange = (presetName: string) => {
    applyPreset(presetName)
    props.onChange?.(presetName)
  }

  // Button size styles
  const getButtonStyle = (isActive: boolean): JSX.CSSProperties => {
    const sizeMap = {
      small: { fontSize: '0.875rem', padding: '0.375rem 0.75rem' },
      medium: { fontSize: '1rem', padding: '0.5rem 1rem' },
      large: { fontSize: '1.125rem', padding: '0.625rem 1.25rem' }
    }

    const size = props.buttonSize || 'medium'

    return {
      ...sizeMap[size],
      border: '1px solid #ddd',
      'border-radius': '4px',
      background: isActive ? '#0066ff' : 'white',
      color: isActive ? 'white' : '#333',
      cursor: 'pointer',
      'font-weight': isActive ? 600 : 400,
      transition: 'all 0.2s ease'
    }
  }

  // Select variant
  if (props.variant === 'buttons') {
    return (
      <div
        class={props.class}
        style={{
          display: 'flex',
          gap: '0.5rem',
          ...(typeof props.style === 'object' ? props.style : {})
        }}
      >
        <For each={presets()}>
          {(preset) => {
            const isActive = () => preset.name === currentPreset()

            return (
              <button
                onClick={() => handleChange(preset.name)}
                style={getButtonStyle(isActive())}
              >
                {preset.label}
              </button>
            )
          }}
        </For>
      </div>
    )
  }

  // Default: select variant
  return (
    <select
      class={props.class}
      style={props.style}
      value={currentPreset()}
      onChange={(e) => handleChange(e.currentTarget.value)}
    >
      <For each={presets()}>
        {(preset) => (
          <option value={preset.name}>
            {preset.label}
          </option>
        )}
      </For>
    </select>
  )
}


