import type { DataSource, EventType, TimelineEvent } from '../types'
import { describe, expect, it } from 'vitest'
import {
	eventToMarkdownRow,
	eventTypeBadge,
	formatDuration,
	formatTimestamp,
	sourceLabel,
	toISO,
} from './format'

describe('toISO', () => {
	it('converts ISO string', () => {
		expect(toISO('2026-06-20T10:00:00Z')).toBe('2026-06-20T10:00:00.000Z')
	})

	it('converts numeric timestamp', () => {
		expect(toISO(new Date('2026-06-20T10:00:00Z').getTime())).toBe(
			'2026-06-20T10:00:00.000Z',
		)
	})

	it('converts Date object', () => {
		expect(toISO(new Date('2026-01-01'))).toBe('2026-01-01T00:00:00.000Z')
	})
})

describe('formatDuration', () => {
	it('formats seconds', () => {
		expect(formatDuration(0.5)).toBe('30s')
	})

	it('formats minutes', () => {
		expect(formatDuration(5)).toBe('5min')
	})

	it('formats hours and minutes', () => {
		expect(formatDuration(90)).toBe('1h 30min')
	})

	it('formats whole hours', () => {
		expect(formatDuration(120)).toBe('2h')
	})
})

describe('eventTypeBadge', () => {
	it('returns emoji for known types', () => {
		expect(eventTypeBadge('error')).toBe('🔴')
		expect(eventTypeBadge('deploy')).toBe('🚀')
	})

	it('returns question mark for unknown type', () => {
		expect(eventTypeBadge('other' as EventType)).toBe('❓')
	})
})

describe('sourceLabel', () => {
	it('returns label for known sources', () => {
		expect(sourceLabel('github')).toBe('GitHub')
		expect(sourceLabel('sentry')).toBe('Sentry')
	})

	it('returns raw source for unknown', () => {
		expect(sourceLabel('custom' as DataSource)).toBe('custom')
	})
})

describe('formatTimestamp', () => {
	it('formats ISO string with Z suffix', () => {
		expect(formatTimestamp('2026-06-20T10:05:00Z')).toBe('2026-06-20 10:05:00 UTC')
	})

	it('formats ISO string with +00:00 offset', () => {
		expect(formatTimestamp('2026-06-20T10:05:00+00:00')).toBe('2026-06-20 10:05:00 UTC')
	})

	it('returns raw string for invalid date', () => {
		expect(formatTimestamp('not-a-date')).toBe('not-a-date')
	})
})

describe('eventToMarkdownRow', () => {
	it('formats event as markdown table row', () => {
		const event: TimelineEvent = {
			type: 'error',
			timestamp: '2026-06-20T10:05:00.000Z',
			title: 'Error spike',
			description: 'Rate exceeded threshold',
			source: 'sentry',
		}
		const row = eventToMarkdownRow(event)
		expect(row).toContain('2026-06-20 10:05:00 UTC')
		expect(row).toContain('🔴 Error spike')
		expect(row).toContain('Sentry')
		expect(row.charAt(0)).toBe('|')
	})
})
