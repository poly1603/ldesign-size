# 快速运行示例

> 5 个示例的快速启动命令

## 🚀 一键启动

### 准备工作

```bash
# 1. 进入 size 目录
cd packages/size

# 2. 安装依赖
pnpm install

# 3. 构建所有包 (使用 @ldesign/builder)
pnpm build
```

### 运行示例 (使用 @ldesign/launcher)

**选择你想要运行的示例，复制对应命令：**

#### 1️⃣ Core (原生 JS) - 端口 5170

```bash
cd packages/core/examples/basic && pnpm install && pnpm dev
# 或使用 launcher 命令
cd packages/core/examples/basic && launcher dev
```

#### 2️⃣ Vue 3 - 端口 5171

```bash
cd packages/vue/examples/basic && pnpm install && pnpm dev
# 或使用 launcher 命令
cd packages/vue/examples/basic && launcher dev
```

#### 3️⃣ React - 端口 5172

```bash
cd packages/react/examples/basic && pnpm install && pnpm dev
# 或使用 launcher 命令
cd packages/react/examples/basic && launcher dev
```

#### 4️⃣ Svelte 5 - 端口 5173

```bash
cd packages/svelte/examples/basic && pnpm install && pnpm dev
# 或使用 launcher 命令
cd packages/svelte/examples/basic && launcher dev
```

#### 5️⃣ Solid.js - 端口 5174

```bash
cd packages/solid/examples/basic && pnpm install && pnpm dev
# 或使用 launcher 命令
cd packages/solid/examples/basic && launcher dev
```

---

## 🎯 同时运行多个示例

由于端口不同，可以同时运行所有示例！

打开 5 个终端窗口，分别运行：

```bash
# 终端 1 - Core
cd packages/size/packages/core/examples/basic && pnpm dev

# 终端 2 - Vue
cd packages/size/packages/vue/examples/basic && pnpm dev

# 终端 3 - React
cd packages/size/packages/react/examples/basic && pnpm dev

# 终端 4 - Svelte
cd packages/size/packages/svelte/examples/basic && pnpm dev

# 终端 5 - Solid
cd packages/size/packages/solid/examples/basic && pnpm dev
```

然后打开浏览器，分别访问：
- http://localhost:5170 (Core)
- http://localhost:5171 (Vue)
- http://localhost:5172 (React)
- http://localhost:5173 (Svelte)
- http://localhost:5174 (Solid)

---

## ⚡ 使用 @ldesign/launcher 的优势

- 🚀 **自动框架检测**: 无需手动配置 Vue/React/Svelte/Solid 插件
- ⚡ **性能优化**: 内置性能监控和优化建议
- 🔧 **统一接口**: 所有示例使用相同的命令 (launcher dev/build/preview)
- 📊 **构建报告**: 自动生成详细的构建分析报告
- 🎯 **智能依赖**: 自动预构建优化依赖
- 🔥 **热更新**: 极速的 HMR 体验

---

## 📊 端口速查表

| 示例 | 端口 | URL |
|------|------|-----|
| Core | 5170 | http://localhost:5170 |
| Vue | 5171 | http://localhost:5171 |
| React | 5172 | http://localhost:5172 |
| Svelte | 5173 | http://localhost:5173 |
| Solid | 5174 | http://localhost:5174 |

---

## 💡 提示

- 首次运行需要 `pnpm install` 安装依赖
- 如果构建失败，先运行 `pnpm build` 构建包
- 可以同时运行多个示例进行对比
- 按 `Ctrl+C` 停止开发服务器

---

**Happy Coding! 🎉**

