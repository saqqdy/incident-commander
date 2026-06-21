# GitHubCollector

Collect commits, pull requests, and workflow runs from GitHub within a specified time window.

## Import

```typescript
import { GitHubCollector } from 'incident-commander'
```

## Constructor

```typescript
new GitHubCollector(options: GitHubCollectorOptions)
```

### GitHubCollectorOptions

| Property | Type | Description |
|----------|------|-------------|
| `owner` | `string` | Repository owner (user or org) |
| `repo` | `string` | Repository name |

## Methods

### collect()

```typescript
collect(timeRange: { start: string; end: string }): Promise<CollectionResult>
```

Collects GitHub events within the specified time range.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `timeRange.start` | `string` | ISO 8601 start timestamp |
| `timeRange.end` | `string` | ISO 8601 end timestamp |

**Returns:** [`CollectionResult`](/api/types/collection-result)

## Collected Resources

| Resource | gh CLI Command | Event Type |
|----------|---------------|------------|
| Commits | `gh api repos/{owner}/{repo}/commits` | `code_change` |
| Pull Requests | `gh pr list --json ...` | `code_change` |
| Workflow Runs | `gh run list --json ...` | `deploy` / `error` |

## Examples

### Basic Collection

```typescript
const collector = new GitHubCollector({
  owner: 'saqqdy',
  repo: 'js-cool',
})

const result = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

console.log(`Collected ${result.events.length} events in ${result.duration}ms`)
```

### Error Handling

```typescript
const result = await collector.collect(timeRange)

if (!result.success) {
  console.error('Collection failed:', result.error)
} else {
  console.log(`Success: ${result.events.length} events`)
}
```

## Requirements

- **`gh` CLI** must be installed and authenticated
- **Repository access** — the authenticated user must have read access to the target repo
- **Rate limits** — the collector fetches up to 100 items per resource type

## Fallback Chain

```text
GitHub MCP Server → gh CLI → Guide manual paste → Mark data as missing
```
