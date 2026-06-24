-- ============================================================
-- creaConstruye — Sistema de rigor / validación basado en evidencia
-- Reemplaza el checkbox "soy experto" por evidencia atribuible:
--   · referencias (fuentes citadas: libro/norma/paper/dato oficial)
--   · avales firmados por profesionales con cédula (verificable en RNP)
--   · caso de prueba resuelto
-- El nivel de rigor se CALCULA de la evidencia, no se autodeclara.
-- ============================================================

alter table public.tool_proposals
  add column if not exists referencias  jsonb   not null default '[]',
  add column if not exists caso_prueba   jsonb,
  add column if not exists avales_count  integer not null default 0;

-- ── Avales (endorsements firmados) ───────────────────────────
create table public.tool_avales (
  id           uuid primary key default gen_random_uuid(),
  proposal_id  uuid not null references public.tool_proposals(id) on delete cascade,
  author_id    uuid not null references auth.users(id) on delete cascade,
  nombre       text not null,
  profesion    text not null,
  cedula       text not null,        -- cédula profesional (verificable en RNP/SEP)
  institucion  text,
  area         text,
  declaracion  text not null,        -- por qué la avala / en qué se basó
  verificado   boolean not null default false,  -- sello opcional del admin
  created_at   timestamptz not null default now()
);

create index tool_avales_proposal_idx on public.tool_avales(proposal_id, created_at);

alter table public.tool_avales enable row level security;

create policy "Avales: visibles si la propuesta lo es"
  on public.tool_avales for select
  using (public.proposal_visible_to_me(proposal_id));

create policy "Avales: registrados avalan propuestas visibles"
  on public.tool_avales for insert
  with check (
    auth.uid() = author_id
    and public.proposal_visible_to_me(proposal_id)
  );

create policy "Avales: el autor o admin los borra"
  on public.tool_avales for delete
  using (
    auth.uid() = author_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "Avales: el admin los verifica"
  on public.tool_avales for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- ── Mantener avales_count en sync (para calcular nivel sin N+1) ──
create or replace function public.sync_avales_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.tool_proposals
      set avales_count = avales_count + 1 where id = new.proposal_id;
  elsif (tg_op = 'DELETE') then
    update public.tool_proposals
      set avales_count = greatest(0, avales_count - 1) where id = old.proposal_id;
  end if;
  return null;
end;
$$;

create trigger tool_avales_count_ins
  after insert on public.tool_avales
  for each row execute function public.sync_avales_count();

create trigger tool_avales_count_del
  after delete on public.tool_avales
  for each row execute function public.sync_avales_count();
