# Core Size Example - Basic

> @ldesign/size-core 的原生 JavaScript 使用示例

## 📦 功能演示

- ✅ 创建和使用 SizeManager
- ✅ 下拉选择器控制
- ✅ 按钮预设切换
- ✅ 实时配置信息展示
- ✅ 动态文字大小调整
- ✅ 手动微调（按钮 + 滑块）
- ✅ 自定义预设
- ✅ 事件订阅
- ✅ 本地存储持久化

## 🚀 运行示例

### 1. 安装依赖

```bash
# 在项目根目录
cd packages/size
pnpm install
```

### 2. 构建核心包

```bash
pnpm build:core
```

### 3. 运行示例

```bash
cd packages/core/examples/basic
pnpm install
pnpm dev
```

访问 http://localhost:5170

## 📖 代码说明

### 创建 SizeManager

```typescript
import { SizeManager } from '@ldesign/size-core'

const manager = new SizeManager({
  presets: customPresets,
  storageKey: 'my-app-size'
})
```

### 应用预设

```typescript
manager.applyPreset('large')
```

### 设置基础尺寸

```typescript
manager.setBaseSize(16)
```

### 订阅变化

```typescript
manager.subscribe((config) => {
  console.log('配置已更新:', config)
  updateUI()
})
```

### 获取配置

```typescript
const config = manager.getConfig()
const currentPreset = manager.getCurrentPreset()
const presets = manager.getPresets()
```

## 🎨 特色功能

### 1. 框架无关

Core 包完全独立于任何前端框架，可以在任何环境中使用：

- 原生 JavaScript
- jQuery 项目
- 任何现代框架（Vue、React、Svelte、Solid等）
- Node.js 环境

### 2. 完整的 TypeScript 支持

```typescript
import type { SizeConfig, SizePreset, SizeManager } from '@ldesign/size-core'
```

### 3. 本地存储持久化

配置自动保存到 localStorage，页面刷新后保持：

```typescript
const manager = new SizeManager({
  storageKey: 'my-app-size'
})
```

### 4. 事件系统

支持订阅配置变化：

```typescript
const unsubscribe = manager.subscribe((config) => {
  // 处理配置变化
})

// 取消订阅
unsubscribe()
```

## 📚 核心 API

### SizeManager

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `applyPreset(name)` | `string` | `void` | 应用预设 |
| `setBaseSize(size)` | `number` | `void` | 设置基础尺寸 |
| `setConfig(config)` | `Partial<SizeConfig>` | `void` | 更新配置 |
| `getConfig()` | - | `SizeConfig` | 获取当前配置 |
| `getCurrentPreset()` | - | `string` | 获取当前预设名称 |
| `getPresets()` | - | `SizePreset[]` | 获取所有预设 |
| `subscribe(callback)` | `Function` | `Function` | 订阅变化 |
| `destroy()` | - | `void` | 销毁实例 |

### 类型定义

```typescript
interface SizeConfig {
  baseSize: number
  // ... 其他配置
}

interface SizePreset {
  name: string
  label: string
  baseSize: number
}
```

## 🔗 相关文档

- [Core 包文档](../../README.md)
- [完整文档](../../../../docs/README.md)

## 🤝 反馈

如有问题或建议，欢迎在 [GitHub Issues](https://github.com/ldesign/ldesign/issues) 反馈。


