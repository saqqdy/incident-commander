# Timeline Building

After collecting events from multiple sources, Incident Commander merges them into a unified, ordered, deduplicated timeline.

## The Pipeline

```text
Raw events from multiple collectors
       │
       ├─▶ 1. Sort by timestamp (ascending)
       ├─▶ 2. Deduplicate (cross-source, time-windowed)
       ├─▶ 3. Compute statistics (by event type)
       ├─▶ 4. Identify turning points
       │
       └─▶ TimelineResult
```

## Deduplication

When the same event appears from different sources (e.g., a deploy shown in both GitHub commits and GitHub workflow runs), Incident Commander keeps the most informative version.

**Dedup key:** Same title (case-insensitive) + same 5-second time bucket = duplicate

```typescript
// Two events within the same time window with the same title
// → Keep the one with the longer description
{ title: 'Deploy: production', description: 'short', source: 'github' }
{ title: 'Deploy: production', description: 'detailed info...', source: 'github' }
// → Result: keeps the second one
```

## Turning Points

Incident Commander automatically detects key moments in the incident:

| Pattern | Detection Rule |
|---------|---------------|
| **First error** | First event with `type: 'error'` |
| **First alert** | First event with `type: 'alert'` |
| **Post-deploy error** | Error within 5 minutes of a deploy |
| **First recovery** | First event with `type: 'recovery'` |
| **Rollback** | Any event with `type: 'rollback'` |

## Timeline Result

The `buildTimeline()` function returns:

```typescript
interface TimelineResult {
  events: TimelineEvent[]                    // All events (sorted, deduped)
  totalCount: number                         // Total event count
  timeRange: { start: string; end: string }  // Time range
  statistics: Record<EventType, number>      // Count by type
  turningPoints: TimelineEvent[]             // Key moments
}
```

## Usage

```typescript
import { buildTimeline } from 'incident-commander'

const timeline = buildTimeline(events, {
  dedupWindowMs: 5000,  // 5-second dedup window (default)
})

console.log(`Timeline: ${timeline.totalCount} events`)
console.log(`Turning points: ${timeline.turningPoints.length}`)
console.log(`Statistics:`)
for (const [type, count] of Object.entries(timeline.statistics)) {
  console.log(`  ${type}: ${count}`)
}
```

## Custom Dedup Window

Adjust the deduplication sensitivity:

```typescript
// Tighter dedup (1 second) — more events, less merging
const timeline = buildTimeline(events, { dedupWindowMs: 1000 })

// Looser dedup (30 seconds) — fewer events, more merging
const timeline = buildTimeline(events, { dedupWindowMs: 30000 })
```

## Example Output

```text
📊 Timeline built — 18 events (2026-06-20 10:00 – 10:38)

Statistics:
  code_change: 8
  deploy: 3
  error: 4
  alert: 1
  rollback: 1
  recovery: 1

Key Turning Points:
  1. 🔴 First error (10:05) — Error rate spike on /api/users
  2. ⚠️ Post-deploy error (10:05) — Error within 3 min of deploy
  3. ⏪ Rollback (10:30) — production to v2.4.0
  4. ✅ Recovery (10:35) — Error rate recovered
```

## Next Steps

- [Root Cause Analysis](/guide/rca) — How causal chains are built
- [API: buildTimeline()](/api/analyzers/timeline) — Full API reference
