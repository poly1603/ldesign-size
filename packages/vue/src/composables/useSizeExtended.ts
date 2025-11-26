/**
 * @ldesign/size-vue - 扩展的 Composables
 * 
 * 提供额外的实用 Hooks
 */

import { computed, ref, readonly, watch, onMounted, onUnmounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useSize } from './useSize'

/**
 * 尺寸监听 Hook
 * 
 * 监听尺寸变化并执行回调
 * 
 * @param callback - 尺寸变化时的回调函数
 * @param options - 配置选项
 * 
 * @example
 * ```ts
 * useSizeWatch((newSize, oldSize) => {
 *   console.log(`尺寸从 ${oldSize} 变更为 ${newSize}`)
 * })
 * ```
 */
export function useSizeWatch(
  callback: (newSize: string, oldSize: string) => void,
  options: { immediate?: boolean } = {}
) {
  const { currentPreset } = useSize()
  
  watch(
    currentPreset,
    (newVal, oldVal) => {
      callback(newVal, oldVal || '')
    },
    { immediate: options.immediate }
  )
}

/**
 * 尺寸计算 Hook
 * 
 * 提供尺寸计算和 CSS 变量读取功能
 * 
 * @example
 * ```ts
 * const { calc, getVar, scale } = useSizeCalc()
 * 
 * const padding = calc(2) // 计算 baseSize * 2
 * const fontSize = getVar('font-base') // 获取 CSS 变量
 * const scaled = scale(16, 1.5) // 缩放计算
 * ```
 */
export function useSizeCalc() {
  const { config } = useSize()

  return {
    /**
     * 根据基础尺寸计算像素值
     */
    calc: (multiplier: number): ComputedRef<string> => {
      return computed(() => `${config.value.baseSize * multiplier}px`)
    },

    /**
     * 获取 CSS 变量值
     */
    getVar: (name: string): string => {
      if (typeof window === 'undefined') return ''
      return getComputedStyle(document.documentElement)
        .getPropertyValue(`--size-${name}`)
        .trim()
    },

    /**
     * 缩放计算
     */
    scale: (value: number, ratio: number): ComputedRef<string> => {
      return computed(() => `${value * ratio}px`)
    },

    /**
     * 响应式获取当前基础尺寸
     */
    baseSize: computed(() => config.value.baseSize)
  }
}

/**
 * 尺寸过渡动画 Hook
 * 
 * 提供平滑的尺寸切换动画
 * 
 * @param duration - 动画持续时间（毫秒）
 * @param easing - 缓动函数
 * 
 * @example
 * ```ts
 * const { transitionTo, isTransitioning } = useSizeTransition(300)
 * 
 * await transitionTo('large')
 * ```
 */
export function useSizeTransition(
  duration = 300,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
) {
  const { applyPreset } = useSize()
  const isTransitioning = ref(false)

  const transitionTo = async (preset: string): Promise<void> => {
    if (isTransitioning.value) return

    isTransitioning.value = true

    // 添加过渡效果
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.style.transition = `all ${duration}ms ${easing}`

      // 应用新预设
      applyPreset(preset)

      // 等待动画完成
      await new Promise(resolve => setTimeout(resolve, duration))

      // 移除过渡
      root.style.transition = ''
    } else {
      applyPreset(preset)
    }

    isTransitioning.value = false
  }

  return {
    transitionTo,
    isTransitioning: readonly(isTransitioning)
  }
}

/**
 * 响应式断点 Hook
 * 
 * 根据窗口宽度返回当前断点
 * 
 * @example
 * ```ts
 * const { breakpoint, isMobile, isTablet, isDesktop } = useSizeBreakpoint()
 * 
 * watch(breakpoint, (bp) => {
 *   console.log('当前断点:', bp)
 * })
 * ```
 */
export function useSizeBreakpoint() {
  const breakpoint = ref<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>('md')

  const updateBreakpoint = () => {
    if (typeof window === 'undefined') return

    const width = window.innerWidth

    if (width < 640) {
      breakpoint.value = 'xs'
    } else if (width < 768) {
      breakpoint.value = 'sm'
    } else if (width < 1024) {
      breakpoint.value = 'md'
    } else if (width < 1280) {
      breakpoint.value = 'lg'
    } else if (width < 1536) {
      breakpoint.value = 'xl'
    } else {
      breakpoint.value = 'xxl'
    }
  }

  onMounted(() => {
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateBreakpoint)
    }
  })

  return {
    breakpoint: readonly(breakpoint),
    isMobile: computed(() => breakpoint.value === 'xs' || breakpoint.value === 'sm'),
    isTablet: computed(() => breakpoint.value === 'md'),
    isDesktop: computed(() => ['lg', 'xl', 'xxl'].includes(breakpoint.value))
  }
}

/**
 * 自动尺寸适配 Hook
 * 
 * 根据设备和断点自动应用合适的尺寸预设
 * 
 * @param options - 配置选项
 * 
 * @example
 * ```ts
 * useAutoSize({
 *   mobile: 'compact',
 *   tablet: 'comfortable',
 *   desktop: 'spacious'
 * })
 * ```
 */
export function useAutoSize(options: {
  mobile?: string
  tablet?: string
  desktop?: string
  enabled?: Ref<boolean> | boolean
} = {}) {
  const { applyPreset } = useSize()
  const { breakpoint } = useSizeBreakpoint()
  
  const enabled = typeof options.enabled === 'boolean' 
    ? ref(options.enabled) 
    : options.enabled || ref(true)

  const presetMap = {
    mobile: options.mobile || 'compact',
    tablet: options.tablet || 'comfortable',
    desktop: options.desktop || 'comfortable'
  }

  watch(
    [breakpoint, enabled],
    ([bp, isEnabled]) => {
      if (!isEnabled) return

      if (bp === 'xs' || bp === 'sm') {
        applyPreset(presetMap.mobile)
      } else if (bp === 'md') {
        applyPreset(presetMap.tablet)
      } else {
        applyPreset(presetMap.desktop)
      }
    },
    { immediate: true }
  )

  return {
    enabled,
    toggle: () => { enabled.value = !enabled.value }
  }
}

/**
 * 尺寸持久化 Hook
 * 
 * 自动保存和恢复用户的尺寸偏好
 * 
 * @param storageKey - 存储键名
 * 
 * @example
 * ```ts
 * useSizePersistence('my-app-size')
 * ```
 */
export function useSizePersistence(storageKey = 'user-size-preference') {
  const { currentPreset, applyPreset } = useSize()

  // 从存储中恢复
  onMounted(() => {
    if (typeof localStorage === 'undefined') return

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        applyPreset(saved)
      }
    } catch (error) {
      console.warn('[useSizePersistence] Failed to load from storage:', error)
    }
  })

  // 监听变化并保存
  watch(currentPreset, (newSize) => {
    if (typeof localStorage === 'undefined') return

    try {
      localStorage.setItem(storageKey, newSize)
    } catch (error) {
      console.warn('[useSizePersistence] Failed to save to storage:', error)
    }
  })

  return {
    clear: () => {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(storageKey)
      }
    }
  }
}