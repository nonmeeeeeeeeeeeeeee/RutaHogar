# PLAN — HU8: Detector de beneficios habitacionales aplicables

- **Story:** HU8 — Detector de beneficios habitacionales aplicables
- **Actor:** Lead
- **Source story:** `Wiki RutaHogar/UserStories/HU8-MonthlyPlanTracking.md` (numbering collision — see Resolved Decisions)
- **Status / Sprint:** Pendiente · Sprint 2 · 5 SP
- **Depends on / Required by:** HU3 (Scoring híbrido) — implemented
- **Branch:** `feat/hu8-housing-benefits`

---

## Standing questions

| # | Question | Answer |
| :- | :------- | :----- |
| 1 | Touches scoring? Which ALG, numbers changed? | No. The detector is a pure function that appends `housing_benefits` to the response. No score, classification or blocker changes. No ALG amendment. |
| 2 | Needs RLS / multi-tenant scoping? | No. No new tables. Reads from existing evaluation data already scoped to the user. |
| 3 | Needs a migration? Who applies it to hosted Supabase? | No. No schema changes. |
| 4 | Changes the `POST /score` contract? | No. Adds a new optional field `housing_benefits` to the response. Existing fields are unchanged. Per S2, adding a field is additive; changing existing fields is what is frozen. |
| 5 | Consent / privacy impact? | No new consent. Uses data the user already provided (vivienda_nueva, ahorro, property value, income, comuna). No external data sources consulted. |

> CI checks these against the diff. An answer contradicted by the files touched fails the build.

## Goal

When a lead completes a scoring evaluation, the system detects whether their profile might be compatible with housing benefits (FOGAES for phase 1) and shows a referential indication in the recommendations view. This gives the lead an alternative financing path to explore without guaranteeing approval, and without modifying their score.

## Approach

A new pure function `detect_housing_benefits` in `scoring_engine/housing_benefits.py` evaluates FOGAES eligibility rules against the existing profile data. It runs after the scoring pipeline and appends a `housing_benefits` object to the result. The frontend reads this field and renders a new section in `Recommendations.jsx` with the benefit details and a disclaimer. No score modification, no new form fields, no migration.

## Entities

- **New module:** `backend/app/scoring_engine/housing_benefits.py` — pure function, no I/O
- **Modified:** `backend/app/scoring.py` — imports and calls `detect_housing_benefits`, adds result to response dict
- **Modified:** `frontend/src/services/recommendationService.js` — passes `housing_benefits` through to the build output
- **Modified:** `frontend/src/components/Recommendations.jsx` — new "Beneficios habitacionales" section
- **No new tables, no migration, no new API fields in the request contract**

## Algorithms

No ALG amendment. The FOGAES detection rules are:

- `vivienda_nueva == True` AND `property_value_uf <= 4000` AND `pie_ratio >= 0.10` → eligible
- `vivienda_nueva == False` → not eligible (new-home subsidy paths do not apply)
- `pie_ratio < 0.10` → not eligible yet (subsidy may help after reaching minimum viable pie)

These are documented as assumptions in the Resolved Decisions section. The thresholds come from the research document (`scoring_improvement_recommendations.md`, section 4) and the FOGAES published parameters (UF 4,500 cap per Spike 1 research).

### Local logic

- The `housing_benefits` field is always present in the response (empty list if no benefits apply).
- Each benefit carries `type`, `name`, `eligible` (bool), `conditions_met` (list of strings), `conditions_not_met` (list of strings), and `notes` (human-readable).
- A `summary` and `disclaimer` field are always present regardless of eligibility.

## In scope

- FOGAES detection for new housing (vivienda_nueva, price cap, pie ratio)
- Display in Recommendations.jsx with disclaimer
- Pure function with deterministic output

## Out of scope

- DS19 subsidy detection (future story)
- Subsidio a la tasa detection (future story)
- Score modification based on benefits (research says: soften recommendations, not boost scores)
- New form fields for benefit interest (HU25 owns the simulation UI)
- Any external API calls for benefit verification

## Assumptions / unmet dependencies

- The FOGAES UF 4,500 cap is assumed from Spike 1 research. If the actual cap differs, the constant in `housing_benefits.py` must be updated.
- The `vivienda_nueva` field is already collected in the form (HU3). If it is not populated, the detector returns no benefits (graceful degradation).
- The `property_value_uf` is computed by the indicators layer. The detector uses it from `financial_indicators`.

## Steps

1. Create `backend/app/scoring_engine/housing_benefits.py` with `detect_housing_benefits(data, financial_indicators)` returning the structured benefits object.
2. Add FOGAES constants to `backend/app/scoring_engine/constants.py`: `FOGAES_MAX_PROPERTY_UF = 4000`, `FOGAES_MIN_PIE_RATIO = 0.10`.
3. Import and call `detect_housing_benefits` in `backend/app/scoring.py` after the existing pipeline (after line 870), add `housing_benefits` to the result dict.
4. Update `frontend/src/services/recommendationService.js` to pass `housing_benefits` from `evaluation.result` into the build output.
5. Add the "Beneficios habitacionales aplicables" section in `frontend/src/components/Recommendations.jsx`, between the project fit section and the recommendations grid.

## Acceptance criteria map

| Criterion | Step(s) | Verified by |
| :-------- | :------ | :---------- |
| `E1` — Dado que el usuario tiene una evaluación financiera, cuando revise su resultado, entonces el sistema debe indicar si existe una posible ruta de beneficio habitacional aplicable. | 1, 2, 3, 4, 5 | Reviewer: score a profile with vivienda_nueva=true, property<=4000 UF, pie>=10%, verify FOGAES section appears in Recommendations. |
| `E2` — Dado que los beneficios dependen de requisitos externos, cuando se muestre una sugerencia, entonces debe aclararse que es referencial y no garantiza aprobación. | 5 | Reviewer: verify disclaimer text "Esta información es referencial y no garantiza aprobación" renders below the benefits section. |

## Safeguards

- **S1 (AI never decides the score):** The detector is a pure function. It does not call AI. It does not modify the score. The AI explanation is generated independently.
- **S2 (POST /score contract frozen):** Existing fields unchanged. `housing_benefits` is an additive field in the response.
- **S4 (Score clamped to [0,100]):** Score is not touched by this story.
- **S7 (System does not approve credit):** Disclaimer rendered in the UI. The `disclaimer` field is always present in the API response. Copy reviewed.

## Definition of done

- Tier 1 green: pytest (incl. golden + ALG cases) · eslint · vitest · Playwright journeys.
- Tier 2 confirmed by a reviewer who is not the author, with evidence per criterion.
- This plan and any `ALG-*` changes committed in the same PR as the code.
- No criterion silently dropped.

## Resolved decisions

| Decision | Rationale |
| :------- | :-------- |
| Advisory-only: detector does not modify the score | Research (scoring_improvement_recommendations.md, section 4) says subsidies should soften recommendations, not boost scores. A score change would require an ALG amendment and reconciliation with the client. |
| FOGAES-only for phase 1 | FOGAES has the most documented parameters (UF cap, LTV, new-home requirement). DS19 and others can follow in a separate story with their own detection rules. |
| UI in Recommendations.jsx, not Result.jsx | Benefits are orientation content, not immediate score feedback. The Recommendations page already has sections for project fit, factors, and improvement plan. Keeps Result.jsx clean. |
| No new form fields | All required data (vivienda_nueva, ahorro, property value, income, comuna) is already collected in the ScoreRequest model. No user-facing changes to the form. |
| FOGAES UF cap = 4000 | From research document section 4: `precio_propiedad_uf <= 4000`. Assumed from published FOGAES parameters. Logged as assumption for reconciliation. |
| PIE minimum ratio = 0.10 | From research: `pie_ratio >= 0.10` is the threshold where FOGAES becomes relevant. Below 10%, the user needs to build savings first. |
| Additive response field, not a contract change | S2 freezes existing fields. Adding a new optional field is additive and does not break existing consumers. |
| HU8 numbering collision | The wiki uses HU8 for "Monthly Improvement-Plan Tracking". This story reuses HU8 for "Detector de beneficios habitacionales" per the docs/stories convention. The wiki entry should be renumbered to avoid confusion, but that is out of scope for this story. |
