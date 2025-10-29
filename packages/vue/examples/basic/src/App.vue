<script setup lang="ts">
/**
 * Vue 3 Size Example - Basic Usage
 * 
 * 演示 @ldesign/size-vue 的完整功能
 */

import { computed } from 'vue'
import { useSize } from '@ldesign/size-vue'

const { config, currentPreset, presets, applyPreset, setBaseSize } = useSize()

// 派生值
const fontSize = computed(() => `${config.value.baseSize}px`)
const lineHeight = computed(() => config.value.baseSize * 1.5)

// 方法
function handleSizeChange(presetName: string) {
  console.log('尺寸已变更为:', presetName)
}

function resetSize() {
  applyPreset('normal')
}

function increaseSize() {
  const currentSize = config.value.baseSize
  setBaseSize(Math.min(currentSize + 2, 24))
}

function decreaseSize() {
  const currentSize = config.value.baseSize
  setBaseSize(Math.max(currentSize - 2, 10))
}
</script>

<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🎨 Vue 3 尺寸管理示例</h1>
      <p>使用 @ldesign/size-vue 的完整演示</p>
    </div>

    <!-- 选择器部分 -->
    <div class="section">
      <h3 class="section-title">下拉选择器模式</h3>
      <select 
        :value="currentPreset"
        @change="(e) => { applyPreset((e.target as HTMLSelectElement).value); handleSizeChange((e.target as HTMLSelectElement).value) }"
        style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;"
      >
        <option 
          v-for="preset in presets" 
          :key="preset.name" 
          :value="preset.name"
        >
          {{ preset.label }} ({{ preset.baseSize }}px)
        </option>
      </select>
    </div>

    <div class="section">
      <h3 class="section-title">按钮选择器模式</h3>
      <div class="button-group">
        <button
          v-for="preset in presets"
          :key="preset.name"
          class="btn"
          :class="{ 'active': preset.name === currentPreset }"
          @click="applyPreset(preset.name); handleSizeChange(preset.name)"
          :style="{
            background: preset.name === currentPreset ? 'linear-gradient(135deg, #42b983 0%, #35495e 100%)' : 'white',
            color: preset.name === currentPreset ? 'white' : '#42b983',
            border: preset.name === currentPreset ? 'none' : '2px solid #42b983'
          }"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- 信息显示 -->
    <div class="section">
      <h3 class="section-title">当前配置信息</h3>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">当前预设</div>
          <div class="info-value">{{ currentPreset }}</div>
        </div>
        <div class="info-card">
          <div class="info-label">基础字体大小</div>
          <div class="info-value">{{ config.baseSize }}px</div>
        </div>
        <div class="info-card">
          <div class="info-label">行高</div>
          <div class="info-value">{{ lineHeight }}px</div>
        </div>
        <div class="info-card">
          <div class="info-label">可用预设数</div>
          <div class="info-value">{{ presets.length }}</div>
        </div>
      </div>
    </div>

    <!-- 动态文本演示 -->
    <div class="section">
      <h3 class="section-title">动态文字大小演示</h3>
      <div 
        class="demo-text"
        :style="{
          fontSize: fontSize,
          lineHeight: `${lineHeight}px`
        }"
      >
        <h2>响应式标题</h2>
        <p>
          这段文字的大小会根据你选择的尺寸预设自动调整。
          当前字体大小为 {{ config.baseSize }}px，行高为 {{ lineHeight }}px。
          尝试切换不同的预设，观察文字大小的变化！
        </p>
        <p>
          @ldesign/size-vue 使用 Vue 3 的 Composition API，
          提供了 useSize composable 和完整的 Vue 插件系统。
          支持 SSR、响应式更新、组件自动注册等特性。
        </p>
        <p>
          Vue 3 的响应式系统非常强大，配合 @ldesign/size-vue 可以轻松实现全局尺寸管理！
        </p>
      </div>
    </div>

    <!-- 手动控制 -->
    <div class="section">
      <h3 class="section-title">手动微调控制</h3>
      <div class="button-group">
        <button class="btn" @click="increaseSize">
          ➕ 增大字体
        </button>
        <button class="btn" @click="decreaseSize">
          ➖ 减小字体
        </button>
        <button class="btn btn-outline" @click="resetSize">
          🔄 重置
        </button>
      </div>
    </div>

    <!-- 预设列表 -->
    <div class="section">
      <h3 class="section-title">所有可用预设</h3>
      <div class="info-grid">
        <div 
          v-for="preset in presets"
          :key="preset.name"
          class="info-card"
          :class="{ active: preset.name === currentPreset }"
        >
          <div class="info-label">{{ preset.label }}</div>
          <div class="info-value">{{ preset.baseSize }}px</div>
          <div 
            v-if="preset.name === currentPreset"
            style="margin-top: 0.5rem; color: #42b983; font-size: 0.85rem;"
          >
            ✓ 当前选中
          </div>
        </div>
      </div>
    </div>

    <!-- Composition API 演示 -->
    <div class="section">
      <h3 class="section-title">Composition API 使用</h3>
      <div class="demo-text">
        <h2>useSize() Composable</h2>
        <p>
          <strong>导出的 API：</strong>
        </p>
        <ul style="margin-left: 1.5rem; line-height: 2;">
          <li><code>config</code> - 当前配置（响应式 Ref）</li>
          <li><code>currentPreset</code> - 当前预设名称（响应式 Ref）</li>
          <li><code>presets</code> - 可用预设列表（计算属性）</li>
          <li><code>applyPreset(name)</code> - 应用预设方法</li>
          <li><code>setBaseSize(size)</code> - 设置基础尺寸方法</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>
      Powered by 
      <a href="https://github.com/ldesign/ldesign" target="_blank">
        @ldesign/size-vue
      </a>
      | Built with Vue 3 💚
    </p>
  </div>
</template>


