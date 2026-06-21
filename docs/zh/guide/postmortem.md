# Post-Mortem 生成

Incident Commander 生成一份完整的、结构化的 Post-Mortem 文档，结合时间线、RCA 和影响数据。

## 报告结构

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

```text
/incident postmortem
```

### 编程式调用

```typescript
import {
  generatePostMortem,
  renderPostMortemMarkdown,
} from 'incident-commander'

const report = generatePostMortem('API 500 故障', timeline, rca, impact)
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

## 下一步

- [事故简报](/zh/guide/brief) — 面向利益相关者的精简格式
- [API: generatePostMortem()](/zh/api/reporters/postmortem) — 完整 API 参考
