# 快速开始

欢迎使用 @ldesign/size！本指南将在 5 分钟内带你快速上手。

## 🚀 三步快速开始

### 1. 安装

```bash
pnpm add @ldesign/size
```

### 2. 导入并初始化

```typescript
import { globalSizeManager } from '@ldesign/size'

// 设置默认尺寸模式
globalSizeManager.setMode('medium')
```

### 3. 在样式中使用

```css
.my-component {
  font-size: var(--ls-font-size-base);
  padding: var(--ls-spacing-base);
  border-radius: var(--ls-border-radius-base);
}
```

就是这么简单！你的组件现在已经支持尺寸切换了。

## 💡 基础使用

### 获取和设置尺寸模式

```typescript
import { globalSizeManager } from '@ldesign/size'

// 获取当前模式
const currentMode = globalSizeManager.getCurrentMode()
console.log(currentMode) // 'medium'

// 设置模式
globalSizeManager.setMode('large')

// 切换到下一个模式
const nextMode = getNextSizeMode(currentMode)
globalSizeManager.setMode(nextMode)
```

### 监听尺寸变化

```typescript
// 添加监听器
const unwatch = globalSizeManager.onSizeChange((event) => {
  console.log('尺寸已变更:', {
    从: event.previousMode,
    到: event.currentMode,
    时间: event.timestamp
  })
})

// 稍后移除监听器
unwatch()
```

### 生成和使用 CSS 变量

```typescript
// 生成 CSS 变量
const variables = globalSizeManager.generateCSSVariables()
console.log(variables)
// {
//   '--ls-font-size-base': '14px',
//   '--ls-spacing-base': '8px',
//   '--ls-border-radius-base': '4px',
//   ...
// }

// 自动注入到页面
globalSizeManager.injectCSS()
```

## 🎨 在 CSS 中使用

### 基础用法

```css
/* 字体大小 */
.title {
  font-size: var(--ls-font-size-h1);
}

.text {
  font-size: var(--ls-font-size-base);
}

.small-text {
  font-size: var(--ls-font-size-sm);
}

/* 间距 */
.container {
  padding: var(--ls-spacing-lg);
  gap: var(--ls-spacing-base);
}

/* 组件尺寸 */
.button {
  height: var(--ls-button-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-sm);
  border-radius: var(--ls-border-radius-base);
}
```

### 响应式设计

```css
/* 结合媒体查询 */
@media (max-width: 768px) {
  .container {
    padding: var(--ls-spacing-sm);
  }
}

/* 使用 CSS 计算 */
.card {
  padding: calc(var(--ls-spacing-base) * 1.5);
  margin-bottom: var(--ls-spacing-base);
}
```

## 🎯 实际示例

### HTML + JavaScript

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>@ldesign/size 示例</title>
    <style>
      .app {
        padding: var(--ls-spacing-lg);
      }

      .button {
        height: var(--ls-button-height-medium);
        padding: 0 var(--ls-spacing-base);
        font-size: var(--ls-font-size-sm);
        border-radius: var(--ls-border-radius-base);
        background: #1890ff;
        color: white;
        border: none;
        cursor: pointer;
        margin-right: var(--ls-spacing-sm);
      }

      .content {
        font-size: var(--ls-font-size-base);
        line-height: var(--ls-line-height-base);
      }
    </style>
  </head>
  <body>
    <div class="app">
      <h1>尺寸切换示例</h1>
      
      <div style="margin-bottom: var(--ls-spacing-base)">
        <button class="button" onclick="setSize('small')">小尺寸</button>
        <button class="button" onclick="setSize('medium')">中尺寸</button>
        <button class="button" onclick="setSize('large')">大尺寸</button>
      </div>

      <div class="content">
        <p>这是一段文本内容，它会随着尺寸模式的变化而调整大小。</p>
        <p>当前模式: <strong id="current-mode">medium</strong></p>
      </div>
    </div>

    <script type="module">
      import { globalSizeManager } from 'https://unpkg.com/@ldesign/size@latest/es/index.js'

      window.setSize = (mode) => {
        globalSizeManager.setMode(mode)
        document.getElementById('current-mode').textContent = mode
      }

      // 初始化
      globalSizeManager.setMode('medium')
    </script>
  </body>
</html>
```

### TypeScript 项目

```typescript
// main.ts
import { createSizeManager } from '@ldesign/size'
import type { SizeMode } from '@ldesign/size'

// 创建管理器
const sizeManager = createSizeManager({
  defaultMode: 'medium',
  autoInject: true,
  prefix: '--app'
})

// 导出供组件使用
export { sizeManager }

// 添加全局切换函数
export function switchSize(mode: SizeMode) {
  sizeManager.setMode(mode)
  
  // 保存用户偏好
  localStorage.setItem('preferred-size', mode)
}

// 恢复用户偏好
const savedMode = localStorage.getItem('preferred-size') as SizeMode
if (savedMode) {
  sizeManager.setMode(savedMode)
}
```

## 🎭 Vue 3 集成

```vue
<script setup>
import { useSize } from '@ldesign/size/vue'

const { currentMode, setMode, isMode } = useSize()

const sizes = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' }
]
</script>

<template>
  <div class="size-control">
    <button
      v-for="size in sizes"
      :key="size.value"
      :class="{ active: isMode(size.value) }"
      @click="setMode(size.value)"
    >
      {{ size.label }}
    </button>
    
    <p>当前模式: {{ currentMode }}</p>
  </div>
</template>

<style scoped>
.size-control {
  padding: var(--ls-spacing-base);
}

button {
  height: var(--ls-button-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-sm);
  margin-right: var(--ls-spacing-xs);
}

button.active {
  background: #1890ff;
  color: white;
}
</style>
```

## 📦 可用的尺寸模式

@ldesign/size 提供三种预设尺寸模式：

| 模式 | 字体大小 | 间距 | 边框圆角 | 适用场景 |
|------|----------|------|----------|----------|
| `small` | 12px | 6px | 3px | 移动设备、紧凑布局 |
| `medium` | 14px | 8px | 4px | 桌面设备、标准布局 |
| `large` | 16px | 12px | 6px | 大屏设备、无障碍访问 |

## 🎨 可用的 CSS 变量

### 字体相关

```css
--ls-font-size-xs       /* 超小字体 */
--ls-font-size-sm       /* 小字体 */
--ls-font-size-base     /* 基础字体 */
--ls-font-size-lg       /* 大字体 */
--ls-font-size-xl       /* 超大字体 */
--ls-font-size-h1       /* 标题1 */
--ls-font-size-h2       /* 标题2 */
--ls-font-size-h3       /* 标题3 */
--ls-line-height-base   /* 行高 */
```

### 间距相关

```css
--ls-spacing-xs         /* 超小间距 */
--ls-spacing-sm         /* 小间距 */
--ls-spacing-base       /* 基础间距 */
--ls-spacing-lg         /* 大间距 */
--ls-spacing-xl         /* 超大间距 */
--ls-spacing-xxl        /* 特大间距 */
```

### 组件相关

```css
--ls-button-height-small    /* 小按钮高度 */
--ls-button-height-medium   /* 中按钮高度 */
--ls-button-height-large    /* 大按钮高度 */
--ls-input-height-small     /* 小输入框高度 */
--ls-input-height-medium    /* 中输入框高度 */
--ls-input-height-large     /* 大输入框高度 */
```

### 边框相关

```css
--ls-border-radius-sm       /* 小圆角 */
--ls-border-radius-base     /* 基础圆角 */
--ls-border-radius-lg       /* 大圆角 */
--ls-border-width-base      /* 边框宽度 */
```

## 🔧 高级配置

### 自定义尺寸配置

```typescript
import { createSizeManager } from '@ldesign/size'

const manager = createSizeManager({
  // CSS 变量前缀
  prefix: '--my-app',
  
  // 默认模式
  defaultMode: 'large',
  
  // 样式标签 ID
  styleId: 'my-size-variables',
  
  // CSS 选择器
  selector: '.app-root',
  
  // 是否自动注入 CSS
  autoInject: true
})
```

### 响应式监听

```typescript
import { globalSizeManager } from '@ldesign/size'

// 根据屏幕宽度自动调整
function autoAdjustSize() {
  const width = window.innerWidth
  
  if (width < 768) {
    globalSizeManager.setMode('small')
  } else if (width < 1200) {
    globalSizeManager.setMode('medium')
  } else {
    globalSizeManager.setMode('large')
  }
}

// 监听窗口大小变化
window.addEventListener('resize', autoAdjustSize)

// 初始调整
autoAdjustSize()
```

## 📚 下一步

现在你已经掌握了基础用法，可以继续学习：

- [Vue 集成指南](./vue-integration) - Vue 项目完整集成方案
- [API 参考](../api/core) - 完整的 API 文档
- [示例项目](../examples/basic-usage) - 更多实际示例
- [最佳实践](../guide/best-practices) - 推荐的使用方式

## ❓ 常见问题

### CSS 变量不生效？

确保已经调用了 `injectCSS()` 或设置了 `autoInject: true`：

```typescript
const manager = createSizeManager({
  autoInject: true  // 自动注入 CSS
})

// 或手动注入
manager.injectCSS()
```

### 如何自定义 CSS 变量前缀？

```typescript
const manager = createSizeManager({
  prefix: '--my-prefix'
})

// 使用时
// var(--my-prefix-font-size-base)
```

### 如何持久化用户选择？

```typescript
// 保存
globalSizeManager.onSizeChange((event) => {
  localStorage.setItem('size-mode', event.currentMode)
})

// 恢复
const savedMode = localStorage.getItem('size-mode')
if (savedMode) {
  globalSizeManager.setMode(savedMode)
}
```

## 🎉 完成！

恭喜！你已经掌握了 @ldesign/size 的基础使用。现在可以在你的项目中自由使用它了。

如果有任何问题，欢迎：
- 查看[完整文档](/)
- 提交 [GitHub Issue](https://github.com/ldesign/ldesign/issues)
- 加入我们的社区讨论

