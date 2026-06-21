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

```text
/incident timeline    # 仅生成时间线
/incident rca         # 仅做根因分析
/incident postmortem  # 仅生成 Post-Mortem
/incident brief       # 生成事故简报
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
  const collector = new GitHubCollector({
    owner: 'saqqdy',
    repo: 'js-cool',
  })

  const { events, duration } = await collector.collect({
    start: '2026-06-20T10:00:00Z',
    end: '2026-06-20T12:00:00Z',
  })

  console.log(`采集到 ${events.length} 个事件，耗时 ${duration}ms`)

  const timeline = buildTimeline(events)
  const report = generatePostMortem('API 500 故障', timeline, rca, impact)
  console.log(renderPostMortemMarkdown(report))
}
```

## 下一步

- [数据采集](/zh/guide/collect) — 了解每个数据源
- [时间线构建](/zh/guide/timeline) — 理解事件如何合并
- [MCP 配置](/zh/advanced/mcp-config) — 连接 Sentry、Grafana 等
