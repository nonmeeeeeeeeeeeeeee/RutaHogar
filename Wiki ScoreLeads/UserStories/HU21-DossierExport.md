# HU 21 — Dossier Export for Bank Assessment

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Lets a sales executive export a consolidated report with the lead's profile and documents, to speed up a future referral to formal banking institutions.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Optional |
| **Story Points** | 3 |
| **Actor** | Sales Executive |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU19-SupportingDocuments\|HU 19]] |
| **Required by** | — |

---

## User Story

> **As** a sales executive, **I want** to export a consolidated report with the lead's profile and their documents, **in order to** speed up a future referral to formal banking institutions.

---

## Acceptance Criteria

### E1 — Export from lead profile

**Given** the executive reviews a prioritized prospect,  
**When** they select export dossier,  
**Then** the system must generate a digital file.

---

### E2 — Dossier content

**Given** the dossier is generated,  
**When** the executive downloads it,  
**Then** it must include score detail, lead profile, and uploaded documents.

---

### E3 — Standardized format

**Given** the dossier will be used for later review,  
**When** the file is generated,  
**Then** it must present the information in a clean and structured way.

---

## Notes

- Requires the uploaded documents from [[HU19-SupportingDocuments\|HU 19]].
- Dossier content, format, and permissions are defined in **Spike 2**, taking care not to expose unnecessary sensitive information.
