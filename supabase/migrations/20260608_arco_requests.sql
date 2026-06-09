-- Migration: arco_requests table
-- Tabla para solicitudes ARCO (Acceso, Rectificación, Cancelación, Oposición)

create table if not exists public.arco_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null,
  email text not null,
  descripcion text not null,
  estado text not null default 'pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint arco_requests_tipo_check check (tipo in ('acceso', 'rectificacion', 'cancelacion', 'otro')),
  constraint arco_requests_estado_check check (estado in ('pendiente', 'en_proceso', 'completado', 'rechazado'))
);

alter table public.arco_requests enable row level security;

drop policy if exists "ARCO insert own" on public.arco_requests;
create policy "ARCO insert own"
  on public.arco_requests
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "ARCO select own" on public.arco_requests;
create policy "ARCO select own"
  on public.arco_requests
  for select
  using (auth.uid() = user_id);

drop policy if exists "ARCO select admin" on public.arco_requests;
create policy "ARCO select admin"
  on public.arco_requests
  for select
  using (public.get_my_role() = 'admin');

drop policy if exists "ARCO update admin" on public.arco_requests;
create policy "ARCO update admin"
  on public.arco_requests
  for update
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

drop trigger if exists arco_requests_set_updated_at on public.arco_requests;
create trigger arco_requests_set_updated_at
  before update on public.arco_requests
  for each row execute function public.set_updated_at();

create index if not exists arco_requests_user_created_idx
  on public.arco_requests (user_id, created_at desc);

create index if not exists arco_requests_estado_idx
  on public.arco_requests (estado);
