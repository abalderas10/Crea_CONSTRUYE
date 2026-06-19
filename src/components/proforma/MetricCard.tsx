import type { ReactNode } from "react";
import { SourceTag } from "@/components/proforma/SourceTag";
import type { SourceKind } from "@/lib/proforma/types";

/** Tarjeta de métrica/KPI reutilizable. El dato principal en mono. */
export function MetricCard({
  label,
  value,
  unit,
  accent = false,
  ok = false,
  source,
  sourceKind,
  hint,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  /** Pinta el valor en volt (el dato más importante de la tarjeta). */
  accent?: boolean;
  /** Pinta el valor en success (estados positivos / GO). */
  ok?: boolean;
  source?: string;
  sourceKind?: SourceKind;
  hint?: string;
}) {
  const color = accent
    ? "var(--color-volt)"
    : ok
      ? "var(--color-success)"
      : "var(--color-ink)";

  return (
    <div
      className="rounded-lg border bg-raised px-4 py-4"
      style={{ borderColor: accent ? "rgba(200,255,0,0.25)" : "var(--color-line)" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
          {label}
        </span>
        {source && <SourceTag source={source} kind={sourceKind} />}
      </div>
      <div className="tabular mt-1.5 text-2xl font-black" style={{ color }}>
        {value}
        {unit && (
          <span className="ml-0.5 text-sm font-normal text-faint">{unit}</span>
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-faint">{hint}</p>}
    </div>
  );
}
