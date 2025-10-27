# CSS 变量系统

@ldesign/size 的核心是一套完整的 CSS 变量系统，它让你能够轻松实现动态尺寸控制。

## 🎨 变量命名规范

所有 CSS 变量遵循统一的命名规范：

```
--{prefix}-{category}-{property}-{variant}
```

- **prefix**: 变量前缀，默认为 `ls`
- **category**: 类别（font, spacing, button 等）
- **property**: 属性名（size, height, padding 等）
- **variant**: 变体（sm, base, lg 等）

### 示例

```css
--ls-font-size-base      /* 基础字体大小 */
--ls-spacing-lg          /* 大间距 */
--ls-button-height-medium /* 中等按钮高度 */
```

## 📚 变量清单

### 字体相关

#### 基础字体大小

```css
--ls-font-size-xs       /* 超小: 10px / 11px / 12px */
--ls-font-size-sm       /* 小:   11px / 12px / 14px */
--ls-font-size-base     /* 基础: 12px / 14px / 16px */
--ls-font-size-lg       /* 大:   14px / 16px / 18px */
--ls-font-size-xl       /* 超大: 16px / 18px / 20px */
--ls-font-size-xxl      /* 特大: 18px / 20px / 24px */
```

#### 标题字体大小

```css
--ls-font-size-h1       /* 标题1: 24px / 28px / 32px */
--ls-font-size-h2       /* 标题2: 20px / 24px / 28px */
--ls-font-size-h3       /* 标题3: 16px / 20px / 24px */
--ls-font-size-h4       /* 标题4: 14px / 18px / 20px */
--ls-font-size-h5       /* 标题5: 12px / 16px / 18px */
--ls-font-size-h6       /* 标题6: 12px / 14px / 16px */
```

#### 行高

```css
--ls-line-height-tight  /* 紧凑: 1.2 */
--ls-line-height-base   /* 基础: 1.5 */
--ls-line-height-loose  /* 宽松: 1.8 */
```

#### 字重

```css
--ls-font-weight-light    /* 细: 300 */
--ls-font-weight-normal   /* 正常: 400 */
--ls-font-weight-medium   /* 中等: 500 */
--ls-font-weight-semibold /* 半粗: 600 */
--ls-font-weight-bold     /* 粗: 700 */
```

### 间距相关

#### 内边距/外边距

```css
--ls-spacing-xs         /* 超小: 4px / 6px / 8px */
--ls-spacing-sm         /* 小:   6px / 8px / 12px */
--ls-spacing-base       /* 基础: 8px / 12px / 16px */
--ls-spacing-lg         /* 大:   12px / 16px / 24px */
--ls-spacing-xl         /* 超大: 16px / 24px / 32px */
--ls-spacing-xxl        /* 特大: 24px / 32px / 48px */
```

#### 间隙

```css
--ls-gap-xs             /* 超小间隙 */
--ls-gap-sm             /* 小间隙 */
--ls-gap-base           /* 基础间隙 */
--ls-gap-lg             /* 大间隙 */
--ls-gap-xl             /* 超大间隙 */
```

### 组件尺寸

#### 按钮

```css
--ls-button-height-small    /* 小按钮: 24px / 28px / 32px */
--ls-button-height-medium   /* 中按钮: 32px / 36px / 40px */
--ls-button-height-large    /* 大按钮: 40px / 44px / 48px */

--ls-button-padding-horizontal-small   /* 小按钮水平内边距 */
--ls-button-padding-horizontal-medium  /* 中按钮水平内边距 */
--ls-button-padding-horizontal-large   /* 大按钮水平内边距 */

--ls-button-font-size-small    /* 小按钮字体大小 */
--ls-button-font-size-medium   /* 中按钮字体大小 */
--ls-button-font-size-large    /* 大按钮字体大小 */
```

#### 输入框

```css
--ls-input-height-small     /* 小输入框: 24px / 28px / 32px */
--ls-input-height-medium    /* 中输入框: 32px / 36px / 40px */
--ls-input-height-large     /* 大输入框: 40px / 44px / 48px */

--ls-input-padding-horizontal  /* 输入框水平内边距 */
--ls-input-font-size          /* 输入框字体大小 */
```

#### 卡片

```css
--ls-card-padding-small     /* 小卡片内边距 */
--ls-card-padding-medium    /* 中卡片内边距 */
--ls-card-padding-large     /* 大卡片内边距 */
```

#### 图标

```css
--ls-icon-size-xs           /* 超小图标: 12px / 14px / 16px */
--ls-icon-size-sm           /* 小图标:   14px / 16px / 18px */
--ls-icon-size-base         /* 基础图标: 16px / 18px / 20px */
--ls-icon-size-lg           /* 大图标:   18px / 20px / 24px */
--ls-icon-size-xl           /* 超大图标: 20px / 24px / 28px */
```

### 边框相关

#### 圆角

```css
--ls-border-radius-sm       /* 小圆角: 2px / 3px / 4px */
--ls-border-radius-base     /* 基础圆角: 4px / 6px / 8px */
--ls-border-radius-lg       /* 大圆角: 8px / 10px / 12px */
--ls-border-radius-xl       /* 超大圆角: 12px / 16px / 20px */
--ls-border-radius-full     /* 完全圆角: 9999px */
```

#### 边框宽度

```css
--ls-border-width-thin      /* 细边框: 1px */
--ls-border-width-base      /* 基础边框: 1px / 1px / 2px */
--ls-border-width-thick     /* 粗边框: 2px / 3px / 4px */
```

### 阴影相关

```css
--ls-shadow-sm              /* 小阴影 */
--ls-shadow-base            /* 基础阴影 */
--ls-shadow-lg              /* 大阴影 */
--ls-shadow-xl              /* 超大阴影 */
```

### 动画相关

```css
--ls-duration-fast          /* 快速: 150ms */
--ls-duration-base          /* 基础: 300ms */
--ls-duration-slow          /* 慢速: 500ms */

--ls-easing-linear          /* 线性: linear */
--ls-easing-ease            /* 缓动: ease */
--ls-easing-ease-in         /* 缓入: ease-in */
--ls-easing-ease-out        /* 缓出: ease-out */
--ls-easing-ease-in-out     /* 缓入缓出: ease-in-out */
```

## 🎯 使用示例

### 基础使用

```css
.my-button {
  /* 使用预定义变量 */
  height: var(--ls-button-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-base);
  border-radius: var(--ls-border-radius-base);
  
  /* 过渡动画 */
  transition: all var(--ls-duration-base) var(--ls-easing-ease);
}

.my-button:hover {
  /* 使用阴影 */
  box-shadow: var(--ls-shadow-base);
}
```

### 计算属性

```css
.my-card {
  /* 基于变量计算 */
  padding: calc(var(--ls-spacing-base) * 1.5);
  margin-bottom: calc(var(--ls-spacing-base) / 2);
  
  /* 组合多个变量 */
  border: var(--ls-border-width-base) solid #e0e0e0;
  border-radius: var(--ls-border-radius-lg);
}
```

### 响应式设计

```css
.container {
  padding: var(--ls-spacing-base);
}

@media (max-width: 768px) {
  .container {
    /* 在小屏幕上使用更小的间距 */
    padding: var(--ls-spacing-sm);
  }
}
```

### 主题覆盖

```css
/* 自定义主题 */
.dark-theme {
  --ls-font-size-base: 15px;
  --ls-spacing-base: 10px;
  --ls-border-radius-base: 6px;
}

/* 组件级覆盖 */
.compact-mode {
  --ls-spacing-base: 4px;
  --ls-button-height-medium: 28px;
}
```

## 🔧 高级技巧

### 1. 创建自定义变量

```css
:root {
  /* 基于现有变量创建新变量 */
  --my-header-height: calc(var(--ls-button-height-large) + var(--ls-spacing-base) * 2);
  --my-sidebar-width: calc(var(--ls-spacing-base) * 25);
  
  /* 组合变量 */
  --my-card-style: var(--ls-border-width-base) solid #e0e0e0;
}
```

### 2. 变量分组

```css
.card-component {
  /* 本地变量作用域 */
  --card-padding: var(--ls-spacing-lg);
  --card-gap: var(--ls-spacing-base);
  --card-radius: var(--ls-border-radius-lg);
  
  padding: var(--card-padding);
  border-radius: var(--card-radius);
}

.card-content {
  gap: var(--card-gap);
}
```

### 3. 条件样式

```css
.button {
  /* 默认样式 */
  height: var(--ls-button-height-medium);
}

.button--small {
  height: var(--ls-button-height-small);
}

.button--large {
  height: var(--ls-button-height-large);
}
```

### 4. CSS Grid 响应式

```css
.grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(calc(var(--ls-spacing-base) * 20), 1fr)
  );
  gap: var(--ls-spacing-base);
  padding: var(--ls-spacing-lg);
}
```

### 5. 渐变和颜色

```css
.gradient-bg {
  background: linear-gradient(
    135deg,
    hsl(220, 70%, 50%),
    hsl(220, 70%, 40%)
  );
  padding: var(--ls-spacing-xl);
  border-radius: var(--ls-border-radius-lg);
}
```

## 📐 尺寸对照表

### Small 模式

| 变量 | 值 |
|------|-----|
| `--ls-font-size-base` | 12px |
| `--ls-spacing-base` | 6px |
| `--ls-button-height-medium` | 28px |
| `--ls-border-radius-base` | 3px |

### Medium 模式

| 变量 | 值 |
|------|-----|
| `--ls-font-size-base` | 14px |
| `--ls-spacing-base` | 8px |
| `--ls-button-height-medium` | 32px |
| `--ls-border-radius-base` | 4px |

### Large 模式

| 变量 | 值 |
|------|-----|
| `--ls-font-size-base` | 16px |
| `--ls-spacing-base` | 12px |
| `--ls-button-height-medium` | 40px |
| `--ls-border-radius-base` | 6px |

## 🎨 实战模式

### 表单样式

```css
.form-group {
  margin-bottom: var(--ls-spacing-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--ls-spacing-xs);
  font-size: var(--ls-font-size-sm);
  font-weight: var(--ls-font-weight-medium);
}

.form-input {
  width: 100%;
  height: var(--ls-input-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-base);
  border: var(--ls-border-width-base) solid #d9d9d9;
  border-radius: var(--ls-border-radius-base);
  transition: all var(--ls-duration-base);
}

.form-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
```

### 卡片组件

```css
.card {
  padding: var(--ls-spacing-lg);
  background: white;
  border-radius: var(--ls-border-radius-lg);
  box-shadow: var(--ls-shadow-base);
  transition: all var(--ls-duration-base);
}

.card:hover {
  box-shadow: var(--ls-shadow-lg);
  transform: translateY(-2px);
}

.card-title {
  margin-bottom: var(--ls-spacing-base);
  font-size: var(--ls-font-size-lg);
  font-weight: var(--ls-font-weight-semibold);
}

.card-content {
  font-size: var(--ls-font-size-base);
  line-height: var(--ls-line-height-base);
  color: #666;
}
```

### 导航菜单

```css
.nav {
  display: flex;
  gap: var(--ls-spacing-base);
  padding: var(--ls-spacing-base);
  background: white;
  border-radius: var(--ls-border-radius-base);
}

.nav-item {
  padding: var(--ls-spacing-sm) var(--ls-spacing-base);
  font-size: var(--ls-font-size-base);
  color: #333;
  text-decoration: none;
  border-radius: var(--ls-border-radius-sm);
  transition: all var(--ls-duration-fast);
}

.nav-item:hover {
  background: #f0f0f0;
}

.nav-item.active {
  background: #1890ff;
  color: white;
}
```

## 🔍 调试技巧

### 查看所有变量

```javascript
// 在浏览器控制台运行
const styles = getComputedStyle(document.documentElement)
const allVars = [...document.styleSheets]
  .flatMap(sheet => [...sheet.cssRules])
  .filter(rule => rule.type === 1)
  .flatMap(rule => [...rule.style])
  .filter(prop => prop.startsWith('--ls-'))
  .reduce((acc, prop) => {
    acc[prop] = styles.getPropertyValue(prop).trim()
    return acc
  }, {})
console.table(allVars)
```

### 动态修改变量

```javascript
// 动态修改单个变量
document.documentElement.style.setProperty('--ls-font-size-base', '16px')

// 批量修改变量
const newVars = {
  '--ls-font-size-base': '16px',
  '--ls-spacing-base': '10px'
}
Object.entries(newVars).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value)
})
```

## 📚 最佳实践

1. **始终使用变量**：避免硬编码尺寸值
2. **语义化命名**：创建有意义的自定义变量
3. **层级清晰**：使用 CSS 变量的继承特性
4. **性能优化**：避免过度使用 `calc()`
5. **向后兼容**：提供降级方案

```css
/* ✅ 推荐 */
.button {
  height: var(--ls-button-height-medium, 32px);  /* 提供默认值 */
}

/* ❌ 不推荐 */
.button {
  height: 32px;  /* 硬编码 */
}
```

## 🔗 相关文档

- [尺寸模式](./size-modes) - 了解不同的尺寸模式
- [主题定制](./theme-customization) - 自定义主题系统
- [响应式设计](./responsive) - 响应式设计指南
- [最佳实践](./best-practices) - 推荐的使用方式

