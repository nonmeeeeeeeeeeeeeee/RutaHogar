# HU 5 — Basic System Security

> 🔜 **Sprint 1.** Cross-cutting hardening of the platform: input validation, endpoint protection, and safe error handling to protect users' financial information.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 8 |
| **Actor** | Admin Dev / System Administrator |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | — |
| **Required by** | [[HU1-FinancialDataEntry\|HU 1]], [[HU3-HybridScoring\|HU 3]], [[HU14-RolesAndPermissions\|HU 14]], [[HU30-MobileExecutiveDashboard\|HU 30]] |

---

## User Story

> **As** a system administrator, **I want** the platform to implement validations, endpoint protection, and safe error handling, **in order to** protect users' financial information and reduce the risk of vulnerabilities.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

_None — this story has no upstream dependencies._

---

## Acceptance Criteria

### E1 — Input validation

**Given** a user completes forms or consumes endpoints,  
**When** they send invalid, incomplete, or out-of-range data,  
**Then** the system must reject the request and show a controlled message.

---

### E2 — Protection against unsafe errors

**Given** an error occurs in the backend,  
**When** the system responds to the user,  
**Then** it must not expose technical traces, SQL queries, tokens, or sensitive data.

---

### E3 — SQL injection prevention

**Given** the system stores or queries financial information,  
**When** operations are executed against the database,  
**Then** parameterized queries, an ORM, or equivalent mechanisms must be used.

---

## Notes

- This is a foundational, cross-cutting story: its criteria apply to every endpoint that handles lead data, especially `POST /score`.
- Relates to the risk **"Exposure of sensitive data"** and **"Authentication/authorization vulnerabilities"** — see [[Riesgos\|Riesgos técnicos]].
- Complements the RNF **Security** and **Data privacy** attributes — see [[AtributosDeCalidad\|Atributos de calidad]].
- Auth/role enforcement is expanded in [[HU14-RolesAndPermissions\|HU 14]] (Sprint 2).
