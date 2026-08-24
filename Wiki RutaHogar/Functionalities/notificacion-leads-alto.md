# Notificación de leads Alto al ejecutivo

Cuando un usuario completa una preevaluación y obtiene clasificación **Alto**, el sistema notifica al ejecutivo comercial en tiempo real mediante un toast en la esquina inferior derecha de la pantalla.

---

## Comportamiento

### Al iniciar sesión (carga inicial)

Al autenticarse, el ejecutivo recibe un conteo de leads Alto que aún no ha visto. Un lead se considera "no visto" si:

- `profiles.last_lead_seen_at` del ejecutivo es `null` (primera vez) → **todos** los leads Alto cuentan.
- `profiles.last_lead_seen_at` tiene un valor → solo cuentan los leads con `evaluations.created_at > last_lead_seen_at`.

Los leads creados por el propio ejecutivo son excluidos del conteo (`ev.user_id !== userId`).

### En tiempo real (sesión activa)

Mientras el ejecutivo tiene la sesión abierta, el sistema escucha eventos `INSERT` en la tabla `evaluations` vía Supabase Realtime. Cada nuevo lead con `classification === 'Alto'` incrementa el contador sin necesidad de recargar la página.

El DashboardLeads también se actualiza automáticamente: la nueva fila aparece en la tabla al instante. Los datos del evento Realtime se normalizan con `normalizeEvaluation` antes de agregarse al estado.

---

## Marcar leads como vistos

### Navegando a `/leads`

Cuando el ejecutivo navega a la página de leads, un `useEffect` en `App.jsx` llama automáticamente a `markLeadsSeen()`:

```js
useEffect(() => {
  if (page === "leads" && profile?.role === roles.sales) markLeadsSeen();
}, [page]);
```

### Cerrando el toast (botón ×)

`handleDismissNotification` también llama a `markLeadsSeen()` — el ejecutivo puede descartar sin navegar y la notificación no vuelve a aparecer.

### `markLeadsSeen()` internamente

1. Resetea `newHighLeadsCount` a 0 (toast desaparece).
2. Llama a `updateLastLeadSeenAt(userId)` — escribe `now()` en `profiles.last_lead_seen_at` en Supabase.
3. Llama a `updateStoredProfile({ ...profile, last_lead_seen_at: ... })` — sincroniza el perfil en `localStorage` para que la próxima carga use el timestamp correcto sin un fetch extra.

El estado de "visto" es persistente entre dispositivos y sesiones gracias a Supabase.

---

## Componentes involucrados

| Archivo | Responsabilidad |
| :------ | :-------------- |
| `hooks/useLeads.js` | Carga inicial, suscripción realtime, conteo, `markLeadsSeen`, `dismissToastLocally` |
| `components/NotificationToast.jsx` | Toast visual — renders `null` si `count <= 0` |
| `services/profileService.js` | `updateLastLeadSeenAt(userId)` — escribe en Supabase |
| `services/auth.js` | `updateStoredProfile(profile)` — sincroniza localStorage |
| `App.jsx` | `useEffect([page])` que llama `markLeadsSeen()` al entrar a `/leads`; `handleDismissNotification` |

---

## Configuración requerida en Supabase

Para que los eventos de Realtime funcionen, la tabla `evaluations` debe estar correctamente configurada:

```sql
-- Necesario para RLS + Realtime: incluye la fila completa en los eventos de cambio
alter table public.evaluations replica identity full;

-- Agrega la tabla a la publicación que escucha el servicio de Realtime
alter publication supabase_realtime add table public.evaluations;
```

Estos comandos están incluidos en `supabase/schema.sql`. Si se despliega desde cero, se aplican automáticamente. Si la base de datos ya existía antes de esta configuración, deben ejecutarse manualmente en el SQL Editor de Supabase.

---

## Campo `last_lead_seen_at` en `profiles`

Columna agregada para persistir el estado de notificación por usuario ejecutivo.

| Campo | Tipo | Nullable | Descripción |
| :---- | :--- | :------- | :---------- |
| `last_lead_seen_at` | `timestamptz` | YES | Timestamp de la última vez que el ejecutivo visitó `/leads` o descartó el toast. Null = nunca ha visto leads. |

Migración para instancias existentes:

```sql
alter table public.profiles
add column if not exists last_lead_seen_at timestamptz;
```

---

## Campo `created_at` en `evaluations`

El campo `created_at` es crítico para el filtrado de leads nuevos. El cliente lo establece explícitamente en `buildRow()` (`evaluationService.js`) para garantizar que siempre tenga valor, independientemente del `DEFAULT` de la base de datos.

Si existen registros con `created_at = null` (evaluaciones anteriores a esta implementación), ejecutar:

```sql
update public.evaluations
set created_at = now()
where created_at is null;
```

---

## Notas

- La suscripción realtime solo se activa para usuarios con rol `sales` o `admin` (`isStaff`).
- `dismissToastLocally()` existe para resetear el contador solo en memoria (sin llamada a Supabase). Útil si se necesita limpiar el toast sin marcar los leads como vistos permanentemente.
- Si el ejecutivo está en `/leads` cuando llega un lead nuevo, el DashboardLeads lo muestra automáticamente y el toast también aparece brevemente. El `useEffect([page])` limpiará el conteo inmediatamente al entrar a `/leads`.
