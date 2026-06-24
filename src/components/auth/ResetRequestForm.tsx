"use client";

import { useActionState } from "react";
import { requestPasswordReset, type AuthState } from "@/app/auth/actions";

export function ResetRequestForm() {
  const [state, formAction, pending] = useActionState<
    AuthState | { ok: true },
    FormData
  >(requestPasswordReset, null);

  if (state && "ok" in state && state.ok) {
    return (
      <div className="rounded-lg border border-line bg-raised p-4 text-center">
        <p className="text-[14px] font-semibold text-ink">Revisa tu correo</p>
        <p className="mt-1 text-[13px] text-muted">
          Si existe una cuenta con ese correo, te enviamos un enlace para crear
          una contraseña nueva.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
          Correo
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          className="rounded-md border border-line bg-input px-3 py-2.5 text-sm text-ink outline-none transition-shadow placeholder:text-faint focus:border-volt focus:shadow-[0_0_0_3px_rgba(200,255,0,0.18)]"
        />
      </label>

      {state && "error" in state && state.error && (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex items-center justify-center rounded-md bg-volt px-5 py-2.5 text-[13px] font-extrabold text-on-volt transition-all duration-150 hover:bg-volt-sub disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar enlace de recuperación"}
      </button>
    </form>
  );
}
