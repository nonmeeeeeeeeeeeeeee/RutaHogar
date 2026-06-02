# Backend — ScoreLeads MVP

FastAPI + Pydantic v2. Sin ORM, sin dependencias externas (solo fastapi, uvicorn, pydantic).

## Endpoint único

```
POST /score
```

### ScoreRequest (Pydantic model en `backend/app/main.py`)

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| ingreso_mensual | float | sí | ≥ 0 |
| deuda_mensual | float | sí | ≥ 0 |
| ahorro_disponible | float | sí | ≥ 0 |
| tipo_contrato | str | sí | indefinido / plazo_fijo / independiente |
| continuidad_laboral | str | sí | menos_6_meses / entre_6_y_12_meses / entre_1_y_3_anios / mas_3_anios |
| morosidad_actual | str | sí | si / no / no_lo_se |
| comuna_objetivo | str? | no | clave en PRECIOS_REFERENCIA_UF |
| dividendo_estimado | float | sí | ≥ 0 |
| complemento_renta | bool | no, default false | |
| complemento_nombre | str? | sí si complemento_renta | |
| complemento_monto | float? | sí si complemento_renta | ≥ 0 |
| complemento_relacion | str? | sí si complemento_renta | pareja / familiar / amigo / otro |
| complemento_ingreso_mensual | float? | sí si complemento_renta | |
| complemento_deuda_mensual | float? | sí si complemento_renta | |
| complemento_morosidad | str? | sí si complemento_renta | si / no / no_lo_se |
| complemento_tipo_contrato | str? | sí si complemento_renta | indefinido / plazo_fijo / independiente |
| complemento_continuidad_laboral | str? | sí si complemento_renta | menos_6_meses / entre_6_y_12_meses / entre_1_y_3_anios / mas_3_anios |
| complemento_tarjetas_activas | int? | sí si complemento_renta | ≥ 0 |
| consentimiento | bool | sí | debe ser true |

Validaciones con `@field_validator` y `@model_validator` (Pydantic v2).

### Scoring (`backend/app/scoring.py`)

```
calculate_score(data: Dict) -> Dict
```

- Base: 50. Clamped a [0, 100].
- Clasificación: ≥70 Alto, ≥40 Medio, <40 Bajo.
- Return: { score, classification, risks[], recommendations[], ai_explanation, improvement_plan[] }

Reglas principales:
- Ingreso ≥ 4× dividendo: +25, si no -15
- Deuda > 40% ingreso: -20
- Ahorro vs precio referencia comuna: hasta +15 o hasta -20
- Contrato indefinido: +10; independiente: -5
- Continuidad <6m: -15; 6-12m: -8; >3a: +5
- Morosidad sí: -30; no_lo_se: -12
- **Complemento renta**: evalúa co-deudor completo (morosidad, deuda, tarjetas, contrato, continuidad)

### Serverless entrypoints

Dos shims que importan `app.main` ajustando sys.path:
- `api/score.py` — para rewrite de Vercel `/score`
- `backend/api/index.py` — para deploy serverless desde `backend/`

### Precios referencia comuna

Diccionario `PRECIOS_REFERENCIA_UF` en `scoring.py` (~40 comunas). Cada valor en UF, convertido a CLP con `VALOR_UF_CLP = 45408`.
