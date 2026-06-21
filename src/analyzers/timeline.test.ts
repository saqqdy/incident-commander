import type { TimelineEvent } from '../types'
import { describe, expect, it } from 'vitest'
import { buildTimeline } from './timeline'

const makeEvent = (
	overrides: Partial<TimelineEvent> & Pick<TimelineEvent, 'timestamp' | 'title' | 'type'>
): TimelineEvent => ({
	description: '',
	source: 'github',
	...overrides,
})

describe('buildTimeline', () => {
	it('sorts events by timestamp', () => {
		const events = [
			makeEvent({ type: 'error', timestamp: '2026-06-20T10:05:00Z', title: 'Error spike' }),
			makeEvent({ type: 'deploy', timestamp: '2026-06-20T10:02:00Z', title: 'Deploy' }),
			makeEvent({ type: 'code_change', timestamp: '2026-06-20T10:00:00Z', title: 'Commit' }),
		]

		const result = buildTimeline(events)
		expect(result.events.map(e => e.title)).toEqual(['Commit', 'Deploy', 'Error spike'])
	})

	it('deduplicates cross-source events within window', () => {
		const events = [
			makeEvent({
				type: 'error',
				timestamp: '2026-06-20T10:05:00Z',
				title: 'Error rate spike',
				source: 'sentry',
				description: 'Short',
			}),
			makeEvent({
				type: 'error',
				timestamp: '2026-06-20T10:05:02Z',
				title: 'Error rate spike',
				source: 'grafana',
				description: 'Longer description here',
			}),
		]

		const result = buildTimeline(events, { dedupWindowMs: 5000 })
		expect(result.totalCount).toBe(1)
		expect(result.events[0]!.source).toBe('grafana')
	})

	it('identifies turning points', () => {
		const events = [
			makeEvent({ type: 'deploy', timestamp: '2026-06-20T10:00:00Z', title: 'Deploy v2' }),
			makeEvent({ type: 'error', timestamp: '2026-06-20T10:03:00Z', title: 'Error spike' }),
			makeEvent({
				type: 'alert',
				timestamp: '2026-06-20T10:05:00Z',
				title: 'Alert triggered',
			}),
			makeEvent({ type: 'rollback', timestamp: '2026-06-20T10:30:00Z', title: 'Rollback' }),
			makeEvent({ type: 'recovery', timestamp: '2026-06-20T10:35:00Z', title: 'Recovered' }),
		]

		const result = buildTimeline(events)
		expect(result.turningPoints.length).toBeGreaterThanOrEqual(3)
		expect(result.turningPoints.some(e => e.type === 'error')).toBe(true)
		expect(result.turningPoints.some(e => e.type === 'rollback')).toBe(true)
		expect(result.turningPoints.some(e => e.type === 'recovery')).toBe(true)
	})

	it('handles empty events', () => {
		const result = buildTimeline([])
		expect(result.totalCount).toBe(0)
		expect(result.timeRange).toEqual({ start: '', end: '' })
	})
})
