import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  server: {
    port: 5171,
    open: true,
    host: true
  },

  build: {
    outDir: 'dist',
    sourcemap: true
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ldesign/size-core': resolve(__dirname, '../../../core/es/index.js'),
      '@ldesign/size-vue': resolve(__dirname, '../../es/index.js')
    }
  }
})

