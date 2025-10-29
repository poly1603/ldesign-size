/**
 * @ldesign/size-react - SizeSelector Component
 * 
 * React component for size selection
 */

import React from 'react'
import { useSize } from '../hooks/useSize'

/**
 * SizeSelector Props
 */
export interface SizeSelectorProps {
  /**
   * Custom className
   */
  className?: string

  /**
   * Custom style
   */
  style?: React.CSSProperties

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
export function SizeSelector({
  className,
  style,
  variant = 'select',
  buttonSize = 'medium',
  onChange
}: SizeSelectorProps) {
  const { currentPreset, presets, applyPreset } = useSize()

  const handleChange = (presetName: string) => {
    applyPreset(presetName)
    onChange?.(presetName)
  }

  // Select variant
  if (variant === 'select') {
    return (
      <select
        className={className}
        style={style}
        value={currentPreset}
        onChange={(e) => handleChange(e.target.value)}
      >
        {presets.map((preset) => (
          <option key={preset.name} value={preset.name}>
            {preset.label}
          </option>
        ))}
      </select>
    )
  }

  // Buttons variant
  const buttonSizeClass = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  }[buttonSize]

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: '0.5rem',
        ...style
      }}
    >
      {presets.map((preset) => {
        const isActive = preset.name === currentPreset

        return (
          <button
            key={preset.name}
            className={`${buttonSizeClass} ${isActive ? 'active' : ''}`}
            onClick={() => handleChange(preset.name)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: isActive ? '#0066ff' : 'white',
              color: isActive ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: buttonSize === 'small' ? '0.875rem' : buttonSize === 'large' ? '1.125rem' : '1rem',
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.2s ease'
            }}
          >
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}

SizeSelector.displayName = 'SizeSelector'

