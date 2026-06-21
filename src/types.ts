/**
 * Incident Commander — Core type definitions
 */

/** Current package version, injected at build time */
export const VERSION = '0.1.0'

/** Event type enum */
export type EventType =
	| 'deploy'
	| 'error'
	| 'alert'
	| 'code_change'
	| 'config_change'
	| 'recovery'
	| 'rollback'
	| 'metric_anomaly'
	| 'log_anomaly'
	| 'communication'
	| 'other'

/** Data source identifier */
export type DataSource = 'github' | 'sentry' | 'grafana' | 'kibana' | 'deploy' | 'manual'

/** Timeline event */
export interface TimelineEvent {
	/** ISO 8601 timestamp */
	timestamp: string
	/** Event title */
	title: string
	/** Event description */
	description: string
	/** Event type */
	type: EventType
	/** Data source */
	source: DataSource
	/** Raw data (optional, for debugging) */
	raw?: unknown
}

/** Collector result */
export interface CollectionResult<T = unknown> {
	/** Data source */
	source: DataSource
	/** Whether collection succeeded */
	success: boolean
	/** Collected events */
	events: TimelineEvent[]
	/** Collection duration in milliseconds */
	duration: number
	/** Error message (when collection fails) */
	error?: string
	/** Raw response data */
	rawData?: T
}

/** Timeline build result */
export interface TimelineResult {
	/** Schema version for forward compatibility */
	version: string
	/** All events (sorted and deduplicated) */
	events: TimelineEvent[]
	/** Total event count */
	totalCount: number
	/** Time range */
	timeRange: {
		start: string
		end: string
	}
	/** Statistics by event type */
	statistics: Record<EventType, number>
	/** Key turning points */
	turningPoints: TimelineEvent[]
}

/** Confidence level */
export type Confidence = 'high' | 'medium' | 'low'

/** Causality chain node */
export interface CausalityNode {
	/** Event */
	event: TimelineEvent
	/** Role in the causal chain */
	role: 'trigger' | 'propagation' | 'symptom' | 'mitigation'
	/** Causal relationship to the next node */
	causation?: string
}

/** Root cause analysis result */
export interface RCAResult {
	/** Causal chain */
	causalChain: CausalityNode[]
	/** Direct cause */
	directCause: string
	/** Contributing factors */
	contributingFactors: string[]
	/** Root cause */
	rootCause: string
	/** Overall confidence */
	confidence: Confidence
	/** Confidence reasoning */
	confidenceReason: string
	/** Alternative hypotheses */
	alternativeHypotheses: string[]
}

/** Impact assessment */
export interface ImpactResult {
	/** Estimated affected users */
	affectedUsers: number | null
	/** User count explanation */
	affectedUsersNote: string
	/**
	 * Degradation score (0-100).
	 * 0 = no impact, 100 = fully unavailable.
	 * Higher values indicate more severe service degradation.
	 */
	degradationScore: number
	/** Affected features */
	affectedFeatures: string[]
	/** Data impact */
	dataImpact: 'none' | 'partial' | 'loss' | 'inconsistency' | 'unknown'
	/** Data impact description */
	dataImpactNote: string
}

/** Severity level */
export type SeverityLevel = 'SEV1' | 'SEV2' | 'SEV3'

/** Post-Mortem report */
export interface PostMortemReport {
	/** Schema version for forward compatibility */
	version: string
	/** Incident title */
	title: string
	/** Severity level */
	severity: SeverityLevel
	/** Time range */
	timeRange: {
		start: string
		end: string
	}
	/** Duration in minutes */
	durationMinutes: number
	/** Impact summary */
	impactSummary: string
	/** Timeline */
	timeline: TimelineResult
	/** Root cause analysis */
	rca: RCAResult
	/** Impact assessment */
	impact: ImpactResult
	/** Mitigations */
	mitigations: string[]
	/** Root fixes */
	fixes: string[]
	/** Verification methods */
	verifications: string[]
	/** Short-term preventions */
	shortTermPreventions: string[]
	/** Long-term improvements */
	longTermImprovements: string[]
	/** Action items */
	actionItems: ActionItem[]
}

/** Action item */
export interface ActionItem {
	/** Action description */
	action: string
	/** Owner */
	owner: string
	/** Deadline */
	deadline: string
	/** Priority */
	priority: 'P0' | 'P1' | 'P2'
}

/** Collector interface */
export interface Collector {
	/** Data source identifier */
	readonly source: DataSource
	/** Collect data */
	collect: (timeRange: { start: string; end: string }) => Promise<CollectionResult>
	/** Optional cleanup for long-running collectors (e.g., WebSocket streams) */
	dispose?: () => void | Promise<void>
}
