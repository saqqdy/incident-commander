# 🎯 Incident Commander — 故障指挥官 开发计划

> 基于 `claude-code-skill-ideas.md` 和 `claude-code-skill-ideas-project.md` 的方向选定，聚焦 **Incident Commander** 作为核心产品。

---

## 一、项目定位

### 一句话定义
**Incident Commander 是一个 Claude Code Skill 插件，帮助 SRE / On-call 工程师在故障发生时自动收集多源数据、生成事故时间线与根因分析、输出结构化 Post-Mortem 文档。**

### 核心价值
| 传统方式 | Incident Commander |
|----------|-------------------|
| 人肉翻监控、日志、Git 记录，拼凑时间线 | AI 自动采集 + 关联推理 |
| RCA 依赖经验，容易遗漏 | 多源交叉验证，降低认知偏差 |
| Post-Mortem 写作耗时 | 结构化模板 + 自动填充 |
| 故障信息散落各处 | 统一数据管线 + 可追溯归档 |

### 为什么 AI 做更好
- **跨源关联推理**：从"部署 X → CPU 飙升 → 错误率上升"的因果链，规则脚本做不到
- **语义理解日志**：千变万化的错误日志，需要理解语义而非 pattern match
- **自然语言输出**：生成人可读的 Post-Mortem，而非冰冷的指标报表

---

## 二、架构设计

### 整体架构

```
┌──────────────────────────────────────────────────────────┐
│                    Claude Code Session                    │
│                                                           │
│  ┌─────────────┐    ┌──────────────────────────────┐     │
│  │  /incident  │───▶│    Incident Commander Skill   │     │
│  │  (入口命令) │    │    (Prompt + 工具编排)        │     │
│  └─────────────┘    └──────────┬───────────────────┘     │
│                                │                          │
│                     ┌──────────▼──────────┐              │
│                     │   数据采集层 (MCP)   │              │
│                     └──────────┬──────────┘              │
│                                │                          │
│          ┌──────────┬──────────┼──────────┬───────────┐  │
│          ▼          ▼          ▼          ▼           ▼  │
│    ┌──────────┐┌─────────┐┌────────┐┌─────────┐┌───────┐│
│    │ GitHub   ││ Sentry/ ││ Grafana││ Kibana/ ││ Deploy││
│    │ API      ││GlitchTip││  API   ││ ES API  ││  API  ││
│    └──────────┘└─────────┘└────────┘└─────────┘└───────┘│
│                                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │              分析引擎 (Prompt Chain)              │    │
│  │  采集 → 时间线构建 → 因果推理 → 影响评估 → 报告  │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### 目录结构

```
incident-commander/
├── CLAUDE.md                    # 项目指引
├── package.json                 # 项目配置
├── README.md                    # 项目文档
├── .claude/
│   └── skills/
│       └── incident-commander/  # Skill 定义
│           ├── skill.md         # 主 Prompt
│           ├── collect.md       # 数据采集子 Prompt
│           ├── timeline.md      # 时间线构建子 Prompt
│           ├── rca.md           # 根因分析子 Prompt
│           ├── impact.md        # 影响评估子 Prompt
│           └── postmortem.md    # Post-Mortem 生成子 Prompt
├── src/
│   ├── index.js                 # 入口
│   ├── collectors/              # 数据采集器
│   │   ├── github.js            # GitHub 事件采集
│   │   ├── sentry.js            # Sentry 错误采集
│   │   ├── grafana.js           # Grafana 指标采集
│   │   ├── kibana.js            # Kibana/ES 日志采集
│   │   └── deploy.js            # 部署历史采集
│   ├── analyzers/               # 分析器
│   │   ├── timeline.js          # 时间线构建
│   │   ├── causality.js         # 因果推理
│   │   └── impact.js            # 影响范围评估
│   ├── reporters/               # 报告生成器
│   │   └── postmortem.js        # Post-Mortem 生成
│   └── utils/
│       ├── format.js            # 格式化工具
│       └── config.js            # 配置管理
├── templates/
│   ├── postmortem.md            # Post-Mortem 模板
│   └── incident-brief.md       # 事故简报模板
├── mcp-configs/                 # MCP 服务器配置示例
│   ├── github.json
│   ├── sentry.json
│   └── grafana.json
├── internal/
│   ├── claude-code-skill-ideas.md
│   ├── claude-code-skill-ideas-project.md
│   └── development-plan.md      # 本文件
└── examples/
    ├── sample-timeline.md       # 示例时间线
    └── sample-postmortem.md     # 示例 Post-Mortem
```

---

## 三、核心功能模块

### 模块 1：指令入口 `/incident`

| 子命令 | 功能 | 示例 |
|--------|------|------|
| `/incident` | 交互式引导故障分析 | 逐步问答式 |
| `/incident start` | 启动事故响应流程 | 自动采集 + 分析 |
| `/incident timeline` | 仅生成时间线 | 快速摸排 |
| `/incident rca` | 仅做根因分析 | 深度推理 |
| `/incident postmortem` | 生成 Post-Mortem 文档 | 复盘归档 |
| `/incident brief` | 生成事故简报 | 通知利益相关者 |
| `/incident config` | 配置数据源 | 首次使用设置 |

### 模块 2：数据采集层

#### 2.1 GitHub 集成（优先级 P0）
- **数据**：最近 N 次提交、PR、部署（GitHub Actions 工作流运行）
- **方式**：通过 GitHub MCP Server 或 `gh` CLI
- **触发**：自动识别事故时间窗口内的代码变更

#### 2.2 错误监控集成（优先级 P0）
- **Sentry**：错误事件、堆栈、面包屑、受影响用户数
- **GlitchTip**（Sentry 开源替代）：同上
- **方式**：MCP Server / REST API

#### 2.3 监控指标集成（优先级 P1）
- **Grafana**：指定时间窗口内的指标异常（CPU、内存、错误率、延迟）
- **方式**：Grafana MCP 或 API

#### 2.4 日志集成（优先级 P1）
- **Kibana / Elasticsearch**：错误聚类、高频异常日志
- **方式**：ES MCP 或 API

#### 2.5 部署历史（优先级 P2）
- **数据**：最近部署记录、回滚记录
- **方式**：GitHub Deployments / Vercel / 自建部署平台 API

### 模块 3：分析引擎

#### 3.1 时间线构建
```
输入：多源事件流
处理：
  1. 统一时间格式（全部转为 ISO 8601）
  2. 排序合并
  3. 去重（同一事件从不同源重复采集）
  4. 标注事件类型（deploy / error / alert / code_change / recovery）
  5. 识别关键转折点
输出：结构化时间线
```

#### 3.2 因果推理
```
输入：时间线 + 代码变更 + 错误详情
处理：
  1. 识别"触发事件"（最近代码部署 / 配置变更）
  2. 追踪"传播路径"（部署 → 错误 → 指标异常 → 告警）
  3. 评估"置信度"（高/中/低，附理由）
  4. 列出"替代假设"（可能的其他根因）
输出：根因分析报告
```

#### 3.3 影响评估
```
输入：错误数据 + 监控指标
处理：
  1. 受影响用户数估算
  2. 服务降级程度评估
  3. 业务影响范围（哪些功能受影响）
  4. 数据影响（是否有数据丢失/不一致）
输出：影响范围报告
```

### 模块 4：报告生成

#### Post-Mortem 模板结构
```markdown
# 事故复盘报告

## 概要
- 事故标题
- 严重等级 (SEV1/2/3)
- 持续时间
- 影响范围

## 时间线
| 时间 | 事件 | 来源 |
|------|------|------|

## 根因分析
- 直接原因
- 贡献因素
- 根本原因

## 影响
- 用户影响
- 业务影响
- 数据影响

## 修复
- 应急措施
- 根本修复
- 验证方式

## 预防措施
- 短期预防
- 长期改进
- 行动项 (Owner + Deadline)

## 经验教训
- 做得好的
- 做得不好的
- 运气成分
```

---

## 四、开发阶段

### Phase 0：项目基建（1 天）

| 任务 | 产出 | 状态 |
|------|------|------|
| 初始化项目结构 | 完整目录骨架 | ⬜ |
| 编写 CLAUDE.md | 项目指引文档 | ⬜ |
| 编写 README.md | 项目说明文档 | ⬜ |
| 配置 package.json | 包信息、scripts | ⬜ |
| 配置 .claude/skills/ | Skill 入口文件 | ⬜ |

### Phase 1：MVP — 单源 + 时间线（3-5 天）

> 目标：用 GitHub 数据源跑通完整流程

| 任务 | 产出 | 状态 |
|------|------|------|
| 实现 `/incident` 入口命令 | skill.md | ⬜ |
| 实现 GitHub 数据采集器 | collectors/github.js | ⬜ |
| 实现时间线构建分析器 | analyzers/timeline.js | ⬜ |
| 实现基础 Post-Mortem 生成 | reporters/postmortem.js | ⬜ |
| 编写示例数据和文档 | examples/ | ⬜ |
| 端到端测试：用真实 GitHub 仓库跑一次 | 测试报告 | ⬜ |

**MVP 验收标准**：
- 输入时间段 → 自动拉取 GitHub 事件 → 输出时间线 + 初步 RCA

### Phase 2：多源集成（5-7 天）

> 目标：接入 Sentry + Grafana，实现真正的多源关联推理

| 任务 | 产出 | 状态 |
|------|------|------|
| 实现 Sentry 数据采集器 | collectors/sentry.js | ⬜ |
| 实现 Grafana 指标采集器 | collectors/grafana.js | ⬜ |
| 实现因果推理分析器 | analyzers/causality.js | ⬜ |
| 实现影响评估分析器 | analyzers/impact.js | ⬜ |
| 多源事件去重与排序 | timeline.js 增强 | ⬜ |
| MCP 配置示例文档 | mcp-configs/ | ⬜ |

**Phase 2 验收标准**：
- 输入时间段 → 自动采集 GitHub + Sentry + Grafana 数据 → 交叉推理 → 输出完整 RCA

### Phase 3：交互增强（3-5 天）

> 目标：优化用户体验，支持交互式故障分析

| 任务 | 产出 | 状态 |
|------|------|------|
| 实现交互式引导模式 | skill.md 增强 | ⬜ |
| 实现子命令分流 | skill.md 增强 | ⬜ |
| 实现配置管理 | utils/config.js | ⬜ |
| 实现事故简报生成 | templates/incident-brief.md | ⬜ |
| 完善错误处理和降级 | 各模块 | ⬜ |

**Phase 3 验收标准**：
- 用户可用 `/incident start` 一键启动流程
- 用户可分步执行（采集 → 时间线 → RCA → 报告）
- 数据源不可用时优雅降级

### Phase 4：日志 + 部署集成（3-5 天）

> 目标：接入 Kibana/ES + 部署平台，补齐数据源

| 任务 | 产出 | 状态 |
|------|------|------|
| 实现 Kibana/ES 数据采集器 | collectors/kibana.js | ⬜ |
| 实现部署历史采集器 | collectors/deploy.js | ⬜ |
| 日志聚类与异常识别 | analyzers 增强 | ⬜ |
| 部署-故障关联推理 | causality.js 增强 | ⬜ |

### Phase 5：打磨 + 发布（3-5 天）

> 目标：文档完善、边界场景处理、发布

| 任务 | 产出 | 状态 |
|------|------|------|
| 完整使用文档 | README.md 更新 | ⬜ |
| 边界场景处理（网络超时、API 限流等） | 各模块 | ⬜ |
| 性能优化（并行采集、增量分析） | 各模块 | ⬜ |
| 发布到 npm / GitHub Marketplace | 发布流程 | ⬜ |
| 编写推广文章 | 博客草稿 | ⬜ |

---

## 五、技术方案

### 5.1 作为 Claude Code Skill 的实现方式

Incident Commander 将以 **Claude Code Skill** 形式交付，核心是 `.claude/skills/` 下的 Prompt 定义文件，配合可选的 JS 工具脚本。

### 5.2 数据采集方式

| 方式 | 说明 | 优先级 |
|------|------|--------|
| **MCP Server** | 通过已配置的 MCP Server 调用 API | P0 |
| **gh CLI** | 通过 Bash 工具执行 `gh` 命令获取 GitHub 数据 | P0 |
| **curl API** | 直接调用 REST API（需要 token 配置） | P1 |
| **文件读取** | 读取本地日志/配置文件 | P2 |

### 5.3 Prompt 工程策略

采用 **Chain-of-Thought + 结构化输出** 方式：

1. **采集阶段**：并行调用多个数据源，收集原始数据
2. **整理阶段**：统一时间格式、去重、排序
3. **推理阶段**：逐步推理因果关系，标注置信度
4. **生成阶段**：按模板填充结构化报告

每个阶段用独立的子 Prompt，避免上下文过载。

---

## 六、依赖关系

### 必需 MCP Servers（用户需自行配置）

| MCP Server | 用途 | 是否必需 |
|------------|------|----------|
| **GitHub MCP** | 获取提交、PR、部署数据 | ✅ 必需（MVP） |
| **Sentry MCP** | 获取错误事件数据 | ⭐ 推荐 |
| **Grafana MCP** | 获取监控指标数据 | ⭐ 推荐 |
| **Kibana/ES MCP** | 获取日志数据 | 可选 |
| **Slack MCP** | 获取事故沟通记录 | 可选 |

### 降级策略

当某个 MCP Server 不可用时：
- **GitHub**：尝试用 `gh` CLI 替代
- **Sentry/Grafana**：引导用户手动提供数据（粘贴日志/截图）
- **所有源不可用**：进入纯交互模式，通过问答采集信息

---

## 七、里程碑与时间线

```
Week 1 ──── Phase 0 + Phase 1
  │           项目基建 + MVP (GitHub单源)
  │
Week 2-3 ── Phase 2
  │           多源集成 (Sentry + Grafana)
  │
Week 3-4 ── Phase 3
  │           交互增强
  │
Week 4-5 ── Phase 4
  │           日志 + 部署集成
  │
Week 5-6 ── Phase 5
              打磨 + 发布
```

**总预估：5-6 周（含缓冲）**

---

## 八、风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| MCP Server 配置门槛高 | 用户流失 | 提供一键配置脚本 + 降级方案 |
| API 限流导致采集失败 | 分析不完整 | 增量采集 + 缓存 + 限流退避 |
| 多源时间精度不一致 | 时间线错乱 | 统一取服务端时间，标注时钟偏差 |
| AI 推理结果不可靠 | 误导用户 | 所有结论标注置信度 + 列出替代假设 |
| 上下文窗口不够 | 长故障分析截断 | 分阶段 Prompt + 摘要压缩 |

---

## 九、成功指标

| 指标 | MVP 目标 | V1 目标 |
|------|----------|---------|
| 数据源覆盖 | 1 个（GitHub） | 3+ 个 |
| 时间线生成时间 | < 2 分钟 | < 1 分钟 |
| RCA 准确率（人工评估） | ≥ 60% | ≥ 80% |
| Post-Mortem 可用率 | ≥ 50% | ≥ 80% |
| 用户配置时间 | < 10 分钟 | < 5 分钟 |

---

## 十、后续演进方向

1. **Incident Knowledge Base** — 积累历史故障案例，自动匹配相似事故和解决方案
2. **Prediction Mode** — 基于历史模式，在代码部署时预判风险（部署前 self-review）
3. **Runbook Automation** — 根据故障类型，自动匹配并执行 Runbook
4. **Slack/飞书集成** — 事故期间实时同步状态到 IM 通道
5. **On-call 交接** — 自动生成手交文档，减少知识断层
6. **Chaos Engineering 辅助** — 基于 Post-Mortem 行动项，生成混沌实验方案

---

*最后更新：2026-06-20*
