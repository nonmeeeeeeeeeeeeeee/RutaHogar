# HU 13 — Lead–Project Matching for Sales Executives

> 🔜 **Sprint 1.** Suggests leads compatible with the projects an executive sells, ranked by affinity and purchase capacity — surfacing opportunities even when a lead's general classification isn't High.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 5 |
| **Actor** | Sales Executive |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | [[HU2-LeadPrioritization\|HU 2]], [[HU3-HybridScoring\|HU 3]], [[HU9-CompatibilitySimulation\|HU 9]], [[HU7-ProjectCatalog\|HU 7]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive, **I want** the system to suggest leads compatible with the projects I sell, **in order to** prioritize prospects with a higher probability of conversion.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU2-LeadPrioritization\|HU 2]]** — E1 is written against "their leads panel", which is HU 2's dashboard. Team confirmed 2026-08-08 that HU 13 extends that panel rather than shipping a separate view.  `inferred · B12`

- **[[HU3-HybridScoring\|HU 3]]** — E2 allows a lead to surface as recommended "even if their general classification is not High" — the classification it overrides is HU 3 E2's.  `documented`

- **[[HU9-CompatibilitySimulation\|HU 9]]** — E1 orders leads by "purchase capacity" and E3 displays "estimated capacity". That value is defined only by HU 9 E4 and is computed nowhere in `backend/app/scoring_engine` — all 20 indicators are relative to a *declared* property value.  `inferred · B7`

- **[[HU7-ProjectCatalog\|HU 7]]** — HU 7's note: *"This catalog is the data source for the matching engine in HU 13."* E1 needs projects to select from; E4 needs their sold-out status.  `documented`

---

## Acceptance Criteria

### E1 — Prioritized list per project

**Given** the executive selects a project,  
**When** they access their leads panel,  
**Then** the system must show compatible users ordered by affinity and purchase capacity.

---

### E2 — Matching by capacity

**Given** a user has enough capacity for a project,  
**When** the matching engine evaluates them,  
**Then** they must be able to appear as recommended even if their general classification is not High.

---

### E3 — Evidence for the executive

**Given** a lead appears as recommended,  
**When** the executive reviews their card,  
**Then** they must see estimated capacity, down payment, classification, and main blocker.

---

### E4 — Re-orientable lead

**Given** a user can buy a project different from their declared objective,  
**When** the system detects this,  
**Then** it must show them as a re-orientable opportunity.

---

## Notes

- Matching criteria (estimated capacity, comuna, price range, down payment, classification, main blocker) are defined in **Spike 1 · E4** — see [[research/spike1-e4-lead-project-matching-criteria\|Lead–Project Matching Criteria]], which carries the frozen contract this story must code against.
- Requires the project catalog from [[HU7-ProjectCatalog\|HU 7]] to know which projects are actually available.
- Complements the priority dashboard [[HU2-LeadPrioritization\|HU 2]] by adding a project-centric view.
