# 🚨 Incident Commander

> When incidents strike, information is scattered across monitoring, logs, deploy records, and chat. Incident Commander lets Claude Code automatically collect multi-source data, reason about causal chains, and generate structured Post-Mortems — turning a 2-hour retrospective into a 10-minute review.

[![npm version](https://img.shields.io/npm/v/incident-commander.svg)](https://www.npmjs.com/package/incident-commander)
[![license](https://img.shields.io/npm/l/incident-commander.svg)](https://github.com/saqqdy/incident-commander/blob/main/LICENSE)

[中文文档](README_CN.md)

---

## 🎯 The Problem It Solves

| Scenario | Traditional Approach | Incident Commander |
|----------|---------------------|-------------------|
| Incident strikes | Open Sentry → Switch to Grafana → Check Git changes → Review deploys, back and forth | `/incident start 2h` — collect all data sources in one command |
| Build a timeline | Rely on memory — manually sort events, easy to miss or misorder | Auto-merge, sort, and deduplicate with event types and sources labeled |
| Write an RCA | Rely on gut feeling — easy to overlook alternative hypotheses | AI cross-references causal chains, labels confidence + at least 1 alternative hypothesis |
| Write a Post-Mortem | Copy a blank template and fill manually — 2 hours minimum | Auto-generate a structured report — 10 minutes to review and ship |

---

## ✨ Core Features

### 🔍 Multi-Source Data Collection

Collect events in parallel from GitHub / Sentry / Grafana / Kibana / Deploy platforms:

```
📊 Collection complete
- GitHub: 12 commits, 3 PRs, 2 deploys (1.2s)
- Sentry: 8 error events, 2 issues (0.8s)
- Grafana: 3 metric anomalies detected (1.5s)
- Total: 25 events
```

### 📊 Automatic Timeline Construction

Merge multi-source events into a unified, ordered, deduplicated timeline with auto-labeled event types:

| Time (UTC) | Event | Source |
|-----------|-------|--------|
| 10:00 | 📝 alice: feat: update user-service API to v2 | GitHub |
| 10:02 | 🚀 Deploy: production ✅ | GitHub |
| 10:05 | 🔴 Error rate spike on /api/users (500 errors) | Sentry |
| 10:08 | ⚠️ Alert: P95 latency > 2s on user-service | Grafana |
| 10:30 | ⏪ Rollback to v2.4.0 | GitHub |
| 10:35 | ✅ Error rate recovered | Sentry |

Automatically identifies **key turning points** (first error, post-deploy anomaly, rollback moment, recovery moment).

### 🧠 AI Causal Reasoning

Not just "time order = causation" — semantic-aware cross-referencing:

```
1. 📝 Deploy v2.5.0 (10:02) → includes user-service Breaking Change
2. 🔴 Error spike (10:05) → v2 API removed old endpoint, downstream 500 errors
3. ⚠️ Latency > 2s (10:08) → retry storm caused service overload
4. ⏪ Rollback (10:30) → old endpoint restored
5. ✅ Recovered (10:35) → rollback confirmed effective

Confidence: 🟢 High — deploy and error times closely match, immediate recovery after rollback, causal chain complete
Alternative hypothesis: another service may have deployed an incompatible change (low probability, insufficient data to verify)
```

Every conclusion is labeled with **confidence** (High/Medium/Low) and **alternative hypotheses** — transparency beats perfection when AI can be wrong.

### 📝 Structured Post-Mortem Generation

One command to generate a complete retrospective report:

- **Summary**: severity, duration, impact scope
- **Timeline**: full event table + key turning points
- **Root Cause Analysis**: causal chain + direct cause + contributing factors + root cause
- **Impact Assessment**: affected users, feature scope, data impact
- **Fix & Prevention**: mitigations, root fix, short-term prevention, long-term improvements
- **Action Items**: each with Owner + Deadline + Priority

> Review for 10 minutes and ship — instead of writing from scratch for 2 hours.

### 🔔 Incident Brief

Concise format for stakeholders:

```
🔔 Incident Brief
- Title: user-service API Breaking Change
- Severity: SEV2
- Duration: 35 minutes
- Impact: ~5000 users affected
- Status: Resolved
```

### 🛡️ Graceful Degradation

When a data source is unavailable, automatically fall back instead of crashing:

```
MCP Server down?   → Try CLI tool → Guide manual paste → Mark data as missing
All sources down?  → Pure interactive mode (Q&A to collect information)
```

---

## 🚀 Getting Started

### Option 0: Zero-Config Demo (Fastest)

Try the full pipeline instantly — no `gh` CLI, no API keys, no code.

```bash
git clone https://github.com/saqqdy/incident-commander.git
cd incident-commander
pnpm install && pnpm run build

# Full pipeline demo (collect → timeline → RCA → Post-Mortem)
pnpm run demo

# Timeline only
node dist/cli.js timeline --mock
```

Uses built-in mock data based on the sample scenario (user-service API Breaking Change → 500 errors).

### Option 1: Claude Code Skill (Recommended)

The fullest experience — let AI handle the entire analysis in conversation.

**Step 1: Install**

```bash
# Clone into your project directory
cd your-project
git clone https://github.com/saqqdy/incident-commander.git .incident-commander

# Or copy the Skill directory directly
cp -r incident-commander/.claude/skills/ .claude/skills/
```

**Step 2: Verify gh CLI**

```bash
gh auth status  # Needs an authenticated GitHub account
```

**Step 3: Try it in Claude Code**

```
/incident                          # Interactive walkthrough
/incident start 2h                 # One-command analysis of the last 2 hours
/incident start 2026-06-20T10:00..2026-06-20T12:00  # Custom time range
/incident timeline                 # Generate timeline only
/incident rca                      # Root cause analysis only
/incident postmortem               # Generate Post-Mortem document
/incident brief                    # Generate incident brief
/incident config                   # View or configure data sources
```

**Step 4 (Optional): Connect more data sources**

Copy configs from `mcp-configs/` into `.claude/settings.json` with real tokens:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token" }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sentry"],
      "env": { "SENTRY_AUTH_TOKEN": "your_sentry_token" }
    }
  }
}
```

After configuration, `/incident start 2h` will collect from GitHub + Sentry simultaneously for cross-source reasoning.

### Option 2: Programmatic Usage

For CI/CD automation or custom toolchains.

```bash
pnpm add incident-commander
```

```typescript
import {
  GitHubCollector,
  buildTimeline,
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

// 1. Collect GitHub events (commits / PRs / workflow runs)
const collector = new GitHubCollector({
  owner: 'saqqdy',
  repo: 'js-cool',
})
const { events, duration } = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})
console.log(`Collected ${events.length} events in ${duration}ms`)

// 2. Build timeline (sort + dedup + turning point detection)
const timeline = buildTimeline(events)
console.log(`Key turning points: ${timeline.turningPoints.map(e => e.title).join(', ')}`)

// 3. Generate Post-Mortem (requires RCA and Impact data)
const report = generatePostMortem('API 500 Error', timeline, rca, impact)
const markdown = renderPostMortemMarkdown(report)
console.log(markdown)
```

### Option 3: Zero-Config Demo (Fastest)

No setup at all — try it right now:

```bash
git clone https://github.com/saqqdy/incident-commander.git
cd incident-commander
pnpm install && pnpm run build
pnpm run demo
```

Or try the interactive [Playground](https://saqqdy.github.io/incident-commander/playground) in your browser.

### Option 4: Browse Sample Output

No setup needed — just look at the examples:

- [Sample Timeline](examples/sample-timeline.md) — a typical production incident timeline
- [Sample Post-Mortem](examples/sample-postmortem.md) — a complete incident retrospective

---

## 🆚 Comparison

### vs PagerDuty / Opsgenie (Traditional On-Call Platforms)

| Dimension | PagerDuty / Opsgenie | Incident Commander |
|-----------|---------------------|-------------------|
| Incident detection | ✅ Alert aggregation + on-call scheduling | ❌ Not an alerting tool (focuses on analysis) |
| Timeline building | ⚠️ Aggregates alerts only, no code changes | ✅ Fuses commits, deploys, errors, metrics, logs |
| Root cause analysis | ❌ No reasoning — relies on humans | ✅ AI cross-references causal chains + confidence labels |
| Post-Mortem | ⚠️ Provides blank templates | ✅ Auto-generates populated reports — review and ship |
| Deployment | SaaS, paid | Local, open-source, free |
| **Positioning** | Alert intake + on-call orchestration | Incident analysis + retrospective documentation |

> Incident Commander complements rather than replaces PagerDuty — PagerDuty detects the problem, Incident Commander analyzes it and generates the retrospective.

### vs Datadog Incident Management

| Dimension | Datadog IM | Incident Commander |
|-----------|-----------|-------------------|
| Data sources | ✅ Deep Datadog ecosystem绑定 | ✅ Open integration: GitHub / Sentry / Grafana / Kibana |
| AI analysis | ⚠️ Limited anomaly detection | ✅ Deep causal reasoning + alternative hypotheses |
| Cross-platform correlation | ❌ Datadog-only data | ✅ Cross-platform cross-validation |
| Cost | Enterprise pricing | Open-source, free |
| **Positioning** | Incident management within Datadog | Incident analysis for any tech stack |

### vs Manual Retrospective Process

| Dimension | Manual Process | Incident Commander |
|-----------|---------------|-------------------|
| Timeline construction | 30–60 min, switching between tools | 10 seconds, auto-generated |
| RCA depth | Depends on individual experience | Systematic AI reasoning + auto-suggested alternatives |
| Post-Mortem writing | 1–2 hours from scratch | 10 minutes to review and edit |
| Knowledge preservation | Scattered across people and systems | Structured, searchable, reusable archives |
| Consistency | Varies by author | Standardized templates + uniform output format |

### Key Differentiators

1. **AI Semantic Reasoning vs Rule Matching** — Only AI can understand "this code's behavior changed" across endlessly varied logs and errors
2. **Open Ecosystem vs Vendor Lock-in** — Mix GitHub + Sentry + Grafana + Kibana freely — no single platform lock-in
3. **Claude Code Native vs Standalone Tool** — Use directly in your development workflow — no context switching

---

## 🔌 Data Source Support

| Source | Status | Collection Method | Available Since |
|--------|--------|-------------------|----------------|
| **GitHub** | ✅ Supported | `gh` CLI / GitHub MCP | v0.1.0 |
| **Sentry** | ⏳ In Development | Sentry MCP / REST API | v0.2.0 |
| **Grafana** | ⏳ In Development | Grafana MCP / REST API | v0.2.0 |
| **Kibana/ES** | 📋 Planned | ES MCP / REST API | v0.4.0 |
| **Deploy** | 📋 Planned | GitHub Deployments / Vercel | v0.4.0 |
| **Slack** | 📋 Planned | Slack MCP | v1.1.0 |
| **Feishu** | 📋 Planned | Feishu MCP | v1.1.0 |

---

## 🗂️ Project Structure

```
incident-commander/
├── .claude/skills/incident-commander/   # Skill Prompt definitions (core)
│   ├── skill.md                         # Main entry / command routing
│   ├── collect.md                       # Data collection instructions
│   ├── timeline.md                      # Timeline building instructions
│   ├── rca.md                           # Root cause analysis instructions
│   └── postmortem.md                    # Post-Mortem generation instructions
├── src/                                 # TypeScript source
│   ├── types.ts                         # Core type definitions
│   ├── cli.ts                           # CLI entry (demo & timeline --mock)
│   ├── collectors/github.ts             # GitHub collector
│   ├── analyzers/timeline.ts            # Timeline builder (sort/dedup/turning points)
│   ├── reporters/postmortem.ts          # Report generator (Markdown rendering)
│   ├── mock/                            # Mock data for demo mode
│   │   └── data.ts                      # Sample events, RCA & impact
│   └── utils/                           # Utility functions
├── templates/                           # Report templates
│   ├── postmortem.md                    # Post-Mortem template
│   └── incident-brief.md               # Incident brief template
├── mcp-configs/                         # MCP server config examples
│   ├── github.json
│   ├── sentry.json
│   └── grafana.json
├── examples/                            # Sample output
│   ├── sample-timeline.md
│   └── sample-postmortem.md
└── internal/                            # Internal planning docs
    ├── development-plan.md
    └── version-roadmap.md
```

---

## 🛠️ Development

```bash
pnpm install          # Install dependencies
pnpm run lint         # ESLint check + auto-fix
pnpm run typecheck    # TypeScript type check
pnpm run test         # Run tests
pnpm run build        # Build (outputs ESM + CJS)
pnpm run dev          # Watch mode development
```

### Tech Stack

- **Language**: TypeScript 5.9+
- **Build**: rolldown
- **Lint**: @eslint-sets/eslint-config (ESLint 9 flat config)
- **Formatting**: prettier + prettier-config-common
- **Testing**: vitest
- **Package Manager**: pnpm 9

---

## 📋 Version Roadmap

| Version | Codename | Theme | Status |
|---------|----------|-------|--------|
| v0.1.0 | First Blood | Project bootstrap + MVP (GitHub single-source + timeline + Post-Mortem) | ✅ Complete |
| v0.2.0 | Crossfire | Sentry + Grafana multi-source integration + AI causal reasoning | ⏳ In Development |
| v0.3.0 | Commander | Interactive enhancements + degradation strategy + one-command mode | 📋 Planned |
| v0.4.0 | Deep Dive | Kibana logs + deploy history integration | 📋 Planned |
| v1.0.0 | Battle Ready | Production-ready + npm publish | 📋 Planned |
| v2.0.0 | War Room | Knowledge base + prediction mode + Runbook automation | 📋 Future |

See → [version-roadmap.md](internal/version-roadmap.md)

---

## 🤝 Contributing

Issues and PRs welcome! Please ensure:

- `pnpm run lint` passes
- `pnpm run typecheck` passes
- `pnpm run test` passes
- New features include tests

---

## 📄 License

[MIT](./LICENSE)
