# Incident Commander

> Automatically collect multi-source data, generate incident timelines, root cause analysis, and Post-Mortem documents

## Triggers

- `/incident` — Interactive incident analysis
- `/incident start` — One-command incident response (collect → timeline → RCA → report)
- `/incident timeline` — Generate timeline only
- `/incident rca` — Root cause analysis only
- `/incident postmortem` — Generate Post-Mortem document
- `/incident brief` — Generate incident brief (for stakeholders)
- `/incident config` — View or configure data sources

## Usage Flow

### Interactive Mode (default)

After the user runs `/incident`, guide them through these steps:

1. **Confirm incident time window**
   - Ask the user: approximate time range of the incident
   - Format: `YYYY-MM-DD HH:mm` or relative time (e.g. "2 hours ago")

2. **Data collection**
   - Auto-detect available MCP Servers and CLI tools
   - Collect events from enabled data sources in parallel
   - See [collect.md](./collect.md)

3. **Timeline construction**
   - Merge, sort, deduplicate all collected events
   - Label event types and data sources
   - See [timeline.md](./timeline.md)

4. **Root cause analysis**
   - Reason about causal relationships based on the timeline
   - Label confidence and alternative hypotheses
   - See [rca.md](./rca.md)

5. **Report generation**
   - Generate Post-Mortem or incident brief based on user choice
   - See [postmortem.md](./postmortem.md)

### One-command Mode

After the user runs `/incident start <time-range>`, automatically complete all steps above.

Examples:
- `/incident start 2026-06-20T10:00..2026-06-20T12:00`
- `/incident start 2h` (last 2 hours)

### Single-step Mode

Users can run individual steps:
- `/incident timeline` — Generate timeline only (from collected data or re-collect)
- `/incident rca` — Root cause analysis only (requires existing timeline)
- `/incident postmortem` — Generate Post-Mortem only (requires existing RCA)
- `/incident brief` — Generate incident brief only

## Current Version (v0.1.0) Support

- ✅ GitHub data source (commits / PRs / workflow runs)
- ✅ Interactive mode
- ✅ Timeline construction
- ✅ Basic RCA
- ✅ Post-Mortem generation
- ❌ Sentry / Grafana / Kibana integration (v0.2.0)
- ❌ One-command mode (v0.3.0)
- ❌ Degradation strategy (v0.3.0)

## Configuration

See `/incident config` or manually edit `.claude/settings.json`:

```json
{
  "incidentCommander": {
    "collectors": {
      "github": { "enabled": true },
      "sentry": { "enabled": false },
      "grafana": { "enabled": false }
    },
    "defaultTimeWindowMinutes": 60
  }
}
```
