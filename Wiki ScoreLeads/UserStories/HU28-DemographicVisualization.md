# HU 28 — Demographic & Socioeconomic Visualization

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning.

Lets an executive/admin analyze the age, income, and debt of prospects to adjust the real estate company's future marketing strategies. Exports are anonymized.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Optional |
| **Story Points** | 1 |
| **Actor** | Sales Executive / Real Estate Admin |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | [[HU23-EventLogAnalytics\|HU 23]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive/real estate admin, **I want** to analyze the age, income, and debt of prospects, **in order to** adjust the real estate company's future marketing strategies.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU23-EventLogAnalytics\|HU 23]]** — This story's note: *"Consumes the consent-gated event data from HU 23."* E1 orders "the prospect-log data" by the selected filter.  `documented`

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
- Consumes the consent-gated event data from [[HU23-EventLogAnalytics\|HU 23]].
