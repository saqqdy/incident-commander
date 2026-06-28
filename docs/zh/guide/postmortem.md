# Post-Mortem 生成

Incident Commander 生成一份完整的、结构化的 Post-Mortem 文档，结合时间线、RCA 和影响数据。

## 报告结构

生成的 Post-Mortem 包含：

| 章节 | 内容 |
|------|------|
| **摘要** | 严重等级、持续时间、起止时间、影响概述 |
| **时间线** | 完整事件表格（含类型和来源） |
| **根因分析** | 因果链、直接原因、促成因素、根因、置信度、替代假设 |
| **影响** | 受影响用户、严重程度评分、受影响功能、数据影响 |
| **修复** | 已执行的缓解措施、根因修复 |
| **预防** | 短期预防、长期改进 |
| **行动项** | 每项含负责人、截止日期、优先级 |

## 使用方式

### 通过 Skill 命令

```text
/incident postmortem
```

### 编程式调用

```typescript
import {
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

// 生成报告对象
const report = generatePostMortem(
  'API 500 故障',
  timeline,
  rca,
  impact
)

// 渲染为 Markdown
const markdown = renderPostMortemMarkdown(report)
console.log(markdown)
```

## 严重等级推断

严重等级根据影响分数自动推断：

| 影响分数 | 严重等级 | 描述 |
|---------|---------|------|
| ≥ 80 | SEV1 | 严重 — 完全不可用或数据丢失 |
| ≥ 40 | SEV2 | 重大 — 显著降级 |
| < 40 | SEV3 | 轻微 — 影响有限 |

## 输出示例

```markdown
# Incident Post-Mortem: API 500 故障

## 摘要
- **严重等级**: SEV2
- **持续时间**: 35min
- **开始时间**: 2026-06-20T10:05:00Z
- **结束时间**: 2026-06-20T10:38:00Z
- **影响**: 约 5000 用户受影响，降级程度 75/100

## 时间线
| Time (UTC) | Event | Source |
|-----------|-------|--------|
| 10:00 | 📝 alice: feat: update user-service API to v2 | GitHub |
| 10:02 | 🚀 Deploy: production ✅ | GitHub |
| 10:05 | 🔴 Error rate spike on /api/users (500 errors) | Sentry |
| 10:30 | ⏪ Rollback: production to v2.4.0 | GitHub |
| 10:35 | ✅ Error rate recovered | Sentry |

## 根因分析
...

## 行动项
| 行动 | 负责人 | 截止日期 | 优先级 |
|------|-------|----------|--------|
| 添加消费者契约测试 | [待定] | [待定] | P1 |
| 实施金丝雀部署 | [待定] | [待定] | P1 |
```

## 包含原始数据

用于调试时，可在报告中包含原始数据：

```typescript
const report = generatePostMortem(title, timeline, rca, impact, {
  includeRawData: true,
})
```

## 自定义模板

Markdown 模板可通过修改 `templates/postmortem.md` 进行自定义。

## 下一步

- [事故简报](/zh/guide/brief) — 面向利益相关者的精简格式
- [API: generatePostMortem()](/zh/api/reporters/postmortem) — 完整 API 参考
