/**
 * @ldesign/size - Size 类单元测试
 * 
 * 测试覆盖：
 * - 对象创建和工厂方法
 * - 单位转换
 * - 尺寸计算
 * - 尺寸比较
 * - 对象池性能
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Size, px, rem, em, vw, vh, percent, size } from '../core/Size'

describe('Size', () => {
  describe('对象创建', () => {
    it('应该从数字创建 Size（默认 px）', () => {
      const s = new Size(16)
      expect(s.value).toBe(16)
      expect(s.unit).toBe('px')
    })

    it('应该从字符串创建 Size', () => {
      const s = new Size('16px')
      expect(s.value).toBe(16)
      expect(s.unit).toBe('px')

      const s2 = new Size('1rem')
      expect(s2.value).toBe(1)
      expect(s2.unit).toBe('rem')
    })

    it('应该从 SizeValue 对象创建 Size', () => {
      const s = new Size({ value: 16, unit: 'px' })
      expect(s.value).toBe(16)
      expect(s.unit).toBe('px')
    })

    it('工厂方法应该正确工作', () => {
      expect(px(16).unit).toBe('px')
      expect(rem(1).unit).toBe('rem')
      expect(em(1).unit).toBe('em')
      expect(vw(100).unit).toBe('vw')
      expect(vh(100).unit).toBe('vh')
      expect(percent(50).unit).toBe('%')
    })

    it('size 便捷函数应该工作', () => {
      const s = size(16)
      expect(s.value).toBe(16)
      expect(s.unit).toBe('px')
    })
  })

  describe('单位转换', () => {
    it('应该正确转换 px 到 rem', () => {
      const s = px(16)
      const converted = s.toRem()
      expect(converted.value).toBe(1)
      expect(converted.unit).toBe('rem')
    })

    it('应该正确转换 rem 到 px', () => {
      const s = rem(1, 16)
      const converted = s.toPixels()
      expect(converted.value).toBe(16)
      expect(converted.unit).toBe('px')
    })

    it('应该支持自定义根字体大小', () => {
      const s = rem(1, 20)
      expect(s.pixels).toBe(20)

      const s2 = rem(2, 18)
      expect(s2.pixels).toBe(36)
    })

    it('应该缓存转换结果', () => {
      const s = px(16)

      // 第一次转换
      const rem1 = s.rem
      // 第二次应该使用缓存
      const rem2 = s.rem

      expect(rem1).toBe(rem2)
      expect(rem1).toBe(1)
    })

    it('应该支持各种单位转换', () => {
      const s = px(16)

      expect(s.to('rem').unit).toBe('rem')
      expect(s.to('em').unit).toBe('em')
      expect(s.to('vw').unit).toBe('vw')
      expect(s.to('vh').unit).toBe('vh')
      expect(s.to('%').unit).toBe('%')
    })
  })

  describe('尺寸运算', () => {
    it('应该正确进行加法运算', () => {
      const s1 = px(10)
      const s2 = px(5)
      const result = s1.add(s2)

      expect(result.pixels).toBe(15)
    })

    it('应该正确进行减法运算', () => {
      const s1 = px(10)
      const s2 = px(5)
      const result = s1.subtract(s2)

      expect(result.pixels).toBe(5)
    })

    it('应该正确进行乘法运算', () => {
      const s = px(10)
      const result = s.multiply(2)

      expect(result.pixels).toBe(20)
    })

    it('应该正确进行除法运算', () => {
      const s = px(10)
      const result = s.divide(2)

      expect(result.pixels).toBe(5)
    })

    it('除以零应该抛出错误', () => {
      const s = px(10)
      expect(() => s.divide(0)).toThrow('Cannot divide by zero')
    })

    it('应该正确进行缩放', () => {
      const s = px(10)
      const scaled = s.scale(1.5)

      expect(scaled.pixels).toBe(15)
    })

    it('应该正确增加尺寸', () => {
      const s = px(100)
      const increased = s.increase(50) // +50%

      expect(increased.pixels).toBe(150)
    })

    it('应该正确减少尺寸', () => {
      const s = px(100)
      const decreased = s.decrease(25) // -25%

      expect(decreased.pixels).toBe(75)
    })

    it('应该正确取负值', () => {
      const s = px(10)
      const negated = s.negate()

      expect(negated.value).toBe(-10)
    })

    it('应该正确取绝对值', () => {
      const s = px(-10)
      const abs = s.abs()

      expect(abs.value).toBe(10)
    })

    it('应该正确进行取整', () => {
      const s = new Size({ value: 10.123456, unit: 'px' })
      const rounded = s.round(2)

      expect(rounded.value).toBe(10.12)
    })

    it('应该正确进行 clamp', () => {
      const s = px(50)
      const clamped = s.clamp(10, 30)

      expect(clamped.pixels).toBe(30) // 被限制在最大值
    })
  })

  describe('尺寸比较', () => {
    it('应该正确比较相等', () => {
      const s1 = px(16)
      const s2 = px(16)

      expect(s1.equals(s2)).toBe(true)
      expect(s1.equals(px(17))).toBe(false)
    })

    it('应该正确比较大小', () => {
      const s1 = px(16)
      const s2 = px(10)

      expect(s1.greaterThan(s2)).toBe(true)
      expect(s1.lessThan(s2)).toBe(false)
      expect(s1.greaterThanOrEqual(px(16))).toBe(true)
      expect(s1.lessThanOrEqual(px(16))).toBe(true)
    })

    it('应该正确获取最小值和最大值', () => {
      const s1 = px(16)
      const s2 = px(10)

      expect(s1.min(s2).pixels).toBe(10)
      expect(s1.max(s2).pixels).toBe(16)
    })

    it('应该支持跨单位比较', () => {
      const s1 = rem(1, 16) // 16px
      const s2 = px(16)

      expect(s1.equals(s2)).toBe(true)
    })
  })

  describe('对象池性能', () => {
    it('应该正确释放池化对象', () => {
      const s1 = size(16)
      const initialPooled = (s1 as any)._isPooled

      if (initialPooled) {
        s1.dispose()
        // 验证对象已归还
        expect((s1 as any)._value.value).toBe(0)
      }
    })

    it('克隆应该创建新对象', () => {
      const s1 = px(16)
      const s2 = s1.clone()

      expect(s1.value).toBe(s2.value)
      expect(s1.unit).toBe(s2.unit)
      expect(s1).not.toBe(s2) // 不同的对象引用
    })
  })

  describe('工具方法', () => {
    it('toString 应该返回格式化字符串', () => {
      expect(px(16).toString()).toBe('16px')
      expect(rem(1).toString()).toBe('1rem')
      expect(percent(50).toString()).toBe('50%')
    })

    it('toCss 应该返回 CSS 值', () => {
      expect(px(16).toCss()).toBe('16px')
    })

    it('应该检查值是否为零', () => {
      expect(px(0).isZero()).toBe(true)
      expect(px(1).isZero()).toBe(false)
    })

    it('应该检查值是否为正', () => {
      expect(px(10).isPositive()).toBe(true)
      expect(px(0).isPositive()).toBe(false)
      expect(px(-10).isPositive()).toBe(false)
    })

    it('应该检查值是否为负', () => {
      expect(px(-10).isNegative()).toBe(true)
      expect(px(0).isNegative()).toBe(false)
      expect(px(10).isNegative()).toBe(false)
    })

    it('应该检查值是否有效', () => {
      expect(px(16).isValid()).toBe(true)
      expect(new Size(NaN).isValid()).toBe(false)
      expect(new Size(Infinity).isValid()).toBe(false)
    })

    it('toJSON 应该返回完整信息', () => {
      const s = px(16)
      const json = s.toJSON()

      expect(json).toHaveProperty('value')
      expect(json).toHaveProperty('unit')
      expect(json).toHaveProperty('pixels')
      expect(json).toHaveProperty('rem')
      expect(json).toHaveProperty('string')
    })
  })

  describe('CSS 函数', () => {
    it('calc 应该生成 calc 表达式', () => {
      const result = Size.calc('100% - 20px')
      expect(result).toBe('calc(100% - 20px)')
    })

    it('cssMin 应该生成 min 表达式', () => {
      const result = Size.cssMin('100px', '50%')
      expect(result).toBe('min(100px, 50%)')
    })

    it('cssMax 应该生成 max 表达式', () => {
      const result = Size.cssMax('100px', '50%')
      expect(result).toBe('max(100px, 50%)')
    })

    it('cssClamp 应该生成 clamp 表达式', () => {
      const result = Size.cssClamp('10px', '50%', '100px')
      expect(result).toBe('clamp(10px, 50%, 100px)')
    })
  })

  describe('插值计算', () => {
    it('应该正确进行线性插值', () => {
      const s1 = px(0)
      const s2 = px(100)

      const interpolated = s1.interpolate(s2, 0.5)
      expect(interpolated.pixels).toBe(50)
    })

    it('应该支持不同单位的插值', () => {
      const s1 = px(16)
      const s2 = rem(2, 16) // 32px

      const interpolated = s1.interpolate(s2, 0.5)
      expect(interpolated.pixels).toBe(24)
    })
  })
})

