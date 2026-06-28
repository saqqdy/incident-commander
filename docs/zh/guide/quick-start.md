# 快速上手

5 分钟内完成你的第一次故障分析。

## 零配置演示

无需任何配置，最快体验方式：

```bash
pnpm run demo
```

或在浏览器中试试交互式[体验场 →](/zh/playground)

## 交互模式

最简单的入门方式 — 让 Incident Commander 一步步引导你：

```text
/incident
```

这将启动一个交互式引导，依次询问：
1. **时间范围** — 故障发生的时间段？
2. **数据源** — 从哪些平台采集数据？
3. **上下文** — 已知的故障细节？

## 一键模式

已经知道时间范围？跳过提问：

```text
/incident start 2h
```

自动执行：
1. 采集过去 2 小时的 GitHub 事件
2. 构建时间线（排序 + 去重）
3. 执行根因分析
4. 生成 Post-Mortem 文档

### 自定义时间范围

```text
/incident start 2026-06-20T10:00..2026-06-20T12:00
```

## 单独命令

可以分别运行每个步骤以获得更多控制：

### 仅生成时间线

```text
/incident timeline
```

输出：

```text
📊 Timeline built — 18 events
| Time (UTC) | Event | Source |
|-----------|-------|--------|
| 10:00 | 📝 alice: feat: update user-service API to v2 | GitHub |
| 10:02 | 🚀 Deploy: production ✅ | GitHub |
| 10:05 | 🔴 Error rate spike on /api/users (500 errors) | Sentry |
| 10:08 | ⚠️ Alert: P95 latency > 2s on user-service | Grafana |
| 10:30 | ⏪ Rollback: production to v2.4.0 | GitHub |
| 10:35 | ✅ Error rate recovered | Sentry |

Key turning points: First error (10:05), Rollback (10:30), Recovery (10:35)
```

### 仅做根因分析

```text
/incident rca
```

输出：

```text
🧠 Root Cause Analysis

Causal Chain:
1. 📝 Deploy v2.5.0 (10:02) → includes user-service Breaking Change
2. 🔴 Error spike (10:05) → v2 API removed old endpoint, downstream 500 errors
3. ⚠️ Latency > 2s (10:08) → retry storm caused service overload
4. ⏪ Rollback (10:30) → old endpoint restored
5. ✅ Recovered (10:35) → rollback confirmed effective

Confidence: 🟢 High
Alternative hypothesis: another service may have deployed an incompatible change (low probability)
```

### 仅生成 Post-Mortem

```text
/incident postmortem
```

生成完整的 Markdown 文档，可直接审查。

### 事故简报

```text
/incident brief
```

输出：

```text
🔔 Incident Brief
- Title: user-service API Breaking Change
- Severity: SEV2
- Duration: 35 minutes
- Impact: ~5000 users affected
- Status: Resolved
```

## 编程式调用

```typescript
import {
  GitHubCollector,
  buildTimeline,
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

async function main() {
  // 1. 从 GitHub 采集事件
  const collector = new GitHubCollector({
    owner: 'saqqdy',
    repo: 'js-cool',
  })

  const { events, duration } = await collector.collect({
    start: '2026-06-20T10:00:00Z',
    end: '2026-06-20T12:00:00Z',
  })

  console.log(`Collected ${events.length} events in ${duration}ms`)

  // 2. 构建时间线
  const timeline = buildTimeline(events)
  console.log(`Turning points: ${timeline.turningPoints.map(e => e.title).join(', ')}`)

  // 3. 生成 Post-Mortem（需要 RCA 和 Impact 数据）
  const report = generatePostMortem('API 500 Error', timeline, rca, impact)
  const markdown = renderPostMortemMarkdown(report)
  console.log(markdown)
}
```

## 下一步

- [数据采集](/zh/guide/collect) — 了解每个数据源
- [时间线构建](/zh/guide/timeline) — 理解事件如何合并
- [MCP 配置](/zh/advanced/mcp-config) — 连接 Sentry、Grafana 等
