# Comparisons

How does Incident Commander compare to existing tools and processes?

## vs PagerDuty / Opsgenie

| Dimension | PagerDuty / Opsgenie | Incident Commander |
|-----------|---------------------|-------------------|
| Incident detection | ✅ Alert aggregation + on-call scheduling | ❌ Not an alerting tool (focuses on analysis) |
| Timeline building | ⚠️ Aggregates alerts only, no code changes | ✅ Fuses commits, deploys, errors, metrics, logs |
| Root cause analysis | ❌ No reasoning — relies on humans | ✅ AI cross-references causal chains + confidence labels |
| Post-Mortem | ⚠️ Provides blank templates | ✅ Auto-generates populated reports — review and ship |
| Deployment | SaaS, paid | Local, open-source, free |
| **Positioning** | Alert intake + on-call orchestration | Incident analysis + retrospective documentation |

> Incident Commander complements rather than replaces PagerDuty — PagerDuty detects the problem, Incident Commander analyzes it and generates the retrospective.

## vs Datadog Incident Management

| Dimension | Datadog IM | Incident Commander |
|-----------|-----------|-------------------|
| Data sources | ✅ Deep Datadog ecosystem binding | ✅ Open integration: GitHub / Sentry / Grafana / Kibana |
| AI analysis | ⚠️ Limited anomaly detection | ✅ Deep causal reasoning + alternative hypotheses |
| Cross-platform correlation | ❌ Datadog-only data | ✅ Cross-platform cross-validation |
| Cost | Enterprise pricing | Open-source, free |
| **Positioning** | Incident management within Datadog | Incident analysis for any tech stack |

## vs Manual Retrospective Process

| Dimension | Manual Process | Incident Commander |
|-----------|---------------|-------------------|
| Timeline construction | 30–60 min, switching between tools | 10 seconds, auto-generated |
| RCA depth | Depends on individual experience | Systematic AI reasoning + auto-suggested alternatives |
| Post-Mortem writing | 1–2 hours from scratch | 10 minutes to review and edit |
| Knowledge preservation | Scattered across people and systems | Structured, searchable, reusable archives |
| Consistency | Varies by author | Standardized templates + uniform output format |

## Key Differentiators

1. **AI Semantic Reasoning vs Rule Matching** — Only AI can understand "this code's behavior changed" across endlessly varied logs and errors
2. **Open Ecosystem vs Vendor Lock-in** — Mix GitHub + Sentry + Grafana + Kibana freely — no single platform lock-in
3. **Claude Code Native vs Standalone Tool** — Use directly in your development workflow — no context switching
