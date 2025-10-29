/**
 * @ldesign/size-solid - SizeControlPanel Component
 * 
 * Advanced size control panel with preset selector and base size slider
 */

import { For, type JSX } from 'solid-js'
import { useSize } from '../hooks/useSize'

/**
 * SizeControlPanel Props
 */
export interface SizeControlPanelProps {
  /**
   * Custom className
   */
  class?: string

  /**
   * Custom style
   */
  style?: JSX.CSSProperties | string

  /**
   * Show base size slider
   * @default true
   */
  showSlider?: boolean

  /**
   * Minimum base size
   * @default 10
   */
  minSize?: number

  /**
   * Maximum base size
   * @default 24
   */
  maxSize?: number

  /**
   * Callback when size changes
   */
  onChange?: (config: { preset: string; baseSize: number }) => void
}

/**
 * SizeControlPanel Component
 * 
 * 高级尺寸控制面板
 * 
 * @example
 * ```tsx
 * <SizeControlPanel
 *   showSlider={true}
 *   minSize={12}
 *   maxSize={20}
 *   onChange={(config) => console.log('Config:', config)}
 * />
 * ```
 */
export function SizeControlPanel(props: SizeControlPanelProps) {
  const { config, currentPreset, presets, applyPreset, setBaseSize } = useSize()

  const showSlider = props.showSlider !== false
  const minSize = props.minSize || 10
  const maxSize = props.maxSize || 24

  const handlePresetChange = (presetName: string) => {
    applyPreset(presetName)
    props.onChange?.({
      preset: presetName,
      baseSize: config().baseSize
    })
  }

  const handleSizeChange = (size: number) => {
    setBaseSize(size)
    props.onChange?.({
      preset: currentPreset(),
      baseSize: size
    })
  }

  const panelStyle: JSX.CSSProperties = {
    padding: '1.5rem',
    border: '1px solid #e0e0e0',
    'border-radius': '8px',
    background: 'white',
    ...(typeof props.style === 'object' ? props.style : {})
  }

  const sectionStyle: JSX.CSSProperties = {
    'margin-bottom': '1.5rem'
  }

  const labelStyle: JSX.CSSProperties = {
    display: 'block',
    'margin-bottom': '0.5rem',
    'font-weight': 600,
    color: '#333'
  }

  const presetGridStyle: JSX.CSSProperties = {
    display: 'grid',
    'grid-template-columns': 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '0.5rem'
  }

  const presetButtonStyle = (isActive: boolean): JSX.CSSProperties => ({
    padding: '0.75rem 1rem',
    border: `2px solid ${isActive ? '#0066ff' : '#e0e0e0'}`,
    'border-radius': '6px',
    background: isActive ? '#0066ff' : 'white',
    color: isActive ? 'white' : '#333',
    cursor: 'pointer',
    'font-weight': isActive ? 600 : 400,
    transition: 'all 0.2s ease',
    'text-align': 'center'
  })

  const sliderContainerStyle: JSX.CSSProperties = {
    display: 'flex',
    'align-items': 'center',
    gap: '1rem'
  }

  const sliderStyle: JSX.CSSProperties = {
    flex: 1,
    height: '6px',
    'border-radius': '3px'
  }

  const valueDisplayStyle: JSX.CSSProperties = {
    'min-width': '50px',
    'text-align': 'right',
    'font-weight': 600,
    color: '#0066ff'
  }

  return (
    <div class={props.class} style={panelStyle}>
      {/* Preset Selector */}
      <div style={sectionStyle}>
        <label style={labelStyle}>
          预设尺寸
        </label>
        <div style={presetGridStyle}>
          <For each={presets()}>
            {(preset) => {
              const isActive = () => preset.name === currentPreset()

              return (
                <button
                  onClick={() => handlePresetChange(preset.name)}
                  style={presetButtonStyle(isActive())}
                >
                  <div>{preset.label}</div>
                  <div style={{ 'font-size': '0.75rem', opacity: 0.8 }}>
                    {preset.baseSize}px
                  </div>
                </button>
              )
            }}
          </For>
        </div>
      </div>

      {/* Base Size Slider */}
      {showSlider && (
        <div style={{ 'margin-bottom': 0 }}>
          <label style={labelStyle}>
            基础尺寸
          </label>
          <div style={sliderContainerStyle}>
            <input
              type="range"
              min={minSize}
              max={maxSize}
              value={config().baseSize}
              onInput={(e) => handleSizeChange(Number(e.currentTarget.value))}
              style={sliderStyle}
            />
            <span style={valueDisplayStyle}>
              {config().baseSize}px
            </span>
          </div>
        </div>
      )}
    </div>
  )
}


