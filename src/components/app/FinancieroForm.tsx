"use client";

import { useActionState } from "react";
import { saveFinancieroData } from "@/app/app/actions";
import type { FinancieroData } from "@/lib/proforma/financiero";

export function FinancieroForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial?: FinancieroData;
}) {
  const [state, formAction, pending] = useActionState(
    async (
      _prev: { error: string } | { ok: true } | null,
      formData: FormData,
    ) => saveFinancieroData(projectId, formData),
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Inversión */}
      <div>
        <SectionLabel>Inversión y financiamiento</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Inversión total"
            name="inversion_total"
            defaultValue={initial?.inversion_total}
            placeholder="$92,000,000"
          />
          <Field
            label="Capital propio"
            name="capital_propio"
            defaultValue={initial?.capital_propio}
            placeholder="$30,000,000"
          />
          <Field
            label="Deuda / crédito"
            name="deuda"
            defaultValue={initial?.deuda}
            placeholder="$62,000,000"
          />
          <Field
            label="Tasa de interés anual (%)"
            name="tasa_interes_anual"
            defaultValue={initial?.tasa_interes_anual}
            placeholder="12.5"
          />
          <Field
            label="Plazo del crédito (meses)"
            name="plazo_credito_meses"
            defaultValue={initial?.plazo_credito_meses}
            placeholder="24"
          />
          <Field
            label="Comisión de apertura (%)"
            name="comision_apertura_pct"
            defaultValue={initial?.comision_apertura_pct}
            placeholder="1.5"
          />
        </div>
      </div>

      {/* Ingresos */}
      <div>
        <SectionLabel>Ingresos esperados</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Ingreso bruto total"
            name="ingreso_bruto_total"
            defaultValue={initial?.ingreso_bruto_total}
            placeholder="$117,000,000"
          />
          <Field
            label="Unidades totales"
            name="unidades_totales"
            defaultValue={initial?.unidades_totales}
            placeholder="60"
          />
          <Field
            label="m² totales"
            name="m2_construir_total"
            defaultValue={initial?.m2_construir_total}
            placeholder="5,200"
          />
          <Field
            label="Precio/m² promedio"
            name="precio_m2_promedio"
            defaultValue={initial?.precio_m2_promedio}
            placeholder="$22,500"
          />
        </div>
      </div>

      {/* Costos operativos */}
      <div>
        <SectionLabel>Costos operativos durante preventa y venta</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field
            label="Marketing (% del ingreso)"
            name="costo_marketing_pct_ingreso"
            defaultValue={initial?.costo_marketing_pct_ingreso ?? "3"}
            placeholder="3"
          />
          <Field
            label="Comercialización (% del ingreso)"
            name="costo_comercializacion_pct_ingreso"
            defaultValue={initial?.costo_comercializacion_pct_ingreso ?? "2"}
            placeholder="2"
          />
          <Field
            label="Operación mensual ($)"
            name="costo_operacion_mensual"
            defaultValue={initial?.costo_operacion_mensual}
            placeholder="50,000"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-volt px-5 py-2.5 text-[13px] font-extrabold text-on-volt transition-all hover:bg-volt-sub disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar financiero"}
        </button>
        {state && "ok" in state && (
          <span className="text-[13px] text-success">Guardado ✓</span>
        )}
        {state && "error" in state && (
          <span className="text-[13px] text-danger">{state.error}</span>
        )}
      </div>
    </form>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
      {children}
    </div>
  );
}

function Field({
  label,
  className = "",
  ...props
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
        {label}
      </span>
      <input
        {...props}
        className="rounded-md border border-line bg-input px-3 py-2.5 text-sm text-ink outline-none transition-shadow placeholder:text-faint focus:border-volt focus:shadow-[0_0_0_3px_rgba(200,255,0,0.18)]"
      />
    </label>
  );
}