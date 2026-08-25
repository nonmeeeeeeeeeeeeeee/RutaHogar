# HU 23 — Event-Log Metrics Visualization and Analysis

> 🔜 **Sprint 1.** Lets a real estate admin visualize the application's event logs (sign-in clicks, account creation, pre-assessments, user age, etc.) and derive metrics, charts, and preliminary analysis — while respecting consent.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 8 |
| **Actor** | Real Estate Admin |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | [[HU1-FinancialDataEntry\|HU 1]], [[HU3-HybridScoring\|HU 3]], [[HU6-PrivacyPanel\|HU 6]] |
| **Required by** | [[HU27-ConversionDashboard\|HU 27]], [[HU28-DemographicVisualization\|HU 28]] |

---

## User Story

> **As** a real estate admin, **I want** to visualize the application's event logs (sign-in clicks, account creation, pre-assessments, the age of users who fill in the forms, etc.), **in order to** obtain metrics about users and thus perform data analysis and improve decision-making.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU1-FinancialDataEntry\|HU 1]]** — E3 excludes users who have not accepted consent. This story's note: consent-gating is *"consistent with HU 1 E3"*, where the consent flag originates.  `documented · B10`

- **[[HU3-HybridScoring\|HU 3]]** — E1 and E2 log and chart pre-assessment events, which are produced by the scoring flow HU 3 defines.  `documented`

- **[[HU6-PrivacyPanel\|HU 6]]** — HU 6's note: *"Consent state set here gates event logging in HU 23 E3."* HU 1 supplies the initial flag; HU 6 lets the user change it, and the logging layer must honour the change.  `inferred · S5`

---

## Acceptance Criteria

### E1 — Data table visualization

**Given** a commercial executive who wants to review the event logs,  
**When** they enter the log view,  
**Then** they must be able to visualize the different logs.

---

### E2 — Chart generation and data analysis for decision-making

**Given** a commercial executive who wants to analyze data based on the tables,  
**When** they ask the page to generate charts about a data point or to compute a statistic (mean, median, mode, etc.),  
**Then** the requested charts and results must be shown.

---

### E3 — Personal data protection

**Given** a user has not accepted the data consent,  
**When** they perform the pre-assessment or click through the page,  
**Then** their events must not appear in the log.

---

### E4 — Data explainability for decision-making

**Given** a real estate admin,  
**When** they ask the page to generate metrics from the data collected by the log,  
**Then** the page must generate a preliminary explanation/analysis of the data to ease its comprehension.

---

## Notes

- E3 makes consent-gating a hard requirement of the logging layer — non-consented traffic is logged only as anonymous, consistent with [[HU1-FinancialDataEntry\|HU 1]] E3.
- This feeds the demographic/socioeconomic reporting in [[HU28-DemographicVisualization\|HU 28]] and the conversion dashboard [[HU27-ConversionDashboard\|HU 27]].
- Supports the RNF **Traceability** attribute — see [[AtributosDeCalidad\|Atributos de calidad]].
