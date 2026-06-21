# Introduction

**Incident Commander** is a Claude Code Skill plugin that helps SRE / On-call engineers automatically collect multi-source data, generate incident timelines and root cause analysis, and produce structured Post-Mortem documents.

## Why Incident Commander?

When incidents strike, information is scattered across monitoring, logs, deploy records, and chat. Building a timeline takes 30–60 minutes. Writing a Post-Mortem takes 1–2 hours. And root cause analysis often relies on gut feeling.

Incident Commander automates the tedious parts — data collection, timeline construction, causal reasoning, and report generation — so you can focus on understanding and preventing incidents, not documenting them.

### The Problem

```text
Traditional incident retrospective:
  1. Open Sentry → Switch to Grafana → Check Git changes → Review deploys
  2. Manually sort events, easy to miss or misorder
  3. Rely on gut feeling for root cause
  4. Copy blank template and fill manually — 2 hours minimum
```

### The Solution

```text
/incident start 2h
  → Collects GitHub + Sentry + Grafana in parallel (10 seconds)
  → Merges, sorts, deduplicates events into timeline
  → AI cross-references causal chains with confidence labels
  → Generates complete Post-Mortem — review and ship in 10 minutes
```

## Key Features

- **Multi-Source Data Collection** — GitHub / Sentry / Grafana / Kibana / Deploy platforms, collected in parallel
- **Automatic Timeline Construction** — Unified, ordered, deduplicated with event type labels and turning point detection
- **AI Causal Reasoning** — Semantic-aware cross-referencing with confidence (High/Medium/Low) and alternative hypotheses
- **Structured Post-Mortem Generation** — Complete report with summary, timeline, RCA, impact, fixes, and action items
- **Incident Brief** — Concise format for stakeholders
- **Graceful Degradation** — MCP → CLI → Manual paste → Interactive Q&A

## Two Ways to Use

### Option 1: Claude Code Skill (Recommended)

The fullest experience — let AI handle the entire analysis in conversation.

```text
/incident start 2h                 # One-command analysis of the last 2 hours
/incident timeline                 # Generate timeline only
/incident rca                      # Root cause analysis only
/incident postmortem               # Generate Post-Mortem document
```

### Option 2: Programmatic Usage

For CI/CD automation or custom toolchains.

```typescript
import {
  GitHubCollector,
  buildTimeline,
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

const collector = new GitHubCollector({ owner: 'saqqdy', repo: 'js-cool' })
const { events } = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

const timeline = buildTimeline(events)
const report = generatePostMortem('API 500 Error', timeline, rca, impact)
console.log(renderPostMortemMarkdown(report))
```

## Data Source Support

| Source | Status | Collection Method | Available Since |
|--------|--------|-------------------|-----------------|
| **GitHub** | ✅ Supported | `gh` CLI / GitHub MCP | v0.1.0 |
| **Sentry** | ⏳ In Development | Sentry MCP / REST API | v0.2.0 |
| **Grafana** | ⏳ In Development | Grafana MCP / REST API | v0.2.0 |
| **Kibana/ES** | 📋 Planned | ES MCP / REST API | v0.4.0 |
| **Deploy** | 📋 Planned | GitHub Deployments / Vercel | v0.4.0 |
| **Slack** | 📋 Planned | Slack MCP | v1.1.0 |
| **Feishu** | 📋 Planned | Feishu MCP | v1.1.0 |
