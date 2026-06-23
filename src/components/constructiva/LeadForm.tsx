"use client";

import { useState, useActionState, type ReactNode } from "react";
import { submitLead, type LeadState } from "@/app/constructiva/actions";
import { SERVICIOS, type ServiceType } from "@/lib/constructiva/servicios";

export function LeadForm() {
  const [state, action, pending] = useActionState<LeadState, FormData>(
    submitLead,
    null,
  );
  const [service, setService] = useState<ServiceType>("construccion");

  const categorias = SERVICIOS.filter((s) => s.type === service);
  const done = state && "ok" in state && state.ok;

  return (
    <section id="contacto" className="scroll-mt-16 border-t border-[var(--cc-line)] py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--cc-lime)]">
            Cuéntanos tu proyecto
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--cc-text)] sm:text-4xl">
            Hablemos de obra.
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--cc-muted)]">
            Déjanos tus datos y el tipo de servicio. Te contactamos con una
            propuesta respaldada por proforma y presupuesto con datos reales.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Cotización clara, con números reales",
              "Supervisión y control de costos en plataforma",
              "Un solo equipo de diseño a entrega",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-[14px] text-[var(--cc-text)]">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--cc-lime)]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16181F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6 sm:p-7">
          {done ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--cc-lime)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16181F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-[var(--cc-text)]">
                ¡Solicitud enviada!
              </h3>
              <p className="mt-2 max-w-xs text-[14px] text-[var(--cc-muted)]">
                Te contactaremos muy pronto para platicar de tu proyecto.
              </p>
            </div>
          ) : (
            <form action={action} className="space-y-4">
              {/* Tipo de servicio */}
              <div>
                <Label>Tipo de servicio</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["construccion", "mantenimiento"] as ServiceType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setService(t)}
                      className={`rounded-md border px-3 py-2.5 text-[13px] font-bold capitalize transition-colors ${
                        service === t
                          ? "border-[var(--cc-lime)] bg-[var(--cc-lime)]/15 text-[var(--cc-text)]"
                          : "border-[var(--cc-line)] text-[var(--cc-muted)] hover:text-[var(--cc-text)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="service" value={service} />
              </div>

              {/* Categoría */}
              <div>
                <Label>¿Qué necesitas?</Label>
                <select name="category" className={inputCls} defaultValue="">
                  <option value="" disabled>
                    Selecciona…
                  </option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" required>
                  <input name="name" required placeholder="Tu nombre" className={inputCls} />
                </Field>
                <Field label="Teléfono">
                  <input name="phone" placeholder="Opcional" className={inputCls} />
                </Field>
              </div>

              <Field label="Correo" required>
                <input name="email" type="email" required placeholder="tucorreo@ejemplo.com" className={inputCls} />
              </Field>

              <Field label="Cuéntanos más">
                <textarea name="message" rows={3} placeholder="Describe tu proyecto, ubicación, tiempos…" className={inputCls} />
              </Field>

              {state && "error" in state && (
                <p className="rounded-md bg-red-500/10 px-3 py-2 text-[12px] text-red-400">
                  {state.error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-md bg-[var(--cc-lime)] px-5 py-3 text-[14px] font-extrabold text-[var(--cc-base)] transition-colors hover:bg-[var(--cc-lime-sub)] disabled:opacity-50"
              >
                {pending ? "Enviando…" : "Enviar solicitud →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-md border border-[var(--cc-line)] bg-[var(--cc-base)] px-3 py-2.5 text-[14px] text-[var(--cc-text)] placeholder:text-[var(--cc-muted)]/60 focus:border-[var(--cc-lime)] focus:outline-none";

function Label({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-[12px] font-semibold text-[var(--cc-muted)]">
      {children}
    </label>
  );
}

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
    <div>
      <Label>
        {label}
        {required && <span className="ml-0.5 text-[var(--cc-lime)]">*</span>}
      </Label>
      {children}
    </div>
  );
}
