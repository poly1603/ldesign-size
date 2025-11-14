/**
 * 尺寸预设选择器组件
 * 
 * 显示所有可用的尺寸预设,支持选择和切换
 * 
 * @example
 * ```tsx
 * <SizePresetPicker />
 * ```
 */
import { computed, defineComponent, inject } from 'vue'
import type { BaseSizeAdapter, SizePresetTheme } from '@ldesign/size-core'
import { sortPresets, sizePresetThemes } from '@ldesign/size-core'
import { SIZE_SYMBOL } from '../constants'
import './style/index.less'

export default defineComponent({
  name: 'SizePresetPicker',

  setup() {
    // 注入 Size 适配器
    const sizeAdapter = inject<BaseSizeAdapter>(SIZE_SYMBOL, undefined as any)

    /**
     * 所有预设列表（合并后的）
     */
    const presets = computed(() => {
      if (sizeAdapter && sizeAdapter.getPresets) {
        return sizeAdapter.getPresets()
      }

      // 降级：使用内置预设
      return sortPresets(sizePresetThemes)
    })

    /**
     * 当前选中的预设
     */
    const currentPreset = computed(() => {
      if (sizeAdapter && sizeAdapter.getCurrentPreset) {
        return sizeAdapter.getCurrentPreset()
      }
      return null
    })

    /**
     * 判断预设是否激活
     */
    const isActive = (name: string): boolean => {
      return currentPreset.value?.name === name
    }

    /**
     * 选择预设
     */
    const selectPreset = (name: string): void => {
      if (sizeAdapter && sizeAdapter.applyPreset) {
        sizeAdapter.applyPreset(name)
      }
    }

    /**
     * 获取预设名称（支持 i18n）
     */
    const presetName = (name: string): string => {
      // TODO: 集成 i18n
      // const { t } = useI18n()
      // return t(`size.presets.${name}`)

      const preset = presets.value.find(p => p.name === name)
      return preset?.label || name
    }

    /**
     * 获取预设描述（支持 i18n）
     */
    const presetDescription = (name: string): string => {
      // TODO: 集成 i18n
      // const { t } = useI18n()
      // return t(`size.descriptions.${name}`)

      const preset = presets.value.find(p => p.name === name)
      return preset?.description || ''
    }

    return () => (
      <div class="size-preset-picker">
        {presets.value.map(preset => (
          <button
            key={preset.name}
            class={['preset-item', { active: isActive(preset.name) }]}
            onClick={() => selectPreset(preset.name)}
          >
            <div class="preset-info">
              <span class="preset-name">{presetName(preset.name)}</span>
              <span class="preset-description">{presetDescription(preset.name)}</span>
            </div>
            <div class="preset-config">
              <span class="config-item">{preset.config.baseSize}px</span>
              <span class="config-item">×{preset.config.scale}</span>
            </div>
          </button>
        ))}
      </div>
    )
  }
})

