# Explicaciones IA del score

El módulo `backend/app/ai.py` genera tres textos con lenguaje natural a partir del resultado del scoring. Cada texto tiene una audiencia distinta y un propósito diferente.

---

## Textos generados

| Función | Campo en la respuesta | Audiencia | Propósito |
| :------ | :-------------------- | :-------- | :-------- |
| `generate_user_explanation` | `ai_explanation` | Cliente (usuario) | Explica en segunda persona qué factores influyeron en su evaluación |
| `generate_executive_summary` | `executive_summary` | Ejecutivo comercial | Resumen del perfil del lead para priorización |
| `generate_commercial_guidance` | `commercial_guidance` | Ejecutivo comercial | Acción comercial concreta recomendada (Contactar pronto, Agendar reunión, etc.) |

---

## Proveedor LLM

Las tres funciones llaman a `_ask_groq`, un wrapper interno que usa **llama-3.1-8b-instant** vía la API de Groq.

- Requiere `GROQ_API_KEY` en `backend/.env`.
- Si la clave no existe o Groq no está instalado, devuelve un string de fallback sin lanzar excepción — el resto del resultado del score sigue siendo válido.
- Temperatura: `0.4` (respuestas consistentes, con algo de variación natural).
- El texto generado pasa por `_clean_generated_text`, que normaliza espacios, puntuación doble y tildes faltantes en palabras clave.

---

## `generate_user_explanation` — explicación para el cliente

### Inputs

| Parámetro | Origen |
| :-------- | :----- |
| `classification` | `"Alto"` / `"Medio"` / `"Bajo"` — resultado del scoring |
| `score` | Puntaje numérico 0–100 |
| `positive_indicators` | Lista de strings generada por `calculate_score` |
| `risks` | Lista de strings de riesgos detectados por `calculate_score` |
| `extra_context` | Dict con campos adicionales del formulario (ver abajo) |

### Extra context — campos del formulario

Campos que no afectan el score pero sí enriquecen la explicación al cliente:

| Clave | Qué es | Cuándo se incluye |
| :---- | :----- | :---------------- |
| `edad` | Edad calculada desde `birthDate` | Siempre que esté disponible |
| `plazo_credito_hipotecario` | Plazo en años elegido en el formulario | Siempre que esté disponible |
| `morosidad_actual` | `"si"` / `"no"` | Siempre |
| `monto_morosidad` | Monto CLP de deuda morosa | Solo si `morosidad_actual == "si"` |
| `antiguedad_morosidad` | Rango de antigüedad de la morosidad | Solo si `morosidad_actual == "si"` |
| `patrimonio_total_clp` | Suma de vehículos + inmuebles convertida a CLP | Solo si `declara_patrimonio == true` |
| `property_value_clp` | Valor estimado de la vivienda en CLP | Si el usuario lo ingresó |

La edad sumada al plazo se incluye explícitamente en el prompt cuando supera 70 años, para que el modelo mencione el riesgo de seguro de desgravamen. El patrimonio declarado se menciona como fortaleza del perfil. La antigüedad de la morosidad se traduce a etiqueta legible antes de enviarse al prompt.

### Comportamiento del prompt

El prompt instruye al modelo a:
1. Redactar un párrafo único de 80–120 palabras.
2. Hablar en segunda persona (tú), tono empático, sin tecnicismos.
3. Mencionar lo positivo, luego los riesgos de forma constructiva.
4. No mencionar el puntaje exacto ni los umbrales del sistema.
5. Incorporar los datos del `extra_context` cuando estén disponibles.

Al final del texto generado se agrega siempre el disclaimer:

> Esta preevaluación es orientativa y no reemplaza una evaluación bancaria formal.

---

## `generate_executive_summary` — resumen ejecutivo

Recibe `classification`, `score`, `positive_indicators` y `risks`. Genera un párrafo de máximo 100 palabras dirigido al ejecutivo comercial explicando por qué el lead obtuvo esa clasificación y qué tan preparado está para avanzar en un proceso hipotecario. No habla en primera persona ni al cliente.

---

## `generate_commercial_guidance` — acción comercial

Recibe además `recommendations`. Devuelve un texto con formato fijo:

```
Acción: [nombre de la acción]
Motivo: [explicación en máximo 30 palabras]
```

Las acciones posibles son del estilo: "Contactar pronto", "Agendar reunión", "Mantener seguimiento", "Recontactar en algunos meses".

---

## Flujo de llamadas

```
POST /score
  → calculate_score(data)          # scoring.py
      → generate_user_explanation  # ai.py — para el cliente
      → generate_improvement_plan  # scoring.py — plan de mejora
      → generate_executive_summary # ai.py — para el ejecutivo
      → generate_commercial_guidance # ai.py — acción comercial
  ← result (score + clasificacion + textos IA)
```

`risk_codes` se elimina del resultado antes de devolverlo al frontend — es un artefacto interno de scoring usado solo para generar los textos.

---

## Archivos involucrados

| Archivo | Rol |
| :------ | :-- |
| `backend/app/ai.py` | Tres funciones de generación + wrapper Groq + limpieza de texto |
| `backend/app/scoring.py` | Orquesta las llamadas, computa `patrimonio_total_clp`, arma `extra_context` |
| `frontend/src/components/Result.jsx` | Muestra `ai_explanation` al cliente |
| `frontend/src/components/DashboardLeads.jsx` | Muestra `executive_summary` y `commercial_guidance` al ejecutivo |
