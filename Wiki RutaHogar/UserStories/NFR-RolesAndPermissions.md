# NFR — Roles & Permissions Management

> ℹ️ **Non-functional requirement.** The updated sprint plan ("HUs para Sprint 1" document) lists roles and permissions as a non-functional requirement ("Roles y permisos") rather than a functional user story. Kept here for reference; it was `HU 14` under the E4 plan.

Lets an admin dev manage roles and permissions across the platform, controlling access to features per user profile.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 3 |
| **Actor** | Admin Dev |
| **Status** | ℹ️ NFR (updated backlog) |
| **Sprint** | — |
| **Depends on** | [[NFR-BasicSecurity\|Basic Security (NFR)]] |
| **Required by** | — |

---

## User Story

> **As** an admin dev, **I want** to manage roles and permissions within the platform, **in order to** control access to features according to each user's profile.

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
- Enforced on both desktop and mobile — see [[NFR-MobileExecutiveDashboard\|Mobile Executive Dashboard (NFR)]] E6.
