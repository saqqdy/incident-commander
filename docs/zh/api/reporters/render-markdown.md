# renderPostMortemMarkdown()

将 Post-Mortem 报告渲染为 Markdown 字符串。

## 导入

```typescript
import { renderPostMortemMarkdown } from 'incident-commander'
```

## 签名

```typescript
function renderPostMortemMarkdown(report: PostMortemReport): string
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `report` | [`PostMortemReport`](/zh/api/types/postmortem-report) | 要渲染的报告 |

## 返回值

`string` — 完整的 Markdown 文档。

## 示例

```typescript
import {
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

const report = generatePostMortem('API 500 事件', timeline, rca, impact)
const markdown = renderPostMortemMarkdown(report)

// 写入文件
import { writeFileSync } from 'node:fs'
writeFileSync('postmortem.md', markdown)
```

## 输出章节

渲染的 Markdown 包含以下章节：

1. **标题** — `# Incident Post-Mortem: {title}`
2. **摘要** — 严重等级、持续时间、时间范围、影响
3. **时间线** — Markdown 表格，包含时间、事件、来源
4. **根因分析** — 因果链、直接原因、促发因素、根本原因、置信度、备择假设
5. **影响** — 受影响用户数、严重度评分、受影响功能、数据影响
6. **修复** — 缓解措施和根本修复
7. **预防** — 短期和长期预防措施
8. **行动项** — 表格，包含行动、负责人、截止日期、优先级
