/**
 * Formatting utility functions
 */

import type { DataSource, EventType, TimelineEvent } from '../types'

/** Convert any timestamp to ISO 8601 string */
export function toISO(timestamp: string | number | Date): string {
	return new Date(timestamp).toISOString()
}

/** Format duration (minutes → human-readable) */
export function formatDuration(minutes: number): string {
	if (minutes < 1) return `${Math.round(minutes * 60)}s`
	if (minutes < 60) return `${Math.round(minutes)}min`
	const hours = Math.floor(minutes / 60)
	const mins = Math.round(minutes % 60)
	return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

/** Event type → emoji badge */
const EVENT_TYPE_BADGE: Record<EventType, string> = {
	deploy: '🚀',
	error: '🔴',
	alert: '⚠️',
	code_change: '📝',
	config_change: '⚙️',
	recovery: '✅',
	rollback: '⏪',
	metric_anomaly: '📊',
	log_anomaly: '📋',
	communication: '💬',
	other: '❓',
}

/** Data source → label */
const SOURCE_LABEL: Record<DataSource, string> = {
	github: 'GitHub',
	sentry: 'Sentry',
	grafana: 'Grafana',
	kibana: 'Kibana',
	deploy: 'Deploy',
	manual: 'Manual',
}

/**
 * Format an ISO timestamp into a human-readable Markdown-friendly string.
 * Uses Date parsing to handle all ISO 8601 variants (Z, +00:00, no offset)
 * rather than fragile regex assumptions.
 */
export function formatTimestamp(iso: string): string {
	const d = new Date(iso)
	if (isNaN(d.getTime())) return iso
	const YYYY = d.getUTCFullYear()
	const MM = String(d.getUTCMonth() + 1).padStart(2, '0')
	const DD = String(d.getUTCDate()).padStart(2, '0')
	const hh = String(d.getUTCHours()).padStart(2, '0')
	const mm = String(d.getUTCMinutes()).padStart(2, '0')
	const ss = String(d.getUTCSeconds()).padStart(2, '0')
	return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss} UTC`
}

/** Format timeline event as Markdown table row */
export function eventToMarkdownRow(event: TimelineEvent): string {
	const time = formatTimestamp(event.timestamp)
	const badge = EVENT_TYPE_BADGE[event.type] ?? '❓'
	const source = SOURCE_LABEL[event.source] ?? event.source
	return `| ${time} | ${badge} ${event.title} | ${source} |`
}

/** Get emoji badge for event type */
export function eventTypeBadge(type: EventType): string {
	return EVENT_TYPE_BADGE[type] ?? '❓'
}

/** Get label for data source */
export function sourceLabel(source: DataSource): string {
	return SOURCE_LABEL[source] ?? source
}
