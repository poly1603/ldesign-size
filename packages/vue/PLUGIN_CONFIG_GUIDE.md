# Size Engine 插件配置指南

## 📖 概述

`createSizeEnginePlugin` 是 LDesign Size 系统的 Engine 插件，用于在 LDesign Engine 中集成尺寸管理功能。

## 🚀 快速开始

### 基础配置

```typescript
import { createVueEngine } from '@ldesign/engine-vue3'
import { createSizeEnginePlugin } from '@ldesign/size-vue/plugins'

const engine = createVueEngine({
  plugins: [
    createSizeEnginePlugin({
      baseSize: 'default', // 使用预设名称
      persistence: {
        enabled: true,
        key: 'my-app-size',
      },
    }),
  ],
})
```

### 完整配置示例

```typescript
createSizeEnginePlugin({
  // ========== 基础配置 ==========
  
  /**
   * 基础尺寸
   * 支持两种类型：
   * 1. 具体数值：如 16、18 等
   * 2. 预设名称：如 'default'、'compact'、'comfortable'、'large'
   */
  baseSize: 'default', // 或 16
  
  /**
   * 缩放比例
   * 用于计算不同层级的尺寸
   */
  scale: 1.25,
  
  /**
   * 单位
   * 支持 'px'、'rem'、'em'
   */
  unit: 'px',
  
  // ========== 自定义预设 ==========
  
  /**
   * 自定义预设数组
   * 用于扩展或覆盖内置预设
   */
  customPresets: [
    {
      name: 'brand-compact',      // 预设名称（唯一标识）
      label: '品牌紧凑',           // 显示标签
      description: '品牌定制的紧凑尺寸系统', // 描述信息
      order: 1,                   // 排序字段（数字越小越靠前）
      config: {
        baseSize: 14,
        scale: 1.2,
        unit: 'px',
        lineHeight: 1.5,
        letterSpacing: 0,
      },
    },
    {
      name: 'brand-default',
      label: '品牌默认',
      description: '品牌定制的默认尺寸系统',
      order: 2,
      config: {
        baseSize: 16,
        scale: 1.25,
        unit: 'px',
        lineHeight: 1.6,
        letterSpacing: 0,
      },
    },
  ],
  
  // ========== 持久化配置 ==========
  
  /**
   * 持久化配置
   * 用于保存用户的尺寸选择
   */
  persistence: {
    enabled: true,                    // 是否启用持久化
    key: 'ldesign-app-size',          // 存储键名
    storage: 'localStorage',          // 存储类型：'localStorage' | 'sessionStorage'
  },
  
  // ========== Engine 特定配置 ==========
  
  /**
   * 插件名称
   * 默认：'size'
   */
  name: 'size',
  
  /**
   * 插件版本
   * 默认：'1.0.0'
   */
  version: '1.0.0',
  
  /**
   * 是否启用调试模式
   * 默认：false
   */
  debug: false,
  
  /**
   * 是否注册全局属性
   * 默认：true
   */
  globalProperties: true,
  
  /**
   * 是否注册全局组件
   * 默认：true
   */
  globalComponents: true,
  
  /**
   * 是否立即初始化
   * 默认：true
   */
  immediate: true,
})
```

## 📝 配置项详解

### 1. baseSize - 基础尺寸

支持两种类型：

#### 方式 1：使用预设名称（推荐）

```typescript
createSizeEnginePlugin({
  baseSize: 'default', // 使用内置预设
})
```

**内置预设名称**：
- `'compact'` - 紧凑（14px）
- `'default'` - 默认（16px）
- `'comfortable'` - 舒适（18px）
- `'large'` - 大号（20px）

#### 方式 2：使用具体数值

```typescript
createSizeEnginePlugin({
  baseSize: 16, // 直接指定基础尺寸
})
```

### 2. customPresets - 自定义预设

用于扩展或覆盖内置预设：

```typescript
createSizeEnginePlugin({
  customPresets: [
    {
      name: 'brand-default',  // 如果与内置预设同名，会覆盖内置预设
      label: '品牌默认',
      description: '品牌定制的默认尺寸系统',
      order: 1,               // 排序字段
      config: {
        baseSize: 16,
        scale: 1.25,
        unit: 'px',
      },
    },
  ],
})
```

**预设合并规则**：
1. 自定义预设会与内置预设合并
2. 如果 `name` 相同，自定义预设会覆盖内置预设
3. 最终按 `order` 字段升序排序

### 3. persistence - 持久化配置

用于保存用户的尺寸选择：

```typescript
createSizeEnginePlugin({
  persistence: {
    enabled: true,              // 启用持久化
    key: 'my-app-size',         // 存储键名
    storage: 'localStorage',    // 存储类型
  },
})
```

**存储内容**：
```json
{
  "presetName": "default",
  "baseSize": 16,
  "scale": 1.25,
  "unit": "px"
}
```

## 🎯 使用场景

### 场景 1：使用内置预设

```typescript
createSizeEnginePlugin({
  baseSize: 'default',
  persistence: { enabled: true },
})
```

### 场景 2：自定义预设

```typescript
createSizeEnginePlugin({
  baseSize: 'brand-default',
  customPresets: [
    {
      name: 'brand-default',
      label: '品牌默认',
      config: { baseSize: 16, scale: 1.25, unit: 'px' },
    },
  ],
})
```

### 场景 3：覆盖内置预设

```typescript
createSizeEnginePlugin({
  baseSize: 'default',
  customPresets: [
    {
      name: 'default', // 覆盖内置的 'default' 预设
      label: '自定义默认',
      config: { baseSize: 18, scale: 1.3, unit: 'px' },
    },
  ],
})
```

## 🔧 API 参考

### 从 Engine 获取 Size 适配器

```typescript
import { useSizeFromEngine } from '@ldesign/size-vue/plugins'

const sizeAdapter = useSizeFromEngine(engine)

if (sizeAdapter) {
  // 获取当前预设
  const currentPreset = sizeAdapter.getCurrentPreset()
  
  // 获取所有预设
  const presets = sizeAdapter.getPresets()
  
  // 应用预设
  sizeAdapter.applyPreset('compact')
  
  // 获取当前状态
  const state = sizeAdapter.getState()
}
```

## 📚 相关文档

- [多语言配置指南](./I18N_GUIDE.md)
- [组件使用指南](./README.md)

---

> 💡 **提示**：建议结合多语言配置使用，以提供更好的用户体验。

