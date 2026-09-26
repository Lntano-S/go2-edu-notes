<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

// 署名：只在 frontmatter 里写了 author 才显示，没写就不占位置
const author = computed(() => {
  const a = page.value.frontmatter.author
  if (!a) return ''
  return Array.isArray(a) ? a.join('、') : String(a)
})

// 最后更新：构建时算好的静态数据
const lastUpdated = computed(() => {
  const ts = page.value.lastUpdated
  if (!ts) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ts))
})

// 字数与阅读时间：构建时由 config.mts 的 transformPageData 注入
const stats = computed(
  () => (page.value as { stats?: { words: number; minutes: number } }).stats,
)
</script>

<template>
  <div class="page-info">
    <span v-if="author" class="pi-item">
      <span class="pi-icon">👤</span>作者：{{ author }}
    </span>
    <span v-if="lastUpdated" class="pi-item">
      <span class="pi-icon">🕒</span>最后更新：{{ lastUpdated }}
    </span>
    <span v-if="stats?.words" class="pi-item">
      <span class="pi-icon">📝</span>字数：{{ stats.words }}
    </span>
    <span v-if="stats?.words" class="pi-item">
      <span class="pi-icon">⏱️</span>预计阅读：{{ stats.minutes }} 分钟
    </span>
  </div>
</template>

<style scoped>
.page-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 8px 0 20px;
  padding: 10px 16px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.pi-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pi-icon {
  font-size: 14px;
}
</style>
