# RCAResult

Root cause analysis result.

## Definition

```typescript
interface RCAResult {
  /** Causal chain */
  causalChain: CausalityNode[]
  /** Direct cause */
  directCause: string
  /** Contributing factors */
  contributingFactors: string[]
  /** Root cause */
  rootCause: string
  /** Overall confidence */
  confidence: Confidence
  /** Confidence reasoning */
  confidenceReason: string
  /** Alternative hypotheses */
  alternativeHypotheses: string[]
}
```

## CausalityNode

```typescript
interface CausalityNode {
  /** Event */
  event: TimelineEvent
  /** Role in the causal chain */
  role: 'trigger' | 'propagation' | 'symptom' | 'mitigation'
  /** Causal relationship to the next node */
  causation?: string
}
```

## Confidence

```typescript
type Confidence = 'high' | 'medium' | 'low'
```

| Level | Badge | Typical Evidence |
|-------|-------|------------------|
| `high` | 🟢 | Close temporal proximity + clear mechanism + recovery confirms |
| `medium` | 🟡 | Temporal correlation exists but mechanism is inferred |
| `low` | 🔴 | Multiple possible causes, insufficient data |
