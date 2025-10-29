/**
 * Core Size Example - Basic Usage
 * 
 * 演示 @ldesign/size-core 的核心功能
 */

import { SizeManager, type SizePreset } from '@ldesign/size-core'
import './style.css'

// 自定义预设
const customPresets: SizePreset[] = [
  { name: 'compact', label: '紧凑', baseSize: 12 },
  { name: 'normal', label: '正常', baseSize: 14 },
  { name: 'comfortable', label: '舒适', baseSize: 16 },
  { name: 'large', label: '大号', baseSize: 18 },
  { name: 'extra-large', label: '超大', baseSize: 20 }
]

// 创建 SizeManager 实例
const manager = new SizeManager({
  presets: customPresets,
  storageKey: 'core-example-size'
})

// 应用默认预设
manager.applyPreset('normal')

// DOM 元素
const presetSelector = document.getElementById('preset-selector') as HTMLSelectElement
const presetButtons = document.getElementById('preset-buttons') as HTMLDivElement
const currentPresetEl = document.getElementById('current-preset') as HTMLDivElement
const baseSizeEl = document.getElementById('base-size') as HTMLDivElement
const lineHeightEl = document.getElementById('line-height') as HTMLDivElement
const presetCountEl = document.getElementById('preset-count') as HTMLDivElement
const demoText = document.getElementById('demo-text') as HTMLDivElement
const presetList = document.getElementById('preset-list') as HTMLDivElement
const btnIncrease = document.getElementById('btn-increase') as HTMLButtonElement
const btnDecrease = document.getElementById('btn-decrease') as HTMLButtonElement
const btnReset = document.getElementById('btn-reset') as HTMLButtonElement
const sizeSlider = document.getElementById('size-slider') as HTMLInputElement
const sliderValue = document.getElementById('slider-value') as HTMLSpanElement

// 更新 UI
function updateUI() {
  const config = manager.getConfig()
  const currentPreset = manager.getCurrentPreset()
  const presets = manager.getPresets()

  // 更新信息卡片
  currentPresetEl.textContent = currentPreset
  baseSizeEl.textContent = `${config.baseSize}px`
  lineHeightEl.textContent = `${config.baseSize * 1.5}px`
  presetCountEl.textContent = presets.length.toString()

  // 更新演示文本样式
  demoText.style.fontSize = `${config.baseSize}px`
  demoText.style.lineHeight = `${config.baseSize * 1.5}px`

  // 更新滑块
  sizeSlider.value = config.baseSize.toString()
  sliderValue.textContent = config.baseSize.toString()

  // 更新选择器
  presetSelector.value = currentPreset

  // 更新预设列表
  updatePresetList(presets, currentPreset)
}

// 更新预设列表
function updatePresetList(presets: SizePreset[], currentPreset: string) {
  presetList.innerHTML = ''

  presets.forEach(preset => {
    const card = document.createElement('div')
    card.className = `info-card ${preset.name === currentPreset ? 'active' : ''}`
    card.innerHTML = `
      <div class="info-label">${preset.label}</div>
      <div class="info-value">${preset.baseSize}px</div>
    `
    presetList.appendChild(card)
  })
}

// 渲染按钮
function renderButtons() {
  const presets = manager.getPresets()

  presets.forEach(preset => {
    const button = document.createElement('button')
    button.className = 'btn'
    button.textContent = preset.label
    button.onclick = () => {
      manager.applyPreset(preset.name)
      console.log('预设已变更为:', preset.name)
    }
    presetButtons.appendChild(button)
  })
}

// 订阅变化
manager.subscribe((config) => {
  console.log('配置已更新:', config)
  updateUI()
})

// 事件监听
presetSelector.addEventListener('change', (e) => {
  const value = (e.target as HTMLSelectElement).value
  manager.applyPreset(value)
})

btnIncrease.addEventListener('click', () => {
  const currentSize = manager.getConfig().baseSize
  manager.setBaseSize(Math.min(currentSize + 2, 24))
})

btnDecrease.addEventListener('click', () => {
  const currentSize = manager.getConfig().baseSize
  manager.setBaseSize(Math.max(currentSize - 2, 10))
})

btnReset.addEventListener('click', () => {
  manager.applyPreset('normal')
})

sizeSlider.addEventListener('input', (e) => {
  const value = parseInt((e.target as HTMLInputElement).value)
  manager.setBaseSize(value)
})

// 初始化
renderButtons()
updateUI()

console.log('SizeManager 已初始化:', manager)
console.log('当前配置:', manager.getConfig())
console.log('可用预设:', manager.getPresets())


