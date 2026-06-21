# generatePostMortem()

Generate a complete Post-Mortem report object from timeline, RCA, and impact data.

## Import

```typescript
import { generatePostMortem } from 'incident-commander'
```

## Signature

```typescript
function generatePostMortem(
  title: string,
  timeline: TimelineResult,
  rca: RCAResult,
  impact: ImpactResult,
  options?: PostMortemOptions
): PostMortemReport
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `title` | `string` | Incident title |
| `timeline` | [`TimelineResult`](/api/types/timeline-result) | Built timeline |
| `rca` | [`RCAResult`](/api/types/rca-result) | Root cause analysis |
| `impact` | [`ImpactResult`](/api/types/impact-result) | Impact assessment |
| `options` | `PostMortemOptions` | Generation options (optional) |

### PostMortemOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `includeRawData` | `boolean` | `false` | Include raw data section for debugging |

## Returns

[`PostMortemReport`](/api/types/postmortem-report) — complete report object.

## Examples

```typescript
import { generatePostMortem } from 'incident-commander'

const report = generatePostMortem(
  'API 500 Incident',
  timeline,
  rca,
  impact
)

console.log(report.severity)   // 'SEV2'
console.log(report.durationMinutes) // 35
```

### With Raw Data

```typescript
const report = generatePostMortem(title, timeline, rca, impact, {
  includeRawData: true,
})
```
