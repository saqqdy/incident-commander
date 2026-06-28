# Incident Commander — Claude Code Guide

## Project Overview

Incident Commander 是一个 Claude Code Skill 插件，帮助 SRE / On-call 工程师自动采集多源数据、生成事故时间线和根因分析，输出结构化的 Post-Mortem 文档。

## Architecture

```
.claude/skills/incident-commander/  ← Skill 定义（核心产品）
src/                                ← TypeScript 源码（程序化 API）
  ├── collectors/                   ← 数据采集器
  ├── analyzers/                    ← 分析引擎
  ├── reporters/                    ← 报告生成器
  ├── utils/                        ← 工具函数
  └── mock/                         ← 测试数据
internal/                           ← 内部规划文档
docs/                               ← VitePress 文档站点
```

## Development Commands

```bash
pnpm install          # 安装依赖
pnpm run lint         # ESLint 检查 + 自动修复
pnpm run typecheck    # TypeScript 类型检查
pnpm run test         # 运行测试 (vitest)
pnpm run test:watch   # 测试监听模式
pnpm run test:coverage # 测试覆盖率
pnpm run build        # 构建 (ESM + CJS)
pnpm run dev          # 监听模式开发
pnpm run docs:dev     # 文档开发服务器
pnpm run docs:build   # 文档构建
pnpm run demo         # CLI 演示
```

## Key Principles

1. **证据驱动** — 所有结论必须有数据源支撑，标注置信度
2. **多源关联** — GitHub/Sentry/Grafana/Kibana/Deploy 跨源因果推理
3. **优雅降级** — MCP → CLI → 手动 → 问答，层层降级不死
4. **渐进式分析** — 采集 → 时间线 → RCA → Post-Mortem 分步可中断

## Code Style

- TypeScript 5.9+，strict mode
- 文件命名：kebab-case
- 导出：named exports，不用 default
- 注释密度：关键模块加 JSDoc，公共 API 必须有
- 测试：vitest，放在同级 `*.test.ts`
- 路径别名：`#lib/*` 映射到 `./src/*`

## Version Roadmap

| 版本 | 代号 | 核心主题 | 状态 |
|------|------|----------|------|
| v0.1.0 | First Blood | 项目基建 + MVP（GitHub 单源） | ✅ 当前 |
| v0.2.0 | Crossfire | 多源集成 + 因果推理 | 🚧 |
| v0.3.0 | Commander | 交互增强 + 降级策略 | 📋 |
| v0.4.0 | Deep Dive | 日志 + 部署集成 | 📋 |
| v1.0.0 | Battle Ready | 生产就绪 + 正式发布 | 📋 |

完整路线图见 `internal/version-roadmap.md`

## Skill Files

| 文件 | 用途 |
|------|------|
| [skill.md](./skill.md) | Skill 入口，定义命令和流程 |
| [collect.md](./collect.md) | 数据采集指令 |
| [timeline.md](./timeline.md) | 时间线构建指令 |
| [rca.md](./rca.md) | 根因分析指令 |
| [postmortem.md](./postmortem.md) | Post-Mortem 生成指令 |

## Programmatic API

```typescript
import { collectGitHub, buildTimeline, analyzeRCA, generatePostmortem } from 'incident-commander'

// 采集 GitHub 事件
const events = await collectGitHub({ owner, repo, since, until })

// 构建时间线
const timeline = buildTimeline(events)

// 根因分析
const rca = analyzeRCA(timeline)

// 生成 Post-Mortem
const report = generatePostmortem(timeline, rca)
```

## Testing

```bash
# 运行所有测试
pnpm run test

# 监听模式
pnpm run test:watch

# 覆盖率报告
pnpm run test:coverage
```

## Documentation

文档使用 VitePress 构建，位于 `docs/` 目录：

- `docs/guide/` — 使用指南（英文）
- `docs/zh/` — 中文文档
- `docs/api/` — API 参考

---

*最后更新：2026-06-28*