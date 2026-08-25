# HU 1 — Financial Data Entry

Covers the initial data capture step: a guided, multi-step web form that collects the lead's core financial and employment information, validates it in real time, and routes the user to the scoring result — all without requiring documents or contact with a sales executive.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Complex |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | ✅ Implemented (PMV) |
| **Sprint** | PMV (completed) |
| **Depends on** | [[HU5-BasicSecurity\|HU 5]] |
| **Required by** | [[HU3-HybridScoring\|HU 3]], [[HU6-PrivacyPanel\|HU 6]], [[HU23-EventLogAnalytics\|HU 23]], [[HU29-MobileLeadExperience\|HU 29]] |

---

## User Story

> **As** a lead (person interested in buying a home), **I want** to complete a guided web form with my financial data and high ease of use, **in order to** start my credit viability assessment without having to talk to a sales executive.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU5-BasicSecurity\|HU 5]]** — Declared by HU 5's `Required by` ("data-handling paths"). HU 1 E1 registers a profile and E3 rejects unconsented submissions — those are the input-validation and controlled-error surfaces HU 5 E1–E2 define.  `inferred`

---

## Acceptance Criteria

### E1 — Successful form completion

**Given** the user accesses the ScoreLeads platform for the first time,  
**When** they complete all required fields (income, debts, contract type, age) and accept the data consent,  
**Then** the system registers their profile and automatically redirects them to their assessment result.

---

### E2 — Inconsistency in declared data

**Given** the user is filling out the form,  
**When** they declare a monthly debt amount greater than their declared income,  
**Then** the system displays a visual warning on the corresponding field before allowing them to continue to the next step.

---

### E3 — Data consent

**Given** a pre-qualification request is received where the data-processing consent has not been accepted,  
**When** the system validates the requirements of the request,  
**Then** the assessment and the data must not be stored, in order to protect the privacy of the information.

---

### E4 — Rent supplement

**Given** the lead's credit viability assessment is configured under joint evaluation mode (supplemented income),  
**When** the system structures the pre-qualification request,  
**Then** it must instantiate an associated data requirement, mandatorily requesting the co-debtor's income and debts in order to execute the consolidated scoring calculation.

---

## Notes

- The form is deliberately lightweight — no document upload in this stage. Document upload is a separate, deferred story ([[HU19-SupportingDocuments\|HU 19]]).
- Rent supplement (`complemento_renta`) activates additional required fields: `complemento_nombre`, `complemento_monto`, `complemento_relacion`.
- Consent validation (E3) is enforced at the middleware level in the backend, not only in the UI. See `POST /score` contract in [[../../.claude/CLAUDE\|CLAUDE.md]].
- A mobile-optimized version of this flow is tracked as [[HU29-MobileLeadExperience\|HU 29]].
- **Numbering note:** in the E2 informe this story was documented as `HdU 1`; the wiki now follows the E4 plan's `HU` numbering.
