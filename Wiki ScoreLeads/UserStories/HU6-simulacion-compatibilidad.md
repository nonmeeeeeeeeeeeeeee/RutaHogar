# HU 6 - Simulación de compatibilidad y alternativas accesibles

> **✅ Implementada - Sprint 1.** Permite al lead simular distintos objetivos, valores, comunas, plazos y configuraciones para descubrir que alternativas son compatibles con su perfil actual.

---

## Resumen

| Campo | Valor |
| :---- | :---- |
| **Categoría** | Esencial |
| **Puntos de Historia** | 8 |
| **Actor** | Lead |
| **Sprint** | Sprint 1 |
| **Estado** | ✅ Implementada |

---

## Historia de usuario

> **Como** usuario interesado en comprar una vivienda, **quiero** simular distintos objetivos, valores, comunas, plazos y configuraciones, **para** descubrir que alternativas son compatibles con mi perfil actual.

---

## Criterios de aceptación

### E1 - Simulación de valores de vivienda

**Dado** que el usuario ya completó su evaluación, **cuando** ingrese distintos valores de vivienda, **entonces** el sistema debe mostrar si cada escenario es compatible con su capacidad de compra.

### E2 - Ajustes mínimos para acceder

**Dado** que el usuario no califica para su objetivo declarado, **cuando** el usuario quiera evaluar otros objetivos con sus resultados, **entonces** el sistema debe proponer distintas alternativas que sean lo más accesibles para este usuario.

### E3 - Estimación de capacidad de compra

**Dado** que el usuario recibió su evaluación, **cuando** visualice el resultado, **entonces** el sistema debe mostrar el valor máximo estimado de vivienda que podría financiar.

### E4 - Tiempo máximo de respuesta

**Dado** que el usuario realiza la simulación de compatibilidad, **cuando** este termine, **entonces** no tiene que exceder un tiempo de respuesta de 30 segundos.

---

## Notas

- Plan de implementación: `docs/stories/HU6-simulacion-compatibilidad/PLAN.md` y `REGLAS_HU6.md`.
- El primitivo `capacidad_compra_estimada` está especificado en [Spike 1 - E4](../../docs/research/spike1-e4-lead-project-matching-criteria.md); reutilizarlo en vez de definir una segunda fórmula de capacidad.
- Alimenta el mapa de accesibilidad ([[HU21-mapa-accesibilidad|HU 21]]) y complementa [[HU18-simulador-escenarios-hipotecarios|HU 18]], [[HU26-simulacion-subsidios|HU 26]] y [[HU29-comparador-costo-credito|HU 29]].
