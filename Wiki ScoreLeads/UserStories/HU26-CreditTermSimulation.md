# HU 26 — Credit-Term Variation Simulation

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning.

Lets a lead simulate their credit at 20-, 25-, and 30-year terms to find the balance between monthly installment and credit lifetime.

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

> **As** a lead interested in buying, **I want** to simulate my credit with 20-, 25-, and 30-year terms (referential timeframes), **in order to** find the right balance between monthly installment and credit lifetime.

---

## Acceptance Criteria

### E1 — Automatic adjustment of installments and interest

**Given** I change the term to 20 years,  
**When** the system processes it,  
**Then** the monthly installment rises but the final interest is reduced.

---

### E2 — Notify about invalid credit simulations

**Given** the projection exceeds 70 years of age,  
**When** I choose 30 years,  
**Then** the simulator notifies me that this option is not valid.

---

### E3 — Visualization of results for intermediate terms

**Given** a term other than the minimum is chosen,  
**When** the system processes the result,  
**Then** it must show the results of the previous terms, perhaps as a chart, to see the variations in installment and interest by segment.

---

## Notes

- Referential simulation only — reuses the dividend/interest logic; does not replace a formal bank quote.
- Related simulations: [[HU20-EconomicSimulation\|HU 20]] (UF/rates), [[HU25-SubsidySimulation\|HU 25]] (subsidies).
