<script setup lang="ts">
/**
 * SizeSelector - 基于无头逻辑层重构
 * 使用 @ldesign/shared 的协议和逻辑层
 */
import type { SizeLocale } from '../locales'
import { computed, inject, ref } from 'vue'
import type { SelectorConfig, SelectorOption } from '@ldesign/shared/protocols'
import { useHeadlessSelector, useResponsivePopup } from '@ldesign/shared/composables'
import { renderIcon } from '@ldesign/shared/icons'
import { getLocale } from '../locales'
import { SIZE_CUSTOM_LOCALE_KEY, SIZE_LOCALE_KEY } from './plugin'
import { useSize } from './useSize'

const {
  currentPreset,
  applyPreset,
  presets: presetsRef
} = useSize()

const presets = computed(() => presetsRef.value || [])

// 如果没有预设选项，则不显示组件
const hasPresets = computed(() => presets.value.length > 0)

// 国际化
const appLocale = inject<any>('locale', null)
const pluginLocale = inject(SIZE_LOCALE_KEY, 'zh-CN')
const customLocale = inject<Partial<SizeLocale> | undefined>(SIZE_CUSTOM_LOCALE_KEY, undefined)

const currentLocale = computed(() => {
  if (appLocale && appLocale.value) {
    return appLocale.value
  }
  return pluginLocale
})

const t = computed(() => {
  const baseLocale = getLocale(currentLocale.value)
  if (!customLocale) return baseLocale

  return {
    ...baseLocale,
    title: customLocale.title || baseLocale.title,
    presets: { ...baseLocale.presets, ...customLocale.presets },
    descriptions: { ...baseLocale.descriptions, ...customLocale.descriptions }
  }
})

function getPresetLabel(name: string): string {
  return t.value.presets[name] || name
}

function getPresetDescription(name: string): string {
  return t.value.descriptions[name] || ''
}

// 选择器配置（遵循协议）
const config: SelectorConfig = {
  icon: 'ALargeSmall',
  popupMode: 'auto',
  listStyle: 'card',
  searchable: false,
  breakpoint: 768
}

// 转换为 SelectorOption 格式
const options = computed<SelectorOption[]>(() => {
  return presets.value.map(preset => ({
    value: preset.name,
    label: getPresetLabel(preset.name),
    description: getPresetDescription(preset.name),
    badge: `${preset.baseSize}px`,
    metadata: {
      baseSize: preset.baseSize
    }
  }))
})

// 使用无头选择器
const { state, actions, triggerRef, panelRef, activeIndexRef } = useHeadlessSelector({
  options,
  modelValue: currentPreset,
  searchable: config.searchable,
  onSelect: (value) => {
    applyPreset(value)
  }
})

// 使用响应式弹出
const { currentMode, popupStyle } = useResponsivePopup({
  mode: config.popupMode,
  triggerRef,
  panelRef,
  placement: 'bottom-end',
  breakpoint: config.breakpoint,
  isOpen: computed(() => state.value.isOpen)
})

// 图标 SVG
const iconSvg = renderIcon('ALargeSmall', { size: 24 })
</script>

<template>
  <div v-if="hasPresets" class="size-selector">
    <!-- 触发按钮 -->
    <button ref="triggerRef" class="size-trigger" :aria-expanded="state.isOpen" :aria-label="t?.ariaLabel || '调整尺寸'"
      @click="actions.toggle">
      <span class="size-icon" v-html="iconSvg" />
      <span class="size-label">{{ t?.title || '尺寸' }}</span>
      <svg class="arrow" :class="{ open: state.isOpen }" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <!-- 弹出面板 -->
    <Teleport to="body">
      <Transition name="selector-panel">
        <div v-if="state.isOpen" ref="panelRef" class="size-panel"
          :class="{ 'size-panel-dialog': currentMode === 'dialog' }" :style="popupStyle" @click.stop>
          <div class="size-panel-header">
            <h3 class="size-panel-title">
              {{ t?.title || '选择尺寸' }}
            </h3>
            <button class="size-panel-close" :aria-label="t?.close || '关闭'" @click="actions.close">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div class="size-panel-content">
            <div v-for="(option, index) in state.filteredOptions" :key="option.value" class="size-option" :class="{
              'size-option-active': state.selectedValue === option.value,
              'size-option-hover': state.activeIndex === index
            }" @click="actions.select(option.value)" @mouseenter="activeIndexRef = index">
              <div class="size-option-main">
                <div class="size-option-label">
                  {{ option.label }}
                </div>
                <div class="size-option-desc">
                  {{ option.description }}
                </div>
              </div>
              <div class="size-option-badge">
                {{ option.badge }}
              </div>
              <svg v-if="state.selectedValue === option.value" class="size-option-check"
                xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.size-selector {
  position: relative;
  display: inline-block;
}

/* 触发按钮 - 使用 CSS 变量统一样式 */
.size-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--size-spacing-md);
  padding: var(--size-spacing-md) var(--size-spacing-lg);
  background: var(--color-bg-container);
  border: var(--size-border-width-thin) solid var(--color-border-light);
  border-radius: var(--size-radius-lg);
  color: var(--color-text-primary);
  font-size: var(--size-font-base);
  font-weight: var(--size-font-weight-medium);
  cursor: pointer;
  transition: all var(--size-duration-fast) var(--size-ease-out);
  white-space: nowrap;
}

.size-trigger:hover {
  background: var(--color-bg-component-hover);
  border-color: var(--color-border);
}

.size-trigger[aria-expanded="true"] {
  border-color: var(--color-primary-default);
  box-shadow: 0 0 0 2px var(--color-primary-lighter);
}

.size-icon {
  display: flex;
  align-items: center;
  font-size: var(--size-icon-large);
  line-height: 1;
}

.size-label {
  flex: 1;
}

.arrow {
  transition: transform var(--size-duration-fast) var(--size-ease-out);
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.arrow.open {
  transform: rotate(180deg);
}

/* 弹窗面板 - 使用 CSS 变量 */
.size-panel {
  min-width: 320px;
  background: var(--color-bg-container);
  border-radius: var(--size-radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.size-panel-dialog {
  /* Dialog 模式特殊样式 */
  max-width: 90vw;
  max-height: 80vh;
}

.size-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.size-panel-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.size-panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.15s ease;
}

.size-panel-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1a1a1a;
}

.size-panel-content {
  padding: 8px;
  max-height: 400px;
  overflow-y: auto;
}

/* 尺寸选项 - 使用 CSS 变量统一样式 */
.size-option {
  display: flex;
  align-items: center;
  gap: var(--size-spacing-lg);
  padding: var(--size-spacing-lg) var(--size-spacing-xl);
  border-radius: var(--size-radius-md);
  cursor: pointer;
  transition: all var(--size-duration-fast) var(--size-ease-out);
  border: var(--size-border-width-medium) solid transparent;
}

.size-option:hover,
.size-option-hover {
  background: var(--color-bg-component-hover);
}

.size-option-active {
  background: color-mix(in srgb, var(--color-primary-default) 8%, transparent);
  border-color: color-mix(in srgb, var(--color-primary-default) 30%, transparent);
}

.size-option-active:hover {
  background: color-mix(in srgb, var(--color-primary-default) 8%, transparent);
}

.size-option-main {
  flex: 1;
  min-width: 0;
}

.size-option-label {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.size-option-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.size-option-badge {
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.05);
  font-size: 12px;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
}

.size-option-active .size-option-badge {
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
}

.size-option-check {
  color: #667eea;
  flex-shrink: 0;
}

.size-option-active .size-option-label {
  color: #667eea;
  font-weight: 600;
}

/* 动画 - 统一标准 */
.selector-panel-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.selector-panel-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.selector-panel-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.selector-panel-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 响应式 */
@media (max-width: 640px) {
  .size-panel {
    left: 0;
    right: 0;
    min-width: auto;
    width: calc(100vw - 32px);
    max-width: 400px;
  }
}

/* 滚动条样式 */
.size-panel-content::-webkit-scrollbar {
  width: 6px;
}

.size-panel-content::-webkit-scrollbar-track {
  background: transparent;
}

.size-panel-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.size-panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}

/* 深色模式会自动通过 CSS 变量切换,无需额外定义 */
/* CSS 变量在 :root[data-theme-mode='dark'] 下会自动更新 */
</style>
