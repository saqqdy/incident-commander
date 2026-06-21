# IncidentConfig

Incident Commander 的配置对象。

## 定义

```typescript
interface IncidentConfig {
  /** 采集器配置 */
  collectors: {
    github: DataSourceConfig
    sentry: DataSourceConfig
    grafana: DataSourceConfig
    kibana: DataSourceConfig
    deploy: DataSourceConfig
  }
  /** 默认时间窗口（分钟） */
  defaultTimeWindowMinutes: number
  /** 最大并行采集器数 */
  maxParallelCollectors: number
}

interface DataSourceConfig {
  /** 是否启用 */
  enabled: boolean
  /** API 端点 */
  endpoint?: string
  /** 认证令牌 */
  token?: string
  /** 组织/项目标识 */
  org?: string
  project?: string
}
```

## 默认值

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

## 相关函数

- [getDefaultConfig()](/zh/api/utils/config) — 获取默认配置
- [mergeConfig()](/zh/api/utils/config) — 合并用户配置与默认值
