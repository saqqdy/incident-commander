# RCAResult

根因分析结果。

## 定义

```typescript
interface RCAResult {
  /** 因果链 */
  causalChain: CausalityNode[]
  /** 直接原因 */
  directCause: string
  /** 促发因素 */
  contributingFactors: string[]
  /** 根本原因 */
  rootCause: string
  /** 整体置信度 */
  confidence: Confidence
  /** 置信度推理 */
  confidenceReason: string
  /** 备择假设 */
  alternativeHypotheses: string[]
}
```

## CausalityNode

```typescript
interface CausalityNode {
  /** 事件 */
  event: TimelineEvent
  /** 在因果链中的角色 */
  role: 'trigger' | 'propagation' | 'symptom' | 'mitigation'
  /** 与下一个节点的因果关系 */
  causation?: string
}
```

## Confidence

```typescript
type Confidence = 'high' | 'medium' | 'low'
```

| 等级 | 标识 | 典型证据 |
|------|------|---------|
| `high` | 🟢 | 时间接近 + 机制清晰 + 恢复确认 |
| `medium` | 🟡 | 存在时间相关性但机制为推断 |
| `low` | 🔴 | 多种可能原因，数据不足 |
