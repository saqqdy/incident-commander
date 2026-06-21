# GitHubCollector

从 GitHub 采集指定时间窗口内的提交、Pull Request 和工作流运行。

## 导入

```typescript
import { GitHubCollector } from 'incident-commander'
```

## 构造函数

```typescript
new GitHubCollector(options: GitHubCollectorOptions)
```

### GitHubCollectorOptions

| 属性 | 类型 | 说明 |
|------|------|------|
| `owner` | `string` | 仓库所有者（用户或组织） |
| `repo` | `string` | 仓库名称 |

## 方法

### collect()

```typescript
collect(timeRange: { start: string; end: string }): Promise<CollectionResult>
```

## 示例

```typescript
const collector = new GitHubCollector({ owner: 'saqqdy', repo: 'js-cool' })

const result = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

console.log(`采集到 ${result.events.length} 个事件，耗时 ${result.duration}ms`)
```

## 降级链

```text
GitHub MCP Server → gh CLI → 引导手动输入 → 标记数据缺失
```
