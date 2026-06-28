# 🚨 Incident Commander — 故障指挥官

> 线上故障发生时，信息散落在监控、日志、部署记录、聊天里，人肉拼时间线效率极低。<br>Incident Commander 让 Claude Code 自动采集多源数据、推理因果链、生成结构化 Post-Mortem——把 2 小时的复盘缩短到 10 分钟。

[![npm version](https://img.shields.io/npm/v/incident-commander.svg)](https://www.npmjs.com/package/incident-commander)
[![license](https://img.shields.io/npm/l/incident-commander.svg)](https://github.com/saqqdy/incident-commander/blob/main/LICENSE)

[English](README.md)

---

## 🎯 解决什么问题

| 场景 | 传统方式 | Incident Commander |
|------|----------|-------------------|
| 故障发生 | 打开 Sentry 看错误 → 切 Grafana 看指标 → 翻 Git 变更 → 查部署记录，来回切换 | `/incident start 2h` 一键采集全部数据源 |
| 拼时间线 | 人脑记忆 + 手动排序，容易遗漏和错位 | 自动合并排序去重，标注事件类型和数据来源 |
| 写 RCA | 凭经验推断，容易遗漏替代假设 | AI 交叉推理因果链，标注置信度 + 至少 1 个替代假设 |
| 写 Post-Mortem | 复制模板手动填充，2 小时起步 | 自动生成结构化报告，10 分钟审阅即可发布 |

---

## ✨ 核心特性

### 🔍 多源数据采集

并行采集 GitHub / Sentry / Grafana / Kibana / 部署平台的事件数据：

```
📊 采集完成
- GitHub: 12 commits, 3 PRs, 2 deploys (耗时 1.2s)
- Sentry: 8 error events, 2 issues (耗时 0.8s)
- Grafana: 3 metric anomalies detected (耗时 1.5s)
- 总计: 25 个事件
```

### 📊 自动时间线构建

将多源事件合并为统一的、有序的、去重的时间线，自动标注事件类型：

| 时间 (UTC) | 事件 | 来源 |
|-----------|------|------|
| 10:00 | 📝 alice: feat: update user-service API to v2 | GitHub |
| 10:02 | 🚀 Deploy: production ✅ | GitHub |
| 10:05 | 🔴 Error rate spike on /api/users (500 errors) | Sentry |
| 10:08 | ⚠️ Alert: P95 latency > 2s on user-service | Grafana |
| 10:30 | ⏪ Rollback to v2.4.0 | GitHub |
| 10:35 | ✅ Error rate recovered | Sentry |

自动识别**关键转折点**（首次错误、部署后异常、回滚时刻、恢复时刻）。

### 🧠 AI 因果推理

不是简单的"时间先后=因果"，而是基于语义关联的交叉推理：

```
1. 📝 Deploy v2.5.0 (10:02) → 包含 user-service Breaking Change
2. 🔴 Error spike (10:05) → v2 API 删除了旧端点，下游 500 错误
3. ⚠️ Latency > 2s (10:08) → 大量重试导致服务过载
4. ⏪ Rollback (10:30) → 回滚后旧端点恢复
5. ✅ Recovered (10:35) → 确认回滚有效

置信度：🟢 High — 部署与错误时间高度吻合，回滚后立即恢复，因果链完整
替代假设：可能其他服务同时发布不兼容变更（概率低，数据不足验证）
```

每条结论都标注**置信度**（High/Medium/Low）和**替代假设**——毕竟 AI 也会犯错，透明比正确更重要。

### 📝 结构化 Post-Mortem 生成

一键生成完整的复盘报告，包含：

- **概要**：严重等级、持续时间、影响范围
- **时间线**：完整事件表格 + 关键转折点
- **根因分析**：因果链 + 直接原因 + 贡献因素 + 根本原因
- **影响评估**：用户数、功能范围、数据影响
- **修复与预防**：应急措施、根本修复、短期预防、长期改进
- **行动项**：每个措施指定 Owner + Deadline + 优先级

> 审阅 10 分钟即可发出，而非从零写 2 小时。

### 🔔 事故简报

面向利益相关者的精简格式：

```
🔔 事故简报
- 事故标题：user-service API Breaking Change
- 严重等级：SEV2
- 持续时间：35分钟
- 影响概述：约 5000 用户受影响
- 当前状态：已恢复
```

### 🛡️ 优雅降级

数据源不可用时自动切换采集方式，而非报错：

```
MCP Server 不可用? → 尝试 CLI 工具 → 引导手动粘贴 → 标记数据缺失
全部不可用?       → 纯交互模式（问答采集信息）
```

---

## 🚀 如何体验

### 方式一：Claude Code 插件（推荐）

本项目是 **Claude Code 插件**，通过 Marketplace 一键安装。

#### 方法 A：插件市场（推荐）

```bash
# 在 Claude Code 中运行：
/plugin marketplace add saqqdy/incident-commander
/plugin install incident-commander
```

#### 方法 B：本地安装

```bash
# 1. 进入你的项目
cd your-project

# 2. 安装 npm 包
pnpm add -D incident-commander

# 3. 复制插件文件
mkdir -p .claude/skills
cp -r node_modules/incident-commander/.claude/skills/incident-commander .claude/skills/
```

#### 可用命令

在 Claude Code 中输入以下命令：

| 命令 | 描述 | 示例 |
|------|------|------|
| `/incident` | 交互式引导 | `/incident` |
| `/incident start` | 一键分析 | `/incident start 2h` |
| `/incident timeline` | 仅生成时间线 | `/incident timeline` |
| `/incident rca` | 根因分析 | `/incident rca` |
| `/incident postmortem` | Post-Mortem 文档 | `/incident postmortem` |
| `/incident brief` | 事故简报 | `/incident brief` |

### 方式二：零配置演示（最快）

```bash
# 将项目 clone 到你正在用 Claude Code 开发的项目目录
cd your-project
git clone https://github.com/saqqdy/incident-commander.git .incident-commander

# 或者直接复制 Skill 目录到你的项目中
cp -r incident-commander/.claude/skills/ .claude/skills/
```

无需 `gh` CLI、API Key 和代码，一条命令即可体验完整流程：

```bash
git clone https://github.com/saqqdy/incident-commander.git
cd incident-commander
pnpm install && pnpm run build

# 完整流程演示（采集 → 时间线 → RCA → Post-Mortem）
pnpm run demo

# 仅查看时间线
node dist/cli.js timeline --mock
```

使用内置模拟数据，场景与示例一致（user-service API Breaking Change → 500 错误）。

### 方式三：编程调用

复制 `mcp-configs/` 下的配置到 `.claude/settings.json`，填入真实的 Token：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_你的token" }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sentry"],
      "env": { "SENTRY_AUTH_TOKEN": "你的sentry_token" }
    }
  }
}
```

配置后 `/incident start 2h` 将同时采集 GitHub + Sentry 数据，实现多源关联推理。

### 方式四：查看示例输出

适合在 CI/CD 自动化、自定义工具链中使用。

```bash
pnpm add incident-commander
```

```typescript
import {
  GitHubCollector,
  buildTimeline,
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

// 1. 采集 GitHub 事件（commits / PRs / workflow runs）
const collector = new GitHubCollector({
  owner: 'saqqdy',
  repo: 'js-cool',
})
const { events, duration } = await collector.collect({
  start: '2026-06-20T10:00:00Z',
  end: '2026-06-20T12:00:00Z',
})
console.log(`采集完成：${events.length} 个事件，耗时 ${duration}ms`)

// 2. 构建时间线（排序 + 去重 + 转折点识别）
const timeline = buildTimeline(events)
console.log(`关键转折点：${timeline.turningPoints.map(e => e.title).join(', ')}`)

// 3. 生成 Post-Mortem（需要 RCA 和 Impact 数据）
const report = generatePostMortem('API 500 Error', timeline, rca, impact)
const markdown = renderPostMortemMarkdown(report)
console.log(markdown)
```

### 方式三：编程调用

不想配置环境？直接看示例感受效果：

- [示例时间线](examples/sample-timeline.md) — 一个典型的线上故障全事件时间线
- [示例 Post-Mortem](examples/sample-postmortem.md) — 完整的事故复盘报告

---

## 🆚 竞品对比

### vs PagerDuty / Opsgenie 等传统 On-call 平台

| 维度 | PagerDuty / Opsgenie | Incident Commander |
|------|---------------------|-------------------|
| 故障发现 | ✅ 告警聚合 + 值班调度 | ❌ 不做告警（专注分析） |
| 时间线构建 | ⚠️ 只聚合告警事件，不含代码变更 | ✅ 融合代码提交、部署、错误、指标、日志 |
| 根因分析 | ❌ 不做推理，需要人判断 | ✅ AI 交叉推理因果链 + 置信度标注 |
| Post-Mortem | ⚠️ 提供空白模板，手动填写 | ✅ 自动生成填充好的报告，审阅即可 |
| 部署方式 | SaaS 付费 | 本地运行，开源免费 |
| **定位** | 告警入口 + 值班调度 | 故障分析 + 复盘文档 |

> Incident Commander 不替代 PagerDuty，而是互补——PagerDuty 发现问题，Incident Commander 分析问题和生成复盘。

### vs Datadog Incident Management

| 维度 | Datadog IM | Incident Commander |
|------|-----------|-------------------|
| 数据源 | ✅ 深度绑定 Datadog 生态 | ✅ 开放接入 GitHub / Sentry / Grafana / Kibana |
| AI 分析 | ⚠️ 有限的异常检测 | ✅ 深度因果推理 + 替代假设 |
| 跨平台关联 | ❌ 仅限 Datadog 内数据 | ✅ 跨平台交叉验证 |
| 成本 | 企业级定价 | 开源免费 |
| **定位** | Datadog 生态内的故障管理 | 任意技术栈的故障分析 |

### vs 手动复盘人肉流程

| 维度 | 手动复盘 | Incident Commander |
|------|---------|-------------------|
| 时间线构建 | 30-60 分钟，来回切页面 | 10 秒自动生成 |
| RCA 深度 | 依赖个人经验，容易遗漏 | AI 系统性推理 + 自动补充替代假设 |
| Post-Mortem | 1-2 小时从零写 | 10 分钟审阅修改 |
| 知识传承 | 散落在不同人的脑子和系统里 | 结构化归档，可检索可复用 |
| 一致性 | 因人而异 | 标准化模板 + 统一输出格式 |

### 核心差异化

1. **AI 语义推理 vs 规则匹配** — 千变万化的日志和错误，只有 AI 能理解"这段代码的行为改了"
2. **开放生态 vs 厂商绑定** — 不锁定任何单一监控平台，GitHub + Sentry + Grafana + Kibana 随意组合
3. **Claude Code 原生 vs 独立工具** — 直接在开发流程中使用，不需要切换上下文

---

## 🔌 数据源支持

| 数据源 | 状态 | 采集方式 | 可用版本 |
|--------|------|----------|---------|
| **GitHub** | ✅ 已支持 | `gh` CLI / GitHub MCP | v0.1.0 |
| **Sentry** | ⏳ 开发中 | Sentry MCP / REST API | v0.2.0 |
| **Grafana** | ⏳ 开发中 | Grafana MCP / REST API | v0.2.0 |
| **Kibana/ES** | 📋 计划中 | ES MCP / REST API | v0.4.0 |
| **Deploy** | 📋 计划中 | GitHub Deployments / Vercel | v0.4.0 |
| **Slack** | 📋 规划中 | Slack MCP | v1.1.0 |
| **飞书** | 📋 规划中 | 飞书 MCP | v1.1.0 |

---

## 🗂️ 项目结构

```
incident-commander/
├── .claude/skills/incident-commander/   # Skill Prompt 定义（核心）
│   ├── skill.md                         # 主入口 / 命令路由
│   ├── collect.md                       # 数据采集指令
│   ├── timeline.md                      # 时间线构建指令
│   ├── rca.md                           # 根因分析指令
│   ├── postmortem.md                    # Post-Mortem 生成指令
│   └── CLAUDE.md                        # 开发指南
├── .claude-plugin/                      # 插件元数据
│   ├── plugin.json                      # 插件信息
│   └── marketplace.json                 # Marketplace 发布配置
├── src/                                 # TypeScript 源码
│   ├── types.ts                         # 核心类型定义
│   ├── cli.ts                           # CLI 入口（demo & timeline --mock）
│   ├── collectors/github.ts             # GitHub 采集器
│   ├── analyzers/timeline.ts            # 时间线构建器（排序/去重/转折点）
│   ├── reporters/postmortem.ts          # 报告生成器（Markdown 渲染）
│   ├── mock/                            # 演示模式模拟数据
│   │   └── data.ts                      # 示例事件、RCA 及影响评估
│   └── utils/                           # 工具函数
├── templates/                           # 报告模板
│   ├── postmortem.md                    # Post-Mortem 模板
│   └── incident-brief.md               # 事故简报模板
├── mcp-configs/                         # MCP 服务器配置示例
│   ├── github.json
│   ├── sentry.json
│   └── grafana.json
├── examples/                            # 示例输出
│   ├── sample-timeline.md
│   └── sample-postmortem.md
└── internal/                            # 内部规划文档
    ├── development-plan.md
    └── version-roadmap.md
```

---

## 🛠️ 开发

```bash
pnpm install          # 安装依赖
pnpm run lint         # ESLint 检查 + 自动修复
pnpm run typecheck    # TypeScript 类型检查
pnpm run test         # 运行测试
pnpm run build        # 构建（输出 ESM + CJS）
pnpm run dev          # 监听模式开发
```

### 技术栈

- **语言**：TypeScript 5.9+
- **构建**：rolldown
- **Lint**：@eslint-sets/eslint-config (ESLint 9 flat config)
- **格式化**：prettier + prettier-config-common
- **测试**：vitest
- **包管理**：pnpm 9

---

## 📋 版本路线

| 版本 | 代号 | 主题 | 状态 |
|------|------|------|------|
| v0.1.0 | First Blood | 项目基建 + MVP（GitHub 单源 + 时间线 + Post-Mortem） | ✅ 已完成 |
| v0.2.0 | Crossfire | Sentry + Grafana 多源集成 + AI 因果推理 | ⏳ 开发中 |
| v0.3.0 | Commander | 交互增强 + 降级策略 + 一键模式 | 📋 计划中 |
| v0.4.0 | Deep Dive | Kibana 日志 + 部署历史接入 | 📋 计划中 |
| v1.0.0 | Battle Ready | 生产就绪 + npm 发布 | 📋 计划中 |
| v2.0.0 | War Room | 知识库 + 预测模式 + Runbook 自动化 | 📋 远期规划 |

详见 → [version-roadmap.md](internal/version-roadmap.md)

---

## 🤝 贡献

欢迎提交 Issue 和 PR！请确保：

- `pnpm run lint` 通过
- `pnpm run typecheck` 通过
- `pnpm run test` 通过
- 新功能需附带测试

---

## 📄 License

[MIT](./LICENSE)
