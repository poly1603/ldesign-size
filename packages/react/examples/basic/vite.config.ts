import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5172,
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
      '@ldesign/size-react': resolve(__dirname, '../../es/index.js')
    }
  }
})

