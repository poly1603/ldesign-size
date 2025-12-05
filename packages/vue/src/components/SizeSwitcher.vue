<template>
  <div class="ld-size-switcher">
    <button class="size-button" :title="sizeTitle" @click="toggleDropdown">
      <span class="size-icon">A</span>
    </button>

    <!-- 下拉菜单 - 卡片网格布局 -->
    <div v-if="isOpen" class="size-dropdown" @click.stop>
      <div class="dropdown-header">
        <span class="dropdown-title">{{ translate?.('size.title') || '全局尺寸' }}</span>
        <button class="close-btn" @click="isOpen = false">×</button>
      </div>
      <div class="dropdown-content">
        <div class="size-grid">
          <div v-for="preset in presets" :key="preset.name" class="size-card"
            :class="{ active: currentPreset?.name === preset.name }" @click="selectPreset(preset.name)">
            <span class="card-icon">A</span>
            <div class="card-info">
              <span class="card-name">{{ getPresetLabel(preset) }}</span>
              <span class="card-size">{{ preset.baseSize }}px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from 'vue'
import type { SizePresetTheme } from '@ldesign/size-core'

// Props
const props = defineProps<{
  translate?: (key: string) => string
  locale?: string | { value: string }
}>()

// 获取当前组件实例，访问全局属性
const instance = getCurrentInstance()
const sizeManager = instance?.appContext.config.globalProperties.$sizeManager

// 下拉菜单状态
const isOpen = ref(false)

// 获取所有预设
const presets = computed<SizePresetTheme[]>(() => {
  return sizeManager?.getPresets?.() || []
})

// 当前预设
const currentPreset = computed(() => {
  return sizeManager?.getCurrentPreset?.() || null
})

// 尺寸文本
const sizeText = computed(() => {
  if (!currentPreset.value) return 'Size'

  // 关键修复：正确处理 Ref 类型的 locale prop
  let currentLocale: string | undefined

  // 检查是否有 value 属性（Ref 或类 Ref 对象）
  if (props.locale && typeof props.locale === 'object' && 'value' in props.locale) {
    currentLocale = (props.locale as { value: string }).value
  }
  else if (typeof props.locale === 'string') {
    currentLocale = props.locale
  }

  // 使用翻译
  if (currentLocale && props.translate) {
    return props.translate(`size.presets.${currentPreset.value}`)
  }

  if (props.translate) {
    return props.translate(`size.presets.${currentPreset.value}`)
  }

  // 降级到预设名称
  return currentPreset.value
})

// 尺寸提示文本
const sizeTitle = computed(() => {
  let currentLocale: string | undefined

  if (props.locale && typeof props.locale === 'object' && 'value' in props.locale) {
    currentLocale = (props.locale as { value: string }).value
  }
  else if (typeof props.locale === 'string') {
    currentLocale = props.locale
  }

  if (currentLocale && props.translate) {
    return props.translate('size.switchSize')
  }

  if (props.translate) {
    return props.translate('size.switchSize')
  }

  return '切换尺寸'
})

// 获取预设标签
function getPresetLabel(preset: SizePresetTheme): string {
  let currentLocale: string | undefined

  if (props.locale && typeof props.locale === 'object' && 'value' in props.locale) {
    currentLocale = (props.locale as { value: string }).value
  }
  else if (typeof props.locale === 'string') {
    currentLocale = props.locale
  }

  if (currentLocale && props.translate) {
    return props.translate(`size.presets.${preset.name}`)
  }

  if (props.translate) {
    return props.translate(`size.presets.${preset.name}`)
  }

  return preset.label || preset.name
}

// 切换下拉菜单
function toggleDropdown(e: MouseEvent) {
  e.stopPropagation() // 阻止事件冒泡
  isOpen.value = !isOpen.value
}

// 选择预设
function selectPreset(name: string) {
  sizeManager?.applyPreset?.(name)
  isOpen.value = false
}

// 点击外部关闭下拉菜单
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.ld-size-switcher')) {
      isOpen.value = false
    }
  })
}
</script>

<style scoped>
.ld-size-switcher {
  position: relative;
  display: inline-block;
}

/* 尺寸按钮 - 仅显示图标 */
.size-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border, #d9d9d9);
  border-radius: 6px;
  background: var(--color-bg-container, #ffffff);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text-primary, #333);
}

.size-button:hover {
  border-color: var(--color-primary-hover, #40a9ff);
  background: var(--color-bg-component-hover, #f5f5f5);
}

/* 尺寸图标 */
.size-icon {
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
}

/* 下拉面板 */
.size-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 520px;
  max-width: 90vw;
  background: var(--color-bg-container, #ffffff);
  border: 1px solid var(--color-border, #d9d9d9);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow: hidden;
  animation: dropdown-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 下拉头部 */
.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border, #e8e8e8);
}

.dropdown-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary, #333);
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 20px;
  color: var(--color-text-secondary, #666);
}

.close-btn:hover {
  background: var(--color-bg-component-hover, #f5f5f5);
  color: var(--color-text-primary, #333);
}

/* 下拉内容 */
.dropdown-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

/* 尺寸网格 */
.size-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 尺寸卡片 */
.size-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid var(--color-border, #e8e8e8);
  border-radius: 8px;
  background: var(--color-bg-container, #ffffff);
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-card:hover {
  border-color: var(--color-primary, #1890ff);
  background: var(--color-bg-component-hover, #f5f5f5);
}

.size-card.active {
  border-color: var(--color-primary, #1890ff);
  background: var(--color-primary-bg, #e6f7ff);
}

/* 卡片图标 */
.card-icon {
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  flex-shrink: 0;
  color: var(--color-text-primary, #333);
}

.size-card.active .card-icon {
  color: var(--color-primary, #1890ff);
}

/* 卡片信息 */
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 卡片名称 */
.card-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary, #333);
}

.size-card.active .card-name {
  color: var(--color-primary, #1890ff);
}

/* 卡片尺寸 */
.card-size {
  font-size: 12px;
  opacity: 0.7;
  font-family: 'Courier New', monospace;
}

/* 下拉动画 */
@keyframes dropdown-fade-in {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .size-button {
    background: var(--color-bg-container, #1f1f1f);
    border-color: var(--color-border, #434343);
    color: var(--color-text-primary, #e8e8e8);
  }

  .size-button:hover {
    background: var(--color-bg-component-hover, #2a2a2a);
  }

  .size-dropdown {
    background: var(--color-bg-container, #1f1f1f);
    border-color: var(--color-border, #434343);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  }

  .dropdown-header {
    border-bottom-color: var(--color-border, #434343);
  }

  .dropdown-title {
    color: var(--color-text-primary, #e8e8e8);
  }

  .close-btn {
    color: var(--color-text-secondary, #999);
  }

  .close-btn:hover {
    background: var(--color-bg-component-hover, #2a2a2a);
    color: var(--color-text-primary, #e8e8e8);
  }

  .size-card {
    background: var(--color-bg-container, #1f1f1f);
    border-color: var(--color-border, #434343);
  }

  .size-card:hover {
    background: var(--color-bg-component-hover, #2a2a2a);
  }

  .size-card.active {
    background: var(--color-primary-bg, #111d2c);
  }

  .card-icon,
  .card-name {
    color: var(--color-text-primary, #e8e8e8);
  }
}
</style>
