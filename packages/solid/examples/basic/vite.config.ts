import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { resolve } from 'path'

export default defineConfig({
  plugins: [solid()],

  server: {
    port: 5174,
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
      '@ldesign/size-solid': resolve(__dirname, '../../es/index.js')
    },
    conditions: ['development', 'browser']
  }
})

