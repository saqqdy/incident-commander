# MCP 配置

Model Context Protocol (MCP) 服务器允许 Claude Code 直接查询你的监控和部署平台。本指南介绍如何配置每个数据源。

## 添加 MCP 服务器

将 `mcp-configs/` 目录中的配置复制到 `.claude/settings.json`，并填入真实 token：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token"
      }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sentry"],
      "env": {
        "SENTRY_AUTH_TOKEN": "your_sentry_token"
      }
    },
    "grafana": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-grafana"],
      "env": {
        "GRAFANA_API_KEY": "your_grafana_key"
      }
    }
  }
}
```

## GitHub MCP

### 前提条件

- GitHub 个人访问令牌，需有 `repo` 和 `read:org` 权限
- 有目标仓库的访问权限

### Token 设置

1. 前往 GitHub Settings → Developer settings → Personal access tokens
2. 生成包含所需权限的新 token
3. 添加到你的 MCP 配置

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    }
  }
}
```

## Sentry MCP (v0.2.0)

### 前提条件

- Sentry 认证令牌，需有 `org:read`、`project:read` 和 `team:read` 权限
- 有目标组织和项目的访问权限

### Token 设置

1. 前往 Sentry Settings → API Keys
2. 创建包含所需权限的新 token
3. 添加到你的 MCP 配置

```json
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sentry"],
      "env": {
        "SENTRY_AUTH_TOKEN": "your_sentry_token"
      }
    }
  }
}
```

## Grafana MCP (v0.2.0)

### 前提条件

- Grafana API 密钥，需有 `Viewer` 或 `Editor` 角色
- 有目标仪表板和数据源的访问权限

### Token 设置

1. 前往 Grafana → Configuration → API Keys
2. 创建 `Viewer` 角色的新密钥
3. 添加到你的 MCP 配置

```json
{
  "mcpServers": {
    "grafana": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-grafana"],
      "env": {
        "GRAFANA_API_KEY": "your_grafana_key"
      }
    }
  }
}
```

## 验证配置

添加 MCP 服务器后，验证它们是否正常工作：

```text
/incident config
```

此命令会显示哪些数据源已配置并启用：

```text
📋 Incident Commander 配置
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GitHub:  ✅ 已连接 (gh CLI + MCP)
  Sentry:  ✅ 已连接 (MCP)
  Grafana: ❌ 未配置
  Kibana:  ❌ 未配置
  Deploy:  ❌ 未配置
```

## 安全最佳实践

- **永远不要将 token 提交到版本控制**
- 使用 `.claude/settings.local.json` 存放个人 token
- 定期轮换 token
- 使用最小必要权限
- 在 CI/CD 中考虑使用环境变量

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```
