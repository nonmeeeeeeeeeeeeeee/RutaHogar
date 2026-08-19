# ALG-<N> — <name>

| Field | Value |
| :---- | :---- |
| **Version** | matches `ALGORITHM_VERSION` in `backend/app/scoring_engine/constants.py` |
| **Runs on** | backend / frontend |
| **Implemented in** | `backend/app/scoring_engine/<module>.py` |
| **Cases** | `docs/algorithms/ALG-<N>-cases.json` |
| **Open assumptions** | count — see the assumptions log below |
| **Last changed** | YYYY-MM-DD · PR #… · what changed and why |

## Purpose

What this computes, when it runs, and what depends on its output. One paragraph.

## Inputs → outputs

- **Inputs:** named fields with their types and units. State whether values are CLP, UF, ratios
  or percentages — most defects in financial logic are unit confusion.
- **Outputs:** the exact shape returned, including every possible value of any enumerated field.

## Rules

The sign-off surface. Every threshold, weight and cutoff as a row. Readable by someone who does
not read Python.

| Condition | Effect | Code | Message shown |
| :-------- | :----- | :--- | :------------ |
| `ratio_dividendo_ingreso <= 0.25` | 100 pts | — | — |
| … | … | … | … |

**Source of the numbers:** where each threshold comes from — a regulator, a bank's published
criteria, a client decision, or a developer judgment. A number with no stated source is a number
nobody can defend when the client asks. Every judgment gets a row below.

## Assumptions log

Numbers we decided ourselves. Logging one does not block the merge; **not** logging one is a
review failure.

| Assumption | Made by | Date | Would be wrong if | Status |
| :--------- | :------ | :--- | :---------------- | :----- |
| | | | | open / confirmed / changed |

## Invariants

What holds for **every** input, and is asserted by tests rather than by fixture values:

- output is clamped to its documented range;
- a blocker never *raises* a classification;
- the same input always produces the same output (no time, randomness or AI in the path).

## Edge cases

Missing data, zero income, absent comuna, unknown contract type, conflicting declarations. What
happens, and why that is the right answer rather than an error.

## Why it is this way

The reasoning a future reader needs in order to change it safely — what was tried, what was
rejected, and what constraint produced the current shape.

## Changes

| Date | PR | Change | Assumptions added / closed |
| :--- | :- | :----- | :------------------------- |
| | | | |
