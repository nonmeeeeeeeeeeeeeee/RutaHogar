# HU7 - Cambios en el Backend (Plan de Mejora)

Para cumplir con los Criterios de Aceptación E2, E3 y preparar el terreno para E4 (Beneficio Esperado), se refactorizó la función `generate_improvement_plan` en `backend/app/scoring.py`.

## Estructura Anterior
La función generaba y devolvía una lista plana de strings (List[str]):
```python
[
  "Regulariza o aclara compromisos pendientes antes de iniciar una evaluación formal.",
  "Define una meta mensual de ahorro y separa esos fondos apenas recibas tus ingresos."
]
```

## Nueva Estructura Implementada
Ahora la función devuelve una lista de diccionarios (List[Dict[str, Any]]), donde cada recomendación está categorizada, valorizada según su impacto, y detalla el beneficio esperado:
```python
[
  {
    "category": "Deuda",
    "description": "Regulariza o aclara compromisos pendientes antes de iniciar una evaluación formal.",
    "impact_level": "Alto",
    "impact_score": 3,
    "expected_benefit": "Mejora inmediata del score y viabilidad bancaria."
  },
  {
    "category": "Ahorro",
    "description": "Define una meta mensual de ahorro y separa esos fondos apenas recibas tus ingresos.",
    "impact_level": "Alto",
    "impact_score": 3,
    "expected_benefit": "Aumenta el pie disponible y reduce el monto de crédito a solicitar."
  }
]
```

## Detalles de los Campos
- **category**: String que indica el área de la recomendación (`Ahorro`, `Deuda`, `Continuidad Laboral`, `Objetivo Inmobiliario`, `Deuda Co-deudor`, etc.). Responde a **E2**.
- **description**: El texto de la recomendación que ya existía.
- **impact_level**: Etiqueta para frontend (`Alto`, `Medio`, `Bajo`). Responde a **E3**.
- **impact_score**: Valor numérico (`3`, `2`, `1`) utilizado internamente para ordenar la lista de forma descendente, asegurando que las recomendaciones de impacto "Alto" aparezcan primero. Responde a **E3**.
- **expected_benefit**: Texto que explica qué ganará el usuario al aplicar esta recomendación. Responde a **E4**.

## Ordenamiento y Duplicados
Se reemplazó el uso de la función interna `_unique()` para esta lista, ya que los diccionarios no son "hashables" nativamente. Ahora el filtrado de duplicados y el ordenamiento por impacto (de mayor a menor) ocurren directamente dentro de `generate_improvement_plan`.
