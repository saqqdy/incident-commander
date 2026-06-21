# Custom Collectors

Extend Incident Commander by creating custom data collectors for your specific platforms.

## Collector Interface

All collectors implement the `Collector` interface:

```typescript
interface Collector {
  /** Data source identifier */
  readonly source: DataSource
  /** Collect data within a time range */
  collect: (timeRange: { start: string; end: string }) => Promise<CollectionResult>
}
```

## Basic Example

Here's a minimal custom collector that reads from a log file:

```typescript
import type { CollectionResult, Collector, TimelineEvent } from 'incident-commander'
import { readFile } from 'node:fs/promises'

class LogFileCollector implements Collector {
  readonly source = 'manual' as const

  constructor(private filePath: string) {}

  async collect(timeRange: { start: string; end: string }): Promise<CollectionResult> {
    const startTime = performance.now()
    const events: TimelineEvent[] = []

    try {
      const content = await readFile(this.filePath, 'utf-8')
      const lines = content.split('\n')

      for (const line of lines) {
        const parsed = this.parseLine(line)
        if (parsed && this.inRange(parsed.timestamp, timeRange)) {
          events.push(parsed)
        }
      }

      return {
        source: this.source,
        success: true,
        events,
        duration: Math.round(performance.now() - startTime),
      }
    } catch (error) {
      return {
        source: this.source,
        success: false,
        events: [],
        duration: Math.round(performance.now() - startTime),
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  private parseLine(line: string): TimelineEvent | null {
    // Parse your log format here
    // Example: "2026-06-20T10:05:00Z ERROR Database connection timeout"
    const match = line.match(/^(\S+)\s+(\w+)\s+(.+)$/)
    if (!match) return null

    return {
      timestamp: match[1]!,
      title: match[3]!,
      description: line,
      type: match[2] === 'ERROR' ? 'error' : 'other',
      source: this.source,
    }
  }

  private inRange(ts: string, range: { start: string; end: string }): boolean {
    const time = new Date(ts).getTime()
    return time >= new Date(range.start).getTime() && time <= new Date(range.end).getTime()
  }
}
```

## Using Custom Collectors

```typescript
import { buildTimeline, renderPostMortemMarkdown } from 'incident-commander'

const logCollector = new LogFileCollector('/var/log/app.log')
const result = await logCollector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

// Merge with other collectors' results
const allEvents = [
  ...githubEvents,
  ...sentryEvents,
  ...result.events,
]

const timeline = buildTimeline(allEvents)
```

## Custom DataSource

If your collector doesn't fit the built-in `DataSource` values, use `'manual'` as a catch-all:

```typescript
const source: DataSource = 'manual'  // generic fallback
```

## Best Practices

1. **Always handle errors** — return `{ success: false, error: '...' }` instead of throwing
2. **Include duration** — measure collection time with `performance.now()`
3. **Preserve raw data** — set `raw` on events for debugging
4. **Filter by time range** — don't return events outside the requested window
5. **Limit results** — cap at a reasonable number (e.g., 1000 events) to avoid context overflow
