# @ldesign/size-vue

> Vue 3 尺寸管理 - Composables 和组件

[![npm version](https://img.shields.io/npm/v/@ldesign/size-vue.svg)](https://www.npmjs.com/package/@ldesign/size-vue)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 特性

- 🎯 **Vue 3 优化** - 专为 Vue 3 Composition API 设计
- 🔄 **响应式** - 完全响应式的尺寸管理
- 🎨 **开箱即用组件** - SizeSelector、SizeControlPanel 等
- 🔌 **插件支持** - Vue 插件一键安装
- 🎯 **TypeScript 支持** - 完整的类型定义

## 安装

```bash
pnpm add @ldesign/size-vue @ldesign/size-core
```

## 快速开始

### 插件方式

```typescript
import { createApp } from 'vue'
import { VueSizePlugin } from '@ldesign/size-vue'
import App from './App.vue'

const app = createApp(App)

app.use(VueSizePlugin, {
  defaultMode: 'medium',
  autoInject: true
})

app.mount('#app')
```

### Composable 方式

```vue
<script setup>
import { useSize } from '@ldesign/size-vue'

const { currentPreset, presets, applyPreset } = useSize()

const handleSizeChange = (size) => {
  applyPreset(size)
}
</script>

<template>
  <div>
    <p>当前尺寸: {{ currentPreset }}</p>
    <button
      v-for="preset in presets"
      :key="preset.name"
      @click="handleSizeChange(preset.name)"
    >
      {{ preset.label }}
    </button>
  </div>
</template>
```

## API 文档

详见 [完整文档](../../docs/README.md)

## 许可证

MIT © LDesign Team

