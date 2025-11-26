# @ldesign/size-vue 使用示例

本文档提供了 @ldesign/size-vue 的完整使用示例，包括所有新增功能。

## 目录

- [基础使用](#基础使用)
- [Composables](#composables)
- [指令](#指令)
- [组件](#组件)
- [高级功能](#高级功能)

## 基础使用

### 1. 安装插件

```ts
import { createApp } from 'vue'
import { createSizePlugin } from '@ldesign/size-vue'
import App from './App.vue'

const app = createApp(App)

// 创建并安装插件
const sizePlugin = createSizePlugin({
  defaultSize: 'comfortable',
  persistence: true,
  storageKey: 'my-app-size',
  locale: 'zh-CN'
})

app.use(sizePlugin)
app.mount('#app')
```

### 2. 使用 useSize Hook

```vue
<script setup lang="ts">
import { useSize } from '@ldesign/size-vue'

const { 
  config, 
  currentPreset, 
  applyPreset, 
  presets 
} = useSize()
</script>

<template>
  <div>
    <p>当前预设: {{ currentPreset }}</p>
    <p>基础尺寸: {{ config.baseSize }}px</p>
    
    <select @change="applyPreset($event.target.value)">
      <option v-for="preset in presets" :key="preset.name" :value="preset.name">
        {{ preset.name }}
      </option>
    </select>
  </div>
</template>
```

## Composables

### useSizeWatch - 监听尺寸变化

```vue
<script setup lang="ts">
import { useSizeWatch } from '@ldesign/size-vue'

// 监听尺寸变化
useSizeWatch((newSize, oldSize) => {
  console.log(`尺寸从 ${oldSize} 变更为 ${newSize}`)
  // 执行自定义逻辑，如数据分析、状态同步等
})
</script>
```

### useSizeCalc - 尺寸计算

```vue
<script setup lang="ts">
import { useSizeCalc } from '@ldesign/size-vue'

const { calc, getVar, scale, baseSize } = useSizeCalc()

// 基于基础尺寸计算
const padding = calc(2) // baseSize * 2
const margin = calc(1.5) // baseSize * 1.5

// 获取 CSS 变量
const fontSize = getVar('font-base')

// 缩放计算
const scaledValue = scale(16, 1.5) // 16 * 1.5 = 24px
</script>

<template>
  <div>
    <p>基础尺寸: {{ baseSize }}px</p>
    <div :style="{ padding: padding, margin: margin }">
      动态尺寸容器
    </div>
  </div>
</template>
```

### useSizeTransition - 平滑过渡

```vue
<script setup lang="ts">
import { useSizeTransition } from '@ldesign/size-vue'

const { transitionTo, isTransitioning } = useSizeTransition(300)

async function changeSize(size: string) {
  await transitionTo(size)
  console.log('尺寸切换完成')
}
</script>

<template>
  <div>
    <button 
      @click="changeSize('compact')" 
      :disabled="isTransitioning"
    >
      紧凑模式
    </button>
    <button 
      @click="changeSize('comfortable')" 
      :disabled="isTransitioning"
    >
      舒适模式
    </button>
    <button 
      @click="changeSize('spacious')" 
      :disabled="isTransitioning"
    >
      宽松模式
    </button>
  </div>
</template>
```

### useSizeBreakpoint - 响应式断点

```vue
<script setup lang="ts">
import { useSizeBreakpoint } from '@ldesign/size-vue'

const { breakpoint, isMobile, isTablet, isDesktop } = useSizeBreakpoint()
</script>

<template>
  <div>
    <p>当前断点: {{ breakpoint }}</p>
    <p v-if="isMobile">移动端视图</p>
    <p v-else-if="isTablet">平板视图</p>
    <p v-else>桌面视图</p>
  </div>
</template>
```

### useAutoSize - 自动适配

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useAutoSize } from '@ldesign/size-vue'

const autoEnabled = ref(true)

// 根据设备自动切换尺寸
useAutoSize({
  mobile: 'compact',
  tablet: 'comfortable',
  desktop: 'spacious',
  enabled: autoEnabled
})
</script>

<template>
  <div>
    <label>
      <input type="checkbox" v-model="autoEnabled" />
      启用自动尺寸适配
    </label>
  </div>
</template>
```

### useSizePersistence - 持久化

```vue
<script setup lang="ts">
import { useSizePersistence } from '@ldesign/size-vue'

// 自动保存和恢复用户的尺寸偏好
const { clear } = useSizePersistence('my-app-size-preference')

function resetSize() {
  clear() // 清除保存的偏好
}
</script>
```

## 指令

### v-size 指令

v-size 指令提供了声明式的尺寸控制方式。

#### 单一属性模式

```vue
<template>
  <!-- 设置字体尺寸 -->
  <div v-size:font="'large'">大号字体</div>
  
  <!-- 设置间距 -->
  <div v-size:spacing="'comfortable'">舒适间距</div>
  
  <!-- 设置行高 -->
  <div v-size:lineHeight="'relaxed'">宽松行高</div>
  
  <!-- 动态绑定 -->
  <div v-size:font="selectedSize">动态尺寸</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const selectedSize = ref('medium')
</script>
```

#### 对象模式

```vue
<template>
  <!-- 同时设置多个尺寸属性 -->
  <div v-size="{ 
    font: 'lg', 
    spacing: 'md',
    lineHeight: 'normal'
  }">
    多属性尺寸控制
  </div>
  
  <!-- 响应式对象 -->
  <div v-size="sizeConfig">
    响应式尺寸
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const sizeConfig = reactive({
  font: 'medium',
  spacing: 'comfortable',
  lineHeight: 'relaxed'
})

function updateSize() {
  sizeConfig.font = 'large'
  sizeConfig.spacing = 'spacious'
}
</script>
```

#### 实际应用示例

```vue
<template>
  <div class="dashboard">
    <!-- 标题区域 - 大号字体 -->
    <header v-size:font="'xl'">
      <h1>数据仪表板</h1>
    </header>
    
    <!-- 内容区域 - 舒适间距 -->
    <main v-size:spacing="'comfortable'">
      <!-- 卡片列表 -->
      <div 
        v-for="card in cards" 
        :key="card.id"
        v-size="{ font: 'md', spacing: 'md' }"
        class="card"
      >
        {{ card.content }}
      </div>
    </main>
    
    <!-- 侧边栏 - 紧凑模式 -->
    <aside v-size="{ font: 'sm', spacing: 'compact' }">
      <nav>导航菜单</nav>
    </aside>
  </div>
</template>
```

## 组件

### SizeSwitcher - 尺寸切换器

```vue
<template>
  <SizeSwitcher />
</template>

<script setup lang="ts">
import { SizeSwitcher } from '@ldesign/size-vue'
</script>
```

### SizePresetPicker - 预设选择器

```vue
<template>
  <SizePresetPicker 
    :presets="['compact', 'comfortable', 'spacious']"
    @change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import { SizePresetPicker } from '@ldesign/size-vue'

function handleSizeChange(size: string) {
  console.log('尺寸已切换为:', size)
}
</script>
```

## 高级功能

### 完整的应用示例

```vue
<template>
  <div class="app">
    <!-- 顶部工具栏 -->
    <header class="toolbar">
      <SizeSwitcher />
      
      <label>
        <input type="checkbox" v-model="autoSizeEnabled" />
        自动适配尺寸
      </label>
    </header>
    
    <!-- 主内容区 -->
    <main v-size="mainSizeConfig">
      <section v-size:spacing="'comfortable'">
        <h2>当前状态</h2>
        <ul>
          <li>当前预设: {{ currentPreset }}</li>
          <li>基础尺寸: {{ config.baseSize }}px</li>
          <li>断点: {{ breakpoint }}</li>
          <li>设备类型: {{ deviceType }}</li>
        </ul>
      </section>
      
      <section>
        <h2>快速切换</h2>
        <button 
          v-for="preset in presets" 
          :key="preset.name"
          @click="changeWithTransition(preset.name)"
          :disabled="isTransitioning"
        >
          {{ preset.name }}
        </button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { 
  useSize,
  useSizeTransition,
  useSizeBreakpoint,
  useAutoSize,
  useSizePersistence,
  useSizeWatch,
  SizeSwitcher
} from '@ldesign/size-vue'

// 基础尺寸管理
const { config, currentPreset, presets } = useSize()

// 平滑过渡
const { transitionTo, isTransitioning } = useSizeTransition(300)

// 响应式断点
const { breakpoint, isMobile, isTablet, isDesktop } = useSizeBreakpoint()

// 自动尺寸适配
const autoSizeEnabled = ref(true)
useAutoSize({
  mobile: 'compact',
  tablet: 'comfortable',
  desktop: 'spacious',
  enabled: autoSizeEnabled
})

// 持久化
useSizePersistence('app-size-preference')

// 监听变化
useSizeWatch((newSize, oldSize) => {
  console.log(`尺寸从 ${oldSize} 切换到 ${newSize}`)
})

// 主内容区尺寸配置
const mainSizeConfig = reactive({
  font: 'md',
  spacing: 'comfortable',
  lineHeight: 'normal'
})

// 设备类型
const deviceType = computed(() => {
  if (isMobile.value) return '移动端'
  if (isTablet.value) return '平板'
  if (isDesktop.value) return '桌面'
  return '未知'
})

// 带过渡的尺寸切换
async function changeWithTransition(size: string) {
  await transitionTo(size)
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.app {
  min-height: 100vh;
}

main {
  padding: 2rem;
}

section {
  margin-bottom: 2rem;
}

button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

## TypeScript 支持

所有功能都提供了完整的 TypeScript 类型支持：

```ts
import type { 
  SizeConfig,
  SizePreset,
  SizeManager
} from '@ldesign/size-vue'

// 类型安全的配置
const config: SizeConfig = {
  baseSize: 16,
  // ... 其他配置
}

// 类型安全的预设
const preset: SizePreset = {
  name: 'custom',
  // ... 预设配置
}
```

## 最佳实践

1. **使用持久化**: 启用 `useSizePersistence` 保存用户偏好
2. **响应式设计**: 结合 `useSizeBreakpoint` 和 `useAutoSize` 实现自适应
3. **平滑过渡**: 使用 `useSizeTransition` 提供更好的用户体验
4. **声明式控制**: 优先使用 `v-size` 指令，代码更清晰
5. **监听变化**: 使用 `useSizeWatch` 处理尺寸变化的副作用

## 常见问题

### Q: 如何在不同页面使用不同的默认尺寸？

A: 使用 `useAutoSize` 或在组件中手动调用 `applyPreset`：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useSize } from '@ldesign/size-vue'

const { applyPreset } = useSize()

onMounted(() => {
  applyPreset('compact') // 该页面使用紧凑模式
})
</script>
```

### Q: 如何禁用自动持久化？

A: 在插件配置中设置 `persistence: false`：

```ts
const sizePlugin = createSizePlugin({
  persistence: false
})
```

### Q: 如何自定义 CSS 变量前缀？

A: CSS 变量使用固定的 `--size-` 前缀，如需自定义，可以通过 CSS 变量映射：

```css
:root {
  --my-font-size: var(--size-font-base);
  --my-spacing: var(--size-spacing-base);
}
```

## 更多资源

- [Core API 文档](../core/README.md)
- [Vue Plugin 配置指南](./PLUGIN_CONFIG_GUIDE.md)
- [国际化指南](./I18N_GUIDE.md)