# buildTimeline()

Merge raw events from multiple sources into a unified, ordered, deduplicated timeline.

## Import

```typescript
import { buildTimeline } from 'incident-commander'
```

## Signature

```typescript
function buildTimeline(
  events: TimelineEvent[],
  options?: TimelineBuilderOptions
): TimelineResult
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `events` | `TimelineEvent[]` | Raw events from collectors |
| `options` | `TimelineBuilderOptions` | Build options (optional) |

### TimelineBuilderOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dedupWindowMs` | `number` | `5000` | Deduplication time window in milliseconds |

## Returns

[`TimelineResult`](/api/types/timeline-result) — containing sorted events, statistics, time range, and turning points.

## Pipeline

```text
1. Sort by timestamp (ascending)
2. Deduplicate (cross-source, time-windowed)
3. Compute statistics (by event type)
4. Identify turning points (first error, rollback, etc.)
```

## Examples

### Basic Usage

```typescript
import { buildTimeline } from 'incident-commander'

const timeline = buildTimeline(events)

console.log(`${timeline.totalCount} events`)
console.log(`Time range: ${timeline.timeRange.start} – ${timeline.timeRange.end}`)
```

### Custom Dedup Window

```typescript
// Tighter dedup — keep more events
const timeline = buildTimeline(events, { dedupWindowMs: 1000 })

// Looser dedup — merge more aggressively
const timeline = buildTimeline(events, { dedupWindowMs: 30000 })
```

### Inspecting Turning Points

```typescript
const timeline = buildTimeline(events)

for (const point of timeline.turningPoints) {
  console.log(`${point.type}: ${point.title} at ${point.timestamp}`)
}
```

### Event Statistics

```typescript
const timeline = buildTimeline(events)

for (const [type, count] of Object.entries(timeline.statistics)) {
  console.log(`${type}: ${count} events`)
}
// Output:
// code_change: 8
// deploy: 3
// error: 4
```
