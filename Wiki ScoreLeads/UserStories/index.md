# User Stories — ScoreLeads

All user stories for the ScoreLeads platform. HdU 1–4 are in scope for the current MVP. HdU 5–6 are documented but deferred.

---

## Summary

| ID | Title | Category | SP | Actor | Status |
| :- | :---- | :------- | :-: | :---- | :----- |
| [[HdU1-FinancialDataEntry\|HdU 1]] | Financial Data Entry | Important | 5 | Lead | ✅ In scope |
| [[HdU2-LeadPrioritization\|HdU 2]] | Lead Prioritization | Essential | 5 | Sales Executive | ✅ In scope |
| [[HdU3-HybridScoring\|HdU 3]] | Hybrid Scoring with Intelligent Explanation | Important | 8 | Lead | ✅ In scope |
| [[HdU4-ImprovementPlan\|HdU 4]] | Improvement Plan Generator | Important | 8 | Lead | ✅ In scope |
| [[HdU5-CRMIntegration\|HdU 5]] | CRM Integration | Desirable | 5 | Real Estate Staff | ⏸ Deferred |
| [[HdU6-StressAlgorithm\|HdU 6]] | Stress Algorithm | Desirable | 5 | Lead | ⏸ Deferred |

**Total SP in scope:** 26 &nbsp;|&nbsp; **Total SP deferred:** 10

---

## Actors

| Actor | Description |
| :---- | :---------- |
| **Lead** | Person interested in buying a home. Low financial knowledge, average digital proficiency. Completes the form, receives their score, and follows a personalized improvement plan. |
| **Sales Executive** | Real estate sales professional. High domain knowledge, medium-high tech proficiency. Manages the prioritized lead dashboard and closes deals. |
| **Real Estate Staff** | Internal employee who pushes qualified leads into the CRM (HdU 5 only). |

---

## Key functionalities

1. **Guided financial pre-assessment flow** — step-by-step web form, no document upload required at this stage.
2. **Predictive scoring engine in real time** — processes declared data and returns a viability score within 60 seconds.
3. **Personalized improvement plan generator** — step-by-step action guide for leads that don't qualify yet.
4. **Commercial derivation and integration system** — syncs qualified leads with the sales pipeline (deferred).
5. **Dynamic lead assignment** — high-score profiles routed to executives; development profiles routed to automated nurturing (deferred).
