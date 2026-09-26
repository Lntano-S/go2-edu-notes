# 认证

## 它是什么

推代码时，GitHub 得先确认"你是谁"。认证就是回答这个问题：本地凭什么身份，把提交送上去。

仓库可以被陌生人只读，但推送一定需要身份。身份有两套走法。

## 两条路

| 方式 | 凭什么 | 特点 |
|---|---|---|
| HTTPS | 用户名 + token | 好配、好退，凭证能缓存在本机 |
| SSH | 一对密钥，公钥交给 GitHub | 首次略麻烦，之后免输 |

HTTPS 这条路上，密码早就不顶用了。GitHub 停掉了密码推送，替代品是 **Personal Access Token（PAT）**：一串能设权限、能设有效期的字符串，作用等同于密码，但可以单独吊销。

## 最省事的一条：gh CLI

装了 `gh` 的话，登录一次，git 的凭证顺手也配好了：

```bash
gh auth login
```

一路选：GitHub.com → HTTPS → 浏览器授权。中间有一问"是否用它认证 git"，选 **Yes**。完事 `gh auth status` 能看到已登录的账号，之后 `git push` 不用再输什么。

## 代理

直连 GitHub 常常超时，得走代理。典型症状长这样：

```text
Failed to connect to 127.0.0.1 port 10808: 连接被拒绝
```

`127.0.0.1:10808` 是本地代理软件的端口。报这条，多半不是 git 出问题，是**代理没开**（或端口对不上）。先把代理拉起来再试。

给 git 单独挂代理：

```bash
git config --global http.proxy http://127.0.0.1:10808   # 全部走代理
git config --global --unset http.proxy                   # 撤掉
```

只想让 GitHub 走、别的仓库不绕，按域名配：

```bash
git config --global http.https://github.com.proxy http://127.0.0.1:10808
```

`gh` 认的是环境变量，不读 git 的配置：

```bash
export HTTPS_PROXY=http://127.0.0.1:10808
```

SSH 走代理要写跳板命令，比 HTTPS 麻烦，所以挂着代理的环境里，HTTPS 更省心。

## 常见坑

- **Password authentication is not supported**。你在用密码推，换成 token 或 `gh auth login`。
- **Connection refused，127.0.0.1:端口**。代理没开，或端口和软件里配的不一致。
- **Permission denied (publickey)**。SSH 这条路上没把自己的公钥加到 GitHub 的 Settings → SSH keys。
- **token 权限不够**。PAT 得勾上 `repo`；细粒度 token 要指名这个仓库的写权限。
- **换了机器或换了代理端口**。凭证和代理都是本机的配置，换环境要重配一遍。

## 还没搞懂什么

（留白，等你亲手用出疑问再填。这一条是下次的入口。）
