# User Stories — ScoreLeads

All user stories for the ScoreLeads platform, following the **E4 Plan de Proyecto 2026** numbering (`HU 1–33`).

> **Numbering note:** the E4 plan renumbered the backlog. The E1/E2 informes used `HdU 1–6`; this folder now uses `HU`. Mapping of the previously documented stories: `HdU1→HU1`, `HdU2→HU2`, `HdU3→HU3`, `HdU4→HU7` (Improvement Plan), `HdU5→HU4` (CRM), `HdU6→HU20` (UF/rate simulation).

**Status legend:** ✅ Implemented (PMV) · 🔜 Sprint 1 · 🗓 Sprint 2 · 🗓 Sprint 3
Every story below has its own page. ✅/🔜 stories carry the full implemented/near-term detail; 🗓 stories are documented for planning.

---

## Backlog summary

| ID | Title | Category | SP | Actor | Sprint | Status |
| :- | :---- | :------- | :-: | :---- | :----- | :----- |
| [[HU1-FinancialDataEntry\|HU 1]] | Financial Data Entry | Complex | 5 | Lead | PMV | ✅ |
| [[HU2-LeadPrioritization\|HU 2]] | Lead Prioritization | Complex | 5 | Sales Executive | PMV | ✅ |
| [[HU3-HybridScoring\|HU 3]] | Hybrid Scoring with Intelligent Explanation | Very complex | 8 | Lead | PMV | ✅ |
| [[HU4-CommercialDerivation\|HU 4]] | Commercial Derivation & CRM Integration | Desirable | 8 | Real Estate Staff | Sprint 2 | 🗓 |
| [[HU5-BasicSecurity\|HU 5]] | Basic System Security | Important | 8 | Admin Dev | Sprint 1 | 🔜 |
| [[HU6-PrivacyPanel\|HU 6]] | Privacy & Personal Data Management Panel | Desirable | 3 | Lead (registered) | Sprint 2 | 🗓 |
| [[HU7-ImprovementPlan\|HU 7]] | Personalized Improvement Plan Generator | Important | 8 | Lead | Sprint 1 | ✅ |
| [[HU8-MonthlyPlanTracking\|HU 8]] | Monthly Improvement-Plan Tracking | Important | 5 | Lead | Sprint 2 | 🗓 |
| [[HU9-CompatibilitySimulation\|HU 9]] | Compatibility Simulation & Accessible Alternatives | Essential | 5 | Lead | Sprint 2 | 🗓 |
| [[HU10-AccessibilityMap\|HU 10]] | Real Estate Accessibility Map Visualization | Optional | 8 | Lead | Sprint 3 | 🗓 |
| [[HU11-AccessibilityMapUpdate\|HU 11]] | Dynamic Accessibility-Map Update | Optional | 5 | Lead | Sprint 3 | 🗓 |
| [[HU12-FinancialAcademy\|HU 12]] | Contextual Financial Academy | Essential | 8 | Lead | Sprint 1 | 🔜 |
| [[HU13-LeadProjectMatching\|HU 13]] | Lead–Project Matching for Executives | Important | 5 | Sales Executive | Sprint 1 | 🔜 |
| [[HU14-RolesAndPermissions\|HU 14]] | Roles & Permissions Management | Desirable | 3 | Admin Dev | Sprint 2 | 🗓 |
| [[HU15-ScoringParameters\|HU 15]] | Scoring Parameter Configuration | Optional | 5 | Real Estate Admin | Sprint 3 | 🗓 |
| [[HU16-EvaluationAudit\|HU 16]] | Evaluation Auditing | Desirable | 3 | Real Estate Admin / Dev | Sprint 2 | 🗓 |
| [[HU17-ProjectCatalog\|HU 17]] | Real Estate Project Catalog Management | Essential | 5 | Real Estate Admin | Sprint 1 | 🔜 |
| [[HU18-LeadFinancialEvolution\|HU 18]] | Lead Financial Evolution | Desirable | 5 | Sales Executive | Sprint 2 | 🗓 |
| [[HU19-SupportingDocuments\|HU 19]] | Supporting Document Upload | Desirable | 5 | Sales Executive | Sprint 2 | 🗓 |
| [[HU20-EconomicSimulation\|HU 20]] | Economic Simulation with UF & Rates | Optional | 3 | Lead | Sprint 3 | 🗓 |
| [[HU21-DossierExport\|HU 21]] | Dossier Export for Bank Assessment | Optional | 3 | Sales Executive | Sprint 2 | 🗓 |
| [[HU22-CommercialReport\|HU 22]] | Commercial Report & Metrics | Optional | 3 | Sales Executive | Sprint 2 | 🗓 |
| [[HU23-EventLogAnalytics\|HU 23]] | Event-Log Metrics Visualization & Analysis | Important | 8 | Real Estate Admin | Sprint 1 | 🔜 |
| [[HU24-FraudulentLeadReporting\|HU 24]] | Report Fraudulent Users/Leads | Desirable | 5 | Sales Executive | Sprint 3 | 🗓 |
| [[HU25-SubsidySimulation\|HU 25]] | Housing Subsidy Simulation | Desirable | 5 | Lead | Sprint 3 | 🗓 |
| [[HU26-CreditTermSimulation\|HU 26]] | Credit-Term Variation Simulation | Optional | 3 | Lead | Sprint 3 | 🗓 |
| [[HU27-ConversionDashboard\|HU 27]] | Sales Conversion-Rate Dashboard | Desirable | 5 | Real Estate Admin / Executive | Sprint 3 | 🗓 |
| [[HU28-DemographicVisualization\|HU 28]] | Demographic & Socioeconomic Visualization | Optional | 1 | Sales Executive / Admin | Sprint 3 | 🗓 |
| [[HU29-MobileLeadExperience\|HU 29]] | Mobile Experience for the Lead | Essential | 5 | Lead | Sprint 1 | 🔜 |
| [[HU30-MobileExecutiveDashboard\|HU 30]] | Mobile-Adaptable Executive Dashboard | Essential | 5 | Sales Executive | Sprint 1 | 🔜 |
| [[HU31-SimulatedCMFQuery\|HU 31]] | Simulated CMF Query | Optional | 5 | Sales Executive | Sprint 2 | 🗓 |
| [[HU32-SystemAvailability\|HU 32]] | System Availability & Scalability | Desirable | 5 | Dev / DevOps | Sprint 3 | 🗓 |
| [[HU33-ImmutableEvaluationHistory\|HU 33]] | Immutable, Versioned Evaluation History | Desirable | 5 | Real Estate Admin | Sprint 2 | 🗓 |

**Implemented (PMV):** HU 1, 2, 3, 7 &nbsp;·&nbsp; **26 SP**
See the full sprint breakdown and the two research spikes in [[Distribucion\|Distribución / Sprints]].

---

## Spikes

| Spike | Name | SP | Sprint |
| :---- | :--- | :-: | :----- |
| Spike 1 | Financial research: scoring, financial education, commercial prioritization criteria | 10 | Sprint 1 |
| Spike 2 | Technical validation: privacy, roles, traceability, documents, external integrations | 20 | Sprint 2 |

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
3. **Personalized improvement plan generator** ([[HU7-ImprovementPlan\|HU 7]]) — step-by-step action guide with debt/savings goals for leads that don't qualify yet.
4. **Prioritized executive dashboard** ([[HU2-LeadPrioritization\|HU 2]]) — AI-assisted, self-contained lead prioritization without CRM integration.
5. **Lead–project matching & catalog** ([[HU13-LeadProjectMatching\|HU 13]], [[HU17-ProjectCatalog\|HU 17]]) — recommends leads against actually-available projects.
6. **Mobile-first delivery** ([[HU29-MobileLeadExperience\|HU 29]], [[HU30-MobileExecutiveDashboard\|HU 30]]) — full lead and executive flows on a phone.

---

## Related pages

- [[Distribucion\|Distribución / Sprints]] — sprint plan, SP totals, spikes.
- [[Riesgos\|Riesgos técnicos]] — 9 technical risks with the priority formula.
- [[AtributosDeCalidad\|Atributos de calidad (RNF)]] — 8 quality attributes with SMART goals.
- [[Actores\|Actores / Roles]] — the 4 system actors in detail.
- [[../informes_entregas/E4 - GPI Plan de Proyecto 2026\|E4 — Plan de Proyecto 2026]] — the source entregable.
