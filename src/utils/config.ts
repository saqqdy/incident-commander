/**
 * Configuration management
 */

export interface DataSourceConfig {
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

export interface IncidentConfig {
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

/** Deep merge user config with defaults (per-collector level) */
export function mergeConfig(user: Partial<IncidentConfig>): IncidentConfig {
	const collectors = { ...DEFAULT_CONFIG.collectors }
	if (user.collectors) {
		for (const key of Object.keys(user.collectors) as (keyof typeof collectors)[]) {
			collectors[key] = { ...collectors[key], ...user.collectors[key] }
		}
	}
	return { ...DEFAULT_CONFIG, ...user, collectors }
}

/** Get default configuration */
export function getDefaultConfig(): IncidentConfig {
	return structuredClone(DEFAULT_CONFIG)
}
