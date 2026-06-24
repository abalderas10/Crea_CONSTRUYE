-- ============================================================
-- creaConstruye — Modularidad de la proforma
-- Cada proyecto compone su proforma: las 8 core son fijas + las
-- herramientas de comunidad (publicadas) que el usuario enchufa.
-- ============================================================

-- Lista de ids de tool_proposals (publicadas) activas en este proyecto.
alter table public.projects
  add column if not exists enabled_modules jsonb not null default '[]';
