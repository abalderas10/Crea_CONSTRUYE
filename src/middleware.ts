import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Resolución de credenciales Supabase con fail-safe.
//
// En el Edge Runtime del middleware, process.env puede llegar incompleto
// o las credenciales pueden no estar configuradas (modo demo).
// Esta capa envuelve la lectura para que el middleware NUNCA crashee
// por un problema de configuración — degrada a "no auth" si hace falta.

function getSupabaseEnv(): { url: string; key: string } | null {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "";
    if (!url || !key) return null;
    return { url, key };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const env = getSupabaseEnv();
  if (!env) {
    // Modo demo: sin Supabase configurado, no intentamos auth.
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(env.url, env.key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    // IMPORTANTE: no ejecutar código entre createServerClient y getUser().
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isProtected = pathname.startsWith("/app");
    const isAuthPage = pathname === "/login" || pathname === "/registro";

    // Sin sesión en ruta protegida → a login.
    if (!user && isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Con sesión en página de auth → a la app.
    if (user && isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (err) {
    // Si el middleware explota por cualquier razón (Supabase caído, red,
    // bug), pasamos la request sin auth. La app detecta el modo demo
    // y el usuario puede seguir navegando. Logs en Vercel.
    if (process.env.NODE_ENV !== "production") {
      console.error("[middleware] Supabase error:", err);
    }
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files (svg, png, jpg, etc.)
     * - api routes (dejamos que manejen su propio auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
