# HdU 6 — Stress Algorithm

> ⏸ **Out of scope for the current MVP.** Documented here for future planning. Do not implement without explicit team instruction.

Lets the user simulate how macroeconomic changes — rising interest rates or UF fluctuations — would affect their purchasing capacity, giving them a realistic picture of financial risk before committing to the purchase process.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Desirable |
| **Story Points** | 5 |
| **Actor** | Lead |
| **Status** | ⏸ Deferred |
| **Depends on** | [[HdU3-HybridScoring\|HdU 3]] |
| **Required by** | — |

---

## User Story

> **As** a person interested in buying a home, **I want** to visualize how changes in economic factors such as interest rates or UF could affect my purchasing capacity, **in order to** understand the financial risks associated with a mortgage loan before starting the purchase process.

---

## Acceptance Criteria

### E1 — Show variation in purchasing capacity

**Given** the user has already received their financial assessment result,  
**When** they choose to view alternative economic scenarios,  
**Then** the system must show how their purchasing capacity would change under a simulated interest rate increase.

---

### E2 — Show variation in financing capacity

**Given** the user is viewing their assessment result,  
**When** the system processes a simulated UF variation,  
**Then** it must display an estimated change in the user's financing capacity.

---

### E3 — Show differences between current and simulated scenarios

**Given** the user is reviewing the financial simulation,  
**When** the system presents the different scenarios,  
**Then** it must clearly display the difference between the current scenario and the simulated scenarios.

---

## Notes

- This feature requires access to current UF and interest rate data, likely from an external source (e.g. CMF or Banco Central API). That integration is explicitly out of scope per `CLAUDE.md`.
- The stress simulation should be purely presentational — it must not overwrite the user's stored score or classification.
- When implemented, the UF reference value used in `scoring.py` (`PRECIOS_REFERENCIA_UF`) will need to be updated alongside. Do not modify those values without business context.
