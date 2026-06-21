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

当同一个事件从不同数据源出现时（例如一次部署同时出现在 GitHub 提交和工作流运行中），保留信息最丰富的版本。

**去重键：** 相同标题（不区分大小写）+ 相同 5 秒时间桶 = 重复

## 关键转折点

Incident Commander 自动识别故障中的关键时刻：

| 模式 | 检测规则 |
|------|----------|
| **首次错误** | 第一个 `type: 'error'` 的事件 |
| **首次告警** | 第一个 `type: 'alert'` 的事件 |
| **部署后错误** | 部署后 5 分钟内的错误 |
| **首次恢复** | 第一个 `type: 'recovery'` 的事件 |
| **回滚** | 任何 `type: 'rollback'` 的事件 |

## 使用方式

```typescript
import { buildTimeline } from 'incident-commander'

const timeline = buildTimeline(events, {
  dedupWindowMs: 5000,  // 5 秒去重窗口（默认值）
})

console.log(`时间线: ${timeline.totalCount} 个事件`)
console.log(`关键转折点: ${timeline.turningPoints.length}`)
```

## 下一步

- [根因分析](/zh/guide/rca) — 如何构建因果链
- [API: buildTimeline()](/zh/api/analyzers/timeline) — 完整 API 参考
