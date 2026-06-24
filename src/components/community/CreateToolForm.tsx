"use client";

import { useState, useActionState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createToolProposal, type CreateToolState } from "@/app/app/herramientas/actions";
import { SECTIONS } from "@/lib/community/sections";
import {
  REFERENCIA_TIPO_LABEL,
  type Referencia,
  type ReferenciaTipo,
} from "@/lib/community/rigor";

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
  const [referencias, setReferencias] = useState<Referencia[]>([
    { tipo: "libro", titulo: "" },
  ]);

  function updateRef(i: number, patch: Partial<Referencia>) {
    setReferencias((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }
  function addRef() {
    setReferencias((rs) => [...rs, { tipo: "libro", titulo: "" }]);
  }
  function removeRef(i: number) {
    setReferencias((rs) => rs.filter((_, j) => j !== i));
  }

  const refsLimpias = referencias.filter((r) => r.titulo.trim());

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

          {/* Referencias / fuentes — el "de acuerdo al libro" */}
          <div className="rounded-lg border border-line bg-raised p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] font-bold text-ink">
                  Fuentes que la sustentan
                </span>
                <p className="mt-0.5 text-[11px] leading-relaxed text-faint">
                  Cita el libro, norma o paper en que se basa. Esto la hace
                  «sustentada» — el rigor sale de la evidencia, no de decir «soy
                  experto».
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2.5">
              {referencias.map((r, i) => (
                <div key={i} className="rounded-md border border-line bg-base p-2.5">
                  <div className="flex items-center gap-2">
                    <select
                      value={r.tipo}
                      onChange={(e) =>
                        updateRef(i, { tipo: e.target.value as ReferenciaTipo })
                      }
                      className="rounded-md border border-line bg-raised px-2 py-1.5 text-[12px] text-ink focus:border-volt focus:outline-none"
                    >
                      {(Object.keys(REFERENCIA_TIPO_LABEL) as ReferenciaTipo[]).map(
                        (t) => (
                          <option key={t} value={t}>
                            {REFERENCIA_TIPO_LABEL[t]}
                          </option>
                        ),
                      )}
                    </select>
                    <input
                      value={r.titulo}
                      onChange={(e) => updateRef(i, { titulo: e.target.value })}
                      placeholder="Título de la fuente"
                      className="flex-1 rounded-md border border-line bg-raised px-2.5 py-1.5 text-[12px] text-ink placeholder:text-faint focus:border-volt focus:outline-none"
                    />
                    {referencias.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRef(i)}
                        className="grid h-7 w-7 place-items-center rounded-md text-faint hover:bg-hover hover:text-danger"
                        aria-label="Quitar fuente"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input
                      value={r.autor ?? ""}
                      onChange={(e) => updateRef(i, { autor: e.target.value })}
                      placeholder="Autor / editorial / autoridad"
                      className="rounded-md border border-line bg-raised px-2.5 py-1.5 text-[12px] text-ink placeholder:text-faint focus:border-volt focus:outline-none"
                    />
                    <input
                      value={r.detalle ?? ""}
                      onChange={(e) => updateRef(i, { detalle: e.target.value })}
                      placeholder="Edición, página, artículo, año"
                      className="rounded-md border border-line bg-raised px-2.5 py-1.5 text-[12px] text-ink placeholder:text-faint focus:border-volt focus:outline-none"
                    />
                  </div>
                  <input
                    value={r.url ?? ""}
                    onChange={(e) => updateRef(i, { url: e.target.value })}
                    placeholder="URL o DOI (opcional)"
                    className="mt-2 w-full rounded-md border border-line bg-raised px-2.5 py-1.5 text-[12px] text-ink placeholder:text-faint focus:border-volt focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRef}
              className="mt-2.5 text-[12px] font-bold text-volt hover:underline"
            >
              + Agregar fuente
            </button>
            <input type="hidden" name="referencias" value={JSON.stringify(refsLimpias)} />
          </div>

          {/* Caso de prueba (opcional) */}
          <details className="rounded-lg border border-line bg-raised p-3.5">
            <summary className="cursor-pointer text-[12px] font-bold text-ink">
              Caso de prueba resuelto{" "}
              <span className="font-normal text-faint">(opcional · suma rigor)</span>
            </summary>
            <p className="mt-2 text-[11px] leading-relaxed text-faint">
              Un ejemplo con números reales que demuestre que la herramienta da
              el resultado correcto.
            </p>
            <div className="mt-3 space-y-2">
              <textarea
                name="caso_entradas"
                rows={2}
                placeholder="Entradas (ej. superficie 520 m², COS 0.6, CUS 3.0)"
                className={inputCls}
              />
              <textarea
                name="caso_esperado"
                rows={2}
                placeholder="Resultado esperado (ej. 1,560 m² construibles, desplante 312 m²)"
                className={inputCls}
              />
            </div>
          </details>

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
