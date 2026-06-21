#!/usr/bin/env node
/**
 * Incident Commander CLI
 *
 * Provides a demo mode to try the full pipeline without any API keys.
 */

import { buildTimeline } from './analyzers/timeline'
import { MOCK_EVENTS, MOCK_IMPACT, MOCK_RCA } from './mock/data'
import { generatePostMortem, renderPostMortemMarkdown } from './reporters/postmortem'
import { eventToMarkdownRow, formatTimestamp } from './utils/format'

const args = process.argv.slice(2)

function printUsage(): void {
	console.log(`
Incident Commander CLI

Usage:
  incident-commander demo              Run full pipeline with mock data
  incident-commander timeline --mock   Build and print timeline from mock data
  incident-commander --help            Show this usage information

Examples:
  pnpm run demo
  node dist/cli.js demo
`)
}

function runDemo(): void {
	const timeline = buildTimeline(MOCK_EVENTS)
	const report = generatePostMortem(
		'user-service API Breaking Change Causing 500 Errors',
		timeline,
		MOCK_RCA,
		MOCK_IMPACT
	)
	const markdown = renderPostMortemMarkdown(report)

	console.log(markdown)
	console.log(
		`\n✅ Demo complete — ${timeline.totalCount} events, ${timeline.turningPoints.length} turning points\n`
	)
}

function runTimelineMock(): void {
	const timeline = buildTimeline(MOCK_EVENTS)

	console.log('# Incident Timeline\n')
	console.log('| Time (UTC) | Event | Source |')
	console.log('|-----------|-------|--------|')
	for (const event of timeline.events) {
		console.log(eventToMarkdownRow(event))
	}

	console.log('\n## Statistics\n')
	console.log('| Event Type | Count |')
	console.log('|-----------|-------|')
	for (const [type, count] of Object.entries(timeline.statistics)) {
		if (count > 0) {
			console.log(`| ${type} | ${count} |`)
		}
	}

	console.log('\n## Key Turning Points\n')
	for (let i = 0; i < timeline.turningPoints.length; i++) {
		const tp = timeline.turningPoints[i]!
		const time = formatTimestamp(tp.timestamp)
		console.log(`${i + 1}. **${time}** — ${tp.title}`)
	}

	console.log(
		`\n📊 Timeline: ${timeline.totalCount} events, ${timeline.turningPoints.length} turning points\n`
	)
}

// Command routing
const command = args[0]

if (!command || command === '--help' || command === '-h') {
	printUsage()
} else if (command === 'demo') {
	runDemo()
} else if (command === 'timeline') {
	if (args.includes('--mock')) {
		runTimelineMock()
	} else {
		console.error(
			'Error: Real data collection is not yet available in the CLI. Use --mock for demo data.\n'
		)
		printUsage()
		process.exit(1)
	}
} else {
	console.error(`Unknown command: ${command}\n`)
	printUsage()
	process.exit(1)
}
