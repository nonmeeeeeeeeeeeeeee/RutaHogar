# HU 8 — Applicable Housing Benefits Detector

> 🔜 **Sprint 1.** Planned for the first sprint of the updated plan.

Evaluates a lead's profile to suggest potential housing benefits (like subsidies or FOGAES) as alternative financing paths, making sure to clarify that these are referential suggestions.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | — |
| **Required by** | — |

---

## User Story

> **As** a lead interested in buying a home, **I want** to know if my profile could be compatible with housing benefits like subsidies, FOGAES, or other support, **in order to** understand alternative financing paths without assuming I am already approved.

---

## Acceptance Criteria

### E1 — Benefit route indication

**Given** the user has a financial evaluation,  
**When** they review their result,  
**Then** the system must indicate if there is a possible applicable housing benefit route.

---

### E2 — Reference disclaimer

**Given** that benefits depend on external requirements,  
**When** a suggestion is shown,  
**Then** it must be clarified that it is referential and does not guarantee approval.

---

### E3 — Target home consideration

**Given** the user has a target home,  
**When** the suggestion is evaluated,  
**Then** it must consider the value, type of home, and condition (new/used).

---

### E4 — Academy linkage

**Given** that there is related educational content,  
**When** a benefit suggestion appears,  
**Then** it must link to the Academy section.

---

## Notes

- The UI must prominently display the disclaimer (E2) so users do not mistake a suggestion for a definitive approval.
- The evaluation logic (E3) should cross-reference the user's target property parameters with current subsidy/FOGAES thresholds.
- Frontend counterpart: Requires a link component pointing to the `Academy` module.