# Deuda Técnica — RutaHogar

Registro de decisiones tomadas conscientemente que implican un riesgo técnico o de seguridad a resolver en el futuro.

---

## CORS abierto en el backend (`allow_origins=["*"]`)

**Archivo:** `backend/app/main.py`
**Decisión:** Mantener `allow_origins=["*"]` temporalmente para simplificar el despliegue inicial.
**Riesgo:** Cualquier origen puede hacer peticiones al endpoint `/score`. En producción esto no es un problema crítico dado que el endpoint no expone datos sensibles, pero sí es una superficie de abuso.

**Acción pendiente:** Una vez estabilizado el dominio de producción en Vercel, reemplazar:
```python
allow_origins=["*"]
```
por:
```python
allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")]
```
y agregar `CORS_ORIGIN=https://tu-dominio.vercel.app` como variable de entorno en el proyecto backend de Vercel.

---
