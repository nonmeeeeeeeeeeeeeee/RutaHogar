# HU 27 — Referential Review of Declared Background

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning.

Lets a sales executive review the lead's declared financial background referentially, to identify potential risks before advancing with commercial management. This is an internal simulation based on declared data, **not** an official CMF query.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Sales Executive |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive, **I want** to review the financial background declared by the lead referentially, **in order to** identify potential risks before advancing with commercial management.

---

## Acceptance Criteria

### E1 — Referential summary from declared data

**Given** the lead completed their pre-assessment,  
**When** the executive requests the background review,  
**Then** the system must generate a referential summary based on the declared data.

---

### E2 — Risk classification

**Given** risk signals exist,  
**When** the review is generated,  
**Then** they must be classified as Low, Medium, High, or Critical.

---

### E3 — Not-an-official-query disclaimer

**Given** the review is based on declared information,  
**When** it is shown,  
**Then** it must clarify that it does not correspond to an official CMF query.

---

### E4 — Insufficient-data handling

**Given** the lead does not have enough data,  
**When** the review generation is attempted,  
**Then** the system must request completing the required information.

---

## Notes

- Implementation considerations carried over from the earlier version of this story: explain the factors behind the classification (financial burden, declared delinquency, current debts), and reuse the cached result when the lead's financial data has not changed.
- A scoring adjustment derived from this review is a recalculation trigger for [[NFR-ImmutableEvaluationHistory\|Immutable Evaluation History (NFR)]].
- Integration requirements for a real CMF query are researched in **Spike 2**; this story ships the internal, referential simulation.
- Aligns with the CLAUDE.md guardrail: no integration with external APIs (CMF, Dicom, banks) without explicit instruction — hence "referential/simulated".
- **Numbering note:** this story was `HU 31` (Simulated CMF Query) under the E4 plan; the updated sprint plan renumbers it to `HU 27`, moves it from Sprint 2 to Sprint 3, changes its category from Optional to Desirable, and condenses its criteria to the four above.
