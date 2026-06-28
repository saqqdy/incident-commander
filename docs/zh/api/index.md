# API 概览

Incident Commander 提供编程式 API，适用于 CI/CD 自动化和自定义工具链集成。

## 安装

::: code-group

```bash [pnpm]
pnpm add incident-commander
```

```bash [npm]
npm install incident-commander
```

```bash [yarn]
yarn add incident-commander
```

:::

## 快速参考

### 采集器

| 类 | 说明 |
|-----|------|
| [GitHubCollector](/zh/api/collectors/github) | 通过 `gh` CLI 采集提交、PR 和工作流运行 |

### 分析器

| 函数 | 说明 |
|------|------|
| [buildTimeline()](/zh/api/analyzers/timeline) | 将事件合并为排序、去重的时间线 |

### 报告器

| 函数 | 说明 |
|------|------|
| [generatePostMortem()](/zh/api/reporters/postmortem) | 生成完整的 Post-Mortem 报告对象 |
| [renderPostMortemMarkdown()](/zh/api/reporters/render-markdown) | 将报告渲染为 Markdown 字符串 |

### 类型

| 类型 | 说明 |
|------|------|
| [TimelineEvent](/zh/api/types/timeline-event) | 单个时间线事件 |
| [CollectionResult](/zh/api/types/collection-result) | 采集器返回结果 |
| [TimelineResult](/zh/api/types/timeline-result) | buildTimeline() 返回结果 |
| [RCAResult](/zh/api/types/rca-result) | 根因分析结果 |
| [PostMortemReport](/zh/api/types/postmortem-report) | 完整 Post-Mortem 报告 |
| [ImpactResult](/zh/api/types/impact-result) | 影响评估结果 |
| [IncidentConfig](/zh/api/types/config) | 配置对象 |

### 工具函数

| 函数 | 说明 |
|------|------|
| [toISO()](/zh/api/utils/format) | 将任意时间戳转换为 ISO 8601 |
| [formatDuration()](/zh/api/utils/format) | 将分钟数格式化为可读的持续时间 |
| [eventToMarkdownRow()](/zh/api/utils/format) | 将事件格式化为 Markdown 表格行 |
| [eventTypeBadge()](/zh/api/utils/format) | 获取事件类型的 emoji 标识 |
| [sourceLabel()](/zh/api/utils/format) | 获取数据源的标签 |
| [getDefaultConfig()](/zh/api/utils/config) | 获取默认配置 |
| [mergeConfig()](/zh/api/utils/config) | 合并用户配置与默认值 |

## 基本用法

```typescript
import {
  GitHubCollector,
  buildTimeline,
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

// 1. 采集
const collector = new GitHubCollector({ owner: 'saqqdy', repo: 'js-cool' })
const { events } = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})

// 2. 分析
const timeline = buildTimeline(events)

// 3. 报告
const report = generatePostMortem('API 500 故障', timeline, rca, impact)
const markdown = renderPostMortemMarkdown(report)
```
