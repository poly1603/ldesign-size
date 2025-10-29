/**
 * @ldesign/size-svelte 构建配置
 * Svelte 5 尺寸管理包
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  name: 'LDesignSizeSvelte',
  libraryType: 'svelte',

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
    'svelte',
    'svelte/internal',
    '@ldesign/size-core'
  ],

  typescript: {
    declaration: true,
    declarationDir: 'es',
    sourceMap: true
  },

  svelte: {
    compilerOptions: {
      runes: true
    }
  }
})


