/**
 * Post-Mortem report generator
 *
 * Renders timeline and RCA results into a structured Markdown report
 */

import type {
	ActionItem,
	ImpactResult,
	PostMortemReport,
	RCAResult,
	SeverityLevel,
	TimelineResult,
} from '../types'
import { eventToMarkdownRow, formatDuration } from '../utils/format'

/** Report generation options */
export interface PostMortemOptions {
	/** Whether to include raw data section (for debugging) */
	includeRawData?: boolean
}

/** Compute duration in minutes */
function computeDurationMinutes(start: string, end: string): number {
	const ms = new Date(end).getTime() - new Date(start).getTime()
	return Math.max(0, Math.round(ms / 60000))
}

/** Infer severity from impact score */
function inferSeverity(impact: ImpactResult): SeverityLevel {
	if (impact.degradationScore >= 80) return 'SEV1'
	if (impact.degradationScore >= 40) return 'SEV2'
	return 'SEV3'
}

/** Generate a complete Post-Mortem report object */
export function generatePostMortem(
	title: string,
	timeline: TimelineResult,
	rca: RCAResult,
	impact: ImpactResult,
	_options?: PostMortemOptions
): PostMortemReport {
	const severity = inferSeverity(impact)
	const durationMinutes = computeDurationMinutes(timeline.timeRange.start, timeline.timeRange.end)

	return {
		version: '0.1.0',
		title,
		severity,
		timeRange: timeline.timeRange,
		durationMinutes,
		impactSummary: buildImpactSummary(impact),
		timeline,
		rca,
		impact,
		mitigations: extractMitigations(rca),
		fixes: extractFixes(rca),
		verifications: [],
		shortTermPreventions: extractShortTermPreventions(rca),
		longTermImprovements: extractLongTermImprovements(rca),
		actionItems: buildActionItems(rca),
	}
}

/** Render report as Markdown string */
export function renderPostMortemMarkdown(
	report: PostMortemReport,
	options?: PostMortemOptions
): string {
	const lines: string[] = []

	// Title
	lines.push(`# Incident Post-Mortem: ${report.title}`)
	lines.push('')

	// Summary
	lines.push('## Summary')
	lines.push('')
	lines.push(`- **Severity**: ${report.severity}`)
	lines.push(`- **Duration**: ${formatDuration(report.durationMinutes)}`)
	lines.push(`- **Start Time**: ${report.timeRange.start}`)
	lines.push(`- **End Time**: ${report.timeRange.end}`)
	lines.push(`- **Impact**: ${report.impactSummary}`)
	lines.push('')

	// Timeline
	lines.push('## Timeline')
	lines.push('')
	lines.push('| Time (UTC) | Event | Source |')
	lines.push('|-----------|-------|--------|')
	for (const event of report.timeline.events) {
		lines.push(eventToMarkdownRow(event))
	}
	lines.push('')

	// Root Cause Analysis
	lines.push('## Root Cause Analysis')
	lines.push('')
	lines.push('### Causal Chain')
	lines.push('')
	for (let i = 0; i < report.rca.causalChain.length; i++) {
		const node = report.rca.causalChain[i]!
		const roleMap: Record<string, string> = {
			trigger: 'Trigger',
			propagation: 'Propagation',
			symptom: 'Symptom',
			mitigation: 'Mitigation',
		}
		lines.push(`${i + 1}. **${roleMap[node.role]}** ${eventToMarkdownRow(node.event)}`)
		if (node.causation) {
			lines.push(`   → ${node.causation}`)
		}
	}
	lines.push('')

	lines.push('### Direct Cause')
	lines.push(report.rca.directCause)
	lines.push('')

	lines.push('### Contributing Factors')
	for (const factor of report.rca.contributingFactors) {
		lines.push(`- ${factor}`)
	}
	lines.push('')

	lines.push('### Root Cause')
	lines.push(report.rca.rootCause)
	lines.push('')

	lines.push(`### Confidence: ${renderConfidence(report.rca.confidence)}`)
	lines.push(report.rca.confidenceReason)
	lines.push('')

	if (report.rca.alternativeHypotheses.length > 0) {
		lines.push('### Alternative Hypotheses')
		for (const hyp of report.rca.alternativeHypotheses) {
			lines.push(`- ${hyp}`)
		}
		lines.push('')
	}

	// Impact
	lines.push('## Impact')
	lines.push('')
	if (report.impact.affectedUsers !== null) {
		lines.push(`- **Affected Users**: ~${report.impact.affectedUsers}`)
	} else {
		lines.push('- **Affected Users**: [TBD]')
	}
	lines.push(`- **Service Degradation**: ${report.impact.degradationScore}/100`)
	const features =
		report.impact.affectedFeatures.length > 0
			? report.impact.affectedFeatures.join(', ')
			: 'None'
	lines.push(`- **Affected Features**: ${features}`)
	lines.push(`- **Data Impact**: ${report.impact.dataImpact} (${report.impact.dataImpactNote})`)
	lines.push('')

	// Fixes
	lines.push('## Fixes')
	lines.push('')
	lines.push('### Mitigations')
	lines.push(report.mitigations.length > 0 ? '' : '- None')
	for (const m of report.mitigations) {
		lines.push(`- ${m}`)
	}
	if (report.mitigations.length > 0) lines.push('')

	lines.push('### Root Fix')
	for (const f of report.fixes) {
		lines.push(`- ${f}`)
	}
	lines.push('')

	// Prevention
	lines.push('## Prevention')
	lines.push('')
	lines.push('### Short-term Prevention')
	for (const p of report.shortTermPreventions) {
		lines.push(`- ${p}`)
	}
	lines.push('')

	lines.push('### Long-term Improvement')
	for (const p of report.longTermImprovements) {
		lines.push(`- ${p}`)
	}
	lines.push('')

	// Action Items
	if (report.actionItems.length > 0) {
		lines.push('## Action Items')
		lines.push('')
		lines.push('| Action | Owner | Deadline | Priority |')
		lines.push('|--------|-------|----------|----------|')
		for (const item of report.actionItems) {
			lines.push(`| ${item.action} | ${item.owner} | ${item.deadline} | ${item.priority} |`)
		}
		lines.push('')
	}

	// Raw Data (optional, for debugging)
	if (options?.includeRawData) {
		lines.push('## Raw Data')
		lines.push('')
		lines.push('```json')
		lines.push(JSON.stringify(report, null, 2))
		lines.push('```')
		lines.push('')
	}

	return lines.join('\n')
}

function renderConfidence(confidence: 'high' | 'medium' | 'low'): string {
	const map = { high: '🟢 High', medium: '🟡 Medium', low: '🔴 Low' }
	return map[confidence]
}

function buildImpactSummary(impact: ImpactResult): string {
	const dataLabels: Record<string, string> = {
		none: 'No data impact',
		partial: 'Partial data unavailability',
		loss: 'Data loss',
		inconsistency: 'Data inconsistency',
		unknown: 'Data impact unknown',
	}

	const userPart =
		impact.affectedUsers !== null
			? `~${impact.affectedUsers} users affected`
			: 'User impact TBD'

	return `${userPart}, degradation ${impact.degradationScore}/100, ${dataLabels[impact.dataImpact] ?? ''}`
}

function extractMitigations(rca: RCAResult): string[] {
	return rca.causalChain.filter(n => n.role === 'mitigation').map(n => n.event.title)
}

function extractFixes(rca: RCAResult): string[] {
	const fixes: string[] = []
	for (const node of rca.causalChain) {
		if (node.role === 'mitigation') fixes.push(node.event.title)
	}
	if (fixes.length === 0) fixes.push(rca.directCause)
	return fixes
}

function extractShortTermPreventions(rca: RCAResult): string[] {
	return rca.contributingFactors.length > 0
		? rca.contributingFactors.slice(0, 2)
		: [rca.directCause]
}

function extractLongTermImprovements(rca: RCAResult): string[] {
	return [rca.rootCause, ...rca.contributingFactors.slice(2)]
}

function buildActionItems(rca: RCAResult): ActionItem[] {
	const items: ActionItem[] = []

	for (const factor of rca.contributingFactors) {
		items.push({
			action: factor,
			owner: '[TBD]',
			deadline: '[TBD]',
			priority: 'P1',
		})
	}

	items.push({
		action: rca.rootCause,
		owner: '[TBD]',
		deadline: '[TBD]',
		priority: 'P0',
	})

	return items
}
