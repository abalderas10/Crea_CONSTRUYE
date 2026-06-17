import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_KEY } from "@/lib/supabase/config";

/**
 * Cliente Supabase para el servidor (Server Components, Route Handlers,
 * Server Actions). Lee/escribe la sesión vía cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde un Server Component: ignorar. El refresco de
            // sesión lo maneja el middleware.
          }
        },
      },
    },
  );
}
