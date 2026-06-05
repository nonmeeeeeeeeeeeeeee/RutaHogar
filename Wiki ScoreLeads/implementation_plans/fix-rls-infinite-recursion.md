# Bug Report + Fix Plan — RLS Infinite Recursion (`42P17`)

**Fecha:** 2026-06-04  
**Severidad:** Crítica — bloquea login de ejecutivo/admin y guardado de evaluaciones en producción  
**Error:** `infinite recursion detected in policy for relation "profiles"` (código Postgres `42P17`)

---

## Síntomas observados

| Flujo | Comportamiento |
| :---- | :------------- |
| Login como ejecutivo | El perfil no puede leerse de Supabase. App asigna rol `usuario` por defecto → el ejecutivo ve la vista de onboarding en lugar del Dashboard Leads |
| Guardar evaluación tras submit del formulario | HTTP 500 en la inserción → "El score se calculó, pero no pudimos guardar la preevaluación" |
| Cargar historial de evaluaciones (usuario) | HTTP 500 → "No pudimos cargar el historial" |

El score **se calcula correctamente** (backend FastAPI, sin Supabase). Solo fallan las operaciones que tocan la base de datos.

---

## Causa raíz

En la base de datos live existe la siguiente policy, **que no está en `schema.sql`**:

```sql
-- Policy activa en la DB (nombre: "Profiles select staff")
CREATE POLICY "Profiles select staff"
  ON public.profiles
  FOR SELECT
  USING (
    (auth.uid() = id)
    OR
    (
      SELECT profiles_1.role
        FROM profiles profiles_1          -- ← consulta profiles desde dentro de profiles
       WHERE profiles_1.id = auth.uid()
    ) = ANY (ARRAY['ejecutivo', 'admin'])
  );
```

Una policy sobre `profiles` que a su vez hace `SELECT FROM profiles` con RLS activo provoca que Postgres evalúe la misma policy recursivamente hasta agotar la pila → `42P17`.

La policy de evaluaciones agrava el problema porque también hace `SELECT FROM profiles`:

```sql
-- "Evaluations select own" en la DB live
USING (
  (auth.uid() = user_id)
  OR
  (
    SELECT profiles.role FROM profiles   -- ← también dispara "Profiles select staff"
     WHERE profiles.id = auth.uid()
  ) = ANY (ARRAY['ejecutivo', 'admin'])
);
```

Cuando se consultan evaluaciones → se evalúa la policy de evaluaciones → se consultan profiles → se evalúa "Profiles select staff" → se consultan profiles de nuevo → loop.

### Por qué no está en `schema.sql`

La policy "Profiles select staff" fue añadida directamente en el SQL Editor de Supabase fuera del flujo de migraciones. `schema.sql` define "Profiles select own" (`auth.uid() = id`), pero la DB live tiene ambas: la simple y la recursiva.

---

## Fix

### Principio

Reemplazar todas las comprobaciones de rol que hacen `SELECT FROM profiles` (dentro de policies RLS) por una **función `SECURITY DEFINER`**. Las funciones `SECURITY DEFINER` se ejecutan con los permisos del propietario (postgres), saltándose RLS, por lo que no disparan las policies y rompen el ciclo.

### Paso 1 — Crear la función helper

```sql
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;
```

Esta función lee `profiles` sin aplicar RLS (SECURITY DEFINER). Puede usarse libremente dentro de policies sin riesgo de recursión.

### Paso 2 — Corregir la policy de profiles

Eliminar "Profiles select staff" (la problemática) y dejar solo "Profiles select own":

```sql
-- Eliminar la policy recursiva
DROP POLICY IF EXISTS "Profiles select staff" ON public.profiles;

-- Asegurarse de que la policy simple existe
DROP POLICY IF EXISTS "Profiles select own" ON public.profiles;
CREATE POLICY "Profiles select own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);
```

> **Nota:** En este MVP el ejecutivo no necesita ver perfiles de otros usuarios — sólo ve evaluaciones. La policy simple es suficiente.

### Paso 3 — Corregir la policy de evaluaciones

Reemplazar el subquery por la función helper:

```sql
DROP POLICY IF EXISTS "Evaluations select own" ON public.evaluations;
CREATE POLICY "Evaluations select own"
  ON public.evaluations
  FOR SELECT
  USING (
    (auth.uid() = user_id)
    OR
    (public.get_my_role() = ANY (ARRAY['ejecutivo', 'admin']))
  );
```

### SQL completo de la migración

```sql
-- =============================================================
-- ScoreLeads — Fix 42P17 infinite recursion in profiles RLS
-- =============================================================

-- 1. Función helper SECURITY DEFINER (no dispara RLS)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Eliminar policy recursiva en profiles
DROP POLICY IF EXISTS "Profiles select staff" ON public.profiles;

-- 3. Garantizar que la policy simple existe
DROP POLICY IF EXISTS "Profiles select own" ON public.profiles;
CREATE POLICY "Profiles select own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 4. Reemplazar policy de evaluaciones
DROP POLICY IF EXISTS "Evaluations select own" ON public.evaluations;
CREATE POLICY "Evaluations select own"
  ON public.evaluations
  FOR SELECT
  USING (
    (auth.uid() = user_id)
    OR
    (public.get_my_role() = ANY (ARRAY['ejecutivo', 'admin']))
  );
```

---

## Cómo aplicar

### Opción A — SQL Editor de Supabase (recomendada para aplicar ya)

1. Ir a **Supabase Dashboard → SQL Editor**
2. Pegar el bloque SQL completo de arriba
3. Ejecutar
4. Verificar que no hay errores

### Opción B — Migración oficial (recomendada para dejar trazabilidad)

```bash
# Desde la raíz del repo
supabase migration new fix-rls-infinite-recursion
# Pegar el SQL completo en el archivo generado en supabase/migrations/
supabase db push --linked
```

Después actualizar `schema.sql` para que refleje el estado corregido:
- Reemplazar la policy "Evaluations select own" con la versión que usa `get_my_role()`
- Eliminar cualquier referencia a "Profiles select staff"
- Añadir la definición de `get_my_role()` antes de las policies

---

## Verificación post-fix

1. Login como `test.ejecutivo@scoreleads.dev` → debe aterrizar en **home**, navbar debe mostrar **"Dashboard Leads"**
2. Login como `test.usuario@scoreleads.dev` → completar formulario → debe guardarse sin error de 500
3. El ejecutivo en Dashboard Leads debe ver las evaluaciones del usuario recién creado con el contador de filtros actualizado

---

## Estado de `schema.sql` post-fix

`schema.sql` debe quedar con esta versión de la policy de evaluaciones y sin "Profiles select staff":

```sql
-- En schema.sql, reemplazar el bloque de "Evaluations select own":
create policy "Evaluations select own"
  on public.evaluations
  for select
  using (
    (auth.uid() = user_id)
    OR
    (public.get_my_role() = ANY (ARRAY['ejecutivo'::text, 'admin'::text]))
  );
```

Y añadir la función antes de las policies:

```sql
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;
```
