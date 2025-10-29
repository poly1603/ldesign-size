<script setup lang="ts">
/**
 * Simple SizeSelector - 用于示例演示
 */
import { useSize } from '../composables/useSize'

const { currentPreset, presets, applyPreset } = useSize()

interface Props {
  variant?: 'select' | 'buttons'
  buttonSize?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'select',
  buttonSize: 'medium'
})
</script>

<template>
  <div class="size-selector">
    <select 
      v-if="props.variant === 'select'"
      :value="currentPreset"
      @change="applyPreset(($event.target as HTMLSelectElement).value)"
      class="size-select"
    >
      <option v-for="preset in presets" :key="preset.name" :value="preset.name">
        {{ preset.label }}
      </option>
    </select>
    
    <div v-else class="size-buttons">
      <button
        v-for="preset in presets"
        :key="preset.name"
        @click="applyPreset(preset.name)"
        :class="['size-btn', `size-btn-${props.buttonSize}`, { active: currentPreset === preset.name }]"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.size-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.size-buttons {
  display: flex;
  gap: 0.5rem;
}

.size-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.size-btn:hover {
  border-color: #999;
}

.size-btn.active {
  background: #0066ff;
  color: white;
  border-color: #0066ff;
}

.size-btn-small {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.size-btn-large {
  font-size: 1.125rem;
  padding: 0.625rem 1.25rem;
}
</style>

