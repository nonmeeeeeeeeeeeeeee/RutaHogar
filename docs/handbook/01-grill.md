# 01 — The grill

**Status: draft, pending ratification.**

The grill is the design phase. Its output is a resolved design, recorded in `PLAN.md` — it
produces no file of its own.

It is written here as a **procedure**, not a tool feature, so it runs the same on Claude Code,
Codex, Copilot or Antigravity. Some agents have a skill for it (`.claude/skills/`); the skill is
a convenience, and if it disagrees with this file, the skill is wrong.

## How to run it

1. **Read first, ask second.** Anything answerable from the repository must be answered by
   reading the repository. A grill that asks what the code already says wastes the one resource
   the design phase has: the author's attention.
2. **One question at a time.** A list of eight questions gets one answer.
3. **Every question carries a recommended answer** and the reasoning behind it. "What do you
   want?" is not a grill; "here is what I would do and why — do you agree?" is.
4. **Walk the tree in dependency order.** Resolve the decision that constrains other decisions
   first. If an answer invalidates something already settled, say so and reopen it.
5. **Stop when no branch is unresolved** — not when the author sounds tired. Then restate the
   resolved design and get confirmation before writing the plan.
6. **Disagree when the evidence disagrees.** The value of the grill is that a bad assumption
   dies here rather than in review.

## The five standing questions

Every story answers all five. They are recorded as one line each in `PLAN.md`, and **CI checks
the answers against the diff** — answering "no" to a question the diff contradicts fails the
build.

| #   | Question                                                             | Why it is standing                                                                                                                     |
| :-- | :------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Does it touch scoring?** Which `ALG-N`, and do any numbers change? | A changed number changes what leads are told and which ones executives see. The developer decides it, but it must be recorded as a stated assumption, never as a silent edit. |
| 2   | **Does it need RLS or multi-tenant scoping?**                        | Leads are personal financial data belonging to a specific inmobiliaria. A missing policy is a data leak, not a bug.                    |
| 3   | **Does it need a database migration, and who applies it?**           | Migrations are **not** auto-applied to hosted Supabase. An unapplied migration is a story that passes review and breaks production.    |
| 4   | **Does it change the `POST /score` contract?**                       | The contract is frozen ([`04-safeguards.md`](04-safeguards.md)). Changing it is a deliberate, separately-approved act.                 |
| 5   | **What is the consent / privacy impact?**                            | We hold financial data under explicit consent, with ARCO obligations. New fields, new storage and new exports all change that surface. |

## Question bank

Not a checklist to recite — a floor. Skip what the repository already answers; follow anything
that turns out to be load-bearing.

### Scope and intent
- What does this story make possible that is impossible today? Who is the actor?
- Which acceptance criteria (`E1…En`) exist, and is each one observable by a second person?
- What is deliberately *out* of scope, and which guardrail or story owns it instead?
- Does any dependency (`Depends on`) not exist yet? What does the plan assume about it?

### Entities and contracts
- Which tables, columns, RLS policies or endpoints does this touch or add?
- Does it change data anyone has already stored? Is a migration needed, and who applies it?
- What is the shape of the data crossing each boundary — form, service, endpoint, database?
- If a migration is needed: is it reversible, what happens to rows that already exist, and who
  runs `supabase db push` against the hosted project?

### Algorithms
- Is there logic here that someone will want to tune later? Then it is an algorithm
  ([`05-algorithms.md`](05-algorithms.md)), not an implementation detail.
- Is it new, or does it amend an existing `ALG-N`?
- Where does each number come from — a regulator, a bank's published criteria, a client
  statement, or a developer judgment? A judgment is an **assumption** and gets logged as one.
- Which invariants must hold for every possible input?

### Architecture
- Where do the new files go under [`02-architecture.md`](02-architecture.md)?
- Does any logic belong in `src/lib/` (pure, testable) rather than in a component?
- Does this need a cross-feature import? If yes, the shared piece belongs in `lib/` or
  `shared/` — features never import each other.

### Verification
- How is each criterion verified: automated test, fixture case, or reviewer steps?
- What would a reviewer have to do to be convinced? Is that reasonable to ask?
- What could break silently — something no existing test would catch?

### Risk
- What is the worst outcome if this ships wrong? Who notices — the user, the executive, or the
  client?
- Is there anything here we cannot undo once it is in production data?
- Which in-flight branches touch the same files, and does this need coordination?

## Recording the outcome

The grill leaves no file. Everything decided in it that still matters afterwards goes into
`PLAN.md`: the five answers, the resolved decisions **with their rationale**, and any assumption
the build session will be relying on.

A decision whose reasoning was not recorded will be re-litigated in three weeks by someone who
was not in the session.
