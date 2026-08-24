# NFR — Immutable, Versioned Evaluation History

> ℹ️ **Non-functional requirement.** The updated sprint plan ("HUs para Sprint 1" document) lists the immutable history as a non-functional requirement ("Historial inmutable") rather than a functional user story. Kept here for reference; it was `HU 33` under the E4 plan.

Ensures every recalculation or scoring adjustment creates a new versioned, immutable evaluation linked to the previous one, preserving a faithful and traceable history that cannot be altered.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Real Estate Admin |
| **Status** | ℹ️ NFR (updated backlog) |
| **Sprint** | — |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | [[HU15-LeadFinancialEvolution\|HU 15]] |

---

## User Story

> **As** a real estate admin, **I want** every recalculation or scoring adjustment to generate a new versioned and immutable evaluation linked to the previous one, **in order to** preserve a faithful and traceable history that cannot be altered.

---

## Acceptance Criteria

### E1 — New version per recalculation

**Given** a recalculation or score adjustment occurs (debt payment [[HU13-MonthlyPlanTracking\|HU 13]], configuration change [[NFR-RolesAndPermissions\|Roles & Permissions (NFR)]]/[[HU23-ScoringParameters\|HU 23]], CMF adjustment [[HU27-ReferentialBackgroundReview\|HU 27]], subsidy simulation [[HU26-SubsidySimulation\|HU 26]]),  
**When** the system updates the evaluation,  
**Then** it must create a new versioned evaluation record instead of modifying the existing one.

---

### E2 — Immutability and lineage

**Given** a previous evaluation exists,  
**When** its successor is generated,  
**Then** the previous record must remain immutable (no UPDATE or DELETE) and be linked to the new version.

---

### E3 — Record traceability

**Given** an evaluation is persisted,  
**When** it is saved,  
**Then** it must include timestamp, `scoring_version`, snapshot of the input data, and the reason for the recalculation.

---

### E4 — Consistency with auditing

**Given** an executive/admin consults the history via [[NFR-EvaluationAudit\|Evaluation Audit (NFR)]],  
**When** they review an evaluation,  
**Then** they must be able to reconstruct the chain of versions in chronological order with its reason.

---

## Notes

- Extends the immutable-record requirement of [[HU3-HybridScoring\|HU 3]] E5 into a full version chain.
- Maps to the `evaluations` table with a self-referencing lineage link — see [[../Database/evaluations\|evaluations]].
- Supports the RNF **Traceability** attribute and pairs with the auditing story [[NFR-EvaluationAudit\|Evaluation Audit (NFR)]].
- **Cross-reference note:** the E4 source referenced "HU41" and "HU15" in this story's E1; these are corrected here to HU 31 (CMF) and HU 16 (audit) respectively — the actual matching stories.
