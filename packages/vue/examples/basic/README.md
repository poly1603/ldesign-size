# Vue 3 Size Example - Basic

> @ldesign/size-vue 的完整功能演示

## 📦 功能演示

- ✅ Vue Plugin 安装和配置
- ✅ useSize() Composable
- ✅ 下拉选择器模式
- ✅ 按钮选择器模式
- ✅ 响应式状态展示
- ✅ 动态文字大小调整
- ✅ 手动微调控制
- ✅ 自定义预设
- ✅ Composition API 演示

## 🚀 运行示例

### 1. 安装依赖

```bash
# 在项目根目录
cd packages/size
pnpm install
```

### 2. 构建包

```bash
# 构建 core 包
pnpm build:core

# 构建 vue 包
pnpm build:vue
```

### 3. 运行示例

```bash
cd packages/vue/examples/basic
pnpm install
pnpm dev
```

访问 http://localhost:5171

## 📖 代码说明

### 安装插件

```typescript
import { createApp } from 'vue'
import { createSizePlugin } from '@ldesign/size-vue'

const app = createApp(App)

app.use(createSizePlugin({
  defaultSize: 'normal',
  presets: customPresets,
  storageKey: 'my-app-size'
}))
```

### 使用 Composable

```vue
<script setup>
import { useSize } from '@ldesign/size-vue'

const { config, currentPreset, presets, applyPreset, setBaseSize } = useSize()

// 派生值
const fontSize = computed(() => `${config.value.baseSize}px`)
</script>

<template>
  <p :style="{ fontSize }">
    Current: {{ currentPreset }}
  </p>
</template>
```

### 响应式更新

```vue
<script setup>
const { config } = useSize()

// config 是响应式 Ref，会自动更新
watch(config, (newConfig) => {
  console.log('配置已更新:', newConfig)
})
</script>
```

## 🎨 特色功能

### 1. Vue Plugin 系统

完整的 Vue 插件集成：

```typescript
app.use(createSizePlugin({
  defaultSize: 'medium',
  presets: [...],
  storageKey: 'app-size',
  persistence: true
}))
```

### 2. Composition API

原生 Vue 3 Composition API：

```typescript
const { config, currentPreset, applyPreset } = useSize()
```

### 3. 自动持久化

配置自动保存到 localStorage：

```typescript
createSizePlugin({
  storageKey: 'my-app-size',
  persistence: true
})
```

### 4. SSR 支持

支持服务端渲染，确保在服务端和客户端都能正常工作。

## 📚 相关文档

- [Vue 包文档](../../README.md)
- [Core 包文档](../../../core/README.md)
- [完整文档](../../../../docs/README.md)

## 🤝 反馈

如有问题或建议，欢迎在 [GitHub Issues](https://github.com/ldesign/ldesign/issues) 反馈。


