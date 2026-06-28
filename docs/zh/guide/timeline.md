# 时间线构建

采集完成后，Incident Commander 将多源事件合并为统一、有序、去重的时间线。

## 处理流程

```text
来自多个采集器的原始事件
       │
       ├─▶ 1. 按时间戳排序（升序）
       ├─▶ 2. 去重（跨数据源，基于时间窗口）
       ├─▶ 3. 计算统计（按事件类型）
       ├─▶ 4. 识别关键转折点
       │
       └─▶ TimelineResult
```

## 去重策略

当同一个事件从不同数据源出现时（例如一次部署同时出现在 GitHub 提交和工作流运行中），Incident Commander 保留信息最丰富的版本。

**去重键：** 相同标题（不区分大小写）+ 相同 5 秒时间桶 = 重复

```typescript
// 同一时间窗口内两个相同标题的事件
// → 保留描述更长的那个
{ title: 'Deploy: production', description: 'short', source: 'github' }
{ title: 'Deploy: production', description: 'detailed info...', source: 'github' }
// → 结果：保留第二个
```

## 关键转折点

Incident Commander 自动识别故障中的关键时刻：

| 模式 | 检测规则 |
|------|----------|
| **首次错误** | 第一个 `type: 'error'` 的事件 |
| **首次告警** | 第一个 `type: 'alert'` 的事件 |
| **部署后错误** | 部署后 5 分钟内的错误 |
| **首次恢复** | 第一个 `type: 'recovery'` 的事件 |
| **回滚** | 任何 `type: 'rollback'` 的事件 |

## 时间线结果

`buildTimeline()` 函数返回：

```typescript
interface TimelineResult {
  events: TimelineEvent[]                    // 所有事件（已排序、已去重）
  totalCount: number                         // 事件总数
  timeRange: { start: string; end: string }  // 时间范围
  statistics: Record<EventType, number>      // 按类型统计
  turningPoints: TimelineEvent[]             // 关键时刻
}
```

## 使用方式

```typescript
import { buildTimeline } from 'incident-commander'

const timeline = buildTimeline(events, {
  dedupWindowMs: 5000,  // 5 秒去重窗口（默认值）
})

console.log(`时间线: ${timeline.totalCount} 个事件`)
console.log(`关键转折点: ${timeline.turningPoints.length}`)
console.log(`统计:`)
for (const [type, count] of Object.entries(timeline.statistics)) {
  console.log(`  ${type}: ${count}`)
}
```

## 自定义去重窗口

调整去重敏感度：

```typescript
// 更严格的去重（1 秒）— 事件更多，合并更少
const timeline = buildTimeline(events, { dedupWindowMs: 1000 })

// 更宽松的去重（30 秒）— 事件更少，合并更多
const timeline = buildTimeline(events, { dedupWindowMs: 30000 })
```

## 输出示例

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

## 下一步

- [根因分析](/zh/guide/rca) — 如何构建因果链
- [API: buildTimeline()](/zh/api/analyzers/timeline) — 完整 API 参考
