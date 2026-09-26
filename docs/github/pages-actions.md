# 部署

## 它是什么

GitHub Pages 是 GitHub 附送的静态站托管。把一堆 HTML、CSS、JS 放上去，它就给你一个公开地址。VitePress 构建出来的 `dist/` 正好是一堆静态文件，天生适合。

## 两种发布方式

GitHub 的 Pages 有两个 Source 可选：

| Source | 做法 | 什么时候用 |
|---|---|---|
| Deploy from a branch | 直接拿仓库某个分支/目录当网站 | 手写的纯 HTML，没有构建步骤 |
| **GitHub Actions** | 由 workflow 构建后再发布 | 有构建步骤（VitePress、React 都算） |

VitePress 必须选后者：源文件是 markdown，得先跑 `vitepress build` 生成 HTML，Pages 直接发布源码是没用的。

## 必做的一步

仓库建好、代码推上去之后，去 **Settings → Pages → Source 选 `GitHub Actions`**。

不点这一下，workflow 里的部署步骤会失败，代码推了也不出站点。这是整条链路里最容易漏的一格。

## workflow 长什么样

部署配置在 `.github/workflows/deploy.yml`，结构分四层：

```yaml
on:
  push:
    branches: [main]      # 什么时候触发
permissions:
  contents: read          # token 有哪些权限
  pages: write
  id-token: write
jobs:
  build:                  # 先构建
    steps: [checkout → setup-node → npm ci → build → upload artifact]
  deploy:                 # 再发布
    needs: build
    steps: [deploy-pages]
```

`build` 和 `deploy` 是两个 job。`deploy` 里写了 `needs: build`，所以它一定等构建成功才跑。构建产物用 `upload-pages-artifact` 上传，发布用 `deploy-pages` 取出并上线。

## 权限

`permissions` 决定这个 workflow 手里的 token 能干什么：

| 权限 | 为什么需要 |
|---|---|
| `contents: read` | 读仓库代码（构建要 checkout） |
| `pages: write` | 创建 Pages 部署 |
| `id-token: write` | 申请 OIDC token，给部署做身份验证 |

这体现的是最小权限：只给它够用的。

一个容易绕晕的点：**仓库 Settings → Actions 里的默认权限，只对"没写 `permissions` 的 workflow"生效**。只要 workflow 自己声明了 `permissions`，就以它为准。所以仓库层保持"只读"是安全的，不用为了部署去放开。

## 常见失败

| 现象 | 原因 |
|---|---|
| 推了但没有站点 | Settings → Pages 的 Source 不是 GitHub Actions |
| 部署那步报 403 / Resource not accessible | token 缺 `pages: write`，或 workflow 的 `permissions` 被删了 |
| 页面能开，样式字体全 404 | `BASE` 和仓库名不一致 |
| 页面历史插件是空的 | `fetch-depth: 0` 被删了，浅克隆拿不到完整提交 |
| 首次部署卡住不动 | `github-pages` 环境需要人工批准一次（Settings → Environments） |

## 还没搞懂什么

（留白，等你亲手用出疑问再填。这一条是下次的入口。）
