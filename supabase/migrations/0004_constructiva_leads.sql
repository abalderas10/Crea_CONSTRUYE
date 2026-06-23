-- ============================================================
-- creaConstruye — Constructiva (leads de construcción/mantenimiento)
-- Captura de solicitudes desde la landing pública de Constructiva.
-- ============================================================

create type constructiva_service as enum ('construccion', 'mantenimiento');

create table public.constructiva_leads (
  id           uuid primary key default gen_random_uuid(),
  service      constructiva_service not null default 'construccion',
  name         text not null,
  email        text not null,
  phone        text,
  -- categoría dentro del servicio (ej. 'fachadas', 'obra-nueva', 'domotica')
  category     text,
  message      text,
  -- metadata útil para seguimiento
  source       text not null default 'landing',
  handled      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index constructiva_leads_created_idx on public.constructiva_leads(created_at desc);

alter table public.constructiva_leads enable row level security;

-- Cualquiera (anónimo incluido) puede enviar una solicitud desde la landing.
create policy "Leads: el público los crea"
  on public.constructiva_leads for insert
  with check (true);

-- Nadie los lee vía API pública (solo backend/service role o admin futuro).
-- (Sin policy de select → RLS bloquea lecturas con la anon/publishable key.)
