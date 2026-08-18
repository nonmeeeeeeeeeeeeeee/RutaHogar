# HU 19 — Supporting Document Upload

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Lets pre-qualified leads upload financial supporting documents so the executive can validate the declared information.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Sales Executive / Lead |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU2-LeadPrioritization\|HU 2]] |
| **Required by** | [[HU21-DossierExport\|HU 21]] |

---

## User Story

> **As** an executive, **I want** pre-qualified users to upload financial receipts to the platform, **in order to** validate the declared information.

---

## Acceptance Criteria

### E1 — Upload of allowed files

**Given** the lead wants to back up their information,  
**When** they upload documents in PDF, JPG, or PNG,  
**Then** the system must accept them if they meet the defined rules.

---

### E2 — Secure storage

**Given** the user uploads financial documents,  
**When** the system stores them,  
**Then** they must remain linked to their profile securely.

---

### E3 — Visualization by executive

**Given** an executive reviews a pre-qualified lead,  
**When** they access their profile,  
**Then** they must be able to view or download the allowed documents.

---

## Notes

- File types, max size, storage mechanism, and access permissions are defined in **Spike 2**.
- This is the first story that introduces document handling; earlier stages ([[HU1-FinancialDataEntry\|HU 1]]) deliberately avoid document upload.
- Uploaded documents feed the dossier export in [[HU21-DossierExport\|HU 21]].
- Note the CLAUDE.md guardrail: no storage of bank credentials or highly sensitive documents.
