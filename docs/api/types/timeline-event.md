# TimelineEvent

A single event in the incident timeline.

## Definition

```typescript
interface TimelineEvent {
  /** ISO 8601 timestamp */
  timestamp: string
  /** Event title */
  title: string
  /** Event description */
  description: string
  /** Event type */
  type: EventType
  /** Data source */
  source: DataSource
  /** Raw data (optional, for debugging) */
  raw?: unknown
}
```

## EventType

```typescript
type EventType =
  | 'deploy'
  | 'error'
  | 'alert'
  | 'code_change'
  | 'config_change'
  | 'recovery'
  | 'rollback'
  | 'metric_anomaly'
  | 'log_anomaly'
  | 'communication'
  | 'other'
```

## DataSource

```typescript
type DataSource = 'github' | 'sentry' | 'grafana' | 'kibana' | 'deploy' | 'manual'
```

## Emoji Badges

| EventType | Badge |
|-----------|-------|
| `deploy` | 🚀 |
| `error` | 🔴 |
| `alert` | ⚠️ |
| `code_change` | 📝 |
| `config_change` | ⚙️ |
| `recovery` | ✅ |
| `rollback` | ⏪ |
| `metric_anomaly` | 📊 |
| `log_anomaly` | 📋 |
| `communication` | 💬 |
| `other` | ❓ |
