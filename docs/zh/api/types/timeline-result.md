# TimelineResult

`buildTimeline()` 的返回结果。

## 定义

```typescript
interface TimelineResult {
  /** 所有事件（已排序、已去重） */
  events: TimelineEvent[]
  /** 事件总数 */
  totalCount: number
  /** 时间范围 */
  timeRange: {
    start: string
    end: string
  }
  /** 按事件类型的统计 */
  statistics: Record<EventType, number>
  /** 关键转折点 */
  turningPoints: TimelineEvent[]
}
```

## 示例

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
    // ... 其他类型默认为 0
  },
  turningPoints: [...],
}
```
