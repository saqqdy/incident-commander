<script setup lang="ts">
import { ref, computed } from 'vue'
import { buildTimeline } from '../../../src/analyzers/timeline'
import { generatePostMortem, renderPostMortemMarkdown } from '../../../src/reporters/postmortem'
import { MOCK_EVENTS, MOCK_RCA, MOCK_IMPACT } from '../../../src/mock/data'
import { eventTypeBadge, formatTimestamp, sourceLabel } from '../../../src/utils/format'
import type { DataSource, SeverityLevel, TimelineEvent, ImpactResult, RCAResult } from '../../../src/types'

// --- Controls ---
const sources = ref<Record<DataSource, boolean>>({
	github: true,
	sentry: true,
	grafana: true,
	kibana: false,
	deploy: false,
	manual: true,
})

const dedupWindowSec = ref(5)
const degradationScore = ref(75)
const severityOverride = ref<'auto' | SeverityLevel>('auto')

// --- Output tabs ---
const activeTab = ref<'timeline' | 'postmortem' | 'json'>('timeline')
const copied = ref(false)

// --- Derived state ---
const filteredEvents = computed<TimelineEvent[]>(() =>
	MOCK_EVENTS.filter((e) => sources.value[e.source])
)

const adjustedImpact = computed<ImpactResult>(() => ({
	...MOCK_IMPACT,
	degradationScore: degradationScore.value,
}))

const adjustedRCA = computed<RCAResult>(() => ({
	...MOCK_RCA,
	causalChain: MOCK_RCA.causalChain.filter((n) => sources.value[n.event.source]),
}))

const timelineResult = computed(() =>
	buildTimeline(filteredEvents.value, { dedupWindowMs: dedupWindowSec.value * 1000 })
)

const report = computed(() =>
	generatePostMortem('user-service API Breaking Change Causing 500 Errors', timelineResult.value, adjustedRCA.value, adjustedImpact.value)
)

const markdownOutput = computed(() => renderPostMortemMarkdown(report.value))

const jsonOutput = computed(() => JSON.stringify(report.value, null, 2))

const displayedSeverity = computed<SeverityLevel>(() => {
	if (severityOverride.value !== 'auto') return severityOverride.value
	return report.value.severity
})

function severityColor(sev: SeverityLevel): string {
	return sev === 'SEV1' ? '#e63946' : sev === 'SEV2' ? '#f4a261' : '#2a9d8f'
}

function copyMarkdown(): void {
	navigator.clipboard.writeText(markdownOutput.value).then(() => {
		copied.value = true
		setTimeout(() => { copied.value = false }, 2000)
	})
}

// --- Source labels ---
const sourceLabels: Record<DataSource, string> = {
	github: 'GitHub',
	sentry: 'Sentry',
	grafana: 'Grafana',
	kibana: 'Kibana',
	deploy: 'Deploy',
	manual: 'Manual',
}
</script>

<template>
	<div class="playground">
		<!-- Controls -->
		<div class="controls">
			<h3>Data Sources</h3>
			<div class="source-toggles">
				<label v-for="(label, key) in sourceLabels" :key="key" class="toggle-label">
					<input type="checkbox" v-model="sources[key as DataSource]" />
					<span>{{ label }}</span>
				</label>
			</div>

			<h3>Parameters</h3>
			<div class="param">
				<label>Dedup Window: <strong>{{ dedupWindowSec }}s</strong></label>
				<input type="range" min="1" max="30" step="1" v-model.number="dedupWindowSec" />
			</div>

			<div class="param">
				<label>Degradation Score: <strong>{{ degradationScore }}/100</strong></label>
				<input type="range" min="0" max="100" step="5" v-model.number="degradationScore" />
			</div>

			<div class="param">
				<label>
					Severity Override:
					<select v-model="severityOverride">
						<option value="auto">Auto (from score)</option>
						<option value="SEV1">SEV1</option>
						<option value="SEV2">SEV2</option>
						<option value="SEV3">SEV3</option>
					</select>
				</label>
			</div>

			<div class="summary">
				<span class="badge" :style="{ backgroundColor: severityColor(displayedSeverity) }">
					{{ displayedSeverity }}
				</span>
				<span>{{ timelineResult.totalCount }} events</span>
				<span>{{ timelineResult.turningPoints.length }} turning points</span>
			</div>
		</div>

		<!-- Output -->
		<div class="output">
			<div class="tabs">
				<button :class="{ active: activeTab === 'timeline' }" @click="activeTab = 'timeline'">
					Timeline
				</button>
				<button :class="{ active: activeTab === 'postmortem' }" @click="activeTab = 'postmortem'">
					Post-Mortem
				</button>
				<button :class="{ active: activeTab === 'json' }" @click="activeTab = 'json'">
					Raw JSON
				</button>
				<button v-if="activeTab === 'postmortem'" class="copy-btn" @click="copyMarkdown">
					{{ copied ? '✅ Copied!' : '📋 Copy' }}
				</button>
			</div>

			<!-- Timeline Tab -->
			<div v-if="activeTab === 'timeline'" class="tab-content">
				<table class="timeline-table">
					<thead>
						<tr>
							<th>Time (UTC)</th>
							<th>Event</th>
							<th>Source</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="event in timelineResult.events"
							:key="event.timestamp + event.title"
							:class="{ 'turning-point': timelineResult.turningPoints.includes(event) }"
						>
							<td class="time-cell">{{ formatTimestamp(event.timestamp) }}</td>
							<td>{{ eventTypeBadge(event.type) }} {{ event.title }}</td>
							<td>{{ sourceLabel(event.source) }}</td>
						</tr>
					</tbody>
				</table>

				<h4>Key Turning Points</h4>
				<ol>
					<li v-for="tp in timelineResult.turningPoints" :key="tp.timestamp">
						<strong>{{ formatTimestamp(tp.timestamp) }}</strong> — {{ tp.title }}
					</li>
				</ol>
			</div>

			<!-- Post-Mortem Tab -->
			<div v-if="activeTab === 'postmortem'" class="tab-content">
				<pre class="markdown-output">{{ markdownOutput }}</pre>
			</div>

			<!-- JSON Tab -->
			<div v-if="activeTab === 'json'" class="tab-content">
				<pre class="json-output">{{ jsonOutput }}</pre>
			</div>
		</div>
	</div>
</template>

<style scoped>
.playground {
	display: flex;
	gap: 24px;
	margin-top: 16px;
}

@media (max-width: 768px) {
	.playground {
		flex-direction: column;
	}
}

.controls {
	min-width: 260px;
	max-width: 320px;
	flex-shrink: 0;
}

.controls h3 {
	margin: 16px 0 8px;
	font-size: 14px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	opacity: 0.7;
}

.controls h3:first-child {
	margin-top: 0;
}

.source-toggles {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.toggle-label {
	display: flex;
	align-items: center;
	gap: 4px;
	cursor: pointer;
	font-size: 13px;
}

.toggle-label input[type='checkbox'] {
	accent-color: var(--vp-c-brand-1, #e63946);
}

.param {
	margin-bottom: 12px;
}

.param label {
	display: block;
	font-size: 13px;
	margin-bottom: 4px;
}

.param input[type='range'] {
	width: 100%;
	accent-color: var(--vp-c-brand-1, #e63946);
}

.param select {
	margin-left: 8px;
	padding: 2px 6px;
	border-radius: 4px;
	border: 1px solid var(--vp-c-divider, #e2e2e2);
	background: var(--vp-c-bg-soft, #f6f6f7);
}

.summary {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px;
	margin-top: 16px;
	font-size: 13px;
}

.badge {
	display: inline-block;
	padding: 2px 8px;
	border-radius: 4px;
	color: #fff;
	font-weight: 600;
	font-size: 12px;
}

.output {
	flex: 1;
	min-width: 0;
}

.tabs {
	display: flex;
	gap: 0;
	border-bottom: 2px solid var(--vp-c-divider, #e2e2e2);
	margin-bottom: 16px;
}

.tabs button {
	padding: 8px 16px;
	border: none;
	background: none;
	cursor: pointer;
	font-size: 13px;
	font-weight: 500;
	color: var(--vp-c-text-2, #666);
	border-bottom: 2px solid transparent;
	margin-bottom: -2px;
	transition: all 0.2s;
}

.tabs button.active {
	color: var(--vp-c-brand-1, #e63946);
	border-bottom-color: var(--vp-c-brand-1, #e63946);
}

.tabs button:hover {
	color: var(--vp-c-text-1, #333);
}

.copy-btn {
	margin-left: auto !important;
	font-size: 12px !important;
	padding: 4px 12px !important;
	border: 1px solid var(--vp-c-divider, #e2e2e2) !important;
	border-radius: 4px !important;
}

.tab-content {
	animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

.timeline-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 13px;
}

.timeline-table th,
.timeline-table td {
	padding: 6px 10px;
	text-align: left;
	border-bottom: 1px solid var(--vp-c-divider, #e2e2e2);
}

.timeline-table th {
	font-weight: 600;
	opacity: 0.7;
}

.time-cell {
	white-space: nowrap;
	font-family: monospace;
	font-size: 12px;
}

.turning-point {
	background: var(--vp-c-brand-soft, rgba(230, 57, 70, 0.08));
}

.markdown-output,
.json-output {
	background: var(--vp-c-bg-soft, #f6f6f7);
	border: 1px solid var(--vp-c-divider, #e2e2e2);
	border-radius: 8px;
	padding: 16px;
	overflow-x: auto;
	font-size: 12px;
	line-height: 1.6;
	white-space: pre-wrap;
	word-break: break-word;
}
</style>
