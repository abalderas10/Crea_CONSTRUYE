"use client";

import { useState, useActionState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createToolProposal, type CreateToolState } from "@/app/app/herramientas/actions";
import { SECTIONS } from "@/lib/community/sections";

export function CreateToolButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-volt px-4 py-2.5 text-[13px] font-extrabold text-on-volt transition-all hover:bg-volt-sub hover:shadow-volt-glow"
      >
        <span className="text-base leading-none">+</span> Herramienta
      </button>
      {open && <CreateToolModal onClose={() => setOpen(false)} />}
    </>
  );
}

function CreateToolModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<CreateToolState, FormData>(
    createToolProposal,
    null,
  );
  const [isExpert, setIsExpert] = useState(false);

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      onClose();
      router.push("/app/herramientas/pendientes");
    }
  }, [state, onClose, router]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              Proponer una herramienta
            </h2>
            <p className="mt-0.5 text-[13px] text-muted">
              Lo que falte para crear, construir y calcular todo lo posible.
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-faint hover:bg-hover hover:text-ink"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <form action={action} className="mt-5 space-y-4">
          <Field label="Nombre" required>
            <input
              name="name"
              required
              placeholder="ej. COS/CUS de Jalisco"
              className={inputCls}
            />
          </Field>

          <Field label="Sección" required>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SECTIONS.map((s, i) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-line bg-base px-3 py-2 text-[12px] has-[:checked]:border-volt has-[:checked]:bg-volt/10"
                >
                  <input
                    type="radio"
                    name="section"
                    value={s.id}
                    defaultChecked={i === 1}
                    className="accent-volt"
                  />
                  <span className="font-semibold text-ink">{s.name}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Descripción" required>
            <textarea
              name="description"
              required
              rows={2}
              placeholder="¿Qué hace? ¿Para qué sirve?"
              className={inputCls}
            />
          </Field>

          <Field label="Fórmulas o elementos a calcular">
            <textarea
              name="formulas"
              rows={2}
              placeholder="ej. m² construibles = CUS × superficie. Variables: COS, CUS, niveles..."
              className={`${inputCls} font-mono text-[12px]`}
            />
          </Field>

          <Field label="¿Por qué es buena para la comunidad?">
            <textarea
              name="justification"
              rows={2}
              placeholder="Qué problema resuelve y a quién ayuda."
              className={inputCls}
            />
          </Field>

          {/* Validación por experto */}
          <div className="rounded-lg border border-line bg-raised p-3">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="expert_validated"
                checked={isExpert}
                onChange={(e) => setIsExpert(e.target.checked)}
                className="h-4 w-4 accent-violet"
              />
              <span className="text-[13px] font-semibold text-ink">
                Soy experto en esto y la valido
              </span>
            </label>
            {isExpert && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <input
                  name="expert_name"
                  placeholder="Tu nombre / credencial"
                  className={inputCls}
                />
                <input
                  name="expert_field"
                  placeholder="Área (ej. Ing. estructural)"
                  className={inputCls}
                />
              </div>
            )}
          </div>

          {state && "error" in state && (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-[12px] text-danger">
              {state.error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-line px-4 py-2 text-[13px] font-semibold text-muted hover:bg-hover"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-volt px-5 py-2 text-[13px] font-extrabold text-on-volt hover:bg-volt-sub disabled:opacity-50"
            >
              {pending ? "Enviando…" : "Enviar propuesta"}
            </button>
          </div>
        </form>
      </div>
    </div>
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
