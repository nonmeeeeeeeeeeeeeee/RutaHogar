# HU 17 — Report Fraudulent Users/Leads

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Lets executives flag and remove fraudulent or inconsistent leads from the commercial dashboard, with full state tracking and audit — without irreversibly deleting their data.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Sales Executive / Real Estate Admin |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU2-LeadPrioritization\|HU 2]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive, **I want** to remove fraudulent users from my executives' dashboard, **in order to** avoid possible fraud and loss of time and money for the sales executives.

---

## Acceptance Criteria

### E1 — Detection of inconsistency indicators

**Given** a lead completes a financial pre-assessment,  
**When** the system detects contradictory, incomplete, or unreliable information,  
**Then** it must mark the lead with a possible-inconsistency alert.

---

### E2 — Alert visualization in the dashboard

**Given** a lead is marked with possible inconsistency or fraud,  
**When** the executive or admin views the dashboard,  
**Then** the system must show a visible label or warning on the lead's card.

---

### E3 — Manual report of suspicious lead

**Given** an executive reviews a lead,  
**When** they detect suspicious, inconsistent, or possibly fraudulent information,  
**Then** they must be able to report it indicating a reason.

---

### E4 — State change of the reported lead

**Given** a lead has been reported,  
**When** the real estate admin reviews the case,  
**Then** they must be able to change its status to "Under review", "Discarded for inconsistency", "Confirmed fraud", or "Reactivated".

---

### E5 — Commercial dashboard cleanup

**Given** a lead was discarded for inconsistency or confirmed fraud,  
**When** executives view their lead portfolio,  
**Then** the system must hide or remove that lead from the main view of commercial opportunities.

---

### E6 — Report-status notification

**Given** a report changes state,  
**When** the system updates the lead's review,  
**Then** it must notify or show the new status to the reporting user and the corresponding admin.

---

### E7 — Report audit record

**Given** a lead is reported, discarded, reactivated, or has its status modified,  
**When** the action occurs,  
**Then** the system must store date, responsible, reason, and previous/subsequent status to maintain traceability.

---

### E8 — Prevention of irreversible deletion

**Given** a lead is reported as fraudulent or inconsistent,  
**When** it is cleaned from the dashboard,  
**Then** the system must not automatically delete its information permanently, but keep it recorded for review, audit, or possible reactivation.

---

## Notes

- E7 aligns with the auditing story [[NFR-EvaluationAudit\|Evaluation Audit (NFR)]]; E8 aligns with the immutability principle of [[NFR-ImmutableEvaluationHistory\|Immutable Evaluation History (NFR)]].
- Quick "report inconsistency" action is exposed on mobile — see [[NFR-MobileExecutiveDashboard\|Mobile Executive Dashboard (NFR)]] E4.
- **Numbering note:** this story was `HU 24` under the E4 plan; the updated sprint plan renumbers it to `HU 17` and moves it from Sprint 3 to Sprint 2.
