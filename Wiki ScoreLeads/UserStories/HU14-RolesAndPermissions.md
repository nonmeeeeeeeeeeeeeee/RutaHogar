# HU 14 — Roles & Permissions Management

> 🗓 **Sprint 2 — not yet implemented.** Documented for planning.

Lets an admin dev manage roles and permissions across the platform, controlling access to features per user profile.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 3 |
| **Actor** | Admin Dev |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 2 |
| **Depends on** | [[HU5-BasicSecurity\|HU 5]] |
| **Required by** | [[HU30-MobileExecutiveDashboard\|HU 30]] |

---

## User Story

> **As** an admin dev, **I want** to manage roles and permissions within the platform, **in order to** control access to features according to each user's profile.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

- **[[HU5-BasicSecurity\|HU 5]]** — HU 5's note: *"Auth/role enforcement is expanded in HU 14."* E2 blocks disallowed access, which is the endpoint-protection surface HU 5 establishes.  `documented`

---

## Acceptance Criteria

### E1 — Role assignment

**Given** the admin accesses user management,  
**When** they assign a role to an account,  
**Then** the system must save the role correctly.

---

### E2 — Access restriction

**Given** a user tries to access a feature they are not allowed to use,  
**When** the system validates their permissions,  
**Then** it must block access.

---

### E3 — View according to role

**Given** a user signs in,  
**When** they access the platform,  
**Then** they must see only the features corresponding to their role.

---

## Notes

- Formalizes the role model already present in `services/auth.js` (`roles.user`, `roles.sales`, `roles.admin`).
- Role scope and per-feature permissions are validated in **Spike 2**.
- Enforced on both desktop and mobile — see [[HU30-MobileExecutiveDashboard\|HU 30]] E6.
