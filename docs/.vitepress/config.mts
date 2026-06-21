import { defineConfig } from 'vitepress'

export default defineConfig({
	base: '/incident-commander/',
	cleanUrls: true,
	head: [
		['link', { href: '/incident-commander/logo.svg', rel: 'icon' }],
		['meta', { name: 'theme-color', content: '#e63946' }],
	],
	lastUpdated: true,
	title: 'Incident Commander',
	titleTemplate: ':title - Incident Commander',

	locales: {
		root: {
			description: 'AI-powered incident analysis for SRE / On-call engineers — auto-collect, reason, and generate Post-Mortems',
			label: 'English',
			lang: 'en',
			themeConfig: {
				darkModeSwitchLabel: 'Theme',
				darkModeSwitchTitle: 'Switch to dark theme',
				docFooter: { next: 'Next', prev: 'Previous' },
				editLink: {
					pattern: 'https://github.com/saqqdy/incident-commander/edit/main/docs/:path',
					text: 'Edit this page on GitHub',
				},
				footer: {
					copyright: 'Copyright © 2024-present saqqdy',
					message: 'Released under the MIT License.',
				},
				langMenuLabel: 'Language',
				lastUpdated: {
					formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
					text: 'Last updated',
				},
				lightModeSwitchTitle: 'Switch to light theme',
				nav: [
					{ activeMatch: '/guide/', link: '/guide/', text: 'Guide' },
					{ activeMatch: '/api/', link: '/api/', text: 'API' },
					{ activeMatch: '/advanced/', link: '/advanced/', text: 'Advanced' },
					{ link: '/playground', text: 'Playground' },
					{
						items: [
							{ link: 'https://github.com/saqqdy/incident-commander', text: 'GitHub' },
							{ link: 'https://www.npmjs.com/package/incident-commander', text: 'NPM' },
						],
						text: 'Links',
					},
				],
				outline: { label: 'On this page' },
				returnToTopLabel: 'Return to top',
				sidebar: {
					'/guide/': [
						{
							items: [
								{ link: '/guide/', text: 'Introduction' },
								{ link: '/guide/installation', text: 'Installation' },
								{ link: '/guide/quick-start', text: 'Quick Start' },
							],
							text: 'Getting Started',
						},
						{
							items: [
								{ link: '/guide/collect', text: 'Data Collection' },
								{ link: '/guide/timeline', text: 'Timeline Building' },
								{ link: '/guide/rca', text: 'Root Cause Analysis' },
								{ link: '/guide/postmortem', text: 'Post-Mortem Generation' },
								{ link: '/guide/brief', text: 'Incident Brief' },
							],
							text: 'Workflow',
						},
						{
							items: [
								{ link: '/guide/comparison', text: 'Comparisons' },
								{ link: '/guide/roadmap', text: 'Version Roadmap' },
							],
							text: 'More',
						},
					],
					'/api/': [
						{
							items: [{ link: '/api/', text: 'Overview' }],
							text: 'API Reference',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/collectors/github', text: 'GitHubCollector' },
							],
							text: 'Collectors',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/analyzers/timeline', text: 'buildTimeline()' },
							],
							text: 'Analyzers',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/reporters/postmortem', text: 'generatePostMortem()' },
								{ link: '/api/reporters/render-markdown', text: 'renderPostMortemMarkdown()' },
							],
							text: 'Reporters',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/types/timeline-event', text: 'TimelineEvent' },
								{ link: '/api/types/collection-result', text: 'CollectionResult' },
								{ link: '/api/types/timeline-result', text: 'TimelineResult' },
								{ link: '/api/types/rca-result', text: 'RCAResult' },
								{ link: '/api/types/postmortem-report', text: 'PostMortemReport' },
								{ link: '/api/types/impact-result', text: 'ImpactResult' },
								{ link: '/api/types/config', text: 'IncidentConfig' },
							],
							text: 'Types',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/utils/format', text: 'Format Utils' },
								{ link: '/api/utils/config', text: 'Config Utils' },
							],
							text: 'Utilities',
						},
					],
					'/advanced/': [
						{
							items: [
								{ link: '/advanced/mcp-config', text: 'MCP Configuration' },
								{ link: '/advanced/degradation', text: 'Graceful Degradation' },
								{ link: '/advanced/custom-collector', text: 'Custom Collectors' },
							],
							text: 'Advanced',
						},
					],
				},
				sidebarMenuLabel: 'Menu',
			},
			title: 'Incident Commander',
		},
		zh: {
			description: '面向 SRE / On-call 工程师的 AI 驱动故障分析工具 — 自动采集、推理分析、生成 Post-Mortem',
			label: '简体中文',
			lang: 'zh-CN',
			link: '/zh/',
			themeConfig: {
				darkModeSwitchLabel: '主题',
				darkModeSwitchTitle: '切换到深色模式',
				docFooter: { next: '下一页', prev: '上一页' },
				editLink: {
					pattern: 'https://github.com/saqqdy/incident-commander/edit/main/docs/:path',
					text: '在 GitHub 上编辑此页',
				},
				footer: {
					copyright: '版权所有 © 2024-present saqqdy',
					message: '基于 MIT 许可发布',
				},
				langMenuLabel: '语言',
				lastUpdated: {
					formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
					text: '最后更新于',
				},
				lightModeSwitchTitle: '切换到浅色模式',
				nav: [
					{ activeMatch: '/zh/guide/', link: '/zh/guide/', text: '指南' },
					{ activeMatch: '/zh/api/', link: '/zh/api/', text: 'API' },
					{ activeMatch: '/zh/advanced/', link: '/zh/advanced/', text: '进阶' },
					{ link: '/zh/playground', text: '体验场' },
					{
						items: [
							{ link: 'https://github.com/saqqdy/incident-commander', text: 'GitHub' },
							{ link: 'https://www.npmjs.com/package/incident-commander', text: 'NPM' },
						],
						text: '链接',
					},
				],
				outline: { label: '页面导航' },
				returnToTopLabel: '回到顶部',
				sidebar: {
					'/zh/guide/': [
						{
							items: [
								{ link: '/zh/guide/', text: '介绍' },
								{ link: '/zh/guide/installation', text: '安装' },
								{ link: '/zh/guide/quick-start', text: '快速上手' },
							],
							text: '开始',
						},
						{
							items: [
								{ link: '/zh/guide/collect', text: '数据采集' },
								{ link: '/zh/guide/timeline', text: '时间线构建' },
								{ link: '/zh/guide/rca', text: '根因分析' },
								{ link: '/zh/guide/postmortem', text: 'Post-Mortem 生成' },
								{ link: '/zh/guide/brief', text: '事故简报' },
							],
							text: '工作流',
						},
						{
							items: [
								{ link: '/zh/guide/comparison', text: '方案对比' },
								{ link: '/zh/guide/roadmap', text: '版本路线图' },
							],
							text: '更多',
						},
					],
					'/zh/api/': [
						{
							items: [{ link: '/zh/api/', text: '概览' }],
							text: 'API 参考',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/collectors/github', text: 'GitHubCollector' },
							],
							text: '采集器',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/analyzers/timeline', text: 'buildTimeline()' },
							],
							text: '分析器',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/reporters/postmortem', text: 'generatePostMortem()' },
								{ link: '/zh/api/reporters/render-markdown', text: 'renderPostMortemMarkdown()' },
							],
							text: '报告器',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/types/timeline-event', text: 'TimelineEvent' },
								{ link: '/zh/api/types/collection-result', text: 'CollectionResult' },
								{ link: '/zh/api/types/timeline-result', text: 'TimelineResult' },
								{ link: '/zh/api/types/rca-result', text: 'RCAResult' },
								{ link: '/zh/api/types/postmortem-report', text: 'PostMortemReport' },
								{ link: '/zh/api/types/impact-result', text: 'ImpactResult' },
								{ link: '/zh/api/types/config', text: 'IncidentConfig' },
							],
							text: '类型',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/utils/format', text: '格式化工具' },
								{ link: '/zh/api/utils/config', text: '配置工具' },
							],
							text: '工具函数',
						},
					],
					'/zh/advanced/': [
						{
							items: [
								{ link: '/zh/advanced/mcp-config', text: 'MCP 配置' },
								{ link: '/zh/advanced/degradation', text: '优雅降级' },
								{ link: '/zh/advanced/custom-collector', text: '自定义采集器' },
							],
							text: '进阶',
						},
					],
				},
				sidebarMenuLabel: '菜单',
			},
			title: 'Incident Commander',
		},
	},

	themeConfig: {
		logo: '/logo.svg',
		search: {
			provider: 'local',
			options: {
				locales: {
					zh: {
						translations: {
							button: {
								buttonText: '搜索',
								buttonAriaLabel: '搜索',
							},
							modal: {
								noResultsText: '无法找到相关结果',
								resetButtonTitle: '清除查询条件',
								footer: {
									selectText: '选择',
									navigateText: '切换',
									closeText: '关闭',
								},
							},
						},
					},
				},
			},
		},
		siteTitle: 'Incident Commander',
		socialLinks: [{ icon: 'github', link: 'https://github.com/saqqdy/incident-commander' }],
		externalLinkIcon: true,
	},
})
