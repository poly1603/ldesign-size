/**
 * @ldesign/size-react 构建配置
 * React 尺寸管理包
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  name: 'LDesignSizeReact',
  libraryType: 'react',

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
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@ldesign/size-core',
    'lucide-react'
  ],

  typescript: {
    declaration: true,
    declarationDir: 'es',
    sourceMap: true
  },

  react: {
    jsxRuntime: 'automatic'
  }
})


