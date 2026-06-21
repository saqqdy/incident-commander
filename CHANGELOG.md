# Changelog

## [0.1.0] - 2026-06-20

### Added

- Project scaffold with TypeScript, rolldown, vitest, ESLint 9, Prettier
- Core type definitions (`TimelineEvent`, `TimelineResult`, `RCAResult`, `ImpactResult`, `PostMortemReport`, etc.)
- GitHub collector — collects commits, PRs, and workflow runs via `gh` CLI
- Timeline builder — merge, sort, deduplicate, identify turning points
- Post-Mortem report generator — structured Markdown output with causal chain, impact, fixes, prevention, and action items
- Configuration utilities (`getDefaultConfig`, `mergeConfig`)
- Formatting utilities (`toISO`, `formatDuration`, `eventToMarkdownRow`, `eventTypeBadge`, `sourceLabel`)
- Claude Code Skill prompts (skill.md, collect.md, timeline.md, rca.md, postmortem.md)
- Report templates (postmortem.md, incident-brief.md)
- MCP config examples (GitHub, Sentry, Grafana)
- Sample output (sample-timeline.md, sample-postmortem.md)
- VitePress documentation site with English and Chinese support
- CLI with `demo` and `timeline --mock` commands for zero-config experience
- Mock data module for demo mode

### Changed

- Switched `description` field in package.json from Chinese to English

[0.1.0]: https://github.com/saqqdy/incident-commander/releases/tag/v0.1.0
