# Root Cause Analysis Instructions

## Goal

Reason about the causal relationships of the incident based on the timeline, and output a structured RCA report.

## Analysis Steps

### 1. Identify the trigger event

Look for the earliest possible trigger event from the timeline:
- Most recent deploy / config_change / code_change
- metric_anomaly or error at the start of the time window

### 2. Build the causal chain

Trace the propagation path from the trigger event along the timeline:

```
Trigger event → Propagation event → Symptom event → Mitigation event
```

For each inference step, explain the reasoning basis:
- Temporal sequence
- Semantic association (code change affected the failing functionality)
- Metric correlation (metrics changed immediately after deployment)

### 3. Assess confidence

Label the confidence of the entire causal chain:

| Level | Criteria |
|-------|----------|
| **high** | Clear temporal sequence and semantic association, and mitigation verified the inference |
| **medium** | Temporal sequence and partial association, but lacking direct verification |
| **low** | Only temporal sequence, weak association |

### 4. List alternative hypotheses

Propose at least 1 alternative hypothesis explaining why the current inference might be incorrect:
- Could it be coincidental (unrelated changes within the time window)
- Could there be unobserved factors (impact from other systems)
- Could incomplete data lead to a misjudgment

## Output Format

```markdown
## Root Cause Analysis

### Causal Chain

1. **Trigger** 🚀 10:02 Deploy: production (v2.4.0 → v2.5.0)
   → Includes Breaking Change in user-service
2. **Propagation** 🔴 10:05 Error rate spike on /api/users
   → user-service interface change caused 500 errors in downstream callers
3. **Aggravation** ⚠️ 10:08 P95 latency > 2s
   → Excessive retries caused service overload
4. **Mitigation** ⏪ 10:30 Rollback to v2.3.1
   → Old endpoint restored after rollback
5. **Recovery** ✅ 10:35 Error rate recovered
   → Rollback confirmed effective

### Direct Cause
The v2.5.0 release included a Breaking Change in user-service, causing incompatibility with downstream consumers.

### Contributing Factors
- Missing consumer contract tests
- Deployment without canary release
- 3-minute alerting delay

### Root Cause
Lack of API contract validation and canary deployment mechanisms between microservices.

### Confidence: 🟢 High
Deployment time closely matches error onset (3-min delay), immediate recovery after rollback, causal chain complete.

### Alternative Hypotheses
- Another service may have deployed an incompatible change at the same time (low probability, insufficient data to verify)
- DNS switchover may have caused brief routing anomalies (unlikely, since recovery occurred after rollback)
```
