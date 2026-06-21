# renderPostMortemMarkdown()

Render a Post-Mortem report as a Markdown string.

## Import

```typescript
import { renderPostMortemMarkdown } from 'incident-commander'
```

## Signature

```typescript
function renderPostMortemMarkdown(report: PostMortemReport): string
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `report` | [`PostMortemReport`](/api/types/postmortem-report) | The report to render |

## Returns

`string` — Complete Markdown document.

## Examples

```typescript
import {
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

const report = generatePostMortem('API 500 Incident', timeline, rca, impact)
const markdown = renderPostMortemMarkdown(report)

// Write to file
import { writeFileSync } from 'node:fs'
writeFileSync('postmortem.md', markdown)
```

## Output Sections

The rendered Markdown includes:

1. **Title** — `# Incident Post-Mortem: {title}`
2. **Summary** — Severity, duration, time range, impact
3. **Timeline** — Markdown table with time, event, source
4. **Root Cause Analysis** — Causal chain, direct cause, contributing factors, root cause, confidence, alternatives
5. **Impact** — Affected users, severity score, affected features, data impact
6. **Fixes** — Mitigations and root fix
7. **Prevention** — Short-term and long-term
8. **Action Items** — Table with action, owner, deadline, priority
