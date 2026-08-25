# HU 8 — Monthly Improvement-Plan Tracking

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Lets a lead with an active improvement plan record monthly financial progress, see whether they are on track, and have their score recalculated as milestones are met.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU7-ImprovementPlan\|HU 7]], [[HU33-ImmutableEvaluationHistory\|HU 33]] |
| **Required by** | — |

---

## User Story

> **As** a lead with an active improvement plan, **I want** to record my monthly financial progress and update my situation, **in order to** know whether I am advancing correctly toward my real estate objective.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU7-ImprovementPlan\|HU 7]]** — E1 records progress against "an active plan"; the plan and its debt/savings goals are HU 7 E5–E7. HU 7's note: *"Debt/savings goals (E5–E7) are tracked over time in HU 8."*  `documented`

- **[[HU33-ImmutableEvaluationHistory\|HU 33]]** — E4 recalculates the score on milestone completion, and this story's note requires that recalculation to "produce a new versioned evaluation rather than mutate the prior one". HU 33 E1 names "debt payment HU 8" as a trigger from its side.  `documented · B2`

---

## Acceptance Criteria

### E1 — Monthly progress recording

**Given** the user has an active plan,  
**When** they record paid debts or amount saved,  
**Then** the system must update their monthly progress and show whether they are ahead, on schedule, or behind relative to their plan.

---

### E2 — Eligibility projection

**Given** the user updates their financial progress,  
**When** the system recalculates their situation,  
**Then** it must show an estimated date of eligibility or approach to the objective.

---

### E3 — Plan status update

**Given** the user has an active improvement plan,  
**When** they record progress, complete milestones, or miss planned activities,  
**Then** the system must update the plan status using states such as "Not started", "In progress", "Partial progress", "Completed", or "Needs adjustment".

---

### E4 — Recalculate scoring on milestone completion

**Given** the user records the completion of a financial milestone (debt payment or increased savings),  
**When** the system validates that progress,  
**Then** it must recalculate the financial score and update the user's classification if applicable.

---

### E5 — Milestone entry and validation

**Given** the user wants to record progress within their improvement plan,  
**When** they enter a financial milestone such as paid debt, accumulated savings, or improved employment continuity,  
**Then** the system must validate that the entered data is consistent, positive, and does not contradict previously registered financial information.

---

## Notes

- Milestones and goals map to the `improvement_goals` table — see [[../Database/improvement_goals\|improvement_goals]].
- Recalculations (E4) must produce a new versioned evaluation rather than mutate the prior one — see [[HU33-ImmutableEvaluationHistory\|HU 33]].
- Frontend counterparts: `FinancialTracking.jsx`, `MonthlyPlan.jsx`.
