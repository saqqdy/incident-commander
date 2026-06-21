# TimelineEvent

事件时间线中的单个事件。

## 定义

```typescript
interface TimelineEvent {
  /** ISO 8601 时间戳 */
  timestamp: string
  /** 事件标题 */
  title: string
  /** 事件描述 */
  description: string
  /** 事件类型 */
  type: EventType
  /** 数据源 */
  source: DataSource
  /** 原始数据（可选，用于调试） */
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

## Emoji 标识

| EventType | 标识 |
|-----------|------|
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
