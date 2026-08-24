# HU 6 — Compatibility Simulation & Accessible Alternatives

> 🔜 **Sprint 1.** Lets a lead simulate different objectives, values, comunas, terms, and configurations to discover which alternatives are compatible with their current profile.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Essential |
| **Story Points** | 8 |
| **Actor** | Lead |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | — |

---

## User Story

> **As** a user interested in buying a home, **I want** to simulate different objectives, values, comunas, terms, and configurations, **in order to** discover which alternatives are compatible with my current profile.

---

## Acceptance Criteria

### E1 — Home-value simulation

**Given** the user has already completed their assessment,  
**When** they enter different home values,  
**Then** the system must show whether each scenario is compatible with their purchase capacity.

---

### E2 — Minimum adjustments to qualify

**Given** the user does not qualify for their declared objective,  
**When** they want to evaluate other objectives using their results,  
**Then** the system must propose different alternatives that are as accessible as possible for this user.

---

### E3 — Scenario comparison

**Given** the user simulates different configurations,  
**When** the system presents the results,  
**Then** it must clearly show the difference between the current scenario and the alternative scenarios.

---

### E4 — Purchase-capacity estimation

**Given** the user received their assessment,  
**When** they view the result,  
**Then** the system must show the maximum estimated home value they could finance.

---

### E5 — Maximum response time

**Given** the user runs the compatibility simulation,  
**When** it finishes,  
**Then** it must not exceed a response time of 30 seconds.

---

## Notes

- Simulation criteria (purchase capacity, home value, savings, debt, minimum adjustments) are defined in **Spike 1**. The `capacidad_compra_estimada` primitive is already specified in [[research/spike1-e4-lead-project-matching-criteria\|Spike 1 · E4 — Lead–Project Matching Criteria]]; reuse it rather than defining a second capacity formula.
- Feeds the accessibility map ([[HU14-AccessibilityMap\|HU 14]]) and complements the economic/subsidy/term simulations ([[HU18-MortgageScenarioSimulator\|HU 18]], [[HU26-SubsidySimulation\|HU 26]], [[HU29-CreditTotalCostComparator\|HU 29]]).
- **Numbering note:** this story was `HU 9` under the E4 plan (planned for Sprint 2); the updated sprint plan renumbers it to `HU 6`, moves it to Sprint 1, and raises it from 5 to 8 SP.
