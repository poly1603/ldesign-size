/**
 * 尺寸切换器组件
 * 
 * 提供一个按钮和下拉菜单,用于切换不同的尺寸预设
 * 
 * @example
 * ```tsx
 * <SizeSwitcher translate={t} locale={locale} />
 * ```
 */
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import type { SizePresetTheme } from '@ldesign/size-core'
import './style/index.less'

export default defineComponent({
  name: 'SizeSwitcher',

  props: {
    /**
     * 翻译函数
     */
    translate: {
      type: Function as PropType<(key: string) => string>,
      default: undefined
    },

    /**
     * 当前语言
     */
    locale: {
      type: [String, Object] as PropType<string | { value: string }>,
      default: undefined
    }
  },

  setup(props) {
    // 获取当前组件实例,访问全局属性
    const instance = getCurrentInstance()
    const sizeManager = instance?.appContext.config.globalProperties.$sizeManager

    // 下拉菜单状态
    const isOpen = ref(false)

    /**
     * 获取所有预设
     */
    const presets = computed<SizePresetTheme[]>(() => {
      return sizeManager?.getPresets?.() || []
    })

    /**
     * 当前预设
     */
    const currentPreset = computed(() => {
      return sizeManager?.getCurrentPreset?.() || null
    })

    /**
     * 获取当前语言
     */
    const getCurrentLocale = (): string | undefined => {
      // 检查是否有 value 属性（Ref 或类 Ref 对象）
      if (props.locale && typeof props.locale === 'object' && 'value' in props.locale) {
        return (props.locale as { value: string }).value
      }
      else if (typeof props.locale === 'string') {
        return props.locale
      }
      return undefined
    }

    /**
     * 尺寸文本
     */
    const sizeText = computed(() => {
      if (!currentPreset.value) return 'Size'

      const currentLocale = getCurrentLocale()

      // 使用翻译
      if (currentLocale && props.translate) {
        return props.translate(`size.presets.${currentPreset.value}`)
      }

      if (props.translate) {
        return props.translate(`size.presets.${currentPreset.value}`)
      }

      // 降级到预设名称
      return currentPreset.value
    })

    /**
     * 尺寸提示文本
     */
    const sizeTitle = computed(() => {
      const currentLocale = getCurrentLocale()

      if (currentLocale && props.translate) {
        return props.translate('size.switchSize')
      }

      if (props.translate) {
        return props.translate('size.switchSize')
      }

      return '切换尺寸'
    })

    /**
     * 获取预设标签
     */
    const getPresetLabel = (preset: SizePresetTheme): string => {
      const currentLocale = getCurrentLocale()

      if (currentLocale && props.translate) {
        return props.translate(`size.presets.${preset.name}`)
      }

      if (props.translate) {
        return props.translate(`size.presets.${preset.name}`)
      }

      return preset.label || preset.name
    }

    /**
     * 切换下拉菜单
     */
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    /**
     * 选择预设
     */
    const selectPreset = (name: string) => {
      sizeManager?.applyPreset?.(name)
      isOpen.value = false
    }

    /**
     * 点击外部关闭下拉菜单
     */
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.ld-size-switcher')) {
        isOpen.value = false
      }
    }

    // 挂载时添加事件监听
    onMounted(() => {
      if (typeof window !== 'undefined') {
        window.addEventListener('click', handleClickOutside)
      }
    })

    // 卸载时移除事件监听
    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleClickOutside)
      }
    })

    return () => (
      <div class="ld-size-switcher">
        <button class="size-button" title={sizeTitle.value} onClick={toggleDropdown}>
          <span class="size-icon">📏</span>
          <span class="size-text">{sizeText.value}</span>
          <span class="dropdown-icon">{isOpen.value ? '▲' : '▼'}</span>
        </button>

        {isOpen.value && (
          <div class="size-dropdown">
            {presets.value.map(preset => (
              <div
                key={preset.name}
                class={['size-option', { active: currentPreset.value?.name === preset.name }]}
                onClick={() => selectPreset(preset.name)}
              >
                <span class="preset-name">{getPresetLabel(preset)}</span>
                <span class="preset-size">{preset.baseSize}px</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
})

