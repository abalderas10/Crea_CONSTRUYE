-- ============================================================
-- creaConstruye — Herramientas de comunidad
-- Catálogo extensible: usuarios proponen herramientas, se validan
-- y se publican para alimentar las proformas.
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────
-- Ciclo de vida de una herramienta propuesta:
--   proposed   → recién enviada por el usuario (tarea pendiente)
--   in_review  → la estamos analizando (reuniones, ajustes)
--   approved   → autorizada, lista para construir/publicar
--   published  → disponible en el catálogo
--   rejected   → no procede (con motivo)
create type tool_proposal_status as enum (
  'proposed', 'in_review', 'approved', 'published', 'rejected'
);

-- Secciones del catálogo (extensible a futuro)
create type tool_section as enum (
  'arquitectura', 'construccion', 'normatividad', 'mantenimiento', 'otro'
);

-- ============================================================
-- tool_proposals
-- Una fila por herramienta propuesta. Tablero de "por crear"
-- + catálogo de publicadas (filtrando por status).
-- ============================================================
create table public.tool_proposals (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid not null references auth.users(id) on delete cascade,

  -- Lo que captura el form de "+ Herramienta"
  name            text not null,
  description     text not null,
  formulas        text,                    -- fórmulas / elementos a calcular
  justification   text,                    -- por qué es buena para la comunidad
  section         tool_section not null default 'construccion',

  -- Ciclo de validación
  status          tool_proposal_status not null default 'proposed',
  review_notes    text,                    -- notas internas / motivo de rechazo

  -- "Validada por experto humano": el autor declara expertise y la firma
  expert_validated boolean not null default false,
  expert_name      text,                   -- nombre/credencial del experto
  expert_field     text,                   -- área de expertise

  -- Sugerencia del agente AI para implementarla
  ai_suggestion   jsonb,

  -- Vínculo con herramientas core de la proforma a las que alimenta
  -- (ej. ['costos','terreno']) — texto libre por ahora
  feeds_tools     text[] not null default '{}',

  -- Normatividad asociada (para auto-linkeo con sección Legal)
  -- ej. [{ "entidad": "CDMX", "doc": "SEDUVI / Desarrollo Urbano" }]
  normatividad    jsonb not null default '[]',

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index tool_proposals_author_idx  on public.tool_proposals(author_id);
create index tool_proposals_status_idx  on public.tool_proposals(status);
create index tool_proposals_section_idx on public.tool_proposals(section);

alter table public.tool_proposals enable row level security;

-- El autor ve y administra sus propias propuestas
create policy "Herramientas: el autor ve las suyas"
  on public.tool_proposals for select
  using (auth.uid() = author_id);

-- Cualquier usuario autenticado ve las publicadas (catálogo)
create policy "Herramientas: catálogo público (publicadas)"
  on public.tool_proposals for select
  using (status = 'published');

create policy "Herramientas: el autor las crea"
  on public.tool_proposals for insert
  with check (auth.uid() = author_id);

create policy "Herramientas: el autor las actualiza"
  on public.tool_proposals for update
  using (auth.uid() = author_id);

create policy "Herramientas: el autor las borra"
  on public.tool_proposals for delete
  using (auth.uid() = author_id);

create trigger tool_proposals_updated_at
  before update on public.tool_proposals
  for each row execute function public.set_updated_at();
