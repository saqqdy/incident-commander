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

在指定时间范围内采集 GitHub 事件。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `timeRange.start` | `string` | ISO 8601 起始时间戳 |
| `timeRange.end` | `string` | ISO 8601 结束时间戳 |

**返回值：** [`CollectionResult`](/zh/api/types/collection-result)

## 采集资源

| 资源 | gh CLI 命令 | 事件类型 |
|------|------------|---------|
| 提交 | `gh api repos/{owner}/{repo}/commits` | `code_change` |
| Pull Request | `gh pr list --json ...` | `code_change` |
| 工作流运行 | `gh run list --json ...` | `deploy` / `error` |

## 示例

### 基本采集

```typescript
const collector = new GitHubCollector({
  owner: 'saqqdy',
  repo: 'js-cool',
})

const result = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

console.log(`采集到 ${result.events.length} 个事件，耗时 ${result.duration}ms`)
```

### 错误处理

```typescript
const result = await collector.collect(timeRange)

if (!result.success) {
  console.error('采集失败:', result.error)
} else {
  console.log(`成功: ${result.events.length} 个事件`)
}
```

## 要求

- **`gh` CLI** 必须已安装并完成认证
- **仓库访问权限** — 认证用户必须有目标仓库的读取权限
- **速率限制** — 采集器每种资源类型最多获取 100 条记录

## 降级链

```text
GitHub MCP Server → gh CLI → 引导手动粘贴 → 标记数据缺失
```
