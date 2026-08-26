# HU 3 - Scoring hibrido con explicación inteligente

> **✅ Implementada - PMV.** El motor central de RutaHogar. Procesa los datos financieros enviados en HU 1, calcula un score de 0 a 100 con reglas parametricas, clasifica al lead y genera una explicación asistida por IA de los factores clave. Cada evaluación se guarda como registro inmutable.

---

## Resumen

| Campo | Valor |
| :---- | :---- |
| **Categoría** | Muy compleja |
| **Puntos de Historia** | 8 |
| **Actor** | Lead |
| **Sprint** | PMV |
| **Estado** | ✅ Implementada |

---

## Historia de usuario

> **Como** persona interesada en comprar vivienda, **quiero** recibir una evaluación financiera inmediata mediante un scoring hibrido con explicación inteligente, **para** entender mi nivel de preparación, los principales factores que influyen en mi resultado y los siguientes pasos recomendados antes de iniciar una evaluación formal.

---

## Criterios de aceptación

### E1 - Despliegue del resultado de la evaluación

**Dado** que el usuario completó el formulario, **cuando** envia sus datos a procesamiento, **entonces** el sistema debe mostrar el resultado del scoring en un máximo de 60 segundos tras el envio del formulario.

### E2 - Clasificación del lead por score

**Dado** que el sistema RutaHogar recibió los datos del usuario, **cuando** se ejecuta el scoring, **entonces** el resultado debe clasificar al usuario en niveles de prioridad claros (Alto, Medio, Bajo).

### E3 - Explicación asistida por IA

**Dado** que el sistema presenta el resultado de la evaluación, **cuando** el usuario visualiza su clasificación crediticia, **entonces** el sistema, mediante un agente de IA, debe mostrar una explicación detallada de los principales factores que influyeron en el score.

### E4 - Advertencia de alcance del sistema

**Dado** que el usuario visualiza su resultado, **cuando** se despliega la explicación del scoring, **entonces** el sistema debe indicar explícitamente que el score es orientativo y no reemplaza una evaluación bancaria formal.

### E5 - Trazabilidad del resultado

**Dado** que el calculo del scoring es exitoso, **cuando** el sistema guarda la evaluación, **entonces** debe generar un registro inmutable con fecha y hora, score numérico, clasificación, snapshot de entrada, versión del algoritmo y desglose por componente.

### E6 - Flujo educativo / notificación al ejecutivo

**Dado** que un lead envia sus datos financieros, **cuando** el sistema lo evalua y determina que no alcanza el score mínimo calificante, **entonces** debe poder entrar a un flujo de educación financiera sin intervención del ejecutivo; y a la inversa, si el score es Alto, el ejecutivo comercial debe ser notificado.

---

## Notas

- El motor de scoring vive en `backend/app/scoring.py` y `backend/app/scoring_engine/`. Score base 50, clampeado a [0, 100]. Umbrales: Alto >= 70, Medio >= 40, Bajo < 40.
- La capa de IA (`backend/app/ai.py`) usa Groq y solo redacta: nunca calcula ni ajusta el score (salvaguarda S1 del handbook).
- El registro inmutable de E5 corresponde a la tabla `evaluations`. Ver [[../Database/evaluations|evaluations]]. El versionado completó se expande en [[../RNF/RNF5-historial-inmutable|RNF 5]].
