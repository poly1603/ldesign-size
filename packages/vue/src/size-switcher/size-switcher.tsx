/**
 * 尺寸切换器组件
 * 
 * 参考 ThemeColorPicker 的设计风格
 * 
 * @example
 * ```tsx
 * <SizeSwitcher />
 * ```
 */
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, ref, Transition } from 'vue'
import type { PropType } from 'vue'
import { Type, Check } from 'lucide-vue-next'
import type { SizePresetTheme } from '@ldesign/size-core'
import './style/index.css'

export default defineComponent({
  name: 'SizeSwitcher',

  props: {
    /** 禁用状态 */
    disabled: { type: Boolean, default: false },
    /** 尺寸 */
    size: { type: String as PropType<'small' | 'medium' | 'large'>, default: 'medium' },
    /** 标题 */
    title: { type: String, default: '' },
    /** 翻译函数 */
    translate: { type: Function as PropType<(key: string) => string>, default: undefined },
    /** 当前语言 */
    locale: { type: [String, Object] as PropType<string | { value: string }>, default: undefined },
  },

  setup(props) {
    // 获取当前组件实例,访问全局属性
    const instance = getCurrentInstance()
    const sizeManager = instance?.appContext.config.globalProperties.$sizeManager
    const containerRef = ref<HTMLElement | null>(null)

    // 下拉菜单状态
    const isOpen = ref(false)

    // 获取所有预设
    const presets = computed<SizePresetTheme[]>(() => {
      return sizeManager?.getPresets?.() || []
    })

    // 当前预设
    const currentPreset = computed(() => {
      return sizeManager?.getCurrentPreset?.() || null
    })

    // 获取当前语言
    const getCurrentLocale = (): string | undefined => {
      if (props.locale && typeof props.locale === 'object' && 'value' in props.locale) {
        return (props.locale as { value: string }).value
      } else if (typeof props.locale === 'string') {
        return props.locale
      }
      return undefined
    }

    // 判断是否中文
    const isZh = computed(() => {
      const locale = getCurrentLocale() || ''
      return locale.toLowerCase().startsWith('zh') || locale.includes('cn')
    })

    // 标题文本
    const titleText = computed(() => {
      if (props.title) return props.title
      if (props.translate) return props.translate('size.title')
      return isZh.value ? '全局尺寸' : 'Size Preset'
    })

    // 尺寸提示文本
    const sizeTooltip = computed(() => {
      if (props.translate) return props.translate('size.switchSize')
      return isZh.value ? '切换尺寸' : 'Switch Size'
    })

    // 获取预设标签
    const getPresetLabel = (preset: SizePresetTheme): string => {
      if (props.translate) {
        return props.translate(`size.presets.${preset.name}`)
      }
      return preset.label || preset.name
    }

    // 获取预设描述
    const getPresetDesc = (preset: SizePresetTheme): string => {
      return `${preset.config.baseSize}px · ${preset.config.scale}x`
    }

    // 触发器样式类
    const triggerClass = computed(() => {
      const classes = ['ldesign-size-switcher__trigger']
      if (props.size === 'small') classes.push('ldesign-size-switcher__trigger--small')
      if (props.size === 'large') classes.push('ldesign-size-switcher__trigger--large')
      return classes.join(' ')
    })

    // 容器样式类
    const containerClass = computed(() => {
      const classes = ['ldesign-size-switcher']
      if (props.disabled) classes.push('ldesign-size-switcher--disabled')
      return classes.join(' ')
    })

    // 选择预设
    const selectPreset = (name: string) => {
      sizeManager?.applyPreset?.(name)
      isOpen.value = false
    }

    // 点击外部关闭下拉菜单
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return () => (
      <div ref={containerRef} class={containerClass.value}>
        <button
          type="button"
          class={triggerClass.value}
          onClick={() => (isOpen.value = !isOpen.value)}
          disabled={props.disabled}
          title={sizeTooltip.value}
        >
          <Type size={18} strokeWidth={2} />
        </button>

        <Transition name="ldesign-dropdown">
          {isOpen.value && (
            <div class="ldesign-size-switcher__dropdown">
              <div class="ldesign-size-switcher__arrow" />
              <div class="ldesign-size-switcher__header">
                <h4 class="ldesign-size-switcher__title">{titleText.value}</h4>
              </div>
              <div class="ldesign-size-switcher__list">
                {presets.value.map(preset => {
                  const isActive = currentPreset.value?.name === preset.name
                  return (
                    <div
                      key={preset.name}
                      class={[
                        'ldesign-size-switcher__item',
                        isActive && 'ldesign-size-switcher__item--active',
                      ].filter(Boolean).join(' ')}
                      onClick={() => selectPreset(preset.name)}
                    >
                      <span class="ldesign-size-switcher__item-icon">
                        <span style={{ fontSize: `${Math.max(12, preset.config.baseSize - 2)}px` }}>A</span>
                      </span>
                      <div class="ldesign-size-switcher__item-info">
                        <span class="ldesign-size-switcher__item-label">{getPresetLabel(preset)}</span>
                        <span class="ldesign-size-switcher__item-desc">{getPresetDesc(preset)}</span>
                      </div>
                      {isActive && (
                        <Check size={16} class="ldesign-size-switcher__check" strokeWidth={3} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Transition>
      </div>
    )
  },
})

