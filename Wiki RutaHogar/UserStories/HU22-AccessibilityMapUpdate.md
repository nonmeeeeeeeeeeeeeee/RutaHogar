# HU 22 — Dynamic Accessibility-Map Update

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning.

Automatically refreshes the accessibility map when the lead changes their financial conditions or purchase preferences, so they can compare how their options shift.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Optional |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | [[HU14-AccessibilityMap\|HU 14]] |
| **Required by** | — |

---

## User Story

> **As** a user who modifies their financial conditions or purchase preferences, **I want** the accessibility map to update automatically, **in order to** compare how my housing options change according to my score, income, term, or property type.

---

## Acceptance Criteria

### E1 — Re-evaluation when score/income changes

**Given** a user has improved their score or income,  
**When** they re-enter the map,  
**Then** the system must recompute the segments or projects and change the map colors accordingly.

---

### E2 — Update by levers

**Given** the user adjusts term, property type, or first-home condition,  
**When** they modify those parameters,  
**Then** the map must update the accessibility result.

---

## Notes

- Extends [[HU14-AccessibilityMap\|HU 14]] with reactive recomputation; no new classification logic.
- **Numbering note:** this story was `HU 11` under the E4 plan; the updated sprint plan renumbers it to `HU 22` (still Sprint 3).
