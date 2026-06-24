"use client";

import { useState, useActionState, useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { addAval } from "@/app/app/herramientas/actions";

type AvalState = { error: string } | { ok: true } | null;

export function AvalForm({
  proposalId,
  canAval,
}: {
  proposalId: string;
  canAval: boolean;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const action = addAval.bind(null, proposalId);
  const [state, formAction, pending] = useActionState<AvalState, FormData>(
    async (_p, fd) => action(fd),
    null,
  );

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  if (!canAval) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-raised/40 px-4 py-3 text-[13px] text-muted">
        Inicia sesión como profesional para avalar esta herramienta.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-volt/50 bg-volt/10 px-4 py-2.5 text-[13px] font-extrabold text-volt transition-colors hover:bg-volt/20"
      >
        <span className="text-base leading-none">✚</span> Avalar con mi cédula
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-xl border border-line bg-raised p-4"
    >
      <h3 className="text-[14px] font-extrabold text-ink">Avalar esta herramienta</h3>
      <p className="mt-1 text-[12px] leading-relaxed text-muted">
        Firmas con tu nombre y cédula profesional. Tu aval queda público y
        cualquiera puede verificar tu cédula en el RNP. Pon tu reputación detrás.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Nombre completo" required>
          <input name="nombre" required className={inputCls} placeholder="Como aparece en tu cédula" />
        </Field>
        <Field label="Profesión" required>
          <input name="profesion" required className={inputCls} placeholder="ej. Ingeniero Civil" />
        </Field>
        <Field label="Cédula profesional" required>
          <input name="cedula" required inputMode="numeric" className={inputCls} placeholder="Solo números" />
        </Field>
        <Field label="Área de especialidad">
          <input name="area" className={inputCls} placeholder="ej. Estructuras / Sismo" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Institución / colegio">
            <input name="institucion" className={inputCls} placeholder="ej. UNAM · CICM" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Declaración" required>
            <textarea
              name="declaracion"
              required
              rows={3}
              className={inputCls}
              placeholder="En qué te basas para avalarla: fuente, experiencia, revisión de las fórmulas…"
            />
          </Field>
        </div>
      </div>

      {state && "error" in state && (
        <p className="mt-3 rounded-md bg-danger/10 px-3 py-2 text-[12px] text-danger">
          {state.error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-line px-4 py-2 text-[13px] font-semibold text-muted hover:bg-hover"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-volt px-5 py-2 text-[13px] font-extrabold text-on-volt hover:bg-volt-sub disabled:opacity-50"
        >
          {pending ? "Firmando…" : "Firmar aval"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-line bg-base px-3 py-2 text-[13px] text-ink placeholder:text-faint focus:border-volt focus:outline-none";

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
      <label className="mb-1.5 block text-[12px] font-semibold text-muted">
        {label}
        {required && <span className="ml-0.5 text-volt">*</span>}
      </label>
      {children}
    </div>
  );
}
