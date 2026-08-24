# NFR — Basic System Security

> ℹ️ **Non-functional requirement.** The updated sprint plan ("HUs para Sprint 1" document) classifies this capability as a non-functional requirement ("Seguridad básica", including safe error handling and input validation) with the same acceptance criteria, rather than a functional user story. Kept here for reference; it was `HU 5` under the E4 plan.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Important |
| **Story Points** | 8 |
| **Actor** | Admin Dev / System Administrator |
| **Status** | ℹ️ NFR (updated backlog) |
| **Sprint** | — |
| **Depends on** | — |
| **Required by** | [[HU1-FinancialDataEntry\|HU 1]], [[HU3-HybridScoring\|HU 3]] (data-handling paths) |

---

## User Story

> **As** a system administrator, **I want** the platform to implement validations, endpoint protection, and safe error handling, **in order to** protect users' financial information and reduce the risk of vulnerabilities.

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
- Auth/role enforcement is expanded in [[NFR-RolesAndPermissions\|Roles & Permissions (NFR)]] (Sprint 2).
