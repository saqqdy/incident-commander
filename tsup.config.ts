import { defineConfig } from 'tsup'

export default defineConfig([
	{
		entry: ['src/index.ts'],
		format: ['esm', 'cjs'],
		dts: true,
		clean: true,
		sourcemap: false,
		target: 'node18',
	},
	{
		entry: ['src/cli.ts'],
		format: ['esm'],
		shebang: '#!/usr/bin/env node',
		target: 'node18',
	},
])
