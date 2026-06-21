# PostMortemReport

完整的 Post-Mortem 报告对象。

## 定义

```typescript
interface PostMortemReport {
  /** 事件标题 */
  title: string
  /** 严重等级 */
  severity: SeverityLevel
  /** 时间范围 */
  timeRange: {
    start: string
    end: string
  }
  /** 持续时间（分钟） */
  durationMinutes: number
  /** 影响概要 */
  impactSummary: string
  /** 时间线 */
  timeline: TimelineResult
  /** 根因分析 */
  rca: RCAResult
  /** 影响评估 */
  impact: ImpactResult
  /** 已采取的缓解措施 */
  mitigations: string[]
  /** 根本修复 */
  fixes: string[]
  /** 验证方法 */
  verifications: string[]
  /** 短期预防措施 */
  shortTermPreventions: string[]
  /** 长期改进 */
  longTermImprovements: string[]
  /** 行动项 */
  actionItems: ActionItem[]
}
```

## SeverityLevel

```typescript
type SeverityLevel = 'SEV1' | 'SEV2' | 'SEV3'
```

| 等级 | 影响评分 | 描述 |
|------|---------|------|
| `SEV1` | ≥ 80 | 严重 — 全面宕机或数据丢失 |
| `SEV2` | ≥ 40 | 重大 — 显著降级 |
| `SEV3` | < 40 | 轻微 — 影响有限 |

## ActionItem

```typescript
interface ActionItem {
  /** 行动描述 */
  action: string
  /** 负责人 */
  owner: string
  /** 截止日期 */
  deadline: string
  /** 优先级 */
  priority: 'P0' | 'P1' | 'P2'
}
```
