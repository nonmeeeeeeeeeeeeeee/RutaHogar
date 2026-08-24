# HU 14 — Real Estate Accessibility Map Visualization

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

A map of the Región Metropolitana with sectors classified by the lead's financial capacity, so they can see visually where they could buy today and where they are out of reach.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Optional |
| **Story Points** | 8 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU6-CompatibilitySimulation\|HU 6]] |
| **Required by** | [[HU22-AccessibilityMapUpdate\|HU 22]] |

---

## User Story

> **As** a user who completed their assessment, **I want** to visualize a map of the Región Metropolitana with sectors classified according to my financial capacity, **in order to** understand visually where I could buy today and where I am out of reach.

---

## Acceptance Criteria

### E1 — Visual classification by neighborhood

**Given** the user completed their assessment,  
**When** they access the map,  
**Then** each neighborhood must be shown as accessible, close, or out of reach according to their financial profile.

---

### E2 — Reason for the result

**Given** a neighborhood appears as close or out of reach,  
**When** the user selects it,  
**Then** the system must show the main reason for the result.

---

### E3 — Heat-map visualization

**Given** the lead opens the heat map,  
**When** the system crosses their score with the available sectors,  
**Then** it must mark in green the sectors where they can and want to buy, in yellow where it is unlikely, and in red the unreachable sectors.

---

### E4 — Explanation of results

**Given** the user got a segment or project in "yellow" or "red",  
**When** they click on it,  
**Then** the system must explain how much more income, savings, or financial improvement they need to access that sector or project.

---

## Notes

- Reuses the compatibility logic from [[HU6-CompatibilitySimulation\|HU 6]] and the `PRECIOS_REFERENCIA_UF` comuna reference from the scoring engine.
- The map recomputes dynamically as the lead changes conditions — see [[HU22-AccessibilityMapUpdate\|HU 22]].
- **Numbering note:** this story was `HU 10` under the E4 plan; the updated sprint plan renumbers it to `HU 14` and moves it from Sprint 3 to Sprint 2. The source document also lists it twice (`HU 14` in Sprint 2 and `HU 21` in Sprint 3 with identical criteria) — it is a single story, tracked here once.
