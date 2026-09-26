// 让 markdown 里的 `- [ ]` / `- [x]` 渲染成 checkbox。
// VitePress 自身不带这个能力（见 vuejs/vitepress#1923），这里补一条小规则。
//
// 它做的事很小：找到「列表项 + 段落 + 以 [ 开头」的行内内容，
// 把开头的 `[ ]` / `[x]` 换成一段 <input>，并给列表项挂上类名。

export function taskList(md: any) {
  const isTodo = (tokens: any[], i: number) =>
    tokens[i]?.type === 'inline' &&
    tokens[i - 1]?.type === 'paragraph_open' &&
    tokens[i - 2]?.type === 'list_item_open' &&
    typeof tokens[i].content === 'string' &&
    tokens[i].content.startsWith('[')

  const setAttr = (token: any, name: string, value: string) => {
    const idx = token.attrIndex(name)
    if (idx < 0) token.attrPush([name, value])
    else token.attrs[idx] = [name, value]
  }

  md.core.ruler.after('inline', 'task_list', (state: any) => {
    const tokens = state.tokens

    for (let i = 2; i < tokens.length; i++) {
      if (!isTodo(tokens, i)) continue

      const token = tokens[i]
      const head = token.children?.[0]
      if (!head) continue

      const checked = /^\[[xX]\]/.test(head.content)
      head.content = head.content.slice(3)

      const box = new state.Token('html_inline', '', 0)
      box.content = `<input class="task-list-item-checkbox" type="checkbox" disabled${
        checked ? ' checked' : ''
      }> `
      token.children.unshift(box)

      setAttr(tokens[i - 2], 'class', 'task-list-item')

      const level = tokens[i - 2].level - 1
      for (let j = i - 3; j >= 0; j--) {
        if (tokens[j].level === level) {
          setAttr(tokens[j], 'class', 'contains-task-list')
          break
        }
      }
    }

    return true
  })
}
