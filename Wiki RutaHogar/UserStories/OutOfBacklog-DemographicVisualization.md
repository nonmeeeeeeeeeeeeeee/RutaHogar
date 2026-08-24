# Out of Backlog — Demographic & Socioeconomic Visualization

> ⚠️ **Out of the updated backlog.** This story does not appear anywhere in the updated sprint plan ("HUs para Sprint 1" document — note that its ID `HU 28` now belongs to the Initial Purchase-Cost Estimator). Kept for reference; it was `HU 28` under the E4 plan. Re-prioritize explicitly if it is still wanted.

Lets an executive/admin analyze the age, income, and debt of prospects to adjust the real estate company's future marketing strategies. Exports are anonymized.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Optional |
| **Story Points** | 1 |
| **Actor** | Sales Executive / Real Estate Admin |
| **Status** | ⚠️ Out of updated backlog |
| **Sprint** | — |
| **Depends on** | [[OutOfBacklog-EventLogAnalytics\|Event-Log Analytics (out of backlog)]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive/real estate admin, **I want** to analyze the age, income, and debt of prospects, **in order to** adjust the real estate company's future marketing strategies.

---

## Acceptance Criteria

### E1 — Report visualization ordered by filters

**Given** an executive who wants to consult the report,  
**When** the prospect-log data is ordered,  
**Then** the distribution of leads must be visualized according to the indicated filter (debt, age, income, etc.).

---

### E2 — PDF report generation

**Given** I want to download the report generated from the logs,  
**When** I click the "Download report" button,  
**Then** a PDF report with the prospect-log data must be generated and downloaded.

---

### E3 — Anonymization of data in PDF reports

**Given** the data is exported,  
**When** I generate a report,  
**Then** the personal-identification fields are omitted (anonymization).

---

## Notes

- E3 anonymization enforces the RNF **Data privacy** attribute and the ethics commitment — see [[../AtributosDeCalidad\|Atributos de calidad]].
- Consumes the consent-gated event data from [[OutOfBacklog-EventLogAnalytics\|Event-Log Analytics (out of backlog)]].
