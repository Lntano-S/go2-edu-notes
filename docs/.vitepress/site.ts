// 站点级常量：改这里就够了
//
// 仓库还没建的话，先把 REPO_URL / SITE_URL 换成你实际要用的地址。
// 这两个值同时喂给：页面历史、编辑此页、意见反馈、分享卡片。

export const REPO_URL = 'https://github.com/Lntano-S/go2-edu-notes'

// GitHub Pages 的线上地址，注意用户名部分是全小写的。
export const SITE_URL = 'https://lntano-s.github.io/go2-edu-notes/'

// GitHub Pages 的部署路径。
// 仓库名不是 go2-edu-notes 时改这里；用自定义域名则改成 '/'。
export const BASE = '/go2-edu-notes/'

// 意见反馈入口。默认走 GitHub Issues，也可以换成腾讯文档 / 问卷表单的分享链接。
export const FEEDBACK_URL = `${REPO_URL}/issues/new`

// 站点名称（导航、分享卡片、页脚都会用到）
export const SITE_TITLE = 'Go2 EDU 学习笔记'
export const SITE_DESCRIPTION = '宇树 Go2 EDU 二次开发与具身智能体的学习路线记录'
