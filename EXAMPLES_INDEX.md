# Size 包示例索引

> 所有 5 个包的完整演示示例

**创建时间**: 2025-01-28  
**状态**: ✅ 完成

---

## 📦 示例列表

所有包都创建了基于 Vite 的完整演示示例：

| 包 | 示例路径 | 端口 | 状态 | 主题色 |
|---|---------|------|------|--------|
| **Core** | `packages/core/examples/basic/` | 5170 | ✅ | 粉红渐变 |
| **Vue 3** | `packages/vue/examples/basic/` | 5171 | ✅ | 绿色渐变 |
| **React** | `packages/react/examples/basic/` | 5172 | ✅ | 蓝色渐变 |
| **Svelte 5** | `packages/svelte/examples/basic/` | 5173 | ✅ | 紫色渐变 |
| **Solid.js** | `packages/solid/examples/basic/` | 5174 | ✅ | 青蓝渐变 |

---

## 🚀 快速启动

### 方式 1: 单独运行

```bash
# 1. Core (原生 JS) 示例
cd packages/core/examples/basic
pnpm install && pnpm dev
# 访问 http://localhost:5170

# 2. Vue 3 示例
cd packages/vue/examples/basic
pnpm install && pnpm dev
# 访问 http://localhost:5171

# 3. React 示例
cd packages/react/examples/basic
pnpm install && pnpm dev
# 访问 http://localhost:5172

# 4. Svelte 5 示例
cd packages/svelte/examples/basic
pnpm install && pnpm dev
# 访问 http://localhost:5173

# 5. Solid.js 示例
cd packages/solid/examples/basic
pnpm install && pnpm dev
# 访问 http://localhost:5174
```

### 方式 2: 批量构建

```bash
# 在 packages/size 目录下

# 1. 构建所有包
pnpm build

# 2. 然后进入任意示例目录运行
cd packages/[包名]/examples/basic
pnpm install && pnpm dev
```

---

## 📋 示例功能

所有示例都包含以下功能演示：

### 核心功能
- ✅ 预设管理（下拉 + 按钮）
- ✅ 实时配置信息展示
- ✅ 动态文字大小调整
- ✅ 手动微调控制
- ✅ 自定义预设
- ✅ 本地存储持久化

### 框架特定功能

#### Core (原生 JS)
- 纯 JavaScript 实现
- DOM 操作示例
- 事件订阅演示

#### Vue 3
- Composition API (useSize)
- Plugin 系统
- 响应式 Ref

#### React
- 三个专用 Hooks
- SizeProvider + Context
- SizeControlPanel 组件

#### Svelte 5
- Runes ($state, $derived)
- Store API
- Getter 模式

#### Solid.js
- Signals + createMemo
- Context API
- SizeControlPanel 组件

---

## 🎨 UI 设计

每个示例都有独特的主题色和设计：

| 示例 | 主题色 | 特点 |
|-----|--------|------|
| Core | 粉红渐变 (#f093fb → #f5576c) | 现代活力 |
| Vue | 绿色渐变 (#42b983 → #35495e) | Vue 官方色 |
| React | 蓝色渐变 (#61dafb → #282c34) | React 品牌色 |
| Svelte | 紫色渐变 (#667eea → #764ba2) | 优雅神秘 |
| Solid | 青蓝渐变 (#2196f3 → #00bcd4) | 科技感 |

### 共同设计元素
- 📱 完全响应式设计
- 🎴 卡片式布局
- ✨ 流畅动画效果
- 🎯 清晰的视觉层次
- 🌈 渐变背景

---

## 📁 文件结构

每个示例的标准结构：

```
examples/basic/
├── package.json          # 项目配置
├── index.html            # HTML 入口
├── vite.config.ts        # Vite 配置
├── README.md             # 示例文档
└── src/
    ├── main.ts/tsx       # 主入口
    ├── App.vue/tsx/svelte  # 主组件
    └── style.css         # 全局样式
```

### 文件统计

| 示例 | 文件数 | 代码行数 |
|-----|--------|---------|
| Core | 5 | ~600 |
| Vue | 6 | ~500 |
| React | 8 | ~650 |
| Svelte | 6 | ~500 |
| Solid | 7 | ~650 |
| **总计** | **32** | **~2900** |

---

## 🔧 技术栈

### 通用
- Vite 5.0.12
- TypeScript 5.7.3

### 框架特定
- Vue 3.4.15 + @vitejs/plugin-vue
- React 18.2.0 + @vitejs/plugin-react
- Svelte 5.0.0 + @sveltejs/vite-plugin-svelte
- Solid.js 1.8.0 + vite-plugin-solid

---

## 📖 学习路径

### 1. 从 Core 开始
了解底层 SizeManager API：
- 创建管理器
- 应用预设
- 订阅变化
- 配置管理

### 2. 选择框架示例
根据你熟悉的框架学习：
- Vue 开发者 → Vue 示例
- React 开发者 → React 示例
- Svelte 开发者 → Svelte 示例
- Solid.js 开发者 → Solid 示例

### 3. 对比学习
运行多个示例对比不同框架的实现：
- 响应式系统差异
- API 设计差异
- 性能表现差异

---

## 💡 使用技巧

### 同时运行多个示例

由于端口不同，可以同时运行所有示例进行对比：

```bash
# 终端 1: Core 示例
cd packages/core/examples/basic && pnpm dev

# 终端 2: Vue 示例
cd packages/vue/examples/basic && pnpm dev

# 终端 3: React 示例
cd packages/react/examples/basic && pnpm dev

# 终端 4: Svelte 示例
cd packages/svelte/examples/basic && pnpm dev

# 终端 5: Solid 示例
cd packages/solid/examples/basic && pnpm dev
```

然后打开 5 个浏览器标签页同时查看！

### 本地存储测试

所有示例都使用不同的 storageKey：
- Core: `core-example-size`
- Vue: `vue-example-size`
- React: `react-example-size`
- Svelte: `svelte-example-size`
- Solid: `solid-example-size`

可以独立测试持久化功能而不互相干扰。

---

## 🐛 故障排除

### 问题: 示例无法启动

**解决方案:**
```bash
# 1. 确保已构建核心包和框架包
cd packages/size
pnpm build:core
pnpm build:[框架名]

# 2. 清除示例依赖重新安装
cd packages/[框架]/examples/basic
rm -rf node_modules package-lock.json
pnpm install
```

### 问题: TypeScript 错误

**解决方案:**
```bash
# 确保所有类型定义已生成
pnpm build --filter "@ldesign/size-*"
```

### 问题: 端口已被占用

**解决方案:**
修改 `vite.config.ts` 中的 port 配置：
```typescript
server: {
  port: 5xxx  // 改为其他端口
}
```

---

## 📚 相关文档

### 包文档
- [Core 包](./packages/core/README.md)
- [Vue 包](./packages/vue/README.md)
- [React 包](./packages/react/README.md)
- [Svelte 包](./packages/svelte/README.md)
- [Solid 包](./packages/solid/README.md)

### 示例文档
- [Core 示例](./packages/core/examples/basic/README.md)
- [Vue 示例](./packages/vue/examples/basic/README.md)
- [React 示例](./packages/react/examples/basic/README.md)
- [Svelte 示例](./packages/svelte/examples/basic/README.md)
- [Solid 示例](./packages/solid/examples/basic/README.md)

### 实施报告
- [完整实施总结](./IMPLEMENTATION_SUMMARY.md)
- [Svelte & Solid 支持](./SVELTE_SOLID_SUPPORT_COMPLETE.md)

---

## 🎉 总结

成功为所有 5 个包创建了完整的演示示例！

**特点：**
- ✅ 5 个完整示例
- ✅ 统一的功能演示
- ✅ 独特的视觉设计
- ✅ 完整的文档
- ✅ 易于运行

**下一步：**
1. 运行示例查看效果
2. 阅读代码学习使用
3. 参考示例创建自己的项目
4. 分享给其他开发者

---

<div align="center">

## 🚀 立即开始！

选择你熟悉的框架，运行对应的示例

**所有示例都已准备就绪！**

Made with ❤️ by LDesign Team

</div>


