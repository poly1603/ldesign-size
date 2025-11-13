<template>
  <div class="ld-size-switcher">
    <button class="size-button" :title="sizeTitle" @click="toggleDropdown">
      <span class="size-icon">📏</span>
      <span class="size-text">{{ sizeText }}</span>
      <span class="dropdown-icon">{{ isOpen ? '▲' : '▼' }}</span>
    </button>

    <!-- 下拉菜单 -->
    <div v-if="isOpen" class="size-dropdown">
      <div v-for="preset in presets" :key="preset.name" class="size-option"
        :class="{ active: currentPreset?.name === preset.name }" @click="selectPreset(preset.name)">
        <span class="preset-name">{{ getPresetLabel(preset) }}</span>
        <span class="preset-size">{{ preset.baseSize }}px</span>
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
function toggleDropdown() {
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

.size-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--ld-bg-color, #ffffff);
  border: 1px solid var(--ld-border-color, #e0e0e0);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--ld-text-color, #333333);
  transition: all 0.2s ease;
}

.size-button:hover {
  background: var(--ld-bg-hover-color, #f5f5f5);
  border-color: var(--ld-primary-color, #1890ff);
}

.size-icon {
  font-size: 16px;
}

.size-text {
  font-weight: 500;
}

.dropdown-icon {
  font-size: 10px;
  opacity: 0.6;
}

.size-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 200px;
  background: var(--ld-bg-color, #ffffff);
  border: 1px solid var(--ld-border-color, #e0e0e0);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.size-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.size-option:hover {
  background: var(--ld-bg-hover-color, #f5f5f5);
}

.size-option.active {
  background: var(--ld-primary-color-light, #e6f7ff);
  color: var(--ld-primary-color, #1890ff);
}

.preset-name {
  font-weight: 500;
}

.preset-size {
  font-size: 12px;
  opacity: 0.7;
  font-family: 'Courier New', monospace;
}
</style>
