/**
 * Solid.js Size Example - Basic Usage
 * 
 * 演示 @ldesign/size-solid 的完整功能
 */

import { For, createMemo } from 'solid-js'
import {
  SizeProvider,
  useSize,
  useSizeConfig,
  useSizePresets,
  SizeSelector,
  SizeControlPanel
} from '@ldesign/size-solid'
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
  const { presets, isActive } = useSizePresets()

  // 派生值（使用 createMemo）
  const fontSize = createMemo(() => `${config().baseSize}px`)
  const lineHeight = createMemo(() => config().baseSize * 1.5)

  // 事件处理
  const handleSizeChange = (presetName: string) => {
    console.log('尺寸已变更为:', presetName)
  }

  const increaseSize = () => {
    const currentSize = config().baseSize
    setBaseSize(Math.min(currentSize + 2, 24))
  }

  const decreaseSize = () => {
    const currentSize = config().baseSize
    setBaseSize(Math.max(currentSize - 2, 10))
  }

  return (
    <>
      <div class="container">
        {/* Header */}
        <div class="header">
          <h1>⚡ Solid.js 尺寸管理示例</h1>
          <p>使用 @ldesign/size-solid 的完整演示</p>
        </div>

        {/* 选择器部分 */}
        <div class="section">
          <h3 class="section-title">下拉选择器模式</h3>
          <SizeSelector
            variant="select"
            onChange={handleSizeChange}
          />
        </div>

        <div class="section">
          <h3 class="section-title">按钮选择器模式</h3>
          <SizeSelector
            variant="buttons"
            buttonSize="medium"
            onChange={handleSizeChange}
          />
        </div>

        {/* 高级控制面板 */}
        <div class="section">
          <h3 class="section-title">
            高级控制面板
            <span class="badge">New</span>
          </h3>
          <div class="control-panel-wrapper">
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
        <div class="section">
          <h3 class="section-title">当前配置信息</h3>
          <div class="info-grid">
            <div class="info-card">
              <div class="info-label">当前预设</div>
              <div class="info-value">{currentPreset()}</div>
            </div>
            <div class="info-card">
              <div class="info-label">基础字体大小</div>
              <div class="info-value">{config().baseSize}px</div>
            </div>
            <div class="info-card">
              <div class="info-label">行高</div>
              <div class="info-value">{lineHeight()}px</div>
            </div>
            <div class="info-card">
              <div class="info-label">可用预设数</div>
              <div class="info-value">{presets().length}</div>
            </div>
          </div>
        </div>

        {/* 动态文本演示 */}
        <div class="section">
          <h3 class="section-title">动态文字大小演示</h3>
          <div
            class="demo-text"
            style={{
              'font-size': fontSize(),
              'line-height': `${lineHeight()}px`
            }}
          >
            <h2>响应式标题</h2>
            <p>
              这段文字的大小会根据你选择的尺寸预设自动调整。
              当前字体大小为 {config().baseSize}px，行高为 {lineHeight()}px。
              尝试切换不同的预设，观察文字大小的变化！
            </p>
            <p>
              @ldesign/size-solid 使用 Solid.js 的 Signals 系统，
              提供了细粒度的响应式更新和卓越的性能表现。
            </p>
          </div>
        </div>

        {/* 手动控制 */}
        <div class="section">
          <h3 class="section-title">手动微调控制</h3>
          <div class="button-group">
            <button class="btn" onClick={increaseSize}>
              ➕ 增大字体
            </button>
            <button class="btn" onClick={decreaseSize}>
              ➖ 减小字体
            </button>
            <button class="btn btn-outline" onClick={resetConfig}>
              🔄 重置
            </button>
          </div>
        </div>

        {/* 预设列表 */}
        <div class="section">
          <h3 class="section-title">所有可用预设</h3>
          <div class="info-grid">
            <For each={presets()}>
              {(preset) => (
                <div
                  class="info-card"
                  classList={{ active: isActive(preset.name) }}
                >
                  <div class="info-label">{preset.label}</div>
                  <div class="info-value">{preset.baseSize}px</div>
                  {isActive(preset.name) && (
                    <div style={{ 'margin-top': '0.5rem', color: '#2196f3', 'font-size': '0.85rem' }}>
                      ✓ 当前选中
                    </div>
                  )}
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div class="footer">
        <p>
          Powered by{' '}
          <a href="https://github.com/ldesign/ldesign" target="_blank">
            @ldesign/size-solid
          </a>
          {' '}| Built with Solid.js ⚡
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
      storageKey="solid-example-size"
    >
      <AppContent />
    </SizeProvider>
  )
}
