# Quick Start

Walk through your first incident analysis in under 5 minutes.

## Zero-Config Demo

The fastest way to see Incident Commander in action — no setup needed:

```bash
pnpm run demo
```

Or try the interactive [Playground →](/playground)

## Interactive Mode

The simplest way to get started — let Incident Commander guide you step by step:

```text
/incident
```

This launches an interactive walkthrough that asks for:
1. **Time range** — When did the incident happen?
2. **Data sources** — Which platforms to collect from?
3. **Context** — Any known details about the incident?

## One-Command Mode

Already know the time range? Skip the questions:

```text
/incident start 2h
```

This automatically:
1. Collects GitHub events from the last 2 hours
2. Builds a timeline (sorted + deduplicated)
3. Performs root cause analysis
4. Generates a Post-Mortem document

### Custom Time Range

```text
/incident start 2026-06-20T10:00..2026-06-20T12:00
```

## Individual Commands

Run each step separately for more control:

### Generate Timeline Only

```text
/incident timeline
```

Output:

```text
📊 Timeline built — 18 events
| Time (UTC) | Event | Source |
|-----------|-------|--------|
| 10:00 | 📝 alice: feat: update user-service API to v2 | GitHub |
| 10:02 | 🚀 Deploy: production ✅ | GitHub |
| 10:05 | 🔴 Error rate spike on /api/users (500 errors) | Sentry |
| 10:08 | ⚠️ Alert: P95 latency > 2s on user-service | Grafana |
| 10:30 | ⏪ Rollback: production to v2.4.0 | GitHub |
| 10:35 | ✅ Error rate recovered | Sentry |

Key turning points: First error (10:05), Rollback (10:30), Recovery (10:35)
```

### Root Cause Analysis Only

```text
/incident rca
```

Output:

```text
🧠 Root Cause Analysis

Causal Chain:
1. 📝 Deploy v2.5.0 (10:02) → includes user-service Breaking Change
2. 🔴 Error spike (10:05) → v2 API removed old endpoint, downstream 500 errors
3. ⚠️ Latency > 2s (10:08) → retry storm caused service overload
4. ⏪ Rollback (10:30) → old endpoint restored
5. ✅ Recovered (10:35) → rollback confirmed effective

Confidence: 🟢 High
Alternative hypothesis: another service may have deployed an incompatible change (low probability)
```

### Post-Mortem Only

```text
/incident postmortem
```

Generates a complete Markdown document ready for review.

### Incident Brief

```text
/incident brief
```

Output:

```text
🔔 Incident Brief
- Title: user-service API Breaking Change
- Severity: SEV2
- Duration: 35 minutes
- Impact: ~5000 users affected
- Status: Resolved
```

## Programmatic Usage

```typescript
import {
  GitHubCollector,
  buildTimeline,
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

async function main() {
  // 1. Collect events from GitHub
  const collector = new GitHubCollector({
    owner: 'saqqdy',
    repo: 'js-cool',
  })

  const { events, duration } = await collector.collect({
    start: '2026-06-20T10:00:00Z',
    end: '2026-06-20T12:00:00Z',
  })

  console.log(`Collected ${events.length} events in ${duration}ms`)

  // 2. Build timeline
  const timeline = buildTimeline(events)
  console.log(`Turning points: ${timeline.turningPoints.map(e => e.title).join(', ')}`)

  // 3. Generate Post-Mortem (requires RCA and Impact data)
  const report = generatePostMortem('API 500 Error', timeline, rca, impact)
  const markdown = renderPostMortemMarkdown(report)
  console.log(markdown)
}
```

## Next Steps

- [Data Collection](/guide/collect) — Learn about each data source
- [Timeline Building](/guide/timeline) — Understand how events are merged
- [MCP Configuration](/advanced/mcp-config) — Connect Sentry, Grafana, and more
