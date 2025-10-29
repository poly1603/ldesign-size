# @ldesign/size-svelte

> 🎯 Svelte 5 尺寸管理 - 使用 runes 提供响应式尺寸控制

[![npm version](https://img.shields.io/npm/v/@ldesign/size-svelte.svg)](https://www.npmjs.com/package/@ldesign/size-svelte)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Svelte 5](https://img.shields.io/badge/Svelte-5.x-orange.svg)](https://svelte.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 特性

- 🚀 **Svelte 5 Runes** - 使用最新的 `$state` 和 `$derived` runes
- 🎨 **响应式状态** - 自动追踪尺寸变化，无需手动订阅
- 🔧 **开箱即用** - 零配置快速上手
- 💎 **完整组件** - 提供即用型 SizeSelector 组件
- 🎯 **TypeScript 优先** - 完整的类型定义
- ⚡ **轻量高效** - 基于 @ldesign/size-core 核心包

## 📦 安装

```bash
# 使用 pnpm (推荐)
pnpm add @ldesign/size-svelte @ldesign/size-core

# 使用 npm
npm install @ldesign/size-svelte @ldesign/size-core

# 使用 yarn
yarn add @ldesign/size-svelte @ldesign/size-core
```

## 🚀 快速开始

### 基础使用

```svelte
<script>
  import { createSizeStore, SizeSelector } from '@ldesign/size-svelte'

  const size = createSizeStore({
    defaultPreset: 'medium',
    storageKey: 'my-app-size'
  })
</script>

<!-- 使用选择器组件 -->
<SizeSelector store={size} variant="buttons" />

<!-- 显示当前尺寸 -->
<p>当前预设: {size.currentPreset}</p>
<p>基础字体: {size.config.baseSize}px</p>

<!-- 手动切换 -->
<button onclick={() => size.applyPreset('large')}>
  切换到大尺寸
</button>
```

### 使用全局 Store

```svelte
<script>
  import { getGlobalSizeStore, SizeSelector } from '@ldesign/size-svelte'

  // 获取全局单例 store
  const size = getGlobalSizeStore({
    defaultPreset: 'medium'
  })
</script>

<!-- 不需要传 store prop，自动使用全局 store -->
<SizeSelector variant="select" />
```

## 📖 API 文档

### createSizeStore(options)

创建一个新的响应式尺寸 store。

**参数：**

```typescript
interface SizeStoreOptions {
  defaultPreset?: string        // 默认预设 (default: 'default')
  presets?: SizePreset[]        // 自定义预设
  storageKey?: string           // 本地存储键 (default: 'ldesign-size')
  manager?: SizeManager         // 现有的 SizeManager 实例（可选）
}
```

**返回：**

```typescript
interface SizeStore {
  readonly config: SizeConfig           // 当前配置（响应式）
  readonly currentPreset: string        // 当前预设名称（响应式）
  readonly presets: SizePreset[]        // 可用预设列表（响应式）
  applyPreset: (name: string) => void   // 应用预设
  setBaseSize: (size: number) => void   // 设置基础尺寸
  setConfig: (config: Partial<SizeConfig>) => void  // 设置配置
  getManager: () => SizeManager         // 获取底层 manager
  destroy: () => void                   // 销毁 store
}
```

**示例：**

```svelte
<script>
  import { createSizeStore } from '@ldesign/size-svelte'

  const size = createSizeStore({
    defaultPreset: 'large',
    presets: [
      { name: 'compact', label: '紧凑', baseSize: 12 },
      { name: 'normal', label: '正常', baseSize: 14 },
      { name: 'comfortable', label: '舒适', baseSize: 16 }
    ]
  })

  function changeSize() {
    size.applyPreset('comfortable')
  }
</script>

<p>当前尺寸: {size.config.baseSize}px</p>
<button onclick={changeSize}>切换到舒适模式</button>
```

### getGlobalSizeStore(options?)

获取或创建全局单例 store。

```svelte
<script>
  import { getGlobalSizeStore } from '@ldesign/size-svelte'

  const size = getGlobalSizeStore()
</script>
```

### SizeSelector 组件

尺寸选择器组件，支持下拉框和按钮两种模式。

**Props：**

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `store` | `SizeStore` | 全局 store | 自定义 store 实例 |
| `class` | `string` | `''` | 自定义 CSS 类名 |
| `style` | `string` | `''` | 自定义内联样式 |
| `variant` | `'select' \| 'buttons'` | `'select'` | 渲染模式 |
| `buttonSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | 按钮大小 |
| `onChange` | `(name: string) => void` | `undefined` | 变化回调 |

**示例：**

```svelte
<script>
  import { SizeSelector } from '@ldesign/size-svelte'

  function handleChange(preset) {
    console.log('尺寸已变更为:', preset)
  }
</script>

<!-- 下拉框模式 -->
<SizeSelector variant="select" />

<!-- 按钮模式 -->
<SizeSelector
  variant="buttons"
  buttonSize="large"
  onChange={handleChange}
/>

<!-- 自定义样式 -->
<SizeSelector
  variant="buttons"
  class="my-selector"
  style="margin: 1rem 0;"
/>
```

## 🎯 使用场景

### 1. 用户偏好设置

```svelte
<script>
  import { createSizeStore, SizeSelector } from '@ldesign/size-svelte'

  const size = createSizeStore({
    storageKey: 'user-preference-size'  // 自动保存到 localStorage
  })
</script>

<div class="settings">
  <h3>显示设置</h3>
  <label>
    界面尺寸:
    <SizeSelector store={size} variant="buttons" />
  </label>
</div>
```

### 2. 响应式尺寸调整

```svelte
<script>
  import { createSizeStore } from '@ldesign/size-svelte'
  import { onMount } from 'svelte'

  const size = createSizeStore()

  onMount(() => {
    // 根据屏幕宽度自动调整
    function updateSize() {
      if (window.innerWidth < 768) {
        size.applyPreset('small')
      } else if (window.innerWidth < 1024) {
        size.applyPreset('medium')
      } else {
        size.applyPreset('large')
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    
    return () => window.removeEventListener('resize', updateSize)
  })
</script>
```

### 3. 动态字体大小

```svelte
<script>
  import { createSizeStore } from '@ldesign/size-svelte'

  const size = createSizeStore()

  // 响应式派生值
  let fontSize = $derived(`${size.config.baseSize}px`)
  let lineHeight = $derived(size.config.baseSize * 1.5)
</script>

<div style:font-size={fontSize} style:line-height="{lineHeight}px">
  <h1>响应式标题</h1>
  <p>这段文字会根据尺寸设置自动调整大小</p>
</div>
```

## 🔄 与其他框架对比

| 功能 | Vue 3 | React | Svelte 5 | Solid.js |
|------|-------|-------|----------|----------|
| 创建实例 | `useSize()` | `useSize()` | `createSizeStore()` | `useSize()` |
| 提供者 | `VueSizePlugin` | `<SizeProvider>` | `getGlobalSizeStore()` | `<SizeProvider>` |
| 响应式 | Composition API | Hooks + State | Runes ($state) | Signals |
| 组件 | `.vue` 文件 | `.tsx` 文件 | `.svelte` 文件 | `.tsx` 文件 |

## 📝 TypeScript 支持

完整的 TypeScript 类型定义：

```typescript
import type {
  SizeStore,
  SizeStoreOptions,
  SizeConfig,
  SizePreset
} from '@ldesign/size-svelte'

const store: SizeStore = createSizeStore({
  defaultPreset: 'medium'
})

const config: SizeConfig = store.config
const presets: SizePreset[] = store.presets
```

## 💡 示例项目

我们提供了完整的示例项目来展示各种使用方式：

- **基础示例**: `examples/basic/` - 展示所有核心功能

```bash
# 运行基础示例
cd examples/basic
pnpm install
pnpm dev
```

查看 [示例文档](./examples/basic/README.md) 了解更多。

## 🤝 贡献指南

欢迎贡献！请查看 [CONTRIBUTING.md](../../../../CONTRIBUTING.md)。

## 📄 许可证

[MIT License](./LICENSE) © LDesign Team

## 🔗 相关链接

- [核心包文档](../core/README.md)
- [Vue 包文档](../vue/README.md)
- [React 包文档](../react/README.md)
- [完整文档](../../docs/README.md)
- [更新日志](../../CHANGELOG.md)

---

<div align="center">
  <p>Made with ❤️ by LDesign Team</p>
</div>

