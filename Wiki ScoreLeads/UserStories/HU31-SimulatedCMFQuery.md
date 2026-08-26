# HU 31 — Simulated CMF Query

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Lets an executive verify delinquency/debt background from the user-provided information, producing a referential risk classification. This is an internal simulation, **not** an official CMF query.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Optional |
| **Story Points** | 5 |
| **Actor** | Sales Executive |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive, **I want** to verify delinquency (debt) background based on the information provided by the user, **in order to** determine whether the lead has healthy payment behavior.

---

## Acceptance Criteria

### E1 — Generation of debt-background simulation

**Given** the lead completed their financial pre-assessment,  
**When** the executive requests to review their simulated debt background,  
**Then** the system must generate a referential result considering income, declared debts, financial burden, reported delinquency, and declared payment behavior.

---

### E2 — Debt-risk classification

**Given** the system processed the lead's declared financial information,  
**When** the simulation is generated,  
**Then** it must classify the debt risk into levels such as "Low", "Medium", "High", or "Critical", according to previously defined internal rules.

---

### E3 — Explanation of the obtained result

**Given** a generated debt simulation exists,  
**When** the executive reviews the lead's detail,  
**Then** the system must show a clear explanation of the factors that influenced the result, indicating whether financial burden, declared delinquency, or current debts negatively affected the evaluation.

---

### E4 — System cache

**Given** a previous simulation associated with the lead exists,  
**When** the executive requests to consult their simulated background again,  
**Then** the system must reuse the saved result if the financial data has not changed.

---

### E5 — CMF query only for validated leads

**Given** the lead does not have sufficient or valid financial information,  
**When** the simulation is attempted,  
**Then** the system must block the query and request completing the required data.

---

### E6 — Scoring adjustment based on the simulated result

**Given** the simulation detects a relevant risk level,  
**When** the system updates the lead's evaluation,  
**Then** it must apply an adjustment to the financial scoring and record the reason for the change, making clear that it corresponds to an internal simulation and not an official CMF query.

---

## Notes

- Integration requirements for a real CMF query are researched in **Spike 2**; this story ships the internal, referential simulation.
- A scoring adjustment (E6) is a recalculation trigger for [[HU33-ImmutableEvaluationHistory\|HU 33]].
- Aligns with the CLAUDE.md guardrail: no integration with external APIs (CMF, Dicom, banks) without explicit instruction — hence "simulated".
