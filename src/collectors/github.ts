/**
 * GitHub data collector
 *
 * Collects commits / PRs / workflow runs within a specified time window via gh CLI
 */

import type { CollectionResult, Collector, DataSource, EventType, TimelineEvent } from '../types'
import { execFile } from 'node:child_process'

import { promisify } from 'node:util'
import { toISO } from '../utils/format'

const execFileAsync = promisify(execFile)

const GH_CLI_TIMEOUT = 30_000

/** gh API commit response structure */
interface GitHubCommit {
	sha: string
	commit: {
		message: string
		author: { name: string; date: string }
	}
}

/** gh API PR search response structure */
interface GitHubPRSearchResult {
	items: GitHubPR[]
	total_count: number
}

interface GitHubPR {
	number: number
	title: string
	user: { login: string } | null
	merged_at: string | null
	created_at: string
	html_url: string
	state: string
}

/** gh API workflow run response structure */
interface GitHubWorkflowRunsResult {
	workflow_runs: GitHubWorkflowRun[]
	total_count: number
}

interface GitHubWorkflowRun {
	name: string
	status: string
	conclusion: string | null
	created_at: string
	updated_at: string
	id: number
}

/** GitHub collector options */
export interface GitHubCollectorOptions {
	/** Repository owner */
	owner: string
	/** Repository name */
	repo: string
}

/** Safely convert an unknown rejection reason to string */
function reasonToString(reason: unknown): string {
	if (reason instanceof Error) return reason.message
	if (typeof reason === 'string') return reason
	try {
		return String(reason)
	} catch {
		return 'Unknown error'
	}
}

export class GitHubCollector implements Collector {
	readonly source: DataSource = 'github'

	private owner: string
	private repo: string

	constructor(options: GitHubCollectorOptions) {
		this.owner = options.owner
		this.repo = options.repo
	}

	async collect(timeRange: { start: string; end: string }): Promise<CollectionResult> {
		const startTime = performance.now()
		const events: TimelineEvent[] = []
		const errors: string[] = []

		try {
			const [commits, prs, runs] = await Promise.allSettled([
				this.fetchCommits(timeRange),
				this.fetchPRs(timeRange),
				this.fetchWorkflowRuns(timeRange),
			])

			if (commits.status === 'fulfilled') {
				events.push(...commits.value)
			} else {
				errors.push(`Commits: ${reasonToString(commits.reason)}`)
			}

			if (prs.status === 'fulfilled') {
				events.push(...prs.value)
			} else {
				errors.push(`PRs: ${reasonToString(prs.reason)}`)
			}

			if (runs.status === 'fulfilled') {
				events.push(...runs.value)
			} else {
				errors.push(`Workflow Runs: ${reasonToString(runs.reason)}`)
			}
		} catch (error) {
			errors.push(`Unexpected: ${error instanceof Error ? error.message : String(error)}`)
		}

		return {
			source: this.source,
			success: errors.length === 0,
			events,
			duration: Math.round(performance.now() - startTime),
			error: errors.length > 0 ? errors.join('; ') : undefined,
		}
	}

	private async fetchCommits(timeRange: {
		start: string
		end: string
	}): Promise<TimelineEvent[]> {
		const endpoint = `repos/${this.owner}/${this.repo}/commits?since=${timeRange.start}&until=${timeRange.end}&per_page=100`
		const data = await this.ghApi<GitHubCommit[]>(endpoint)

		return data.map(c => this.commitToEvent(c))
	}

	private async fetchPRs(timeRange: { start: string; end: string }): Promise<TimelineEvent[]> {
		const query = `repo:${this.owner}/${this.repo} is:pr created:${timeRange.start}..${timeRange.end}`
		const endpoint = `search/issues?q=${encodeURIComponent(query)}&per_page=100`
		const data = await this.ghApi<GitHubPRSearchResult>(endpoint)

		return data.items.map(pr => this.prToEvent(pr))
	}

	private async fetchWorkflowRuns(timeRange: {
		start: string
		end: string
	}): Promise<TimelineEvent[]> {
		const endpoint = `repos/${this.owner}/${this.repo}/actions/runs?created=${timeRange.start}..${timeRange.end}&per_page=100`
		const data = await this.ghApi<GitHubWorkflowRunsResult>(endpoint)

		return data.workflow_runs.map(run => this.runToEvent(run))
	}

	private async ghApi<T>(endpoint: string): Promise<T> {
		try {
			const { stdout } = await execFileAsync('gh', ['api', endpoint], {
				timeout: GH_CLI_TIMEOUT,
			})
			return JSON.parse(stdout) as T
		} catch (err) {
			if (
				err instanceof Error &&
				'code' in err &&
				(err as Error & { code?: string }).code === 'ENOENT'
			) {
				throw new Error(
					'gh CLI not found. Install it from https://cli.github.com and run `gh auth login`'
				)
			}
			throw err
		}
	}

	private commitToEvent(c: GitHubCommit): TimelineEvent {
		const firstLine = c.commit.message.split('\n')[0] ?? ''
		return {
			type: 'code_change',
			timestamp: toISO(c.commit.author.date),
			title: `${c.commit.author.name}: ${firstLine}`,
			description: c.commit.message,
			source: 'github',
			raw: c,
		}
	}

	private prToEvent(pr: GitHubPR): TimelineEvent {
		const author = pr.user?.login ?? 'unknown'
		return {
			type: 'code_change',
			timestamp: toISO(pr.merged_at ?? pr.created_at),
			title: `PR #${pr.number}: ${pr.title}`,
			description: `Author: ${author} | State: ${pr.state} | ${pr.html_url}`,
			source: 'github',
			raw: pr,
		}
	}

	private runToEvent(run: GitHubWorkflowRun): TimelineEvent {
		const statusSuffix =
			run.conclusion === 'success'
				? ' ✅'
				: run.conclusion === 'failure'
					? ' ❌'
					: run.status === 'in_progress'
						? ' 🔄'
						: ` (${run.conclusion ?? run.status})`

		const type: EventType = run.conclusion === 'failure' ? 'error' : 'deploy'

		return {
			type,
			timestamp: toISO(run.created_at),
			title: `Deploy: ${run.name}${statusSuffix}`,
			description: `Status: ${run.status} | Conclusion: ${run.conclusion ?? 'N/A'} | ID: ${run.id}`,
			source: 'github',
			raw: run,
		}
	}
}
