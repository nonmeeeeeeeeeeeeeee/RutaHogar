# HU 29 — Mobile Experience for the Lead

> 🔜 **Sprint 1.** A responsive, mobile-first version of the lead flow — landing, pre-assessment form, result, and improvement plan — usable from a phone without loss of functionality.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Essential |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | [[HU1-FinancialDataEntry\|HU 1]], [[HU3-HybridScoring\|HU 3]], [[HU7x-ImprovementPlan\|HU 7x]] |
| **Required by** | — |

---

## User Story

> **As** a lead interested in buying a home, **I want** to complete my financial pre-assessment and review my result from a phone, **in order to** know my financial situation simply, quickly, and without depending on a computer.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU1-FinancialDataEntry\|HU 1]]** — E1 and E2 render the pre-assessment form on a phone. This story's note: *"mobile counterpart of the lead-facing stories HU 1, HU 3, and HU 7; it adds no new business logic, only responsive delivery."*  `documented`

- **[[HU3-HybridScoring\|HU 3]]** — E3 renders "score, classification, purchase capacity, and recommendations" — HU 3's result payload.  `documented`

- **[[HU7x-ImprovementPlan\|HU 7x]]** — E4 requires the lead to "review their milestones, record progress" from mobile without losing desktop functionality; that plan is HU 7's.  `documented`

---

## Acceptance Criteria

### E1 — Responsive pre-assessment flow

**Given** the lead accesses from a mobile device,  
**When** they view the landing, the pre-assessment form, and the result screen,  
**Then** the system must adapt the elements to the screen without horizontal scrolling or loss of information.

---

### E2 — Usable mobile form

**Given** the lead completes their assessment from a phone,  
**When** they enter financial data such as income, debts, savings, and employment situation,  
**Then** the fields must be legible, easy to select, and use appropriate keyboards for each data type.

---

### E3 — Readable financial result on mobile

**Given** the lead finished their pre-assessment from a phone,  
**When** they view their score, classification, purchase capacity, and recommendations,  
**Then** the information must be shown in an orderly way, prioritizing the most important elements.

---

### E4 — Improvement plan accessible from mobile

**Given** the lead has an active improvement plan,  
**When** they access from a mobile device,  
**Then** they must be able to review their milestones, record progress, and view their progress without losing functionality relative to the desktop version.

---

### E5 — Validation on mobile screen sizes

**Given** the mobile version of the lead flow is delivered,  
**When** interface tests are run,  
**Then** its behavior must be verified on representative phone resolutions, such as 360×800, 390×844, and 430×932.

---

## Notes

- This is the mobile counterpart of the lead-facing stories [[HU1-FinancialDataEntry\|HU 1]], [[HU3-HybridScoring\|HU 3]], and [[HU7x-ImprovementPlan\|HU 7x]]; it adds no new business logic, only responsive delivery.
- The executive-side mobile counterpart is [[HU30-MobileExecutiveDashboard\|HU 30]].
- Supports the RNF **Ease of use** attribute — see [[AtributosDeCalidad\|Atributos de calidad]].
