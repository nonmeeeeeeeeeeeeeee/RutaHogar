# HU 12 — Contextual Financial Academy

> 🔜 **Sprint 1.** An educational content module (mortgage credit, down payment, subsidies, rates, property types) surfaced contextually based on the lead's situation and blockers.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Essential |
| **Story Points** | 8 |
| **Actor** | Lead |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU7x-ImprovementPlan\|HU 7x]] |
| **Required by** | — |

---

## User Story

> **As** a person interested in buying a home, **I want** to access educational content about mortgage credit, down payment, subsidies, rates, and property types, **in order to** better understand my options and prepare before buying.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU3-HybridScoring\|HU 3]]** — E2 triggers on "an identified financial blocker"; this story's note says blocker detection *"reuses the `risk_codes` produced by the scoring engine (HU 3)"*.  `documented`

- **[[HU7x-ImprovementPlan\|HU 7x]]** — E2 fires when the user reviews "their result **or improvement plan**" — the plan is HU 7's artifact, and this story's note names it alongside HU 3 as the source of blocker detection.  `documented · B1`

---

## Acceptance Criteria

### E1 — Educational catalog

**Given** the user accesses the Academy section,  
**When** they view the module,  
**Then** the system must show articles or capsules organized by topic.

---

### E2 — Content based on the user's situation

**Given** the user has an identified financial blocker,  
**When** they review their result or improvement plan,  
**Then** the system must suggest related educational content.

---

### E3 — Contextual links

**Given** the user views concepts such as down payment, rate, subsidy, or term,  
**When** these appear in the result, plan, or map,  
**Then** the system must offer direct access to the corresponding content.

---

## Notes

- The blocker detection that drives E2 reuses the `risk_codes` produced by the scoring engine ([[HU3-HybridScoring\|HU 3]]) and the improvement plan ([[HU7x-ImprovementPlan\|HU 7x]]).
- Content selection and organization is an output of **Spike 1** (financial education research).
- Concepts surfaced here (subsidies, terms) connect to the simulation stories [[HU25-SubsidySimulation\|HU 25]] and [[HU26-CreditTermSimulation\|HU 26]].
