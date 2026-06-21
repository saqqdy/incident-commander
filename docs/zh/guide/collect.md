# 数据采集

Incident Commander 从多个数据源并行采集事件，然后将它们合并为统一时间线。

## 采集原理

```text
/incident start 2h
       │
       ├─▶ GitHub 采集器   → 提交、PR、工作流运行
       ├─▶ Sentry 采集器   → 错误事件、Issues、面包屑
       ├─▶ Grafana 采集器  → 指标异常、告警
       └─▶ ... 更多数据源
       │
       └─▶ 合并结果 → TimelineEvent[]
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

const collector = new GitHubCollector({ owner: 'saqqdy', repo: 'js-cool' })
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

## 下一步

- [时间线构建](/zh/guide/timeline) — 事件如何合并和排序
- [MCP 配置](/zh/advanced/mcp-config) — 配置更多数据源
