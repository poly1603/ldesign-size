# Vue 集成指南

本指南将详细介绍如何在 Vue 3 项目中使用 @ldesign/size。

## 📦 安装

```bash
pnpm add @ldesign/size
```

## 🚀 快速开始

### 方式一：使用 Vue 插件（推荐）

```typescript
// main.ts
import { createApp } from 'vue'
import { SizePlugin } from '@ldesign/size/plugin'
import App from './App.vue'

const app = createApp(App)

// 安装插件
app.use(SizePlugin, {
  defaultMode: 'medium',
  enableStorage: true,  // 启用本地存储
  storageKey: 'app-size-mode',
  prefix: '--ls'
})

app.mount('#app')
```

插件会自动：
- 创建全局尺寸管理器
- 注入 CSS 变量
- 提供全局属性和组件
- 启用响应式系统

### 方式二：手动初始化

```typescript
// main.ts
import { createApp } from 'vue'
import { globalSizeManager } from '@ldesign/size'
import App from './App.vue'

const app = createApp(App)

// 初始化尺寸管理器
globalSizeManager.setMode('medium')
globalSizeManager.injectCSS()

app.mount('#app')
```

## 🎯 Composition API

@ldesign/size 提供了丰富的 Composition API，让你在 Vue 组件中轻松使用尺寸控制功能。

### useSize

基础的尺寸控制 Hook：

```vue
<script setup lang="ts">
import { useSize } from '@ldesign/size/vue'

const { 
  currentMode,     // Ref<SizeMode> - 当前尺寸模式
  setMode,         // (mode: SizeMode) => void - 设置模式
  nextMode,        // () => void - 切换到下一个模式
  prevMode,        // () => void - 切换到上一个模式
  isMode           // (mode: SizeMode) => boolean - 检查是否为指定模式
} = useSize()

// 使用
console.log('当前模式:', currentMode.value)
setMode('large')
</script>

<template>
  <div>
    <p>当前尺寸: {{ currentMode }}</p>
    
    <button @click="setMode('small')">小</button>
    <button @click="setMode('medium')">中</button>
    <button @click="setMode('large')">大</button>
    
    <button @click="prevMode">上一个</button>
    <button @click="nextMode">下一个</button>
  </div>
</template>
```

### useSizeConfig

获取当前模式的配置：

```vue
<script setup lang="ts">
import { useSizeConfig } from '@ldesign/size/vue'

const config = useSizeConfig()

// config 是响应式的，会随着模式变化自动更新
</script>

<template>
  <div>
    <p>基础字体: {{ config.fontSize.base }}</p>
    <p>基础间距: {{ config.spacing.base }}</p>
    <p>按钮高度: {{ config.button.height.medium }}</p>
  </div>
</template>
```

### useSizeVariables

获取 CSS 变量：

```vue
<script setup lang="ts">
import { useSizeVariables } from '@ldesign/size/vue'

const variables = useSizeVariables()

// variables 是响应式的 Record<string, string>
</script>

<template>
  <div>
    <pre>{{ JSON.stringify(variables, null, 2) }}</pre>
  </div>
</template>
```

### useResponsiveSize

响应式尺寸控制：

```vue
<script setup lang="ts">
import { useResponsiveSize } from '@ldesign/size/vue'

const {
  currentMode,
  deviceType,      // 'mobile' | 'tablet' | 'desktop'
  screenWidth,     // Ref<number>
  screenHeight,    // Ref<number>
  isDesktop,
  isTablet,
  isMobile
} = useResponsiveSize({
  // 断点配置
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  // 自动调整模式
  autoAdjust: true,
  // 模式映射
  modeMap: {
    mobile: 'small',
    tablet: 'medium',
    desktop: 'large'
  }
})
</script>

<template>
  <div>
    <p>设备类型: {{ deviceType }}</p>
    <p>屏幕尺寸: {{ screenWidth }}x{{ screenHeight }}</p>
    <p>当前模式: {{ currentMode }}</p>
    
    <div v-if="isMobile">移动端布局</div>
    <div v-else-if="isTablet">平板布局</div>
    <div v-else>桌面布局</div>
  </div>
</template>
```

### useSmartSize

智能尺寸控制（带存储和推荐）：

```vue
<script setup lang="ts">
import { useSmartSize } from '@ldesign/size/vue'

const {
  currentMode,
  setMode,
  recommendedMode,      // 推荐的模式
  isUsingRecommended,   // 是否使用推荐模式
  resetToRecommended,   // 重置为推荐模式
  history,              // 历史记录
  undo,                 // 撤销
  redo                  // 重做
} = useSmartSize({
  remember: true,       // 记住用户选择
  responsive: true,     // 启用响应式
  autoRecommend: true   // 自动推荐
})
</script>

<template>
  <div>
    <p>当前模式: {{ currentMode }}</p>
    <p v-if="!isUsingRecommended">
      推荐使用: {{ recommendedMode }}
      <button @click="resetToRecommended">使用推荐</button>
    </p>
    
    <button @click="undo" :disabled="!history.canUndo">撤销</button>
    <button @click="redo" :disabled="!history.canRedo">重做</button>
  </div>
</template>
```

## 🎨 Vue 组件

### SizeSelector

尺寸选择器组件：

```vue
<template>
  <div>
    <!-- 基础用法 -->
    <SizeSelector />
    
    <!-- 自定义样式 -->
    <SizeSelector
      type="button"
      :show-labels="true"
      :show-icons="true"
      theme="primary"
    />
    
    <!-- 下拉选择器 -->
    <SizeSelector
      type="dropdown"
      :options="[
        { value: 'small', label: '小尺寸', icon: 'compress' },
        { value: 'medium', label: '中尺寸', icon: 'equals' },
        { value: 'large', label: '大尺寸', icon: 'expand' }
      ]"
    />
    
    <!-- 滑块选择器 -->
    <SizeSelector
      type="slider"
      :show-value="true"
    />
  </div>
</template>

<script setup lang="ts">
import { SizeSelector } from '@ldesign/size/vue'
</script>
```

### SizeIndicator

尺寸指示器组件：

```vue
<template>
  <div>
    <!-- 基础指示器 -->
    <SizeIndicator />
    
    <!-- 带详情的指示器 -->
    <SizeIndicator
      :show-label="true"
      :show-icon="true"
      :show-scale="true"
      position="bottom-right"
    />
    
    <!-- 自定义样式 -->
    <SizeIndicator
      theme="minimal"
      :animated="true"
    />
  </div>
</template>

<script setup lang="ts">
import { SizeIndicator } from '@ldesign/size/vue'
</script>
```

### SizeSwitcher

快速切换器组件：

```vue
<template>
  <div>
    <!-- 按钮组切换器 -->
    <SizeSwitcher
      type="buttons"
      :show-icons="true"
    />
    
    <!-- 切换开关 -->
    <SizeSwitcher
      type="toggle"
      :modes="['small', 'large']"
    />
    
    <!-- 分段控制器 */
    <SizeSwitcher
      type="segment"
      :animated="true"
    />
  </div>
</template>

<script setup lang="ts">
import { SizeSwitcher } from '@ldesign/size/vue'
</script>
```

### SizeControlPanel

完整控制面板：

```vue
<template>
  <SizeControlPanel
    :show-selector="true"
    :show-indicator="true"
    :show-config="true"
    :show-preview="true"
    position="bottom-right"
  />
</template>

<script setup lang="ts">
import { SizeControlPanel } from '@ldesign/size/vue'
</script>
```

## 🔌 全局属性

安装插件后，可以在组件中使用全局属性：

```vue
<script setup lang="ts">
// 通过 getCurrentInstance 访问
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const { $getSizeMode, $setSize, $getSizeConfig } = instance?.appContext.config.globalProperties || {}
</script>

<template>
  <div>
    <!-- 在模板中直接使用 -->
    <p>当前模式: {{ $getSizeMode() }}</p>
    
    <button @click="$setSize('small')">小</button>
    <button @click="$setSize('medium')">中</button>
    <button @click="$setSize('large')">大</button>
  </div>
</template>
```

## 🎯 实战示例

### 示例 1：响应式布局

```vue
<script setup lang="ts">
import { useResponsiveSize } from '@ldesign/size/vue'

const { currentMode, isMobile, isDesktop } = useResponsiveSize({
  autoAdjust: true
})
</script>

<template>
  <div class="layout" :class="`layout-${currentMode}`">
    <!-- 头部 -->
    <header class="header">
      <h1>我的应用</h1>
      <SizeSelector v-if="isDesktop" />
    </header>
    
    <!-- 主内容 -->
    <main class="main">
      <aside v-if="!isMobile" class="sidebar">
        侧边栏
      </aside>
      
      <div class="content">
        主内容区
      </div>
    </main>
    
    <!-- 底部 -->
    <footer class="footer">
      版权信息
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  min-height: 100vh;
  gap: var(--ls-spacing-base);
  padding: var(--ls-spacing-base);
}

.layout-small {
  grid-template-areas:
    "header"
    "main"
    "footer";
}

.layout-medium {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
}

.layout-large {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}

.header {
  grid-area: header;
  padding: var(--ls-spacing-lg);
}

.sidebar {
  grid-area: sidebar;
  padding: var(--ls-spacing-base);
}

.main {
  grid-area: main;
  padding: var(--ls-spacing-lg);
}

.footer {
  grid-area: footer;
  padding: var(--ls-spacing-base);
  text-align: center;
}
</style>
```

### 示例 2：表单系统

```vue
<script setup lang="ts">
import { useSize, useSizeConfig } from '@ldesign/size/vue'

const { currentMode } = useSize()
const config = useSizeConfig()

const formData = reactive({
  name: '',
  email: '',
  message: ''
})

function handleSubmit() {
  console.log('提交表单:', formData)
}
</script>

<template>
  <div class="form-container">
    <h2>联系表单</h2>
    
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-item">
        <label class="form-label">姓名</label>
        <input
          v-model="formData.name"
          type="text"
          class="form-input"
          placeholder="请输入姓名"
        />
      </div>
      
      <div class="form-item">
        <label class="form-label">邮箱</label>
        <input
          v-model="formData.email"
          type="email"
          class="form-input"
          placeholder="请输入邮箱"
        />
      </div>
      
      <div class="form-item">
        <label class="form-label">留言</label>
        <textarea
          v-model="formData.message"
          class="form-textarea"
          rows="4"
          placeholder="请输入留言内容"
        />
      </div>
      
      <button type="submit" class="form-button">
        提交
      </button>
    </form>
    
    <!-- 尺寸切换器 -->
    <div class="form-footer">
      <SizeSelector type="button" />
    </div>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--ls-spacing-xl);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--ls-spacing-lg);
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: var(--ls-spacing-xs);
}

.form-label {
  font-size: var(--ls-font-size-sm);
  font-weight: 600;
  color: #333;
}

.form-input,
.form-textarea {
  height: var(--ls-input-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-base);
  border: 1px solid #d9d9d9;
  border-radius: var(--ls-border-radius-base);
  transition: all 0.3s;
}

.form-textarea {
  height: auto;
  padding: var(--ls-spacing-sm) var(--ls-spacing-base);
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-button {
  height: var(--ls-button-height-large);
  padding: 0 var(--ls-spacing-xl);
  font-size: var(--ls-font-size-base);
  font-weight: 600;
  color: white;
  background: #1890ff;
  border: none;
  border-radius: var(--ls-border-radius-base);
  cursor: pointer;
  transition: all 0.3s;
}

.form-button:hover {
  background: #40a9ff;
}

.form-button:active {
  background: #096dd9;
}

.form-footer {
  margin-top: var(--ls-spacing-xl);
  padding-top: var(--ls-spacing-lg);
  border-top: 1px solid #f0f0f0;
  text-align: center;
}
</style>
```

### 示例 3：卡片列表

```vue
<script setup lang="ts">
import { useSize } from '@ldesign/size/vue'
import { computed } from 'vue'

const { currentMode } = useSize()

const items = [
  { id: 1, title: '卡片 1', content: '这是卡片 1 的内容' },
  { id: 2, title: '卡片 2', content: '这是卡片 2 的内容' },
  { id: 3, title: '卡片 3', content: '这是卡片 3 的内容' },
  { id: 4, title: '卡片 4', content: '这是卡片 4 的内容' },
]

const columns = computed(() => {
  switch (currentMode.value) {
    case 'small': return 1
    case 'medium': return 2
    case 'large': return 3
    default: return 2
  }
})
</script>

<template>
  <div class="card-list" :style="{ '--columns': columns }">
    <div
      v-for="item in items"
      :key="item.id"
      class="card"
    >
      <h3 class="card-title">{{ item.title }}</h3>
      <p class="card-content">{{ item.content }}</p>
      <button class="card-button">查看详情</button>
    </div>
  </div>
</template>

<style scoped>
.card-list {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: var(--ls-spacing-base);
  padding: var(--ls-spacing-lg);
}

.card {
  padding: var(--ls-spacing-lg);
  background: white;
  border-radius: var(--ls-border-radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-title {
  font-size: var(--ls-font-size-lg);
  font-weight: 600;
  margin-bottom: var(--ls-spacing-sm);
}

.card-content {
  font-size: var(--ls-font-size-base);
  color: #666;
  margin-bottom: var(--ls-spacing-base);
}

.card-button {
  width: 100%;
  height: var(--ls-button-height-medium);
  font-size: var(--ls-font-size-sm);
  color: #1890ff;
  background: transparent;
  border: 1px solid #1890ff;
  border-radius: var(--ls-border-radius-base);
  cursor: pointer;
  transition: all 0.3s;
}

.card-button:hover {
  color: white;
  background: #1890ff;
}
</style>
```

## 📝 TypeScript 支持

完整的类型定义：

```typescript
import type {
  SizeMode,
  SizeConfig,
  SizeManager,
  SizeChangeEvent,
  UseSizeReturn,
  UseResponsiveSizeReturn
} from '@ldesign/size/vue'

// 类型安全的模式切换
function switchSize(mode: SizeMode) {
  // ...
}

// 类型安全的配置
const config: SizeConfig = {
  fontSize: { base: '14px' },
  spacing: { base: '8px' },
  // ...
}
```

## 🎯 最佳实践

### 1. 使用 Composition API

```typescript
// ✅ 推荐
import { useSize } from '@ldesign/size/vue'

// ❌ 不推荐
import { globalSizeManager } from '@ldesign/size'
```

### 2. 组件封装

```vue
<!-- MyButton.vue -->
<script setup lang="ts">
import { useSize } from '@ldesign/size/vue'

const { currentMode } = useSize()

defineProps<{
  type?: 'primary' | 'default'
  size?: 'small' | 'medium' | 'large'
}>()
</script>

<template>
  <button class="my-button" :class="[type, size || currentMode]">
    <slot />
  </button>
</template>
```

### 3. 性能优化

```vue
<script setup lang="ts">
import { useSize } from '@ldesign/size/vue'
import { computed } from 'vue'

const { currentMode } = useSize()

// 使用 computed 缓存计算结果
const gridColumns = computed(() => {
  return currentMode.value === 'small' ? 1 : currentMode.value === 'medium' ? 2 : 3
})
</script>
```

## 📚 相关资源

- [核心 API](../api/core) - 核心 API 文档
- [Vue API](../api/vue) - Vue API 详细文档
- [示例项目](../examples/vue-components) - 更多 Vue 示例
- [最佳实践](../guide/best-practices) - 推荐的使用方式

