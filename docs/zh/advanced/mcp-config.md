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
    }
  }
}
```

## GitHub MCP

### 前提条件

- GitHub 个人访问令牌，需有 `repo` 和 `read:org` 权限
- 有目标仓库的访问权限

## Sentry MCP (v0.2.0)

### 前提条件

- Sentry 认证令牌，需有 `org:read`、`project:read` 和 `team:read` 权限

## Grafana MCP (v0.2.0)

### 前提条件

- Grafana API 密钥，需有 `Viewer` 或 `Editor` 角色

## 验证配置

```text
/incident config
```

## 安全最佳实践

- **永远不要将 token 提交到版本控制**
- 使用 `.claude/settings.local.json` 存放个人 token
- 定期轮换 token
- 使用最小必要权限
- 在 CI/CD 中考虑使用环境变量

详细配置请参考 [英文文档](/advanced/mcp-config)。
