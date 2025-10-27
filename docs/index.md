---
layout: home

hero:
  name: "@ldesign/size"
  text: "智能尺寸控制系统"
  tagline: "🎯 让你的应用适配每一个屏幕，提供完美的用户体验"
  actions:
    - theme: brand
      text: 快速开始
      link: /getting-started/quick-start
    - theme: alt
      text: 查看示例
      link: /examples/basic-usage
    - theme: alt
      text: GitHub
      link: https://github.com/ldesign/ldesign

features:
  - icon: 🎯
    title: 智能尺寸控制
    details: 支持小、中、大三种预设尺寸模式，智能适配不同设备和用户偏好
  - icon: 🎨
    title: CSS变量生成
    details: 自动生成对应的CSS变量，无缝集成到你的样式系统中
  - icon: 🔧
    title: 灵活配置
    details: 支持自定义尺寸配置、CSS变量前缀和各种个性化选项
  - icon: 📱
    title: 响应式支持
    details: 根据设备特性和屏幕尺寸自动调整，提供最佳的视觉体验
  - icon: 🎭
    title: Vue完美集成
    details: 提供完整的Vue组件库和Composition API，开箱即用
  - icon: 💾
    title: 持久化存储
    details: 支持本地存储用户偏好设置，记住用户的选择
  - icon: 🎬
    title: 动画过渡
    details: 平滑的尺寸切换动画效果，提升用户体验
  - icon: ⚡
    title: 轻量高效
    details: 零依赖，体积小巧，性能优异，不影响应用加载速度
  - icon: 🛠️
    title: TypeScript支持
    details: 完整的TypeScript类型定义，提供优秀的开发体验
---

## 🚀 快速体验

### 基础使用

```typescript
import { globalSizeManager } from '@ldesign/size'

// 设置尺寸模式
globalSizeManager.setMode('large')

// 获取当前模式
const current = globalSizeManager.getCurrentMode() // 'large'

// 监听变化
globalSizeManager.onSizeChange((event) => {
  console.log('尺寸变更为:', event.currentMode)
})
```

### Vue 组件

```vue
<script setup>
import { SizeSelector, SizeIndicator } from '@ldesign/size/vue'
</script>

<template>
  <div>
    <!-- 尺寸切换器 -->
    <SizeSelector
      type="button"
      :show-labels="true"
      :animated="true"
    />

    <!-- 尺寸指示器 -->
    <SizeIndicator :show-scale="true" />
  </div>
</template>
```

### Composition API

```vue
<script setup>
import { useSize, useSizeConfig } from '@ldesign/size/vue'

const {
  currentMode,
  setMode,
  nextMode,
  prevMode
} = useSize()

const config = useSizeConfig()

// 智能切换
function handleSizeChange(mode) {
  setMode(mode)
}
</script>

<template>
  <div>
    <p>当前模式: {{ currentMode }}</p>
    <p>基础字体: {{ config.fontSize.base }}</p>
    
    <button @click="nextMode">下一个尺寸</button>
  </div>
</template>
```

## 🎯 核心特性

### 📏 预设尺寸模式

| 模式 | 字体大小 | 间距 | 边框圆角 | 适用场景 |
|------|----------|------|----------|----------|
| `small` | 12px | 6px | 3px | 移动设备、紧凑布局 |
| `medium` | 14px | 8px | 4px | 桌面设备、标准布局 |
| `large` | 16px | 12px | 6px | 大屏设备、无障碍访问 |

### 🎨 完整的 CSS 变量系统

```css
.my-component {
  /* 字体 */
  font-size: var(--ls-font-size-base);
  line-height: var(--ls-line-height-base);
  
  /* 间距 */
  padding: var(--ls-spacing-base);
  margin: var(--ls-spacing-lg);
  gap: var(--ls-spacing-sm);
  
  /* 边框 */
  border-radius: var(--ls-border-radius-base);
  border-width: var(--ls-border-width-base);
  
  /* 组件尺寸 */
  height: var(--ls-button-height-medium);
}
```

### 🔄 响应式设计

```typescript
import { useResponsiveSize } from '@ldesign/size/vue'

const {
  currentMode,
  deviceType,
  screenWidth,
  isMobile,
  isTablet,
  isDesktop
} = useResponsiveSize({
  autoAdjust: true,
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  modeMap: {
    mobile: 'small',
    tablet: 'medium',
    desktop: 'large'
  }
})
```

## 📦 安装

```bash
# 使用 pnpm
pnpm add @ldesign/size

# 使用 npm
npm install @ldesign/size

# 使用 yarn
yarn add @ldesign/size
```

## 🎯 快速导航

### 🚀 开始使用

- [安装指南](/getting-started/installation) - 如何安装和配置
- [快速开始](/getting-started/quick-start) - 5分钟快速上手
- [Vue 集成](/getting-started/vue-integration) - Vue 项目集成指南
- [React 集成](/getting-started/react-integration) - React 项目集成指南

### 📚 核心概念

- [概述](/guide/concepts) - 设计理念和架构
- [尺寸模式](/guide/size-modes) - 深入了解尺寸模式系统
- [CSS 变量](/guide/css-variables) - CSS 变量完整指南
- [响应式设计](/guide/responsive) - 响应式设计原理

### 📖 API 参考

- [核心 API](/api/core) - 核心 API 文档
- [Vue API](/api/vue) - Vue 相关 API
- [类型定义](/api/types) - TypeScript 类型
- [工具函数](/api/utils) - 实用工具函数

### 💡 示例

- [基础用法](/examples/basic-usage) - 基础使用示例
- [Vue 组件](/examples/vue-components) - Vue 组件示例
- [高级用法](/examples/advanced-usage) - 高级使用技巧
- [响应式布局](/examples/responsive-layout) - 响应式布局示例

### 🎓 最佳实践

- [设计规范](/guide/best-practices) - 推荐的使用方式
- [性能优化](/guide/performance) - 性能优化指南
- [无障碍访问](/guide/accessibility) - 无障碍访问支持

## 🌟 实际应用

### 管理后台

```vue
<script setup>
import { useSize } from '@ldesign/size/vue'

const { currentMode } = useSize()
</script>

<template>
  <div :class="`dashboard dashboard--${currentMode}`">
    <aside class="sidebar">侧边栏</aside>
    <main class="content">主内容</main>
  </div>
</template>

<style>
.dashboard {
  display: grid;
  gap: var(--ls-spacing-base);
}

.dashboard--small {
  grid-template-columns: 1fr;
}

.dashboard--medium {
  grid-template-columns: 200px 1fr;
}

.dashboard--large {
  grid-template-columns: 250px 1fr;
}
</style>
```

### 表单系统

```vue
<script setup>
import { useSize } from '@ldesign/size/vue'

const { currentMode } = useSize()
</script>

<template>
  <form class="form">
    <div class="form-item">
      <label class="form-label">用户名</label>
      <input type="text" class="form-input" />
    </div>
    
    <button type="submit" class="form-button">
      提交
    </button>
  </form>
</template>

<style>
.form-input {
  height: var(--ls-input-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-base);
  border-radius: var(--ls-border-radius-base);
}

.form-button {
  height: var(--ls-button-height-large);
  padding: 0 var(--ls-spacing-xl);
  font-size: var(--ls-font-size-base);
}
</style>
```

## 🤝 贡献

我们欢迎所有形式的贡献！如果你想为项目做出贡献，请：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

MIT © [LDesign Team](https://github.com/ldesign)

## 🔗 相关链接

- [GitHub 仓库](https://github.com/ldesign/ldesign)
- [NPM 包](https://www.npmjs.com/package/@ldesign/size)
- [问题反馈](https://github.com/ldesign/ldesign/issues)
- [更新日志](https://github.com/ldesign/ldesign/blob/main/packages/size/CHANGELOG.md)

---

<div align="center">
  <p>💖 如果这个项目对你有帮助，请给我们一个 Star ⭐</p>
  <p>📖 持续完善中，感谢你的支持！</p>
</div>

