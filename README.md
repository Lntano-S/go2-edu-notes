# Go2 EDU 学习笔记

宇树 Go2 EDU 二次开发与具身智能体的学习路线记录。

在线访问：<https://lntano-s.github.io/go2-edu-notes/>

## 板块速览

| 板块 | 内容 | 在线 |
|---|---|---|
| 起步 | 安全、环境、只读示例 | [起步](https://lntano-s.github.io/go2-edu-notes/guide/) |
| 服务器 | llama.cpp、模型、视觉链路 | [服务器](https://lntano-s.github.io/go2-edu-notes/server/) |
| 智能体 | tools / skills / loop / executor | [智能体](https://lntano-s.github.io/go2-edu-notes/agent/) |
| 实验室 | 仓库规范、协作、踩坑 | [实验室](https://lntano-s.github.io/go2-edu-notes/lab/) |
| Linux | 命令行、文件、权限、进程 | [Linux](https://lntano-s.github.io/go2-edu-notes/linux/) |
| GitHub | 仓库 / 提交 / 部署 / 认证 | [GitHub](https://lntano-s.github.io/go2-edu-notes/github/) |
| 日志 | 按日期记的笔记 | [日志](https://lntano-s.github.io/go2-edu-notes/log/) |

> 上面这些地址指向线上站点，用绝对路径写。README 里的相对链接在 GitHub 上会被解析成仓库文件，点到的是源码而不是网页。

## 网站亮点

| 位置 | 是什么 | 从哪来 |
|---|---|---|
| 首页 | 四张入口卡片，点击直达板块 | `theme/bridge.ts` 绑 `.VPFeatures .item` |
| 标题下方 | 作者、最后更新、字数、预计阅读时间 | `theme/components/PageInfo.vue` + `config.mts` 的 `transformPageData` |
| 正文末尾 | 意见反馈 | `theme/components/FeedbackBox.vue`，入口在 `site.ts` |
| 正文末尾 | 页面历史（Git 提交记录） | `@nolebase/vitepress-plugin-git-changelog` |
| 导航栏右侧 | 阅读增强（布局切换、聚光灯） | `@nolebase/vitepress-plugin-enhanced-readabilities` |
| 大纲 | 点击标题，目标闪烁高亮 | `@nolebase/vitepress-plugin-highlight-targeted-heading` |
| 主题切换 | 圆形扩散动画 | `theme/themeTransition.ts` |
| 搜索 | 中文 2-gram 分词 | `config.mts` |
| 分享 | OG / Twitter 卡片 | `config.mts` 的 `head` |
| 日志页 | 按日期自动罗列 | `docs/log/logs.data.ts` + `config.mts` 的动态侧边栏 |
| 公式 | KaTeX，字体本地不走 CDN | `@mdit/plugin-katex` + `public/katex/` |
| 待办 | `- [ ]` 渲染成复选框 | `.vitepress/taskList.ts` |

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
│   │   ├── taskList.ts       # 把 - [ ] 渲染成复选框
│   │   └── theme/            # 自定义主题
│   │       ├── index.ts      # 主题入口
│   │       ├── bridge.ts     # 往页面插槽里塞组件
│   │       ├── themeTransition.ts
│   │       ├── components/   # PageInfo（字数/阅读时间）、FeedbackBox（反馈）
│   │       └── styles/
│   ├── public/               # 原样拷贝的静态资源（KaTeX 字体等）
│   ├── linux/                # Linux 基础，对齐三级 / 四级考纲
│   ├── github/               # GitHub 笔记：仓库 / 提交 / 部署 / 认证
│   ├── guide/                # 起步：安全、环境、只读示例
│   ├── server/               # 服务器：llama.cpp、模型、视觉链路
│   ├── agent/                # 智能体：tools / skills / loop / executor
│   ├── lab/                  # 实验室工作流
│   └── log/                  # 发布区：愿意公开的日志
└── log/                      # 草稿区：写给自己看的原始记录，不发布
```

`log/` 和 `docs/log/` 的分工见 [`log/README.md`](./log/README.md)。

## 部署

推送到 `main` 后由 GitHub Actions 自动构建，发布到 GitHub Pages。

首次部署要手工确认两处：

1. 仓库 Settings → Pages → Source 选 **GitHub Actions**
2. 确认 `docs/.vitepress/site.ts` 里的 `REPO_URL`、`SITE_URL`、`BASE` 和仓库名对得上

> 仓库得是公开的：GitHub Free 只允许从公开仓库发布 Pages。
> 另外 `deploy.yml` 里的 `fetch-depth: 0` 别删，页面历史插件靠它拿完整提交记录。

## 写作约定

日志按「五问」写：它是什么 / 为什么需要它 / 怎么做 / 踩了什么坑 / 还没搞懂什么。
最后一条别省，它是下一篇的入口。模板见 [`docs/log/template.md`](./docs/log/template.md)。
