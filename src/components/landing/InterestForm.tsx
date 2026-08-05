"use client";

import { useActionState, type ReactNode } from "react";
import { submitInterest, type InterestState } from "@/app/unete/actions";

const ROLES = [
  "Arquitecto/a",
  "Ingeniero/a",
  "Desarrollador/a inmobiliario",
  "Constructor/a",
  "Broker / Asesor",
  "Instalación / Mantenimiento",
  "Inversionista",
  "Otro",
];

export function InterestForm() {
  const [state, action, pending] = useActionState<InterestState, FormData>(
    submitInterest,
    null,
  );

  if (state && "ok" in state && state.ok) {
    return (
      <div className="rounded-2xl border border-line bg-raised p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-volt">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-on-volt)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink">
          ¡Listo, te tenemos en la lista!
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Te contactaremos con novedades de creaConstruye y acceso anticipado.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-2xl border border-line bg-raised p-6 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" required>
          <input name="name" required placeholder="Tu nombre" className={inputCls} />
        </Field>
        <Field label="Correo" required>
          <input name="email" type="email" required placeholder="tu@correo.com" className={inputCls} />
        </Field>
        <Field label="¿A qué te dedicas?">
          <select name="role" defaultValue="" className={inputCls}>
            <option value="" disabled>
              Selecciona…
            </option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ciudad">
          <input name="city" placeholder="CDMX, Monterrey…" className={inputCls} />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="¿Qué te interesa de creaConstruye?">
          <textarea
            name="message"
            rows={2}
            placeholder="Opcional — cuéntanos en qué te gustaría usarla."
            className={inputCls}
          />
        </Field>
      </div>

      {state && "error" in state && (
        <p className="mt-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-md bg-volt px-5 py-3 text-[14px] font-extrabold text-on-volt transition-colors hover:bg-volt-sub disabled:opacity-60"
      >
        {pending ? "Registrando…" : "Quiero estar en la lista →"}
      </button>
      <p className="mt-3 text-center text-[11px] text-faint">
        Solo tu contacto. Sin compromiso.
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-line bg-input px-3 py-2.5 text-sm text-ink outline-none transition-shadow placeholder:text-faint focus:border-volt focus:shadow-[0_0_0_3px_rgba(200,255,0,0.18)]";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
        {label}
        {required && <span className="ml-0.5 text-volt">*</span>}
      </span>
      {children}
    </label>
  );
}
