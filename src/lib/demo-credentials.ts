// Credenciales de acceso demo para desarrollo.
//
// Se usan en dos lugares:
//  - El botón "!" del formulario de login que autocompleta los campos.
//  - El atajo de `signIn` que permite entrar sin backend cuando Supabase
//    todavía no está configurado (modo UI-only).
//
// IMPORTANTE: este atajo solo está activo fuera de producción.

export const DEMO_EMAIL = "demo@creaconstruye.com";
export const DEMO_PASSWORD = "demo1234";

/** Verdadero en `next dev` / cualquier entorno que no sea producción. */
export const isDevEnv = process.env.NODE_ENV !== "production";

/** Indica si las credenciales recibidas son las del acceso demo. */
export function isDemoLogin(email: string, password: string): boolean {
  return email === DEMO_EMAIL && password === DEMO_PASSWORD;
}
