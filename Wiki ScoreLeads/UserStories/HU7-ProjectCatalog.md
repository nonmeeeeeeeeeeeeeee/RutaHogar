# HU 7 — Real Estate Project Catalog Management

> 🔜 **Sprint 1.** Lets a real estate admin register and maintain a catalog of projects and link them to executives, so the system can recommend leads against projects that are actually available.

---

## Overview

| Field | Value |
| :---- | :---- |
| **Category** | Essential |
| **Story Points** | 5 |
| **Actor** | Real Estate Admin |
| **Status** | 🔜 Sprint 1 |
| **Sprint** | Sprint 1 |
| **Depends on** | — |
| **Required by** | [[HU13-LeadProjectMatching\|HU 13]] |

---

## User Story

> **As** a real estate admin, **I want** to register and maintain a catalog of real estate projects and link them to executives, **in order to** let the system recommend leads according to the projects that are actually available.

---

## Dependencies

Why this story cannot be completed before each of the following. Tags: `documented` = stated in the wiki; `inferred` = derived from the acceptance criteria or the code, see [[../dependency-analysis|dependency analysis]].

_None — this story has no upstream dependencies._

---

## Acceptance Criteria

### E1 — Project creation

**Given** the admin accesses the projects panel,  
**When** they enter name, real estate company, comuna, type, price range, and status,  
**Then** the system must save the project in the catalog.

---

### E2 — Data validation

**Given** the real estate admin creates or edits a project,  
**When** they enter incomplete required data or inconsistent prices,  
**Then** the system must prevent saving until corrected.

---

### E3 — Linking with executives

**Given** a project exists in the catalog,  
**When** the admin assigns executives,  
**Then** those executives must remain linked to the project.

---

### E4 — Project status

**Given** a project is marked as sold out,  
**When** matching is executed,  
**Then** it must not generate new recommendations.

---

## Notes

- This catalog is the data source for the matching engine in [[HU13-LeadProjectMatching\|HU 13]]. The frozen contract it exposes is documented in `docs/project-catalog-contract.md`; matching criteria are in [[../research/spike1-e4-lead-project-matching-criteria|Spike 1 · E4]].
- Prices are stored **in UF** (`precio_min_uf` / `precio_max_uf`). They do **not** derive from `PRECIOS_REFERENCIA_UF`: matching is preference-independent and never reads that table (Spike 1 E4 §1, §2). A project's comuna is only compared against the lead's declared `comuna_objetivo` — an affinity penalty, never a gate.
- E4 is satisfied by excluding `agotado` from the matching feed. `en_construccion` **is** recommended: *venta en verde* is a real part of the market.
- **Future extension — unit/typology prices.** A project is really sold as typologies (1D, 2D, 3D…) with distinct prices and availability; today that is summarized as a price range, which is what E1 asks for. Adding a `proyecto_tipologias` child table would make `precio_min_uf` / `precio_max_uf` derived (`MIN`/`MAX` over sellable units) **without changing the frozen contract**, and would also fix the current single-`tipo`-per-project limitation for mixed developments. Recorded as a follow-up (catalog v2), not scope for this story.
