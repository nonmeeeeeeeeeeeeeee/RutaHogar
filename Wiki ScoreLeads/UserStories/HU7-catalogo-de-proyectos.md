# HU 7 - Gestión del catálogo de proyectos inmobiliarios

> **🗓 Planificada - Sprint 1.** Permite al administrador inmobiliario registrar y mantener un catálogo de proyectos y vincularlos con ejecutivos, para que el sistema recomiende leads según los proyectos realmente disponibles.

---

## Resumen

| Campo | Valor |
| :---- | :---- |
| **Categoría** | Esencial |
| **Puntos de Historia** | 5 |
| **Actor** | Administrador inmobiliario |
| **Sprint** | Sprint 1 |
| **Estado** | 🗓 Planificada |

---

## Historia de usuario

> **Como** administrador inmobiliario, **quiero** registrar y mantener un catálogo de proyectos inmobiliarios y vincularlos con ejecutivos, **para** que el sistema pueda recomendar leads según los proyectos realmente disponibles.

---

## Criterios de aceptación

### E1 - Creación de proyecto

**Dado** que el administrador accede al panel de proyectos, **cuando** ingresa nombre, inmobiliaria, comuna, tipo, rango de precio y estado, **entonces** el sistema debe guardar el proyecto en el catálogo.

### E2 - Validación de datos

**Dado** que el administrador inmobiliario crea o edita un proyecto, **cuando** ingresa datos obligatorios incompletos o precios inconsistentes, **entonces** el sistema debe impedir guardar hasta corregirlos.

### E3 - Vinculación con ejecutivos

**Dado** que existe un proyecto en el catálogo, **cuando** el administrador asigna ejecutivos, **entonces** esos ejecutivos deben quedar vinculados al proyecto.

### E4 - Estado del proyecto

**Dado** que un proyecto está marcado como agotado, **cuando** se ejecute el matching, **entonces** no debe generar nuevas recomendaciones.

---

## Notas

- Plan de implementación: `docs/stories/HU7-catalogo-de-proyectos/PLAN.md`.
- Este catálogo es la fuente de datos del motor de matching ([[HU10-matching-lead-proyecto|HU 10]]) y de la cotización por proyecto ([[HU9-cotizacion-orientativa|HU 9]]).
- Los atributos de proyecto (comuna, rango de precio, tipo) se alinean con `PRECIOS_REFERENCIA_UF` del motor de scoring.

---

## Estado frente al código

Verificación criterio por criterio contra el código entregado. ✅ implementado · ⚠️ parcial · ❌ no implementado.

| Criterio | Estado | Evidencia |
| :------- | :----- | :-------- |
| `E1` | ❌ | No existe panel de proyectos ni persistencia. El catálogo es `frontend/src/data/mockProjects.js`, 8 proyectos fijos en código. |
| `E2` | ❌ | Sin formulario de creación o edición, no hay validación que impedir. |
| `E3` | ❌ | No existe vinculación de ejecutivos a proyectos en el modelo de datos. |
| `E4` | ❌ | `mockProjects.js` tiene un campo `estado`, pero ningún flujo de matching lo consume para excluir proyectos agotados. |

> Esta tabla se revisa cuando cambia el código de la historia. Un criterio sin evidencia citable
> es un criterio no verificado, no un criterio cumplido.
