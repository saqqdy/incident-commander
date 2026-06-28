# Version Roadmap

Incident Commander evolves through themed releases, each adding a layer of intelligence.

## Current Release

### v0.1.0 — First Blood (Released)

**Theme**: Project Bootstrap + MVP

**Capabilities**:
- ✅ `/incident` interactive walkthrough
- ✅ GitHub data collection (commits / PRs / workflow runs via `gh` CLI)
- ✅ Timeline building (sort + dedup + turning point detection)
- ✅ Basic RCA (causal chain inference from timeline)
- ✅ Post-Mortem generation (structured Markdown output)
- ✅ Incident brief generation
- ✅ Zero-config demo mode (`pnpm run demo`)
- ✅ Claude Code Plugin metadata (`.claude-plugin/`)
- ✅ TypeScript/Node.js API

**Use Cases**:
- GitHub-centric incident analysis
- Quick retrospective generation
- CLI-driven timeline exploration

## Planned Releases

### v0.2.0 — Crossfire

**Theme**: Multi-Source Integration + Causal Reasoning

**Planned Features**:
- Sentry collector (errors, issues, breadcrumbs, affected users)
- Grafana collector (metric anomalies: CPU, memory, latency, error rate)
- Causal reasoning analyzer with confidence labels
- Impact assessment (users / features / data dimensions)
- Multi-source timeline merging and deduplication
- MCP configuration examples for Sentry and Grafana

### v0.3.0 — Commander

**Theme**: Interactive Enhancements + Degradation Strategy

**Planned Features**:
- Sub-command routing (`/incident start` / `timeline` / `rca` / `postmortem` / `brief` / `config`)
- One-command mode (`/incident start <time-range>`)
- Configuration management
- Graceful degradation (MCP → CLI → manual → Q&A)
- Incident brief template

### v0.4.0 — Deep Dive

**Theme**: Logs + Deployment Integration

**Planned Features**:
- Kibana/ES collector (error log clustering)
- Deploy history collector (GitHub Deployments / Vercel)
- Log clustering analysis
- Deploy-to-incident causal correlation

### v1.0.0 — Battle Ready

**Theme**: Production Ready

**Planned Features**:
- Parallel collection optimization
- Incremental analysis support
- Context compression for long incidents
- Claude Code Plugin Marketplace
- Complete documentation + one-click setup
- npm publish + GitHub Release

## Future Vision

### v1.1.0 — Better Together
- Slack / Feishu MCP integration for chat message collection
- Auto-create incident channel on `/incident start`
- Auto-push brief to IM after analysis

### v1.2.0 — Learn from History
- Historical incident archive
- Similar incident matching
- Pattern recognition (e.g., "memory leak after every Tuesday deploy")

### v1.3.0 — Self-Review
- Deploy pre-check based on historical patterns
- Change risk assessment
- Canary strategy recommendations

### v2.0.0 — War Room
- Real-time mode (WebSocket / SSE)
- Multi-agent collaboration
- Runbook execution (semi-automated fix workflows)
- On-call handoff documentation

## Release Philosophy

- **Incremental Value**: Each release delivers usable features
- **Backward Compatible**: APIs remain stable across minor versions
- **Community Driven**: Roadmap shaped by user feedback

## Contributing

Have ideas for future releases? [Open an issue](https://github.com/saqqdy/incident-commander/issues) or join discussions.

## Changelog

See [CHANGELOG.md](https://github.com/saqqdy/incident-commander/blob/master/CHANGELOG.md) for release history.