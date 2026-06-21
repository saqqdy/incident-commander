# 📦 Incident Commander — 版本规划

> 将开发计划中的 Phase 映射到语义化版本，明确每个版本的交付范围、验收标准和发布节奏。

---

## 版本总览

```
v0.1.0 ────── v0.2.0 ────── v0.3.0 ────── v0.4.0 ────── v1.0.0 ────── v1.x / v2.0
  │              │              │              │              │              │
  │              │              │              │              │              │
Phase 0+1      Phase 2        Phase 3        Phase 4        Phase 5       后续演进
项目基建        多源集成        交互增强        日志+部署       打磨发布       长期迭代
+ MVP                         + 降级策略      集成
```

| 版本 | 代号 | 核心主题 | 数据源 | 预计周期 |
|------|------|----------|--------|----------|
| v0.1.0 | First Blood | 项目基建 + MVP（GitHub 单源） | GitHub | Week 1 |
| v0.2.0 | Crossfire | 多源集成 + 因果推理 | +Sentry +Grafana | Week 2-3 |
| v0.3.0 | Commander | 交互增强 + 降级策略 | 同 v0.2 | Week 3-4 |
| v0.4.0 | Deep Dive | 日志 + 部署集成 | +Kibana +Deploy | Week 4-5 |
| v1.0.0 | Battle Ready | 生产就绪 + 正式发布 | 全源 | Week 5-6 |
| v2.0.0 | War Room | 知识库 + 预测模式 | +IM +Knowledge Base | 后续演进 |

---

## v0.1.0 — First Blood（项目基建 + MVP）

> 🎯 **里程碑**：第一次用 `/incident` 命令跑通从输入时间段到输出时间线的完整流程

### 交付清单

| # | 任务 | 交付物 | 验收标准 |
|---|------|--------|----------|
| 1 | 初始化项目骨架 | 目录结构、package.json、CLAUDE.md | `tree` 输出与规划一致 |
| 2 | 编写 Skill 入口 | `.claude/skills/incident-commander/skill.md` | `/incident` 可被 Claude Code 识别 |
| 3 | 编写采集子 Prompt | `.claude/skills/incident-commander/collect.md` | 包含 GitHub 采集指令 |
| 4 | 编写时间线子 Prompt | `.claude/skills/incident-commander/timeline.md` | 定义时间线输出格式 |
| 5 | 编写 RCA 子 Prompt | `.claude/skills/incident-commander/rca.md` | 定义根因分析输出格式 |
| 6 | 编写 Post-Mortem 子 Prompt | `.claude/skills/incident-commander/postmortem.md` | 定义报告模板结构 |
| 7 | GitHub 采集脚本 | `src/collectors/github.js` | 可通过 `gh` CLI 获取指定时间段内的 commits、PRs、workflow runs |
| 8 | 时间线构建脚本 | `src/analyzers/timeline.js` | 输入事件数组 → 输出排序去重的时间线 |
| 9 | Post-Mortem 生成脚本 | `src/reporters/postmortem.js` | 输入时间线 + RCA → 输出 Markdown 报告 |
| 10 | 示例数据 | `examples/sample-timeline.md`、`examples/sample-postmortem.md` | 端到端可复现 |
| 11 | README.md | 项目文档 | 包含安装、配置、使用说明 |

### 功能范围

- ✅ `/incident` 主命令（交互式引导）
- ✅ GitHub 数据采集（commits / PRs / workflow runs）
- ✅ 基础时间线构建（排序 + 去重 + 事件分类标注）
- ✅ 基础 RCA（基于时间线推断可能根因）
- ✅ 基础 Post-Mortem 生成（模板填充）
- ❌ 多源采集（仅 GitHub）
- ❌ 子命令分流
- ❌ 配置管理
- ❌ 降级策略

### 数据源矩阵

| 数据源 | 采集方式 | 状态 |
|--------|----------|------|
| GitHub | `gh` CLI / GitHub MCP | ✅ |
| Sentry | — | ❌ |
| Grafana | — | ❌ |
| Kibana | — | ❌ |
| Deploy | — | ❌ |

### 退出标准

- [ ] 用户可在新项目中安装并执行 `/incident`
- [ ] 输入时间段后自动采集 GitHub 事件并输出时间线
- [ ] 基于时间线自动生成初步 RCA 和 Post-Mortem 草稿
- [ ] 示例数据可复现完整流程

---

## v0.2.0 — Crossfire（多源集成 + 因果推理）

> 🎯 **里程碑**：第一个真正意义上的多源关联推理——交叉验证"部署 → 错误 → 指标异常"的因果链

### 交付清单

| # | 任务 | 交付物 | 验收标准 |
|---|------|--------|----------|
| 1 | Sentry 采集器 | `src/collectors/sentry.js` | 可获取指定时间段的错误事件、堆栈、面包屑、受影响用户数 |
| 2 | Grafana 采集器 | `src/collectors/grafana.js` | 可获取指定时间段的指标异常（CPU / 内存 / 延迟 / 错误率） |
| 3 | 因果推理分析器 | `src/analyzers/causality.js` | 输入时间线 + 上下文 → 输出因果链 + 置信度 + 替代假设 |
| 4 | 影响评估分析器 | `src/analyzers/impact.js` | 输入错误数据 → 输出影响范围（用户数 / 功能 / 数据） |
| 5 | 多源时间线合并 | `src/analyzers/timeline.js` 增强 | 支持跨源事件去重、统一时间戳、标注来源 |
| 6 | 因果推理子 Prompt | `.claude/skills/incident-commander/rca.md` 增强 | 增加多源交叉验证指令 |
| 7 | 影响评估子 Prompt | `.claude/skills/incident-commander/impact.md` | 新增影响评估指令 |
| 8 | MCP 配置示例 | `mcp-configs/sentry.json`、`mcp-configs/grafana.json` | 可直接复制到 Claude Code 配置 |
| 9 | MCP 配置文档 | README 更新 | 包含 Sentry / Grafana 配置步骤 |

### 功能范围

- ✅ v0.1.0 全部功能
- ✅ Sentry 错误事件采集
- ✅ Grafana 指标异常采集
- ✅ 多源事件时间线合并（去重 + 排序 + 来源标注）
- ✅ 因果推理（因果链 + 置信度标注 + 替代假设）
- ✅ 影响评估（用户 / 功能 / 数据维度）
- ✅ MCP 配置示例
- ❌ 子命令分流
- ❌ 配置管理（需手动配置 MCP）
- ❌ 降级策略
- ❌ Kibana / Deploy 集成

### 数据源矩阵

| 数据源 | 采集方式 | 状态 |
|--------|----------|------|
| GitHub | `gh` CLI / GitHub MCP | ✅ |
| Sentry | Sentry MCP / REST API | ✅ 新增 |
| Grafana | Grafana MCP / REST API | ✅ 新增 |
| Kibana | — | ❌ |
| Deploy | — | ❌ |

### 退出标准

- [ ] 同时配置 GitHub + Sentry + Grafana 后，一次 `/incident` 可采集三源数据
- [ ] 时间线正确合并三源事件，无重复无遗漏
- [ ] RCA 输出包含因果链、置信度标注、至少一个替代假设
- [ ] 影响评估包含用户数估算、功能范围、数据影响判断

---

## v0.3.0 — Commander（交互增强 + 降级策略）

> 🎯 **里程碑**：用户体验质变——一键 `/incident start` 启动全流程，数据源不可用时优雅降级而非报错

### 交付清单

| # | 任务 | 交付物 | 验收标准 |
|---|------|--------|----------|
| 1 | 子命令路由 | `skill.md` 重构 | `/incident start` / `timeline` / `rca` / `postmortem` / `brief` / `config` 各归其位 |
| 2 | 一键启动模式 | `skill.md` 增强 | `/incident start <time-range>` 自动执行 采集→时间线→RCA→报告 |
| 3 | 配置管理 | `src/utils/config.js` | `/incident config` 可查看/设置数据源配置 |
| 4 | 事故简报模板 | `templates/incident-brief.md` | 适合发给利益相关者的精简格式 |
| 5 | 降级策略框架 | `src/collectors/base.js` | 定义采集器基类，包含 fallback 逻辑 |
| 6 | GitHub 降级方案 | `src/collectors/github.js` 增强 | MCP 不可用时自动切换到 `gh` CLI |
| 7 | Sentry/Grafana 降级方案 | 采集器增强 | API 不可用时引导用户手动粘贴数据 |
| 8 | 全降级模式 | `skill.md` 增强 | 所有源不可用时进入纯问答交互模式 |
| 9 | 错误处理 | 各模块 | 网络超时 / API 限流 / 认证失败均有明确提示 |

### 功能范围

- ✅ v0.2.0 全部功能
- ✅ 子命令分流（start / timeline / rca / postmortem / brief / config）
- ✅ 一键启动模式
- ✅ 配置管理（查看/设置数据源）
- ✅ 事故简报生成
- ✅ 优雅降级（MCP → CLI → 手动 → 问答）
- ✅ 完善错误处理
- ❌ Kibana / Deploy 集成
- ❌ 性能优化

### 降级策略详情

```
采集器调用链：
  MCP Server ──(不可用)──▶ CLI 工具 ──(不可用)──▶ 引导手动输入 ──(跳过)──▶ 标记数据缺失

整体降级链：
  全自动模式 ──(部分源不可用)──▶ 半自动模式（可用源采集 + 手动补充）
              ──(全源不可用)──▶ 纯交互模式（问答采集信息）
```

### 退出标准

- [ ] `/incident start 2026-06-20T10:00..2026-06-20T12:00` 一键完成全流程
- [ ] `/incident timeline` / `rca` / `postmortem` / `brief` 可独立执行
- [ ] MCP 不可用时自动切换到 `gh` CLI，用户无感
- [ ] 所有 API 不可用时进入纯问答模式，仍可生成报告（标注数据来源为"用户手动提供"）
- [ ] 错误场景有明确中文提示和恢复建议

---

## v0.4.0 — Deep Dive（日志 + 部署集成）

> 🎯 **里程碑**：数据源补齐——覆盖日志和部署两大关键维度，实现"五源全通"

### 交付清单

| # | 任务 | 交付物 | 验收标准 |
|---|------|--------|----------|
| 1 | Kibana/ES 采集器 | `src/collectors/kibana.js` | 可查询指定时间段的错误日志聚类、高频异常 |
| 2 | 部署历史采集器 | `src/collectors/deploy.js` | 支持 GitHub Deployments / Vercel / 通用 Webhook 格式 |
| 3 | 日志聚类分析 | `src/analyzers/log-cluster.js` | 对日志做模式聚类，提取 Top-N 异常模式 |
| 4 | 部署-故障关联 | `src/analyzers/causality.js` 增强 | 新增部署变更作为因果推理触发源 |
| 5 | MCP 配置示例 | `mcp-configs/kibana.json` | ES MCP 配置模板 |
| 6 | 文档更新 | README 更新 | 新增日志/部署配置章节 |

### 功能范围

- ✅ v0.3.0 全部功能
- ✅ Kibana/ES 日志采集 + 聚类
- ✅ 部署历史采集（GitHub Deployments / Vercel）
- ✅ 部署-故障关联推理
- ❌ 性能优化
- ❌ 正式发布

### 数据源矩阵

| 数据源 | 采集方式 | 状态 |
|--------|----------|------|
| GitHub | `gh` CLI / GitHub MCP | ✅ |
| Sentry | Sentry MCP / REST API | ✅ |
| Grafana | Grafana MCP / REST API | ✅ |
| Kibana | ES MCP / REST API | ✅ 新增 |
| Deploy | GitHub Deployments / Vercel API | ✅ 新增 |

### 退出标准

- [ ] 五源数据均可独立采集并合并到时间线
- [ ] 日志聚类输出 Top-5 异常模式及出现频次
- [ ] 部署事件作为因果推理的候选触发源被自动纳入分析
- [ ] RCA 中出现"部署变更 → 故障"的推理路径并被标注置信度

---

## v1.0.0 — Battle Ready（生产就绪 + 正式发布）

> 🎯 **里程碑**：从"能用"到"好用"——性能、文档、稳定性全面达标，正式对外发布

### 交付清单

| # | 任务 | 交付物 | 验收标准 |
|---|------|--------|----------|
| 1 | 并行采集优化 | 采集器重构 | 多源并行采集，耗时 < Max(单源) × 1.2 |
| 2 | 增量分析 | 分析器增强 | 相同时间窗口重复执行时复用已采集数据 |
| 3 | 上下文压缩 | Prompt 优化 | 长故障场景（>2h）不超出上下文窗口 |
| 4 | 全量文档 | README 完整覆盖 | 安装 / 配置 / 使用 / 故障排除 / FAQ |
| 5 | 快速启动脚本 | `scripts/setup.sh` | 一键配置 GitHub MCP + 环境检查 |
| 6 | 边界场景加固 | 各模块 | 网络超时 / API 限流 / 无数据 / 时间格式错误 |
| 7 | 发布流程 | npm publish / GitHub Release | `npm install -g incident-commander` 可用 |
| 8 | 推广素材 | 博客草稿 + README 截图 | 端到端演示 GIF / 录屏 |

### 功能范围

- ✅ v0.4.0 全部功能
- ✅ 性能优化（并行采集 + 增量分析 + 上下文压缩）
- ✅ 全量文档
- ✅ 一键配置脚本
- ✅ 边界场景全覆盖
- ✅ npm/GitHub 正式发布

### 发布检查清单

- [ ] 所有预发布版本退出标准均已满足
- [ ] README 可作为完整使用手册
- [ ] `npm install -g incident-commander` 安装后即可使用
- [ ] 多环境验证（macOS / Linux）
- [ ] 至少一个真实故障场景端到端验证通过
- [ ] 博客文章草稿完成

### v1.0.0 质量门槛

| 指标 | 目标 |
|------|------|
| 数据源覆盖 | ≥ 3 个（GitHub 必须 + Sentry/Grafana/Kibana 至少 2 个） |
| 时间线生成时间 | < 1 分钟（3 源并行） |
| RCA 准确率（人工评估） | ≥ 80% |
| Post-Mortem 可直接使用率 | ≥ 80%（少量人工修改即可发出） |
| 新用户配置到首次使用 | < 5 分钟（使用 setup.sh） |
| 边界场景不掉死 | 100%（所有已知边界均有优雅处理） |

---

## v1.x — 持续改进（发布后迭代）

> 基于 v1.0.0 用户反馈持续改进，每个小版本 1-2 周迭代

### v1.1.0 — Better Together（IM 集成）

| 功能 | 说明 |
|------|------|
| Slack MCP 集成 | 采集事故期间 Slack 频道消息，纳入时间线 |
| 飞书 MCP 集成 | 同上，面向中国用户 |
| 事故状态同步 | `/incident start` 后自动在 IM 创建事发频道/话题 |
| 实时简报推送 | 分析完成后自动推送简报到 IM |

### v1.2.0 — Learn from History（知识库 v1）

| 功能 | 说明 |
|------|------|
| 历史事故归档 | Post-Mortem 存入本地知识库（Markdown 目录） |
| 相似事故匹配 | 新故障自动匹配历史相似案例，推荐解决方案 |
| 模式识别 | 识别高频故障模式（如"每周二部署后内存泄漏"） |

### v1.3.0 — Self-Review（预判模式）

| 功能 | 说明 |
|------|------|
| 部署预检 | PR 合入时基于历史模式预警潜在风险 |
| 变更风险评估 | 对大型重构/迁移标注风险等级 |
| 灰度建议 | 基于故障模式推荐灰度策略 |

---

## v2.0.0 — War Room（重大升级）

> 🎯 **愿景**：从"事后分析工具"进化为"故障作战室"

### 核心升级

| 模块 | 说明 |
|------|------|
| **实时模式** | 接入 WebSocket / SSE，故障进行中实时采集分析 |
| **多 Agent 协作** | 采集 Agent / 分析 Agent / 通信 Agent 分工协作 |
| **Runbook 执行** | 根据故障类型自动匹配 Runbook，引导/半自动执行修复 |
| **On-call 交接** | 自动生成交接文档，减少轮班知识断层 |
| **Chaos 辅助** | 基于 Post-Mortem 行动项自动生成混沌工程实验 |

### 破坏性变更预期

- Skill 结构可能重构为多 Agent 架构
- 配置格式可能升级（提供迁移脚本）
- Post-Mortem 模板可能扩展字段

---

## 版本依赖关系图

```
v0.1.0 ──▶ v0.2.0 ──▶ v0.3.0 ──▶ v0.4.0 ──▶ v1.0.0
  │           │           │           │           │
  │           │           │           │           ├─▶ v1.1.0
  │           │           │           │           ├─▶ v1.2.0
  │           │           │           │           └─▶ v1.3.0
  │           │           │           │                │
  │           │           │           │                └─▶ v2.0.0
  │           │           │           │
  │           │           └─ 降级策略是 v0.3 的核心，不影响后续版本的数据源扩展
  │           └─ 多源合并逻辑是后续所有版本的基石
  └─ MVP 的单源流程是后续扩展的骨架
```

---

## 版本与时间线映射

```
2026-06 ──── v0.1.0 (Week 1)
  │
2026-06/07 ─ v0.2.0 (Week 2-3)
  │
2026-07 ──── v0.3.0 (Week 3-4)
  │
2026-07 ──── v0.4.0 (Week 4-5)
  │
2026-07/08 ─ v1.0.0 (Week 5-6)
  │
2026-08+ ─── v1.1.0 ~ v1.3.0 (迭代)
  │
2026-Q4 ──── v2.0.0 (重大升级)
```

---

## 版本分支策略

| 分支 | 用途 | 命名规则 |
|------|------|----------|
| `main` | 稳定发布分支 | — |
| `dev` | 开发集成分支 | — |
| `feat/*` | 功能分支 | `feat/v0.2-sentry-collector` |
| `fix/*` | 修复分支 | `fix/v0.3-degradation-timeout` |
| `release/*` | 发布准备分支 | `release/v1.0.0` |

```bash
# 版本发布流程
git checkout dev
git checkout -b release/v1.0.0
# ... 测试、修复、文档 ...
git checkout main
git merge release/v1.0.0
git tag v1.0.0
npm publish
```

---

## 总结

| 版本 | 一句话定位 | 用户价值 |
|------|-----------|----------|
| **v0.1.0** | 能跑 | 证明概念可行，GitHub 单源可用 |
| **v0.2.0** | 能推理 | 多源关联，不再靠猜 |
| **v0.3.0** | 好用 | 一键启动，不怕断线 |
| **v0.4.0** | 够全 | 五源覆盖，不留盲区 |
| **v1.0.0** | 能发 | 生产质量，可以推广 |
| **v1.x** | 更聪明 | 学历史、会预警、能沟通 |
| **v2.0.0** | 作战室 | 从工具变成队友 |

---

*最后更新：2026-06-20*
