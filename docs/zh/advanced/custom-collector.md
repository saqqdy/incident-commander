# 自定义采集器

通过创建自定义数据采集器来扩展 Incident Commander，接入你的专属平台。

## 采集器接口

所有采集器都实现 `Collector` 接口：

```typescript
interface Collector {
  /** 数据源标识 */
  readonly source: DataSource
  /** 在指定时间范围内采集数据 */
  collect: (timeRange: { start: string; end: string }) => Promise<CollectionResult>
}
```

## 基本示例

以下是一个从日志文件读取数据的最小自定义采集器：

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
    // 在此解析你的日志格式
    // 示例: "2026-06-20T10:05:00Z ERROR Database connection timeout"
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

## 使用自定义采集器

```typescript
import { buildTimeline, renderPostMortemMarkdown } from 'incident-commander'

const logCollector = new LogFileCollector('/var/log/app.log')
const result = await logCollector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

// 与其他采集器的结果合并
const allEvents = [
  ...githubEvents,
  ...sentryEvents,
  ...result.events,
]

const timeline = buildTimeline(allEvents)
```

## 自定义数据源

如果你的采集器不适合内置的 `DataSource` 值，可以使用 `'manual'` 作为通用回退：

```typescript
const source: DataSource = 'manual'  // 通用回退
```

## 最佳实践

1. **始终处理错误** — 返回 `{ success: false, error: '...' }` 而非抛出异常
2. **包含持续时间** — 使用 `performance.now()` 测量采集耗时
3. **保留原始数据** — 在事件上设置 `raw` 以便调试
4. **按时间范围过滤** — 不要返回请求窗口之外的事件
5. **限制结果数量** — 设置合理的上限（如 1000 个事件），避免上下文溢出
