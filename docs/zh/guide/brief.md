# 事故简报

事故简报是一种简洁的、面向利益相关者的格式，总结故障的关键事实。

## 使用方式

```text
/incident brief
```

## 输出示例

```text
🔔 Incident Brief
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Title:    user-service API Breaking Change
  Severity: SEV2
  Duration: 35 minutes
  Impact:   ~5000 users affected
  Status:   ✅ Resolved
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  What happened:
    A deploy (v2.5.0) removed the /api/users endpoint,
    causing 500 errors for downstream consumers.

  What we did:
    Rolled back production to v2.4.0 at 10:30 UTC.
    Errors recovered by 10:35 UTC.

  Next steps:
    - Add consumer contract tests (P1)
    - Implement canary deployment (P1)
```

## 何时使用

| 场景 | 推荐格式 |
|------|----------|
| 高管汇报 | 简报 |
| Slack/Teams 通知 | 简报 |
| 完整复盘 | Post-Mortem |
| 技术深度分析 | Post-Mortem + RCA |

## 编程式调用

```typescript
import { renderPostMortemMarkdown } from 'incident-commander'

// 简报是 Post-Mortem 的精简版本
// 从相同数据生成
const report = generatePostMortem(title, timeline, rca, impact)

// 仅提取摘要部分作为简报
const brief = {
  title: report.title,
  severity: report.severity,
  duration: formatDuration(report.durationMinutes),
  impact: report.impactSummary,
  status: 'Resolved',
}
```

## 模板

简报模板位于 `templates/incident-brief.md`，可进行自定义。
