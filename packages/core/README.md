# @ldesign/size-core

> 框架无关的尺寸管理核心库

[![npm version](https://img.shields.io/npm/v/@ldesign/size-core.svg)](https://www.npmjs.com/package/@ldesign/size-core)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 特性

- 🚀 **框架无关** - 可在任何 JavaScript 环境中使用
- 🎨 **动态 CSS 变量** - 智能生成完整的 CSS 变量系统
- 🔧 **高度可定制** - 支持自定义前缀、选择器、配置等
- ⚡ **性能优越** - LRU 缓存系统，优化内存使用
- 📊 **性能监控** - 实时监控性能指标
- 🎯 **TypeScript 优先** - 完整的类型定义

## 安装

```bash
pnpm add @ldesign/size-core
```

## 快速开始

```typescript
import { SizeManager } from '@ldesign/size-core'

// 创建尺寸管理器
const manager = new SizeManager({
  defaultMode: 'medium',
  autoInject: true
})

// 应用预设
manager.applyPreset('large')

// 监听变化
manager.subscribe((config) => {
  console.log('尺寸变化:', config.baseSize)
})
```

## API 文档

详见 [完整文档](../../docs/README.md)

## 许可证

MIT © LDesign Team

