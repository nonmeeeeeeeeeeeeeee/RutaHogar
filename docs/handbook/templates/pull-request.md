<!--
Draft of .github/pull_request_template.md — moved there at ratification.
-->

## What and why

<!-- One paragraph. What changes, and what it makes possible. -->

**Story:** HU <N> — <title> · **Plan:** `docs/stories/HU<N>/PLAN.md`

## Standing questions

<!-- Copied from the plan. CI checks these against the diff. -->

| # | Question | Answer |
| :- | :------- | :----- |
| 1 | Touches scoring? Which ALG, numbers changed? | |
| 2 | Needs RLS / multi-tenant scoping? | |
| 3 | Works without Supabase? | |
| 4 | Changes the `POST /score` contract? | |
| 5 | Consent / privacy impact? | |

## Author checklist

- [ ] `PLAN.md` is committed in this PR.
- [ ] `ALG-*` documents and their `cases.json` updated, if shared logic changed.
- [ ] Any changed **number** flagged for CFO sign-off below.
- [ ] Commits are conventional, and each one either moves files **or** changes behavior.
- [ ] Tier 1 is green — I did not request review on a red build.
- [ ] Every acceptance criterion is implemented; none silently dropped.

## Reviewer checklist (Tier 2)

<!-- Run against the app, not the diff. Evidence, not checkmarks. -->

| Criterion | Verified how | Result |
| :-------- | :----------- | :----- |
| `E1` — … | steps taken / test run | |
| `E2` — … | | |

- [ ] The plan's design is sound, not only the code.
- [ ] Standing-question answers match what the diff actually touches.
- [ ] Safeguards in `docs/handbook/04-safeguards.md` intact.

## Sign-off

<!-- Required only when a weight, threshold or cutoff changed. -->

- [ ] **CFO** — the values in the ALG rules table are correct: @<user>
- [ ] **CTO** — code review of `scoring_engine/` changes: @<user>
