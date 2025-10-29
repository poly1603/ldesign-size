# Solid.js Size Example - Basic

> @ldesign/size-solid 的完整功能演示

## 📦 功能演示

- ✅ SizeProvider 和 Context
- ✅ useSize(), useSizeConfig(), useSizePresets() Hooks
- ✅ SizeSelector 和 SizeControlPanel 组件
- ✅ 下拉选择器和按钮模式
- ✅ 响应式状态展示
- ✅ 动态文字大小调整
- ✅ 手动微调控制

## 🚀 运行示例

```bash
# 在项目根目录
cd packages/size
pnpm install

# 构建核心包和 Solid 包
pnpm build:core
pnpm build:solid

# 进入示例目录
cd packages/solid/examples/basic
pnpm install
pnpm dev
```

访问 http://localhost:5174

## 📖 代码说明

### 使用 Provider

```tsx
import { SizeProvider } from '@ldesign/size-solid'

<SizeProvider defaultPreset="normal" presets={customPresets}>
  <App />
</SizeProvider>
```

### 使用 Hooks

```tsx
import { useSize, useSizeConfig, useSizePresets } from '@ldesign/size-solid'

function MyComponent() {
  const { config, currentPreset, applyPreset } = useSize()
  
  return <div style={{ 'font-size': `${config().baseSize}px` }}>...</div>
}
```

## 🎨 特色功能

### Solid.js Signals

使用细粒度响应式，极致性能。

## 📚 相关文档

- [Solid.js 包文档](../../README.md)
- [Core 包文档](../../../core/README.md)
