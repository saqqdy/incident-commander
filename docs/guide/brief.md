# Incident Brief

The incident brief is a concise, stakeholder-friendly format that summarizes the key facts of an incident.

## Usage

```text
/incident brief
```

## Output

```text
🔔 Incident Brief
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Title:    user-service API Breaking Change
  Severity: SEV2
  Duration: 35 minutes
  Impact:   ~5000 users affected
  Status:   ✅ Resolved
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  What happened:
    A deploy (v2.5.0) removed the /api/users endpoint,
    causing 500 errors for downstream consumers.

  What we did:
    Rolled back production to v2.4.0 at 10:30 UTC.
    Errors recovered by 10:35 UTC.

  Next steps:
    - Add consumer contract tests (P1)
    - Implement canary deployment (P1)
```

## When to Use

| Situation | Use |
|-----------|-----|
| Executive update | Brief |
| Slack/Teams notification | Brief |
| Full retrospective | Post-Mortem |
| Technical deep-dive | Post-Mortem + RCA |

## Programmatic Usage

```typescript
import { renderPostMortemMarkdown } from 'incident-commander'

// The brief is a condensed version of the Post-Mortem
// Generate it from the same data
const report = generatePostMortem(title, timeline, rca, impact)

// Extract just the summary section for a brief
const brief = {
  title: report.title,
  severity: report.severity,
  duration: formatDuration(report.durationMinutes),
  impact: report.impactSummary,
  status: 'Resolved',
}
```

## Template

The brief template is at `templates/incident-brief.md` and can be customized.
