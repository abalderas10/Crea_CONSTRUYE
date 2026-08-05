-- ============================================================
-- creaConstruye — Registro light de interesados
-- Captura de contacto para quien tenga interés en la plataforma.
-- (Versión ligera de "perfiles" mientras armamos la comunidad.)
-- ============================================================

create table public.interest_signups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  -- rol/área de interés: arquitecto, ingeniero, desarrollador, etc.
  role        text,
  city        text,
  message     text,
  source      text not null default 'unete',
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index interest_signups_created_idx on public.interest_signups(created_at desc);

alter table public.interest_signups enable row level security;

-- Cualquiera (anónimo) puede dejar su interés.
create policy "Interesados: el público se registra"
  on public.interest_signups for insert
  with check (true);

-- El admin los lee y los marca atendidos.
create policy "Interesados: el admin los ve"
  on public.interest_signups for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin
  ));

create policy "Interesados: el admin los actualiza"
  on public.interest_signups for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin
  ));
