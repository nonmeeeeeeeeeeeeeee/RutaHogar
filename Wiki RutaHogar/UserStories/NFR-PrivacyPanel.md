# NFR — Minimum Privacy (Privacy & Personal Data Panel)

> ℹ️ **Non-functional requirement.** The updated sprint plan ("HUs para Sprint 1" document) lists privacy as a non-functional requirement ("Privacidad mínima") rather than a functional user story. Kept here for reference; it was `HU 6` under the E4 plan.

A privacy panel inside the user's profile to manage consent, request actions on their data, and control how their information is used.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 3 |
| **Actor** | Lead (registered user) |
| **Status** | ℹ️ NFR (updated backlog) |
| **Sprint** | — |
| **Depends on** | [[HU1-FinancialDataEntry\|HU 1]] |
| **Required by** | — |

---

## User Story

> **As** a registered user, **I want** to access a privacy panel within my profile, **in order to** manage my consent, request actions on my data, and control the use of my information.

---

## Acceptance Criteria

### E1 — Consent management

**Given** the user accesses their profile,  
**When** they enter the privacy panel,  
**Then** they must be able to view and modify the consent associated with the use of their data.

---

### E2 — Download or rectification request

**Given** the user wants to exercise their rights over their data,  
**When** they choose to download or rectify personal information,  
**Then** the system must register the request and show a confirmation.

---

### E3 — Account deletion

**Given** the user requests to delete their account,  
**When** they confirm the action,  
**Then** the system must start the total, unrecoverable deletion process according to the defined rules.

---

### E4 — Password recovery

**Given** the user forgot their password or wants to change it,  
**When** they request recovery,  
**Then** the system must allow starting the reset flow.

---

## Notes

- Implements the ARSOBP data-subject rights referenced in the ethics commitment and the RNF **Data privacy** attribute — see [[../AtributosDeCalidad\|Atributos de calidad]].
- Consent state set here gates event logging in [[OutOfBacklog-EventLogAnalytics\|Event-Log Analytics (out of backlog)]] E3.
- Scope of privacy flows is validated in **Spike 2**.
