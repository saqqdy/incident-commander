# ImpactResult

影响评估结果。

## 定义

```typescript
interface ImpactResult {
  /** 预估受影响用户数 */
  affectedUsers: number | null
  /** 用户数量说明 */
  affectedUsersNote: string
  /** 服务降级评分（0-100） */
  severityScore: number
  /** 受影响的功能 */
  affectedFeatures: string[]
  /** 数据影响 */
  dataImpact: 'none' | 'partial' | 'loss' | 'inconsistency' | 'unknown'
  /** 数据影响描述 */
  dataImpactNote: string
}
```

## 数据影响值

| 值 | 含义 |
|----|------|
| `none` | 无数据影响 |
| `partial` | 部分数据不可用 |
| `loss` | 发生数据丢失 |
| `inconsistency` | 检测到数据不一致 |
| `unknown` | 无法确定数据影响 |

## 示例

```typescript
const impact: ImpactResult = {
  affectedUsers: 5000,
  affectedUsersNote: '预估来源于错误率 × 日活跃用户数',
  severityScore: 75,
  affectedFeatures: ['用户资料查询', '用户列表'],
  dataImpact: 'partial',
  dataImpactNote: '部分请求期间用户数据无法写入',
}
```
