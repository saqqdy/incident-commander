# Post-Mortem Generation

Incident Commander generates a complete, structured Post-Mortem document combining timeline, RCA, and impact data.

## Report Structure

The generated Post-Mortem includes:

| Section | Content |
|---------|---------|
| **Summary** | Severity, duration, start/end time, impact summary |
| **Timeline** | Full event table with types and sources |
| **Root Cause Analysis** | Causal chain, direct cause, contributing factors, root cause, confidence, alternatives |
| **Impact** | Affected users, severity score, affected features, data impact |
| **Fixes** | Mitigations applied, root fix implemented |
| **Prevention** | Short-term preventions, long-term improvements |
| **Action Items** | Each with owner, deadline, priority |

## Usage

### Via Skill Command

```text
/incident postmortem
```

### Programmatically

```typescript
import {
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

// Generate the report object
const report = generatePostMortem(
  'API 500 Incident',
  timeline,
  rca,
  impact
)

// Render as Markdown
const markdown = renderPostMortemMarkdown(report)
console.log(markdown)
```

## Severity Inference

Severity is automatically inferred from the impact score:

| Impact Score | Severity | Description |
|-------------|----------|-------------|
| ≥ 80 | SEV1 | Critical — full outage or data loss |
| ≥ 40 | SEV2 | Major — significant degradation |
| < 40 | SEV3 | Minor — limited impact |

## Sample Output

```markdown
# Incident Post-Mortem: API 500 Incident

## Summary
- **Severity**: SEV2
- **Duration**: 35min
- **Start Time**: 2026-06-20T10:05:00Z
- **End Time**: 2026-06-20T10:38:00Z
- **Impact**: ~5000 users affected, degradation 75/100

## Timeline
| Time (UTC) | Event | Source |
|-----------|-------|--------|
| 10:00 | 📝 alice: feat: update user-service API to v2 | GitHub |
| 10:02 | 🚀 Deploy: production ✅ | GitHub |
| 10:05 | 🔴 Error rate spike on /api/users (500 errors) | Sentry |
| 10:30 | ⏪ Rollback: production to v2.4.0 | GitHub |
| 10:35 | ✅ Error rate recovered | Sentry |

## Root Cause Analysis
...

## Action Items
| Action | Owner | Deadline | Priority |
|--------|-------|----------|----------|
| Add consumer contract tests | [TBD] | [TBD] | P1 |
| Implement canary deployment | [TBD] | [TBD] | P1 |
```

## Including Raw Data

For debugging, you can include raw data in the report:

```typescript
const report = generatePostMortem(title, timeline, rca, impact, {
  includeRawData: true,
})
```

## Customizing the Template

The Markdown template can be customized by modifying `templates/postmortem.md`.

## Next Steps

- [Incident Brief](/guide/brief) — Concise format for stakeholders
- [API: generatePostMortem()](/api/reporters/postmortem) — Full API reference
