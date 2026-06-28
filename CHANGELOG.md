# Changelog

## 0.1.0 (2026-06-28)

### 🚀 Features

- **cli**: add zero-install CLI for quick experience
  - `incident-commander demo` — full pipeline with mock data
  - `incident-commander timeline --mock` — timeline only
- **collectors**: add GitHub data collection layer
  - `GitHubCollector` class — collects commits, PRs, workflow runs via `gh` CLI
  - Structured `TimelineEvent` output with type labeling (deploy/code_change/error)
- **analyzers**: add timeline construction engine
  - `buildTimeline()` — merge, sort, deduplicate events
  - Turning point detection (first error, post-deploy anomaly, rollback, recovery)
- **reporters**: add Post-Mortem generator
  - `generatePostMortem()` — structured report with causal chain, impact, fixes
  - `renderPostMortemMarkdown()` — Markdown rendering from structured data
- **types**: add core type definitions
  - `TimelineEvent`, `TimelineResult`, `RCAResult`, `ImpactResult`, `PostMortemReport`
- **utils**: add utility functions
  - `formatDuration()`, `toISO()`, `eventToMarkdownRow()`, `eventTypeBadge()`
  - `getDefaultConfig()`, `mergeConfig()` for configuration management
- **mock**: add mock data module for demo mode
  - Sample events based on user-service API Breaking Change scenario

### 📝 Documentation

- **claude-code-skill**: add Skill definition (`.claude/skills/incident-commander/`)
  - Commands: `/incident`, `/incident start`, `/timeline`, `/rca`, `/postmortem`, `/brief`
  - Confidence levels: 🟢 High 🟡 Medium 🔴 Low
  - Interactive walkthrough + one-command mode
- **claude-plugin**: add plugin metadata (`.claude-plugin/`)
  - `plugin.json` — plugin info for marketplace
  - `marketplace.json` — marketplace publication config
- **examples**: add sample output files
  - `examples/sample-timeline.md` — typical production incident timeline
  - `examples/sample-postmortem.md` — complete incident retrospective
- **templates**: add report templates
  - `templates/postmortem.md` — Post-Mortem template
  - `templates/incident-brief.md` — incident brief template
- **mcp-configs**: add MCP server config examples
  - `mcp-configs/github.json`, `sentry.json`, `grafana.json`
- **docs**: add VitePress documentation site (`docs/`)
  - English + Chinese bilingual support
  - API reference, guides, playground

### 🔧 Chores

- add initial project configuration (TypeScript 5.9, tsup, vitest, ESLint 9, Prettier)
- add CI/CD workflows — lint, typecheck, test, build, release, docs deploy
- add `bin` field to package.json for CLI entry point