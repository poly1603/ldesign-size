<template>
  <div v-if="visible" class="size-debug-panel" :class="{ minimized }">
    <div class="debug-header">
      <h3>🔍 Size Debug Panel</h3>
      <div class="debug-actions">
        <button @click="minimized = !minimized" class="btn-minimize">
          {{ minimized ? '📖' : '📕' }}
        </button>
        <button @click="visible = false" class="btn-close">✕</button>
      </div>
    </div>
    
    <div v-if="!minimized" class="debug-content">
      <!-- 当前配置 -->
      <section class="debug-section">
        <h4>Current Configuration</h4>
        <div class="debug-info">
          <div class="info-item">
            <span class="label">Preset:</span>
            <span class="value">{{ currentPreset }}</span>
          </div>
          <div class="info-item">
            <span class="label">Base Size:</span>
            <span class="value">{{ config.baseSize }}px</span>
          </div>
          <div class="info-item">
            <span class="label">Scale:</span>
            <span class="value">{{ (config.baseSize / 16).toFixed(2) }}</span>
          </div>
        </div>
      </section>

      <!-- 断点信息 -->
      <section class="debug-section">
        <h4>Breakpoint</h4>
        <div class="debug-info">
          <div class="info-item">
            <span class="label">Current:</span>
            <span class="value">{{ breakpoint }}</span>
          </div>
          <div class="info-item">
            <span class="label">Mobile:</span>
            <span class="value">{{ isMobile ? '✅' : '❌' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Tablet:</span>
            <span class="value">{{ isTablet ? '✅' : '❌' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Desktop:</span>
            <span class="value">{{ isDesktop ? '✅' : '❌' }}</span>
          </div>
        </div>
      </section>

      <!-- 快速切换 -->
      <section class="debug-section">
        <h4>Quick Switch</h4>
        <div class="preset-buttons">
          <button
            v-for="preset in presets"
            :key="preset.name"
            @click="applyPreset(preset.name)"
            :class="{ active: currentPreset === preset.name }"
            class="preset-btn"
          >
            {{ preset.label }}
          </button>
        </div>
      </section>

      <!-- 尺寸计算器 -->
      <section class="debug-section">
        <h4>Size Calculator</h4>
        <div class="calculator">
          <input
            v-model.number="multiplier"
            type="number"
            step="0.125"
            placeholder="倍数"
            class="calc-input"
          />
          <span class="calc-result">
            = {{ calc(multiplier) }}
          </span>
        </div>
      </section>

      <!-- CSS 变量预览 -->
      <section class="debug-section">
        <h4>CSS Variables (Preview)</h4>
        <div class="css-preview">
          <div class="css-var">--size-base: {{ config.baseSize }}px</div>
          <div class="css-var">--size-font-base: {{ getVar('font-base') }}</div>
          <div class="css-var">--size-spacing-md: {{ getVar('spacing-md') }}</div>
          <div class="css-var">--size-radius-md: {{ getVar('radius-md') }}</div>
        </div>
      </section>

      <!-- 性能信息 -->
      <section v-if="showPerformance" class="debug-section">
        <h4>Performance</h4>
        <div class="debug-info">
          <div class="info-item">
            <span class="label">Memory:</span>
            <span class="value">{{ memoryUsage }}</span>
          </div>
          <div class="info-item">
            <span class="label">Cache Size:</span>
            <span class="value">{{ cacheSize }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- 浮动切换按钮 -->
  <button v-if="!visible" @click="visible = true" class="debug-toggle">
    🔍
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSize } from '../composables/useSize'
import { useSizeCalc } from '../composables/useSizeExtended'
import { useSizeBreakpoint } from '../composables/useSizeExtended'

interface Props {
  defaultVisible?: boolean
  showPerformance?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultVisible: false,
  showPerformance: true
})

const visible = ref(props.defaultVisible)
const minimized = ref(false)
const multiplier = ref(1)

const { config, currentPreset, applyPreset, presets: presetsRef } = useSize()
const { calc, getVar } = useSizeCalc()
const { breakpoint, isMobile, isTablet, isDesktop } = useSizeBreakpoint()

const presets = presetsRef

// 性能信息
const memoryUsage = ref('N/A')
const cacheSize = ref('N/A')

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + Shift + D 切换面板
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
    e.preventDefault()
    visible.value = !visible.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  
  // 获取性能信息
  if (props.showPerformance && 'memory' in performance) {
    const updatePerformance = () => {
      const memory = (performance as any).memory
      if (memory) {
        const used = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
        const total = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
        memoryUsage.value = `${used}MB / ${total}MB`
      }
    }
    updatePerformance()
    const interval = setInterval(updatePerformance, 5000)
    
    onUnmounted(() => {
      clearInterval(interval)
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.size-debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 360px;
  max-height: 80vh;
  background: rgba(0, 0, 0, 0.95);
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
}

.size-debug-panel.minimized {
  width: 200px;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.debug-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.debug-actions {
  display: flex;
  gap: 8px;
}

.btn-minimize,
.btn-close {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-minimize:hover,
.btn-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.debug-content {
  max-height: calc(80vh - 50px);
  overflow-y: auto;
  padding: 16px;
}

.debug-section {
  margin-bottom: 20px;
}

.debug-section:last-child {
  margin-bottom: 0;
}

.debug-section h4 {
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.debug-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.info-item .label {
  color: #888;
  font-size: 12px;
}

.info-item .value {
  font-weight: 600;
  color: #4CAF50;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.preset-btn {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.preset-btn.active {
  background: #4CAF50;
  border-color: #4CAF50;
  font-weight: 600;
}

.calculator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.calc-input {
  flex: 1;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 4px;
  font-size: 13px;
}

.calc-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.calc-result {
  font-weight: 600;
  color: #4CAF50;
}

.css-preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 11px;
}

.css-var {
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  color: #4FC3F7;
}

.debug-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.95);
  border: none;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 999999;
  transition: transform 0.2s;
}

.debug-toggle:hover {
  transform: scale(1.1);
}

/* 滚动条样式 */
.debug-content::-webkit-scrollbar {
  width: 6px;
}

.debug-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.debug-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.debug-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>