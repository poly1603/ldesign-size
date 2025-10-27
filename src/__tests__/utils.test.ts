/**
 * @ldesign/size - 工具函数单元测试
 * 
 * 测试覆盖：
 * - parseSizeInput
 * - formatSize
 * - convertSize
 * - 尺寸运算函数
 * - 工具函数
 */

import { describe, it, expect } from 'vitest'
import {
  parseSizeInput,
  formatSize,
  convertSize,
  scaleSize,
  addSizes,
  subtractSizes,
  clampSize,
  roundSize,
  isValidSize,
  getCSSVarName,
  cssVar,
  memoize,
} from '../utils'

describe('parseSizeInput', () => {
  it('应该解析数字为 px', () => {
    const result = parseSizeInput(16)
    expect(result.value).toBe(16)
    expect(result.unit).toBe('px')
  })

  it('应该解析字符串', () => {
    expect(parseSizeInput('16px')).toEqual({ value: 16, unit: 'px' })
    expect(parseSizeInput('1rem')).toEqual({ value: 1, unit: 'rem' })
    expect(parseSizeInput('1.5em')).toEqual({ value: 1.5, unit: 'em' })
    expect(parseSizeInput('50%')).toEqual({ value: 50, unit: '%' })
    expect(parseSizeInput('100vw')).toEqual({ value: 100, unit: 'vw' })
  })

  it('应该处理负值', () => {
    const result = parseSizeInput('-10px')
    expect(result.value).toBe(-10)
    expect(result.unit).toBe('px')
  })

  it('应该处理小数', () => {
    const result = parseSizeInput('0.5rem')
    expect(result.value).toBe(0.5)
    expect(result.unit).toBe('rem')
  })

  it('应该直接返回 SizeValue 对象', () => {
    const input = { value: 16, unit: 'px' as const }
    const result = parseSizeInput(input)
    expect(result).toBe(input)
  })

  it('无效输入应该返回默认值', () => {
    const result = parseSizeInput('invalid')
    expect(result.value).toBe(0)
    expect(result.unit).toBe('px')
  })

  it('应该缓存解析结果', () => {
    const input = '16px'
    const result1 = parseSizeInput(input)
    const result2 = parseSizeInput(input)

    // 应该返回相同的结果（从缓存）
    expect(result1).toEqual(result2)
  })
})

describe('formatSize', () => {
  it('应该正确格式化 SizeValue', () => {
    expect(formatSize({ value: 16, unit: 'px' })).toBe('16px')
    expect(formatSize({ value: 1, unit: 'rem' })).toBe('1rem')
    expect(formatSize({ value: 50, unit: '%' })).toBe('50%')
  })

  it('应该将 0 值格式化为 "0"', () => {
    expect(formatSize({ value: 0, unit: 'px' })).toBe('0')
    expect(formatSize({ value: 0, unit: 'rem' })).toBe('0')
  })

  it('应该处理小数', () => {
    expect(formatSize({ value: 1.5, unit: 'rem' })).toBe('1.5rem')
  })
})

describe('convertSize', () => {
  it('相同单位应该直接返回', () => {
    const input = { value: 16, unit: 'px' as const }
    const result = convertSize(input, 'px')
    expect(result).toBe(input)
  })

  it('应该正确转换 px 到 rem', () => {
    const result = convertSize({ value: 16, unit: 'px' }, 'rem', 16)
    expect(result.value).toBe(1)
    expect(result.unit).toBe('rem')
  })

  it('应该正确转换 rem 到 px', () => {
    const result = convertSize({ value: 1, unit: 'rem' }, 'px', 16)
    expect(result.value).toBe(16)
    expect(result.unit).toBe('px')
  })

  it('应该支持自定义根字体大小', () => {
    const result = convertSize({ value: 1, unit: 'rem' }, 'px', 20)
    expect(result.value).toBe(20)
  })

  it('应该正确转换 px 到 pt', () => {
    const result = convertSize({ value: 16, unit: 'px' }, 'pt')
    expect(result.value).toBeCloseTo(12, 1)
  })

  it('应该缓存转换结果', () => {
    const input = { value: 16, unit: 'px' as const }

    // 两次相同的转换应该使用缓存
    const result1 = convertSize(input, 'rem', 16)
    const result2 = convertSize(input, 'rem', 16)

    expect(result1).toEqual(result2)
  })
})

describe('scaleSize', () => {
  it('应该正确缩放尺寸', () => {
    const result = scaleSize({ value: 10, unit: 'px' }, 2)
    expect(result.value).toBe(20)
    expect(result.unit).toBe('px')
  })

  it('应该保持单位不变', () => {
    const result = scaleSize({ value: 1, unit: 'rem' }, 1.5)
    expect(result.value).toBe(1.5)
    expect(result.unit).toBe('rem')
  })
})

describe('addSizes', () => {
  it('应该正确相加相同单位的尺寸', () => {
    const a = { value: 10, unit: 'px' as const }
    const b = { value: 5, unit: 'px' as const }
    const result = addSizes(a, b)

    expect(result.value).toBe(15)
    expect(result.unit).toBe('px')
  })

  it('应该转换单位后相加', () => {
    const a = { value: 16, unit: 'px' as const }
    const b = { value: 1, unit: 'rem' as const }
    const result = addSizes(a, b, 16)

    expect(result.value).toBe(32)
    expect(result.unit).toBe('px')
  })
})

describe('subtractSizes', () => {
  it('应该正确相减相同单位的尺寸', () => {
    const a = { value: 10, unit: 'px' as const }
    const b = { value: 5, unit: 'px' as const }
    const result = subtractSizes(a, b)

    expect(result.value).toBe(5)
    expect(result.unit).toBe('px')
  })

  it('应该转换单位后相减', () => {
    const a = { value: 32, unit: 'px' as const }
    const b = { value: 1, unit: 'rem' as const }
    const result = subtractSizes(a, b, 16)

    expect(result.value).toBe(16)
    expect(result.unit).toBe('px')
  })
})

describe('clampSize', () => {
  it('应该将值限制在最小值和最大值之间', () => {
    const size = { value: 50, unit: 'px' as const }
    const result = clampSize(size, 10, 30)

    expect(result.value).toBe(30) // 被限制在最大值
  })

  it('应该支持只设置最小值', () => {
    const size = { value: 5, unit: 'px' as const }
    const result = clampSize(size, 10)

    expect(result.value).toBe(10)
  })

  it('应该支持只设置最大值', () => {
    const size = { value: 50, unit: 'px' as const }
    const result = clampSize(size, undefined, 30)

    expect(result.value).toBe(30)
  })

  it('在范围内的值应该不变', () => {
    const size = { value: 20, unit: 'px' as const }
    const result = clampSize(size, 10, 30)

    expect(result.value).toBe(20)
  })
})

describe('roundSize', () => {
  it('应该正确取整', () => {
    const size = { value: 10.123456, unit: 'px' as const }
    const result = roundSize(size, 2)

    expect(result.value).toBe(10.12)
  })

  it('应该支持不同精度', () => {
    const size = { value: 10.123456, unit: 'px' as const }

    expect(roundSize(size, 0).value).toBe(10)
    expect(roundSize(size, 1).value).toBe(10.1)
    expect(roundSize(size, 3).value).toBe(10.123)
  })
})

describe('isValidSize', () => {
  it('应该验证有效的数字', () => {
    expect(isValidSize(16)).toBe(true)
    expect(isValidSize(0)).toBe(true)
    expect(isValidSize(-10)).toBe(true)
  })

  it('应该验证有效的字符串', () => {
    expect(isValidSize('16px')).toBe(true)
    expect(isValidSize('1rem')).toBe(true)
    expect(isValidSize('50%')).toBe(true)
  })

  it('应该验证有效的 SizeValue 对象', () => {
    expect(isValidSize({ value: 16, unit: 'px' })).toBe(true)
  })

  it('应该拒绝无效输入', () => {
    expect(isValidSize(NaN)).toBe(false)
    expect(isValidSize(Infinity)).toBe(false)
    expect(isValidSize('invalid')).toBe(false)
    expect(isValidSize(null)).toBe(false)
    expect(isValidSize(undefined)).toBe(false)
  })
})

describe('getCSSVarName', () => {
  it('应该生成正确的 CSS 变量名', () => {
    expect(getCSSVarName('fontSize')).toBe('--size-font-size')
    expect(getCSSVarName('base')).toBe('--size-base')
  })

  it('应该支持自定义前缀', () => {
    expect(getCSSVarName('fontSize', 'my')).toBe('--my-font-size')
  })

  it('应该转换 camelCase 为 kebab-case', () => {
    expect(getCSSVarName('buttonHeightLarge')).toBe('--size-button-height-large')
  })
})

describe('cssVar', () => {
  it('应该生成 CSS var 函数', () => {
    expect(cssVar('--size-base')).toBe('var(--size-base)')
  })

  it('应该支持回退值', () => {
    expect(cssVar('--size-base', '16px')).toBe('var(--size-base, 16px)')
  })
})

describe('memoize', () => {
  it('应该缓存函数结果', () => {
    let callCount = 0
    const fn = memoize((x: number, y: number) => {
      callCount++
      return x + y
    })

    expect(fn(2, 3)).toBe(5)
    expect(callCount).toBe(1)

    // 第二次调用应该使用缓存
    expect(fn(2, 3)).toBe(5)
    expect(callCount).toBe(1) // 没有增加

    // 不同参数应该重新计算
    expect(fn(3, 4)).toBe(7)
    expect(callCount).toBe(2)
  })

  it('应该支持自定义缓存键', () => {
    let callCount = 0
    const fn = memoize(
      (obj: { x: number; y: number }) => {
        callCount++
        return obj.x + obj.y
      },
      (obj) => `${obj.x}-${obj.y}`
    )

    fn({ x: 2, y: 3 })
    fn({ x: 2, y: 3 }) // 应该使用缓存

    expect(callCount).toBe(1)
  })
})

