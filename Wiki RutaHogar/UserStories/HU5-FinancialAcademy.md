# HU 5 — Contextual Financial Academy

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
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | — |

---

## User Story

> **As** a person interested in buying a home, **I want** to access educational content about mortgage credit, down payment, subsidies, rates, and property types, **in order to** better understand my options and prepare before buying.

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

- The blocker detection that drives E2 reuses the `risk_codes` produced by the scoring engine ([[HU3-HybridScoring\|HU 3]]) and the improvement plan ([[HU4-ImprovementPlan\|HU 4]]).
- Content selection and organization is an output of **Spike 1** (financial education research).
- Concepts surfaced here (subsidies, terms) connect to the simulation stories [[HU26-SubsidySimulation\|HU 26]] and [[HU29-CreditTotalCostComparator\|HU 29]].
- **Numbering note:** this story was `HU 12` under the E4 plan; the updated sprint plan renumbers it to `HU 5` (still Sprint 1).
