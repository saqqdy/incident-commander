# Root Cause Analysis

Incident Commander doesn't just order events temporally — it reasons about causal relationships using AI semantic cross-referencing.

## Causal Reasoning vs Time Ordering

```text
❌ Naive approach:
  "Event B happened after Event A, so A caused B"
  → Often wrong! Correlation ≠ causation.

✅ Incident Commander:
  "Event A (deploy) removed an API endpoint.
   Event B (error spike) shows 500s on that exact endpoint.
   Event C (rollback) restored the endpoint.
   Event D (recovery) confirmed the fix.
   → Causal chain: A → B → C → D, Confidence: High"
```

## Causal Chain

The RCA result includes a structured causal chain:

```typescript
interface CausalityNode {
  event: TimelineEvent
  role: 'trigger' | 'propagation' | 'symptom' | 'mitigation'
  causation?: string  // How this node relates to the next
}
```

Each node has a **role** explaining its position in the causal chain:

| Role | Meaning | Example |
|------|---------|---------|
| `trigger` | The event that started the incident | Deploy containing breaking change |
| `propagation` | How the failure spread | Retry storm cascading to other services |
| `symptom` | Observable effect of the failure | Error spike, latency increase |
| `mitigation` | Action that reduced or fixed the issue | Rollback, config change |

## Confidence Levels

Every conclusion is labeled with a confidence level:

| Level | Meaning | Typical Evidence |
|-------|---------|------------------|
| 🟢 **High** | Strong causal evidence | Close temporal proximity + clear mechanism + recovery confirms |
| 🟡 **Medium** | Plausible but incomplete | Temporal correlation exists but mechanism is inferred |
| 🔴 **Low** | Speculative | Multiple possible causes, insufficient data |

### Example

```text
Confidence: 🟢 High
Reasoning: Deploy and error times closely match (3-min delay),
           immediate recovery after rollback confirms causation,
           causal chain is complete and unbroken.
```

## Alternative Hypotheses

Incident Commander always provides at least one alternative explanation:

```text
Primary hypothesis: Deploy v2.5.0 broke the /api/users endpoint
Alternative hypothesis: Another service may have deployed an
  incompatible change at the same time (low probability,
  insufficient data to verify)
```

This ensures analysts consider other possibilities, not just the most obvious one.

## Example RCA Output

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

## Next Steps

- [Post-Mortem Generation](/guide/postmortem) — How RCA feeds into the final report
- [API: RCAResult](/api/types/rca-result) — Type reference
