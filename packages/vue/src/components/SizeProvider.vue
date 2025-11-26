<template>
  <div class="size-provider" :data-size="currentSize">
    <slot 
      :size="currentSize"
      :config="config"
      :applyPreset="applyPreset"
      :setBaseSize="setBaseSize"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * SizeProvider - 尺寸上下文提供者组件
 * 
 * 为子组件提供尺寸上下文，支持插槽属性传递
 * 
 * @example
 * ```vue
 * <SizeProvider>
 *   <template #default="{ size, applyPreset }">
 *     <button @click="applyPreset('large')">
 *       当前尺寸: {{ size }}
 *     </button>
 *   </template>
 * </SizeProvider>
 * ```
 */

import { computed } from 'vue'
import { useSize } from '../composables/useSize'

const { config, currentPreset, applyPreset, setBaseSize } = useSize()

const currentSize = computed(() => currentPreset.value)
</script>

<style scoped>
.size-provider {
  display: contents;
}
</style>