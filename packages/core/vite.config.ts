import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LDesignSizeCore',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.js'
        if (format === 'cjs') return 'index.cjs'
        return 'index.min.js'
      }
    },
    outDir: 'es',
    rollupOptions: {
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
        },
        {
          format: 'umd',
          dir: 'dist',
          name: 'LDesignSizeCore',
          entryFileNames: 'index.min.js'
        }
      ]
    },
    sourcemap: true
  }
})

