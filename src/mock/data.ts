/**
 * Mock data for demo mode
 *
 * Based on the sample scenario in examples/sample-timeline.md:
 * user-service API Breaking Change causing 500 errors
 */

import type { DataSource, EventType, ImpactResult, RCAResult, TimelineEvent } from '../types'

const makeEvent = (
	type: EventType,
	timestamp: string,
	title: string,
	source: DataSource,
	description = ''
): TimelineEvent => ({ type, timestamp, title, description, source })

/** Mock events matching the sample-timeline.md scenario */
export const MOCK_EVENTS: TimelineEvent[] = [
	makeEvent(
		'code_change',
		'2026-06-20T10:00:00Z',
		'alice: feat: update user-service API to v2',
		'github'
	),
	makeEvent('deploy', '2026-06-20T10:02:00Z', 'Deploy: production ✅', 'github'),
	makeEvent(
		'error',
		'2026-06-20T10:05:00Z',
		'Error rate spike on /api/users (500 errors)',
		'sentry',
		'500 error rate jumped from 0.1% to 12%'
	),
	makeEvent(
		'alert',
		'2026-06-20T10:08:00Z',
		'Alert: P95 latency > 2s on user-service',
		'grafana',
		'P95 latency reached 3.2s'
	),
	makeEvent(
		'error',
		'2026-06-20T10:15:00Z',
		'Error rate reaches 15% (affected ~5000 users)',
		'sentry',
		'Approximately 5000 users affected'
	),
	makeEvent(
		'communication',
		'2026-06-20T10:20:00Z',
		'@oncall: investigating user-service 500s',
		'manual',
		'On-call engineer started investigation'
	),
	makeEvent(
		'communication',
		'2026-06-20T10:25:00Z',
		'@oncall: identified breaking change in v2 API',
		'manual',
		'Old /api/users endpoint removed in v2'
	),
	makeEvent(
		'rollback',
		'2026-06-20T10:30:00Z',
		'Rollback: production to v2.4.0',
		'github',
		'Rolled back deployment'
	),
	makeEvent(
		'recovery',
		'2026-06-20T10:35:00Z',
		'Error rate recovered to baseline',
		'sentry',
		'Error rate back to 0.1%'
	),
	makeEvent(
		'recovery',
		'2026-06-20T10:38:00Z',
		'P95 latency recovered to < 200ms',
		'grafana',
		'Latency back to normal levels'
	),
]

/** Mock RCA matching the sample-postmortem.md scenario */
export const MOCK_RCA: RCAResult = {
	causalChain: [
		{
			event: MOCK_EVENTS[0]!,
			role: 'trigger',
			causation: 'v2 API includes a Breaking Change, removing the legacy /api/users endpoint',
		},
		{
			event: MOCK_EVENTS[2]!,
			role: 'propagation',
			causation: 'Downstream services calling the old endpoint received 404/500',
		},
		{
			event: MOCK_EVENTS[3]!,
			role: 'symptom',
			causation: 'Retry storm caused service overload',
		},
		{
			event: MOCK_EVENTS[7]!,
			role: 'mitigation',
			causation: 'Old endpoint restored after rollback',
		},
		{
			event: MOCK_EVENTS[8]!,
			role: 'mitigation',
			causation: 'Rollback confirmed effective',
		},
	],
	directCause:
		'The v2 API removed the /api/users endpoint, and downstream consumer services were not updated in sync.',
	contributingFactors: [
		'Missing consumer contract tests',
		'Deployment without canary release',
		'3-minute alerting delay',
	],
	rootCause:
		'Lack of API contract validation and canary deployment mechanisms between microservices.',
	confidence: 'high',
	confidenceReason:
		'Deployment time closely matches error onset (3-min delay), immediate recovery after rollback, causal chain complete.',
	alternativeHypotheses: [
		'Another service may have deployed an incompatible change at the same time (low probability, insufficient data to verify)',
		'A DNS switchover may have caused brief routing anomalies (unlikely, recovery occurred after rollback)',
	],
}

/** Mock impact assessment matching the sample-postmortem.md scenario */
export const MOCK_IMPACT: ImpactResult = {
	affectedUsers: 5000,
	affectedUsersNote: 'Estimated from Sentry error rate reaching 15% of user-service traffic',
	degradationScore: 75,
	affectedFeatures: ['user profile queries', 'user listings'],
	dataImpact: 'partial',
	dataImpactNote: 'User data could not be written during some requests',
}
