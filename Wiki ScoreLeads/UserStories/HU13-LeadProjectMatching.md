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
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU17-ProjectCatalog\|HU 17]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive, **I want** the system to suggest leads compatible with the projects I sell, **in order to** prioritize prospects with a higher probability of conversion.

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

- Matching criteria (estimated capacity, comuna, price range, down payment, classification, main blocker) are defined in **Spike 1**.
- Requires the project catalog from [[HU17-ProjectCatalog\|HU 17]] to know which projects are actually available.
- Complements the priority dashboard [[HU2-LeadPrioritization\|HU 2]] by adding a project-centric view.
