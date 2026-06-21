# TimelineResult

Result returned by `buildTimeline()`.

## Definition

```typescript
interface TimelineResult {
  /** All events (sorted and deduplicated) */
  events: TimelineEvent[]
  /** Total event count */
  totalCount: number
  /** Time range */
  timeRange: {
    start: string
    end: string
  }
  /** Statistics by event type */
  statistics: Record<EventType, number>
  /** Key turning points */
  turningPoints: TimelineEvent[]
}
```

## Example

```typescript
const result: TimelineResult = {
  events: [...],
  totalCount: 18,
  timeRange: {
    start: '2026-06-20T10:00:00Z',
    end: '2026-06-20T10:38:00Z',
  },
  statistics: {
    code_change: 8,
    deploy: 3,
    error: 4,
    alert: 1,
    rollback: 1,
    recovery: 1,
    // ... other types default to 0
  },
  turningPoints: [...],
}
```
