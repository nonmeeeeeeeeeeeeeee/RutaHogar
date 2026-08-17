# 00 — Workflow

**Status: draft, pending ratification.** Nothing here is enforced until the team approves it.

This handbook is the single source of truth for how we build ScoreLeads. If `CLAUDE.md`,
`AGENTS.md`, `.github/copilot-instructions.md`, a skill, or a comment disagrees with it, the
handbook wins and the other file is a bug.

We work in a **structured, spec-driven** way, adapted from
[Structured Prompt-Driven Development](https://martinfowler.com/articles/structured-prompt-driven/).
The core idea we take from it: **the specification is a delivery artifact** — written before the
code, reviewed like the code, and kept true afterwards. What we do *not* take is its
single-document, same-session model; we use a plan and a fresh build session instead, because
that is what has worked for us.

## The pipeline

Every story goes through all six phases. There are no fast lanes — a uniform pipeline is what
lets six people pick up each other's work mid-flight.

| # | Phase | Produces | Who |
| :- | :---- | :------- | :-- |
| 1 | **Grill** | resolved design (in-session only) | author + their agent |
| 2 | **Algorithms** | `docs/algorithms/ALG-N.md` + `ALG-N-cases.json`, new or edited | author, human-written |
| 3 | **Plan** | `docs/stories/<HU>/PLAN.md` | author |
| 4 | **Kickoff** | `docs/stories/<HU>/KICKOFF.md` (ephemeral, gitignored) | author |
| 5 | **Build** | code, in a **fresh session** | agent, in any toolchain |
| 6 | **Review** | merged PR | a reviewer who is not the author |

### 1 — Grill

Interview the design until every open decision is resolved, one question at a time. The
procedure and the question bank are in [`01-grill.md`](01-grill.md). This phase is where scope,
risk and edge cases get discovered — it is cheaper to change a decision here than anywhere
downstream.

The grill must answer the **five standing questions** ([`01-grill.md`](01-grill.md)); their
answers are recorded in the plan and checked against the diff by CI.

### 2 — Algorithms

If the story touches shared, business-consequential logic, its algorithm is written or amended
**before any code exists**, by a human, following [`05-algorithms.md`](05-algorithms.md). If any
number changes (weight, threshold, cutoff), the business owner signs it off on the PR.

The build session **implements the algorithm and never invents numbers.** If it finds the
algorithm wrong, missing, or ambiguous, it **stops and reports** — it does not improvise. That
rule is the whole reason this phase exists.

### 3 — Plan

`PLAN.md` is written from the resolved design, using
[`templates/PLAN.md`](templates/PLAN.md). It is committed on the story branch and **reviewed in
the PR alongside the code it produced** — a reviewer may reject the design, not only the code.

The plan **references** algorithms by number and never restates their rules. Two documents
cannot contradict each other if only one of them is allowed to state the rule.

### 4 — Kickoff

`KICKOFF.md` is a self-contained prompt for a fresh session. It is a paste buffer, not an
artifact: it is **gitignored** and may be regenerated or deleted at will. Never let it carry a
rule that is not in the plan or the handbook.

### 5 — Build

Build in a **new session**, started from `KICKOFF.md`. A grill session ends with a context full
of rejected options; building in it is measurably worse than starting clean.

Any toolchain is acceptable — Claude Code, Codex, Copilot, Antigravity, or hands on keyboard.
**The process binds on the artifacts and the gates, not on the tool.** Anything that produces
the artifacts in this table and passes the gates in [`03-norms.md`](03-norms.md) is compliant.

### 6 — Review

Two tiers. See [`03-norms.md`](03-norms.md) for the full gate list.

- **Tier 1 — automated.** CI must be green **before** review is requested. It is not a
  reviewer's job to notice a failing test.
- **Tier 2 — human, run by the reviewer, not the author.** Every acceptance criterion `E1…En`
  in the plan's criteria map is confirmed in the running app, and each row carries **evidence**:
  a test name, or concrete steps plus what was observed. Not a checkmark.

Self-certified acceptance criteria are how work merges with known gaps. A second person either
reproduces the criterion or cannot.

## Definition of done

A story is done when **all** of these hold:

- Tier 1 green.
- Tier 2 confirmed by a reviewer who is not the author, with evidence per criterion.
- `PLAN.md` and any `ALG-*` changes committed **in the same PR** as the code.
- The five standing questions answered, and consistent with what the diff actually touches.
- No criterion silently dropped. Dropping one is a plan edit with a stated reason.

## When reality diverges

Both directions, always inside the PR that discovers it, and never by writing a third document:

- **Intent changed** — the rule should be different: amend the handbook or the ALG doc
  **first**, in the same PR as the code. The document leads.
- **Reality diverged** — the code does something no document describes: either fix the code to
  match the document or amend the document to match reality, **in that PR**. Not a TODO, not an
  issue, not a correcting file.
- **A rule broken twice is a bad rule.** Amend or delete it; do not add enforcement.

Once per entrega, a recurring issue triggers a reconciliation pass: walk the handbook and the
ALG docs against the code and close the gaps. Slow drift is invisible day to day and obvious in
one deliberate pass.

## Where things live

| Path | Holds |
| :--- | :---- |
| `docs/handbook/` | these rules — the only binding source |
| `docs/algorithms/` | `ALG-N.md` + `ALG-N-cases.json` |
| `docs/stories/<HU>/PLAN.md` | one plan per story, git-tracked |
| `docs/stories/<HU>/KICKOFF.md` | ephemeral, **gitignored** |
| `Wiki ScoreLeads/` | product and requirements: user stories, actors, risks, entregas |
| `AGENTS.md`, `.claude/CLAUDE.md`, `.github/copilot-instructions.md` | pointers here; **no rules of their own** |

`Wiki ScoreLeads/` is the product domain and `docs/` is the engineering domain. Engineering
artifacts do not go in the wiki, and requirements do not go in `docs/`.
