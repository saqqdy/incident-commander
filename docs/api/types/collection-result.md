# CollectionResult

Result returned by a collector after data collection.

## Definition

```typescript
interface CollectionResult<T = unknown> {
  /** Data source */
  source: DataSource
  /** Whether collection succeeded */
  success: boolean
  /** Collected events */
  events: TimelineEvent[]
  /** Collection duration in milliseconds */
  duration: number
  /** Error message (when collection fails) */
  error?: string
  /** Raw response data */
  rawData?: T
}
```

## Example

```typescript
const result: CollectionResult = {
  source: 'github',
  success: true,
  events: [...],
  duration: 1200,
}
```

A failed collection:

```typescript
const result: CollectionResult = {
  source: 'sentry',
  success: false,
  events: [],
  duration: 100,
  error: 'Authentication failed: invalid token',
}
```
