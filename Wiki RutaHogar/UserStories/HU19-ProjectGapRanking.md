# HU 19 — Project Gap Ranking

> 🗓 **Sprint 2.** Shows a lead alternative projects ordered by how close they are to their current capacity, so they can find more realistic options without starting from scratch.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU7-ProjectCatalog\|HU 7]], [[HU6-CompatibilitySimulation\|HU 6]] |
| **Required by** | — |

---

## User Story

> **As** a lead, **I want** to see alternative projects ordered by how close they are to my current capacity, **in order to** find more realistic options without starting from zero.

---

## Acceptance Criteria

### E1 — Ordered by financial compatibility

**Given** projects exist in the catalog,  
**When** the user reviews alternatives,  
**Then** the system must order them by financial compatibility.

---

### E2 — Main gap shown

**Given** a project is not compatible,  
**When** it appears in the ranking,  
**Then** it must show its main gap.

---

### E3 — Preferred comuna prioritized

**Given** the user indicated an alternative comuna,  
**When** the ranking is generated,  
**Then** it must prioritize projects in that zone.

---

### E4 — Compare with initial objective

**Given** the user selects an alternative project,  
**When** they review it,  
**Then** they must be able to compare it against their initial objective.

---

## Notes

- Ranking reuses the compatibility evaluation introduced by [[HU6-CompatibilitySimulation\|HU 6]] and the catalog data from [[HU7-ProjectCatalog\|HU 7]].
- Complements the per-project quote ([[HU9-OrientativeQuote\|HU 9]]) with a cross-project, gap-oriented view.
- **Numbering note:** story added by the updated sprint plan ("HUs para Sprint 1" document, ID `HU 19`); it had no predecessor under the E4 plan.
