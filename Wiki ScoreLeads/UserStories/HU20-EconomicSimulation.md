# HU 20 — Economic Simulation with UF and Interest Rates

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning. Do not implement without explicit team instruction.

Lets a lead see how changes in the UF or in interest rates affect their purchase capacity and monthly dividend, so they understand the financial risk of their scenario before advancing.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Optional |
| **Story Points** | 3 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | — |

---

## User Story

> **As** a person interested in buying a home, **I want** to visualize how changes in the UF or interest rates affect my purchase capacity, **in order to** understand the financial risks before advancing in the process.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU3-HybridScoring\|HU 3]]** — E1 and E2 recompute purchase capacity and dividend under shifted rates. This story's note: *"reuses the scoring engine's dividend and financial-burden logic rather than introducing a new model."*  `documented`

---

## Acceptance Criteria

### E1 — Interest-rate scenario

**Given** the user has already received their assessment,  
**When** they select a scenario with different interest rates,  
**Then** the system must show how their purchase capacity and dividend change.

---

### E2 — UF-variation scenario

**Given** the user views their assessment,  
**When** the system processes a simulated UF variation,  
**Then** it must show the estimated change in financing capacity.

---

### E3 — Financial-risk notification

**Given** the user simulates a scenario with an interest-rate increase or UF variation,  
**When** the system detects that the estimated dividend or financial burden exceeds the threshold defined by the system's rules,  
**Then** it must show a risk alert indicating that the scenario could affect their payment capacity, and recommend alternatives such as increasing the down payment, adjusting the term, reducing the target property value, or evaluating available subsidies.

---

### E4 — Clear comparison

**Given** the user reviews economic scenarios,  
**When** the system presents the results,  
**Then** it must clearly distinguish the current scenario from the simulated ones.

---

## Notes

- This story is the "stress algorithm" concept: simulating rate/UF shocks against the lead's profile.
- It reuses the scoring engine's dividend and financial-burden logic rather than introducing a new model.
- Related simulation stories: [[HU9-CompatibilitySimulation\|HU 9]] (compatibility/alternatives), [[HU25-SubsidySimulation\|HU 25]] (subsidies), [[HU26-CreditTermSimulation\|HU 26]] (credit terms).
- **Numbering note:** documented as `HdU 6` (Stress Algorithm) in the E2 informe; renumbered to `HU 20` following the E4 plan.
