# Incident Post-Mortem: user-service API Breaking Change Causing 500 Errors

## Summary

- **Severity**: SEV2
- **Duration**: 35 minutes
- **Start Time**: 2026-06-20T10:05:00Z
- **End Time**: 2026-06-20T10:38:00Z
- **Impact**: ~5000 users affected, service degradation 75/100, partial data unavailability

## Timeline

| Time (UTC) | Event | Source |
|-----------|-------|--------|
| 2026-06-20 10:00 | 📝 alice: feat: update user-service API to v2 | GitHub |
| 2026-06-20 10:02 | 🚀 Deploy: production ✅ | GitHub |
| 2026-06-20 10:05 | 🔴 Error rate spike on /api/users (500 errors) | Sentry |
| 2026-06-20 10:08 | ⚠️ Alert: P95 latency > 2s on user-service | Grafana |
| 2026-06-20 10:15 | 🔴 Error rate reaches 15% (affected ~5000 users) | Sentry |
| 2026-06-20 10:25 | 💬 @oncall: identified breaking change in v2 API | Slack |
| 2026-06-20 10:30 | ⏪ Rollback: production to v2.4.0 | GitHub |
| 2026-06-20 10:35 | ✅ Error rate recovered to baseline | Sentry |

## Root Cause Analysis

### Causal Chain

1. **Trigger** 📝 10:00 alice: feat: update user-service API to v2
   → v2 API includes a Breaking Change, removing the legacy /api/users endpoint
2. **Propagation** 🔴 10:05 Error rate spike on /api/users (500 errors)
   → Downstream services calling the old endpoint received 404/500
3. **Aggravation** ⚠️ 10:08 P95 latency > 2s on user-service
   → Retry storm caused service overload
4. **Mitigation** ⏪ 10:30 Rollback: production to v2.4.0
   → Old endpoint restored after rollback
5. **Recovery** ✅ 10:35 Error rate recovered to baseline
   → Rollback confirmed effective

### Direct Cause

The v2 API removed the `/api/users` endpoint, and downstream consumer services were not updated in sync.

### Contributing Factors

- Missing consumer contract tests
- Deployment without canary release
- 3-minute alerting delay

### Root Cause

Lack of API contract validation and canary deployment mechanisms between microservices.

### Confidence: 🟢 High

Deployment time closely matches error onset (3-min delay), immediate recovery after rollback, causal chain complete.

### Alternative Hypotheses

- Could another service have deployed an incompatible change at the same time? (Cannot fully rule out, but probability is low)
- Could a DNS switchover have caused brief routing anomalies? (Unlikely, since recovery occurred after rollback)

## Impact

- **Affected Users**: ~5000
- **Service Degradation**: 75/100
- **Affected Features**: user profile queries, user listings
- **Data Impact**: partial (user data could not be written during some requests)

## Fixes

### Mitigations

- Rolled back production to v2.4.0

### Root Fix

- Lack of API contract validation and canary deployment mechanisms between microservices

## Prevention

### Short-term Prevention

- Missing consumer contract tests
- Deployment without canary release

### Long-term Improvement

- Lack of API contract validation and canary deployment mechanisms between microservices

## Action Items

| Action | Owner | Deadline | Priority |
|--------|-------|----------|----------|
| Add consumer contract tests | [TBD] | [TBD] | P1 |
| Implement canary deployment | [TBD] | [TBD] | P1 |
| Add API contract validation and canary deployment mechanisms between microservices | [TBD] | [TBD] | P0 |
