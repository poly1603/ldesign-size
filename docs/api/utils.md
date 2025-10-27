# 工具函数 API

@ldesign/size 提供了一系列实用的工具函数，帮助你更方便地使用尺寸系统。

## 📦 导入

```typescript
import {
  // 模式相关
  isValidSizeMode,
  getAvailableModes,
  getNextSizeMode,
  getPreviousSizeMode,
  getSizeModeDisplayName,
  compareSizeModes,
  parseSizeMode,
  
  // CSS 相关
  formatCSSValue,
  parseCSSValue,
  calculateSizeScale,
  generateCSSVariables,
  
  // 配置相关
  getSizeConfig,
  mergeSizeConfig,
  validateSizeConfig
} from '@ldesign/size'
```

## 🎯 模式工具函数

### isValidSizeMode

检查给定的值是否是有效的尺寸模式。

```typescript
function isValidSizeMode(mode: any): mode is SizeMode

// 示例
isValidSizeMode('small')    // true
isValidSizeMode('medium')   // true
isValidSizeMode('invalid')  // false
isValidSizeMode(123)        // false
```

### getAvailableModes

获取所有可用的尺寸模式列表。

```typescript
function getAvailableModes(): SizeMode[]

// 示例
const modes = getAvailableModes()
console.log(modes)  // ['small', 'medium', 'large']
```

### getNextSizeMode

获取下一个尺寸模式。

```typescript
function getNextSizeMode(current: SizeMode, loop?: boolean): SizeMode

// 参数
// - current: 当前模式
// - loop: 是否循环，默认 true

// 示例
getNextSizeMode('small')              // 'medium'
getNextSizeMode('medium')             // 'large'
getNextSizeMode('large')              // 'small' (循环)
getNextSizeMode('large', false)       // 'large' (不循环)
```

### getPreviousSizeMode

获取上一个尺寸模式。

```typescript
function getPreviousSizeMode(current: SizeMode, loop?: boolean): SizeMode

// 示例
getPreviousSizeMode('large')          // 'medium'
getPreviousSizeMode('medium')         // 'small'
getPreviousSizeMode('small')          // 'large' (循环)
getPreviousSizeMode('small', false)   // 'small' (不循环)
```

### getSizeModeDisplayName

获取尺寸模式的显示名称。

```typescript
function getSizeModeDisplayName(mode: SizeMode, locale?: string): string

// 参数
// - mode: 尺寸模式
// - locale: 语言代码，默认 'zh-CN'

// 示例
getSizeModeDisplayName('small')             // '小'
getSizeModeDisplayName('medium')            // '中'
getSizeModeDisplayName('large')             // '大'
getSizeModeDisplayName('small', 'en-US')    // 'Small'
```

### compareSizeModes

比较两个尺寸模式的大小。

```typescript
function compareSizeModes(mode1: SizeMode, mode2: SizeMode): number

// 返回值
// -1: mode1 < mode2
//  0: mode1 === mode2
//  1: mode1 > mode2

// 示例
compareSizeModes('small', 'medium')   // -1
compareSizeModes('large', 'small')    //  1
compareSizeModes('medium', 'medium')  //  0
```

### parseSizeMode

解析字符串为尺寸模式。

```typescript
function parseSizeMode(input: string): SizeMode | null

// 支持的输入格式
// - 完整名称: 'small', 'medium', 'large'
// - 缩写: 's', 'm', 'l'
// - 中文: '小', '中', '大'

// 示例
parseSizeMode('small')    // 'small'
parseSizeMode('s')        // 'small'
parseSizeMode('小')       // 'small'
parseSizeMode('m')        // 'medium'
parseSizeMode('中')       // 'medium'
parseSizeMode('invalid')  // null
```

## 🎨 CSS 工具函数

### formatCSSValue

格式化 CSS 值。

```typescript
function formatCSSValue(value: number | string, unit?: string): string

// 参数
// - value: 数值或字符串
// - unit: 单位，可选

// 示例
formatCSSValue(16)              // '16px'
formatCSSValue(1.5, 'rem')      // '1.5rem'
formatCSSValue('100', '%')      // '100%'
formatCSSValue('auto')          // 'auto'
formatCSSValue(0)               // '0'
```

### parseCSSValue

解析 CSS 值。

```typescript
function parseCSSValue(value: string): { number: number; unit: string }

// 示例
parseCSSValue('16px')     // { number: 16, unit: 'px' }
parseCSSValue('1.5rem')   // { number: 1.5, unit: 'rem' }
parseCSSValue('100%')     // { number: 100, unit: '%' }
parseCSSValue('auto')     // { number: 0, unit: '' }
```

### calculateSizeScale

计算两个尺寸模式之间的缩放比例。

```typescript
function calculateSizeScale(from: SizeMode, to: SizeMode): number

// 示例
calculateSizeScale('small', 'medium')   // 1.167 (14/12)
calculateSizeScale('medium', 'large')   // 1.143 (16/14)
calculateSizeScale('small', 'large')    // 1.333 (16/12)
calculateSizeScale('large', 'small')    // 0.75  (12/16)
```

### generateCSSVariables

生成 CSS 变量对象。

```typescript
function generateCSSVariables(
  mode: SizeMode,
  prefix?: string
): Record<string, string>

// 参数
// - mode: 尺寸模式
// - prefix: 变量前缀，默认 '--ls'

// 示例
const vars = generateCSSVariables('medium')
console.log(vars)
// {
//   '--ls-font-size-base': '14px',
//   '--ls-spacing-base': '8px',
//   '--ls-border-radius-base': '4px',
//   ...
// }

// 自定义前缀
const customVars = generateCSSVariables('large', '--my-app')
console.log(customVars)
// {
//   '--my-app-font-size-base': '16px',
//   '--my-app-spacing-base': '12px',
//   ...
// }
```

## ⚙️ 配置工具函数

### getSizeConfig

获取指定模式的配置。

```typescript
function getSizeConfig(mode: SizeMode): SizeConfig

// 示例
const config = getSizeConfig('medium')
console.log(config.fontSize.base)  // '14px'
console.log(config.spacing.base)   // '8px'
```

### mergeSizeConfig

合并配置对象。

```typescript
function mergeSizeConfig(
  base: SizeConfig,
  overrides: Partial<SizeConfig>
): SizeConfig

// 示例
const baseConfig = getSizeConfig('medium')
const customConfig = mergeSizeConfig(baseConfig, {
  fontSize: {
    base: '15px'
  },
  spacing: {
    base: '10px'
  }
})
```

### validateSizeConfig

验证配置对象是否有效。

```typescript
function validateSizeConfig(config: any): config is SizeConfig

// 示例
const config = {
  fontSize: { base: '14px' },
  spacing: { base: '8px' }
}
validateSizeConfig(config)  // true/false
```

## 🔧 实用组合

### 模式切换器

```typescript
export function createModeSwitcher() {
  const modes = getAvailableModes()
  let currentIndex = modes.indexOf(globalSizeManager.getCurrentMode())
  
  return {
    next() {
      currentIndex = (currentIndex + 1) % modes.length
      globalSizeManager.setMode(modes[currentIndex])
    },
    
    prev() {
      currentIndex = (currentIndex - 1 + modes.length) % modes.length
      globalSizeManager.setMode(modes[currentIndex])
    },
    
    goto(mode: SizeMode) {
      if (isValidSizeMode(mode)) {
        currentIndex = modes.indexOf(mode)
        globalSizeManager.setMode(mode)
      }
    }
  }
}

// 使用
const switcher = createModeSwitcher()
switcher.next()   // 切换到下一个
switcher.prev()   // 切换到上一个
switcher.goto('large')  // 跳转到指定模式
```

### 配置生成器

```typescript
export function createConfigGenerator(base: SizeMode) {
  const baseConfig = getSizeConfig(base)
  
  return {
    withFontSize(size: string) {
      return mergeSizeConfig(baseConfig, {
        fontSize: { base: size }
      })
    },
    
    withSpacing(spacing: string) {
      return mergeSizeConfig(baseConfig, {
        spacing: { base: spacing }
      })
    },
    
    scale(factor: number) {
      return {
        fontSize: {
          base: formatCSSValue(
            parseCSSValue(baseConfig.fontSize.base).number * factor,
            'px'
          )
        },
        spacing: {
          base: formatCSSValue(
            parseCSSValue(baseConfig.spacing.base).number * factor,
            'px'
          )
        }
      }
    }
  }
}

// 使用
const generator = createConfigGenerator('medium')
const customConfig = generator
  .withFontSize('15px')
  .withSpacing('10px')
```

### CSS 变量注入器

```typescript
export function createCSSInjector(selector: string = ':root') {
  return {
    inject(mode: SizeMode, prefix?: string) {
      const variables = generateCSSVariables(mode, prefix)
      const cssText = Object.entries(variables)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n')
      
      let styleEl = document.getElementById('size-variables')
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = 'size-variables'
        document.head.appendChild(styleEl)
      }
      
      styleEl.textContent = `${selector} {\n${cssText}\n}`
    },
    
    remove() {
      const styleEl = document.getElementById('size-variables')
      if (styleEl) {
        styleEl.remove()
      }
    }
  }
}

// 使用
const injector = createCSSInjector()
injector.inject('large')
injector.remove()
```

## 📊 调试工具

### 变量查看器

```typescript
export function inspectVariables(mode?: SizeMode) {
  const currentMode = mode || globalSizeManager.getCurrentMode()
  const variables = generateCSSVariables(currentMode)
  
  console.group(`CSS Variables - ${currentMode}`)
  console.table(
    Object.entries(variables).map(([key, value]) => ({
      Variable: key,
      Value: value
    }))
  )
  console.groupEnd()
}

// 使用
inspectVariables()           // 当前模式
inspectVariables('large')    // 指定模式
```

### 模式比较器

```typescript
export function compareModesConfig(mode1: SizeMode, mode2: SizeMode) {
  const config1 = getSizeConfig(mode1)
  const config2 = getSizeConfig(mode2)
  
  console.group(`Compare: ${mode1} vs ${mode2}`)
  console.log('Font Size:', config1.fontSize.base, 'vs', config2.fontSize.base)
  console.log('Spacing:', config1.spacing.base, 'vs', config2.spacing.base)
  console.log('Scale:', calculateSizeScale(mode1, mode2))
  console.groupEnd()
}

// 使用
compareModesConfig('small', 'large')
```

## 🔍 类型定义

```typescript
// 尺寸模式
type SizeMode = 'small' | 'medium' | 'large'

// CSS 值
interface CSSValue {
  number: number
  unit: string
}

// 尺寸配置
interface SizeConfig {
  fontSize: {
    base: string
    sm: string
    lg: string
    // ...
  }
  spacing: {
    base: string
    sm: string
    lg: string
    // ...
  }
  button: {
    height: {
      small: string
      medium: string
      large: string
    }
  }
  // ...
}
```

## 📝 使用示例

### 示例 1：自定义尺寸切换

```typescript
import {
  getAvailableModes,
  isValidSizeMode,
  getSizeModeDisplayName
} from '@ldesign/size'

function createSizeMenu() {
  const modes = getAvailableModes()
  
  return modes.map(mode => ({
    value: mode,
    label: getSizeModeDisplayName(mode),
    onClick: () => {
      if (isValidSizeMode(mode)) {
        globalSizeManager.setMode(mode)
      }
    }
  }))
}
```

### 示例 2：CSS 值转换

```typescript
import { parseCSSValue, formatCSSValue } from '@ldesign/size'

function scaleCSSValue(value: string, scale: number): string {
  const parsed = parseCSSValue(value)
  const newValue = parsed.number * scale
  return formatCSSValue(newValue, parsed.unit)
}

// 使用
scaleCSSValue('14px', 1.5)    // '21px'
scaleCSSValue('1rem', 2)      // '2rem'
```

### 示例 3：配置合并

```typescript
import { getSizeConfig, mergeSizeConfig } from '@ldesign/size'

function createCustomTheme(mode: SizeMode, overrides: any) {
  const baseConfig = getSizeConfig(mode)
  return mergeSizeConfig(baseConfig, overrides)
}

// 使用
const theme = createCustomTheme('medium', {
  fontSize: { base: '15px' },
  spacing: { base: '10px' }
})
```

## 🔗 相关文档

- [核心 API](./core) - 核心 API 文档
- [类型定义](./types) - 完整的类型定义
- [Vue API](./vue) - Vue 相关 API
- [示例](../examples/basic-usage) - 更多示例

