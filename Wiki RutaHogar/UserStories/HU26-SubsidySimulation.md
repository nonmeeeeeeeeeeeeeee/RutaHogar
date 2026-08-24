# HU 26 — Advanced Housing Subsidy Simulation

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning.

Lets an interested lead simulate, referentially, the impact of housing subsidies on their purchase objective, to understand whether they could get closer to a more viable alternative.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU5-FinancialAcademy\|HU 5]] |
| **Required by** | — |

---

## User Story

> **As** an interested lead, **I want** to simulate referentially the impact of housing subsidies on my purchase objective, **in order to** understand whether they could bring me closer to a more viable alternative.

---

## Acceptance Criteria

### E1 — Subsidy impact estimate

**Given** the user has an assessment,  
**When** they activate the subsidy simulation,  
**Then** the system must estimate the possible impact on the down payment, installment, or financeable value.

---

### E2 — Main conditions indicated

**Given** requirements are associated with the benefit,  
**When** the result is shown,  
**Then** it must indicate the main conditions the user would need to meet.

---

### E3 — Referential disclaimer

**Given** the benefit is not automatic,  
**When** the simulation is presented,  
**Then** it must be made clear that it is referential and does not guarantee approval.

---

### E4 — Academy linkage

**Given** the user reviews the simulation,  
**When** related content exists,  
**Then** it must link to the Academy section.

---

## Notes

- Subsidy rules and eligibility criteria are researched in **Spike 1** / validated in **Spike 2**. FOGAES parameters (90% LTV, UF 4.500 cap → UF 6.000 pending bill) and the `desbloqueable_con_fogaes` flag are already documented in [[research/spike1-e4-lead-project-matching-criteria\|Spike 1 · E4 — Lead–Project Matching Criteria]].
- A recalculated dividend (E1) is a scoring-recalculation trigger for [[NFR-ImmutableEvaluationHistory\|Immutable Evaluation History (NFR)]].
- Related simulations: [[HU18-MortgageScenarioSimulator\|HU 18]], [[HU29-CreditTotalCostComparator\|HU 29]].
- **Numbering note:** this story was `HU 25` under the E4 plan; the updated sprint plan renumbers it to `HU 26` (still Sprint 3) and aligns its criteria to impact-on-objective wording (down payment / installment / financeable value) plus an explicit Academy link.
