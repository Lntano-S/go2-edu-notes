# 日志

按日期记的原始笔记。不追求结构完整，追求当时真实。

每篇照 [单篇模板](/log/template) 的五段来写。

<script setup>
import { data as logs } from './logs.data'
</script>

<p v-if="!logs.length">还没有日记。</p>

<ul v-else class="log-list">
  <li v-for="log in logs" :key="log.url" class="log-item">
    <a class="log-date" :href="log.url">{{ log.date }}</a>
    <div class="log-title">{{ log.title }}</div>
    <div v-if="log.excerpt" class="log-excerpt">{{ log.excerpt }}</div>
  </li>
</ul>

<style scoped>
.log-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
}
.log-item {
  padding: 1rem 0;
  border-bottom: 0.5px solid var(--vp-c-divider);
}
.log-item:last-child {
  border-bottom: none;
}
.log-date {
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.log-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0.25rem 0 0.3rem;
}
.log-excerpt {
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>
