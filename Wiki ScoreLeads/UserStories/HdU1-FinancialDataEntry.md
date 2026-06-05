# HdU 1 — Financial Data Entry

Covers the initial data capture step: a guided, multi-step web form that collects the lead's core financial and employment information, validates it in real time, and routes the user to the scoring result — all without requiring documents or contact with a sales executive.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | ✅ In scope |
| **Depends on** | — |
| **Required by** | [[HdU3-HybridScoring\|HdU 3]] |

---

## User Story

> **As** a lead (person interested in buying a home), **I want** to complete a guided web form with my financial data and high ease of use, **in order to** start my credit viability assessment without having to talk to a sales executive.

---

## Acceptance Criteria

### E1 — Successful form completion

**Given** the user accesses the ScoreLeads platform for the first time,  
**When** they complete all required fields (income, debts, contract type, number of dependants, age) and accept the data consent,  
**Then** the system registers their profile and automatically redirects them to their assessment result.

---

### E2 — Inconsistency in declared data

**Given** the user is filling out the form,  
**When** they declare a monthly debt amount greater than their declared income,  
**Then** the system displays a visual warning on the corresponding field before allowing them to continue to the next step.

---

### E3 — Data consent

**Given** the service receives a pre-qualification request where the data processing consent flag is false or absent,  
**When** the security middleware evaluates the integrity of the request before initiating the calculation,  
**Then** the system must immediately abort the transaction, return a validation error, block any persistence attempt in the database, and log the rejection event exclusively as anonymous traffic.

---

### E4 — Rent supplement

**Given** the lead's credit viability assessment is configured under joint evaluation mode (supplemented income),  
**When** the system structures the pre-qualification request,  
**Then** it must instantiate an associated data requirement, mandatorily requesting the co-debtor's income and debts in order to execute the consolidated scoring calculation.

---

## Notes

- The form is deliberately lightweight — no document upload in this stage.
- Rent supplement (`complemento_renta`) activates additional required fields: `complemento_nombre`, `complemento_monto`, `complemento_relacion`.
- Consent validation (E3) is enforced at the middleware level in the backend, not only in the UI. See `POST /score` contract in [[../../.claude/CLAUDE|CLAUDE.md]].
