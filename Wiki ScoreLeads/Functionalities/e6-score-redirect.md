# Redirección post-evaluación según clasificación (E6)

Implementa el criterio E6 de [[../UserStories/HdU3-HybridScoring|HdU 3]]: los leads que no califican son redirigidos automáticamente a un flujo educativo; los leads Alto van al resumen de resultado.

---

## Comportamiento

Al completar el formulario de preevaluación (`ScoreForm`), `App.jsx` redirige según la clasificación obtenida:

| Clasificación | Redirección |
| :------------ | :---------- |
| **Alto** | `home` — muestra el resultado detallado |
| **Medio** | `recommendations` — flujo de educación financiera |
| **Bajo** | `recommendations` — flujo de educación financiera |

---

## Implementación

En `handleResult` dentro de `App.jsx`:

```js
setPage(resultSnapshot.classification === "Alto" ? "home" : "recommendations");
```

La lógica de guardado en Supabase ocurre después de la redirección. Si el guardado falla, `resultSaved` queda en `false` y se muestra el error — la redirección no se revierte.

---

## Archivos involucrados

| Archivo | Cambio |
| :------ | :----- |
| `frontend/src/App.jsx` | Una línea en `handleResult` — reemplaza `setPage("home")` incondicional |
