import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

export default defineConfig({
  plugins: [svelte({ compilerOptions: { runes: true } })],

  server: {
    port: 5173,
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
      '@ldesign/size-svelte': resolve(__dirname, '../../es/index.js')
    }
  }
})

