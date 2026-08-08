// Intercambia el código de OAuth / magic link por una sesión.
// Maneja códigos expirados o inválidos con un mensaje específico.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback que Supabase Auth llama con:
 * - `?code=...` después de confirmar email, login con magic link, OAuth callback
 * - `?error=...&error_description=...` si el código expiró o es inválido
 * - Sin nada si el usuario llegó directo (solo para testing)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";
  const errorCode = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // ── Caso 1: Supabase envió un error en el redirect (token expirado, etc.)
  if (errorCode) {
    void decodeURIComponent(errorDescription ?? errorCode);
    const params = new URLSearchParams({
      error: "auth",
      reason:
        "El enlace de confirmación expiró o ya fue usado. Vuelve a iniciar sesión.",
    });
    return NextResponse.redirect(`${origin}/login?${params}`);
  }

  // ── Caso 2: código de intercambio
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    // Si el código es inválido o expiró:
    const params = new URLSearchParams({
      error: "auth",
      reason: "El enlace es inválido o expiró. Solicita uno nuevo desde la pantalla de login.",
    });
    return NextResponse.redirect(`${origin}/login?${params}`);
  }

  // ── Sin código: redirigir a login
  return NextResponse.redirect(`${origin}/login?error=auth`);
}