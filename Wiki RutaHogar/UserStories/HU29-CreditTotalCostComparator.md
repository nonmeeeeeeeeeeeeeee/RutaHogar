# HU 29 — Referential Total Credit-Cost Comparator

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning.

Lets a lead see the referential cost of a credit under different terms, to understand that reducing the monthly installment can increase the total cost over time.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU18-MortgageScenarioSimulator\|HU 18]] |
| **Required by** | — |

---

## User Story

> **As** a lead, **I want** to visualize the referential cost of a credit under different terms, **in order to** understand that reducing the monthly installment can increase the total cost over time.

---

## Acceptance Criteria

### E1 — Referential installment per term

**Given** the user simulates different terms,  
**When** the results are generated,  
**Then** the system must show the referential installment of each scenario.

---

### E2 — Monthly-burden difference

**Given** different terms are compared,  
**When** the user reviews the result,  
**Then** it must show the difference in monthly burden.

---

### E3 — Total-cost warning for longer terms

**Given** a longer term reduces the monthly installment,  
**When** the result is shown,  
**Then** it must warn that the total cost may increase.

---

### E4 — Referential disclaimer

**Given** financial results are shown,  
**When** the user reviews them,  
**Then** it must be indicated that they are referential.

---

## Notes

- Referential simulation only — reuses the dividend/interest logic; does not replace a formal bank quote.
- Practical preset (carried over from the earlier version): compare 20-, 25-, and 30-year terms side by side; flag scenarios whose age-at-maturity projection exceeds 70 years as invalid.
- Related simulations: [[HU18-MortgageScenarioSimulator\|HU 18]] (mortgage scenarios), [[HU26-SubsidySimulation\|HU 26]] (subsidies), [[HU28-InitialCostEstimator\|HU 28]] (initial purchase costs).
- **Numbering note:** this story was `HU 26` (Credit-Term Variation Simulation) under the E4 plan; the updated sprint plan renumbers it to `HU 29`, raises it from Optional/3 SP to Important/5 SP, and reframes its criteria around total-cost comparison.
