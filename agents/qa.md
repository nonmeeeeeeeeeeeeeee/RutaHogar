# QA — ScoreLeads MVP

No hay test suite automatizada. Toda validación es manual.

## Escenarios de prueba

### Smoke test
1. `cd backend && .venv\Scripts\uvicorn app.main:app --reload --port 8000`
2. `cd frontend && npm run dev`
3. Abrir `http://localhost:5173` y verificar que carga sin errores en consola.

### Flujo completo sin auth (localStorage)
1. Ir directo al formulario (si hay auth, omitir login con datos locales).
2. Completar Onboarding con comuna + plazo.
3. Aceptar consentimiento en DataConsent.
4. Llenar ScoreForm con datos válidos y enviar.
5. Verificar que aparece Result con score, clasificación, riesgos y recomendaciones.

### Casos de clasificación

| Perfil | Score esperado |
|--------|---------------|
| Ingreso alto, sin deuda, ahorro alto, indefinido, sin morosidad | **Alto** (≥70) |
| Ingreso medio, deuda moderada, ahorro medio, plazo fijo | **Medio** (40-69) |
| Ingreso bajo, deuda alta, sin ahorro, morosidad sí | **Bajo** (<40) |

### Complemento de renta con co-deudor

| Co-deudor | Impacto esperado en score |
|-----------|--------------------------|
| Sin morosidad, deuda ≤ 40% ingreso, indefinido, < 3 tarjetas | **+10** (perfil limpio) |
| Morosidad "sí" | **-20** |
| Deuda > 40% ingreso | **-15** |
| ≥ 5 tarjetas activas | **-15** |
| 3-4 tarjetas activas | **-8** |
| Continuidad < 6 meses | **-10** |
| Sin datos (todos vacíos) | **-5** |

### Validaciones backend (POST /score directo)
- `consentimiento: false` → 422 "El consentimiento es obligatorio"
- `ingreso_mensual: -1` → 422 "El valor no puede ser negativo"
- `tipo_contrato: "otro"` → 422 "Tipo de contrato invalido"
- `complemento_renta: true` sin campos obligatorios del co-deudor → 422
- Payload completo y válido → 200 con score

### Supabase
- Si Supabase no está configurado, todo debe funcionar con localStorage (verificar que no haya errores en consola).
- Con Supabase configurado, verificar que evaluaciones se guardan y aparecen en ProfilePage.
- Verificar RLS: usuario A no debe ver evaluaciones del usuario B.

### Regresión
- Probar que cambios en `scoring.py` producen resultados esperados sin romper casos existentes.
- Verificar que nuevos campos opcionales no rompen requests sin complemento_renta.
