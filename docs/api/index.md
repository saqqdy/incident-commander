# API Overview

Incident Commander provides a programmatic API for CI/CD automation and custom toolchain integration.

## Installation

::: code-group

```bash [pnpm]
pnpm add incident-commander
```

```bash [npm]
npm install incident-commander
```

```bash [yarn]
yarn add incident-commander
```

:::

## Quick Reference

### Collectors

| Class | Description |
|-------|-------------|
| [GitHubCollector](/api/collectors/github) | Collect commits, PRs, and workflow runs via `gh` CLI |

### Analyzers

| Function | Description |
|----------|-------------|
| [buildTimeline()](/api/analyzers/timeline) | Merge events into a sorted, deduplicated timeline |

### Reporters

| Function | Description |
|----------|-------------|
| [generatePostMortem()](/api/reporters/postmortem) | Generate a complete Post-Mortem report object |
| [renderPostMortemMarkdown()](/api/reporters/render-markdown) | Render report as Markdown string |

### Types

| Type | Description |
|------|-------------|
| [TimelineEvent](/api/types/timeline-event) | A single timeline event |
| [CollectionResult](/api/types/collection-result) | Result from a collector |
| [TimelineResult](/api/types/timeline-result) | Result from buildTimeline() |
| [RCAResult](/api/types/rca-result) | Root cause analysis result |
| [PostMortemReport](/api/types/postmortem-report) | Complete Post-Mortem report |
| [ImpactResult](/api/types/impact-result) | Impact assessment result |
| [IncidentConfig](/api/types/config) | Configuration object |

### Utilities

| Function | Description |
|----------|-------------|
| [toISO()](/api/utils/format) | Convert any timestamp to ISO 8601 |
| [formatDuration()](/api/utils/format) | Format minutes as human-readable duration |
| [eventToMarkdownRow()](/api/utils/format) | Format event as Markdown table row |
| [eventTypeBadge()](/api/utils/format) | Get emoji badge for event type |
| [sourceLabel()](/api/utils/format) | Get label for data source |
| [getDefaultConfig()](/api/utils/config) | Get default configuration |
| [mergeConfig()](/api/utils/config) | Merge user config with defaults |

## Basic Usage

```typescript
import {
  GitHubCollector,
  buildTimeline,
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

// 1. Collect
const collector = new GitHubCollector({ owner: 'saqqdy', repo: 'js-cool' })
const { events } = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

// 2. Analyze
const timeline = buildTimeline(events)

// 3. Report
const report = generatePostMortem('API 500 Error', timeline, rca, impact)
const markdown = renderPostMortemMarkdown(report)
```
