# QA — ScoreLeads MVP

Validación 100% manual (sin test suite).

## Smoke test

1. `cd backend && .venv\Scripts\uvicorn app.main:app --reload --port 8000`
2. `cd frontend && npm run dev`
3. Abrir `http://localhost:5173`, verificar carga sin errores en consola.

## Flujo completo offline (sin Supabase)

1. Registrarse en AuthPanel (modo localStorage)
2. Completar Onboarding (comuna + plazo + tipo propiedad)
3. Aceptar DataConsent
4. Llenar ScoreForm con datos válidos → enviar
5. Verificar Result + Recommendations
6. Verificar ProfilePage: historial de evaluaciones + scoring_history

## Casos de clasificación

| Perfil | Score esperado |
|--------|---------------|
| Ingreso alto (≥4× dividendo), sin deuda, ahorro alto, indefinido, sin morosidad | **Alto** (≥70) |
| Ingreso medio, deuda moderada, plazo fijo | **Medio** (40-69) |
| Ingreso bajo, deuda alta, sin ahorro, morosidad sí reciente (<12m) | **Bajo** (<40) |

## Contrato y continuidad

| Contrato | Impacto |
|----------|---------|
| indefinido | +10 |
| plazo_fijo | **−18** |
| honorarios_variable | **−10** |
| independiente sin continuidad | −5 |
| independiente con continuidad >1a | sin penalización |

## Morosidad con antigüedad

| Morosidad | Antigüedad | Impacto |
|-----------|-----------|---------|
| sí | <12 meses | **−35** |
| sí | ≥12 meses | **−25** |
| no_lo_se | — | −12 |

## Complemento de renta con co-deudor

| Situación | Impacto |
|-----------|---------|
| Perfil limpio (sin morosidad, deuda ≤ 40%, indefinido, continuidad >1a, relación no débil) | **+10** |
| Morosidad "sí" | −20 |
| Deuda > 40% ingreso | −15 |
| Plazo fijo | −10 |
| Continuidad < 6m | −10 |
| Honorarios/independiente sin continuidad | −5 |
| Relación débil (`amigo` / `otro`) | **−5**, no suma a capacidad |
| Sin datos (todos vacíos) | −5 |

## ARCO requests

- Probar crear solicitudes de acceso, rectificación, cancelación.
- Verificar que usuario ve solo sus propias solicitudes.
- Admin puede ver y actualizar estado de todas.

## Scoring history

- Cada `createEvaluation()` debe crear un registro inmutable en `scoring_history`.
- Verificar que aparecen en ProfilePage → "Historial inmutable (auditoría)".
- Datos mostrados: score, clasificación, comuna, canal, versión algoritmo, desglose componentes.
- La evaluación **no puede eliminarse** si tiene scoring_history asociado (FK con `on delete restrict`).

## Validaciones backend (POST /score directo)

- `consentimiento: false` → 422
- `ingreso_mensual: -1` → 422
- `tipo_contrato: "otro"` → 422
- `tipo_contrato: "honorarios_variable"` → 200 (válido)
- `morosidad_actual: "si"` sin `antiguedad_morosidad` → 422
- `complemento_renta: true` sin campos → 422 (desde validator Pydantic)
- Payload completo y válido → 200 con score + classification + ai_explanation

## Supabase

- Sin env vars: todo localStorage, sin errores en consola.
- Con Supabase: evaluaciones y scoring_history se guardan y aparecen en ProfilePage.
- RLS: usuario A no ve datos del usuario B. Ejecutivo ve todas.
