# HdU 5 — CRM Integration

> ⏸ **Out of scope for the current MVP.** Documented here for future planning. Do not implement without explicit team instruction.

Allows qualified leads to be pushed from ScoreLeads directly into the real estate company's CRM, giving the sales team a prioritized pipeline with no manual data entry.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Real Estate Staff |
| **Status** | ⏸ Deferred |
| **Depends on** | [[HdU3-HybridScoring\|HdU 3]] |
| **Required by** | — |

---

## User Story

> **As** a real estate employee, **I want** to add qualified users from the application into the real estate CRM, **in order to** give them prioritized management within the sales flow of the real estate project.

---

## Acceptance Criteria

### E1 — Replicate high-priority user to CRM

**Given** a user has been submitted into the application,  
**When** they finish being scored and are classified as high priority,  
**Then** the system must replicate their information into the CRM, immediately or eventually.

---

### E2 — Update CRM when score improves

**Given** a user has been submitted into the application,  
**When** an update to their score occurs and they become qualified or their priority increases,  
**Then** the system must send a request to the CRM to update the user's data.

---

### E3 — Do not send low-priority users to CRM

**Given** a user has been submitted into the application,  
**When** they finish being scored and are not considered high priority,  
**Then** the application must not send their profile to the CRM, and must manage their data internally until their score is updated.

---

## Notes

- This story requires knowledge of the target CRM's API (endpoint, authentication, field mapping). That information is not yet available.
- The internal lead dashboard ([[HdU2-LeadPrioritization|HdU 2]]) covers the prioritization need for the MVP without this integration.
- When this story is eventually implemented, the sync logic should be event-driven (score update triggers a CRM write) rather than a manual export.
