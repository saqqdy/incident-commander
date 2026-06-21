# buildTimeline()

将多个数据源的原始事件合并为统一、有序、去重的时间线。

## 导入

```typescript
import { buildTimeline } from 'incident-commander'
```

## 签名

```typescript
function buildTimeline(
  events: TimelineEvent[],
  options?: TimelineBuilderOptions
): TimelineResult
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `events` | `TimelineEvent[]` | 采集器返回的原始事件 |
| `options` | `TimelineBuilderOptions` | 构建选项（可选） |

### TimelineBuilderOptions

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `dedupWindowMs` | `number` | `5000` | 去重时间窗口（毫秒） |

## 返回值

[`TimelineResult`](/zh/api/types/timeline-result)

## 示例

```typescript
const timeline = buildTimeline(events, { dedupWindowMs: 5000 })

console.log(`${timeline.totalCount} 个事件`)
console.log(`关键转折点: ${timeline.turningPoints.map(e => e.title).join(', ')}`)
```
