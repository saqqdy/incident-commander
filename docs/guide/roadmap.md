# Version Roadmap

## Overview

| Version | Codename | Theme | Status |
|---------|----------|-------|--------|
| v0.1.0 | First Blood | Project bootstrap + MVP (GitHub single-source + timeline + Post-Mortem) | ✅ Complete |
| v0.2.0 | Crossfire | Sentry + Grafana multi-source integration + AI causal reasoning | ⏳ In Development |
| v0.3.0 | Commander | Interactive enhancements + degradation strategy + one-command mode | 📋 Planned |
| v0.4.0 | Deep Dive | Kibana logs + deploy history integration | 📋 Planned |
| v1.0.0 | Battle Ready | Production-ready + npm publish | 📋 Planned |
| v2.0.0 | War Room | Knowledge base + prediction mode + Runbook automation | 📋 Future |

## v0.1.0 — First Blood

> 🎯 **Milestone**: First end-to-end run from time range input to timeline output

- ✅ `/incident` main command (interactive walkthrough)
- ✅ GitHub data collection (commits / PRs / workflow runs)
- ✅ Basic timeline building (sort + dedup + event type labeling)
- ✅ Basic RCA (inferring likely root cause from timeline)
- ✅ Basic Post-Mortem generation (template filling)
- ✅ Sample data and examples

## v0.2.0 — Crossfire

> 🎯 **Milestone**: First true multi-source causal reasoning — cross-validating "deploy → error → metric anomaly" chains

- ⏳ Sentry collector (errors, issues, breadcrumbs, affected users)
- ⏳ Grafana collector (metric anomalies: CPU, memory, latency, error rate)
- ⏳ Causal reasoning analyzer (`src/analyzers/causality.ts`)
- ⏳ Impact assessment analyzer (`src/analyzers/impact.ts`)
- ⏳ Enhanced multi-source timeline merging
- ⏳ MCP configuration examples for Sentry and Grafana

## v0.3.0 — Commander

> 🎯 **Milestone**: UX quality leap — one-command `/incident start`, graceful degradation instead of crashes

- 📋 Sub-command routing (start / timeline / rca / postmortem / brief / config)
- 📋 One-command mode (`/incident start <time-range>`)
- 📋 Configuration management (`/incident config`)
- 📋 Incident brief template
- 📋 Degradation strategy framework (`src/collectors/base.ts`)
- 📋 GitHub fallback (MCP → CLI → manual → Q&A)
- 📋 Full degradation mode (all sources down → pure interactive)

## v0.4.0 — Deep Dive

> 🎯 **Milestone**: Data source completeness — covering logs and deployment dimensions

- 📋 Kibana/ES collector (error log clustering, high-frequency anomalies)
- 📋 Deploy history collector (GitHub Deployments / Vercel)
- 📋 Log clustering analysis
- 📋 Deploy-to-incident causal correlation

## v1.0.0 — Battle Ready

> 🎯 **Milestone**: From "works" to "works well" — performance, docs, stability

- 📋 Parallel collection optimization
- 📋 Incremental analysis support
- 📋 Context compression for long incidents
- 📋 Complete documentation
- 📋 One-click setup script
- 📋 Edge case hardening
- 📋 npm publish + GitHub Release

## v1.x — Continuous Improvement

### v1.1.0 — Better Together (IM Integration)
- Slack / Feishu MCP integration for chat message collection
- Auto-create incident channel/topic on `/incident start`
- Auto-push brief to IM after analysis

### v1.2.0 — Learn from History (Knowledge Base v1)
- Historical incident archive (Markdown directory)
- Similar incident matching for new incidents
- Pattern recognition (e.g., "memory leak after every Tuesday deploy")

### v1.3.0 — Self-Review (Prevention Mode)
- Deploy pre-check based on historical patterns
- Change risk assessment for large refactors
- Canary strategy recommendations

## v2.0.0 — War Room

> 🎯 **Vision**: From "post-incident analysis tool" to "incident war room"

- Real-time mode (WebSocket / SSE integration)
- Multi-agent collaboration (Collect / Analyze / Communicate agents)
- Runbook execution (semi-automated fix workflows)
- On-call handoff documentation
- Chaos engineering experiment generation from Post-Mortems
