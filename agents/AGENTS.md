# AGENTS.md - ScoreLeads MVP

## Contexto del proyecto
ScoreLeads es un mini MVP web para preevaluación financiera de leads inmobiliarios. El usuario ingresa datos básicos y el sistema calcula una clasificación preliminar: Alto, Medio o Bajo.

## Alcance del MVP
Implementar solo:
- formulario web
- cálculo de scoring
- clasificación del usuario
- explicación breve del resultado
- recomendaciones básicas

No implementar:
- login
- OCR
- CRM
- APIs externas
- aprobación bancaria real
- base de datos compleja

## Stack
Frontend: React
Backend: FastAPI + Python
Base de datos: opcional. Si complica, usar solo memoria/local.

## Reglas de desarrollo
- Mantener código simple y entendible.
- Explicar cada archivo creado.
- No agregar dependencias innecesarias.
- Priorizar que el MVP funcione localmente.
- Separar frontend y backend.
- El scoring debe estar en una función clara y modificable.
- No usar datos reales sensibles.
- No almacenar credenciales ni documentos.

## Reglas de scoring iniciales
- Si ingreso mensual >= 4 veces el dividendo esperado, suma puntos.
- Si deuda mensual supera el 40% del ingreso, baja el score.
- Si ahorro disponible es alto, suma puntos.
- Contrato indefinido suma puntos.
- Independiente o plazo fijo genera cautela.
- Complementar renta mejora levemente el resultado.

## Resultado esperado
El sistema debe entregar:
- score de 0 a 100
- clasificación: Alto, Medio o Bajo
- factores positivos
- factores de riesgo
- recomendaciones