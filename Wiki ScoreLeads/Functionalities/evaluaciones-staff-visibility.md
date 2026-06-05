# Visibilidad de evaluaciones para staff

Los usuarios con rol `sales` o `admin` pueden ver **todas** las evaluaciones del sistema, no solo las propias. Esta distinción se maneja en `evaluationService.js` y en el hook [[notificacion-leads-alto|useLeads]].

---

## Comportamiento

| Rol | Evaluaciones cargadas |
| :-- | :-------------------- |
| `user` | Solo las propias (filtro `user_id = userId`) |
| `sales` / `admin` | Todas (sin filtro de usuario) |

El filtro se aplica tanto en modo local (evaluaciones en `localStorage`) como en Supabase.

---

## Campo `email` en evaluaciones

Se agregó el campo `email` a la fila de evaluación para facilitar la identificación del lead en el DashboardLeads. Antes solo estaba disponible `user_id` (UUID), lo que dificultaba reconocer al lead sin consultar la tabla `profiles`.

El campo se completa con `profile.email` al crear la evaluación.

### Schema

```sql
-- Columna agregada a public.evaluations
email text
```

La migración está incluida en `supabase/migrations/`. Si la base de datos ya existía:

```sql
alter table public.evaluations add column if not exists email text;
```

---

## Validación UUID en evaluationService

Se agregó un helper `isUUID(id)` que valida si el `userId` pasado a `getEvaluations` / `createEvaluation` es un UUID v4 válido. Esto evita que un email o string arbitrario sea enviado como filtro a Supabase, lo que causaba errores de tipo en la query.

- Si `userId` es UUID válido → se filtra por él.
- Si `userId` es `null` (staff) → sin filtro.
- Si `userId` no es UUID (email, string local) → se usa el usuario autenticado de Supabase.

---

## `created_at` explícito en `buildRow`

Se agregó `created_at: new Date().toISOString()` en `buildRow()` para garantizar que cada evaluación tenga siempre un timestamp al crearse. Esto es crítico para el filtrado de leads nuevos en [[notificacion-leads-alto|useLeads]]: sin `created_at`, la comparación `ev.created_at > lastSeenAt` falla silenciosamente.

---

## Archivos involucrados

| Archivo | Cambio |
| :------ | :----- |
| `frontend/src/services/evaluationService.js` | Campo `email` en `buildRow` y `evaluationSelectColumns`; `getEvaluations` sin filtro para staff; helper `isUUID` |
| `frontend/src/hooks/useLeads.js` | Pasa `null` como `filterId` cuando `isStaff` es true |
| `frontend/src/App.jsx` | Pasa `isUUID(userId) ? userId : null` a `createEvaluation` |
