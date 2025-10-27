# @ldesign/size 示例项目

这个目录包含了 @ldesign/size 的各种使用示例。

## 📁 目录结构

```
examples/
├── vanilla/          # 原生 JavaScript 示例
│   ├── src/
│   │   ├── main.ts   # 主入口文件
│   │   └── styles/   # 样式文件
│   ├── index.html
│   └── package.json
│
└── vue/              # Vue 3 示例
    ├── src/
    │   ├── App.vue
    │   ├── main.ts
    │   ├── components/
    │   │   ├── ComponentDemo.vue      # 组件使用示例
    │   │   ├── CompositionApiDemo.vue # Composition API 示例
    │   │   ├── ResponsiveDemo.vue     # 响应式示例
    │   │   ├── RealWorldDemo.vue      # 实际应用示例
    │   │   ├── DashboardDemo.vue      # 仪表盘示例
    │   │   ├── TableDemo.vue          # 数据表格示例
    │   │   └── FormDemo.vue           # 表单系统示例
    │   └── styles/
    ├── index.html
    └── package.json
```

## 🚀 运行示例

### Vanilla JavaScript 示例

```bash
# 进入 vanilla 目录
cd examples/vanilla

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

访问 http://localhost:5173 查看示例。

### Vue 3 示例

```bash
# 进入 vue 目录
cd examples/vue

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

访问 http://localhost:5174 查看示例。

## 📚 示例说明

### 1. Vanilla JavaScript 示例

展示如何在原生 JavaScript 项目中使用 @ldesign/size：

- ✅ 基础 API 使用
- ✅ CSS 变量生成
- ✅ 尺寸模式切换
- ✅ 事件监听
- ✅ 工具函数使用

**主要功能：**
- 尺寸模式切换按钮
- 当前模式显示
- CSS 变量生成和注入
- 响应式布局演示
- 工具函数演示

### 2. Vue 3 示例

展示如何在 Vue 3 项目中使用 @ldesign/size：

#### 基础示例标签页

- ✅ Vue Plugin 使用
- ✅ Composition API 使用
- ✅ Vue 组件使用
- ✅ 响应式布局
- ✅ 实际应用案例

#### 仪表盘标签页

完整的管理后台仪表盘示例：
- 📊 统计卡片（支持尺寸切换）
- 📈 图表展示（尺寸自适应）
- 📦 订单列表
- 📝 活动日志
- 🎯 响应式布局

#### 数据表格标签页

数据表格系统示例：
- 📋 完整的表格组件
- 🔄 不同尺寸模式下的表格密度
- ✏️ 行内操作
- 📄 分页功能
- 📱 移动端适配

#### 表单系统标签页

完整的表单系统示例：
- 📝 各种表单控件
- ✅ 表单验证
- 🎨 响应式表单布局
- 📱 移动端优化
- ♿ 无障碍支持

## 🎯 学习路径

### 初学者

1. **从 Vanilla 示例开始**
   - 了解核心 API
   - 学习 CSS 变量使用
   - 理解尺寸模式概念

2. **Vue 基础示例**
   - Plugin 使用
   - 基础组件
   - Composition API

### 进阶学习

1. **响应式设计**
   - 响应式示例
   - 设备适配
   - 断点配置

2. **实际应用**
   - 仪表盘示例
   - 表格系统
   - 表单系统

### 高级应用

1. **自定义组件**
   - 组件封装
   - 样式定制
   - 性能优化

2. **最佳实践**
   - 代码组织
   - 类型安全
   - 测试覆盖

## 💡 代码片段

### 基础用法

```typescript
import { globalSizeManager } from '@ldesign/size'

// 设置尺寸
globalSizeManager.setMode('large')

// 获取当前尺寸
const current = globalSizeManager.getCurrentMode()

// 监听变化
globalSizeManager.onSizeChange((event) => {
  console.log('尺寸变化:', event.currentMode)
})
```

### Vue Composition API

```vue
<script setup>
import { useSize } from '@ldesign/size/vue'

const { currentMode, setMode } = useSize()
</script>

<template>
  <div>
    <p>当前: {{ currentMode }}</p>
    <button @click="setMode('large')">大尺寸</button>
  </div>
</template>
```

### 响应式 Hook

```typescript
import { useResponsiveSize } from '@ldesign/size/vue'

const {
  currentMode,
  deviceType,
  isMobile,
  isDesktop
} = useResponsiveSize({
  autoAdjust: true
})
```

## 🎨 自定义样式

### 覆盖默认变量

```css
:root {
  /* 自定义字体大小 */
  --ls-font-size-base: 15px;
  
  /* 自定义间距 */
  --ls-spacing-base: 10px;
  
  /* 自定义圆角 */
  --ls-border-radius-base: 6px;
}
```

### 组件级定制

```css
.my-component {
  /* 基于变量计算 */
  padding: calc(var(--ls-spacing-base) * 1.5);
  
  /* 组合多个变量 */
  border: var(--ls-border-width-base) solid #e0e0e0;
  border-radius: var(--ls-border-radius-lg);
}
```

## 🔧 故障排除

### CSS 变量不生效

确保已经调用了 `injectCSS()` 或设置了 `autoInject: true`：

```typescript
import { globalSizeManager } from '@ldesign/size'

// 手动注入
globalSizeManager.injectCSS()

// 或者在创建时自动注入
import { createSizeManager } from '@ldesign/size'

const manager = createSizeManager({
  autoInject: true
})
```

### 尺寸切换无效果

检查是否正确使用了 CSS 变量：

```css
/* ✅ 正确 */
.button {
  height: var(--ls-button-height-medium);
}

/* ❌ 错误 */
.button {
  height: 32px;  /* 硬编码的值不会响应尺寸变化 */
}
```

### 类型错误

确保安装了正确的依赖：

```bash
# 安装核心包
pnpm add @ldesign/size

# 对于 Vue 项目，确保安装了 Vue 3
pnpm add vue@^3.0.0
```

## 📖 相关文档

- [完整文档](../docs/) - 完整的使用文档
- [API 参考](../docs/api/core.md) - API 详细说明
- [Vue 集成](../docs/getting-started/vue-integration.md) - Vue 集成指南
- [最佳实践](../docs/guide/best-practices.md) - 推荐的使用方式

## 🤝 贡献

如果你有好的示例想要分享，欢迎提交 Pull Request！

1. Fork 本仓库
2. 创建新的示例目录
3. 添加 README 说明
4. 提交 Pull Request

## 📄 许可证

MIT © [LDesign Team](https://github.com/ldesign)

