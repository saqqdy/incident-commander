# Data Collection Instructions

## Goal

Collect events from all enabled data sources in parallel within the specified time window.

## GitHub Collection Steps

### 1. Detect available tools

Check in priority order:

1. **GitHub MCP Server** — If GitHub MCP is configured, prefer its API tools
2. **gh CLI** — If `gh` is available, use `gh` commands to collect
3. **Fallback** — Guide the user to provide information manually

### 2. Collect items

Use the Bash tool to execute the following collections (replace `{owner}`, `{repo}`, `{start}`, `{end}`):

#### Commits

```bash
gh api "repos/{owner}/{repo}/commits?since={start}&until={end}&per_page=100" \
  --jq '.[] | {sha: .sha[0:7], message: .commit.message, author: .commit.author.name, date: .commit.author.date, url: .html_url}'
```

#### Pull Requests

```bash
gh pr list --state all --search "created:{start}..{end}" --json number,title,author,mergedAt,createdAt,url
```

#### Workflow Runs (deploy events)

```bash
gh run list --created "{start}..{end}" --json name,status,conclusion,createdAt,updatedAt,databaseId
```

### 3. Convert to standard event format

Map collected results to TimelineEvent:

```typescript
{
  timestamp: string,    // ISO 8601
  title: string,       // Short title
  description: string, // Detailed description
  type: EventType,     // deploy / code_change / error / ...
  source: DataSource,  // github
  raw?: unknown        // Raw data
}
```

#### Mapping rules

| Source data | EventType | title format |
|------------|-----------|-------------|
| commit | code_change | `{author}: {first line of message}` |
| merged PR | code_change | `PR #{number}: {title}` |
| workflow run (success) | deploy | `Deploy: {name} ✅` |
| workflow run (failure) | error | `Deploy: {name} ❌` |
| workflow run (in_progress) | deploy | `Deploy: {name} 🔄` |

### 4. Error handling

- API rate limit: Retry after waiting (max 3 times), inform the user
- Auth failure: Prompt the user to run `gh auth login`
- Network error: Mark collection as failed, continue with other collections
- No data: Return empty event list (not an error)

## Output

After collection, show a summary to the user:

```
📊 Collection complete
- GitHub: 12 commits, 3 PRs, 2 deploys (1.2s)
- Total: 17 events
```
