# 介绍

**Incident Commander** 是一个 Claude Code Skill 插件，帮助 SRE / On-call 工程师自动收集多源数据、生成事故时间线与根因分析，并输出结构化 Post-Mortem 文档。

## 为什么需要 Incident Commander？

当故障发生时，信息散落在监控、日志、部署记录和聊天中。构建时间线需要 30–60 分钟。写一份 Post-Mortem 需要 1–2 小时。而根因分析往往靠直觉。

Incident Commander 自动化了繁琐的部分 — 数据采集、时间线构建、因果推理和报告生成 — 让你可以专注于理解和预防故障，而不是做文档搬运工。

### 传统方式

```text
1. 打开 Sentry → 切到 Grafana → 查 Git 变更 → 看部署记录
2. 手动排序事件，容易遗漏或错序
3. 靠直觉判断根因
4. 复制空白模板手动填写 — 至少 2 小时
```

### Incident Commander 方式

```text
/incident start 2h
  → 并行采集 GitHub + Sentry + Grafana（10 秒）
  → 合并、排序、去重事件生成时间线
  → AI 交叉验证因果链，标注置信度
  → 生成完整 Post-Mortem — 10 分钟审查即可发出
```

## 核心特性

- **多源数据采集** — GitHub / Sentry / Grafana / Kibana / 部署平台，并行采集
- **自动时间线构建** — 统一、有序、去重，自动标注事件类型和关键转折点
- **AI 因果推理** — 语义感知的交叉验证，附带置信度（高/中/低）和替代假设
- **结构化 Post-Mortem 生成** — 完整报告包含摘要、时间线、RCA、影响、修复和行动项
- **事故简报** — 面向利益相关者的精简格式
- **优雅降级** — MCP → CLI → 手动粘贴 → 交互式问答

## 两种使用方式

### 方式一：Claude Code Skill（推荐）

最完整的体验 — 让 AI 在对话中处理整个分析流程。

```text
/incident start 2h                 # 一条命令分析过去 2 小时
/incident timeline                 # 仅生成时间线
/incident rca                      # 仅做根因分析
/incident postmortem               # 仅生成 Post-Mortem
```

### 方式二：编程式调用

适用于 CI/CD 自动化或自定义工具链。

```typescript
import {
  GitHubCollector,
  buildTimeline,
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

const collector = new GitHubCollector({ owner: 'saqqdy', repo: 'js-cool' })
const { events } = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

const timeline = buildTimeline(events)
const report = generatePostMortem('API 500 故障', timeline, rca, impact)
console.log(renderPostMortemMarkdown(report))
```

## 数据源支持

| 数据源 | 状态 | 采集方式 | 可用版本 |
|--------|------|----------|----------|
| **GitHub** | ✅ 已支持 | `gh` CLI / GitHub MCP | v0.1.0 |
| **Sentry** | ⏳ 开发中 | Sentry MCP / REST API | v0.2.0 |
| **Grafana** | ⏳ 开发中 | Grafana MCP / REST API | v0.2.0 |
| **Kibana/ES** | 📋 计划中 | ES MCP / REST API | v0.4.0 |
| **Deploy** | 📋 计划中 | GitHub Deployments / Vercel | v0.4.0 |
| **Slack** | 📋 计划中 | Slack MCP | v1.1.0 |
| **飞书** | 📋 计划中 | 飞书 MCP | v1.1.0 |
