# generatePostMortem()

从时间线、RCA 和影响数据生成完整的 Post-Mortem 报告对象。

## 导入

```typescript
import { generatePostMortem } from 'incident-commander'
```

## 签名

```typescript
function generatePostMortem(
  title: string,
  timeline: TimelineResult,
  rca: RCAResult,
  impact: ImpactResult,
  options?: PostMortemOptions
): PostMortemReport
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 事件标题 |
| `timeline` | [`TimelineResult`](/zh/api/types/timeline-result) | 已构建的时间线 |
| `rca` | [`RCAResult`](/zh/api/types/rca-result) | 根因分析结果 |
| `impact` | [`ImpactResult`](/zh/api/types/impact-result) | 影响评估结果 |
| `options` | `PostMortemOptions` | 生成选项（可选） |

### PostMortemOptions

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `includeRawData` | `boolean` | `false` | 是否包含原始数据部分用于调试 |

## 返回值

[`PostMortemReport`](/zh/api/types/postmortem-report) — 完整的报告对象。

## 示例

```typescript
import { generatePostMortem } from 'incident-commander'

const report = generatePostMortem(
  'API 500 事件',
  timeline,
  rca,
  impact
)

console.log(report.severity)        // 'SEV2'
console.log(report.durationMinutes) // 35
```

### 包含原始数据

```typescript
const report = generatePostMortem(title, timeline, rca, impact, {
  includeRawData: true,
})
```
