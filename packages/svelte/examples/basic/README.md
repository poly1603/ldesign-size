# Svelte 5 Size Example - Basic

> @ldesign/size-svelte 的基础使用示例

## 📦 功能演示

- ✅ 创建和使用 size store
- ✅ 下拉选择器模式
- ✅ 按钮选择器模式
- ✅ 响应式状态展示
- ✅ 动态文字大小调整
- ✅ 手动微调控制
- ✅ 自定义预设

## 🚀 运行示例

```bash
# 在项目根目录
cd packages/size
pnpm install

# 构建核心包和 Svelte 包
pnpm build:core
pnpm build:svelte

# 进入示例目录
cd packages/svelte/examples/basic
pnpm install
pnpm dev
```

访问 http://localhost:5173

## 📖 代码说明

### 创建 Store

```typescript
import { createSizeStore } from '@ldesign/size-svelte'

const size = createSizeStore({
  defaultPreset: 'normal',
  presets: customPresets,
  storageKey: 'svelte-example-size'
})
```

### 使用响应式值

```svelte
<script>
  // 使用 $derived 创建派生值
  let fontSize = $derived(`${size.config.baseSize}px`)
  let lineHeight = $derived(size.config.baseSize * 1.5)
</script>

<!-- 在模板中直接使用 -->
<p style:font-size={fontSize}>
  当前字体: {size.config.baseSize}px
</p>
```

## 🎨 特色功能

### Svelte 5 Runes

使用最新的 `$state` 和 `$derived` runes，无需手动订阅。

## 📚 相关文档

- [Svelte 包文档](../../README.md)
- [Core 包文档](../../../core/README.md)
