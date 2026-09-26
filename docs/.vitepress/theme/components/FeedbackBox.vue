<script setup lang="ts">
// 反馈入口在 ../../site.ts 里统一配（FEEDBACK_URL）
import { FEEDBACK_URL } from '../../site'
</script>

<template>
  <div class="feedback-box">
    <h2 id="意见反馈">意见反馈</h2>
    <div class="feedback-body">
      <span class="feedback-icon">💬</span>
      <span class="feedback-text">
        <span>这一页有错、有遗漏，或者你有别的建议？</span>
        <a :href="FEEDBACK_URL" target="_blank" rel="noopener">点这里告诉我，我会尽快处理。</a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.feedback-box {
  margin-top: 32px;
}

.feedback-body {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(0, 114, 72, 0.09);
  border: 1px solid rgba(0, 114, 72, 0.18);
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.feedback-icon {
  flex-shrink: 0;
  font-size: 20px;
  line-height: 1;
}

.feedback-text {
  min-width: 0;
  line-height: 1.6;
}

.feedback-text a {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
