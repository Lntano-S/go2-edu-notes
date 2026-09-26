import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
import Bridge from './bridge'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout: Bridge,
  enhanceApp({ app }) {
    app.use(NolebaseGitChangelogPlugin)
  },
} satisfies Theme
