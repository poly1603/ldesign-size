<script lang="ts">
/**
 * Svelte 5 Size Example - Basic Usage
 * 
 * 演示 @ldesign/size-svelte 的基础功能
 */

import { createSizeStore, SizeSelector } from '@ldesign/size-svelte'
import type { SizePreset } from '@ldesign/size-core'

// 创建自定义预设
const customPresets: SizePreset[] = [
  { name: 'compact', label: '紧凑', baseSize: 12 },
  { name: 'normal', label: '正常', baseSize: 14 },
  { name: 'comfortable', label: '舒适', baseSize: 16 },
  { name: 'large', label: '大号', baseSize: 18 },
  { name: 'extra-large', label: '超大', baseSize: 20 }
]

// 创建尺寸 store
const size = createSizeStore({
  defaultPreset: 'normal',
  presets: customPresets,
  storageKey: 'svelte-example-size'
})

// 响应式派生值
let fontSize = $derived(`${size.config.baseSize}px`)
let lineHeight = $derived(size.config.baseSize * 1.5)

// 方法
function handleSizeChange(presetName: string) {
  console.log('尺寸已变更为:', presetName)
}

function resetSize() {
  size.applyPreset('normal')
}

function increaseSize() {
  const currentSize = size.config.baseSize
  size.setBaseSize(Math.min(currentSize + 2, 24))
}

function decreaseSize() {
  const currentSize = size.config.baseSize
  size.setBaseSize(Math.max(currentSize - 2, 10))
}
</script>

<div class="container">
  <!-- Header -->
  <div class="header">
    <h1>🎨 Svelte 5 尺寸管理示例</h1>
    <p>使用 @ldesign/size-svelte 的完整演示</p>
  </div>

  <!-- 选择器部分 -->
  <div class="section">
    <h3 class="section-title">下拉选择器模式</h3>
    <SizeSelector
      store={size}
      variant="select"
      onChange={handleSizeChange}
    />
  </div>

  <div class="section">
    <h3 class="section-title">按钮选择器模式</h3>
    <SizeSelector
      store={size}
      variant="buttons"
      buttonSize="medium"
      onChange={handleSizeChange}
    />
  </div>

  <!-- 信息显示 -->
  <div class="section">
    <h3 class="section-title">当前配置信息</h3>
    <div class="info-grid">
      <div class="info-card">
        <div class="info-label">当前预设</div>
        <div class="info-value">{size.currentPreset}</div>
      </div>
      <div class="info-card">
        <div class="info-label">基础字体大小</div>
        <div class="info-value">{size.config.baseSize}px</div>
      </div>
      <div class="info-card">
        <div class="info-label">行高</div>
        <div class="info-value">{lineHeight}px</div>
      </div>
      <div class="info-card">
        <div class="info-label">可用预设数</div>
        <div class="info-value">{size.presets.length}</div>
      </div>
    </div>
  </div>

  <!-- 动态文本演示 -->
  <div class="section">
    <h3 class="section-title">动态文字大小演示</h3>
    <div class="demo-text" style:font-size={fontSize} style:line-height="{lineHeight}px">
      <h2>响应式标题</h2>
      <p>
        这段文字的大小会根据你选择的尺寸预设自动调整。
        当前字体大小为 {size.config.baseSize}px，行高为 {lineHeight}px。
        尝试切换不同的预设，观察文字大小的变化！
      </p>
      <p>
        @ldesign/size-svelte 使用 Svelte 5 的最新 runes 系统（$state 和 $derived），
        提供了极致的响应式体验和开发者友好的 API。
      </p>
    </div>
  </div>

  <!-- 手动控制 -->
  <div class="section">
    <h3 class="section-title">手动微调控制</h3>
    <div class="button-group">
      <button class="btn" onclick={increaseSize}>
        ➕ 增大字体
      </button>
      <button class="btn" onclick={decreaseSize}>
        ➖ 减小字体
      </button>
      <button class="btn btn-outline" onclick={resetSize}>
        🔄 重置
      </button>
    </div>
  </div>

  <!-- 预设列表 -->
  <div class="section">
    <h3 class="section-title">所有可用预设</h3>
    <div class="info-grid">
      {#each size.presets as preset}
        <div 
          class="info-card"
          style:border-color={preset.name === size.currentPreset ? '#667eea' : '#e0e0e0'}
        >
          <div class="info-label">{preset.label}</div>
          <div class="info-value">{preset.baseSize}px</div>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Footer -->
<div class="footer">
  <p>
    Powered by 
    <a href="https://github.com/ldesign/ldesign" target="_blank">
      @ldesign/size-svelte
    </a>
    | Built with Svelte 5 ⚡
  </p>
</div>
