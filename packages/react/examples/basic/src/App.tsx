/**
 * React Size Example - Basic Usage
 * 
 * 演示 @ldesign/size-react 的完整功能
 */

import { useMemo } from 'react'
import {
  SizeProvider,
  useSize,
  useSizeConfig,
  useSizePresets,
  SizeSelector,
  SizeControlPanel
} from '@ldesign/size-react'
import type { SizePreset } from '@ldesign/size-core'

// 自定义预设
const customPresets: SizePreset[] = [
  { name: 'compact', label: '紧凑', baseSize: 12 },
  { name: 'normal', label: '正常', baseSize: 14 },
  { name: 'comfortable', label: '舒适', baseSize: 16 },
  { name: 'large', label: '大号', baseSize: 18 },
  { name: 'extra-large', label: '超大', baseSize: 20 }
]

function AppContent() {
  // 使用不同的 hooks
  const { config, currentPreset, applyPreset, setBaseSize } = useSize()
  const { resetConfig } = useSizeConfig()
  const { presets } = useSizePresets()

  // 派生值（使用 useMemo）
  const fontSize = useMemo(() => `${config.baseSize}px`, [config.baseSize])
  const lineHeight = useMemo(() => config.baseSize * 1.5, [config.baseSize])

  // 事件处理
  const handleSizeChange = (presetName: string) => {
    console.log('尺寸已变更为:', presetName)
  }

  const increaseSize = () => {
    const currentSize = config.baseSize
    setBaseSize(Math.min(currentSize + 2, 24))
  }

  const decreaseSize = () => {
    const currentSize = config.baseSize
    setBaseSize(Math.max(currentSize - 2, 10))
  }

  return (
    <>
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>⚛️ React 尺寸管理示例</h1>
          <p>使用 @ldesign/size-react 的完整演示</p>
        </div>

        {/* 选择器部分 */}
        <div className="section">
          <h3 className="section-title">下拉选择器模式</h3>
          <SizeSelector
            variant="select"
            onChange={handleSizeChange}
          />
        </div>

        <div className="section">
          <h3 className="section-title">按钮选择器模式</h3>
          <SizeSelector
            variant="buttons"
            buttonSize="medium"
            onChange={handleSizeChange}
          />
        </div>

        {/* 高级控制面板 */}
        <div className="section">
          <h3 className="section-title">
            高级控制面板
            <span className="badge">Featured</span>
          </h3>
          <div className="control-panel-wrapper">
            <SizeControlPanel
              showSlider={true}
              minSize={10}
              maxSize={24}
              onChange={(cfg) => {
                console.log('配置已更新:', cfg)
              }}
            />
          </div>
        </div>

        {/* 信息显示 */}
        <div className="section">
          <h3 className="section-title">当前配置信息</h3>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">当前预设</div>
              <div className="info-value">{currentPreset}</div>
            </div>
            <div className="info-card">
              <div className="info-label">基础字体大小</div>
              <div className="info-value">{config.baseSize}px</div>
            </div>
            <div className="info-card">
              <div className="info-label">行高</div>
              <div className="info-value">{lineHeight}px</div>
            </div>
            <div className="info-card">
              <div className="info-label">可用预设数</div>
              <div className="info-value">{presets.length}</div>
            </div>
          </div>
        </div>

        {/* 动态文本演示 */}
        <div className="section">
          <h3 className="section-title">动态文字大小演示</h3>
          <div
            className="demo-text"
            style={{
              fontSize: fontSize,
              lineHeight: `${lineHeight}px`
            }}
          >
            <h2>响应式标题</h2>
            <p>
              这段文字的大小会根据你选择的尺寸预设自动调整。
              当前字体大小为 {config.baseSize}px，行高为 {lineHeight}px。
              尝试切换不同的预设，观察文字大小的变化！
            </p>
            <p>
              @ldesign/size-react 使用 React Hooks 和 Context，
              提供了完整的 Provider/Consumer 模式和多个专用 Hooks。
              支持函数组件、自定义 Hooks、性能优化等 React 最佳实践。
            </p>
            <p>
              React 的 Hooks 系统非常灵活，配合 @ldesign/size-react 可以轻松实现复杂的尺寸管理逻辑！
            </p>
          </div>
        </div>

        {/* 手动控制 */}
        <div className="section">
          <h3 className="section-title">手动微调控制</h3>
          <div className="button-group">
            <button className="btn" onClick={increaseSize}>
              ➕ 增大字体
            </button>
            <button className="btn" onClick={decreaseSize}>
              ➖ 减小字体
            </button>
            <button className="btn btn-outline" onClick={resetConfig}>
              🔄 重置
            </button>
          </div>
        </div>

        {/* 预设列表 */}
        <div className="section">
          <h3 className="section-title">所有可用预设</h3>
          <div className="info-grid">
            {presets.map((preset) => (
              <div
                key={preset.name}
                className={`info-card ${preset.name === currentPreset ? 'active' : ''}`}
              >
                <div className="info-label">{preset.label}</div>
                <div className="info-value">{preset.baseSize}px</div>
                {preset.name === currentPreset && (
                  <div style={{ marginTop: '0.5rem', color: '#61dafb', fontSize: '0.85rem' }}>
                    ✓ 当前选中
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hooks 使用演示 */}
        <div className="section">
          <h3 className="section-title">可用的 Hooks</h3>
          <div className="demo-text">
            <h2>三个专用 Hooks</h2>
            <p>
              <strong>useSize()</strong> - 核心 Hook，提供完整的尺寸管理功能
            </p>
            <p>
              <strong>useSizeConfig()</strong> - 专注于配置管理，适合配置页面使用
            </p>
            <p>
              <strong>useSizePresets()</strong> - 专注于预设管理，适合预设选择器使用
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>
          Powered by{' '}
          <a href="https://github.com/ldesign/ldesign" target="_blank" rel="noopener noreferrer">
            @ldesign/size-react
          </a>
          {' '}| Built with React ⚛️
        </p>
      </div>
    </>
  )
}

export default function App() {
  return (
    <SizeProvider
      defaultPreset="normal"
      presets={customPresets}
      storageKey="react-example-size"
    >
      <AppContent />
    </SizeProvider>
  )
}


