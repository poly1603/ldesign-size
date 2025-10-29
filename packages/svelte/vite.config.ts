import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

export default defineConfig({
  plugins: [svelte({ compilerOptions: { runes: true } })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LDesignSizeSvelte',
      formats: ['es', 'cjs']
    },
    outDir: 'es',
    rollupOptions: {
      external: ['svelte', 'svelte/internal', '@ldesign/size-core'],
      output: [
        {
          format: 'es',
          dir: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js'
        },
        {
          format: 'cjs',
          dir: 'lib',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs'
        }
      ]
    },
    sourcemap: true
  }
})

