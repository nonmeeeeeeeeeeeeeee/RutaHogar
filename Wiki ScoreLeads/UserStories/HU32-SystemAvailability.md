# HU 32 — System Availability & Scalability

> 🗓 **Sprint 3 — not yet implemented.** Documented for planning.

Monitors system availability and validates behavior under load, to guarantee ≥ 95% uptime and support ≥ 100 evaluations without data loss during the test period.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Dev / DevOps |
| **Status** | 🗓 Planned |
| **Sprint** | Sprint 3 |
| **Depends on** | — |
| **Required by** | — |

---

## User Story

> **As** the development/DevOps team, **I want** to monitor system availability and validate its behavior under load, **in order to** guarantee ≥ 95% uptime and support ≥ 100 evaluations without data loss during the test period.

---

## Acceptance Criteria

### E1 — Uptime monitoring

**Given** the system is deployed in staging/production,  
**When** the test period elapses,  
**Then** a monitoring mechanism must record availability evidencing ≥ 95% uptime, with alerting on outages.

---

### E2 — Post-deploy smoke tests

**Given** a deploy is executed,  
**When** the pipeline finishes,  
**Then** smoke tests must run that verify critical endpoints (including `POST /score`) respond correctly.

---

### E3 — Load test

**Given** ≥ 100 evaluations are simulated,  
**When** the load test is run against Supabase,  
**Then** the system must process them without data loss or degradation that prevents showing the score within the defined limit.

---

## Notes

- Directly operationalizes the RNF **Uptime**, **Scalability**, and **Response time** attributes — see [[../AtributosDeCalidad\|Atributos de calidad]].
- Mitigates the risk **"Dependency on external services"** — see [[../Riesgos\|Riesgos técnicos]].
