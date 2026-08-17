# 03 — Norms

**Status: draft, pending ratification.** Gates marked *(planned)* do not exist yet; they land in
phase 2 and are turned on gradually.

## Language

| Artifact | Language |
| :------- | :------- |
| Handbook, `PLAN.md`, `ALG-N.md`, commit subjects, code identifiers | **English** |
| Wiki product docs, informes de entrega, UI copy | **Spanish** |
| Domain vocabulary, everywhere, in every language | **Spanish, never translated** |

`ingreso_mensual`, `deuda_mensual`, `clasificacion`, `tipo_contrato`, `Alto` / `Medio` / `Bajo`
/ `Requiere antecedentes` keep their Spanish names in English documents and in code. Generic
programming constructs stay English (`handleSubmit`, `calculate_score`, `clamp`).

Client-facing sign-off is Spanish, delivered as a **summary in the entrega** — never a Spanish
duplicate of an English document. Two language versions of one rule is two rules.

## Branches

- **`develop`** — integration. Everything is PR'd into it; CI gates it.
- **`main`** — deployable. Vercel deploys production from it. Promoted from `develop` **at each
  entrega, plus hotfixes**. Nothing else moves it.
- **One branch per story**: `feat/hu17-project-catalog`, `fix/…`, `docs/…`, `refactor/…`,
  `chore/…`.
- **No per-person branches.** A branch scoped to a person rather than a story cannot have a
  definition of done, and accumulates unrelated work that cannot be reviewed as a unit.

## Commits

Conventional commits, checked in CI *(planned)*:

```
feat|fix|docs|refactor|chore|test(scope): subject
```

- Subject in English; Spanish domain terms kept verbatim
  (`feat(scoring): ajustar umbral de clasificacion Alto`).
- **A commit either moves a file or changes behavior — never both.** `refactor:` asserts no
  behavior change, and is therefore machine-checkable and review-cheap.
- Imperative, one concern, no trailing period. If the subject needs "and", it is two commits.

## Pull requests

- Base `develop` (except the entrega promotion, which is `develop` → `main`).
- **1 approving review required.**
- **Reviewer is never the author.** Rotating pool, claimed first-come.
- **Exception — PRs touching `scoring_engine/`, an `ALG-*` doc, or the `POST /score` contract:**
  the CTO reviews the code, and if any *number* changed, the CFO signs off on the ALG table in a
  PR comment. Signing off is a business act, not a code review: it does not require reading
  Python.
- The PR carries the checklist in [`templates/pull-request.md`](templates/pull-request.md).

## Gates

**Tier 1 — automated, green before review is requested** *(planned; phase 2)*:

| Gate | Covers |
| :--- | :----- |
| `pytest` | engine behavior, golden fixtures, every `ALG-N-cases.json` |
| `eslint` | frontend correctness + the feature-import rule |
| `vitest` | `src/lib/` pure logic |
| Playwright ×3 | anon evaluation → result; login → executive dashboard; onboarding → profile history |
| commit lint | conventional commits |
| ALG path check | a diff touching `scoring_engine/` with no `ALG-*` change is flagged |
| standing-question check | a plan answer contradicted by the diff fails |

**Tier 2 — human, run by the reviewer.** Every criterion `E1…En` confirmed in the running app,
with evidence recorded in the PR: a test name, or steps plus what was observed.

Gates are enabled in three steps: **reporting only → blocking → approvals required**. Turning
them all on at once, on top of in-flight branches, teaches the team that the process is the
thing that broke everything.

## Testing

- **Golden fixtures** (`backend/tests/golden/`) freeze full `POST /score` responses for
  representative payloads. They exist so a refactor can be *proved* behavior-preserving.
- **ALG cases** (`docs/algorithms/ALG-N-cases.json`) are asserted by the suite. Changing a
  number without changing its document turns the build red. This is what makes an algorithm
  document governance rather than description.
- **Tests assert invariants, not literals**, wherever possible — clamping, monotonicity,
  ordering, "a blocker always lowers the classification". Retuning a number should not require
  rewriting the suite; changing behavior should.
- **`src/lib/` is unit-tested; components are not**, unless a component holds logic that should
  have been in `lib/`. Tests against 1,000-line components are expensive, brittle, and get
  discarded by the next refactor.

## Secrets and configuration

- No API keys, tokens or credentials in source. Ever, including in examples.
- No bank credentials or sensitive documents stored, in any form.
- Every environment variable is optional for local development. The project runs with an empty
  environment.

## Amending this handbook

- A PR labeled `docs(handbook):`, one approval, like anything else.
- It must state **what changed in reality** that motivates the amendment. No amendment without a
  cause — that is what stops it growing into forty pages of accumulated opinion.
- **Any norm CI can check, CI checks.** A norm nobody can check and no reviewer looks for is
  deleted at the next amendment; decoration makes the enforceable rules look optional too.
