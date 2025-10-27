# @ldesign/size 快速参考

## 🆕 新增功能概览

本次优化新增了多个强大功能，以下是快速参考指南。

---

## 📦 缓存管理

### 基础用法

```typescript
import { globalCacheManager, CacheType } from '@ldesign/size'

// 获取缓存统计
const stats = globalCacheManager.getStats(CacheType.PARSE)
console.log(`命中率: ${(stats.hitRate * 100).toFixed(1)}%`)

// 打印所有缓存统计
globalCacheManager.printStats()

// 获取健康报告
const warnings = globalCacheManager.getHealthReport(0.7) // 70% 阈值
warnings.forEach(w => console.warn(w))

// 清理特定缓存
globalCacheManager.clear(CacheType.CSS)

// 清理所有缓存
globalCacheManager.clearAll()
```

### 缓存类型

```typescript
enum CacheType {
  SIZE_POOL = 'SIZE_POOL',           // Size 对象池
  PARSE = 'PARSE',                   // 字符串解析缓存
  FORMAT = 'FORMAT',                 // 格式化缓存
  CONVERSION = 'CONVERSION',         // 单位转换缓存
  CSS = 'CSS',                       // CSS 生成缓存
  COMMON_VALUES = 'COMMON_VALUES',   // 常用值缓存
  UTILITY = 'UTILITY',               // 工具函数缓存
}
```

---

## 🚨 错误处理

### 注册错误处理器

```typescript
import { globalErrorHandler, ERROR_CODES, SizeError } from '@ldesign/size'

// 注册特定错误的处理器
globalErrorHandler.register(ERROR_CODES.INVALID_SIZE, (error) => {
  console.error('尺寸错误:', error.message)
  console.error('上下文:', error.context)
  // 发送到错误追踪服务
  sendToSentry(error)
})

// 注册全局处理器（捕获所有错误）
globalErrorHandler.register(null, (error) => {
  logToServer({
    code: error.code,
    message: error.message,
    context: error.context,
    timestamp: error.timestamp
  })
})
```

### 抛出错误

```typescript
import { SizeError, ERROR_CODES, handleError } from '@ldesign/size'

// 方式 1：直接抛出
throw new SizeError(
  '无效的基础尺寸',
  ERROR_CODES.INVALID_SIZE,
  { value: -1, expected: '> 0' }
)

// 方式 2：使用辅助函数
handleError('配置无效', ERROR_CODES.INVALID_CONFIG, { config })
```

### 错误代码

```typescript
ERROR_CODES = {
  INVALID_SIZE,           // 无效的尺寸值
  PRESET_NOT_FOUND,       // 预设未找到
  MANAGER_DESTROYED,      // 管理器已销毁
  INVALID_CONFIG,         // 无效的配置
  CONVERSION_FAILED,      // 单位转换失败
  CSS_INJECTION_FAILED,   // CSS 注入失败
  STORAGE_FAILED,         // 存储操作失败
  LISTENER_ERROR,         // 监听器错误
  PLUGIN_INIT_FAILED,     // 插件初始化失败
}
```

---

## 📊 性能监控

### 基础监控

```typescript
import { perf } from '@ldesign/size'

// 监控操作性能
perf.start('cssGeneration')
// ... 生成 CSS
const duration = perf.end('cssGeneration')
console.log(`耗时: ${duration}ms`)

// 打印完整报告
perf.log()

// 重置所有指标
perf.reset()
```

### 性能预算

```typescript
// 设置性能预算
perf.setBudget({
  cssGeneration: 20,      // CSS 生成最多 20ms
  sizeCalculation: 5,     // 尺寸计算最多 5ms
  viewportUpdate: 10,     // 视口更新最多 10ms
  minCacheHitRate: 0.8,   // 最小缓存命中率 80%
  maxMemoryUsage: 50      // 最大内存 50MB
})

// 手动检查预算
const isOk = perf.checkBudget('cssGeneration', 15)
// 超出预算会自动警告到控制台
```

### 性能趋势

```typescript
// 获取性能趋势
const trend = perf.trend('cssGeneration')

if (trend === 'degrading') {
  console.warn('⚠️ CSS 生成性能正在退化！')
} else if (trend === 'improving') {
  console.log('✅ CSS 生成性能正在改善')
}

// 趋势类型: 'improving' | 'stable' | 'degrading'
```

### 优化建议

```typescript
// 获取自动优化建议
const suggestions = perf.suggestions()

suggestions.forEach(s => {
  console.log(`[${s.severity}] ${s.title}`)
  console.log(`  ${s.description}`)
  if (s.expectedBenefit) {
    console.log(`  预期收益: ${s.expectedBenefit}`)
  }
})

// 或直接打印格式化的建议
perf.printSuggestions()
```

---

## ⚙️ 配置常量

### 性能配置

```typescript
import { PERFORMANCE_CONFIG } from '@ldesign/size/constants/performance'

// 缓存大小配置
PERFORMANCE_CONFIG.MAX_SIZE_POOL          // 200
PERFORMANCE_CONFIG.MAX_CSS_CACHE_SIZE     // 50
PERFORMANCE_CONFIG.MAX_PARSE_CACHE        // 200
PERFORMANCE_CONFIG.MAX_CONVERSION_CACHE   // 500

// 时间配置（毫秒）
PERFORMANCE_CONFIG.CLEANUP_INTERVAL       // 60000 (1分钟)
PERFORMANCE_CONFIG.FRAME_BUDGET           // 16
PERFORMANCE_CONFIG.IDLE_CALLBACK_TIMEOUT  // 50

// 批处理配置
PERFORMANCE_CONFIG.LISTENER_BATCH_SIZE    // 10
PERFORMANCE_CONFIG.MAX_BATCH_TIME         // 16

// 精度配置
PERFORMANCE_CONFIG.EPSILON                // 0.001
PERFORMANCE_CONFIG.DECIMAL_PRECISION      // 2
```

### 尺寸配置

```typescript
import { SIZE_CONFIG, UNITS } from '@ldesign/size/constants/sizes'

// 基础配置
SIZE_CONFIG.DEFAULT_ROOT_FONT_SIZE  // 16
SIZE_CONFIG.DEFAULT_BASE_SIZE       // 14
SIZE_CONFIG.MIN_BASE_SIZE          // 10
SIZE_CONFIG.MAX_BASE_SIZE          // 24

// 单位常量
UNITS.PX       // 'px'
UNITS.REM      // 'rem'
UNITS.EM       // 'em'
UNITS.VW       // 'vw'
UNITS.VH       // 'vh'
UNITS.PERCENT  // '%'
```

---

## 🎯 最佳实践

### 1. 启用性能监控（开发环境）

```typescript
// main.ts
import { perf, globalCacheManager } from '@ldesign/size'

if (import.meta.env.DEV) {
  // 设置预算
  perf.setBudget({
    cssGeneration: 20,
    minCacheHitRate: 0.75
  })
  
  // 应用启动后检查
  setTimeout(() => {
    perf.log()
    perf.printSuggestions()
  }, 5000)
}
```

### 2. 注册错误处理器（生产环境）

```typescript
// main.ts
import { globalErrorHandler } from '@ldesign/size'

// 全局错误处理
globalErrorHandler.register(null, (error) => {
  // 仅在生产环境发送
  if (import.meta.env.PROD) {
    sendToErrorTracking(error.toJSON())
  } else {
    console.error(error)
  }
})
```

### 3. 定期清理缓存（长时间运行的应用）

```typescript
import { globalCacheManager } from '@ldesign/size'

// 每小时清理一次缓存（可选）
setInterval(() => {
  const warnings = globalCacheManager.getHealthReport()
  
  if (warnings.length > 0) {
    console.warn('缓存健康检查:', warnings)
    // 可选：清理低效缓存
    // globalCacheManager.clearAll()
  }
}, 3600000)
```

### 4. 使用 Vue 插件

```typescript
// main.ts
import { createApp } from 'vue'
import { createSizePlugin } from '@ldesign/size/plugin'
import App from './App.vue'

const app = createApp(App)

// 安装插件
app.use(createSizePlugin({
  defaultSize: 'comfortable',
  locale: 'zh-CN',
  persistence: true
}))

app.mount('#app')
```

```vue
<!-- Component.vue -->
<script setup>
import { useSize } from '@ldesign/size/vue'

const { currentPreset, presets, applyPreset } = useSize()

const handleSizeChange = (size: string) => {
  applyPreset(size)
}
</script>

<template>
  <div>
    <select :value="currentPreset" @change="handleSizeChange($event.target.value)">
      <option v-for="preset in presets" :key="preset.name" :value="preset.name">
        {{ preset.label }}
      </option>
    </select>
  </div>
</template>
```

---

## 🔧 调试技巧

### 查看缓存状态

```typescript
import { globalCacheManager } from '@ldesign/size'

// 打开控制台后执行
globalCacheManager.printStats()

// 输出示例：
// 📦 Cache Statistics
//   PARSE
//     Size: 45/200
//     Hit Rate: 87.3%
//     Hits: 234, Misses: 34
//   ...
```

### 查看性能建议

```typescript
import { perf } from '@ldesign/size'

perf.printSuggestions()

// 输出示例：
// 💡 优化建议 (2 条)
//   1. 🟠 [HIGH] 缓存命中率过低
//      描述: Size 对象池命中率仅为 65%...
//      预期收益: 提升 10-15% 性能
//      实施难度: easy
```

### 查看懒加载状态

```typescript
// 注意：LazyModuleManager 是内部类，不直接导出
// 可以通过尝试加载模块来触发状态更新

import { getAIOptimizer } from '@ldesign/size'

try {
  const optimizer = await getAIOptimizer()
  console.log('AI 优化器已加载')
} catch (error) {
  console.error('加载失败:', error)
}
```

---

## 📚 相关文档

- [完整优化报告](./OPTIMIZATION_REPORT.md) - 详细的优化内容和技术细节
- [深度优化完成总结](./深度优化完成总结.md) - 优化成果和使用建议
- [API 文档](./docs/api/) - 完整的 API 参考
- [测试用例](../src/__tests__/) - 测试示例和覆盖范围

---

**更新时间**：2025-10-25  
**版本**：v2.1.0+

