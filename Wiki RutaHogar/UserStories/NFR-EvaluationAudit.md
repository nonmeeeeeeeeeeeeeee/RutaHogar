# NFR — Technical Auditing (Evaluation Auditing)

> ℹ️ **Non-functional requirement.** The updated sprint plan ("HUs para Sprint 1" document) classifies this capability as a technical non-functional requirement ("Auditoría técnica") rather than a functional user story. Kept here for reference; it was `HU 16` under the E4 plan.

Provides a record of actions performed on evaluations, ensuring traceability and easing the review of changes within the system.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 3 |
| **Actor** | Real Estate Admin / Admin Dev |
| **Status** | ℹ️ NFR (updated backlog) |
| **Sprint** | — |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | [[NFR-ImmutableEvaluationHistory\|Immutable Evaluation History (NFR)]] |

---

## User Story

> **As** a real estate admin/dev, **I want** to have a record of actions performed on evaluations, **in order to** ensure traceability and ease the review of changes within the system.

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
- Pairs with the immutable versioning in [[NFR-ImmutableEvaluationHistory\|Immutable Evaluation History (NFR)]]: audit records *who/when*, the immutable-history NFR records *what changed*.
- Data-model validated in **Spike 2**.
