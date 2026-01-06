<template>
  <div ref="containerRef" :class="containerClass" :data-variant="variant || 'light'">
    <!-- 触发按钮 -->
    <button 
      type="button" 
      :class="triggerClass" 
      :disabled="disabled" 
      :title="sizeTooltip" 
      :aria-label="sizeTooltip"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      @click="toggleDropdown"
      @keydown.escape="closeDropdown"
    >
      <Type :size="iconSize" :stroke-width="2" />
    </button>

    <!-- 下拉菜单 -->
    <Transition name="ldesign-dropdown">
      <div 
        v-if="isOpen" 
        class="ldesign-size-switcher__dropdown"
        role="listbox"
        :aria-label="titleText"
      >
        <div class="ldesign-size-switcher__arrow" />
        <div class="ldesign-size-switcher__header">
          <h4 class="ldesign-size-switcher__title">{{ titleText }}</h4>
          <span class="ldesign-size-switcher__current-label">{{ currentPresetLabel }}</span>
        </div>
        <div class="ldesign-size-switcher__list">
          <button
            v-for="preset in presets" 
            :key="preset.name" 
            type="button"
            :class="[
              'ldesign-size-switcher__item',
              currentPreset?.name === preset.name && 'ldesign-size-switcher__item--active'
            ]" 
            role="option"
            :aria-selected="currentPreset?.name === preset.name"
            @click="selectPreset(preset.name)"
            @keydown.enter="selectPreset(preset.name)"
          >
            <span class="ldesign-size-switcher__item-icon">
              <span :style="{ fontSize: getPreviewFontSize(preset) }">Aa</span>
            </span>
            <div class="ldesign-size-switcher__item-info">
              <span class="ldesign-size-switcher__item-label">{{ getPresetLabel(preset) }}</span>
              <span class="ldesign-size-switcher__item-desc">{{ getPresetDesc(preset) }}</span>
            </div>
            <Transition name="ldesign-check">
              <Check 
                v-if="currentPreset?.name === preset.name" 
                :size="16" 
                :stroke-width="3"
                class="ldesign-size-switcher__check" 
              />
            </Transition>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/**
 * SizeSwitcher - 尺寸切换器组件
 * 
 * 提供一个美观的下拉菜单来切换应用的尺寸预设
 * 
 * @example
 * ```vue
 * <SizeSwitcher variant="light" size="medium" />
 * ```
 */
import { computed, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import { Type, Check } from 'lucide-vue-next'
import type { SizePresetTheme } from '@ldesign/size-core'

/** 组件 Props 定义 */
interface SizeSwitcherProps {
  /** 是否禁用 */
  disabled?: boolean
  /** 按钮尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 自定义标题 */
  title?: string
  /** 翻译函数 */
  translate?: (key: string) => string
  /** 语言设置 */
  locale?: string | { value: string }
  /** 样式变体 */
  variant?: 'light' | 'primary'
}

// Props
const props = withDefaults(defineProps<SizeSwitcherProps>(), {
  disabled: false,
  size: 'medium',
  variant: 'light'
})

// Emits
const emit = defineEmits<{
  /** 预设变化事件 */
  (e: 'change', presetName: string): void
}>()

// 获取当前组件实例，访问全局属性
const instance = getCurrentInstance()
const sizeManager = instance?.appContext.config.globalProperties.$sizeManager
const containerRef = ref<HTMLElement | null>(null)

// 下拉菜单状态
const isOpen = ref(false)

// 响应式当前预设名称
const currentPresetName = ref<string | null>(
  sizeManager?.getCurrentPreset?.() || null
)

// 获取所有预设
const presets = computed<SizePresetTheme[]>(() => {
  return sizeManager?.getPresets?.() || []
})

// 当前预设
const currentPreset = computed(() => {
  const name = currentPresetName.value
  if (!name) return sizeManager?.getCurrentPreset?.() || null
  return presets.value.find(p => p.name === name) || null
})

// 当前预设标签
const currentPresetLabel = computed(() => {
  if (!currentPreset.value) return ''
  return getPresetLabel(currentPreset.value)
})

// 图标大小
const iconSize = computed(() => {
  switch (props.size) {
    case 'small': return 14
    case 'large': return 22
    default: return 18
  }
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
  return isZh.value ? '尺寸设置' : 'Size'
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
  if (isOpen.value) classes.push('ldesign-size-switcher__trigger--active')
  return classes.join(' ')
})

// 容器样式类
const containerClass = computed(() => {
  const classes = ['ldesign-size-switcher']
  if (props.disabled) classes.push('ldesign-size-switcher--disabled')
  if (isOpen.value) classes.push('ldesign-size-switcher--open')
  return classes.join(' ')
})

/** 获取预设标签 */
function getPresetLabel(preset: SizePresetTheme): string {
  if (props.translate) {
    const translated = props.translate(`size.presets.${preset.name}`)
    if (translated && !translated.startsWith('size.presets.')) {
      return translated
    }
  }
  return preset.label || preset.name
}

/** 获取预设描述 */
function getPresetDesc(preset: SizePresetTheme): string {
  const baseSize = preset.config?.baseSize || (preset as any).baseSize || 16
  return `${baseSize}px`
}

/** 获取预览字体大小 */
function getPreviewFontSize(preset: SizePresetTheme): string {
  const baseSize = preset.config?.baseSize || (preset as any).baseSize || 16
  // 映射到合理的预览大小范围 (12-18px)
  const previewSize = Math.max(12, Math.min(18, baseSize - 2))
  return `${previewSize}px`
}

/** 切换下拉菜单 */
function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

/** 关闭下拉菜单 */
function closeDropdown() {
  isOpen.value = false
}

/** 选择预设 */
function selectPreset(name: string) {
  if (sizeManager) {
    try {
      sizeManager.applyPreset(name)
      currentPresetName.value = name
      emit('change', name)
    } catch (e) {
      console.error('[SizeSwitcher] applyPreset error:', e)
    }
  }
  closeDropdown()
}

/** 点击外部关闭下拉菜单 */
function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    closeDropdown()
  }
}

/** 键盘导航 */
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style>
/* SizeSwitcher 组件样式 */
.ldesign-size-switcher {
  position: relative;
  display: inline-flex;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 触发按钮 */
.ldesign-size-switcher__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  background: var(--color-bg, #ffffff);
  cursor: pointer;
  transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-text-secondary, #6b7280);
  outline: none;
}

.ldesign-size-switcher__trigger:hover {
  border-color: var(--color-primary-400, #60a5fa);
  background: var(--color-primary-50, #eff6ff);
  color: var(--color-primary-500, #3b82f6);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.ldesign-size-switcher__trigger:focus-visible {
  border-color: var(--color-primary-500, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.ldesign-size-switcher__trigger--active {
  border-color: var(--color-primary-500, #3b82f6);
  background: var(--color-primary-50, #eff6ff);
  color: var(--color-primary-600, #2563eb);
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

/* 下拉菜单 */
.ldesign-size-switcher__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: var(--color-bg, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 10px 20px -5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

/* 箭头 */
.ldesign-size-switcher__arrow {
  position: absolute;
  top: -6px;
  right: 14px;
  width: 12px;
  height: 12px;
  background: var(--color-bg-secondary, #f9fafb);
  border: 1px solid var(--color-border, #e5e7eb);
  border-right: none;
  border-bottom: none;
  transform: rotate(45deg);
  z-index: 10;
}

/* 头部 */
.ldesign-size-switcher__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-light, #f3f4f6);
  background: var(--color-bg-secondary, #f9fafb);
}

.ldesign-size-switcher__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text, #1f2937);
  margin: 0;
  letter-spacing: -0.01em;
}

.ldesign-size-switcher__current-label {
  font-size: 12px;
  color: var(--color-primary-500, #3b82f6);
  font-weight: 500;
  padding: 2px 8px;
  background: var(--color-primary-50, #eff6ff);
  border-radius: 4px;
}

/* 列表 */
.ldesign-size-switcher__list {
  max-height: 320px;
  overflow-y: auto;
  padding: 6px;
}

.ldesign-size-switcher__list::-webkit-scrollbar {
  width: 4px;
}

.ldesign-size-switcher__list::-webkit-scrollbar-thumb {
  background: var(--color-border, #d1d5db);
  border-radius: 2px;
}

.ldesign-size-switcher__list::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary, #9ca3af);
}

/* 列表项 */
.ldesign-size-switcher__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  text-align: left;
}

.ldesign-size-switcher__item:hover {
  background: var(--color-bg-hover, #f3f4f6);
}

.ldesign-size-switcher__item:focus-visible {
  outline: 2px solid var(--color-primary-500, #3b82f6);
  outline-offset: -2px;
}

.ldesign-size-switcher__item--active {
  background: var(--color-primary-50, #eff6ff);
}

/* 项目图标 */
.ldesign-size-switcher__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-weight: 700;
  color: var(--color-text-tertiary, #6b7280);
  background: var(--color-bg-hover, #f3f4f6);
  border-radius: 8px;
  flex-shrink: 0;
  transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.ldesign-size-switcher__item:hover .ldesign-size-switcher__item-icon {
  transform: scale(1.05);
}

.ldesign-size-switcher__item--active .ldesign-size-switcher__item-icon {
  color: #ffffff;
  background: var(--color-primary-500, #3b82f6);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* 项目信息 */
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
  color: var(--color-text, #1f2937);
  line-height: 1.4;
}

.ldesign-size-switcher__item-desc {
  font-size: 11px;
  color: var(--color-text-tertiary, #9ca3af);
  line-height: 1.3;
  font-family: "SF Mono", Monaco, Consolas, monospace;
}

.ldesign-size-switcher__item--active .ldesign-size-switcher__item-label {
  color: var(--color-primary-600, #2563eb);
  font-weight: 600;
}

.ldesign-size-switcher__item--active .ldesign-size-switcher__item-desc {
  color: var(--color-primary-500, #3b82f6);
}

/* 选中图标 */
.ldesign-size-switcher__check {
  color: var(--color-primary-500, #3b82f6);
  flex-shrink: 0;
}

/* 下拉动画 */
.ldesign-dropdown-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ldesign-dropdown-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
}

.ldesign-dropdown-enter-from,
.ldesign-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

/* 选中图标动画 */
.ldesign-check-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ldesign-check-leave-active {
  transition: all 0.1s ease-out;
}

.ldesign-check-enter-from,
.ldesign-check-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

/* 禁用状态 */
.ldesign-size-switcher--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.ldesign-size-switcher--disabled .ldesign-size-switcher__trigger {
  cursor: not-allowed;
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
