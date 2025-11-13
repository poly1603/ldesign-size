# Size 多语言配置指南

## 📖 概述

Size 系统支持完整的多语言配置，包括预设名称和描述的翻译。

## 🌍 配置步骤

### 1. 在语言包中添加翻译

#### 中文（zh-CN.ts）

```typescript
export default {
  // ... 其他翻译 ...
  
  size: {
    title: '尺寸管理',
    currentSize: '当前尺寸',
    currentPreset: '当前预设',
    baseSize: '基础尺寸',
    scale: '缩放比例',
    unit: '单位',
    
    // 预设名称翻译
    presets: {
      // 内置预设
      compact: '紧凑',
      default: '默认',
      comfortable: '舒适',
      large: '大号',
      
      // 自定义预设
      'brand-compact': '品牌紧凑',
      'brand-default': '品牌默认',
    },
    
    // 预设描述翻译
    descriptions: {
      // 内置预设描述
      compact: '紧凑的尺寸系统，适合信息密集型界面',
      default: '默认的尺寸系统，平衡美观和实用',
      comfortable: '舒适的尺寸系统，适合长时间阅读',
      large: '大号尺寸系统，适合老年人和视力不佳者',
      
      // 自定义预设描述
      'brand-compact': '品牌定制的紧凑尺寸系统',
      'brand-default': '品牌定制的默认尺寸系统',
    },
    
    selectPreset: '选择预设',
    customSize: '自定义尺寸',
    apply: '应用',
    reset: '重置',
  },
}
```

#### 英文（en-US.ts）

```typescript
export default {
  // ... other translations ...
  
  size: {
    title: 'Size Management',
    currentSize: 'Current Size',
    currentPreset: 'Current Preset',
    baseSize: 'Base Size',
    scale: 'Scale',
    unit: 'Unit',
    
    // Preset name translations
    presets: {
      // Built-in presets
      compact: 'Compact',
      default: 'Default',
      comfortable: 'Comfortable',
      large: 'Large',
      
      // Custom presets
      'brand-compact': 'Brand Compact',
      'brand-default': 'Brand Default',
    },
    
    // Preset description translations
    descriptions: {
      // Built-in preset descriptions
      compact: 'Compact size system for information-dense interfaces',
      default: 'Default size system balancing aesthetics and practicality',
      comfortable: 'Comfortable size system for extended reading',
      large: 'Large size system for elderly and visually impaired',
      
      // Custom preset descriptions
      'brand-compact': 'Brand customized compact size system',
      'brand-default': 'Brand customized default size system',
    },
    
    selectPreset: 'Select Preset',
    customSize: 'Custom Size',
    apply: 'Apply',
    reset: 'Reset',
  },
}
```

### 2. 在 main.ts 中配置自定义预设

```typescript
import { createSizeEnginePlugin } from '@ldesign/size-vue/plugins'

createSizeEnginePlugin({
  baseSize: 'brand-default',
  
  customPresets: [
    {
      name: 'brand-compact',      // ← 用于 i18n 键名
      label: '品牌紧凑',           // ← 降级显示
      description: '品牌定制的紧凑尺寸系统', // ← 降级显示
      order: 1,
      config: {
        baseSize: 14,
        scale: 1.2,
        unit: 'px',
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
      },
    },
  ],
})
```

## 🎯 工作原理

### 翻译键名规则

| 内容 | 翻译键名 | 示例 |
|------|---------|------|
| **预设名称** | `size.presets.{name}` | `size.presets.brand-compact` |
| **预设描述** | `size.descriptions.{name}` | `size.descriptions.brand-compact` |

### 降级机制

组件会按以下优先级获取显示文本：

1. **i18n 翻译**（最高优先级）
   - 如果找到 `size.presets.brand-compact`，使用翻译值
   
2. **预设定义中的 label/description**（降级）
   - 如果没有翻译，使用 `customPresets` 中的 `label` 和 `description` 字段
   
3. **预设的 name**（最后降级）
   - 如果都没有，直接显示 `name` 字段

## 📝 完整示例

### 步骤 1：定义自定义预设

```typescript
// main.ts
createSizeEnginePlugin({
  customPresets: [
    {
      name: 'brand-compact',
      label: '品牌紧凑',
      description: '品牌定制的紧凑尺寸系统',
      config: { baseSize: 14, scale: 1.2, unit: 'px' },
    },
  ],
})
```

### 步骤 2：添加中文翻译

```typescript
// locales/zh-CN.ts
export default {
  size: {
    presets: {
      'brand-compact': '品牌紧凑',
    },
    descriptions: {
      'brand-compact': '品牌定制的紧凑尺寸系统',
    },
  },
}
```

### 步骤 3：添加英文翻译

```typescript
// locales/en-US.ts
export default {
  size: {
    presets: {
      'brand-compact': 'Brand Compact',
    },
    descriptions: {
      'brand-compact': 'Brand customized compact size system',
    },
  },
}
```

### 步骤 4：在组件中使用

```vue
<template>
  <SizePresetPicker />
</template>

<script setup>
import { SizePresetPicker } from '@ldesign/size-vue'
</script>
```

## ✨ 功能特性

- ✅ **实时切换**：切换语言时，尺寸选择器立即更新
- ✅ **降级机制**：即使没有配置 i18n，也能正常显示
- ✅ **支持短横线**：预设名称可以使用 `'brand-compact'` 这样的格式
- ✅ **完全响应式**：基于 Vue 3 的响应式系统

## 🧪 测试步骤

1. 启动应用：`pnpm --filter @ldesign/app-vue dev`
2. 打开尺寸管理页面
3. 查看自定义预设是否显示：
   - 中文：`品牌紧凑 - 品牌定制的紧凑尺寸系统`
   - 英文：`Brand Compact - Brand customized compact size system`
4. 切换语言，观察是否实时更新

## 📚 相关文档

- [插件配置指南](./PLUGIN_CONFIG_GUIDE.md)
- [组件使用指南](./README.md)

---

> 💡 **提示**：建议为所有自定义预设添加完整的多语言翻译，以提供最佳的用户体验。

