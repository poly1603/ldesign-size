/**
 * @ldesign/size-core 构建配置
 * 框架无关的尺寸管理核心库
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  name: 'LDesignSizeCore',
  libraryType: 'typescript',

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
      enabled: true,
      name: 'LDesignSizeCore',
      file: 'dist/index.min.js'
    }
  },

  external: [],

  typescript: {
    declaration: true,
    declarationDir: 'es',
    sourceMap: true
  },

  minify: {
    umd: true
  }
})


