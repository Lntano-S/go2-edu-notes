/**
 * 桥组件：包装 VitePress 默认 Layout，往几个插槽里塞东西
 *   doc-before             → 页头信息条 + 目标标题高亮
 *   doc-after              → 意见反馈 + 基于 Git 的页面历史
 *   nav-bar-content-after  → 阅读增强菜单（桌面）
 *   nav-screen-content-after → 阅读增强菜单（移动端）
 */
import { defineComponent, h, nextTick, onMounted, watch } from 'vue'
import { useData, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { NolebaseGitChangelog } from '@nolebase/vitepress-plugin-git-changelog/client'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { NolebaseHighlightTargetedHeading } from '@nolebase/vitepress-plugin-highlight-targeted-heading/client'
import PageInfo from './components/PageInfo.vue'
import FeedbackBox from './components/FeedbackBox.vue'

declare global {
  interface Window {
    __vpIsDark?: import('vue').Ref<boolean>
  }
}

const Bridge = defineComponent({
  name: 'ThemeBridge',
  setup() {
    const { isDark, frontmatter } = useData()

    // 主题切换动画需要拿到 isDark
    if (typeof window !== 'undefined') {
      window.__vpIsDark = isDark
    }

    // 首页 feature 卡片点击跳转：VitePress 默认不支持给卡片配链接
    const bindCardLinks = () => {
      const features = frontmatter.value?.features as { link?: string }[] | undefined
      if (!features?.length) return
      nextTick(() => {
        const items = document.querySelectorAll('.VPFeatures .item')
        items.forEach((item, i) => {
          const link = features[i]?.link
          if (!link) return
          const el = item as HTMLElement
          el.style.cursor = 'pointer'
          el.onclick = () => {
            // withBase 补上部署前缀，否则挂在子路径下会 404
            window.location.href = withBase(link)
          }
        })
      })
    }
    watch(frontmatter, bindCardLinks)
    onMounted(bindCardLinks)

    return () =>
      h(DefaultTheme.Layout, null, {
        'doc-before': () => h('div', null, [h(PageInfo), h(NolebaseHighlightTargetedHeading)]),
        'doc-after': () =>
          h('div', { class: 'vp-doc' }, [h(FeedbackBox), h(NolebaseGitChangelog)]),
        'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
        'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
      })
  },
})

export default Bridge
