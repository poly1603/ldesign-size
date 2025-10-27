# React 集成指南

虽然 @ldesign/size 主要为 Vue 生态设计，但核心功能是框架无关的，可以轻松集成到 React 项目中。

## 📦 安装

```bash
pnpm add @ldesign/size
```

## 🚀 基础集成

### 1. 创建 React Hook

```typescript
// hooks/useSize.ts
import { useEffect, useState, useCallback } from 'react'
import { globalSizeManager, type SizeMode } from '@ldesign/size'

export function useSize() {
  const [currentMode, setCurrentMode] = useState<SizeMode>(
    globalSizeManager.getCurrentMode()
  )

  useEffect(() => {
    // 监听尺寸变化
    const unwatch = globalSizeManager.onSizeChange((event) => {
      setCurrentMode(event.currentMode)
    })

    return () => {
      unwatch()
    }
  }, [])

  const setMode = useCallback((mode: SizeMode) => {
    globalSizeManager.setMode(mode)
  }, [])

  const isMode = useCallback((mode: SizeMode) => {
    return currentMode === mode
  }, [currentMode])

  return {
    currentMode,
    setMode,
    isMode
  }
}
```

### 2. 创建 Context Provider

```typescript
// contexts/SizeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { globalSizeManager, type SizeMode, type SizeConfig } from '@ldesign/size'

interface SizeContextValue {
  currentMode: SizeMode
  setMode: (mode: SizeMode) => void
  config: SizeConfig
  isMode: (mode: SizeMode) => boolean
}

const SizeContext = createContext<SizeContextValue | null>(null)

export function SizeProvider({ children }: { children: React.ReactNode }) {
  const [currentMode, setCurrentMode] = useState<SizeMode>(
    globalSizeManager.getCurrentMode()
  )
  const [config, setConfig] = useState<SizeConfig>(
    globalSizeManager.getConfig()
  )

  useEffect(() => {
    // 初始化
    globalSizeManager.injectCSS()

    // 监听变化
    const unwatch = globalSizeManager.onSizeChange((event) => {
      setCurrentMode(event.currentMode)
      setConfig(globalSizeManager.getConfig())
    })

    return () => {
      unwatch()
    }
  }, [])

  const setMode = (mode: SizeMode) => {
    globalSizeManager.setMode(mode)
  }

  const isMode = (mode: SizeMode) => {
    return currentMode === mode
  }

  return (
    <SizeContext.Provider value={{ currentMode, setMode, config, isMode }}>
      {children}
    </SizeContext.Provider>
  )
}

export function useSizeContext() {
  const context = useContext(SizeContext)
  if (!context) {
    throw new Error('useSizeContext must be used within SizeProvider')
  }
  return context
}
```

### 3. 在应用中使用

```typescript
// App.tsx
import React from 'react'
import { SizeProvider } from './contexts/SizeContext'
import MainContent from './components/MainContent'

function App() {
  return (
    <SizeProvider>
      <MainContent />
    </SizeProvider>
  )
}

export default App
```

## 🎨 创建组件

### SizeSelector 组件

```typescript
// components/SizeSelector.tsx
import React from 'react'
import { useSizeContext } from '../contexts/SizeContext'
import type { SizeMode } from '@ldesign/size'
import './SizeSelector.css'

interface SizeSelectorProps {
  type?: 'button' | 'dropdown'
  showLabels?: boolean
}

const sizeOptions: Array<{ value: SizeMode; label: string }> = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' }
]

export function SizeSelector({ 
  type = 'button', 
  showLabels = true 
}: SizeSelectorProps) {
  const { currentMode, setMode, isMode } = useSizeContext()

  if (type === 'dropdown') {
    return (
      <select
        value={currentMode}
        onChange={(e) => setMode(e.target.value as SizeMode)}
        className="size-selector-dropdown"
      >
        {sizeOptions.map(option => (
          <option key={option.value} value={option.value}>
            {showLabels ? option.label : option.value}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className="size-selector-buttons">
      {sizeOptions.map(option => (
        <button
          key={option.value}
          className={`size-button ${isMode(option.value) ? 'active' : ''}`}
          onClick={() => setMode(option.value)}
        >
          {showLabels ? option.label : option.value}
        </button>
      ))}
    </div>
  )
}
```

```css
/* components/SizeSelector.css */
.size-selector-buttons {
  display: flex;
  gap: var(--ls-spacing-xs);
}

.size-button {
  height: var(--ls-button-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-sm);
  border: 1px solid #d9d9d9;
  border-radius: var(--ls-border-radius-base);
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.size-button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.size-button.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.size-selector-dropdown {
  height: var(--ls-button-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-sm);
  border: 1px solid #d9d9d9;
  border-radius: var(--ls-border-radius-base);
  cursor: pointer;
}
```

### SizeIndicator 组件

```typescript
// components/SizeIndicator.tsx
import React from 'react'
import { useSizeContext } from '../contexts/SizeContext'
import './SizeIndicator.css'

interface SizeIndicatorProps {
  showLabel?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function SizeIndicator({ 
  showLabel = true,
  position = 'top-right'
}: SizeIndicatorProps) {
  const { currentMode } = useSizeContext()

  const labels = {
    small: '小尺寸',
    medium: '中尺寸',
    large: '大尺寸'
  }

  return (
    <div className={`size-indicator ${position}`}>
      <span className="size-dot" />
      {showLabel && (
        <span className="size-label">{labels[currentMode]}</span>
      )}
    </div>
  )
}
```

## 🎯 实战示例

### 示例 1：响应式布局

```typescript
import React from 'react'
import { useSize } from './hooks/useSize'
import { SizeSelector } from './components/SizeSelector'
import './Layout.css'

function Layout() {
  const { currentMode } = useSize()

  return (
    <div className={`layout layout-${currentMode}`}>
      <header className="header">
        <h1>我的应用</h1>
        <SizeSelector />
      </header>

      <div className="main">
        <aside className="sidebar">
          侧边栏内容
        </aside>
        
        <main className="content">
          主要内容
        </main>
      </div>

      <footer className="footer">
        版权信息
      </footer>
    </div>
  )
}

export default Layout
```

```css
/* Layout.css */
.layout {
  display: grid;
  min-height: 100vh;
  gap: var(--ls-spacing-base);
  padding: var(--ls-spacing-base);
}

.layout-small {
  grid-template-areas:
    "header"
    "main"
    "footer";
}

.layout-medium,
.layout-large {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

.layout-medium {
  grid-template-columns: 200px 1fr;
}

.layout-large {
  grid-template-columns: 250px 1fr;
}
```

### 示例 2：表单组件

```typescript
import React, { useState } from 'react'
import './Form.css'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('提交表单:', formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">姓名</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          placeholder="请输入姓名"
        />
      </div>

      <div className="form-group">
        <label className="form-label">邮箱</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          placeholder="请输入邮箱"
        />
      </div>

      <div className="form-group">
        <label className="form-label">留言</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="form-textarea"
          rows={4}
          placeholder="请输入留言内容"
        />
      </div>

      <button type="submit" className="form-button">
        提交
      </button>
    </form>
  )
}

export default ContactForm
```

```css
/* Form.css */
.contact-form {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--ls-spacing-xl);
}

.form-group {
  margin-bottom: var(--ls-spacing-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--ls-spacing-xs);
  font-size: var(--ls-font-size-sm);
  font-weight: 600;
}

.form-input,
.form-textarea {
  width: 100%;
  height: var(--ls-input-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-base);
  border: 1px solid #d9d9d9;
  border-radius: var(--ls-border-radius-base);
  transition: all 0.3s;
}

.form-textarea {
  height: auto;
  padding: var(--ls-spacing-sm) var(--ls-spacing-base);
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-button {
  width: 100%;
  height: var(--ls-button-height-large);
  font-size: var(--ls-font-size-base);
  font-weight: 600;
  color: white;
  background: #1890ff;
  border: none;
  border-radius: var(--ls-border-radius-base);
  cursor: pointer;
  transition: all 0.3s;
}

.form-button:hover {
  background: #40a9ff;
}
```

### 示例 3：自定义 Hook - 响应式尺寸

```typescript
// hooks/useResponsiveSize.ts
import { useEffect, useState } from 'react'
import { globalSizeManager, type SizeMode } from '@ldesign/size'

interface UseResponsiveSizeOptions {
  breakpoints?: {
    mobile: number
    tablet: number
  }
  autoAdjust?: boolean
  modeMap?: {
    mobile: SizeMode
    tablet: SizeMode
    desktop: SizeMode
  }
}

export function useResponsiveSize(options: UseResponsiveSizeOptions = {}) {
  const {
    breakpoints = { mobile: 768, tablet: 1024 },
    autoAdjust = false,
    modeMap = { mobile: 'small', tablet: 'medium', desktop: 'large' }
  } = options

  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setScreenWidth(width)

      let type: 'mobile' | 'tablet' | 'desktop'
      if (width < breakpoints.mobile) {
        type = 'mobile'
      } else if (width < breakpoints.tablet) {
        type = 'tablet'
      } else {
        type = 'desktop'
      }
      setDeviceType(type)

      if (autoAdjust) {
        globalSizeManager.setMode(modeMap[type])
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoints, autoAdjust, modeMap])

  return {
    screenWidth,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop'
  }
}
```

使用示例：

```typescript
import React from 'react'
import { useResponsiveSize } from './hooks/useResponsiveSize'

function ResponsiveComponent() {
  const { deviceType, isMobile, screenWidth } = useResponsiveSize({
    autoAdjust: true
  })

  return (
    <div>
      <p>设备类型: {deviceType}</p>
      <p>屏幕宽度: {screenWidth}px</p>
      
      {isMobile ? (
        <div>移动端布局</div>
      ) : (
        <div>桌面布局</div>
      )}
    </div>
  )
}

export default ResponsiveComponent
```

## 🎨 TypeScript 支持

```typescript
import type {
  SizeMode,
  SizeConfig,
  SizeManager,
  SizeChangeEvent
} from '@ldesign/size'

// 类型安全的函数
function handleSizeChange(mode: SizeMode) {
  // ...
}

// 类型安全的组件 Props
interface MyComponentProps {
  size?: SizeMode
  config?: Partial<SizeConfig>
}
```

## 🔧 高级技巧

### 持久化存储

```typescript
// hooks/usePersistentSize.ts
import { useEffect } from 'react'
import { useSize } from './useSize'
import type { SizeMode } from '@ldesign/size'

const STORAGE_KEY = 'app-size-mode'

export function usePersistentSize() {
  const { currentMode, setMode } = useSize()

  // 恢复保存的偏好
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SizeMode
    if (saved) {
      setMode(saved)
    }
  }, [])

  // 保存偏好
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentMode)
  }, [currentMode])

  return { currentMode, setMode }
}
```

### 动画过渡

```css
/* 为尺寸变化添加过渡效果 */
* {
  transition: 
    font-size 0.3s ease,
    padding 0.3s ease,
    margin 0.3s ease,
    border-radius 0.3s ease;
}
```

## 📚 相关资源

- [核心 API](../api/core) - 核心 API 文档
- [示例项目](../examples/basic-usage) - 更多示例
- [最佳实践](../guide/best-practices) - 推荐的使用方式

