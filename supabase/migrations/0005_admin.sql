-- ============================================================
-- creaConstruye — Rol admin
-- Flag is_admin en profiles + políticas RLS para administrar
-- propuestas de herramientas y leads de Constructiva.
-- ============================================================

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- ── tool_proposals: el admin ve y administra todas ───────────
create policy "Herramientas: el admin ve todas"
  on public.tool_proposals for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin
  ));

create policy "Herramientas: el admin actualiza todas"
  on public.tool_proposals for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin
  ));

-- ── constructiva_leads: el admin los lee y marca atendidos ───
create policy "Leads: el admin los ve"
  on public.constructiva_leads for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin
  ));

create policy "Leads: el admin los actualiza"
  on public.constructiva_leads for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin
  ));

-- Para conceder admin (correr manualmente con tu correo):
--   update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'tu@correo.com');
