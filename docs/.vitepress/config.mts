import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { GitChangelog } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { BASE, REPO_URL } from './site'

// 构建时静态统计每页字数，注入 pageData.stats，运行时直接读，不用等页面渲染再算
function countWords(pageData: { filePath?: string }): number {
  const filePath = pageData.filePath
  if (!filePath) return 0
  const abs = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), 'docs', filePath)
  if (!fs.existsSync(abs)) return 0

  const text = fs
    .readFileSync(abs, 'utf8')
    .replace(/^---[\s\S]*?---\s*/, '') // frontmatter
    .replace(/```[\s\S]*?```/g, ' ') // 代码块
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接保留文字
    .replace(/<[^>]+>/g, ' ') // HTML 标签
    .replace(/[#>*_`~|:-]/g, ' ') // markdown 标记
    .replace(/\s+/g, '')

  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const latin = (text.match(/[a-zA-Z0-9]+/g) || []).length
  return chinese + latin
}

export default defineConfig({
  base: BASE,
  lang: 'zh-CN',
  title: 'Go2 EDU 学习笔记',
  description: '宇树 Go2 EDU 二次开发与具身智能体的学习路线记录',

  cleanUrls: true,
  lastUpdated: true,

  // 中文站用系统字体即可，不加载 Google Fonts
  useWebFonts: false,

  transformPageData: (pageData) => {
    const words = countWords(pageData as { filePath?: string })
    ;(pageData as unknown as { stats: { words: number; minutes: number } }).stats = {
      words,
      // 中文按每分钟 400 字估
      minutes: Math.max(1, Math.round(words / 400)),
    }
  },

  vite: {
    plugins: [
      GitChangelog({
        locale: 'zh-CN',
        repoURL: REPO_URL,
      }),
    ],
  },

  themeConfig: {
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
    },
    search: { provider: 'local' },
    editLink: {
      pattern: `${REPO_URL}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页',
    },

    nav: [
      { text: '起步', link: '/guide/' },
      { text: '服务器', link: '/server/' },
      { text: '智能体', link: '/agent/' },
      { text: '实验室', link: '/lab/' },
      { text: '日志', link: '/log/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '起步',
          items: [
            { text: '总览', link: '/guide/' },
            { text: '安全规范', link: '/guide/safety' },
            { text: '环境搭建', link: '/guide/environment' },
            { text: '跑通示例', link: '/guide/examples' }
          ]
        }
      ],
      '/server/': [
        { text: '服务器', items: [{ text: '总览', link: '/server/' }] }
      ],
      '/agent/': [
        { text: '智能体', items: [{ text: '总览', link: '/agent/' }] }
      ],
      '/lab/': [
        { text: '实验室', items: [{ text: '总览', link: '/lab/' }] }
      ],
      '/log/': [
        {
          text: '日志',
          items: [
            { text: '总览', link: '/log/' },
            { text: '单篇模板', link: '/log/template' }
          ]
        }
      ]
    },

    footer: {
      message: '个人学习笔记，随进度更新'
    }
  }
})
