# HU 30 — Mobile-Adaptable Executive Dashboard

> 🔜 **Sprint 1.** A card-based, responsive version of the executive lead dashboard, so executives can review, filter, and act on leads from a phone with the same permissions as desktop.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Essential |
| **Story Points** | 5 |
| **Actor** | Sales Executive |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | [[HU2-LeadPrioritization\|HU 2]], [[HU5-BasicSecurity\|HU 5]], [[HU9-CompatibilitySimulation\|HU 9]], [[HU14-RolesAndPermissions\|HU 14]], [[HU24-FraudulentLeadReporting\|HU 24]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive, **I want** to review and manage leads from my phone, **in order to** prioritize viable prospects and do commercial follow-up without depending on a computer.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU2-LeadPrioritization\|HU 2]]** — This story's note: *"Mobile counterpart of HU 2."* E1–E3 re-render HU 2's prioritized lead list as mobile cards.  `documented`

- **[[HU5-BasicSecurity\|HU 5]]** — E6 requires the mobile dashboard to "maintain the same access restrictions and permissions as the desktop version". This story's note: *"E6 role enforcement aligns with HU 5 and HU 14."*  `documented · B9`

- **[[HU9-CompatibilitySimulation\|HU 9]]** — E3 requires "estimated capacity" on every lead card. Same missing computation as HU 13 — the value is defined only in HU 9 E4 and does not exist in the scoring engine.  `inferred · B8`

- **[[HU14-RolesAndPermissions\|HU 14]]** — The second half of E6's role enforcement. Soft: E6 only requires parity with whatever the desktop enforces, so HU 5 alone satisfies a minimum and HU 14 raises the ceiling.  `inferred · S4`

- **[[HU24-FraudulentLeadReporting\|HU 24]]** — E4's quick actions include "report inconsistency", which is HU 24 E3. HU 24's note: *"Quick 'report inconsistency' action is exposed on mobile — see HU 30 E4."*  `documented · B6`

---

## Acceptance Criteria

### E1 — Card-based mobile dashboard

**Given** the executive accesses the dashboard from a phone,  
**When** they view the leads list,  
**Then** the system must show the information as cards adapted to a mobile screen, avoiding hard-to-read tables.

---

### E2 — Accessible mobile filters

**Given** the executive reviews leads from a phone,  
**When** they need to filter by score, status, priority, project, or classification,  
**Then** the filters must be available in a collapsible or compact section without saturating the screen.

---

### E3 — Key information visible per lead

**Given** the executive views a lead card,  
**When** they review the mobile dashboard,  
**Then** they must be able to see at least name, classification, score, estimated capacity, main blocker, and commercial status.

---

### E4 — Executive quick actions

**Given** the executive reviews a lead from their phone,  
**When** they select a card,  
**Then** they must be able to run main actions such as view detail, change status, mark follow-up, or report inconsistency.

---

### E5 — Clear prioritization on small screens

**Given** multiple leads exist in the dashboard,  
**When** the executive accesses from mobile,  
**Then** the highest-priority leads must be visually distinguishable from medium, low, or discarded leads.

---

### E6 — Role permissions maintained

**Given** the mobile dashboard shows leads' financial information,  
**When** a user accesses from a phone,  
**Then** the system must maintain the same access restrictions and permissions as the desktop version.

---

### E7 — Functional testing on mobile devices

**Given** the mobile version of the dashboard is delivered,  
**When** acceptance tests are run,  
**Then** it must be validated that the main actions work correctly on representative mobile resolutions.

---

## Notes

- Mobile counterpart of [[HU2-LeadPrioritization\|HU 2]]; the lead-side counterpart is [[HU29-MobileLeadExperience\|HU 29]].
- E4 quick actions (change status, report inconsistency) connect to [[HU24-FraudulentLeadReporting\|HU 24]] and the lead status model.
- E6 role enforcement aligns with [[HU5-BasicSecurity\|HU 5]] and [[HU14-RolesAndPermissions\|HU 14]].
