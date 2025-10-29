import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  test: {
    globals: true,
    environment: 'jsdom',
    transformMode: {
      web: [/\.[jt]sx?$/]
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'es/', 'lib/', 'dist/']
    }
  },
  resolve: {
    conditions: ['development', 'browser']
  }
})


