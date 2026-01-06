# @ldesign/size

> 页面尺寸缩放管理库 - 让你的网页支持动态尺寸切换

[![npm version](https://img.shields.io/npm/v/@ldesign/size.svg)](https://www.npmjs.com/package/@ldesign/size)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)

## ✨ 特性

- 🚀 **开箱即用** - 零配置快速上手
- 🎨 **CSS 变量** - 智能生成完整的 CSS 变量系统
- 🔧 **多框架支持** - Vue 3 及原生 JS
- ⚡ **高性能** - 节流机制、LRU 缓存、批量通知
- 📱 **响应式** - 完美适配移动端
- 🎯 **TypeScript** - 完整类型定义

## 📦 安装

```bash
# pnpm (推荐)
pnpm add @ldesign/size

# npm
npm install @ldesign/size

# yarn
yarn add @ldesign/size
```

## 🚀 快速开始

### 原生 JavaScript

```typescript
import { sizeManager } from '@ldesign/size'

// 应用预设
sizeManager.applyPreset('comfortable')

// 监听变化
sizeManager.subscribe((config) => {
  console.log('尺寸变化:', config.baseSize)
})

// 自定义基础尺寸
sizeManager.setBaseSize(18)
```

### Vue 3

```typescript
// main.ts
import { createApp } from 'vue'
import { createSizePlugin } from '@ldesign/size-vue'
import App from './App.vue'

const app = createApp(App)
app.use(createSizePlugin({ defaultPreset: 'comfortable' }))
app.mount('#app')
```

```vue
<!-- 组件中使用 -->
<script setup>
import { useSize, SizeSwitcher } from '@ldesign/size-vue'

const { currentPreset, applyPreset } = useSize()
</script>

<template>
  <div>
    <SizeSwitcher />
    <p>当前预设: {{ currentPreset }}</p>
  </div>
</template>
```

## 🎨 内置预设

| 预设 | 描述 | 基础尺寸 | 适用场景 |
|-----|------|---------|--------|
| `compact` | 紧凑 | 14px | 信息密集型界面 |
| `comfortable` | 舒适 | 16px | 日常使用 |
| `default` | 默认 | 16px | 标准设置 |
| `spacious` | 宽松 | 18px | 无障碍访问 |

## 📖 API

### SizeManager

```typescript
import { sizeManager, SizeManager } from '@ldesign/size'

// 使用单例
sizeManager.applyPreset('comfortable')

// 或创建新实例
const manager = new SizeManager({
  storageKey: 'my-app-size',
  defaultPreset: 'comfortable',
  enableThrottle: true
})
```

**方法:**

| 方法 | 描述 |
|-----|------|
| `applyPreset(name)` | 应用预设 |
| `setBaseSize(size)` | 设置基础尺寸 |
| `getCurrentPreset()` | 获取当前预设名称 |
| `getConfig()` | 获取当前配置 |
| `getPresets()` | 获取所有预设 |
| `subscribe(listener)` | 监听配置变化 |
| `addPreset(preset)` | 添加自定义预设 |
| `destroy()` | 销毁实例 |

### Vue Composables

```typescript
import { useSize } from '@ldesign/size-vue'

const { 
  config,        // 当前配置 (readonly)
  currentPreset, // 当前预设名称 (readonly)
  presets,       // 预设列表 (computed)
  setBaseSize,   // 设置基础尺寸
  applyPreset    // 应用预设
} = useSize()
```

### Vue 组件

```vue
<!-- 尺寸切换器 -->
<SizeSwitcher 
  variant="light" 
  size="medium"
  @change="onSizeChange"
/>

<!-- 预设选择器 -->
<SizePresetPicker />
```

## 🎯 CSS 变量

应用预设后，以下 CSS 变量会自动注入到 `:root`：

```css
/* 基础尺寸 */
--size-base: 16px;
--size-scale: 1;

/* 字体尺寸 */
--size-font-xs: 11px;
--size-font-sm: 12px;
--size-font-base: 14px;
--size-font-md: 16px;
--size-font-lg: 18px;
--size-font-xl: 20px;

/* 间距 */
--size-spacing-xs: 4px;
--size-spacing-sm: 6px;
--size-spacing-md: 8px;
--size-spacing-lg: 12px;
--size-spacing-xl: 16px;

/* 圆角 */
--size-radius-sm: 4px;
--size-radius-md: 6px;
--size-radius-lg: 8px;

/* 更多变量... */
```

## 📁 包结构

```
@ldesign/size (monorepo)
├── @ldesign/size-core  # 框架无关的核心
└── @ldesign/size-vue   # Vue 3 封装
```

## 🔧 高级配置

### 自定义预设

```typescript
import { sizeManager } from '@ldesign/size'

sizeManager.addPreset({
  name: 'extra-large',
  label: '超大',
  description: '适合大屏展示',
  baseSize: 20,
  category: 'accessibility'
})

sizeManager.applyPreset('extra-large')
```

### Vue 插件配置

```typescript
app.use(createSizePlugin({
  defaultPreset: 'comfortable',
  storageKey: 'my-app-size',
  globalProperties: true, // 注册 $sizeManager
  hooks: {
    beforeChange: (newSize, oldSize) => true,
    afterChange: (newSize) => console.log('Changed:', newSize)
  }
}))
```

## 🛠️ 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test
```

## 📄 License

[MIT](./LICENSE) © LDesign Team
