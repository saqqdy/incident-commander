# Post-Mortem Generation Instructions

## Goal

Generate a well-structured Post-Mortem document based on the timeline and RCA results.

## Generation Steps

### 1. Fill in metadata

Extract from context or ask:
- Incident title (concise)
- Severity level (judge from impact scope: SEV1=full outage, SEV2=core feature impaired, SEV3=non-core feature impaired)
- Start/end time
- Duration

### 2. Generate impact assessment

Based on error data and metrics:
- Affected user count (use Sentry data if available, otherwise estimate)
- Affected features list
- Data impact assessment
- Severity score (0-100)

### 3. Organize timeline

Use the already-built timeline, formatted as a Markdown table.

### 4. Organize RCA

Use the already-completed RCA analysis, filling into the template.

### 5. Generate action items

Derive from RCA root cause and contributing factors:
- **Short-term prevention**: Direct preventive measures for this incident
- **Long-term improvement**: Systemic improvements targeting the root cause
- **Action items**: Assign an Owner and Deadline to each measure

### 6. Lessons learned

Reflect on what went well and what didn't during this incident response:
- What went well (fast detection, quick rollback, etc.)
- What went wrong (alerting delays, missing runbooks, etc.)
- Where we got lucky (someone happened to be on call, rollback script existed, etc.)

## Output Template

Use the `templates/postmortem.md` template, filling in to produce a complete Markdown document.

Suggested document naming: `postmortem-{date}-{title-slug}.md`

## Important Notes

- All conclusions must cite data sources
- Mark uncertain information as `[TBD]` rather than guessing
- Action items must be actionable and verifiable
- Maintain an objective tone, avoid blaming individuals
