# 05 — Algorithms

**Status: draft, pending ratification.** The ALG documents themselves do not exist yet; this
file defines how they are written. Seeding them is phase 1 work.

An **algorithm** here is business logic with numbers in it that someone will eventually want to
argue about. Governing it means: the rule is written and approved **before** it is implemented,
the numbers have an owner, and the document and the code cannot silently disagree.

## What gets an ALG document

A rule gets `docs/algorithms/ALG-N-<slug>.md` if **any** of these hold:

- it is business-consequential (it changes what a lead is told, or which leads an executive
  sees);
- it has tunable numbers — weights, thresholds, cutoffs, ratios;
- it has more than one consumer.

In practice that is everything in `backend/app/scoring_engine/`, plus classification and
commercial priority.

Everything else is **story-local logic**: it stays inline in `PLAN.md` under *Local logic*, gets
no ALG number, and never leaves the story. A dashboard sort order, a form's field-enable
cascade, a copy-selection rule.

**Promotion:** when story-local logic gains a second consumer, the PR that adds the second
consumer promotes it to `docs/algorithms/`. The old plan is left untouched — it is history, not
a live document.

## Planned set

Seeded from the existing engine. `backend/app/REGLAS_SCORING.md` — which already translates the
engine into structured Spanish rules with CMF and BancoEstado sources — is the **primary source
material for ALG-1 and ALG-3** and is absorbed into them rather than maintained alongside.

| ID | Covers | Module |
| :- | :----- | :----- |
| ALG-1 | component scoring + weights | `components.py`, `constants.py` |
| ALG-2 | blockers and severities | `blockers.py` |
| ALG-3 | classification thresholds, clamping, blocker downgrade | `constants.py`, orchestrator |
| ALG-4 | commercial priority and actions | `commercial_priority.py` |
| ALG-5 | project fit | `project_fit.py` |
| ALG-6 | property value / UF resolution | `property_value.py` |
| ALG-7 | improvement plan generation | `improvement_plan.py` |

## The format

Three layers in one document, plus a fixture file. Each layer exists because the others cannot
do its job. Template: [`templates/ALG-N.md`](templates/ALG-N.md).

### 1. Header — narrative

Purpose and trigger · runs on (backend/frontend) · inputs → outputs · **version** · **owner and
sign-off** · invariants · edge cases · why it is this way.

This is the part that survives a rewrite. Prose alone drifts, which is why it is not the only
layer.

### 2. Table — the rules

Every threshold, weight and cutoff as rows: condition → effect → code → message.

This is the **sign-off surface**. It is read by people who do not read Python, and a change to
it is legible in a diff: *this row went from 55 to 60*.

### 3. Fixtures — the teeth

`docs/algorithms/ALG-N-cases.json`: representative inputs with expected outputs, asserted by the
backend suite.

This is what makes it governance. Change a weight without changing its document and **the build
goes red**. Without this layer the document is description, and description drifts — the state
the project is in today, where one threshold exists in three places with two different values.

## Rules

1. **Written before the code.** The ALG document and its fixtures are authored in the design
   phase, by a human, and committed on the story branch before a build session exists.
2. **The build session implements it and never invents numbers.** If the algorithm is wrong,
   missing or ambiguous, it **stops and reports**. It does not improvise a threshold.
3. **The plan references, never restates.** A plan says *"Step 4 implements ALG-3; no threshold
   changes"* or *"Step 4 modifies ALG-3 — see the updated document in this PR"*. Two documents
   cannot contradict each other if only one may state the rule.
4. **Numbers have a business owner.** Any changed weight, threshold or cutoff is signed off by
   the CFO on the PR before merge.
5. **Every tunable lives in `constants.py`, once.** A literal threshold inside a function is a
   defect even when the value is right.
6. **The document leads.** Changing behavior means editing the ALG document in the same PR.
   Discovering that code and document already disagree means fixing one of them in the PR that
   found it — never writing a third document.
7. **Version on every change.** `ALGORITHM_VERSION` in `constants.py` matches the versions
   recorded in the ALG documents, and moves when a rule changes.

## Known drift to resolve when seeding

Recorded so the first author does not rediscover it:

- **Classification thresholds exist in three places with two values.** The engine hardcodes
  `>= 75` / `>= 50`; `CLASSIFICATION_THRESHOLDS` in `constants.py` says the same but **nothing
  imports it**; `CLAUDE.md` documents `>= 70` / `>= 40` from the retired additive model. ALG-3
  establishes the true value, and whether 70 was ever quoted to the client.
- **`"Requiere antecedentes"`** is returned by the engine, documented nowhere, and not
  enumerated by the executive dashboard's classification filter.
- **`ALGORITHM_VERSION = "1.1.0-prep"`** with a comment saying the layers are not integrated,
  while the orchestrator imports and calls all nine of them. `REGLAS_SCORING.md` meanwhile
  documents version `1.0.1`. One of these is true.
- **`REGLAS_SCORING.md` lives on `main` only**, not on `develop`, and names the product
  *RutaHogar*.
