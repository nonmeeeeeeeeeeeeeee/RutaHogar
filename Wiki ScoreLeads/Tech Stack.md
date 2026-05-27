# Tech Stack — ScoreLeads

> Fuente: Entregable 1 (Justificación de Propuesta de Solución) y Entregable 2 (Historias de Usuario Corregidas).

---

## Arquitectura general

ScoreLeads utiliza una arquitectura web de tres capas separadas: **frontend**, **backend** y **persistencia de datos**. El diseño prioriza la velocidad de prototipado para el MVP, evitando dependencias externas complejas en la primera fase.

---

## Frontend

| Tecnología | Rol |
| :--------- | :-- |
| **React** | Framework principal para la interfaz de usuario |

**Justificación:** Permite construir interfaces dinámicas de forma rápida, como formularios guiados, visualización del score y recomendaciones personalizadas. Se prefiere React sobre Angular para el MVP debido a su mayor rapidez para prototipar.

---

## Backend

| Tecnología | Rol |
| :--------- | :-- |
| **FastAPI** | Framework web para la API REST |
| **Python** | Lenguaje principal del backend |
| **Node.js** | Mencionado como alternativa/complemento |

**Justificación:** FastAPI con Python se encarga de recibir los datos enviados desde el formulario, aplicar las reglas de scoring, clasificar al lead y generar recomendaciones. Python facilita el trabajo con reglas de negocio, procesamiento de datos y una eventual evolución hacia modelos más avanzados de análisis.

---

## Base de datos

| Tecnología | Rol |
| :--------- | :-- |
| **Supabase** | Plataforma de base de datos administrada |
| **PostgreSQL** | Motor de base de datos relacional |

**Justificación:** Se almacenarán los datos mínimos necesarios del usuario: respuestas del formulario, score obtenido, clasificación asignada y fecha de evaluación. Supabase acelera el desarrollo del MVP al entregar una base PostgreSQL administrada, panel de gestión y posibilidades futuras de autenticación.

**Datos almacenados por evaluación:**
- Fecha de evaluación
- Score obtenido
- Clasificación asignada (Alto / Medio / Bajo)
- Explicación generada por IA

---

## Inteligencia Artificial

| Tecnología | Rol |
| :--------- | :-- |
| **Claude Code** | Apoyo al desarrollo, documentación y generación de componentes |
| **Agente IA / LLM** | Explicación personalizada del score al usuario (HdU 3) |

**Nota:** Las herramientas de IA generativa no forman parte crítica de la arquitectura del sistema en el MVP. Su rol principal es asistir al equipo de desarrollo y generar las explicaciones textuales del scoring para el usuario final.

---

## Integraciones futuras (post-MVP)

Estas tecnologías **no forman parte del MVP**. Se evaluarán en fases posteriores una vez validada la solución base.

| Tecnología / Servicio | Fase | Propósito |
| :-------------------- | :--- | :-------- |
| **OCR** | Fase 2 | Procesar documentos subidos voluntariamente por el usuario (liquidaciones, certificados) para reforzar la confiabilidad del perfil |
| **API CMF** | Fase 2+ | Incorporar datos externos para mejorar la precisión del modelo de scoring |
| **Dicom / Historial crediticio** | Fase 2+ | Validación crediticia más precisa |
| **CRM de la inmobiliaria** | Fase 2 | Integración para replicar leads calificados (score Alto) directamente en el flujo comercial (HdU 5) |

---

## Seguridad

- Cifrado en tránsito y en almacenamiento
- Control de acceso basado en roles (cada actor solo visualiza los datos necesarios para su función)
- Sin solicitud de credenciales bancarias ni documentos sensibles en el MVP
- HTTPS obligatorio
- Datos utilizados exclusivamente para fines de evaluación; no se comparten con terceros sin autorización explícita del usuario
- Consentimiento explícito del usuario antes del envío de datos (criterio de aceptación obligatorio, HdU 1 — E3)

---

## Resumen de decisiones de diseño

| Decisión | Elección | Descartado | Razón |
| :------- | :------- | :--------- | :---- |
| Framework frontend | React | Angular | Mayor rapidez para prototipar en MVP |
| Lenguaje backend | Python + FastAPI | — | Facilita reglas de negocio y futura evolución hacia ML |
| Base de datos | Supabase + PostgreSQL | — | BD administrada, panel de gestión, auth futura incluida |
| Integraciones externas (MVP) | Ninguna | CMF, Dicom, CRM | Mantener viabilidad técnica y simplicidad del MVP |
| Fuente de datos (MVP) | Datos autodeclarados por el usuario | APIs bancarias | Evitar dependencias externas restringidas en fase inicial |
