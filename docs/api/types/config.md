# IncidentConfig

Configuration object for Incident Commander.

## Definition

```typescript
interface IncidentConfig {
  /** Collector configurations */
  collectors: {
    github: DataSourceConfig
    sentry: DataSourceConfig
    grafana: DataSourceConfig
    kibana: DataSourceConfig
    deploy: DataSourceConfig
  }
  /** Default time window in minutes */
  defaultTimeWindowMinutes: number
  /** Max parallel collectors */
  maxParallelCollectors: number
}

interface DataSourceConfig {
  /** Whether enabled */
  enabled: boolean
  /** API endpoint */
  endpoint?: string
  /** Auth token */
  token?: string
  /** Organization/project identifier */
  org?: string
  project?: string
}
```

## Default Values

```typescript
const DEFAULT_CONFIG: IncidentConfig = {
  collectors: {
    github: { enabled: true },
    sentry: { enabled: false },
    grafana: { enabled: false },
    kibana: { enabled: false },
    deploy: { enabled: false },
  },
  defaultTimeWindowMinutes: 60,
  maxParallelCollectors: 6,
}
```

## Related Functions

- [getDefaultConfig()](/api/utils/config) — Get default configuration
- [mergeConfig()](/api/utils/config) — Merge user config with defaults
