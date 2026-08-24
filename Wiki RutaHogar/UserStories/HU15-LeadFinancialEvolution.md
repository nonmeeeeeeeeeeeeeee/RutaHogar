# HU 15 — Lead Financial Evolution

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Lets a sales executive visualize a lead's financial evolution over time to detect contact and follow-up opportunities.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Sales Executive |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[NFR-ImmutableEvaluationHistory\|Immutable Evaluation History (NFR)]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive, **I want** to visualize a lead's financial evolution, **in order to** detect contact and commercial follow-up opportunities.

---

## Acceptance Criteria

### E1 — Evaluation history

**Given** a lead has performed more than one evaluation,  
**When** the executive accesses their profile,  
**Then** they must see the history of registered evaluations.

---

### E2 — Evolution visualization

**Given** historical evaluations exist,  
**When** the executive reviews the lead's profile,  
**Then** the system must show changes in score, purchase capacity, or main blocker.

---

### E3 — Follow-up opportunity

**Given** the lead improves their financial situation,  
**When** the system detects a relevant advance,  
**Then** it must allow flagging it as a contact opportunity.

---

### E4 — Comparator between evaluations

**Given** the executive wants to compare evaluations of the same or a different lead,  
**When** they select two different evaluations,  
**Then** the system must show the comparisons between the profiles, clearly indicating the strengths and weaknesses of each evaluation.

---

## Notes

- Depends on the versioned history from [[NFR-ImmutableEvaluationHistory\|Immutable Evaluation History (NFR)]] to reconstruct the evolution.
- Complements the executive dashboard [[HU2-LeadPrioritization\|HU 2]] with a temporal view of each lead.
- **Numbering note:** this story was `HU 18` under the E4 plan; the updated sprint plan renumbers it to `HU 15` (still Sprint 2).
