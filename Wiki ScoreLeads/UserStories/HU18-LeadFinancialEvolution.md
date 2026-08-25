# HU 18 — Lead Financial Evolution

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
| **Depends on** | [[HU2-LeadPrioritization\|HU 2]], [[HU3-HybridScoring\|HU 3]], [[HU33-ImmutableEvaluationHistory\|HU 33]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive, **I want** to visualize a lead's financial evolution, **in order to** detect contact and commercial follow-up opportunities.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU2-LeadPrioritization\|HU 2]]** — This story's note: *"Complements the executive dashboard HU 2 with a temporal view of each lead."* E1 surfaces the history when "the executive accesses their profile" — that profile view belongs to HU 2.  `inferred · S2`

- **[[HU3-HybridScoring\|HU 3]]** — E2 shows changes in "score, purchase capacity, or main blocker", all of which are HU 3 outputs.  `documented`

- **[[HU33-ImmutableEvaluationHistory\|HU 33]]** — This story's note: *"Depends on the versioned history from HU 33 to reconstruct the evolution."* E1 needs more than one retained evaluation, which HU 33 E2's immutability guarantees.  `documented`

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

- Depends on the versioned history from [[HU33-ImmutableEvaluationHistory\|HU 33]] to reconstruct the evolution.
- Complements the executive dashboard [[HU2-LeadPrioritization\|HU 2]] with a temporal view of each lead.
