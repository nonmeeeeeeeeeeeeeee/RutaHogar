# HU 33 — Immutable, Versioned Evaluation History

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Ensures every recalculation or scoring adjustment creates a new versioned, immutable evaluation linked to the previous one, preserving a faithful and traceable history that cannot be altered.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Real Estate Admin |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU16-EvaluationAudit\|HU 16]] |
| **Required by** | [[HU8-MonthlyPlanTracking\|HU 8]], [[HU15-ScoringParameters\|HU 15]], [[HU18-LeadFinancialEvolution\|HU 18]], [[HU25-SubsidySimulation\|HU 25]], [[HU31-SimulatedCMFQuery\|HU 31]] |

---

## User Story

> **As** a real estate admin, **I want** every recalculation or scoring adjustment to generate a new versioned and immutable evaluation linked to the previous one, **in order to** preserve a faithful and traceable history that cannot be altered.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU3-HybridScoring\|HU 3]]** — This story's note: *"Extends the immutable-record requirement of HU 3 E5 into a full version chain."*  `documented`

- **[[HU16-EvaluationAudit\|HU 16]]** — E4 requires an admin to reconstruct the version chain "via HU 16". Previously declared only by HU 16's `Required by`; confirmed from this side 2026-08-08.  `documented · B11`

---

## Acceptance Criteria

### E1 — New version per recalculation

**Given** a recalculation or score adjustment occurs (debt payment [[HU8-MonthlyPlanTracking\|HU 8]], configuration change [[HU14-RolesAndPermissions\|HU 14]]/[[HU15-ScoringParameters\|HU 15]], CMF adjustment [[HU31-SimulatedCMFQuery\|HU 31]], subsidy simulation [[HU25-SubsidySimulation\|HU 25]]),  
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

**Given** an executive/admin consults the history via [[HU16-EvaluationAudit\|HU 16]],  
**When** they review an evaluation,  
**Then** they must be able to reconstruct the chain of versions in chronological order with its reason.

---

## Notes

- Extends the immutable-record requirement of [[HU3-HybridScoring\|HU 3]] E5 into a full version chain.
- Maps to the `evaluations` table with a self-referencing lineage link — see [[../Database/evaluations\|evaluations]].
- Supports the RNF **Traceability** attribute and pairs with the auditing story [[HU16-EvaluationAudit\|HU 16]].
- **Cross-reference note:** the E4 source referenced "HU41" and "HU15" in this story's E1; these are corrected here to HU 31 (CMF) and HU 16 (audit) respectively — the actual matching stories.
