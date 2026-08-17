# 04 — Safeguards

**Status: draft, pending ratification.** Tests marked *(planned)* land in phase 2.

Safeguards are non-negotiable. They are not preferences, and they are not resolved by a grill —
a story that needs one relaxed is a conversation with the team and the client, not a plan
decision.

Each one names the test that proves it. **A safeguard without a proof is an intention**, so any
safeguard here that cannot be checked either gets a test or gets rewritten into something that
can be.

## S1 — The AI never decides the score

The score is computed by auditable rules. The AI writes explanations, executive summaries and
commercial guidance **from an already-computed result**. It never calculates, adjusts, reorders
or overrides a score, a classification, a blocker or a priority.

*Proof:* `test_score_does_not_require_groq_api_key` — scoring succeeds with no API key present.
Extend to assert the score is byte-identical with and without AI enabled *(planned)*.

*Why:* it is what makes the result explainable, reproducible and defensible to a client whose
commercial decisions depend on it.

## S2 — The `POST /score` contract is frozen

Field names, types, accepted values and response shape do not change as a side effect of another
story. Changing the contract is its own story, with its own approval, and both sides ship
together.

*Proof:* golden fixtures in `backend/tests/golden/` — a changed response shape fails *(planned)*.

## S3 — Scoring is rules, not machine learning

No trained model computes or adjusts a score. The engine stays a versioned, readable rule set
with every tunable in `constants.py`.

*Proof:* review, plus the ALG path check — a `scoring_engine/` diff with no `ALG-*` change is
flagged *(planned)*.

## S4 — The score is clamped to [0, 100] and always classified

Every response carries a score within range and exactly one classification value from the
documented set. No `null`, no out-of-range value, no undocumented class.

*Proof:* invariant tests over the engine + `ALG-N-cases.json` *(planned)*.

*Open:* the engine can also return **`"Requiere antecedentes"`**, which is not in the
documented set and is not enumerated by the executive dashboard's filter. ALG-3 resolves whether
it is a designed fourth class or a leak.

## S5 — Financial data is held under explicit consent

`consentimiento` must be `true` for an evaluation to be computed or stored. No external
financial data is consulted without explicit consent and approved scope — no CMF, no Dicom, no
bank, no credit bureau. ARCO requests (access, rectification, cancellation) remain serviceable
for every stored profile.

*Proof:* contract validation on `POST /score`; ARCO flow covered by a Playwright journey
*(planned)*.

## S6 — Leads are scoped to their inmobiliaria

Personal financial data is visible only to the organization it belongs to. Every table holding
lead or profile data has an RLS policy, and a new table without one does not ship.

*Proof:* standing question 2 in `PLAN.md`, checked against the diff *(planned)*.

## S7 — The system does not approve credit

RutaHogar produces an orientative pre-qualification. It does not approve, pre-approve or
guarantee a mortgage, does not replace a formal bank evaluation, and does not give personalized
financial advice. Every user-facing surface that shows a score says so.

*Proof:* copy review; the disclaimer is part of the result view's acceptance criteria.

## S8 — No credentials in source, and no sensitive documents stored

No API keys or tokens in the repository. No bank credentials, no uploaded identity or income
documents, no OCR pipeline. Every environment variable is optional locally.

*Proof:* secret scanning on PRs *(planned)*; review.

## Out of scope until explicitly commissioned

Not safeguards — scope limits, recorded here so a grill does not quietly adopt one:

- CRM integration; stress/rate simulation beyond documented stories
- New authentication systems (one exists)
- External APIs: CMF, Dicom, banks, credit bureaus
- Document OCR; trained ML models for scoring
