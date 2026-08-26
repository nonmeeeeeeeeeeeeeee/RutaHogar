# HU 10 - Matching lead-proyecto para ejecutivos comerciales

> **⚠️ Parcial - Sprint 1.** El sistema sugiere al ejecutivo comercial los leads compatibles con los proyectos que vende, ordenados por afinidad y capacidad de compra.

---

## Resumen

| Campo | Valor |
| :---- | :---- |
| **Categoría** | Importante |
| **Puntos de Historia** | 5 |
| **Actor** | Ejecutivo comercial |
| **Sprint** | Sprint 1 |
| **Estado** | ⚠️ Parcial |

---

## Historia de usuario

> **Como** ejecutivo comercial, **quiero** que el sistema sugiera leads compatibles con los proyectos que vendo, **para** priorizar prospectos con mayor probabilidad de conversión.

---

## Criterios de aceptación

### E1 - Lista priorizada por proyecto

**Dado** que el ejecutivo selecciona un proyecto, **cuando** accede a su panel de leads, **entonces** el sistema debe mostrar usuarios compatibles ordenados por afinidad y capacidad de compra.

### E2 - Matching por capacidad

**Dado** que un usuario tiene capacidad suficiente para un proyecto, **cuando** el motor de matching lo evalua, **entonces** debe poder aparecer recomendado aunque su clasificación general no sea Alta.

### E3 - Evidencia para el ejecutivo

**Dado** que un lead aparece recomendado, **cuando** el ejecutivo revisa su tarjeta, **entonces** debe ver capacidad estimada, pie, clasificación y bloqueador principal.

### E4 - Lead reorientable

**Dado** que un usuario puede comprar un proyecto distinto a su objetivo declarado, **cuando** el sistema lo detecta, **entonces** debe mostrarlo como oportunidad reorientable.

---

## Notas

- Los criterios de matching (capacidad estimada, comuna, rango de precio, pie, clasificación, bloqueador principal) están definidos en [Spike 1 - E4](../../docs/research/spike1-e4-lead-project-matching-criteria.md), que lleva el contrato congelado contra el que se debe programar.
- Requiere el catalogo de [[HU7-catalogo-de-proyectos|HU 7]] para saber qué proyectos están disponibles.
- Complementa el dashboard priorizado [[HU2-priorizacion-leads|HU 2]] agregando una vista centrada en proyecto.
