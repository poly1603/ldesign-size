import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LDesignSizeReact',
      formats: ['es', 'cjs']
    },
    outDir: 'es',
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'vue/jsx-runtime', '@ldesign/size-core', 'lucide-react'],
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

