# HU 15 — Scoring Parameter Configuration

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning.

Lets a real estate admin modify the parameters used by the scoring engine, adapting the leads shown to their executives to what the organization is looking for.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Optional |
| **Story Points** | 5 |
| **Actor** | Real Estate Admin |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU33-ImmutableEvaluationHistory\|HU 33]] |
| **Required by** | — |

---

## User Story

> **As** a real estate admin, **I want** to modify the parameters used by the scoring engine, **in order to** adapt the leads shown to my sales executives to what we are looking for as an organization.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU3-HybridScoring\|HU 3]]** — E1 and E2 expose and persist "the parameters used by the engine". This story's note: *"Externalizes the rule weights currently hard-coded in `backend/app/scoring.py`."*  `documented`

- **[[HU33-ImmutableEvaluationHistory\|HU 33]]** — This story's note: *"A parameter change is a recalculation trigger for HU 33."* E3 applies new parameters to later evaluations, which must be versioned rather than overwritten.  `documented · B5`

---

## Acceptance Criteria

### E1 — Parameter visualization

**Given** the real estate admin accesses the scoring panel,  
**When** they consult the configuration,  
**Then** they must see the parameters used by the engine.

---

### E2 — Authorized modification

**Given** the real estate admin modifies a parameter,  
**When** they save the changes,  
**Then** the system must validate and persist the new configuration.

---

### E3 — Future application

**Given** new parameters are configured,  
**When** later evaluations are performed,  
**Then** the system must use the current configuration.

---

## Notes

- Externalizes the rule weights currently hard-coded in `backend/app/scoring.py`. Per project guardrails, `PRECIOS_REFERENCIA_UF` and scoring rules must not be changed without business context — this story adds a controlled, admin-facing path to do so.
- A parameter change is a recalculation trigger for [[HU33-ImmutableEvaluationHistory\|HU 33]].
