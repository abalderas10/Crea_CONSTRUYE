-- ============================================================
-- Hardening de funciones (security advisors)
-- ============================================================

-- search_path inmutable en el helper de updated_at
alter function public.set_updated_at() set search_path = '';

-- handle_new_user solo debe ejecutarse vía trigger, no por RPC público
revoke execute on function public.handle_new_user() from public, anon, authenticated;
