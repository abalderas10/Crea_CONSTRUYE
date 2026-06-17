-- ============================================================
-- creaConstruye — esquema inicial
-- profiles · projects · project_tool_data (+ RLS y triggers)
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────
create type tool_status as enum ('empty', 'in_progress', 'done');

-- ── Helper: updated_at automático ────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- profiles (1:1 con auth.users)
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Perfil: el usuario ve el suyo"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Perfil: el usuario actualiza el suyo"
  on public.profiles for update
  using (auth.uid() = id);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- projects
-- ============================================================
create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  municipio       text,
  tipo            text,
  context_summary text,          -- contexto que Claude usa entre sesiones
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index projects_owner_id_idx on public.projects(owner_id);

alter table public.projects enable row level security;

create policy "Proyectos: el dueño los ve"
  on public.projects for select
  using (auth.uid() = owner_id);

create policy "Proyectos: el dueño los crea"
  on public.projects for insert
  with check (auth.uid() = owner_id);

create policy "Proyectos: el dueño los actualiza"
  on public.projects for update
  using (auth.uid() = owner_id);

create policy "Proyectos: el dueño los borra"
  on public.projects for delete
  using (auth.uid() = owner_id);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================
-- project_tool_data (datos + estado por herramienta)
-- ============================================================
create table public.project_tool_data (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  tool_id     text not null check (tool_id in (
                'terreno','zonificacion','mercado','costos',
                'financiero','roi','cronograma','riesgos')),
  status      tool_status not null default 'empty',
  data        jsonb not null default '{}',   -- inputs/outputs de las secciones
  ai_analysis jsonb,                          -- output narrativo de Claude
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (project_id, tool_id)
);

create index project_tool_data_project_id_idx
  on public.project_tool_data(project_id);

alter table public.project_tool_data enable row level security;

-- Acceso a través de la propiedad del proyecto
create policy "Herramientas: el dueño del proyecto las ve"
  on public.project_tool_data for select
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.owner_id = auth.uid()
  ));

create policy "Herramientas: el dueño del proyecto las crea"
  on public.project_tool_data for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.owner_id = auth.uid()
  ));

create policy "Herramientas: el dueño del proyecto las actualiza"
  on public.project_tool_data for update
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.owner_id = auth.uid()
  ));

create policy "Herramientas: el dueño del proyecto las borra"
  on public.project_tool_data for delete
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.owner_id = auth.uid()
  ));

create trigger project_tool_data_updated_at
  before update on public.project_tool_data
  for each row execute function public.set_updated_at();
