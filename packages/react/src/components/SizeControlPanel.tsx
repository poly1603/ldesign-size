/**
 * @ldesign/size-react - SizeControlPanel Component
 * 
 * React component for size control panel
 */

import React from 'react'
import { useSizeConfig } from '../hooks/useSizeConfig'
import { useSizePresets } from '../hooks/useSizePresets'

/**
 * SizeControlPanel Props
 */
export interface SizeControlPanelProps {
  /**
   * Custom className
   */
  className?: string

  /**
   * Custom style
   */
  style?: React.CSSProperties

  /**
   * Show base size slider
   * @default true
   */
  showSlider?: boolean

  /**
   * Show preset buttons
   * @default true
   */
  showPresets?: boolean

  /**
   * Title text
   */
  title?: string
}

/**
 * SizeControlPanel Component
 * 
 * 尺寸控制面板组件，提供完整的尺寸管理界面
 * 
 * @example
 * ```tsx
 * <SizeControlPanel
 *   title="尺寸设置"
 *   showSlider={true}
 *   showPresets={true}
 * />
 * ```
 */
export function SizeControlPanel({
  className,
  style,
  showSlider = true,
  showPresets = true,
  title = '尺寸设置'
}: SizeControlPanelProps) {
  const { config, setBaseSize } = useSizeConfig()
  const { currentPreset, presets, applyPreset } = useSizePresets()

  return (
    <div
      className={className}
      style={{
        padding: '1rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: 'white',
        ...style
      }}
    >
      {/* Title */}
      {title && (
        <h3
          style={{
            margin: '0 0 1rem 0',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#333'
          }}
        >
          {title}
        </h3>
      )}

      {/* Preset Buttons */}
      {showPresets && (
        <div style={{ marginBottom: showSlider ? '1.5rem' : 0 }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#666'
            }}
          >
            预设尺寸
          </label>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}
          >
            {presets.map((preset) => {
              const isActive = preset.name === currentPreset

              return (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset.name)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: isActive ? '2px solid #0066ff' : '1px solid #ddd',
                    borderRadius: '6px',
                    background: isActive ? '#e6f2ff' : 'white',
                    color: isActive ? '#0066ff' : '#333',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {preset.label}
                  {preset.description && (
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        opacity: 0.7,
                        marginTop: '0.125rem'
                      }}
                    >
                      {preset.baseSize}px
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Base Size Slider */}
      {showSlider && (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#666'
            }}
          >
            基础尺寸: {config.baseSize}px
          </label>
          <input
            type="range"
            min="12"
            max="20"
            step="1"
            value={config.baseSize}
            onChange={(e) => setBaseSize(Number(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              outline: 'none',
              background: 'linear-gradient(to right, #0066ff, #0066ff) no-repeat #ddd',
              backgroundSize: `${((config.baseSize - 12) / (20 - 12)) * 100}% 100%`
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.25rem',
              fontSize: '0.75rem',
              color: '#999'
            }}
          >
            <span>12px</span>
            <span>20px</span>
          </div>
        </div>
      )}
    </div>
  )
}

SizeControlPanel.displayName = 'SizeControlPanel'

