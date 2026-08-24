# HU 7 — Real Estate Project Catalog Management

> 🔜 **Sprint 1.** Lets a real estate admin register and maintain a catalog of projects and link them to executives, so the system can recommend leads against projects that are actually available.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Essential |
| **Story Points** | 5 |
| **Actor** | Real Estate Admin |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | — |
| **Required by** | [[HU10-LeadProjectMatching\|HU 10]] |

---

## User Story

> **As** a real estate admin, **I want** to register and maintain a catalog of real estate projects and link them to executives, **in order to** let the system recommend leads according to the projects that are actually available.

---

## Acceptance Criteria

### E1 — Project creation

**Given** the admin accesses the projects panel,  
**When** they enter name, real estate company, comuna, type, price range, and status,  
**Then** the system must save the project in the catalog.

---

### E2 — Data validation

**Given** the real estate admin creates or edits a project,  
**When** they enter incomplete required data or inconsistent prices,  
**Then** the system must prevent saving until corrected.

---

### E3 — Linking with executives

**Given** a project exists in the catalog,  
**When** the admin assigns executives,  
**Then** those executives must remain linked to the project.

---

### E4 — Project status

**Given** a project is marked as sold out,  
**When** matching is executed,  
**Then** it must not generate new recommendations.

---

## Notes

- This catalog is the data source for the matching engine in [[HU10-LeadProjectMatching\|HU 10]].
- Project attributes (comuna, price range, type) align with the `PRECIOS_REFERENCIA_UF` reference used by the scoring engine.
- **Numbering note:** this story was `HU 17` under the E4 plan; the updated sprint plan renumbers it to `HU 7` (still Sprint 1).
