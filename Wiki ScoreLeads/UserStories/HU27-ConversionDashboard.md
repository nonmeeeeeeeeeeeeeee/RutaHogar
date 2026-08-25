# HU 27 — Sales Conversion-Rate Dashboard

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning.

A general sales-funnel dashboard so an admin/executive can measure whether the sales cycle is shrinking toward the 6-month target.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Real Estate Admin / Sales Executive |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | [[HU23-EventLogAnalytics\|HU 23]] |
| **Required by** | — |

---

## User Story

> **As** a real estate admin/sales executive, **I want** to visualize the general sales funnel, **in order to** measure whether the sales cycle is being reduced to 6 months.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU23-EventLogAnalytics\|HU 23]]** — This story's note: *"Builds on the event-log data from HU 23."* E2's average time from pre-assessment to closed deal needs timestamped events that only HU 23 records.  `documented`

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

- Builds on the event-log data from [[HU23-EventLogAnalytics\|HU 23]] and the lead status model.
- Directly measures the business goal (reducing the sales cycle) described in the project's value proposition.
