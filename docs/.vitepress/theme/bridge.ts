/**
 * 桥组件：包装 VitePress 默认 Layout，往两个插槽里塞东西
 *   doc-before → 页头信息条（作者 / 最后更新 / 字数 / 阅读时间）
 *   doc-after  → 意见反馈 + 基于 Git 的页面历史
 */
import { defineComponent, h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { NolebaseGitChangelog } from '@nolebase/vitepress-plugin-git-changelog/client'
import PageInfo from './components/PageInfo.vue'
import FeedbackBox from './components/FeedbackBox.vue'

const Bridge = defineComponent({
  name: 'ThemeBridge',
  setup() {
    return () =>
      h(
        DefaultTheme.Layout,
        null,
        {
          'doc-before': () => h(PageInfo),
          'doc-after': () => h('div', { class: 'vp-doc' }, [h(FeedbackBox), h(NolebaseGitChangelog)]),
        },
      )
  },
})

export default Bridge
