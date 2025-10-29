# @ldesign/size-react

> React 尺寸管理 - Hooks、Context 和组件

[![npm version](https://img.shields.io/npm/v/@ldesign/size-react.svg)](https://www.npmjs.com/package/@ldesign/size-react)
[![React](https://img.shields.io/badge/React-16.8+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 特性

- ⚛️ **React 优化** - 专为 React 16.8+ 设计
- 🪝 **完整 Hooks** - useSize、useSizeConfig、useSizePresets
- 🎨 **开箱即用组件** - SizeSelector、SizeControlPanel
- 🔌 **Context Provider** - 简单的状态管理
- 🎯 **TypeScript 支持** - 完整的类型定义

## 安装

```bash
pnpm add @ldesign/size-react @ldesign/size-core
```

## 快速开始

### 使用 Provider

```tsx
import { SizeProvider } from '@ldesign/size-react'

function App() {
  return (
    <SizeProvider defaultPreset="medium">
      <YourApp />
    </SizeProvider>
  )
}
```

### 使用 Hooks

```tsx
import { useSize } from '@ldesign/size-react'

function MyComponent() {
  const { currentPreset, presets, applyPreset } = useSize()
  
  return (
    <div>
      <p>当前尺寸: {currentPreset}</p>
      {presets.map(preset => (
        <button
          key={preset.name}
          onClick={() => applyPreset(preset.name)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}
```

### 使用组件

```tsx
import { SizeSelector } from '@ldesign/size-react'

function MyComponent() {
  return <SizeSelector />
}
```

## API 文档

详见 [完整文档](../../docs/README.md)

## 许可证

MIT © LDesign Team

