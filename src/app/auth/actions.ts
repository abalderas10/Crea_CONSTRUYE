"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthState = { error: string } | null;

function notConfigured(): AuthState {
  return {
    error:
      "Supabase aún no está conectado. Configura las llaves en .env.local para habilitar el acceso.",
  };
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) return notConfigured();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: traducirError(error.message) };
  redirect("/app");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) return notConfigured();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) return { error: traducirError(error.message) };
  redirect("/app");
}

/** Envía el correo con el enlace para restablecer la contraseña. */
export async function requestPasswordReset(
  _prev: AuthState | { ok: true },
  formData: FormData,
): Promise<AuthState | { ok: true }> {
  if (!isSupabaseConfigured) return notConfigured();

  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Escribe tu correo." };

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/actualizar-password`,
  });

  // No revelamos si el correo existe (seguridad): siempre ok.
  if (error && !/rate limit/i.test(error.message)) {
    return { error: traducirError(error.message) };
  }
  return { ok: true };
}

/** Actualiza la contraseña del usuario con sesión activa (post-enlace). */
export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) return notConfigured();

  const password = String(formData.get("password") ?? "");
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "El enlace expiró. Solicita uno nuevo." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: traducirError(error.message) };
  redirect("/app");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured) return;

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error) return;
  if (data.url) redirect(data.url);
}

function traducirError(msg: string): string {
  if (/invalid login credentials/i.test(msg))
    return "Correo o contraseña incorrectos.";
  if (/user already registered/i.test(msg))
    return "Ya existe una cuenta con este correo.";
  if (/password should be at least/i.test(msg))
    return "La contraseña debe tener al menos 6 caracteres.";
  return msg;
}
