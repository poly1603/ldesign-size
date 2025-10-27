# Vue 组件示例

本文档展示 @ldesign/size 在 Vue 组件中的各种使用方式。

## 🎯 基础组件

### 按钮组件

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useSize } from '@ldesign/size/vue'
import type { SizeMode } from '@ldesign/size'

interface Props {
  type?: 'primary' | 'default' | 'dashed'
  size?: SizeMode | 'auto'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'auto',
  disabled: false,
  loading: false
})

const { currentMode } = useSize()

// 自动或手动指定尺寸
const buttonSize = computed(() => {
  return props.size === 'auto' ? currentMode.value : props.size
})

const buttonClass = computed(() => [
  'custom-button',
  `custom-button--${props.type}`,
  `custom-button--${buttonSize.value}`,
  {
    'custom-button--disabled': props.disabled,
    'custom-button--loading': props.loading
  }
])
</script>

<template>
  <button :class="buttonClass" :disabled="disabled || loading">
    <span v-if="loading" class="loading-icon">⏳</span>
    <slot />
  </button>
</template>

<style scoped>
.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ls-spacing-xs);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-sm);
  font-weight: 500;
  border: var(--ls-border-width-base) solid transparent;
  border-radius: var(--ls-border-radius-base);
  cursor: pointer;
  transition: all var(--ls-duration-base);
  user-select: none;
}

.custom-button--small {
  height: var(--ls-button-height-small);
  font-size: var(--ls-font-size-xs);
  padding: 0 var(--ls-spacing-sm);
}

.custom-button--medium {
  height: var(--ls-button-height-medium);
}

.custom-button--large {
  height: var(--ls-button-height-large);
  font-size: var(--ls-font-size-base);
  padding: 0 var(--ls-spacing-lg);
}

.custom-button--default {
  background: white;
  border-color: #d9d9d9;
  color: #333;
}

.custom-button--default:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.custom-button--primary {
  background: #1890ff;
  color: white;
}

.custom-button--primary:hover:not(:disabled) {
  background: #40a9ff;
}

.custom-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

### 卡片组件

```vue
<script setup lang="ts">
import { useSize } from '@ldesign/size/vue'

interface Props {
  title?: string
  hoverable?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: false,
  bordered: true
})

const { currentMode } = useSize()

const cardClass = computed(() => [
  'custom-card',
  `custom-card--${currentMode.value}`,
  {
    'custom-card--hoverable': props.hoverable,
    'custom-card--bordered': props.bordered
  }
])
</script>

<template>
  <div :class="cardClass">
    <div v-if="title || $slots.header" class="custom-card__header">
      <slot name="header">
        <h3 class="custom-card__title">{{ title }}</h3>
      </slot>
    </div>
    
    <div class="custom-card__body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="custom-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.custom-card {
  background: white;
  border-radius: var(--ls-border-radius-lg);
  overflow: hidden;
  transition: all var(--ls-duration-base);
}

.custom-card--bordered {
  border: var(--ls-border-width-base) solid #f0f0f0;
}

.custom-card--hoverable:hover {
  box-shadow: var(--ls-shadow-lg);
  transform: translateY(-2px);
}

.custom-card--small {
  --card-padding: var(--ls-spacing-sm);
}

.custom-card--medium {
  --card-padding: var(--ls-spacing-base);
}

.custom-card--large {
  --card-padding: var(--ls-spacing-lg);
}

.custom-card__header {
  padding: var(--card-padding);
  border-bottom: var(--ls-border-width-base) solid #f0f0f0;
}

.custom-card__title {
  margin: 0;
  font-size: var(--ls-font-size-lg);
  font-weight: 600;
  color: #333;
}

.custom-card__body {
  padding: var(--card-padding);
}

.custom-card__footer {
  padding: var(--card-padding);
  border-top: var(--ls-border-width-base) solid #f0f0f0;
  background: #fafafa;
}
</style>
```

### 输入框组件

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSize } from '@ldesign/size/vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  type?: string
  maxlength?: number
  showCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  showCount: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const { currentMode } = useSize()

const isFocused = ref(false)

const inputClass = computed(() => [
  'custom-input',
  `custom-input--${currentMode.value}`,
  {
    'custom-input--focused': isFocused.value,
    'custom-input--disabled': props.disabled
  }
])

const charCount = computed(() => props.modelValue?.length || 0)

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleFocus(e: FocusEvent) {
  isFocused.value = true
  emit('focus', e)
}

function handleBlur(e: FocusEvent) {
  isFocused.value = false
  emit('blur', e)
}
</script>

<template>
  <div class="custom-input-wrapper">
    <input
      :class="inputClass"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    
    <div v-if="showCount && maxlength" class="custom-input__count">
      {{ charCount }} / {{ maxlength }}
    </div>
  </div>
</template>

<style scoped>
.custom-input-wrapper {
  position: relative;
}

.custom-input {
  width: 100%;
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-base);
  color: #333;
  background: white;
  border: var(--ls-border-width-base) solid #d9d9d9;
  border-radius: var(--ls-border-radius-base);
  transition: all var(--ls-duration-base);
  outline: none;
}

.custom-input--small {
  height: var(--ls-input-height-small);
  font-size: var(--ls-font-size-sm);
  padding: 0 var(--ls-spacing-sm);
}

.custom-input--medium {
  height: var(--ls-input-height-medium);
}

.custom-input--large {
  height: var(--ls-input-height-large);
  font-size: var(--ls-font-size-lg);
  padding: 0 var(--ls-spacing-lg);
}

.custom-input:hover:not(:disabled) {
  border-color: #40a9ff;
}

.custom-input--focused {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.custom-input--disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.custom-input__count {
  position: absolute;
  right: var(--ls-spacing-base);
  bottom: -20px;
  font-size: var(--ls-font-size-xs);
  color: #999;
}
</style>
```

## 📋 表单组件

### 表单项组件

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useSize } from '@ldesign/size/vue'

interface Props {
  label?: string
  required?: boolean
  error?: string
  help?: string
}

const props = defineProps<Props>()

const { currentMode } = useSize()
</script>

<template>
  <div class="form-item" :class="`form-item--${currentMode}`">
    <label v-if="label" class="form-item__label">
      <span v-if="required" class="form-item__required">*</span>
      {{ label }}
    </label>
    
    <div class="form-item__control">
      <slot />
    </div>
    
    <div v-if="error" class="form-item__error">
      {{ error }}
    </div>
    
    <div v-if="help && !error" class="form-item__help">
      {{ help }}
    </div>
  </div>
</template>

<style scoped>
.form-item {
  margin-bottom: var(--ls-spacing-lg);
}

.form-item__label {
  display: block;
  margin-bottom: var(--ls-spacing-xs);
  font-size: var(--ls-font-size-sm);
  font-weight: 600;
  color: #333;
}

.form-item__required {
  color: #ff4d4f;
  margin-right: 4px;
}

.form-item__control {
  position: relative;
}

.form-item__error {
  margin-top: var(--ls-spacing-xs);
  font-size: var(--ls-font-size-xs);
  color: #ff4d4f;
}

.form-item__help {
  margin-top: var(--ls-spacing-xs);
  font-size: var(--ls-font-size-xs);
  color: #999;
}
</style>
```

## 🎨 布局组件

### Grid 布局

```vue
<script setup lang="ts">
import { useSize } from '@ldesign/size/vue'

interface Props {
  cols?: number | 'auto'
  gap?: 'sm' | 'base' | 'lg'
  responsive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cols: 'auto',
  gap: 'base',
  responsive: true
})

const { currentMode } = useSize()

const gridStyle = computed(() => {
  const gapMap = {
    sm: 'var(--ls-spacing-sm)',
    base: 'var(--ls-spacing-base)',
    lg: 'var(--ls-spacing-lg)'
  }
  
  let columns: number
  if (props.cols === 'auto') {
    // 响应式列数
    const colsMap = {
      small: 1,
      medium: 2,
      large: 3
    }
    columns = props.responsive ? colsMap[currentMode.value] : 2
  } else {
    columns = props.cols
  }
  
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gapMap[props.gap]
  }
})
</script>

<template>
  <div class="grid-layout" :style="gridStyle">
    <slot />
  </div>
</template>

<style scoped>
.grid-layout {
  width: 100%;
}
</style>
```

### Stack 布局

```vue
<script setup lang="ts">
interface Props {
  direction?: 'vertical' | 'horizontal'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  gap?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  wrap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'vertical',
  align: 'stretch',
  justify: 'start',
  gap: 'base',
  wrap: false
})

const stackClass = computed(() => [
  'stack',
  `stack--${props.direction}`,
  `stack--gap-${props.gap}`,
  `stack--align-${props.align}`,
  `stack--justify-${props.justify}`,
  {
    'stack--wrap': props.wrap
  }
])
</script>

<template>
  <div :class="stackClass">
    <slot />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
}

.stack--vertical {
  flex-direction: column;
}

.stack--horizontal {
  flex-direction: row;
}

.stack--wrap {
  flex-wrap: wrap;
}

/* Gap */
.stack--gap-xs {
  gap: var(--ls-spacing-xs);
}

.stack--gap-sm {
  gap: var(--ls-spacing-sm);
}

.stack--gap-base {
  gap: var(--ls-spacing-base);
}

.stack--gap-lg {
  gap: var(--ls-spacing-lg);
}

.stack--gap-xl {
  gap: var(--ls-spacing-xl);
}

/* Align */
.stack--align-start {
  align-items: flex-start;
}

.stack--align-center {
  align-items: center;
}

.stack--align-end {
  align-items: flex-end;
}

.stack--align-stretch {
  align-items: stretch;
}

/* Justify */
.stack--justify-start {
  justify-content: flex-start;
}

.stack--justify-center {
  justify-content: center;
}

.stack--justify-end {
  justify-content: flex-end;
}

.stack--justify-between {
  justify-content: space-between;
}

.stack--justify-around {
  justify-content: space-around;
}
</style>
```

## 🎭 完整示例

### 用户资料卡片

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useSize } from '@ldesign/size/vue'
import CustomButton from './CustomButton.vue'
import CustomCard from './CustomCard.vue'

interface UserProfile {
  name: string
  avatar: string
  bio: string
  stats: {
    posts: number
    followers: number
    following: number
  }
}

const props = defineProps<{
  user: UserProfile
}>()

const { currentMode } = useSize()

const isFollowing = ref(false)

function toggleFollow() {
  isFollowing.value = !isFollowing.value
}
</script>

<template>
  <CustomCard :hoverable="true" class="user-profile">
    <template #header>
      <div class="profile-header">
        <img :src="user.avatar" alt="Avatar" class="avatar" />
        <div class="user-info">
          <h3 class="username">{{ user.name }}</h3>
          <p class="bio">{{ user.bio }}</p>
        </div>
      </div>
    </template>
    
    <div class="stats">
      <div class="stat-item">
        <div class="stat-value">{{ user.stats.posts }}</div>
        <div class="stat-label">帖子</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ user.stats.followers }}</div>
        <div class="stat-label">粉丝</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ user.stats.following }}</div>
        <div class="stat-label">关注</div>
      </div>
    </div>
    
    <template #footer>
      <div class="actions">
        <CustomButton
          :type="isFollowing ? 'default' : 'primary'"
          @click="toggleFollow"
        >
          {{ isFollowing ? '已关注' : '关注' }}
        </CustomButton>
        <CustomButton>发消息</CustomButton>
      </div>
    </template>
  </CustomCard>
</template>

<style scoped>
.profile-header {
  display: flex;
  gap: var(--ls-spacing-base);
  align-items: center;
}

.avatar {
  width: calc(var(--ls-spacing-base) * 6);
  height: calc(var(--ls-spacing-base) * 6);
  border-radius: var(--ls-border-radius-full);
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.username {
  margin: 0 0 var(--ls-spacing-xs) 0;
  font-size: var(--ls-font-size-lg);
  font-weight: 600;
}

.bio {
  margin: 0;
  font-size: var(--ls-font-size-sm);
  color: #666;
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: var(--ls-spacing-base) 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: var(--ls-font-size-xl);
  font-weight: 600;
  margin-bottom: var(--ls-spacing-xs);
}

.stat-label {
  font-size: var(--ls-font-size-xs);
  color: #999;
}

.actions {
  display: flex;
  gap: var(--ls-spacing-sm);
}
</style>
```

## 🔗 相关文档

- [Composition API 示例](./composition-api) - Composition API 使用示例
- [响应式布局](./responsive-layout) - 响应式设计示例
- [Vue 集成指南](../getting-started/vue-integration) - Vue 集成完整指南

