/**
 * @ldesign/size-vue 构建配置
 * Vue 3 尺寸管理包
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  name: 'LDesignSizeVue',
  libraryType: 'vue3',

  input: 'src/index.ts',

  output: {
    esm: {
      dir: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    cjs: {
      dir: 'lib',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    umd: {
      enabled: false
    }
  },

  external: [
    'vue',
    '@ldesign/size-core',
    'lucide-vue-next'
  ],

  typescript: {
    declaration: true,
    declarationDir: 'es',
    sourceMap: true
  },

  vue: {
    isProduction: true,
    script: {
      propsDestructure: true
    }
  }
})


