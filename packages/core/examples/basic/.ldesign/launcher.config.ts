/**
 * Core Size Example 启动配置
 */

import { defineConfig } from '@ldesign/launcher'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 5170,
    open: true,
    host: true
  },

  build: {
    outDir: 'dist',
    sourcemap: true
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@ldesign/size-core': resolve(__dirname, '../../../es/index.js')
    }
  },

  optimizeDeps: {
    include: ['@ldesign/size-core']
  }
})

