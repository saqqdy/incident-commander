# Graceful Degradation

Incident Commander is designed to degrade gracefully when data sources are unavailable, rather than crashing or producing empty results.

## Degradation Chain

```text
Collector Fallback:
  MCP Server ──(unavailable)──▶ CLI Tool ──(unavailable)──▶ Guide Manual Input ──(skip)──▶ Mark as Missing

Overall Fallback:
  Full Auto Mode ──(some sources unavailable)──▶ Semi-Auto Mode (available sources + manual supplement)
                    ──(all sources unavailable)──▶ Pure Interactive Mode (Q&A to collect information)
```

## Collector-Level Degradation

Each collector has a fallback chain. For example, the GitHub collector:

```text
Step 1: Try GitHub MCP Server
  ├── Success → Return events
  └── Failure ↓

Step 2: Try gh CLI
  ├── Success → Return events
  └── Failure ↓

Step 3: Guide manual paste
  ├── User provides data → Parse and return events
  └── User skips ↓

Step 4: Mark data as missing
  └── Continue with events from other sources
```

## System-Level Degradation

### Full Auto Mode (All sources available)

```text
/incident start 2h
📊 Collection: GitHub ✅ | Sentry ✅ | Grafana ✅
📊 Timeline: 25 events, 4 turning points
🧠 RCA: High confidence causal chain
📝 Post-Mortem: Complete report generated
```

### Semi-Auto Mode (Some sources unavailable)

```text
/incident start 2h
📊 Collection: GitHub ✅ | Sentry ❌ (auth failed) | Grafana ✅
📊 Timeline: 17 events from 2 sources
🧠 RCA: Medium confidence (limited error data)
📝 Post-Mortem: Generated with gaps marked [MISSING: Sentry error details]
```

### Pure Interactive Mode (All sources unavailable)

```text
/incident start 2h
📊 Collection: No automated sources available
📋 Starting interactive Q&A mode...
  Q: When did the incident start?
  A: Around 10:00 AM
  Q: What was the first symptom?
  A: 500 errors on /api/users
  Q: What was done to fix it?
  A: We rolled back at 10:30
📊 Timeline: 3 events (manually provided)
🧠 RCA: Low confidence (limited data from Q&A)
📝 Post-Mortem: Draft generated — requires significant editing
```

## Error Handling

| Scenario | Behavior | User Message |
|----------|----------|-------------|
| MCP timeout | Fall back to CLI | "MCP server timed out, falling back to gh CLI..." |
| CLI not found | Guide manual input | "gh CLI not found. Please paste your GitHub events..." |
| Auth failure | Skip source | "Sentry authentication failed. Skipping Sentry data..." |
| Rate limit | Retry with backoff | "GitHub API rate limit hit. Retrying in 30s..." |
| Network error | Fall back to cache | "Network error. Using cached data from last run..." |
| Invalid data | Filter bad entries | "Skipped 2 malformed events from Grafana..." |

## Confidence Adjustment

The RCA confidence level is automatically adjusted based on available data:

| Sources Available | Max Confidence | Reasoning |
|-------------------|---------------|-----------|
| 3+ sources | 🟢 High | Cross-source validation possible |
| 2 sources | 🟢 High | Some cross-validation possible |
| 1 source | 🟡 Medium | No cross-validation |
| Manual only | 🔴 Low | Based on user-supplied narrative only |

## Best Practices

1. **Configure at least 2 sources** — cross-validation significantly improves RCA quality
2. **Keep gh CLI authenticated** — it's the most reliable fallback
3. **Review gap markers** — `[MISSING]` sections in Post-Mortems need manual attention
4. **Run `/incident config` regularly** — ensure sources stay connected
