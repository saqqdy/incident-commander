# CollectionResult

采集器完成数据采集后返回的结果。

## 定义

```typescript
interface CollectionResult<T = unknown> {
  /** 数据源 */
  source: DataSource
  /** 采集是否成功 */
  success: boolean
  /** 采集到的事件 */
  events: TimelineEvent[]
  /** 采集耗时（毫秒） */
  duration: number
  /** 错误信息（采集失败时） */
  error?: string
  /** 原始响应数据 */
  rawData?: T
}
```

## 示例

```typescript
const result: CollectionResult = {
  source: 'github',
  success: true,
  events: [...],
  duration: 1200,
}
```

失败的采集：

```typescript
const result: CollectionResult = {
  source: 'sentry',
  success: false,
  events: [],
  duration: 100,
  error: 'Authentication failed: invalid token',
}
```
