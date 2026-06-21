# Config Utilities

Configuration management helpers.

## getDefaultConfig()

Get a deep-cloned copy of the default configuration.

```typescript
function getDefaultConfig(): IncidentConfig
```

**Example:**

```typescript
import { getDefaultConfig } from 'incident-commander'

const config = getDefaultConfig()
// config.collectors.github.enabled === true
// config.collectors.sentry.enabled === false
// config.defaultTimeWindowMinutes === 60
```

## mergeConfig()

Deep merge user configuration with defaults.

```typescript
function mergeConfig(user: Partial<IncidentConfig>): IncidentConfig
```

**Example:**

```typescript
import { mergeConfig } from 'incident-commander'

const config = mergeConfig({
  collectors: {
    sentry: { enabled: true, token: 'my-token' },
  },
  defaultTimeWindowMinutes: 120,
})

// config.collectors.github.enabled === true   (from defaults)
// config.collectors.sentry.enabled === true    (from user)
// config.defaultTimeWindowMinutes === 120     (from user)
// config.maxParallelCollectors === 6          (from defaults)
```
