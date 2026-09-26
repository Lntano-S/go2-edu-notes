import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { katex } from '@mdit/plugin-katex'
import { GitChangelog } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { BASE, REPO_URL, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from './site'

// 构建时静态统计每页字数，注入 pageData.stats，运行时直接读，不用等页面渲染再算
function countWords(pageData: { filePath?: string }): number {
  const filePath = pageData.filePath
  if (!filePath) return 0
  const abs = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), 'docs', filePath)
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
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,

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

  markdown: {
    config: (md) => {
      md.use(katex)
    },
    image: {
      // 图片懒加载：滚动到才加载
      lazyLoading: true,
    },
  },

  head: [
    // 注意：head 里的路径不会自动加 base，这里拼上
    ['link', { rel: 'stylesheet', href: `${BASE}katex/katex.min.css` }],
    // 分享卡片（QQ、微信、Twitter 抓 og 标签生成预览）
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: SITE_TITLE }],
    ['meta', { property: 'og:title', content: SITE_TITLE }],
    ['meta', { property: 'og:description', content: SITE_DESCRIPTION }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    // ['meta', { property: 'og:image', content: `${SITE_URL}images/logo.png` }], // 有 logo 后再开
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],

  // og / twitter 标签提到 </title> 后面。部分抓取器（如 QQ）只读 head 前 1KB。
  // transformHead 是追加语义、不能重排，所以直接操作 HTML。
  transformHtml: (code) => {
    if (!code.includes('og:title')) return code
    const ogRe = /<meta property="og:[^"]*"[^>]*>|<meta name="twitter:[^"]*"[^>]*>/g
    const tags = code.match(ogRe)
    if (!tags || !tags.length) return code
    return code.replace(ogRe, '').replace('</title>', '</title>\n' + tags.join('\n'))
  },

  vite: {
    optimizeDeps: {
      exclude: ['@nolebase/vitepress-plugin-enhanced-readabilities/client', 'vitepress'],
    },
    ssr: {
      // Nolebase 系插件含 .vue 组件，需打包处理，否则 SSR 阶段报未知扩展名
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-highlight-targeted-heading',
      ],
    },
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

    editLink: {
      pattern: `${REPO_URL}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页',
    },

    // 中文分词：minisearch 默认不拆中文，配 2-gram 让中文关键词可检索
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (text: string) => {
              const english = text.match(/[a-zA-Z0-9]+/g) || []
              const chinese = text.match(/[\u4e00-\u9fa5]+/g) || []
              const tokens: string[] = [...english]
              for (const seg of chinese) {
                if (seg.length === 1) {
                  tokens.push(seg)
                  continue
                }
                // 相邻两字一组
                for (let i = 0; i < seg.length - 1; i++) {
                  tokens.push(seg.slice(i, i + 2))
                }
              }
              return tokens
            },
          },
        },
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              closeText: '关闭',
              navigateText: '导航到结果',
            },
          },
        },
      },
    },

    nav: [
      {
        text: '基础',
        items: [
          { text: 'Linux', link: '/linux/' },
          { text: 'GitHub', link: '/github/' }
        ]
      },
      { text: '起步', link: '/guide/' },
      { text: '服务器', link: '/server/' },
      { text: '智能体', link: '/agent/' },
      { text: '实验室', link: '/lab/' },
      { text: '日志', link: '/log/' }
    ],

    sidebar: {
      '/github/': [
        {
          text: 'GitHub 笔记',
          items: [
            { text: '总览', link: '/github/' },
            { text: '仓库', link: '/github/repository' },
            { text: '提交', link: '/github/commit' },
            { text: '部署', link: '/github/pages-actions' },
            { text: '认证', link: '/github/auth' }
          ]
        }
      ],
      '/linux/': [
        {
          text: 'Linux 基础',
          items: [
            { text: '总览', link: '/linux/' },
            { text: '命令的语法骨架', link: '/linux/command-syntax' }
          ]
        }
      ],
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
      '/server/': [{ text: '服务器', items: [{ text: '总览', link: '/server/' }] }],
      '/agent/': [{ text: '智能体', items: [{ text: '总览', link: '/agent/' }] }],
      '/lab/': [{ text: '实验室', items: [{ text: '总览', link: '/lab/' }] }],
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
