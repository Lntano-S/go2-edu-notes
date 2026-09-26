# Go2 EDU 学习笔记

宇树 Go2 EDU 二次开发与具身智能体的学习路线记录。
内容还在生长，这里先立骨架。

## 本地预览

需要 Node.js 18+。

```bash
npm install
npm run docs:dev      # http://localhost:5173
npm run docs:build    # 产物在 docs/.vitepress/dist
npm run docs:preview  # 预览构建结果
```

## 目录结构

| 目录 | 内容 |
|---|---|
| `docs/guide/` | 起步：安全、环境、只读示例、控制 |
| `docs/server/` | 服务器：llama.cpp、模型、视觉链路 |
| `docs/agent/` | 智能体：tools / skills / loop / executor |
| `docs/lab/` | 实验室工作流：仓库规范、协作、踩坑 |
| `docs/log/` | 日志：按日期记的原始笔记 |

## 部署

推送到 `main` 分支后由 GitHub Actions 自动构建，发布到 GitHub Pages。

如果仓库名不叫 `go2-edu-notes`，记得改 `docs/.vitepress/config.mts` 里的 `base`。

## 写作约定

日志按「五问」写：它是什么 / 为什么需要它 / 怎么做 / 踩了什么坑 / 还没搞懂什么。
最后一条别省，它是下一篇的入口。
