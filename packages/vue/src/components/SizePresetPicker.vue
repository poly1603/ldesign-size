<template>
  <div class="size-preset-picker">
    <button
      v-for="preset in presets"
      :key="preset.name"
      :class="['preset-item', { active: isActive(preset.name) }]"
      @click="selectPreset(preset.name)"
    >
      <div class="preset-info">
        <span class="preset-name">{{ presetName(preset.name) }}</span>
        <span class="preset-description">{{ presetDescription(preset.name) }}</span>
      </div>
      <div class="preset-config">
        <span class="config-item">{{ preset.config.baseSize }}px</span>
        <span class="config-item">×{{ preset.config.scale }}</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { BaseSizeAdapter } from '@ldesign/size-core'
import { sortPresets, sizePresetThemes } from '@ldesign/size-core'
import { SIZE_SYMBOL } from '../constants'

/**
 * 尺寸预设选择器组件
 * 
 * 显示所有可用的尺寸预设，支持选择和切换
 */

// 注入 Size 适配器
const sizeAdapter = inject<BaseSizeAdapter>(SIZE_SYMBOL, undefined as any)

/**
 * 所有预设列表（合并后的）
 */
const presets = computed(() => {
  if (sizeAdapter && sizeAdapter.getPresets) {
    return sizeAdapter.getPresets()
  }
  
  // 降级：使用内置预设
  return sortPresets(sizePresetThemes)
})

/**
 * 当前选中的预设
 */
const currentPreset = computed(() => {
  if (sizeAdapter && sizeAdapter.getCurrentPreset) {
    return sizeAdapter.getCurrentPreset()
  }
  return null
})

/**
 * 判断预设是否激活
 */
function isActive(name: string): boolean {
  return currentPreset.value?.name === name
}

/**
 * 选择预设
 */
function selectPreset(name: string): void {
  if (sizeAdapter && sizeAdapter.applyPreset) {
    sizeAdapter.applyPreset(name)
  }
}

/**
 * 获取预设名称（支持 i18n）
 */
function presetName(name: string): string {
  // TODO: 集成 i18n
  // const { t } = useI18n()
  // return t(`size.presets.${name}`)
  
  const preset = presets.value.find(p => p.name === name)
  return preset?.label || name
}

/**
 * 获取预设描述（支持 i18n）
 */
function presetDescription(name: string): string {
  // TODO: 集成 i18n
  // const { t } = useI18n()
  // return t(`size.descriptions.${name}`)
  
  const preset = presets.value.find(p => p.name === name)
  return preset?.description || ''
}
</script>

<style scoped>
.size-preset-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
}

.preset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.preset-item:hover {
  background: #e8e8e8;
  transform: translateX(4px);
}

.preset-item.active {
  background: #e6f7ff;
  border-color: #1890ff;
}

.preset-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.preset-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.preset-description {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preset-config {
  display: flex;
  gap: 8px;
  align-items: center;
}

.config-item {
  font-size: 12px;
  color: #999;
  font-family: 'Courier New', monospace;
}

.preset-item.active .preset-name {
  color: #1890ff;
}

.preset-item.active .config-item {
  color: #1890ff;
}
</style>

