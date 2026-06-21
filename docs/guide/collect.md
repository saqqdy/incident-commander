# Data Collection

Incident Commander collects events from multiple data sources in parallel, then merges them into a unified timeline.

## How Collection Works

```
/incident start 2h
       │
       ├─▶ GitHub Collector    → commits, PRs, workflow runs
       ├─▶ Sentry Collector    → error events, issues, breadcrumbs
       ├─▶ Grafana Collector   → metric anomalies, alerts
       └─▶ ... more sources
       │
       └─▶ Merge results → TimelineEvent[]
```

Each collector returns a `CollectionResult`:

```typescript
interface CollectionResult {
  source: DataSource       // 'github' | 'sentry' | 'grafana' | ...
  success: boolean         // Whether collection succeeded
  events: TimelineEvent[]  // Collected events
  duration: number         // Collection time in ms
  error?: string           // Error message if failed
}
```

## GitHub Collector

The GitHub collector uses the `gh` CLI to fetch:

| Resource | API | Event Type |
|----------|-----|------------|
| Commits | `gh api repos/{owner}/{repo}/commits` | `code_change` |
| Pull Requests | `gh pr list --json ...` | `code_change` |
| Workflow Runs | `gh run list --json ...` | `deploy` or `error` |

### Usage

```typescript
import { GitHubCollector } from 'incident-commander'

const collector = new GitHubCollector({
  owner: 'saqqdy',
  repo: 'js-cool',
})

const result = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

console.log(`GitHub: ${result.events.length} events in ${result.duration}ms`)
```

### Requirements

- `gh` CLI installed and authenticated
- Access to the target repository

### Fallback Chain

```text
GitHub MCP Server ──(unavailable)──▶ gh CLI ──(unavailable)──▶ Guide manual paste
```

## Sentry Collector (v0.2.0)

Collects error events, issues, and breadcrumbs from Sentry.

| Resource | Method | Event Type |
|----------|--------|------------|
| Error Events | Sentry MCP / REST API | `error` |
| Issues | Sentry MCP / REST API | `error` |
| Breadcrumbs | Sentry MCP / REST API | `log_anomaly` |

## Grafana Collector (v0.2.0)

Collects metric anomalies and alerting events from Grafana.

| Resource | Method | Event Type |
|----------|--------|------------|
| Metric Anomalies | Grafana MCP / REST API | `metric_anomaly` |
| Alerts | Grafana MCP / REST API | `alert` |

## Parallel Collection

When multiple sources are configured, Incident Commander collects in parallel:

```text
📊 Collection complete
- GitHub: 12 commits, 3 PRs, 2 deploys (1.2s)
- Sentry: 8 error events, 2 issues (0.8s)
- Grafana: 3 metric anomalies detected (1.5s)
- Total: 25 events
- Wall time: 1.5s (parallel), would be 3.5s (serial)
```

Failed sources are gracefully handled — partial results are still used:

```text
📊 Collection complete (partial)
- GitHub: 12 commits, 3 PRs, 2 deploys (1.2s)
- Sentry: ❌ Authentication failed (0.1s)
- Grafana: 3 metric anomalies detected (1.5s)
- Total: 17 events from 2 sources
- Warning: Sentry collection failed — check your token
```

## Manual Data Collection

When MCP servers and CLI tools are unavailable, you can manually provide data:

```text
/incident collect --manual
```

This prompts you to paste or describe events:

```text
📝 Paste or describe events (one per line, Ctrl+D when done):
> At 10:05, we saw a spike in 500 errors on /api/users
> At 10:30, we rolled back production to v2.4.0
> At 10:35, errors recovered
```

These manual events are converted to `TimelineEvent` objects and included in the timeline like any other source.

## Next Steps

- [Timeline Building](/guide/timeline) — How events are merged and ordered
- [MCP Configuration](/advanced/mcp-config) — Set up additional data sources
