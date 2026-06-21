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

[`TimelineResult`](/zh/api/types/timeline-result) — 包含已排序的事件、统计数据、时间范围和转折点。

## 构建流水线

```text
1. 按时间戳排序（升序）
2. 去重（跨数据源，时间窗口去重）
3. 计算统计信息（按事件类型）
4. 识别转折点（首个错误、回滚等）
```

## 示例

### 基本用法

```typescript
import { buildTimeline } from 'incident-commander'

const timeline = buildTimeline(events)

console.log(`${timeline.totalCount} 个事件`)
console.log(`时间范围: ${timeline.timeRange.start} – ${timeline.timeRange.end}`)
```

### 自定义去重窗口

```typescript
// 更严格的去重 — 保留更多事件
const timeline = buildTimeline(events, { dedupWindowMs: 1000 })

// 更宽松的去重 — 更积极地合并
const timeline = buildTimeline(events, { dedupWindowMs: 30000 })
```

### 检查转折点

```typescript
const timeline = buildTimeline(events)

for (const point of timeline.turningPoints) {
  console.log(`${point.type}: ${point.title} 时间 ${point.timestamp}`)
}
```

### 事件统计

```typescript
const timeline = buildTimeline(events)

for (const [type, count] of Object.entries(timeline.statistics)) {
  console.log(`${type}: ${count} 个事件`)
}
// 输出:
// code_change: 8
// deploy: 3
// error: 4
```
