import type { ImpactResult, RCAResult, TimelineResult } from '../types'
import { describe, expect, it } from 'vitest'
import { buildTimeline } from '../analyzers/timeline'
import { generatePostMortem, renderPostMortemMarkdown } from './postmortem'

const makeEvent = (timestamp: string, title: string, type: any, source: any = 'github') => ({
	type,
	timestamp,
	title,
	description: title,
	source,
})

const makeTimeline = (events: any[]): TimelineResult => buildTimeline(events)

const makeRCA = (): RCAResult => ({
	causalChain: [
		{
			event: makeEvent('2026-06-20T10:02:00Z', 'Deploy v2.5.0', 'deploy'),
			role: 'trigger',
			causation: 'Breaking change removed legacy endpoint',
		},
		{
			event: makeEvent('2026-06-20T10:05:00Z', 'Error spike', 'error', 'sentry'),
			role: 'symptom',
			causation: 'Downstream 500s from removed endpoint',
		},
		{
			event: makeEvent('2026-06-20T10:30:00Z', 'Rollback', 'rollback'),
			role: 'mitigation',
		},
	],
	directCause: 'v2 API removed /api/users endpoint',
	contributingFactors: ['Missing consumer contract tests', 'No canary deployment'],
	rootCause: 'Lack of API contract validation',
	confidence: 'high',
	confidenceReason: 'Deploy closely matches error onset, rollback confirmed fix',
	alternativeHypotheses: ['Another service deployed incompatible change'],
})

const makeImpact = (): ImpactResult => ({
	affectedUsers: 5000,
	affectedUsersNote: 'From error rate x daily active',
	degradationScore: 75,
	affectedFeatures: ['user profile queries', 'user listings'],
	dataImpact: 'partial',
	dataImpactNote: 'Some writes failed during peak',
})

describe('generatePostMortem', () => {
	it('generates a complete report with version', () => {
		const timeline = makeTimeline([
			makeEvent('2026-06-20T10:02:00Z', 'Deploy v2.5.0', 'deploy'),
			makeEvent('2026-06-20T10:05:00Z', 'Error spike', 'error'),
			makeEvent('2026-06-20T10:30:00Z', 'Rollback', 'rollback'),
			makeEvent('2026-06-20T10:35:00Z', 'Recovered', 'recovery'),
		])
		const report = generatePostMortem('API 500 Incident', timeline, makeRCA(), makeImpact())

		expect(report.title).toBe('API 500 Incident')
		expect(report.version).toBe('0.1.0')
		expect(report.severity).toBe('SEV2')
		expect(report.durationMinutes).toBe(33)
		expect(report.mitigations).toContain('Rollback')
		expect(report.actionItems.length).toBeGreaterThanOrEqual(1)
		expect(report.actionItems.some(a => a.priority === 'P0')).toBe(true)
	})

	it('infers SEV1 for high degradation', () => {
		const impact = { ...makeImpact(), degradationScore: 90 }
		const timeline = makeTimeline([makeEvent('2026-06-20T10:00:00Z', 'Deploy', 'deploy')])
		const report = generatePostMortem('Critical', timeline, makeRCA(), impact)
		expect(report.severity).toBe('SEV1')
	})

	it('infers SEV3 for low degradation', () => {
		const impact = { ...makeImpact(), degradationScore: 20 }
		const timeline = makeTimeline([makeEvent('2026-06-20T10:00:00Z', 'Deploy', 'deploy')])
		const report = generatePostMortem('Minor', timeline, makeRCA(), impact)
		expect(report.severity).toBe('SEV3')
	})
})

describe('renderPostMortemMarkdown', () => {
	it('renders markdown with all sections', () => {
		const timeline = makeTimeline([
			makeEvent('2026-06-20T10:02:00Z', 'Deploy v2.5.0', 'deploy'),
			makeEvent('2026-06-20T10:05:00Z', 'Error spike', 'error'),
		])
		const report = generatePostMortem('API 500', timeline, makeRCA(), makeImpact())
		const md = renderPostMortemMarkdown(report)

		expect(md).toContain('# Incident Post-Mortem: API 500')
		expect(md).toContain('## Summary')
		expect(md).toContain('## Timeline')
		expect(md).toContain('## Root Cause Analysis')
		expect(md).toContain('## Impact')
		expect(md).toContain('## Fixes')
		expect(md).toContain('## Prevention')
		expect(md).toContain('## Action Items')
	})

	it('renders raw data section when includeRawData is true', () => {
		const timeline = makeTimeline([makeEvent('2026-06-20T10:00:00Z', 'Deploy', 'deploy')])
		const report = generatePostMortem('Test', timeline, makeRCA(), makeImpact())
		const md = renderPostMortemMarkdown(report, { includeRawData: true })

		expect(md).toContain('## Raw Data')
		expect(md).toContain('```json')
	})

	it('omits raw data by default', () => {
		const timeline = makeTimeline([makeEvent('2026-06-20T10:00:00Z', 'Deploy', 'deploy')])
		const report = generatePostMortem('Test', timeline, makeRCA(), makeImpact())
		const md = renderPostMortemMarkdown(report)

		expect(md).not.toContain('## Raw Data')
	})
})
