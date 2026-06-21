# PostMortemReport

Complete Post-Mortem report object.

## Definition

```typescript
interface PostMortemReport {
  /** Incident title */
  title: string
  /** Severity level */
  severity: SeverityLevel
  /** Time range */
  timeRange: {
    start: string
    end: string
  }
  /** Duration in minutes */
  durationMinutes: number
  /** Impact summary */
  impactSummary: string
  /** Timeline */
  timeline: TimelineResult
  /** Root cause analysis */
  rca: RCAResult
  /** Impact assessment */
  impact: ImpactResult
  /** Mitigations applied */
  mitigations: string[]
  /** Root fixes */
  fixes: string[]
  /** Verification methods */
  verifications: string[]
  /** Short-term preventions */
  shortTermPreventions: string[]
  /** Long-term improvements */
  longTermImprovements: string[]
  /** Action items */
  actionItems: ActionItem[]
}
```

## SeverityLevel

```typescript
type SeverityLevel = 'SEV1' | 'SEV2' | 'SEV3'
```

| Level | Impact Score | Description |
|-------|-------------|-------------|
| `SEV1` | ≥ 80 | Critical — full outage or data loss |
| `SEV2` | ≥ 40 | Major — significant degradation |
| `SEV3` | < 40 | Minor — limited impact |

## ActionItem

```typescript
interface ActionItem {
  /** Action description */
  action: string
  /** Owner */
  owner: string
  /** Deadline */
  deadline: string
  /** Priority */
  priority: 'P0' | 'P1' | 'P2'
}
```
