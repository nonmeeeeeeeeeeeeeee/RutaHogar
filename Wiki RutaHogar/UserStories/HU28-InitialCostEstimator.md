# HU 28 — Initial Purchase-Cost Estimator

> 🗓 **Sprint 3.** Estimates the initial costs of buying a home beyond the down payment (pie), so a lead can prepare better before moving forward.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU6-CompatibilitySimulation\|HU 6]] |
| **Required by** | — |

---

## User Story

> **As** a lead, **I want** to estimate the initial costs associated with buying a home in addition to the down payment, **in order to** prepare better before advancing.

---

## Acceptance Criteria

### E1 — Referential initial costs

**Given** the user has a target home value,  
**When** they review the estimate,  
**Then** the system must show referential initial costs.

---

### E2 — Clearly separated from the down payment

**Given** initial costs are shown,  
**When** the user reviews them,  
**Then** they must be clearly separated from the down payment (pie).

---

### E3 — Recalculation on value change

**Given** the user changes the target home value,  
**When** the estimate updates,  
**Then** the costs must be recalculated.

---

### E4 — Referential disclaimer

**Given** amounts are shown,  
**When** the user views them,  
**Then** it must be made clear that they are referential.

---

## Notes

- Typical components to consider: notary fees, property transfer tax/stamps, appraisal, and insurance — keep percentages configurable so they can be tuned per market.
- Feeds naturally into the mortgage scenario simulator ([[HU18-MortgageScenarioSimulator\|HU 18]]) and the credit-cost comparator ([[HU29-CreditTotalCostComparator\|HU 29]]).
- **Numbering note:** story added by the updated sprint plan ("HUs para Sprint 1" document, ID `HU 28`); it had no predecessor under the E4 plan.
