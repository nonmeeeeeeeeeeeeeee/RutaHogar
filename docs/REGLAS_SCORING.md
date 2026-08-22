# Reglas de scoring — RutaHogar

Este documento es el punto central para registrar reglas financieras, criterios de scoring, umbrales, formulas y decisiones de negocio asociadas al motor de evaluacion.

## Estado actual

No se agregan ni modifican reglas de scoring en esta actualizacion documental.

## Uso esperado

Actualizar este archivo solo cuando el equipo trabaje una HU o cambio que afecte:

- scoring financiero;
- clasificacion del lead;
- bloqueadores financieros;
- simulaciones de compatibilidad;
- matching lead-proyecto;
- beneficios habitacionales usados como regla o recomendacion;
- cambios al contrato `POST /score`.

## Guardrails

- No inventar umbrales financieros durante la implementacion.
- No reemplazar reglas auditables por decisiones de IA.
- La IA puede explicar resultados calculados, pero no decidir el score.
- Todo resultado financiero debe mantenerse como referencial.
- Cualquier regla nueva debe indicar fuente, justificacion y alcance.

