import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

import { NolebaseEnhancedReadabilitiesPlugin } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'

import '@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css'

import Bridge from './bridge'
import { setupThemeTransition } from './themeTransition'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout: Bridge,
  enhanceApp({ app }) {
    // 页面历史（基于 Git）
    app.use(NolebaseGitChangelogPlugin)

    // 阅读增强：布局切换 + 聚光灯，聚光灯默认开着
    app.use(NolebaseEnhancedReadabilitiesPlugin, {
      spotlight: {
        defaultToggle: true,
      },
    })

    // 主题切换的圆形扩散动画
    if (typeof window !== 'undefined') {
      window.addEventListener('load', setupThemeTransition)
    }
  },
} satisfies Theme
