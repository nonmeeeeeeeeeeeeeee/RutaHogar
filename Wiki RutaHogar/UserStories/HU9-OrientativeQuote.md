# HU 9 — Orientative Quote per Project

> 🔜 **Sprint 1.** Lets a lead select a real estate project from the catalog and check whether it is compatible with their financial situation — knowing whether they can move forward, are close, or should adjust their objective.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Essential |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU7-ProjectCatalog\|HU 7]] |
| **Required by** | [[HU10-LeadProjectMatching\|HU 10]] |

---

## User Story

> **As** a lead, **I want** to select a real estate project and review whether it is compatible with my financial situation, **in order to** know whether I can move forward, whether I am close, or whether I should adjust my objective.

---

## Acceptance Criteria

### E1 — Financial compatibility per project

**Given** the user selects a project from the catalog,  
**When** they evaluate it,  
**Then** the system must show its financial compatibility.

---

### E2 — Main gap indicated

**Given** the project is not compatible,  
**When** the result is shown,  
**Then** it must indicate the main gap: income, down payment, debt, or term.

---

### E3 — Minimum suggested adjustment

**Given** the project is close to being compatible,  
**When** the result is shown,  
**Then** it must indicate the minimum adjustment suggested to get closer.

---

### E4 — Save interest or request contact

**Given** the project is compatible,  
**When** the user reviews the result,  
**Then** they must be able to save their interest or request contact.

---

## Notes

- Uses the project catalog maintained in [[HU7-ProjectCatalog\|HU 7]] and the purchase-capacity primitive defined in [[research/spike1-e4-lead-project-matching-criteria\|Spike 1 · E4 — Lead–Project Matching Criteria]]; reuse it rather than defining a second capacity formula.
- Complements the executive-side view ([[HU10-LeadProjectMatching\|HU 10]]) with a lead-facing, project-centric check.
- **Numbering note:** story added by the updated sprint plan ("HUs para Sprint 1" document, ID `HU 9`); it had no predecessor under the E4 plan.
