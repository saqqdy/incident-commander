# Timeline Construction Instructions

## Goal

Merge raw events collected from multiple sources into a unified, ordered, deduplicated timeline.

## Construction Steps

### 1. Time normalization

- Convert all timestamps to ISO 8601 format
- Preserve original timezone info (if available)
- Flag clock skew risk (cross-source times may not be synchronized)

### 2. Sorting

Sort by `timestamp` in ascending order.

### 3. Deduplication

Conditions for identifying the same event:
- Timestamp difference < 5 seconds **and**
- Title similarity > 80% **and**
- Different sources (never deduplicate within the same source)

Deduplication strategy: Keep the one with the most information (longest description), mark the other as duplicate.

### 4. Event type statistics

Count the number of events per EventType.

### 5. Key turning point identification

Identify the following patterns as turning points:
- First error event
- First alert event
- Error within 5 minutes of a deploy
- First recovery event
- Rollback events

## Output Format

Display the timeline as a Markdown table:

```markdown
## Incident Timeline

| Time (UTC) | Event | Source |
|-----------|-------|--------|
| 2026-06-20 10:02 | 🚀 Deploy: production ✅ | GitHub |
| 2026-06-20 10:05 | 🔴 Error rate spike on /api/users | Sentry |
| 2026-06-20 10:08 | ⚠️ Alert: P95 latency > 2s | Grafana |
| 2026-06-20 10:30 | ⏪ Rollback to v2.3.1 | GitHub |
| 2026-06-20 10:35 | ✅ Error rate recovered | Sentry |
```

Also output statistics and a list of turning points.
