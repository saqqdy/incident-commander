# MCP Configuration

Model Context Protocol (MCP) servers allow Claude Code to directly query your monitoring and deployment platforms. This guide covers how to configure each data source.

## Adding MCP Servers

Copy configs from `mcp-configs/` into `.claude/settings.json` with your real tokens:

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

### Prerequisites

- GitHub personal access token with `repo` and `read:org` scopes
- Access to the target repositories

### Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with required scopes
3. Add to your MCP config

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

### Prerequisites

- Sentry auth token with `org:read`, `project:read`, and `team:read` scopes
- Access to the target organizations and projects

### Token Setup

1. Go to Sentry Settings → API Keys
2. Create a new token with required scopes
3. Add to your MCP config

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

### Prerequisites

- Grafana API key with `Viewer` or `Editor` role
- Access to the target dashboards and datasources

### Token Setup

1. Go to Grafana → Configuration → API Keys
2. Create a new key with `Viewer` role
3. Add to your MCP config

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

## Verifying Configuration

After adding MCP servers, verify they're working:

```text
/incident config
```

This shows which data sources are configured and enabled:

```text
📋 Incident Commander Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GitHub:  ✅ Connected (gh CLI + MCP)
  Sentry:  ✅ Connected (MCP)
  Grafana: ❌ Not configured
  Kibana:  ❌ Not configured
  Deploy:  ❌ Not configured
```

## Security Best Practices

- **Never commit tokens** to version control
- Use `.claude/settings.local.json` for personal tokens
- Rotate tokens regularly
- Use minimal required scopes
- Consider using environment variables for CI/CD

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
