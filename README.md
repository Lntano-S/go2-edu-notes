# Go2 EDU 学习笔记

宇树 Go2 EDU 二次开发与具身智能体的学习路线记录。

📖 在线访问：<https://lntano-s.github.io/go2-edu-notes/>（仓库建好并开启 Pages 后生效）

## 本地预览

需要 Node.js 22+（`.nvmrc` 里定的 24）。

```bash
nvm use              # 有 nvm 的话，自动切到 .nvmrc 里的版本
npm install
npm run docs:dev     # http://localhost:5173
npm run docs:build   # 产物在 docs/.vitepress/dist
npm run docs:preview # 预览构建结果
```

## 目录结构

```
go2-edu-notes/
├── docs/                     # 站点内容
│   ├── index.md              # 首页
│   ├── 404.md                # 找不到页面
│   ├── .vitepress/
│   │   ├── site.ts           # 站点常量：仓库地址、部署路径、反馈入口
│   │   ├── config.mts        # 站点配置：导航、侧边栏、搜索、字数统计
│   │   └── theme/            # 自定义主题
│   │       ├── index.ts      # 主题入口
│   │       ├── bridge.ts     # 往页面插槽里塞组件
│   │       ├── themeTransition.ts
│   │       ├── components/   # PageInfo（字数/阅读时间）、FeedbackBox（反馈）
│   │       └── styles/
│   ├── public/               # 原样拷贝的静态资源（KaTeX 字体等）
│   ├── guide/                # 起步：安全、环境、只读示例
│   ├── server/               # 服务器：llama.cpp、模型、视觉链路
│   ├── agent/                # 智能体：tools / skills / loop / executor
│   ├── lab/                  # 实验室工作流
│   └── log/                  # 发布区：整理过的日志
└── log/                      # 草稿区：写给自己看的原始记录，不发布
```

`log/` 和 `docs/log/` 的分工见 [`log/README.md`](./log/README.md)。

## 页面上的那几件小东西

| 位置 | 是什么 | 从哪来 |
|---|---|---|
| 标题下方 | 作者、最后更新、字数、预计阅读时间 | `theme/components/PageInfo.vue` + `config.mts` 的 `transformPageData` |
| 正文末尾 | 意见反馈 | `theme/components/FeedbackBox.vue`，入口在 `site.ts` |
| 正文末尾 | 页面历史（Git 提交记录） | `@nolebase/vitepress-plugin-git-changelog` |
| 导航栏右侧 | 阅读增强（布局切换、聚光灯） | `@nolebase/vitepress-plugin-enhanced-readabilities` |

## 部署

推送到 `main` 分支后由 GitHub Actions 自动构建，发布到 GitHub Pages。

第一次要手动做的事：

1. 建好仓库并把这个目录推上去
2. 仓库 Settings → Pages → Source 选 **GitHub Actions**
3. 确认 `docs/.vitepress/site.ts` 里的 `REPO_URL`、`SITE_URL`、`BASE` 和仓库名对得上

> 仓库得是公开的：GitHub Free 只允许从公开仓库发布 Pages。
> 另外 `deploy.yml` 里的 `fetch-depth: 0` 别删，页面历史插件靠它拿完整提交记录。

## 写作约定

日志按「五问」写：它是什么 / 为什么需要它 / 怎么做 / 踩了什么坑 / 还没搞懂什么。
最后一条别省，它是下一篇的入口。模板见 [`docs/log/template.md`](./docs/log/template.md)。
