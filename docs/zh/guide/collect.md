# 数据采集

Incident Commander 从多个数据源并行采集事件，然后将它们合并为统一时间线。

## 采集原理

```
/incident start 2h
       │
       ├─▶ GitHub 采集器    → 提交、PR、工作流运行
       ├─▶ Sentry 采集器    → 错误事件、Issues、面包屑
       ├─▶ Grafana 采集器   → 指标异常、告警
       └─▶ ... 更多数据源
       │
       └─▶ 合并结果 → TimelineEvent[]
```

每个采集器返回一个 `CollectionResult`：

```typescript
interface CollectionResult {
  source: DataSource       // 'github' | 'sentry' | 'grafana' | ...
  success: boolean         // 采集是否成功
  events: TimelineEvent[]  // 采集的事件
  duration: number         // 采集耗时（毫秒）
  error?: string           // 失败时的错误信息
}
```

## GitHub 采集器

GitHub 采集器使用 `gh` CLI 获取：

| 资源 | API | 事件类型 |
|------|-----|----------|
| 提交 | `gh api repos/{owner}/{repo}/commits` | `code_change` |
| Pull Request | `gh pr list --json ...` | `code_change` |
| 工作流运行 | `gh run list --json ...` | `deploy` 或 `error` |

### 使用方式

```typescript
import { GitHubCollector } from 'incident-commander'

const collector = new GitHubCollector({
  owner: 'saqqdy',
  repo: 'js-cool',
})

const result = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

console.log(`GitHub: ${result.events.length} 个事件，耗时 ${result.duration}ms`)
```

### 要求

- `gh` CLI 已安装并认证
- 有目标仓库的访问权限

### 降级链

```text
GitHub MCP Server ──(不可用)──▶ gh CLI ──(不可用)──▶ 引导手动输入
```

## Sentry 采集器（v0.2.0）

从 Sentry 采集错误事件、Issues 和面包屑。

| 资源 | 方法 | 事件类型 |
|------|------|----------|
| 错误事件 | Sentry MCP / REST API | `error` |
| Issues | Sentry MCP / REST API | `error` |
| 面包屑 | Sentry MCP / REST API | `log_anomaly` |

## Grafana 采集器（v0.2.0）

从 Grafana 采集指标异常和告警事件。

| 资源 | 方法 | 事件类型 |
|------|------|----------|
| 指标异常 | Grafana MCP / REST API | `metric_anomaly` |
| 告警 | Grafana MCP / REST API | `alert` |

## 并行采集

当配置了多个数据源时，Incident Commander 并行采集：

```text
📊 采集完成
- GitHub: 12 个提交、3 个 PR、2 次部署 (1.2s)
- Sentry: 8 个错误事件、2 个 Issues (0.8s)
- Grafana: 3 个指标异常 (1.5s)
- 共计: 25 个事件
- 实际耗时: 1.5s（并行），串行需 3.5s
```

失败的数据源会被优雅处理 — 部分结果仍然可以使用：

```text
📊 采集完成（部分）
- GitHub: 12 个提交、3 个 PR、2 次部署 (1.2s)
- Sentry: ❌ 认证失败 (0.1s)
- Grafana: 3 个指标异常 (1.5s)
- 共计: 17 个事件（来自 2 个数据源）
- 警告: Sentry 采集失败 — 请检查 token
```

## 手动数据采集

当 MCP 服务器和 CLI 工具都不可用时，可以手动提供数据：

```text
/incident collect --manual
```

这会引导你粘贴或描述事件：

```text
📝 粘贴或描述事件（每行一个，Ctrl+D 结束）：
> 10:05 时，我们看到 /api/users 出现 500 错误飙升
> 10:30 时，我们回滚生产环境到 v2.4.0
> 10:35 时，错误恢复
```

这些手动事件会被转换为 `TimelineEvent` 对象，像其他数据源一样包含在时间线中。

## 下一步

- [时间线构建](/zh/guide/timeline) — 事件如何合并和排序
- [MCP 配置](/zh/advanced/mcp-config) — 配置更多数据源