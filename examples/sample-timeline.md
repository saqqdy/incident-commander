# Sample: Incident Timeline

> Below is a sample production incident timeline demonstrating Incident Commander's output format.

## Incident Timeline

| Time (UTC) | Event | Source |
|-----------|-------|--------|
| 2026-06-20 10:00 | 📝 alice: feat: update user-service API to v2 | GitHub |
| 2026-06-20 10:02 | 🚀 Deploy: production ✅ | GitHub |
| 2026-06-20 10:05 | 🔴 Error rate spike on /api/users (500 errors) | Sentry |
| 2026-06-20 10:08 | ⚠️ Alert: P95 latency > 2s on user-service | Grafana |
| 2026-06-20 10:15 | 🔴 Error rate reaches 15% (affected ~5000 users) | Sentry |
| 2026-06-20 10:20 | 💬 @oncall: investigating user-service 500s | Slack |
| 2026-06-20 10:25 | 💬 @oncall: identified breaking change in v2 API | Slack |
| 2026-06-20 10:30 | ⏪ Rollback: production to v2.4.0 | GitHub |
| 2026-06-20 10:35 | ✅ Error rate recovered to baseline | Sentry |
| 2026-06-20 10:38 | ✅ P95 latency recovered to < 200ms | Grafana |

## Statistics

| Event Type | Count |
|-----------|-------|
| deploy | 2 |
| error | 2 |
| alert | 1 |
| code_change | 1 |
| communication | 2 |
| rollback | 1 |
| recovery | 2 |

## Key Turning Points

1. 🔴 **10:05** — First error rate spike
2. ⚠️ **10:08** — First alert triggered
3. ⏪ **10:30** — Rollback executed
4. ✅ **10:35** — Error rate recovered
