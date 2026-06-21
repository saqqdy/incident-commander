import { describe, expect, it } from 'vitest'
import { buildTimeline } from '../analyzers/timeline'
import { generatePostMortem, renderPostMortemMarkdown } from '../reporters/postmortem'
import { MOCK_EVENTS, MOCK_IMPACT, MOCK_RCA } from './data'

describe('mock data', () => {
	it('produces a valid timeline via buildTimeline', () => {
		const result = buildTimeline(MOCK_EVENTS)

		expect(result.totalCount).toBe(MOCK_EVENTS.length)
		expect(result.events[0]!.type).toBe('code_change')
		expect(result.events[result.events.length - 1]!.type).toBe('recovery')
		expect(result.turningPoints.length).toBeGreaterThanOrEqual(3)
	})

	it('produces a valid post-mortem via generatePostMortem', () => {
		const timeline = buildTimeline(MOCK_EVENTS)
		const report = generatePostMortem('Test Incident', timeline, MOCK_RCA, MOCK_IMPACT)

		expect(report.title).toBe('Test Incident')
		expect(report.severity).toBe('SEV2')
		expect(report.timeline.totalCount).toBe(MOCK_EVENTS.length)
		expect(report.rca.rootCause).toBeTruthy()
		expect(report.impact.degradationScore).toBe(75)
	})

	it('renders post-mortem markdown without throwing', () => {
		const timeline = buildTimeline(MOCK_EVENTS)
		const report = generatePostMortem('Test Incident', timeline, MOCK_RCA, MOCK_IMPACT)
		const markdown = renderPostMortemMarkdown(report)

		expect(markdown).toContain('# Incident Post-Mortem: Test Incident')
		expect(markdown).toContain('Root Cause Analysis')
	})
})
