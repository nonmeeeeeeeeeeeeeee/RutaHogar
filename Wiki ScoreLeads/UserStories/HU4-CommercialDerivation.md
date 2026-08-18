# HU 4 — Commercial Derivation and Integration System

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning. Do not implement without explicit team instruction.

Allows qualified leads to be pushed from ScoreLeads directly into the real estate company's CRM, giving the sales team a prioritized pipeline with no manual data entry.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 8 |
| **Actor** | Real Estate Staff |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]] |
| **Required by** | — |

---

## User Story

> **As** a real estate employee, **I want** to add qualified users from the application into the real estate CRM, **in order to** give them prioritized management within the sales flow of the real estate project.

---

## Acceptance Criteria

### E1 — Automatic derivation of high-priority leads to the CRM

**Given** a user has been submitted into the application,  
**When** they finish being scored and are classified as high priority,  
**Then** the system must replicate their information into the CRM, immediately or eventually.

---

### E2 — Update the lead in the CRM on score/priority changes

**Given** a user has been submitted into the application,  
**When** an update to their score occurs and they become qualified or their priority increases,  
**Then** the system must send a request to the CRM to update the user's data.

---

### E3 — Internal retention of non-priority leads

**Given** a user has been submitted into the application,  
**When** they finish being scored and are not considered high priority,  
**Then** the application must not send their profile to the CRM, and must manage their data internally until their score is updated.

---

## Notes

- This story requires knowledge of the target CRM's API (endpoint, authentication, field mapping). That information is not yet available and is part of **Spike 2**'s scope.
- The internal lead dashboard ([[HU2-LeadPrioritization\|HU 2]]) covers the prioritization need for the PMV without this integration.
- When implemented, the sync logic should be event-driven (a score update triggers a CRM write) rather than a manual export.
- **Numbering note:** documented as `HdU 5` (CRM Integration) in the E2 informe; renumbered to `HU 4` following the E4 plan.
