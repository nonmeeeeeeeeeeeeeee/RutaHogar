# HU 9 — Compatibility Simulation & Accessible Alternatives

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Lets a lead simulate different objectives, values, comunas, terms, and configurations to discover which alternatives are compatible with their current profile.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Essential |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | [[HU10-AccessibilityMap\|HU 10]], [[HU13-LeadProjectMatching\|HU 13]], [[HU30-MobileExecutiveDashboard\|HU 30]] |

---

## User Story

> **As** a user interested in buying a home, **I want** to simulate different objectives, values, comunas, terms, and configurations, **in order to** discover which alternatives are compatible with my current profile.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU3-HybridScoring\|HU 3]]** — E1 tests scenarios against the lead's purchase capacity and E2 proposes minimum adjustments for someone who "does not qualify" — both need the completed assessment from HU 3.  `documented`

---

## Acceptance Criteria

### E1 — Home-value simulation

**Given** the user has already completed their assessment,  
**When** they enter different home values,  
**Then** the system must show whether each scenario is compatible with their purchase capacity.

---

### E2 — Minimum adjustments to qualify

**Given** the user does not qualify for their declared objective,  
**When** the system evaluates alternatives,  
**Then** it must propose the minimum change that would make a property accessible.

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
- Feeds the accessibility map ([[HU10-AccessibilityMap\|HU 10]]) and complements the economic/subsidy/term simulations ([[HU20-EconomicSimulation\|HU 20]], [[HU25-SubsidySimulation\|HU 25]], [[HU26-CreditTermSimulation\|HU 26]]).
