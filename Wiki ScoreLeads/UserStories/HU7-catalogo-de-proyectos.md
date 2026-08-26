# HU 7 - Gestión del catalogo de proyectos inmobiliarios

> **⚠️ Parcial - Sprint 1.** Permite al administrador inmobiliario registrar y mantener un catalogo de proyectos y vincularlos con ejecutivos, para que el sistema recomiende leads según los proyectos realmente disponibles.

---

## Resumen

| Campo | Valor |
| :---- | :---- |
| **Categoría** | Esencial |
| **Puntos de Historia** | 5 |
| **Actor** | Administrador inmobiliario |
| **Sprint** | Sprint 1 |
| **Estado** | ⚠️ Parcial |

---

## Historia de usuario

> **Como** administrador inmobiliario, **quiero** registrar y mantener un catalogo de proyectos inmobiliarios y vincularlos con ejecutivos, **para** que el sistema pueda recomendar leads según los proyectos realmente disponibles.

---

## Criterios de aceptación

### E1 - Creación de proyecto

**Dado** que el administrador accede al panel de proyectos, **cuando** ingresa nombre, inmobiliaria, comuna, tipo, rango de precio y estado, **entonces** el sistema debe guardar el proyecto en el catalogo.

### E2 - Validación de datos

**Dado** que el administrador inmobiliario crea o edita un proyecto, **cuando** ingresa datos obligatorios incompletos o precios inconsistentes, **entonces** el sistema debe impedir guardar hasta corregirlos.

### E3 - Vinculación con ejecutivos

**Dado** que existe un proyecto en el catalogo, **cuando** el administrador asigna ejecutivos, **entonces** esos ejecutivos deben quedar vinculados al proyecto.

### E4 - Estado del proyecto

**Dado** que un proyecto está marcado como agotado, **cuando** se ejecute el matching, **entonces** no debe generar nuevas recomendaciones.

---

## Notas

- Plan de implementación: `docs/stories/HU7-catalogo-de-proyectos/PLAN.md`.
- Este catalogo es la fuente de datos del motor de matching ([[HU10-matching-lead-proyecto|HU 10]]) y de la cotización por proyecto ([[HU9-cotizacion-orientativa|HU 9]]).
- Los atributos de proyecto (comuna, rango de precio, tipo) se alinean con `PRECIOS_REFERENCIA_UF` del motor de scoring.
