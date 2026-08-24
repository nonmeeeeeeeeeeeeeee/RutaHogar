# Out of Backlog — Commercial Report & Metrics

> ⚠️ **Out of the updated backlog.** This story does not appear anywhere in the updated sprint plan ("HUs para Sprint 1" document). Kept for reference; it was `HU 22` under the E4 plan. Re-prioritize explicitly if it is still wanted.

Lets a sales executive download reports on evaluated leads, classifications, and pre-qualification rates to analyze the commercial performance of a real estate campaign.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Optional |
| **Story Points** | 3 |
| **Actor** | Sales Executive |
| **Status** | ⚠️ Out of updated backlog |
| **Sprint** | — |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive, **I want** to download reports on evaluated leads, classifications, and pre-qualification rates, **in order to** analyze the commercial performance of the real estate campaign.

---

## Acceptance Criteria

### E1 — Lead-volume report

**Given** an authorized user accesses the reports module,  
**When** they select a period,  
**Then** the system must show the volume of evaluated leads.

---

### E2 — Classifications and pre-qualification

**Given** registered evaluations exist,  
**When** the report is generated,  
**Then** it must include obtained classifications and pre-qualification rates.

---

### E3 — Authorized download

**Given** the report is available,  
**When** an authorized manager or executive downloads it,  
**Then** the system must allow exporting it in Excel or PDF format.

---

## Notes

- Overlaps with the analytics in [[OutOfBacklog-EventLogAnalytics\|Event-Log Analytics (out of backlog)]] and the conversion dashboard [[HU16-ConversionDashboard\|HU 16]]; this story is the exportable, period-scoped commercial report.
