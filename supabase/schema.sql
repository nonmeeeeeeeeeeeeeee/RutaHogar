-- ScoreLeads MVP schema.
-- Ejecutar en Supabase SQL Editor o como migracion inicial.
-- Tablas del MVP: profiles, evaluations, improvement_goals, scoring_history.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'usuario',
  onboarding_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('usuario', 'ejecutivo', 'admin'))
);

alter table public.profiles
add column if not exists onboarding_data jsonb,
add column if not exists last_lead_seen_at timestamptz,
add column if not exists phone text,
add column if not exists birth_date date;

alter table public.profiles
add column if not exists consent_data jsonb;

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null,
  classification text not null,
  objective text,
  property_type text,
  target_commune text,
  alternative_commune text,
  purchase_timeline text,
  financial_data jsonb,
  explanation text,
  recommendations jsonb not null default '[]'::jsonb,
  plan_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  constraint evaluations_score_check check (score between 0 and 100),
  constraint evaluations_classification_check check (classification in ('Alto', 'Medio', 'Bajo'))
);

alter table public.evaluations replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
    and tablename = 'evaluations'
    and schemaname = 'public'
  ) then
    alter publication supabase_realtime add table public.evaluations;
  end if;
end;
$$;

alter table public.evaluations
add column if not exists objective text,
add column if not exists property_type text,
add column if not exists target_commune text,
add column if not exists alternative_commune text,
add column if not exists purchase_timeline text,
add column if not exists financial_data jsonb,
add column if not exists plan_accepted_at timestamptz;

create table if not exists public.improvement_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  evaluation_id uuid references public.evaluations(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pendiente',
  progress_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint improvement_goals_status_check check (status in ('pendiente', 'en_progreso', 'completada'))
);

alter table public.improvement_goals
add column if not exists progress_data jsonb;

create table if not exists public.scoring_history (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references public.evaluations(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null,
  classification text not null,
  snapshot jsonb not null,
  component_scores jsonb not null,
  algorithm_version text not null,
  channel text not null,
  created_at timestamptz not null default now(),
  constraint scoring_history_score_check check (score between 0 and 100),
  constraint scoring_history_classification_check check (classification in ('Alto', 'Medio', 'Bajo')),
  constraint scoring_history_channel_check check (channel in ('web', 'chatbot', 'whatsapp', 'vendedor'))
);

alter table public.scoring_history
add column if not exists algorithm_version text,
add column if not exists channel text;

alter table public.scoring_history
alter column algorithm_version set not null,
alter column channel set not null;

create index if not exists scoring_history_user_created_idx
  on public.scoring_history (user_id, created_at desc);

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

create index if not exists evaluations_user_created_idx
  on public.evaluations (user_id, created_at desc);

create index if not exists improvement_goals_user_evaluation_idx
  on public.improvement_goals (user_id, evaluation_id, created_at);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists improvement_goals_set_updated_at on public.improvement_goals;
create trigger improvement_goals_set_updated_at
before update on public.improvement_goals
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.evaluations enable row level security;
alter table public.improvement_goals enable row level security;
alter table public.scoring_history enable row level security;

-- Helper SECURITY DEFINER: lee el rol del usuario sin disparar RLS
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

drop policy if exists "Profiles select own" on public.profiles;
create policy "Profiles select own"
on public.profiles
for select
using (auth.uid() = id::uuid);

drop policy if exists "Profiles insert own" on public.profiles;
create policy "Profiles insert own"
on public.profiles
for insert
with check (auth.uid() = id::uuid);

drop policy if exists "Profiles update own" on public.profiles;
create policy "Profiles update own"
on public.profiles
for update
using (auth.uid() = id::uuid)
with check (auth.uid() = id::uuid);

alter table public.evaluations 
add column if not exists email text;

drop policy if exists "Evaluations select own" on public.evaluations;
create policy "Evaluations select own"
  on public.evaluations
  for select
  using (
    (auth.uid() = user_id)
    or
    (public.get_my_role() = any (array['ejecutivo'::text, 'admin'::text]))
  );

drop policy if exists "Evaluations insert own" on public.evaluations;
create policy "Evaluations insert own"
on public.evaluations
for insert
with check (auth.uid() = user_id::uuid);

drop policy if exists "Evaluations delete own" on public.evaluations;
create policy "Evaluations delete own"
on public.evaluations
for delete
using (auth.uid() = user_id::uuid);

drop policy if exists "Improvement goals select own" on public.improvement_goals;
create policy "Improvement goals select own"
on public.improvement_goals
for select
using (auth.uid() = user_id::uuid);

drop policy if exists "Improvement goals insert own" on public.improvement_goals;
create policy "Improvement goals insert own"
on public.improvement_goals
for insert
with check (auth.uid() = user_id::uuid);

drop policy if exists "Improvement goals update own" on public.improvement_goals;
create policy "Improvement goals update own"
on public.improvement_goals
for update
using (auth.uid() = user_id::uuid)
with check (auth.uid() = user_id::uuid);

drop policy if exists "Improvement goals delete own" on public.improvement_goals;
create policy "Improvement goals delete own"
on public.improvement_goals
for delete
using (auth.uid() = user_id::uuid);

drop policy if exists "Scoring history insert own" on public.scoring_history;
create policy "Scoring history insert own"
on public.scoring_history
for insert
with check (auth.uid() = user_id::uuid);

drop policy if exists "Scoring history select own" on public.scoring_history;
create policy "Scoring history select own"
on public.scoring_history
for select
using (auth.uid() = user_id::uuid);

-- Migracion: endurecer FK para evitar borrado en cascada del historial inmutable.
alter table public.scoring_history
  drop constraint if exists scoring_history_evaluation_id_fkey,
  add constraint scoring_history_evaluation_id_fkey
    foreign key (evaluation_id) references public.evaluations(id) on delete restrict;
