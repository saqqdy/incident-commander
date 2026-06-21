# 版本路线图

## 版本总览

| 版本 | 代号 | 核心主题 | 状态 |
|------|------|----------|------|
| v0.1.0 | First Blood | 项目基建 + MVP（GitHub 单源 + 时间线 + Post-Mortem） | ✅ 已完成 |
| v0.2.0 | Crossfire | Sentry + Grafana 多源集成 + AI 因果推理 | ⏳ 开发中 |
| v0.3.0 | Commander | 交互增强 + 降级策略 + 一键模式 | 📋 计划中 |
| v0.4.0 | Deep Dive | Kibana 日志 + 部署历史集成 | 📋 计划中 |
| v1.0.0 | Battle Ready | 生产就绪 + npm 发布 | 📋 计划中 |
| v2.0.0 | War Room | 知识库 + 预测模式 + Runbook 自动化 | 📋 远期 |

## v0.1.0 — First Blood

- ✅ `/incident` 主命令（交互式引导）
- ✅ GitHub 数据采集（提交 / PR / 工作流运行）
- ✅ 基础时间线构建（排序 + 去重 + 事件分类标注）
- ✅ 基础 RCA（基于时间线推断可能根因）
- ✅ 基础 Post-Mortem 生成（模板填充）
- ✅ 示例数据

## v0.2.0 — Crossfire

- ⏳ Sentry 采集器（错误、Issues、面包屑、受影响用户数）
- ⏳ Grafana 采集器（指标异常：CPU / 内存 / 延迟 / 错误率）
- ⏳ 因果推理分析器
- ⏳ 影响评估分析器
- ⏳ 多源时间线合并增强
- ⏳ MCP 配置示例

## v0.3.0 — Commander

- 📋 子命令路由（start / timeline / rca / postmortem / brief / config）
- 📋 一键启动模式
- 📋 配置管理
- 📋 事故简报模板
- 📋 降级策略框架
- 📋 全降级模式

## v1.0.0 — Battle Ready

- 📋 并行采集优化
- 📋 增量分析
- 📋 上下文压缩
- 📋 完整文档
- 📋 一键配置脚本
- 📋 npm 正式发布

## v2.0.0 — War Room

- 📋 实时模式
- 📋 多 Agent 协作
- 📋 Runbook 执行
- 📋 On-call 交接文档
- 📋 混沌工程实验生成
