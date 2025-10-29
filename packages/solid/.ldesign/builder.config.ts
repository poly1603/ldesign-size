/**
 * @ldesign/size-solid 构建配置
 * Solid.js 尺寸管理包
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  name: 'LDesignSizeSolid',
  libraryType: 'solid',

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
    'solid-js',
    'solid-js/web',
    'solid-js/store',
    '@ldesign/size-core'
  ],

  typescript: {
    declaration: true,
    declarationDir: 'es',
    sourceMap: true
  },

  solid: {
    jsxImportSource: 'solid-js'
  }
})


