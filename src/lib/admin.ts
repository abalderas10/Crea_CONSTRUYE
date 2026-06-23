import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Devuelve true si el usuario actual es admin. */
export async function checkIsAdmin(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  return data?.is_admin ?? false;
}

/** Gate para páginas/acciones admin: redirige si no es admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await checkIsAdmin())) redirect("/app");
}
