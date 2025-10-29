import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { resolve } from 'path'

export default defineConfig({
  plugins: [solid()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LDesignSizeSolid',
      formats: ['es', 'cjs']
    },
    outDir: 'es',
    rollupOptions: {
      external: ['solid-js', 'solid-js/web', 'solid-js/store', '@ldesign/size-core'],
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

