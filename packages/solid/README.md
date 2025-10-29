# @ldesign/size-solid

> 🎯 Solid.js 尺寸管理 - 使用 Signals 和 Context 提供响应式尺寸控制

[![npm version](https://img.shields.io/npm/v/@ldesign/size-solid.svg)](https://www.npmjs.com/package/@ldesign/size-solid)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Solid.js](https://img.shields.io/badge/Solid.js-1.8+-blue.svg)](https://www.solidjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 特性

- 🚀 **Solid.js Signals** - 使用细粒度响应式 Signals
- 🎨 **Context + Provider** - 标准的 Solid.js 模式
- 🔧 **开箱即用** - 零配置快速上手
- 💎 **完整 Hooks** - useSize、useSizeConfig、useSizePresets
- 🎯 **TypeScript 优先** - 完整的类型定义
- ⚡ **轻量高效** - 基于 @ldesign/size-core 核心包

## 📦 安装

```bash
# 使用 pnpm (推荐)
pnpm add @ldesign/size-solid @ldesign/size-core

# 使用 npm
npm install @ldesign/size-solid @ldesign/size-core

# 使用 yarn
yarn add @ldesign/size-solid @ldesign/size-core
```

## 🚀 快速开始

### 基础使用

```tsx
import { render } from 'solid-js/web'
import { SizeProvider, SizeSelector, useSize } from '@ldesign/size-solid'

function App() {
  const { currentPreset, config } = useSize()

  return (
    <div>
      <h1>当前预设: {currentPreset()}</h1>
      <p>基础字体: {config().baseSize}px</p>
      
      {/* 使用选择器组件 */}
      <SizeSelector variant="buttons" />
    </div>
  )
}

render(
  () => (
    <SizeProvider defaultPreset="medium">
      <App />
    </SizeProvider>
  ),
  document.getElementById('root')!
)
```

### 使用 SizeControlPanel

```tsx
import { SizeProvider, SizeControlPanel } from '@ldesign/size-solid'

function App() {
  return (
    <div>
      <h1>尺寸设置</h1>
      <SizeControlPanel
        showSlider={true}
        minSize={12}
        maxSize={20}
        onChange={(config) => {
          console.log('配置已更新:', config)
        }}
      />
    </div>
  )
}

render(
  () => (
    <SizeProvider>
      <App />
    </SizeProvider>
  ),
  document.getElementById('root')!
)
```

## 📖 API 文档

### SizeProvider

提供 SizeManager 实例给子组件。

**Props：**

```typescript
interface SizeProviderProps {
  defaultPreset?: string      // 默认预设 (default: 'default')
  presets?: SizePreset[]      // 自定义预设
  storageKey?: string         // 本地存储键 (default: 'ldesign-size')
  manager?: SizeManager       // 现有的 SizeManager 实例（可选）
  children: JSX.Element       // 子组件
}
```

**示例：**

```tsx
<SizeProvider
  defaultPreset="large"
  storageKey="my-app-size"
  presets={[
    { name: 'compact', label: '紧凑', baseSize: 12 },
    { name: 'normal', label: '正常', baseSize: 14 }
  ]}
>
  <App />
</SizeProvider>
```

### useSize()

核心 Hook，提供完整的尺寸管理功能。

**返回：**

```typescript
interface UseSizeReturn {
  config: () => SizeConfig              // 当前配置（Signal）
  currentPreset: () => string           // 当前预设名称（Signal）
  presets: () => SizePreset[]           // 可用预设列表
  applyPreset: (name: string) => void   // 应用预设
  setBaseSize: (size: number) => void   // 设置基础尺寸
  setConfig: (config: Partial<SizeConfig>) => void  // 设置配置
}
```

**示例：**

```tsx
function MyComponent() {
  const { currentPreset, presets, applyPreset } = useSize()

  return (
    <div>
      <p>当前: {currentPreset()}</p>
      <For each={presets()}>
        {(preset) => (
          <button onClick={() => applyPreset(preset.name)}>
            {preset.label}
          </button>
        )}
      </For>
    </div>
  )
}
```

### useSizeConfig()

专注于配置管理的 Hook。

**返回：**

```typescript
interface UseSizeConfigReturn {
  config: () => SizeConfig                          // 当前配置（Signal）
  setConfig: (config: Partial<SizeConfig>) => void  // 更新配置
  resetConfig: () => void                           // 重置到默认
}
```

**示例：**

```tsx
function ConfigPanel() {
  const { config, setConfig } = useSizeConfig()

  return (
    <input
      type="number"
      value={config().baseSize}
      onInput={(e) => setConfig({ baseSize: Number(e.target.value) })}
    />
  )
}
```

### useSizePresets()

专注于预设管理的 Hook。

**返回：**

```typescript
interface UseSizePresetsReturn {
  presets: () => SizePreset[]             // 可用预设
  currentPreset: () => string             // 当前预设（Signal）
  applyPreset: (name: string) => void     // 应用预设
  isActive: (name: string) => boolean     // 检查是否激活
}
```

**示例：**

```tsx
function PresetSelector() {
  const { presets, applyPreset, isActive } = useSizePresets()

  return (
    <For each={presets()}>
      {(preset) => (
        <button
          classList={{ active: isActive(preset.name) }}
          onClick={() => applyPreset(preset.name)}
        >
          {preset.label}
        </button>
      )}
    </For>
  )
}
```

### SizeSelector 组件

尺寸选择器组件。

**Props：**

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `class` | `string` | `''` | 自定义 CSS 类名 |
| `style` | `JSX.CSSProperties \| string` | `''` | 自定义样式 |
| `variant` | `'select' \| 'buttons'` | `'select'` | 渲染模式 |
| `buttonSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | 按钮大小 |
| `onChange` | `(name: string) => void` | `undefined` | 变化回调 |

**示例：**

```tsx
// 下拉框模式
<SizeSelector variant="select" />

// 按钮模式
<SizeSelector
  variant="buttons"
  buttonSize="large"
  onChange={(preset) => console.log('Changed:', preset)}
/>
```

### SizeControlPanel 组件

高级尺寸控制面板。

**Props：**

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `class` | `string` | `''` | 自定义 CSS 类名 |
| `style` | `JSX.CSSProperties \| string` | `''` | 自定义样式 |
| `showSlider` | `boolean` | `true` | 显示基础尺寸滑块 |
| `minSize` | `number` | `10` | 最小尺寸 |
| `maxSize` | `number` | `24` | 最大尺寸 |
| `onChange` | `(config) => void` | `undefined` | 变化回调 |

**示例：**

```tsx
<SizeControlPanel
  showSlider={true}
  minSize={12}
  maxSize={20}
  onChange={(config) => {
    console.log('Preset:', config.preset)
    console.log('Base Size:', config.baseSize)
  }}
/>
```

## 🎯 使用场景

### 1. 全局尺寸管理

```tsx
import { SizeProvider } from '@ldesign/size-solid'

function Root() {
  return (
    <SizeProvider defaultPreset="medium" storageKey="app-size">
      <Router>
        <App />
      </Router>
    </SizeProvider>
  )
}
```

### 2. 响应式尺寸调整

```tsx
import { createEffect } from 'solid-js'
import { useSize } from '@ldesign/size-solid'

function ResponsiveApp() {
  const { applyPreset } = useSize()

  createEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        applyPreset('small')
      } else if (window.innerWidth < 1024) {
        applyPreset('medium')
      } else {
        applyPreset('large')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })

  return <div>...</div>
}
```

### 3. 用户偏好设置

```tsx
import { SizeSelector, useSizeConfig } from '@ldesign/size-solid'

function SettingsPage() {
  const { config } = useSizeConfig()

  return (
    <div class="settings">
      <h2>显示设置</h2>
      <div class="setting-item">
        <label>界面尺寸:</label>
        <SizeSelector variant="buttons" />
      </div>
      <p>当前基础字体: {config().baseSize}px</p>
    </div>
  )
}
```

### 4. 动态样式

```tsx
import { useSize } from '@ldesign/size-solid'

function DynamicText() {
  const { config } = useSize()

  return (
    <div
      style={{
        'font-size': `${config().baseSize}px`,
        'line-height': config().baseSize * 1.5
      }}
    >
      <h1>响应式标题</h1>
      <p>文字会根据尺寸设置自动调整</p>
    </div>
  )
}
```

## 🔄 与其他框架对比

| 功能 | Vue 3 | React | Svelte 5 | Solid.js |
|------|-------|-------|----------|----------|
| 创建实例 | `useSize()` | `useSize()` | `createSizeStore()` | `useSize()` |
| 提供者 | `VueSizePlugin` | `<SizeProvider>` | `getGlobalSizeStore()` | `<SizeProvider>` |
| 响应式 | Composition API | Hooks + State | Runes ($state) | Signals |
| 组件 | `.vue` 文件 | `.tsx` 文件 | `.svelte` 文件 | `.tsx` 文件 |
| 性能 | 优秀 | 良好 | 优秀 | 极佳 |

## 📝 TypeScript 支持

完整的 TypeScript 类型定义：

```typescript
import type {
  UseSizeReturn,
  UseSizeConfigReturn,
  UseSizePresetsReturn,
  SizeConfig,
  SizePreset
} from '@ldesign/size-solid'

const sizeReturn: UseSizeReturn = useSize()
const config: SizeConfig = sizeReturn.config()
const presets: SizePreset[] = sizeReturn.presets()
```

## 💡 示例项目

我们提供了完整的示例项目来展示各种使用方式：

- **基础示例**: `examples/basic/` - 展示所有核心功能和三个专用 Hooks

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
- [Svelte 包文档](../svelte/README.md)
- [完整文档](../../docs/README.md)
- [更新日志](../../CHANGELOG.md)

---

<div align="center">
  <p>Made with ❤️ by LDesign Team</p>
</div>

