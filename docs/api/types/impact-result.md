# ImpactResult

Impact assessment result.

## Definition

```typescript
interface ImpactResult {
  /** Estimated affected users */
  affectedUsers: number | null
  /** User count explanation */
  affectedUsersNote: string
  /** Service degradation score (0-100) */
  severityScore: number
  /** Affected features */
  affectedFeatures: string[]
  /** Data impact */
  dataImpact: 'none' | 'partial' | 'loss' | 'inconsistency' | 'unknown'
  /** Data impact description */
  dataImpactNote: string
}
```

## Data Impact Values

| Value | Meaning |
|-------|---------|
| `none` | No data impact |
| `partial` | Partial data unavailability |
| `loss` | Data loss occurred |
| `inconsistency` | Data inconsistency detected |
| `unknown` | Data impact cannot be determined |

## Example

```typescript
const impact: ImpactResult = {
  affectedUsers: 5000,
  affectedUsersNote: 'Estimated from error rate × daily active users',
  severityScore: 75,
  affectedFeatures: ['user profile queries', 'user listings'],
  dataImpact: 'partial',
  dataImpactNote: 'User data could not be written during some requests',
}
```
