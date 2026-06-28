# Installation

Choose the installation method that fits your workflow.

## Option 1: Claude Code Plugin (Recommended)

Incident Commander is designed as a **Claude Code Plugin** for seamless integration.

### Method A: Plugin Marketplace

```bash
# In Claude Code, run:
/plugin marketplace add saqqdy/incident-commander
/plugin install incident-commander
```

### Method B: Local Install

```bash
# 1. Navigate to your project
cd your-project

# 2. Install npm package
pnpm add -D incident-commander

# 3. Copy skill files
mkdir -p .claude/skills
cp -r node_modules/incident-commander/.claude/skills/incident-commander .claude/skills/
```

After installation, use commands like `/incident`, `/incident start`, `/timeline` in Claude Code.

## Option 2: Zero-Config Demo (Fastest)

Try the full pipeline instantly — no `gh` CLI, no API keys, no code:

```bash
git clone https://github.com/saqqdy/incident-commander.git
cd incident-commander
pnpm install && pnpm run build

# Full pipeline demo (collect → timeline → RCA → Post-Mortem)
pnpm run demo

# Timeline only
node dist/cli.js timeline --mock
```

Or try it in your browser: [Playground →](/playground)

## Option 3: Clone into your project

```bash
cd your-project

# Clone into a hidden directory
git clone https://github.com/saqqdy/incident-commander.git .incident-commander

# Or copy the Skill directory directly
cp -r incident-commander/.claude/skills/ .claude/skills/
```

### Verify gh CLI

```bash
gh auth status  # Needs an authenticated GitHub account
```

If you haven't authenticated yet:

```bash
gh auth login   # Follow the prompts
```

### Verify installation

Open Claude Code and type:

```text
/incident
```

You should see the Incident Commander interactive walkthrough.

## Option 4: npm Package

For programmatic usage in CI/CD or custom toolchains:

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

## Requirements

- **Node.js** >= 18.0 (for programmatic usage)
- **Claude Code** (for Skill usage)
- **gh CLI** authenticated (for GitHub data collection)

## TypeScript

Incident Commander is written in TypeScript and provides full type definitions out of the box. No additional `@types` package is needed.

```typescript
import type {
  TimelineEvent,
  TimelineResult,
  RCAResult,
  PostMortemReport,
  IncidentConfig,
} from 'incident-commander'
```

## Next Steps

- [Quick Start](/guide/quick-start) — Run your first incident analysis
- [MCP Configuration](/advanced/mcp-config) — Connect more data sources
