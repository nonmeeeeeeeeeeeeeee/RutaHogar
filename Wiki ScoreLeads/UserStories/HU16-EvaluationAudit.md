# HU 16 — Evaluation Auditing

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Provides a record of actions performed on evaluations, ensuring traceability and easing the review of changes within the system.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 3 |
| **Actor** | Real Estate Admin / Admin Dev |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | [[HU24-FraudulentLeadReporting\|HU 24]], [[HU33-ImmutableEvaluationHistory\|HU 33]] |

---

## User Story

> **As** a real estate admin/dev, **I want** to have a record of actions performed on evaluations, **in order to** ensure traceability and ease the review of changes within the system.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU3-HybridScoring\|HU 3]]** — E1 records events on evaluations being created, updated, or reviewed; evaluations themselves are produced by HU 3 E5.  `documented`

---

## Acceptance Criteria

### E1 — Action recording

**Given** an evaluation is created, updated, or reviewed,  
**When** the action occurs,  
**Then** the system must record the corresponding event.

---

### E2 — Responsible identification

**Given** an action is recorded,  
**When** the real estate admin/dev consults the audit,  
**Then** they must see the responsible user and the date of the event.

---

### E3 — Chronological history

**Given** events associated with an evaluation exist,  
**When** its history is displayed,  
**Then** they must be shown in chronological order.

---

## Notes

- Supports the RNF **Traceability** attribute — see [[../AtributosDeCalidad\|Atributos de calidad]].
- Pairs with the immutable versioning in [[HU33-ImmutableEvaluationHistory\|HU 33]]: audit records *who/when*, HU 33 records *what changed*.
- Data-model validated in **Spike 2**.
