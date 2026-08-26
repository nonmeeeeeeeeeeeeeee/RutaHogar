# HU 25 — Housing Subsidy Simulation

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning.

Lets a lead check or simulate whether they qualify for housing subsidies, to reduce the dividend and offset a lack of savings. Results are clearly referential.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | — |

---

## User Story

> **As** an interested lead, **I want** to check (or simulate) whether I qualify for subsidies automatically, **in order to** reduce the dividend value and offset a lack of savings.

---

## Acceptance Criteria

### E1 — Suggest evaluating the impact of subsidies

**Given** the lead got a low score mainly due to their income level,  
**When** the system generates the assessment result,  
**Then** it must suggest exploring housing subsidies as an alternative to improve their access to a home.

---

### E2 — Recalculate score (dividend) based on the subsidy

**Given** the lead chooses to explore the subsidy,  
**When** they simulate the purchase,  
**Then** the system recalculates the dividend applying the benefit.

---

### E3 — Referential nature of the subsidy simulation

**Given** the user views a housing-subsidy simulation,  
**When** the system shows the results,  
**Then** it must clearly indicate that the information is referential, does not guarantee obtaining the subsidy, and does not replace the official evaluation by the corresponding entities.

---

### E4 — Subsidy options based on entered data

**Given** the user entered information such as income, available savings, comuna of interest, and real estate objective,  
**When** the system evaluates the possibility of applying for a housing subsidy,  
**Then** it must show the compatible or potentially compatible subsidy options, indicating the estimated benefit and the main conditions to meet.

---

## Notes

- Subsidy rules and eligibility criteria are researched in **Spike 1** / validated in **Spike 2**. FOGAES parameters (90% LTV, UF 4.500 cap → UF 6.000 pending bill) and the `desbloqueable_con_fogaes` flag are already documented in [[research/spike1-e4-lead-project-matching-criteria\|Spike 1 · E4 — Lead–Project Matching Criteria]].
- A recalculated dividend (E2) is a scoring-recalculation trigger for [[HU33-ImmutableEvaluationHistory\|HU 33]].
- Related simulations: [[HU20-EconomicSimulation\|HU 20]], [[HU26-CreditTermSimulation\|HU 26]].
