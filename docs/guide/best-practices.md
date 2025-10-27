# 最佳实践

本文档总结了使用 @ldesign/size 时的最佳实践和常见模式。

## 🎯 核心原则

### 1. 语义化优先

始终使用语义化的变量名，而不是硬编码的值：

```css
/* ✅ 推荐 */
.button {
  height: var(--ls-button-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-sm);
}

/* ❌ 避免 */
.button {
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
}
```

### 2. 渐进增强

从基础功能开始，逐步添加高级特性：

```typescript
// ✅ 推荐：从简单开始
import { globalSizeManager } from '@ldesign/size'
globalSizeManager.setMode('medium')

// 逐步添加功能
globalSizeManager.onSizeChange((event) => {
  // 添加自定义逻辑
})

// ❌ 避免：一开始就使用复杂配置
const manager = createComplexSizeManager({
  // 很多配置...
})
```

### 3. 性能优先

```typescript
// ✅ 推荐：使用全局单例
import { globalSizeManager } from '@ldesign/size'

// ❌ 避免：创建多个实例
const manager1 = createSizeManager()
const manager2 = createSizeManager()
const manager3 = createSizeManager()
```

## 🏗️ 架构模式

### 1. 单一数据源

使用全局管理器作为单一数据源：

```typescript
// store/size.ts
import { globalSizeManager } from '@ldesign/size'

// 导出单一实例
export const sizeManager = globalSizeManager

// 导出辅助函数
export function initSize() {
  const saved = localStorage.getItem('size-mode')
  if (saved) {
    sizeManager.setMode(saved)
  }
}

export function saveSize(mode) {
  localStorage.setItem('size-mode', mode)
}
```

### 2. 分层抽象

```typescript
// 基础层：核心功能
import { globalSizeManager } from '@ldesign/size'

// 应用层：业务逻辑
export class SizeService {
  constructor(private manager = globalSizeManager) {}
  
  setSize(mode: SizeMode) {
    this.manager.setMode(mode)
    this.trackEvent('size_changed', { mode })
  }
  
  private trackEvent(name: string, data: any) {
    // 埋点逻辑
  }
}

// UI层：组件
export function SizeSelector() {
  const service = new SizeService()
  return <button onClick={() => service.setSize('large')}>Large</button>
}
```

## 🎨 样式组织

### 1. CSS 变量组织

```css
/* variables.css - 定义全局变量 */
:root {
  /* 基础变量来自 @ldesign/size */
  /* 无需重新定义 */
}

/* components.css - 组件级变量 */
.button {
  --button-hover-scale: 1.05;
  --button-active-scale: 0.95;
  
  height: var(--ls-button-height-medium);
  transform: scale(1);
  transition: transform var(--ls-duration-base);
}

.button:hover {
  transform: scale(var(--button-hover-scale));
}
```

### 2. 模块化样式

```css
/* button.css */
.btn {
  /* 基础样式使用 @ldesign/size 变量 */
  height: var(--ls-button-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-sm);
  border-radius: var(--ls-border-radius-base);
}

.btn--small {
  height: var(--ls-button-height-small);
}

.btn--large {
  height: var(--ls-button-height-large);
}
```

### 3. 组件封装

```css
/* card.css */
.card {
  --card-padding: var(--ls-spacing-lg);
  --card-gap: var(--ls-spacing-base);
  
  padding: var(--card-padding);
  border-radius: var(--ls-border-radius-lg);
  box-shadow: var(--ls-shadow-base);
}

.card__header {
  margin-bottom: var(--card-gap);
}

.card__body {
  font-size: var(--ls-font-size-base);
}
```

## 🔧 Vue 最佳实践

### 1. 使用 Composition API

```vue
<script setup lang="ts">
import { useSize } from '@ldesign/size/vue'

// ✅ 推荐：使用组合式 API
const { currentMode, setMode } = useSize()

// ✅ 推荐：提取为可复用的 composable
function useSizeActions() {
  const { setMode } = useSize()
  
  function setSizeAndTrack(mode: SizeMode) {
    setMode(mode)
    track('size_changed', { mode })
  }
  
  return { setSizeAndTrack }
}
</script>
```

### 2. 组件设计

```vue
<!-- ✅ 推荐：可配置的组件 -->
<script setup lang="ts">
import { useSize } from '@ldesign/size/vue'

interface Props {
  size?: SizeMode
  responsive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  responsive: false
})

const { currentMode, setMode } = useSize()

// 使用传入的 size 或当前模式
const effectiveSize = computed(() => props.size || currentMode.value)
</script>

<template>
  <div :class="`component component--${effectiveSize}`">
    <slot />
  </div>
</template>
```

### 3. 性能优化

```vue
<script setup lang="ts">
import { useSize, useSizeConfig } from '@ldesign/size/vue'
import { computed } from 'vue'

const { currentMode } = useSize()

// ✅ 推荐：使用 computed 缓存计算结果
const gridColumns = computed(() => {
  switch (currentMode.value) {
    case 'small': return 1
    case 'medium': return 2
    case 'large': return 3
    default: return 2
  }
})

// ❌ 避免：在模板中进行复杂计算
// <div :style="{ columns: currentMode === 'small' ? 1 : currentMode === 'medium' ? 2 : 3 }">
</script>

<template>
  <div :style="{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }">
    <slot />
  </div>
</template>
```

## 💾 状态管理

### 1. 持久化策略

```typescript
// utils/storage.ts
export class SizeStorage {
  private readonly key = 'app-size-mode'
  
  save(mode: SizeMode) {
    try {
      localStorage.setItem(this.key, mode)
    } catch (error) {
      console.warn('Failed to save size preference:', error)
    }
  }
  
  load(): SizeMode | null {
    try {
      return localStorage.getItem(this.key) as SizeMode
    } catch (error) {
      console.warn('Failed to load size preference:', error)
      return null
    }
  }
  
  clear() {
    localStorage.removeItem(this.key)
  }
}

// 使用
const storage = new SizeStorage()
const savedMode = storage.load()
if (savedMode) {
  globalSizeManager.setMode(savedMode)
}
```

### 2. 响应式同步

```typescript
// composables/useResponsiveSize.ts
import { ref, watch, onMounted } from 'vue'
import { globalSizeManager } from '@ldesign/size'

export function useAutoSizeSync() {
  const mode = ref(globalSizeManager.getCurrentMode())
  
  // 监听尺寸变化
  onMounted(() => {
    const unwatch = globalSizeManager.onSizeChange((event) => {
      mode.value = event.currentMode
    })
    
    return unwatch
  })
  
  // 保存用户偏好
  watch(mode, (newMode) => {
    localStorage.setItem('size-mode', newMode)
  })
  
  return { mode }
}
```

## 🎯 响应式设计

### 1. 媒体查询配合

```css
.container {
  padding: var(--ls-spacing-base);
}

/* 小屏幕 */
@media (max-width: 768px) {
  .container {
    padding: var(--ls-spacing-sm);
  }
}

/* 大屏幕 */
@media (min-width: 1200px) {
  .container {
    padding: var(--ls-spacing-lg);
  }
}
```

### 2. 自适应布局

```css
.grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(calc(var(--ls-spacing-base) * 20), 1fr)
  );
  gap: var(--ls-spacing-base);
}
```

### 3. 设备适配

```typescript
import { useResponsiveSize } from '@ldesign/size/vue'

export function useDeviceAdaptation() {
  const { deviceType, currentMode } = useResponsiveSize({
    autoAdjust: true,
    modeMap: {
      mobile: 'small',
      tablet: 'medium',
      desktop: 'large'
    }
  })
  
  return { deviceType, currentMode }
}
```

## 🔍 调试技巧

### 1. 开发模式日志

```typescript
const DEBUG = process.env.NODE_ENV === 'development'

globalSizeManager.onSizeChange((event) => {
  if (DEBUG) {
    console.log('Size changed:', event)
    console.table({
      '上一个模式': event.previousMode,
      '当前模式': event.currentMode,
      '时间戳': new Date(event.timestamp).toLocaleString()
    })
  }
})
```

### 2. CSS 变量查看器

```typescript
// DevTools 组件
export function VariablesViewer() {
  const variables = useSizeVariables()
  
  return (
    <div className="variables-viewer">
      <h3>当前 CSS 变量</h3>
      <table>
        {Object.entries(variables).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}
```

## ⚡ 性能优化

### 1. 避免频繁切换

```typescript
// ❌ 避免
button.addEventListener('mouseover', () => {
  globalSizeManager.setMode('large')
})
button.addEventListener('mouseout', () => {
  globalSizeManager.setMode('medium')
})

// ✅ 推荐
let debounceTimer: number
button.addEventListener('click', () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    globalSizeManager.setMode('large')
  }, 300)
})
```

### 2. 批量更新

```typescript
// ✅ 推荐：一次性更新
globalSizeManager.setMode('large')

// ❌ 避免：多次更新
globalSizeManager.setMode('medium')
globalSizeManager.setMode('large')
globalSizeManager.setMode('medium')
```

### 3. 条件加载

```typescript
// ✅ 推荐：按需加载高级功能
import { globalSizeManager } from '@ldesign/size'

// 只在需要时加载 Vue 组件
if (framework === 'vue') {
  const { SizeSelector } = await import('@ldesign/size/vue')
}
```

## 🧪 测试建议

### 1. 单元测试

```typescript
import { describe, it, expect } from 'vitest'
import { createSizeManager } from '@ldesign/size'

describe('SizeManager', () => {
  it('should change mode correctly', () => {
    const manager = createSizeManager()
    manager.setMode('large')
    expect(manager.getCurrentMode()).toBe('large')
  })
  
  it('should trigger change event', (done) => {
    const manager = createSizeManager()
    manager.onSizeChange((event) => {
      expect(event.currentMode).toBe('large')
      done()
    })
    manager.setMode('large')
  })
})
```

### 2. 组件测试

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

describe('SizeSelector', () => {
  it('should render buttons for each size', () => {
    const wrapper = mount(SizeSelector)
    expect(wrapper.findAll('button')).toHaveLength(3)
  })
  
  it('should change mode on button click', async () => {
    const wrapper = mount(SizeSelector)
    await wrapper.find('[data-mode="large"]').trigger('click')
    // 验证模式变化
  })
})
```

## 📦 项目组织

### 推荐的文件结构

```
src/
├── styles/
│   ├── variables.css      # 自定义变量
│   ├── components/        # 组件样式
│   │   ├── button.css
│   │   ├── card.css
│   │   └── form.css
│   └── utils.css          # 工具类
├── composables/
│   ├── useSize.ts         # 尺寸相关 composables
│   └── useResponsive.ts   # 响应式相关
├── components/
│   ├── ui/                # UI 组件
│   │   ├── Button.vue
│   │   └── Card.vue
│   └── size/              # 尺寸控制组件
│       ├── SizeSelector.vue
│       └── SizeIndicator.vue
└── utils/
    ├── size-storage.ts    # 存储工具
    └── size-helpers.ts    # 辅助函数
```

## 🎓 学习路径

### 新手

1. 安装并使用基础 API
2. 了解 CSS 变量系统
3. 在组件中使用变量

### 进阶

1. 使用 Vue 集成
2. 响应式设计
3. 自定义主题

### 高级

1. 创建自定义插件
2. 性能优化
3. 复杂场景处理

## ✅ 检查清单

在生产环境部署前，确保：

- [ ] 已测试所有尺寸模式
- [ ] CSS 变量正确生效
- [ ] 响应式布局工作正常
- [ ] 用户偏好能够保存
- [ ] 无障碍访问符合标准
- [ ] 性能表现良好
- [ ] 浏览器兼容性测试通过

## 🔗 相关资源

- [API 参考](../api/core) - 完整的 API 文档
- [示例项目](../examples/basic-usage) - 实际示例
- [常见问题](../troubleshooting/faq) - 问题解答

