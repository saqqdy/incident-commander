# 版本路线图

Incident Commander 通过主题化版本迭代演进，每个版本增加一层智能能力。

## 当前版本

### v0.1.1 — Plugin Ready（已发布）

**主题**: 文档与插件元数据

**能力**:
- ✅ 增强 Claude Code Plugin 元数据
- ✅ 市场发布配置
- ✅ 改进文档结构
- ✅ 更好的安装指南
- ✅ 增强包含插件信息的 README

**使用场景**:
- Claude Code Plugin Marketplace 就绪
- 更好的上手体验
- 更清晰的安装说明

### v0.1.0 — First Blood（已发布）

**主题**: 项目基建 + MVP

**能力**:
- ✅ `/incident` 交互式引导
- ✅ GitHub 数据采集（通过 `gh` CLI 获取提交 / PR / 工作流运行）
- ✅ 时间线构建（排序 + 去重 + 关键转折点检测）
- ✅ 基础 RCA（从时间线推断因果链）
- ✅ Post-Mortem 生成（结构化 Markdown 输出）
- ✅ 事故简报生成
- ✅ 零配置演示模式（`pnpm run demo`）
- ✅ Claude Code Plugin 元数据（`.claude-plugin/`）
- ✅ TypeScript/Node.js API

**使用场景**:
- GitHub 为主的故障分析
- 快速生成复盘文档
- CLI 驱动的时间线探索

## 计划版本

### v0.2.0 — Crossfire

**主题**: 多源集成 + 因果推理

**计划功能**:
- Sentry 采集器（错误、Issues、面包屑、受影响用户数）
- Grafana 采集器（指标异常：CPU / 内存 / 延迟 / 错误率）
- 因果推理分析器（附带置信度标签）
- 影响评估（用户 / 功能 / 数据维度）
- 多源时间线合并与去重
- Sentry 和 Grafana 的 MCP 配置示例

### v0.3.0 — Commander

**主题**: 交互增强 + 降级策略

**计划功能**:
- 子命令路由（`/incident start` / `timeline` / `rca` / `postmortem` / `brief` / `config`）
- 一键模式（`/incident start <time-range>`）
- 配置管理
- 优雅降级（MCP → CLI → 手动 → 问答）
- 事故简报模板

### v0.4.0 — Deep Dive

**主题**: 日志 + 部署集成

**计划功能**:
- Kibana/ES 采集器（错误日志聚类）
- 部署历史采集器（GitHub Deployments / Vercel）
- 日志聚类分析
- 部署与故障的因果关联

### v1.0.0 — Battle Ready

**主题**: 生产就绪

**计划功能**:
- 并行采集优化
- 增量分析支持
- 长故障的上下文压缩
- Claude Code Plugin Marketplace
- 完整文档 + 一键配置脚本
- npm 发布 + GitHub Release

## 未来愿景

### v1.1.0 — Better Together
- Slack / 飞书 MCP 集成，采集聊天消息
- `/incident start` 时自动创建故障频道
- 分析后自动推送简报到 IM

### v1.2.0 — Learn from History
- 历史故障归档
- 相似故障匹配
- 模式识别（如"每周二部署后总出现内存泄漏"）

### v1.3.0 — Self-Review
- 基于历史模式的部署预检
- 变更风险评估
- 金丝雀策略推荐

### v2.0.0 — War Room
- 实时模式（WebSocket / SSE）
- 多 Agent 协作
- Runbook 执行（半自动化修复工作流）
- On-call 交接文档

## 发布理念

- **增量价值**: 每个版本交付可用的功能
- **向后兼容**: 次版本号之间 API 保持稳定
- **社区驱动**: 路线图由用户反馈塑造

## 参与贡献

对未来版本有想法？[提交 Issue](https://github.com/saqqdy/incident-commander/issues) 或参与讨论。

## 更新日志

查看 [CHANGELOG.md](https://github.com/saqqdy/incident-commander/blob/master/CHANGELOG.md) 了解发布历史。
