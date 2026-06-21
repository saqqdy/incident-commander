/**
 * Timeline builder
 *
 * Merges raw events from multiple sources into a unified, ordered, deduplicated timeline
 */

import { type EventType, type TimelineEvent, type TimelineResult, VERSION } from '../types'

/** Timeline builder options */
export interface TimelineBuilderOptions {
	/** Deduplication time window in milliseconds (default: 5000) */
	dedupWindowMs?: number
}

const DEFAULT_OPTIONS: Required<TimelineBuilderOptions> = {
	dedupWindowMs: 5000,
}

/** All possible EventType values for exhaustive initialization */
const ALL_EVENT_TYPES: EventType[] = [
	'deploy',
	'error',
	'alert',
	'code_change',
	'config_change',
	'recovery',
	'rollback',
	'metric_anomaly',
	'log_anomaly',
	'communication',
	'other',
]

/** Build a timeline */
export function buildTimeline(
	events: TimelineEvent[],
	options?: TimelineBuilderOptions
): TimelineResult {
	const opts = { ...DEFAULT_OPTIONS, ...options }

	// 1. Sort
	const sorted = [...events].sort(
		(a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
	)

	// 2. Deduplicate
	const deduped = deduplicate(sorted, opts.dedupWindowMs)

	// 3. Compute statistics
	const statistics = computeStatistics(deduped)

	// 4. Identify turning points
	const turningPoints = identifyTurningPoints(deduped)

	// 5. Time range
	const timeRange =
		deduped.length > 0
			? {
					start: deduped[0]!.timestamp,
					end: deduped[deduped.length - 1]!.timestamp,
				}
			: { start: '', end: '' }

	return {
		version: VERSION,
		events: deduped,
		totalCount: deduped.length,
		timeRange,
		statistics,
		turningPoints,
	}
}

/** Deduplicate: keep the most informative version when the same event appears from different sources */
function deduplicate(events: TimelineEvent[], windowMs: number): TimelineEvent[] {
	const result: TimelineEvent[] = []
	const seen = new Map<string, { event: TimelineEvent; index: number }>()

	for (const event of events) {
		const key = generateDedupKey(event, windowMs)
		const entry = seen.get(key)

		if (!entry) {
			seen.set(key, { event, index: result.length })
			result.push(event)
		} else if (event.description.length > entry.event.description.length) {
			// Keep the version with more information
			result[entry.index] = event
			seen.set(key, { event, index: entry.index })
		}
	}

	return result
}

/** Generate dedup key: same-title cross-source events within the time window are considered duplicates */
function generateDedupKey(event: TimelineEvent, windowMs: number): string {
	const timeBucket = Math.floor(new Date(event.timestamp).getTime() / windowMs)
	const normalizedTitle = event.title.toLowerCase().trim()
	// Deliberately omit source — same event from different sources should be deduped
	return `${timeBucket}:${normalizedTitle}`
}

/** Compute statistics by event type (exhaustive, no unsafe cast) */
function computeStatistics(events: TimelineEvent[]): Record<EventType, number> {
	const stats = Object.fromEntries(ALL_EVENT_TYPES.map(t => [t, 0])) as Record<EventType, number>

	for (const event of events) {
		stats[event.type]++
	}

	return stats
}

/**
 * Binary search: find the insertion index for target in a sorted array.
 * Returns the index where target would be inserted to maintain sort order.
 */
function binarySearchIndex(sorted: number[], target: number): number {
	let lo = 0,
		hi = sorted.length
	while (lo < hi) {
		const mid = (lo + hi) >>> 1
		if (sorted[mid]! < target) {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return lo
}

/** Identify key turning points */
function identifyTurningPoints(events: TimelineEvent[]): TimelineEvent[] {
	const points: TimelineEvent[] = []

	// Pre-build sorted deploy timestamp index for O(log n) lookup
	const deployTimes = events
		.filter(e => e.type === 'deploy')
		.map(e => new Date(e.timestamp).getTime())
		.sort((a, b) => a - b)

	let hasSeenError = false,
		hasSeenAlert = false,
		hasSeenRecovery = false

	for (const event of events) {
		// First error event
		if (event.type === 'error' && !hasSeenError) {
			points.push(event)
			hasSeenError = true
			continue
		}

		// First alert event
		if (event.type === 'alert' && !hasSeenAlert) {
			points.push(event)
			hasSeenAlert = true
			continue
		}

		// Error within 5 minutes of a deploy — uses binary search O(log n)
		if (event.type === 'error') {
			const targetTime = new Date(event.timestamp).getTime()
			const windowMs = 5 * 60 * 1000
			const idx = binarySearchIndex(deployTimes, targetTime)
			if (idx > 0 && targetTime - deployTimes[idx - 1]! <= windowMs) {
				points.push(event)
				continue
			}
		}

		// First recovery event
		if (event.type === 'recovery' && !hasSeenRecovery) {
			points.push(event)
			hasSeenRecovery = true
			continue
		}

		// Rollback events
		if (event.type === 'rollback') {
			points.push(event)
		}
	}

	return points
}
