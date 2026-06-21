import { describe, expect, it } from 'vitest'
import { getDefaultConfig, mergeConfig } from './config'

describe('getDefaultConfig', () => {
	it('returns a deep clone of defaults', () => {
		const a = getDefaultConfig()
		const b = getDefaultConfig()
		expect(a).toEqual(b)
		expect(a).not.toBe(b)
		expect(a.collectors).not.toBe(b.collectors)
	})

	it('has github enabled by default', () => {
		const config = getDefaultConfig()
		expect(config.collectors.github.enabled).toBe(true)
	})

	it('has other collectors disabled by default', () => {
		const config = getDefaultConfig()
		expect(config.collectors.sentry.enabled).toBe(false)
		expect(config.collectors.grafana.enabled).toBe(false)
	})
})

describe('mergeConfig', () => {
	it('deep merges per-collector config', () => {
		const merged = mergeConfig({
			collectors: { ...getDefaultConfig().collectors,
				sentry: { token: 'abc', enabled: true },
			},
		})
		expect(merged.collectors.sentry.token).toBe('abc')
		expect(merged.collectors.sentry.enabled).toBe(true)
		// github defaults preserved
		expect(merged.collectors.github.enabled).toBe(true)
	})

	it('preserves defaults when no user config', () => {
		const merged = mergeConfig({})
		expect(merged).toEqual(getDefaultConfig())
	})

	it('allows overriding top-level fields', () => {
		const merged = mergeConfig({ defaultTimeWindowMinutes: 120 })
		expect(merged.defaultTimeWindowMinutes).toBe(120)
		expect(merged.maxParallelCollectors).toBe(6)
	})
})
