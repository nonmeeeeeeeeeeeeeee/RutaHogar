# HU 3 — Hybrid Scoring with Intelligent Explanation

The core engine of RutaHogar. Processes the financial data submitted in HU 1, computes a 0–100 score using parametric rules, classifies the lead, and generates an AI-assisted explanation of the key factors behind the result. Every evaluation is stored as an immutable record.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Very complex |
| **Story Points** | 8 |
| **Actor** | Lead |
| **Status** | ✅ Implemented (PMV) |
| **Sprint** | PMV (completed) |
| **Depends on** | [[HU1-FinancialDataEntry\|HU 1]] |
| **Required by** | [[HU2-LeadPrioritization\|HU 2]], [[HU7-ImprovementPlan\|HU 7]] |

---

## User Story

> **As** a person interested in buying a home, **I want** to receive an immediate financial assessment through a hybrid scoring with intelligent explanation, **in order to** understand my level of readiness, the main factors influencing my result, and the recommended next steps before starting a formal assessment.

---

## Acceptance Criteria

### E1 — Display of assessment result

**Given** the user has completed the form,  
**When** they submit their data for processing,  
**Then** the system must display the scoring result within a maximum of 60 seconds after the form is submitted.

---

### E2 — Lead classification by score

**Given** the RutaHogar system has received the user's data,  
**When** the scoring is performed,  
**Then** the result must classify the user into clear priority levels (Alto, Medio, Bajo).

---

### E3 — AI-powered explanation

**Given** the system presents the assessment result,  
**When** the user views their credit classification,  
**Then** the system, through an AI agent, must display a detailed explanation of the main factors that influenced the score.

---

### E4 — System scope warning

**Given** the user views their result,  
**When** the scoring explanation is displayed,  
**Then** the system must indicate explicitly that the score is indicative only and does not replace a formal bank assessment.

---

### E5 — Result traceability

**Given** the scoring calculation is successful,  
**When** the system saves the evaluation,  
**Then** it must generate an immutable record containing the timestamp, numeric score, classification, input snapshot, algorithm version, and per-component breakdown.

---

### E6 — Education flow / sales executive notification

**Given** a lead submits their financial data,  
**When** the system evaluates them and determines they do not meet the minimum qualifying score,  
**Then** they must be able to enter a financial education flow without executive intervention; and conversely, if the score is High, the sales executive must be notified.

---

## Notes

- The scoring engine is implemented in `backend/app/scoring.py`. Base score is 50; adjustments range from −30 to +25. Final score is clamped to [0, 100].
- The AI explanation layer (`generate_ai_explanation`) is currently a deterministic mock. The real LLM provider is not yet defined — the interface is isolated so the provider can be swapped without changing the function signature.
- Classification thresholds: Alto ≥ 70, Medio ≥ 40, Bajo < 40.
- The immutable record described in E5 maps to the `evaluations` table. See [[../Database/evaluations\|evaluations]] for the full schema, including `algoritmo_version` and `component_breakdown` columns. Full versioning/lineage is expanded in [[HU33-ImmutableEvaluationHistory\|HU 33]].
- The E6 education flow redirect is documented in [[../Functionalities/e6-score-redirect\|e6-score-redirect]].
- **Numbering note:** documented as `HdU 3` in the E2 informe; renumbered to `HU 3` following the E4 plan.
