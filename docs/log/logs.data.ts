import { createContentLoader } from 'vitepress'

export interface LogEntry {
  date: string
  title: string
  url: string
  excerpt: string
}

declare const data: LogEntry[]
export { data }

// 扫 docs/log 下的日志，按日期倒序。
// 文件名即日期（YYYY-MM-DD，也认老的点号写法），一级标题当标题，正文头一句当摘要。
export default createContentLoader(['log/*.md', '!log/index.md', '!log/template.md'], {
  includeSrc: true,
  transform(raw): LogEntry[] {
    return raw
      .map(({ url, src }) => {
        const source = src ?? ''
        const slug = url.split('/').filter(Boolean).pop() ?? ''
        const heading = source.match(/^#\s+(.+)$/m)
        const plain = source
          .replace(/```[\s\S]*?```/g, ' ')
          .replace(/^\s*\|.*\|\s*$/gm, ' ')
          .replace(/^#.*$/gm, ' ')
          .replace(/[#>*`_\[\]()]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        return {
          date: slug.replace(/\./g, '-'),
          title: heading ? heading[1].trim() : slug,
          url,
          excerpt: plain.slice(0, 72)
        }
      })
      .filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }
})
