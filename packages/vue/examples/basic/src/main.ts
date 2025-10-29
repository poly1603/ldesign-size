import { createApp } from 'vue'
import { createSizePlugin } from '@ldesign/size-vue'
import type { SizePreset } from '@ldesign/size-core'
import App from './App.vue'
import './style.css'

// 自定义预设
const customPresets: SizePreset[] = [
  { name: 'compact', label: '紧凑', baseSize: 12 },
  { name: 'normal', label: '正常', baseSize: 14 },
  { name: 'comfortable', label: '舒适', baseSize: 16 },
  { name: 'large', label: '大号', baseSize: 18 },
  { name: 'extra-large', label: '超大', baseSize: 20 }
]

const app = createApp(App)

// 安装 Size 插件
app.use(createSizePlugin({
  defaultSize: 'normal',
  presets: customPresets,
  storageKey: 'vue-example-size'
}))

app.mount('#app')


