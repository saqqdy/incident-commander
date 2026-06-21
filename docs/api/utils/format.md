# Format Utilities

Formatting helper functions for events and timestamps.

## toISO()

Convert any timestamp to ISO 8601 string.

```typescript
function toISO(timestamp: string | number | Date): string
```

**Examples:**

```typescript
toISO('2026-06-20T10:00:00Z')     // '2026-06-20T10:00:00.000Z'
toISO(1718868000000)               // '2026-06-20T10:00:00.000Z'
toISO(new Date('2026-06-20'))     // '2026-06-20T00:00:00.000Z'
```

## formatDuration()

Format minutes as human-readable duration.

```typescript
function formatDuration(minutes: number): string
```

**Examples:**

```typescript
formatDuration(0.5)    // '30s'
formatDuration(5)      // '5min'
formatDuration(90)     // '1h 30min'
formatDuration(120)    // '2h'
```

## eventToMarkdownRow()

Format a timeline event as a Markdown table row.

```typescript
function eventToMarkdownRow(event: TimelineEvent): string
```

**Example:**

```typescript
eventToMarkdownRow({
  timestamp: '2026-06-20T10:05:00Z',
  title: 'Error spike',
  type: 'error',
  source: 'sentry',
})
// | 2026-06-20 10:05:00 UTC | 🔴 Error spike | Sentry |
```

## eventTypeBadge()

Get emoji badge for event type.

```typescript
function eventTypeBadge(type: EventType): string
```

**Example:**

```typescript
eventTypeBadge('error')    // '🔴'
eventTypeBadge('deploy')   // '🚀'
eventTypeBadge('other')    // '❓'
```

## sourceLabel()

Get human-readable label for data source.

```typescript
function sourceLabel(source: DataSource): string
```

**Example:**

```typescript
sourceLabel('github')   // 'GitHub'
sourceLabel('sentry')   // 'Sentry'
sourceLabel('manual')   // 'Manual'
```
