/**
 * Incident Commander
 *
 * Entry module — exports all public APIs
 */

// Analyzers
export { buildTimeline } from './analyzers/timeline'

export type { TimelineBuilderOptions } from './analyzers/timeline'
// Collectors
export { GitHubCollector } from './collectors/github'

export type { GitHubCollectorOptions } from './collectors/github'
// Mock data (for demo / playground)
export { MOCK_EVENTS, MOCK_IMPACT, MOCK_RCA } from './mock/data'

// Reporters
export { generatePostMortem, renderPostMortemMarkdown } from './reporters/postmortem'
export type { PostMortemOptions } from './reporters/postmortem'

// Types
export type {
	ActionItem,
	CausalityNode,
	CollectionResult,
	Collector,
	Confidence,
	DataSource,
	EventType,
	ImpactResult,
	PostMortemReport,
	RCAResult,
	SeverityLevel,
	TimelineEvent,
	TimelineResult,
} from './types'

export { VERSION } from './types'

export { getDefaultConfig, mergeConfig } from './utils/config'
export type { DataSourceConfig, IncidentConfig } from './utils/config'
// Utilities
export {
	eventToMarkdownRow,
	eventTypeBadge,
	formatDuration,
	sourceLabel,
	toISO,
} from './utils/format'
