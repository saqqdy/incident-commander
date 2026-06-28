# 根因分析

Incident Commander 不仅按时间排列事件，还使用 AI 语义交叉验证来推理因果关系。

## 因果推理 vs 时间排序

```text
❌ 简单做法：
  "事件 B 在事件 A 之后发生，所以 A 导致了 B"
  → 经常出错！相关性 ≠ 因果性。

✅ Incident Commander：
  "事件 A（部署）移除了一个 API 端点。
   事件 B（错误飙升）显示该端点返回 500。
   事件 C（回滚）恢复了端点。
   事件 D（恢复）确认了修复。
   → 因果链: A → B → C → D，置信度: 高"
```

## 因果链

RCA 结果包含结构化的因果链：

```typescript
interface CausalityNode {
  event: TimelineEvent
  role: 'trigger' | 'propagation' | 'symptom' | 'mitigation'
  causation?: string  // 此节点与下一节点的关系
}
```

每个节点都有一个 **角色**，说明其在因果链中的位置：

| 角色 | 含义 | 示例 |
|------|------|------|
| `trigger` | 引发故障的事件 | 包含破坏性变更的部署 |
| `propagation` | 故障如何扩散 | 重试风暴级联到其他服务 |
| `symptom` | 故障的可观察影响 | 错误飙升、延迟增加 |
| `mitigation` | 减轻或修复问题的操作 | 回滚、配置变更 |

## 置信度

每个结论都标注了置信度级别：

| 级别 | 含义 | 典型证据 |
|------|------|----------|
| 🟢 **高** | 强因果证据 | 接近的时间邻近性 + 明确的机制 + 恢复确认 |
| 🟡 **中** | 合理但不完整 | 存在时间相关性但机制是推断的 |
| 🔴 **低** | 推测性 | 多种可能原因，数据不足 |

### 示例

```text
Confidence: 🟢 High
Reasoning: Deploy and error times closely match (3-min delay),
           immediate recovery after rollback confirms causation,
           causal chain is complete and unbroken.
```

## 替代假设

Incident Commander 始终提供至少一个替代解释：

```text
Primary hypothesis: Deploy v2.5.0 broke the /api/users endpoint
Alternative hypothesis: Another service may have deployed an
  incompatible change at the same time (low probability,
  insufficient data to verify)
```

这确保分析人员考虑其他可能性，而非只关注最明显的那个。

## RCA 输出示例

```text
🧠 Root Cause Analysis

Causal Chain:
1. 📝 Deploy v2.5.0 (10:02) [trigger]
   → v2 API includes Breaking Change, removing legacy /api/users endpoint
2. 🔴 Error spike (10:05) [symptom]
   → Downstream services calling the old endpoint received 500 errors
3. ⚠️ Latency > 2s (10:08) [propagation]
   → Retry storm caused service overload
4. ⏪ Rollback (10:30) [mitigation]
   → Old endpoint restored after rollback
5. ✅ Recovered (10:35) [symptom]
   → Rollback confirmed effective

Direct Cause: v2 API removed the /api/users endpoint without syncing downstream consumers

Contributing Factors:
- Missing consumer contract tests
- No canary deployment
- 3-minute alerting delay

Root Cause: Lack of API contract validation and canary deployment mechanisms

Confidence: 🟢 High
Reasoning: Deploy and error times closely match, immediate recovery after rollback, causal chain complete

Alternative Hypotheses:
- Another service may have deployed an incompatible change (low probability)
- DNS switchover could have caused brief routing anomalies (unlikely given recovery pattern)
```

## 下一步

- [Post-Mortem 生成](/zh/guide/postmortem) — RCA 如何汇入最终报告
- [API: RCAResult](/zh/api/types/rca-result) — 类型参考
