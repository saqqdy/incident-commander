# 配置工具

配置管理辅助函数。

## getDefaultConfig()

获取默认配置的深拷贝。

```typescript
function getDefaultConfig(): IncidentConfig
```

**示例：**

```typescript
import { getDefaultConfig } from 'incident-commander'

const config = getDefaultConfig()
// config.collectors.github.enabled === true
// config.collectors.sentry.enabled === false
// config.defaultTimeWindowMinutes === 60
```

## mergeConfig()

将用户配置与默认值深度合并。

```typescript
function mergeConfig(user: Partial<IncidentConfig>): IncidentConfig
```

**示例：**

```typescript
import { mergeConfig } from 'incident-commander'

const config = mergeConfig({
  collectors: {
    sentry: { enabled: true, token: 'my-token' },
  },
  defaultTimeWindowMinutes: 120,
})

// config.collectors.github.enabled === true   （来自默认值）
// config.collectors.sentry.enabled === true    （来自用户配置）
// config.defaultTimeWindowMinutes === 120     （来自用户配置）
// config.maxParallelCollectors === 6          （来自默认值）
```
