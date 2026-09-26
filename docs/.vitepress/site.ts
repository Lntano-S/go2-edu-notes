// 站点级常量：改这里就够了
//
// 仓库还没建的话，先把 REPO_URL 换成你打算用的地址。
// 这个值同时喂给：页面历史（跳转到 GitHub）、编辑此页、意见反馈入口。

export const REPO_URL = 'https://github.com/Lntano-S/go2-edu-notes'

// GitHub Pages 的部署路径。
// 仓库名不是 go2-edu-notes 时改这里；用自定义域名则改成 '/'。
export const BASE = '/go2-edu-notes/'

// 意见反馈入口。默认走 GitHub Issues，也可以换成腾讯文档 / 问卷表单的分享链接。
export const FEEDBACK_URL = `${REPO_URL}/issues/new`
