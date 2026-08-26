# HU 2 - Priorización de leads calificados

> **✅ Implementada - PMV.** Entrega al ejecutivo comercial una vista priorizada y asistida por IA de los leads precalificados. En vez de una lista cruda de contactos, el ejecutivo ve a quien llamar primero, por que, y que acción tomar.

---

## Resumen

| Campo | Valor |
| :---- | :---- |
| **Categoría** | Compleja |
| **Puntos de Historia** | 5 |
| **Actor** | Ejecutivo comercial |
| **Sprint** | PMV |
| **Estado** | ✅ Implementada |

---

## Historia de usuario

> **Como** ejecutivo comercial inmobiliario, **quiero** visualizar una cartera de leads precalificados y priorizados con apoyo de IA, **para** concentrar mi tiempo en los prospectos con mayor probabilidad de avanzar en el proceso de compra y entender rapidamente el contexto financiero de cada lead.

---

## Criterios de aceptación

### E1 - Priorización de leads con score alto

**Dado** que el sistema ha procesado el scoring financiero de múltiples prospectos, **cuando** el ejecutivo comercial accede al panel principal, **entonces** los leads con clasificación "Alto" deben aparecer automáticamente al inicio de la lista.

### E2 - Indicadores visuales y explicación inteligente

**Dado** que un lead tiene un score asignado, **cuando** el ejecutivo selecciona un lead específico, **entonces** el sistema debe mostrar un resumen visual de los indicadores (carga financiera, estabilidad, etc.) y la explicación inteligente generada para justificar ese score.

### E3 - Filtro por nivel de prioridad

**Dado** que el ejecutivo necesita organizar su día, **cuando** usa la herramienta de filtro, **entonces** el sistema debe permitir segmentar la vista por categorias Alto, Medio o Bajo de forma inmediata.

### E4 - Acción comercial sugerida

**Dado** que el ejecutivo revisa el perfil de un lead priorizado, **cuando** visualiza el detalle del scoring, **entonces** el sistema debe desplegar una etiqueta de acción sugerida (por ejemplo "Contactar de inmediato", "Mantener en seguimiento" o "Solicitar más información") según el nivel de preparación del lead.

---

## Notas

- Esta historia evita deliberadamente la integración con CRM (eso es [[HU12-derivacion-comercial|HU 12]]). El dashboard es autocontenido.
- El resumen asistido por IA de E2 lo genera la misma capa de explicación que [[HU3-scoring-hibrido|HU 3]]; no se requiere un modelo aparte.
- El rol de ejecutivo se aplica a nivel de routing: solo usuarios con rol `sales` acceden al dashboard de leads.
- La versión móvil de este dashboard se documenta como [[../RNF/RNF7-dashboard-movil-ejecutivo|RNF 7]].
