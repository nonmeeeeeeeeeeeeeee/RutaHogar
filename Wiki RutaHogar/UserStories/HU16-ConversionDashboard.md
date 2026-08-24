# HU 16 — Sales Conversion-Rate Dashboard

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

A general sales-funnel dashboard so an admin/executive can measure whether the sales cycle is shrinking toward the 6-month target.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Real Estate Admin / Sales Executive |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[OutOfBacklog-EventLogAnalytics\|Event-Log Analytics (out of backlog)]] |
| **Required by** | — |

---

## User Story

> **As** a real estate admin/sales executive, **I want** to visualize the general sales funnel, **in order to** measure whether the sales cycle is being reduced to 6 months.

---

## Acceptance Criteria

### E1 — Measure improvement-plan impact

**Given** I entered the managerial dashboard,  
**When** I review the funnel chart,  
**Then** I see how many leads moved from "In progress / In improvement plan" to "Deal Closed".

---

### E2 — Measure average time from pre-assessment to conversion

**Given** I want to see the tool's impact,  
**When** I review the time KPI,  
**Then** I visualize the average number of days from pre-assessment to "Deal Closed".

---

### E3 — Charts over time

**Given** I want to measure how sales metrics have evolved over time (week over week, month over month, year over year),  
**When** I enter the historical evaluations tab,  
**Then** different charts must be displayed according to the selected timeframe, showing how sales have changed since the app started being used.

---

## Notes

- Builds on the event-log data from [[OutOfBacklog-EventLogAnalytics\|Event-Log Analytics (out of backlog)]] and the lead status model.
- Directly measures the business goal (reducing the sales cycle) described in the project's value proposition.
- **Numbering note:** this story was `HU 27` under the E4 plan; the updated sprint plan renumbers it to `HU 16` and moves it from Sprint 3 to Sprint 2. Its historical data source ([[OutOfBacklog-EventLogAnalytics\|Event-Log Analytics]]) is no longer part of the functional backlog, so Sprint 2 planning must confirm an alternative data source.
