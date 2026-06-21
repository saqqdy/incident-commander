# 格式化工具

事件与时间戳的格式化辅助函数。

## toISO()

将任意时间戳转换为 ISO 8601 字符串。

```typescript
function toISO(timestamp: string | number | Date): string
```

**示例：**

```typescript
toISO('2026-06-20T10:00:00Z')     // '2026-06-20T10:00:00.000Z'
toISO(1718868000000)               // '2026-06-20T10:00:00.000Z'
toISO(new Date('2026-06-20'))     // '2026-06-20T00:00:00.000Z'
```

## formatDuration()

将分钟数格式化为可读的持续时间。

```typescript
function formatDuration(minutes: number): string
```

**示例：**

```typescript
formatDuration(0.5)    // '30s'
formatDuration(5)      // '5min'
formatDuration(90)     // '1h 30min'
formatDuration(120)    // '2h'
```

## eventToMarkdownRow()

将时间线事件格式化为 Markdown 表格行。

```typescript
function eventToMarkdownRow(event: TimelineEvent): string
```

**示例：**

```typescript
eventToMarkdownRow({
  timestamp: '2026-06-20T10:05:00Z',
  title: 'Error spike',
  type: 'error',
  source: 'sentry',
})
// | 2026-06-20 10:05:00 UTC | 🔴 Error spike | Sentry |
```

## eventTypeBadge()

获取事件类型的 emoji 标识。

```typescript
function eventTypeBadge(type: EventType): string
```

**示例：**

```typescript
eventTypeBadge('error')    // '🔴'
eventTypeBadge('deploy')   // '🚀'
eventTypeBadge('other')    // '❓'
```

## sourceLabel()

获取数据源的可读标签。

```typescript
function sourceLabel(source: DataSource): string
```

**示例：**

```typescript
sourceLabel('github')   // 'GitHub'
sourceLabel('sentry')   // 'Sentry'
sourceLabel('manual')   // 'Manual'
```
