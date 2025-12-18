<template>
  <div ref="containerRef" :class="containerClass" :data-variant="variant || 'light'">
    <button type="button" :class="triggerClass" :disabled="disabled" :title="sizeTooltip" @click="isOpen = !isOpen">
      <Type :size="18" :stroke-width="2" />
    </button>

    <Transition name="ldesign-dropdown">
      <div v-if="isOpen" class="ldesign-size-switcher__dropdown">
        <div class="ldesign-size-switcher__arrow" />
        <div class="ldesign-size-switcher__header">
          <h4 class="ldesign-size-switcher__title">{{ titleText }}</h4>
        </div>
        <div class="ldesign-size-switcher__list">
          <div v-for="preset in presets" :key="preset.name" :class="[
            'ldesign-size-switcher__item',
            currentPreset?.name === preset.name && 'ldesign-size-switcher__item--active'
          ]" @click="selectPreset(preset.name)">
            <span class="ldesign-size-switcher__item-icon">
              <span
                :style="{ fontSize: `${Math.max(12, (preset.config?.baseSize || preset.baseSize || 16) - 2)}px` }">A</span>
            </span>
            <div class="ldesign-size-switcher__item-info">
              <span class="ldesign-size-switcher__item-label">{{ getPresetLabel(preset) }}</span>
              <span class="ldesign-size-switcher__item-desc">{{ getPresetDesc(preset) }}</span>
            </div>
            <Check v-if="currentPreset?.name === preset.name" :size="16" :stroke-width="3"
              class="ldesign-size-switcher__check" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import { Type, Check } from 'lucide-vue-next'
import type { SizePresetTheme } from '@ldesign/size-core'

// Props
const props = defineProps<{
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  title?: string
  translate?: (key: string) => string
  locale?: string | { value: string }
  variant?: 'light' | 'primary'
}>()

// 获取当前组件实例，访问全局属性
const instance = getCurrentInstance()
const sizeManager = instance?.appContext.config.globalProperties.$sizeManager
const containerRef = ref<HTMLElement | null>(null)

// 下拉菜单状态
const isOpen = ref(false)

// 响应式当前预设名称
const currentPresetName = ref<string | null>(sizeManager?.getCurrentPreset?.()?.name || null)

// 获取所有预设
const presets = computed<SizePresetTheme[]>(() => {
  return sizeManager?.getPresets?.() || []
})

// 当前预设
const currentPreset = computed(() => {
  // 使用 currentPresetName 触发响应式更新
  const name = currentPresetName.value
  if (!name) return sizeManager?.getCurrentPreset?.() || null
  return presets.value.find(p => p.name === name) || null
})

// 获取当前语言
const getCurrentLocale = (): string | undefined => {
  if (props.locale && typeof props.locale === 'object' && 'value' in props.locale) {
    return (props.locale as { value: string }).value
  } else if (typeof props.locale === 'string') {
    return props.locale
  }
  return undefined
}

// 判断是否中文
const isZh = computed(() => {
  const locale = getCurrentLocale() || ''
  return locale.toLowerCase().startsWith('zh') || locale.includes('cn')
})

// 标题文本
const titleText = computed(() => {
  if (props.title) return props.title
  if (props.translate) return props.translate('size.title')
  return isZh.value ? '尺寸管理' : 'Size Management'
})

// 尺寸提示文本
const sizeTooltip = computed(() => {
  if (props.translate) return props.translate('size.switchSize')
  return isZh.value ? '切换尺寸' : 'Switch Size'
})

// 触发器样式类
const triggerClass = computed(() => {
  const classes = ['ldesign-size-switcher__trigger']
  if (props.size === 'small') classes.push('ldesign-size-switcher__trigger--small')
  if (props.size === 'large') classes.push('ldesign-size-switcher__trigger--large')
  return classes.join(' ')
})

// 容器样式类
const containerClass = computed(() => {
  const classes = ['ldesign-size-switcher']
  if (props.disabled) classes.push('ldesign-size-switcher--disabled')
  return classes.join(' ')
})

// 获取预设标签
function getPresetLabel(preset: SizePresetTheme): string {
  if (props.translate) {
    const translated = props.translate(`size.presets.${preset.name}`)
    // 如果翻译返回的是键本身，说明没有翻译，回退到 label
    if (translated && !translated.startsWith('size.presets.')) {
      return translated
    }
  }
  return preset.label || preset.name
}

// 获取预设描述
function getPresetDesc(preset: SizePresetTheme): string {
  const baseSize = preset.config?.baseSize || (preset as any).baseSize || 16
  const scale = preset.config?.scale || (preset as any).scale || 1.25
  return `${baseSize}px · ${scale}x`
}

// 选择预设
function selectPreset(name: string) {
  console.log('[SizeSwitcher] selectPreset:', name, 'sizeManager:', sizeManager)
  if (sizeManager) {
    try {
      sizeManager.applyPreset(name)
      // 更新响应式状态
      currentPresetName.value = name
      console.log('[SizeSwitcher] applyPreset success, currentPreset:', sizeManager.getCurrentPreset?.())
    } catch (e) {
      console.error('[SizeSwitcher] applyPreset error:', e)
    }
  }
  isOpen.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
/* SizeSwitcher 组件样式 - 参考 ThemeColorPicker */
.ldesign-size-switcher {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.ldesign-size-switcher__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: all 150ms ease-out;
  color: #6b7280;
}

.ldesign-size-switcher__trigger:hover {
  border-color: var(--color-primary-400, #60a5fa);
  background: var(--color-primary-50, #eff6ff);
  color: var(--color-primary-500, #3b82f6);
}

/* ===== Variant-based trigger styling ===== */
.header-actions[data-variant="light"] .ldesign-size-switcher__trigger,
.ldesign-size-switcher[data-variant="light"] .ldesign-size-switcher__trigger,
.ldesign-size-switcher[variant="light"] .ldesign-size-switcher__trigger {
  background: var(--color-bg-hover, #f3f4f6);
  border-color: var(--color-border, #e5e7eb);
  color: var(--color-text-secondary, #6b7280);
}

.header-actions[data-variant="light"] .ldesign-size-switcher__trigger:hover,
.ldesign-size-switcher[data-variant="light"] .ldesign-size-switcher__trigger:hover,
.ldesign-size-switcher[variant="light"] .ldesign-size-switcher__trigger:hover {
  background: var(--color-fill-tertiary, #eef2f7);
}

.header-actions[data-variant="primary"] .ldesign-size-switcher__trigger,
.ldesign-size-switcher[data-variant="primary"] .ldesign-size-switcher__trigger,
.ldesign-size-switcher[variant="primary"] .ldesign-size-switcher__trigger {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.18);
  color: var(--color-text-inverse, #ffffff);
}

.header-actions[data-variant="primary"] .ldesign-size-switcher__trigger:hover,
.ldesign-size-switcher[data-variant="primary"] .ldesign-size-switcher__trigger:hover,
.ldesign-size-switcher[variant="primary"] .ldesign-size-switcher__trigger:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.28);
}

.ldesign-size-switcher__trigger--small {
  min-width: 28px;
  min-height: 28px;
  padding: 4px;
}

.ldesign-size-switcher__trigger--large {
  min-width: 40px;
  min-height: 40px;
  padding: 12px;
}

.ldesign-size-switcher__dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 320px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: visible;
}

.ldesign-size-switcher__arrow {
  position: absolute;
  top: -6px;
  right: 12px;
  width: 12px;
  height: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-right: none;
  border-bottom: none;
  transform: rotate(45deg);
  z-index: 10;
}

.ldesign-size-switcher__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
  border-radius: 12px 12px 0 0;
}

.ldesign-size-switcher__title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.ldesign-size-switcher__list {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.ldesign-size-switcher__list::-webkit-scrollbar {
  width: 6px;
}

.ldesign-size-switcher__list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.ldesign-size-switcher__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.ldesign-size-switcher__item:hover {
  background: #f3f4f6;
}

.ldesign-size-switcher__item--active {
  background: var(--color-primary-50, #eff6ff);
}

.ldesign-size-switcher__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-weight: 600;
  color: #6b7280;
  background: #f3f4f6;
  border-radius: 8px;
  flex-shrink: 0;
  transition: all 150ms ease-out;
}

.ldesign-size-switcher__item--active .ldesign-size-switcher__item-icon {
  color: #ffffff;
  background: var(--color-primary-500, #3b82f6);
}

.ldesign-size-switcher__item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ldesign-size-switcher__item-label {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
}

.ldesign-size-switcher__item-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
}

.ldesign-size-switcher__item--active .ldesign-size-switcher__item-label {
  color: var(--color-primary-600, #2563eb);
}

.ldesign-size-switcher__check {
  color: var(--color-primary-500, #3b82f6);
  flex-shrink: 0;
}

/* 下拉动画 */
.ldesign-dropdown-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ldesign-dropdown-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
}

.ldesign-dropdown-enter-from,
.ldesign-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.ldesign-size-switcher--disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* 暗色主题 */
[data-theme-mode="dark"] .ldesign-size-switcher__trigger,
[data-theme="dark"] .ldesign-size-switcher__trigger,
.dark .ldesign-size-switcher__trigger {
  background: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}

[data-theme-mode="dark"] .ldesign-size-switcher__trigger:hover,
[data-theme="dark"] .ldesign-size-switcher__trigger:hover,
.dark .ldesign-size-switcher__trigger:hover {
  background: #4b5563;
  border-color: var(--color-primary-400, #60a5fa);
}

[data-theme-mode="dark"] .ldesign-size-switcher__dropdown,
[data-theme="dark"] .ldesign-size-switcher__dropdown,
.dark .ldesign-size-switcher__dropdown {
  background: #1f2937;
  border-color: #374151;
}

[data-theme-mode="dark"] .ldesign-size-switcher__arrow,
[data-theme="dark"] .ldesign-size-switcher__arrow,
.dark .ldesign-size-switcher__arrow {
  background: #111827;
  border-color: #374151;
}

[data-theme-mode="dark"] .ldesign-size-switcher__header,
[data-theme="dark"] .ldesign-size-switcher__header,
.dark .ldesign-size-switcher__header {
  background: #111827;
  border-color: #374151;
}

[data-theme-mode="dark"] .ldesign-size-switcher__title,
[data-theme="dark"] .ldesign-size-switcher__title,
.dark .ldesign-size-switcher__title {
  color: #f3f4f6;
}

[data-theme-mode="dark"] .ldesign-size-switcher__item:hover,
[data-theme="dark"] .ldesign-size-switcher__item:hover,
.dark .ldesign-size-switcher__item:hover {
  background: #374151;
}

[data-theme-mode="dark"] .ldesign-size-switcher__item--active,
[data-theme="dark"] .ldesign-size-switcher__item--active,
.dark .ldesign-size-switcher__item--active {
  background: var(--color-primary-900, rgba(59, 130, 246, 0.15));
}

[data-theme-mode="dark"] .ldesign-size-switcher__item-icon,
[data-theme="dark"] .ldesign-size-switcher__item-icon,
.dark .ldesign-size-switcher__item-icon {
  background: #374151;
  color: #9ca3af;
}

[data-theme-mode="dark"] .ldesign-size-switcher__item--active .ldesign-size-switcher__item-icon,
[data-theme="dark"] .ldesign-size-switcher__item--active .ldesign-size-switcher__item-icon,
.dark .ldesign-size-switcher__item--active .ldesign-size-switcher__item-icon {
  background: var(--color-primary-500, #3b82f6);
  color: #ffffff;
}

[data-theme-mode="dark"] .ldesign-size-switcher__item-label,
[data-theme="dark"] .ldesign-size-switcher__item-label,
.dark .ldesign-size-switcher__item-label {
  color: #f3f4f6;
}

[data-theme-mode="dark"] .ldesign-size-switcher__item-desc,
[data-theme="dark"] .ldesign-size-switcher__item-desc,
.dark .ldesign-size-switcher__item-desc {
  color: #9ca3af;
}
</style>
