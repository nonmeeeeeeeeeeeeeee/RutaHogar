# HU 18 — Referential Mortgage Scenario Simulator

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Lets a lead modify variables such as down payment (pie), term, home value, or referential rate to understand how their estimated installment (dividendo) and financial compatibility change.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | — |

---

## User Story

> **As** a lead, **I want** to modify variables such as down payment, term, home value, or referential rate, **in order to** understand how my estimated installment and my financial compatibility change.

---

## Acceptance Criteria

### E1 — Referential installment recalculation

**Given** the user modifies the down payment, term, referential rate, or home value,  
**When** they run the simulation,  
**Then** the system must recalculate the referential installment.

---

### E2 — Difference against the base scenario

**Given** a base scenario exists,  
**When** the user generates a new scenario,  
**Then** it must show the difference against the initial scenario.

---

### E3 — Financial-burden warning

**Given** the calculated installment exceeds a prudent threshold,  
**When** the result is shown,  
**Then** it must warn about financial-burden risk.

---

### E4 — Referential disclaimer

**Given** results are shown,  
**When** the user reviews them,  
**Then** it must be indicated that they are referential and do not replace a formal bank assessment.

---

## Notes

- It reuses the scoring engine's dividend and financial-burden logic rather than introducing a new model; the prudent threshold (E3) should align with the debt-to-income rule used by [[HU3-HybridScoring\|HU 3]].
- Related simulation stories: [[HU6-CompatibilitySimulation\|HU 6]] (compatibility/alternatives), [[HU26-SubsidySimulation\|HU 26]] (subsidies), [[HU29-CreditTotalCostComparator\|HU 29]] (total credit cost).
- **Numbering note:** documented as `HdU 6` (Stress Algorithm) in the E2 informe and as `HU 20` (Economic Simulation with UF & Rates) under the E4 plan. The updated sprint plan renumbers it to `HU 18`, moves it from Sprint 3 to Sprint 2, raises it from Optional/3 SP to Important/5 SP, and replaces its criteria with the mortgage-scenario simulation above.
