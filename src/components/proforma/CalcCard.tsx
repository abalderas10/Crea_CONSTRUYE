"use client";

import { useState, type ReactNode } from "react";
import { SourceTag } from "@/components/proforma/SourceTag";
import type { CalcInput } from "@/lib/proforma/types";

type Status = "auto" | "manual" | "ai";

const STATUS_COLOR: Record<Status, string> = {
  auto: "var(--color-volt)",
  manual: "var(--color-faint)",
  ai: "var(--color-violet)",
};
const STATUS_LABEL: Record<Status, string> = {
  auto: "Auto",
  manual: "Manual",
  ai: "IA",
};

/**
 * Tarjeta de cálculo transparente y reutilizable.
 * Muestra el resultado, los datos de entrada con su procedencia, la fórmula
 * usada, y permite editar la fórmula.
 */
export function CalcCard({
  title,
  icon,
  result,
  resultUnit,
  resultLabel,
  accent = true,
  status,
  inputs,
  formula,
  formulaNote,
  defaultOpen = true,
  editable = true,
  onSaveFormula,
}: {
  title: string;
  icon?: ReactNode;
  result: ReactNode;
  resultUnit?: string;
  resultLabel?: string;
  accent?: boolean;
  status?: Status;
  inputs: CalcInput[];
  formula: string;
  formulaNote?: string;
  defaultOpen?: boolean;
  editable?: boolean;
  onSaveFormula?: (formula: string) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(formula);
  const [current, setCurrent] = useState(formula);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await onSaveFormula?.(draft);
      setCurrent(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="rounded-xl border bg-raised"
      style={{
        borderColor: accent ? "rgba(200,255,0,0.22)" : "var(--color-line)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Header + resultado */}
      <div className="p-5">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="grid h-7 w-7 place-items-center rounded-md bg-base text-faint">
              {icon}
            </span>
          )}
          <h3 className="text-[13px] font-bold text-ink">{title}</h3>
          {status && (
            <span
              className="ml-auto rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
              style={{
                color: STATUS_COLOR[status],
                background: `${STATUS_COLOR[status]}14`,
              }}
            >
              {STATUS_LABEL[status]}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span
            className="tabular text-3xl font-black"
            style={{ color: accent ? "var(--color-volt)" : "var(--color-ink)" }}
          >
            {result}
          </span>
          {resultUnit && (
            <span className="text-sm text-faint">{resultUnit}</span>
          )}
        </div>
        {resultLabel && (
          <p className="mt-1 text-[12px] text-muted">{resultLabel}</p>
        )}
      </div>

      {/* Desglose transparente */}
      <div className="border-t border-line">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 px-5 py-2.5 text-left"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">
            Cómo se calcula
          </span>
          <span
            className={`ml-auto text-faint transition-transform ${open ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </button>

        {open && (
          <div className="px-5 pb-5">
            {/* Datos usados */}
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">
              Datos usados
            </div>
            <div className="mt-2 overflow-hidden rounded-lg border border-line">
              {inputs.map((inp, i) => (
                <div
                  key={inp.label}
                  className="flex items-center gap-2 px-3 py-2"
                  style={{ borderTop: i ? "1px solid var(--color-line)" : "none" }}
                >
                  <span className="text-[12px] text-muted">{inp.label}</span>
                  <span className="tabular ml-auto text-[12px] font-semibold text-ink">
                    {inp.value}
                  </span>
                  <SourceTag source={inp.source} kind={inp.kind} />
                </div>
              ))}
            </div>

            {/* Fórmula */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">
                Fórmula
              </div>
              {editable && !editing && (
                <button
                  onClick={() => {
                    setDraft(current);
                    setEditing(true);
                  }}
                  className="rounded-md border border-line px-2.5 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-faint hover:text-ink"
                >
                  Editar fórmula
                </button>
              )}
            </div>

            {editing ? (
              <div className="mt-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-volt/40 bg-input px-3 py-2.5 font-mono text-[12px] text-ink outline-none focus:shadow-[0_0_0_3px_rgba(200,255,0,0.18)]"
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="rounded-md bg-volt px-3 py-1.5 text-[12px] font-extrabold text-on-volt transition-colors hover:bg-volt-sub disabled:opacity-60"
                  >
                    {saving ? "Guardando…" : "Guardar"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-md px-3 py-1.5 text-[12px] font-semibold text-muted hover:text-ink"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-base px-3 py-2.5 font-mono text-[12px] leading-relaxed text-muted">
                {current}
              </pre>
            )}

            {formulaNote && (
              <p className="mt-2 text-[11px] leading-relaxed text-faint">
                {formulaNote}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
