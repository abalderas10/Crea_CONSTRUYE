-- ============================================================
-- creaConstruye — Comunidad: discusión por herramienta
-- Cada propuesta (tool_proposal) es un proyecto vivo con su hilo.
-- La comunidad aporta desde su área de conocimiento.
-- ============================================================

-- ── Visibilidad comunitaria de una propuesta ─────────────────
-- Una propuesta es visible para discutir cuando el admin la movió
-- al pipeline (in_review/approved/published), o si eres autor/admin.
create or replace function public.proposal_visible_to_me(pid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.tool_proposals tp
    where tp.id = pid and (
      tp.status in ('in_review', 'approved', 'published')
      or tp.author_id = auth.uid()
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.is_admin
      )
    )
  );
$$;

-- La comunidad (autenticados) ve las propuestas en el pipeline.
create policy "Herramientas: la comunidad ve las del pipeline"
  on public.tool_proposals for select
  using (
    auth.role() = 'authenticated'
    and status in ('in_review', 'approved', 'published')
  );

-- ============================================================
-- tool_comments — hilo de discusión por herramienta
-- ============================================================
create table public.tool_comments (
  id           uuid primary key default gen_random_uuid(),
  proposal_id  uuid not null references public.tool_proposals(id) on delete cascade,
  author_id    uuid not null references auth.users(id) on delete cascade,
  author_name  text not null,        -- snapshot para mostrar sin leer perfiles ajenos
  author_area  text,                 -- área de conocimiento declarada (opcional)
  body         text not null,
  created_at   timestamptz not null default now()
);

create index tool_comments_proposal_idx on public.tool_comments(proposal_id, created_at);

alter table public.tool_comments enable row level security;

-- Leer: cualquier autenticado que pueda ver la propuesta padre.
create policy "Comentarios: visibles si la propuesta lo es"
  on public.tool_comments for select
  using (public.proposal_visible_to_me(proposal_id));

-- Comentar: solo usuarios registrados, sobre propuestas visibles, como ellos mismos.
create policy "Comentarios: registrados comentan en propuestas visibles"
  on public.tool_comments for insert
  with check (
    auth.uid() = author_id
    and public.proposal_visible_to_me(proposal_id)
  );

-- Borrar: el autor del comentario o un admin.
create policy "Comentarios: el autor o admin los borra"
  on public.tool_comments for delete
  using (
    auth.uid() = author_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin
    )
  );
