# 自定义采集器

通过创建自定义数据采集器来扩展 Incident Commander。

## 采集器接口

```typescript
interface Collector {
  readonly source: DataSource
  collect: (timeRange: { start: string; end: string }) => Promise<CollectionResult>
}
```

## 基本示例

```typescript
import type { CollectionResult, Collector, TimelineEvent } from 'incident-commander'

class LogFileCollector implements Collector {
  readonly source = 'manual' as const

  constructor(private filePath: string) {}

  async collect(timeRange: { start: string; end: string }): Promise<CollectionResult> {
    const startTime = performance.now()
    // ... 实现采集逻辑
    return {
      source: this.source,
      success: true,
      events: [],
      duration: Math.round(performance.now() - startTime),
    }
  }
}
```

## 最佳实践

1. **始终处理错误** — 返回 `{ success: false, error: '...' }` 而非抛出异常
2. **包含持续时间** — 使用 `performance.now()` 测量采集时间
3. **保留原始数据** — 在事件上设置 `raw` 以便调试
4. **按时间范围过滤** — 不要返回请求窗口之外的事件

详细说明请参考 [英文文档](/advanced/custom-collector)。
