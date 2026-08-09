-- 0009_project_documents.sql
-- Módulo de Documentación v2 — creaConstruye.
-- Tabla para documentos subidos por el usuario (planos, certificados, boletas,
-- contratos, avalúos, licencias, fotos) y bucket de Storage privado.

-- ── Tabla ───────────────────────────────────────────────────────────
create table public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  tool text not null check (tool in ('terreno','zonificacion','mercado','costos','financiero','roi','cronograma','riesgos','general')),
  document_type text not null check (document_type in ('plano_topografico','certificado_uso_suelo','boleta_predial','contrato','avaluo','licencia_obra','fotos','otro')),
  file_name text not null,
  file_path text not null,
  mime_type text not null,
  file_size bigint not null,
  extracted_data jsonb,
  extraction_status text not null default 'pending' check (extraction_status in ('pending','processing','completed','failed')),
  extraction_error text,
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_project_documents_project on public.project_documents(project_id, created_at desc);
create index idx_project_documents_tool on public.project_documents(project_id, tool);
create index idx_project_documents_status on public.project_documents(extraction_status);

-- ── RLS ─────────────────────────────────────────────────────────────
alter table public.project_documents enable row level security;

create policy "Users can view own project documents"
  on public.project_documents for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Users can insert own project documents"
  on public.project_documents for insert
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Users can update own project documents"
  on public.project_documents for update
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Users can delete own project documents"
  on public.project_documents for delete
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and p.owner_id = auth.uid()
    )
  );

-- ── Trigger updated_at ──────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger project_documents_updated_at
  before update on public.project_documents
  for each row execute function public.set_updated_at();

-- ── Storage bucket ──────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-documents',
  'project-documents',
  false,
  20971520, -- 20 MB
  array['application/pdf','image/jpeg','image/png','image/heic','image/heif','image/tiff']
)
on conflict (id) do nothing;

-- ── Storage policies ────────────────────────────────────────────────
create policy "Users can upload to own project folder"
  on storage.objects for insert
  with check (
    bucket_id = 'project-documents'
    and auth.uid() is not null
    and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(name))[1]
        and p.owner_id = auth.uid()
    )
  );

create policy "Users can read own project files"
  on storage.objects for select
  using (
    bucket_id = 'project-documents'
    and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(name))[1]
        and p.owner_id = auth.uid()
    )
  );

create policy "Users can delete own project files"
  on storage.objects for delete
  using (
    bucket_id = 'project-documents'
    and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(name))[1]
        and p.owner_id = auth.uid()
    )
  );

-- IMPORTANTE: Ejecutar en Supabase Dashboard > SQL Editor.
-- Después, regenerar tipos: npx supabase gen types typescript --project-id wieprvwkcektpkuiapic > src/lib/supabase/database.types.ts
