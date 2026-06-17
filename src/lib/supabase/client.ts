import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Cliente Supabase para el navegador (Client Components).
 */
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_KEY);
}
