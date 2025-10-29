# Size 包配置指南

> @ldesign/size 包和示例的完整配置参考

**更新时间**: 2025-01-28  
**适用范围**: 所有 Size 包和示例项目

---

## 📋 目录

- [Builder 配置 (包构建)](#builder-配置-包构建)
- [Launcher 配置 (示例启动)](#launcher-配置-示例启动)
- [配置文件位置](#配置文件位置)
- [常用命令](#常用命令)
- [故障排除](#故障排除)

---

## 🔧 Builder 配置 (包构建)

### 配置文件位置

所有包的 builder 配置统一放在 `.ldesign/builder.config.ts`：

```
packages/
├── core/.ldesign/builder.config.ts
├── vue/.ldesign/builder.config.ts
├── react/.ldesign/builder.config.ts
├── svelte/.ldesign/builder.config.ts
└── solid/.ldesign/builder.config.ts
```

### 配置模板

#### 1. Core 包 (TypeScript)

```typescript
// packages/core/.ldesign/builder.config.ts
import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  name: 'LDesignSizeCore',
  libraryType: 'typescript',
  
  input: 'src/index.ts',
  
  output: {
    esm: {
      dir: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    cjs: {
      dir: 'lib',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    umd: {
      enabled: true,
      name: 'LDesignSizeCore',
      file: 'dist/index.min.js'
    }
  },
  
  external: [],
  
  typescript: {
    declaration: true,
    declarationDir: 'es',
    sourceMap: true
  },
  
  minify: {
    umd: true
  }
})
```

#### 2. Vue 包

```typescript
// packages/vue/.ldesign/builder.config.ts
export default defineConfig({
  name: 'LDesignSizeVue',
  libraryType: 'vue3',
  
  input: 'src/index.ts',
  
  external: [
    'vue',
    '@ldesign/size-core',
    'lucide-vue-next'
  ],
  
  vue: {
    isProduction: true,
    script: {
      propsDestructure: true
    }
  }
})
```

#### 3. React 包

```typescript
// packages/react/.ldesign/builder.config.ts
export default defineConfig({
  name: 'LDesignSizeReact',
  libraryType: 'react',
  
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@ldesign/size-core',
    'lucide-react'
  ],
  
  react: {
    jsxRuntime: 'automatic'
  }
})
```

#### 4. Svelte 包 (Svelte 5)

```typescript
// packages/svelte/.ldesign/builder.config.ts
export default defineConfig({
  name: 'LDesignSizeSvelte',
  libraryType: 'svelte',
  
  external: [
    'svelte',
    'svelte/internal',
    '@ldesign/size-core'
  ],
  
  svelte: {
    compilerOptions: {
      runes: true  // 启用 Svelte 5 runes
    }
  }
})
```

#### 5. Solid 包

```typescript
// packages/solid/.ldesign/builder.config.ts
export default defineConfig({
  name: 'LDesignSizeSolid',
  libraryType: 'solid',
  
  external: [
    'solid-js',
    'solid-js/web',
    'solid-js/store',
    '@ldesign/size-core'
  ],
  
  solid: {
    jsxImportSource: 'solid-js'
  }
})
```

### 构建命令

```bash
# 在包目录下
cd packages/core
pnpm build              # 构建
pnpm build --watch      # 监听模式
pnpm dev                # 开发模式（等同于 build --watch）

# 或从根目录
cd packages/size
pnpm build:core
pnpm build:vue
pnpm build:react
pnpm build:svelte
pnpm build:solid
pnpm build              # 构建所有包
```

---

## 🚀 Launcher 配置 (示例启动)

### 配置文件位置

所有示例的 launcher 配置统一放在 `.ldesign/launcher.config.ts`：

```
packages/
├── core/examples/basic/.ldesign/launcher.config.ts
├── vue/examples/basic/.ldesign/launcher.config.ts
├── react/examples/basic/.ldesign/launcher.config.ts
├── svelte/examples/basic/.ldesign/launcher.config.ts
└── solid/examples/basic/.ldesign/launcher.config.ts
```

### 配置模板

#### 基础配置

```typescript
import { defineConfig } from '@ldesign/launcher'

export default defineConfig({
  server: {
    port: 5170,      // 端口号
    open: true,      // 自动打开浏览器
    host: true       // 监听所有网络接口
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  
  optimizeDeps: {
    include: ['@ldesign/size-core']  // 预构建依赖
  }
})
```

#### 带别名配置

```typescript
export default defineConfig({
  server: {
    port: 5171,
    open: true,
    host: true
  },
  
  resolve: {
    alias: {
      '@': '/src'  // 路径别名
    }
  },
  
  optimizeDeps: {
    include: ['vue', '@ldesign/size-core', '@ldesign/size-vue']
  }
})
```

#### Solid.js 特殊配置

```typescript
export default defineConfig({
  server: {
    port: 5174,
    open: true,
    host: true
  },
  
  resolve: {
    alias: {
      '@': '/src'
    },
    conditions: ['development', 'browser']  // Solid.js 需要
  },
  
  optimizeDeps: {
    include: ['solid-js', '@ldesign/size-core', '@ldesign/size-solid']
  }
})
```

### 启动命令

```bash
# 在示例目录下
cd packages/core/examples/basic
pnpm dev                # 开发模式
pnpm build              # 构建
pnpm preview            # 预览

# 或直接使用 launcher
launcher dev
launcher build
launcher preview

# 指定端口
launcher dev --port 3000

# 不自动打开浏览器
launcher dev --no-open
```

---

## 📁 配置文件位置

### 推荐结构

```
packages/
├── core/
│   ├── .ldesign/
│   │   └── builder.config.ts    ← 包构建配置
│   ├── examples/
│   │   └── basic/
│   │       └── .ldesign/
│   │           └── launcher.config.ts  ← 示例启动配置
│   └── src/
├── vue/
│   ├── .ldesign/
│   │   └── builder.config.ts
│   └── examples/
│       └── basic/
│           └── .ldesign/
│               └── launcher.config.ts
└── ...
```

### 查找优先级

#### Builder

1. `.ldesign/builder.config.ts` ✅ (推荐)
2. `builder.config.ts`
3. `package.json` 的 builder 字段
4. 自动推断

#### Launcher

1. `.ldesign/launcher.config.ts` ✅ (推荐)
2. `launcher.config.ts`
3. `vite.config.ts` (兼容模式)
4. 默认配置

---

## 💻 常用命令

### 包构建命令

```bash
# 单包构建
pnpm --filter @ldesign/size-core build
pnpm --filter @ldesign/size-vue build

# 批量构建
cd packages/size
pnpm build              # 构建所有包
pnpm build:core         # 仅构建 core
pnpm build:vue          # 仅构建 vue
pnpm build:react        # 仅构建 react
pnpm build:svelte       # 仅构建 svelte
pnpm build:solid        # 仅构建 solid

# 监听模式
pnpm dev                # 所有包监听模式
pnpm --filter @ldesign/size-core dev
```

### 示例启动命令

```bash
# 进入示例目录
cd packages/core/examples/basic

# 开发模式
pnpm dev
launcher dev

# 构建
pnpm build
launcher build

# 预览
pnpm preview
launcher preview

# 带参数
launcher dev --port 3000 --open
launcher build --mode production
```

---

## 🔍 配置选项详解

### Builder 主要选项

```typescript
{
  name: string                    // UMD 全局变量名
  libraryType: string             // 库类型: typescript, vue3, react, svelte, solid
  input: string                   // 入口文件
  output: {
    esm: { ... },                 // ESM 输出配置
    cjs: { ... },                 // CJS 输出配置
    umd: { ... }                  // UMD 输出配置
  },
  external: string[]              // 外部依赖
  typescript: { ... },            // TypeScript 配置
  vue/react/svelte/solid: { ... } // 框架特定配置
}
```

### Launcher 主要选项

```typescript
{
  server: {
    port: number,                 // 端口号
    open: boolean,                // 自动打开浏览器
    host: boolean | string        // 监听地址
  },
  build: {
    outDir: string,               // 输出目录
    sourcemap: boolean            // 源码映射
  },
  optimizeDeps: {
    include: string[]             // 预构建依赖
  },
  resolve: {
    alias: Record<string, string> // 路径别名
  }
}
```

---

## 🐛 故障排除

### 问题 1: Builder 构建失败

**症状**: 运行 `pnpm build` 报错

**解决方案**:
```bash
# 1. 检查配置文件是否存在
ls .ldesign/builder.config.ts

# 2. 清除旧产物
pnpm clean

# 3. 重新构建
pnpm build

# 4. 查看详细日志
pnpm build --verbose
```

### 问题 2: Launcher 启动失败

**症状**: 运行 `launcher dev` 报错

**解决方案**:
```bash
# 1. 确保已构建依赖包
cd ../../../
pnpm build:core

# 2. 清除依赖重新安装
rm -rf node_modules
pnpm install

# 3. 使用详细模式
launcher dev --debug
```

### 问题 3: 类型定义缺失

**症状**: TypeScript 报错找不到类型

**解决方案**:
```bash
# 重新生成类型定义
pnpm build --filter "@ldesign/size-*"

# 或单独生成
pnpm --filter @ldesign/size-core build
```

### 问题 4: 端口被占用

**症状**: 端口 517X 已被使用

**解决方案**:

修改 `.ldesign/launcher.config.ts`:
```typescript
server: {
  port: 5xxx  // 改为其他端口
}
```

或使用命令行参数：
```bash
launcher dev --port 3000
```

---

## 📚 进阶配置

### Builder 性能优化

```typescript
export default defineConfig({
  // ... 基础配置
  
  // 开启增量构建
  incremental: true,
  
  // 并行构建
  parallel: true,
  
  // 压缩选项
  minify: {
    esm: false,
    cjs: false,
    umd: true  // 仅压缩 UMD
  },
  
  // 代码分割
  splitting: {
    enabled: true,
    strategy: 'auto'
  }
})
```

### Launcher 开发优化

```typescript
export default defineConfig({
  // ... 基础配置
  
  // 性能优化
  optimizeDeps: {
    include: ['vue', '@ldesign/size-core'],
    exclude: ['@ldesign/size-dev-tools']
  },
  
  // 代理配置
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  
  // 环境变量
  define: {
    __DEV__: true
  }
})
```

---

## 🎯 最佳实践

### 1. 配置组织

推荐将配置放在 `.ldesign/` 目录：

✅ **推荐**:
```
.ldesign/
├── builder.config.ts
└── launcher.config.ts
```

❌ **不推荐**:
```
builder.config.ts
launcher.config.ts
vite.config.ts  (混乱)
```

### 2. External 配置

框架和核心包应该外部化：

```typescript
external: [
  'react',           // 框架
  'react-dom',
  '@ldesign/size-core',  // 依赖包
  'lucide-react'     // UI 库
]
```

### 3. 输出目录统一

保持一致的输出目录结构：

```
es/    # ESM 格式
lib/   # CJS 格式
dist/  # UMD 格式 (可选)
```

### 4. 端口分配

为避免冲突，合理分配端口：

- 5170-5179: Size 包示例
- 5180-5189: 其他包示例
- 3000-3999: 应用项目

---

## 📖 配置参考

### 完整配置示例

查看实际配置文件：

**Builder 配置**:
- [Core Builder](./packages/core/.ldesign/builder.config.ts)
- [Vue Builder](./packages/vue/.ldesign/builder.config.ts)
- [React Builder](./packages/react/.ldesign/builder.config.ts)
- [Svelte Builder](./packages/svelte/.ldesign/builder.config.ts)
- [Solid Builder](./packages/solid/.ldesign/builder.config.ts)

**Launcher 配置**:
- [Core Launcher](./packages/core/examples/basic/.ldesign/launcher.config.ts)
- [Vue Launcher](./packages/vue/examples/basic/.ldesign/launcher.config.ts)
- [React Launcher](./packages/react/examples/basic/.ldesign/launcher.config.ts)
- [Svelte Launcher](./packages/svelte/examples/basic/.ldesign/launcher.config.ts)
- [Solid Launcher](./packages/solid/examples/basic/.ldesign/launcher.config.ts)

### 官方文档

- [@ldesign/builder 文档](../../tools/builder/README.md)
- [@ldesign/launcher 文档](../../tools/launcher/README.md)

---

## 🔄 迁移指南

### 从 Vite 迁移到 Launcher

**步骤 1**: 创建配置文件

```bash
mkdir -p .ldesign
touch .ldesign/launcher.config.ts
```

**步骤 2**: 迁移配置

```typescript
// 之前: vite.config.ts
export default defineConfig({
  plugins: [vue()],
  server: { port: 3000 }
})

// 之后: .ldesign/launcher.config.ts
export default defineConfig({
  server: { port: 3000 }
  // plugins 自动识别，无需配置
})
```

**步骤 3**: 更新 package.json

```json
{
  "scripts": {
    "dev": "launcher dev",      // 之前: vite
    "build": "launcher build",  // 之前: vite build
    "preview": "launcher preview"
  },
  "devDependencies": {
    "@ldesign/launcher": "workspace:*"
    // 移除: vite, @vitejs/plugin-*
  }
}
```

**步骤 4**: 删除旧文件

```bash
rm vite.config.ts
```

---

## 📊 配置对比

| 特性 | 直接使用 Vite | 使用 Builder/Launcher |
|------|-------------|----------------------|
| 配置复杂度 | 高 | 低 |
| 框架插件 | 手动配置 | 自动识别 |
| 类型生成 | 需额外配置 | 内置支持 |
| 多格式输出 | 复杂配置 | 简单声明 |
| 性能优化 | 手动优化 | 自动优化 |
| 维护成本 | 高 | 低 |

---

## 🎉 总结

通过使用 **@ldesign/builder** 和 **@ldesign/launcher**，获得了：

### 优势

1. ✅ **统一配置**: 所有包和示例使用一致的配置系统
2. ✅ **简化维护**: 减少配置文件数量和复杂度
3. ✅ **自动优化**: 内置最佳实践和性能优化
4. ✅ **智能识别**: 自动检测框架并应用配置
5. ✅ **更好的 DX**: 统一的命令接口和错误提示

### 成果

- 🎯 10 个新配置文件
- 🗑️ 10 个旧文件删除
- 📝 完整的配置文档
- 🚀 更简洁的工作流

---

<div align="center">

## 🎊 配置迁移完成！

**所有包和示例现在使用统一的 Builder 和 Launcher**

Made with ❤️ by LDesign Team

</div>


