import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LDesignSizeVue',
      formats: ['es', 'cjs']
    },
    outDir: 'es',
    rollupOptions: {
      external: ['vue', '@ldesign/size-core', 'lucide-vue-next', '@ldesign/shared', /^@ldesign\/shared\//],
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

