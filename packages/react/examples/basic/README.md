# React Size Example - Basic

> @ldesign/size-react 的完整功能演示

## 📦 功能演示

- ✅ SizeProvider 和 Context
- ✅ useSize() Hook - 核心功能
- ✅ useSizeConfig() Hook - 配置管理
- ✅ useSizePresets() Hook - 预设管理
- ✅ SizeSelector 组件
- ✅ SizeControlPanel 组件
- ✅ 下拉选择器和按钮模式
- ✅ 响应式状态展示
- ✅ 动态文字大小调整
- ✅ 手动微调控制

## 🚀 运行示例

### 1. 安装依赖

```bash
cd packages/size
pnpm install
```

### 2. 构建包

```bash
pnpm build:core
pnpm build:react
```

### 3. 运行示例

```bash
cd packages/react/examples/basic
pnpm install
pnpm dev
```

访问 http://localhost:5172

## 📖 代码说明

### 使用 Provider

```tsx
import { SizeProvider } from '@ldesign/size-react'

<SizeProvider defaultPreset="normal" presets={customPresets}>
  <App />
</SizeProvider>
```

### 使用 Hooks

```tsx
import { useSize, useSizeConfig, useSizePresets } from '@ldesign/size-react'

function MyComponent() {
  const { config, currentPreset, applyPreset } = useSize()
  const { setConfig, resetConfig } = useSizeConfig()
  const { presets } = useSizePresets()
  
  return <div style={{ fontSize: `${config.baseSize}px` }}>...</div>
}
```

### 使用组件

```tsx
import { SizeSelector, SizeControlPanel } from '@ldesign/size-react'

<SizeSelector variant="buttons" onChange={(preset) => console.log(preset)} />
<SizeControlPanel showSlider={true} minSize={12} maxSize={20} />
```

## 📚 相关文档

- [React 包文档](../../README.md)
- [Core 包文档](../../../core/README.md)

## 🤝 反馈

欢迎在 [GitHub Issues](https://github.com/ldesign/ldesign/issues) 反馈。


