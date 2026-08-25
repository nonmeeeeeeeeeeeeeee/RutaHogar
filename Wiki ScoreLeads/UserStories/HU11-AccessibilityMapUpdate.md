# HU 11 — Dynamic Accessibility-Map Update

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
| **Depends on** | [[HU10-AccessibilityMap\|HU 10]] |
| **Required by** | — |

---

## User Story

> **As** a user who modifies their financial conditions or purchase preferences, **I want** the accessibility map to update automatically, **in order to** compare how my housing options change according to my score, income, term, or property type.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU10-AccessibilityMap\|HU 10]]** — This story's note: *"Extends HU 10 with reactive recomputation; no new classification logic."* E1 and E2 recolour a map that only HU 10 creates.  `documented`

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

- Extends [[HU10-AccessibilityMap\|HU 10]] with reactive recomputation; no new classification logic.
