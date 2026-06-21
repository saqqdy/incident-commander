# 安装

## 零配置演示（最快）

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

或在浏览器中直接体验：[体验场 →](/zh/playground)

## Claude Code Skill（推荐）

### 第一步：克隆到项目中

```bash
cd your-project

# 克隆到隐藏目录
git clone https://github.com/saqqdy/incident-commander.git .incident-commander

# 或者直接复制 Skill 目录
cp -r incident-commander/.claude/skills/ .claude/skills/
```

### 第二步：验证 gh CLI

```bash
gh auth status  # 需要已认证的 GitHub 账号
```

如果尚未认证：

```bash
gh auth login   # 按提示操作
```

### 第三步：验证安装

打开 Claude Code，输入：

```text
/incident
```

你应该能看到 Incident Commander 的交互式引导。

## npm 包

用于 CI/CD 自动化或自定义工具链的编程式调用：

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

## 环境要求

- **Node.js** >= 18.0（编程式调用）
- **Claude Code**（Skill 用法）
- **gh CLI** 已认证（GitHub 数据采集）

## TypeScript

Incident Commander 使用 TypeScript 编写，开箱即用提供完整类型定义，无需额外安装 `@types` 包。

```typescript
import type {
  TimelineEvent,
  TimelineResult,
  RCAResult,
  PostMortemReport,
  IncidentConfig,
} from 'incident-commander'
```

## 下一步

- [快速上手](/zh/guide/quick-start) — 运行你的第一次故障分析
- [MCP 配置](/zh/advanced/mcp-config) — 连接更多数据源
