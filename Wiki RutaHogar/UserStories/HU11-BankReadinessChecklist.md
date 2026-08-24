# HU 11 — Bank Readiness Checklist

> 🔜 **Sprint 1.** Shows leads a simple checklist of background items they should prepare before a formal bank assessment — explicitly referential, with no sensitive document upload at this stage.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 3 |
| **Actor** | Lead |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | [[HU3-HybridScoring\|HU 3]], [[HU5-FinancialAcademy\|HU 5]] |
| **Required by** | — |

---

## User Story

> **As** a lead, **I want** to see a simple list of background items I should prepare before a formal bank assessment, **in order to** understand what information I might need later on.

---

## Acceptance Criteria

### E1 — Referential checklist

**Given** the user receives their assessment,  
**When** they review their next steps,  
**Then** they must see a referential bank-readiness checklist.

---

### E2 — Highlight related items

**Given** the user has an identified determining factor,  
**When** the checklist is shown,  
**Then** the background items related to that factor must be highlighted.

---

### E3 — No sensitive documents at this stage

**Given** the user reviews the checklist,  
**When** they view it,  
**Then** it must be made clear that no sensitive documents should be uploaded at this stage.

---

### E4 — Academy linkage

**Given** related educational content exists,  
**When** a checklist item is shown,  
**Then** it must link to the Academy section.

---

## Notes

- The checklist is purely informational — document upload remains a separate story ([[HU24-SupportingDocuments\|HU 24]], Sprint 3).
- Related-factor highlighting (E2) reuses the `risk_codes` produced by the scoring engine ([[HU3-HybridScoring\|HU 3]]) and surfaced by the improvement plan ([[HU4-ImprovementPlan\|HU 4]]).
- **Numbering note:** story added by the updated sprint plan ("HUs para Sprint 1" document, ID `HU 11`); it had no predecessor under the E4 plan.
