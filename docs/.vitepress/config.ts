import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@ldesign/size',
  description: '智能尺寸控制系统 - 让你的应用适配每一个屏幕',
  lang: 'zh-CN',

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '指南', link: '/getting-started/installation' },
      { text: 'API', link: '/api/core' },
      { text: '示例', link: '/examples/basic-usage' },
      {
        text: '生态系统',
        items: [
          { text: 'LDesign 主站', link: 'https://ldesign.github.io' },
          { text: 'GitHub', link: 'https://github.com/ldesign/ldesign' },
          { text: 'NPM', link: 'https://www.npmjs.com/package/@ldesign/size' }
        ]
      }
    ],

    // 侧边栏
    sidebar: {
      '/getting-started/': [
        {
          text: '开始使用',
          items: [
            { text: '安装', link: '/getting-started/installation' },
            { text: '快速开始', link: '/getting-started/quick-start' },
            { text: 'Vue 集成', link: '/getting-started/vue-integration' },
            { text: 'React 集成', link: '/getting-started/react-integration' }
          ]
        }
      ],
      '/guide/': [
        {
          text: '核心概念',
          items: [
            { text: '概述', link: '/guide/concepts' },
            { text: '尺寸模式', link: '/guide/size-modes' },
            { text: 'CSS 变量系统', link: '/guide/css-variables' },
            { text: '响应式设计', link: '/guide/responsive' }
          ]
        },
        {
          text: '进阶指南',
          items: [
            { text: '主题定制', link: '/guide/theme-customization' },
            { text: '性能优化', link: '/guide/performance' },
            { text: '无障碍访问', link: '/guide/accessibility' },
            { text: '最佳实践', link: '/guide/best-practices' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '核心 API', link: '/api/core' },
            { text: 'Vue API', link: '/api/vue' },
            { text: '类型定义', link: '/api/types' },
            { text: '工具函数', link: '/api/utils' },
            { text: '插件系统', link: '/api/plugins' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '基础示例',
          items: [
            { text: '基础用法', link: '/examples/basic-usage' },
            { text: 'Vue 组件', link: '/examples/vue-components' },
            { text: 'Composition API', link: '/examples/composition-api' }
          ]
        },
        {
          text: '进阶示例',
          items: [
            { text: '高级用法', link: '/examples/advanced-usage' },
            { text: '响应式布局', link: '/examples/responsive-layout' },
            { text: '动态主题', link: '/examples/dynamic-theme' },
            { text: '表单系统', link: '/examples/form-system' },
            { text: '数据表格', link: '/examples/data-table' },
            { text: '仪表盘', link: '/examples/dashboard' }
          ]
        },
        {
          text: '实战场景',
          items: [
            { text: '管理后台', link: '/examples/admin-panel' },
            { text: '电商网站', link: '/examples/e-commerce' },
            { text: '移动端适配', link: '/examples/mobile-adaptation' },
            { text: '多设备支持', link: '/examples/multi-device' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ldesign/ldesign' }
    ],

    // 页脚
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024 LDesign Team'
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/ldesign/ldesign/edit/main/packages/size/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    // 大纲配置
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 深色模式切换
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    // 侧边栏文字
    sidebarMenuLabel: '菜单',
  },

  // Markdown 配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  },

  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#667eea' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: '@ldesign/size' }],
    ['meta', { name: 'og:description', content: '智能尺寸控制系统 - 让你的应用适配每一个屏幕' }]
  ],

  // 构建配置
  vite: {
    resolve: {
      alias: {
        '@ldesign/size': '../src'
      }
    }
  }
})

