// Resolución central de credenciales Supabase.
// Soporta la llave nueva (publishable) con respaldo a la anon legacy.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** Indica si las llaves de Supabase están presentes en el entorno. */
export const isSupabaseConfigured = !!SUPABASE_URL && !!SUPABASE_KEY;
