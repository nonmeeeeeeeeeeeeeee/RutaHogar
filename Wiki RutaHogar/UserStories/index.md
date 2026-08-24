# User Stories — RutaHogar

All user stories for the RutaHogar platform, following the **updated sprint-plan numbering** from the *"HUs para Sprint 1"* document (`HU 1–29`, continuous across sprints).

> **Numbering note:** the backlog was renumbered again with respect to the E4 plan (`HU 1–33`). Files now carry the new IDs. Capabilities that the updated plan treats as **non-functional requirements** live under `NFR-*`; stories absent from that document live under `OutOfBacklog-*`. A full old→new mapping is in the [appendix](#appendix--e4--updated-numbering-map).

**Status legend:** ✅ Implemented (PMV) · 🔜 Sprint 1 · 🗓 Sprint 2 / Sprint 3
Every story below has its own page.

---

## Backlog summary

### PMV — Implemented (26 SP)

| ID | Title | Category | SP | Actor | Status |
| :- | :---- | :------- | :-: | :---- | :----- |
| [[HU1-FinancialDataEntry\|HU 1]] | Financial Data Entry | Complex | 5 | Lead | ✅ |
| [[HU2-LeadPrioritization\|HU 2]] | Lead Prioritization | Complex | 5 | Sales Executive | ✅ |
| [[HU3-HybridScoring\|HU 3]] | Hybrid Scoring with Intelligent Explanation | Very complex | 8 | Lead | ✅ |
| [[HU4-ImprovementPlan\|HU 4]] | Personalized Improvement Plan Generator | Important | 8 | Lead | ✅ |

### Sprint 1 — 47 SP + Spike 13 SP = **60 SP**

| ID | Title | Category | SP | Actor | Status |
| :- | :---- | :------- | :-: | :---- | :----- |
| [[HU4-ImprovementPlan\|HU 4]] | Personalized Improvement Plan Generator | Important | 8 | Lead | ✅ (PMV) |
| [[HU5-FinancialAcademy\|HU 5]] | Contextual Financial Academy | Essential | 8 | Lead | 🔜 |
| [[HU6-CompatibilitySimulation\|HU 6]] | Compatibility Simulation & Accessible Alternatives | Essential | 8 | Lead | 🔜 |
| [[HU7-ProjectCatalog\|HU 7]] | Real Estate Project Catalog Management | Essential | 5 | Real Estate Admin | 🔜 |
| [[HU8-ApplicableHousingBenefits\|HU 8]] | Applicable Housing Benefits Detector | Important | 5 | Lead | 🔜 |
| [[HU9-OrientativeQuote\|HU 9]] | Orientative Quote per Project | Essential | 5 | Lead | 🔜 |
| [[HU10-LeadProjectMatching\|HU 10]] | Lead–Project Matching for Executives | Important | 5 | Sales Executive | 🔜 |
| [[HU11-BankReadinessChecklist\|HU 11]] | Bank Readiness Checklist | Important | 3 | Lead | 🔜 |

### Sprint 2 — 49 SP + Spike 13 SP = **62 SP** (incl. an undefined 8 SP placeholder)

| ID | Title | Category | SP | Actor | Status |
| :- | :---- | :------- | :-: | :---- | :----- |
| [[HU12-CommercialDerivation\|HU 12]] | Commercial Derivation & CRM Integration | Important | 8 | Real Estate Staff | 🗓 |
| [[HU13-MonthlyPlanTracking\|HU 13]] | Monthly Improvement-Plan Tracking | Important | 8 | Lead | 🗓 |
| [[HU14-AccessibilityMap\|HU 14]] | Real Estate Accessibility Map Visualization | Optional | 8 | Lead | 🗓 |
| [[HU15-LeadFinancialEvolution\|HU 15]] | Lead Financial Evolution | Desirable | 5 | Sales Executive | 🗓 |
| [[HU16-ConversionDashboard\|HU 16]] | Sales Conversion-Rate Dashboard | Desirable | 5 | RE Admin / Executive | 🗓 |
| [[HU17-FraudulentLeadReporting\|HU 17]] | Report Inconsistent or Fraudulent Leads | Desirable | 5 | Sales Executive / RE Admin | 🗓 |
| [[HU18-MortgageScenarioSimulator\|HU 18]] | Referential Mortgage Scenario Simulator | Important | 5 | Lead | 🗓 |
| [[HU19-ProjectGapRanking\|HU 19]] | Project Gap Ranking | Important | 5 | Lead | 🗓 |
| *HU 20* | *(undefined placeholder in the source document — 8 SP)* | — | 8 | — | ❔ |

### Sprint 3 — **46 SP per the source document** (38 SP once its duplicated map story is counted once)

| ID | Title | Category | SP | Actor | Status |
| :- | :---- | :------- | :-: | :---- | :----- |
| [[HU22-AccessibilityMapUpdate\|HU 22]] | Dynamic Accessibility-Map Update | Optional | 5 | Lead | 🗓 |
| [[HU23-ScoringParameters\|HU 23]] | Scoring Parameter Configuration | Optional | 5 | Real Estate Admin | 🗓 |
| [[HU24-SupportingDocuments\|HU 24]] | Supporting Document Upload | Desirable | 5 | Sales Executive / Lead | 🗓 |
| [[HU25-DossierExport\|HU 25]] | Dossier Export for Bank Assessment | Optional | 3 | Sales Executive | 🗓 |
| [[HU26-SubsidySimulation\|HU 26]] | Advanced Housing Subsidy Simulation | Desirable | 5 | Lead | 🗓 |
| [[HU27-ReferentialBackgroundReview\|HU 27]] | Referential Review of Declared Background | Desirable | 5 | Sales Executive | 🗓 |
| [[HU28-InitialCostEstimator\|HU 28]] | Initial Purchase-Cost Estimator | Important | 5 | Lead | 🗓 |
| [[HU29-CreditTotalCostComparator\|HU 29]] | Referential Total Credit-Cost Comparator | Important | 5 | Lead | 🗓 |
| *HU 30* | *(undefined placeholder in the source document — 4 SP)* | — | 4 | — | ❔ |

> **Source-document inconsistencies:** the accessibility map appears twice (`HU 14` in Sprint 2 and `HU 21` in Sprint 3, identical criteria) — it is tracked once as [[HU14-AccessibilityMap\|HU 14]]; the source also leaves `HU 20` (8 SP, Sprint 2) and `HU 30` (4 SP, Sprint 3) undefined.

---

## Non-functional requirements (updated backlog)

The updated sprint plan explicitly moves these capabilities out of the functional backlog and treats them as RNFs:

| Capability | Page |
| :--------- | :--- |
| Basic security ("Seguridad básica", incl. safe error handling & input validation) | [[NFR-BasicSecurity\|Basic Security]] |
| Minimum privacy ("Privacidad mínima") | [[NFR-PrivacyPanel\|Privacy Panel]] |
| Roles & permissions ("Roles y permisos") | [[NFR-RolesAndPermissions\|Roles & Permissions]] |
| Technical auditing ("Auditoría técnica") | [[NFR-EvaluationAudit\|Evaluation Audit]] |
| Immutable history ("Historial inmutable") | [[NFR-ImmutableEvaluationHistory\|Immutable Evaluation History]] |
| Mobile lead experience ("Experiencia móvil lead") | [[NFR-MobileLeadExperience\|Mobile Lead Experience]] |
| Mobile executive dashboard ("Dashboard móvil ejecutivo") | [[NFR-MobileExecutiveDashboard\|Mobile Executive Dashboard]] |
| Availability & scalability ("Disponibilidad y escalabilidad") | [[NFR-SystemAvailability\|System Availability]] |

## Out of the updated backlog

Not present anywhere in the *"HUs para Sprint 1"* document — kept for reference only:

- [[OutOfBacklog-CommercialReport\|Commercial Report & Metrics]] (was `HU 22`)
- [[OutOfBacklog-EventLogAnalytics\|Event-Log Metrics Visualization & Analysis]] (was `HU 23`; previously planned for Sprint 1)
- [[OutOfBacklog-DemographicVisualization\|Demographic & Socioeconomic Visualization]] (was `HU 28`)

---

## Spikes

| Spike | Name | SP | Sprint |
| :---- | :--- | :-: | :----- |
| Spike 1 | Financial research: scoring parameters, compatibility-simulation criteria, financial-education material, lead–project matching criteria, documentation of inputs | 13 | Sprint 1 |
| Spike 2 | Technical validation: privacy & consent, role permissions, auditing & versioning, document upload/storage, commercial (CRM) & external (CMF) integrations, report/dossier definition, decision log | 13 | Sprint 2 |

**Spike 1 deliverables:** [[research/spike1-e4-lead-project-matching-criteria|E4 — Lead–Project Matching Criteria]] (capacity model + frozen contract for HU 10).

---

## Actors

| Actor | Description | Tech / Context |
| :---- | :---------- | :------------- |
| **Lead** | Person interested in buying their first home. Completes the form, receives their score, and follows a personalized improvement plan. | Tech 3 / Context 1 |
| **Sales Executive** | Real estate sales professional. Manages the prioritized lead dashboard and closes deals. | Tech 4 / Context 5 |
| **Real Estate Admin** | Representative of the contracting real estate company. Assigns executive roles, manages the project catalog and scoring parameters. | Tech 3 / Context 5 |
| **Admin Dev** | Member of the development team. Handles traceability, logs, security, and manual score adjustments. | Tech 5 / Context 3 |

Full actor detail (proficiency levels and justifications) is in [[Actores\|Actores / Roles]].

---

## Key functionalities

1. **Guided financial pre-assessment flow** ([[HU1-FinancialDataEntry\|HU 1]]) — step-by-step web form, no document upload at this stage.
2. **Real-time predictive scoring engine** ([[HU3-HybridScoring\|HU 3]]) — returns a viability score within 60 seconds with an AI-assisted explanation.
3. **Personalized improvement plan + monthly tracking** ([[HU4-ImprovementPlan\|HU 4]], [[HU13-MonthlyPlanTracking\|HU 13]]) — step-by-step action guide and progress registration for leads that don't qualify yet.
4. **Prioritized executive dashboard** ([[HU2-LeadPrioritization\|HU 2]]) — AI-assisted, self-contained lead prioritization without CRM integration.
5. **Project-centric commercial flow** ([[HU7-ProjectCatalog\|HU 7]], [[HU9-OrientativeQuote\|HU 9]], [[HU10-LeadProjectMatching\|HU 10]], [[HU19-ProjectGapRanking\|HU 19]]) — quotes, matching, and gap ranking against actually-available projects.
6. **Referential simulations family** ([[HU6-CompatibilitySimulation\|HU 6]], [[HU18-MortgageScenarioSimulator\|HU 18]], [[HU26-SubsidySimulation\|HU 26]], [[HU29-CreditTotalCostComparator\|HU 29]], [[HU28-InitialCostEstimator\|HU 28]]) — compatibility, mortgage scenarios, subsidies, credit cost, and initial costs.

---

## Appendix — E4 → updated numbering map

| E4 ID | Updated ID / page |
| :---- | :---------------- |
| HU 1–3 | HU 1–3 (unchanged, PMV) |
| HU 4 | [[HU12-CommercialDerivation\|HU 12]] |
| HU 5 | [[NFR-BasicSecurity\|NFR — Basic Security]] |
| HU 6 | [[NFR-PrivacyPanel\|NFR — Privacy Panel]] |
| HU 7 | [[HU4-ImprovementPlan\|HU 4]] |
| HU 8 (Monthly Plan Tracking) | [[HU13-MonthlyPlanTracking\|HU 13]] |
| HU 9 | [[HU6-CompatibilitySimulation\|HU 6]] |
| HU 10 | [[HU14-AccessibilityMap\|HU 14]] |
| HU 11 | [[HU22-AccessibilityMapUpdate\|HU 22]] |
| HU 12 | [[HU5-FinancialAcademy\|HU 5]] |
| HU 13 | [[HU10-LeadProjectMatching\|HU 10]] |
| HU 14 | [[NFR-RolesAndPermissions\|NFR — Roles & Permissions]] |
| HU 15 | [[HU23-ScoringParameters\|HU 23]] |
| HU 16 | [[NFR-EvaluationAudit\|NFR — Evaluation Audit]] |
| HU 17 | [[HU7-ProjectCatalog\|HU 7]] |
| HU 18 | [[HU15-LeadFinancialEvolution\|HU 15]] |
| HU 19 | [[HU24-SupportingDocuments\|HU 24]] |
| HU 20 | [[HU18-MortgageScenarioSimulator\|HU 18]] (refocused) |
| HU 21 | [[HU25-DossierExport\|HU 25]] |
| HU 22 | [[OutOfBacklog-CommercialReport\|Out of backlog]] |
| HU 23 | [[OutOfBacklog-EventLogAnalytics\|Out of backlog]] |
| HU 24 | [[HU17-FraudulentLeadReporting\|HU 17]] |
| HU 25 | [[HU26-SubsidySimulation\|HU 26]] |
| HU 26 | [[HU29-CreditTotalCostComparator\|HU 29]] (reframed) |
| HU 27 | [[HU16-ConversionDashboard\|HU 16]] |
| HU 28 | [[OutOfBacklog-DemographicVisualization\|Out of backlog]] |
| HU 29 | [[NFR-MobileLeadExperience\|NFR — Mobile Lead Experience]] |
| HU 30 | [[NFR-MobileExecutiveDashboard\|NFR — Mobile Executive Dashboard]] |
| HU 31 | [[HU27-ReferentialBackgroundReview\|HU 27]] (reframed) |
| HU 32 | [[NFR-SystemAvailability\|NFR — System Availability]] |
| HU 33 | [[NFR-ImmutableEvaluationHistory\|NFR — Immutable Evaluation History]] |
| — | New in updated plan: [[HU8-ApplicableHousingBenefits\|HU 8]], [[HU9-OrientativeQuote\|HU 9]], [[HU11-BankReadinessChecklist\|HU 11]], [[HU19-ProjectGapRanking\|HU 19]], [[HU28-InitialCostEstimator\|HU 28]] |

---

## Related pages

- [[Distribucion\|Distribución / Sprints]] — sprint plan, SP totals, spikes.
- [[Riesgos\|Riesgos técnicos]] — 9 technical risks with the priority formula.
- [[AtributosDeCalidad\|Atributos de calidad (RNF)]] — 8 quality attributes with SMART goals.
- [[Actores\|Actores / Roles]] — the 4 system actors in detail.
