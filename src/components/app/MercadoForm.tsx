"use client";

import { useActionState, useState } from "react";
import { saveMercadoData } from "@/app/app/actions";
import type { MercadoData, TipoProyecto } from "@/lib/proforma/mercado";

const TIPOS: { id: TipoProyecto; label: string }[] = [
  { id: "habitacional", label: "Habitacional" },
  { id: "habitacional-mixto", label: "Habitacional + comercio" },
  { id: "comercial", label: "Comercial" },
  { id: "oficinas", label: "Oficinas" },
  { id: "industrial", label: "Industrial" },
  { id: "mixto", label: "Mixto" },
];

const NSE: { id: MercadoData["nivel_socioeconomico"]; label: string }[] = [
  { id: "A/B", label: "A/B · Alto" },
  { id: "C+", label: "C+ · Medio-alto" },
  { id: "C", label: "C · Medio" },
  { id: "C-", label: "C- · Medio-bajo" },
  { id: "D+", label: "D+ · Bajo" },
];

export function MercadoForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial?: MercadoData;
}) {
  const [tipo, setTipo] = useState<TipoProyecto>(
    (initial?.tipo_proyecto as TipoProyecto) ?? "habitacional",
  );
  const [nse, setNse] = useState<MercadoData["nivel_socioeconomico"]>(
    initial?.nivel_socioeconomico ?? "C+",
  );

  const [state, formAction, pending] = useActionState(
    async (
      _prev: { error: string } | { ok: true } | null,
      formData: FormData,
    ) => saveMercadoData(projectId, formData),
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Tipo */}
      <div>
        <SectionLabel>Tipo de producto</SectionLabel>
        <input type="hidden" name="tipo_proyecto" value={tipo} />
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTipo(t.id)}
              className={`rounded-md border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                tipo === t.id
                  ? "border-volt/50 bg-volt/10 text-volt"
                  : "border-line text-muted hover:border-faint hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ubicación + Producto */}
      <div>
        <SectionLabel>Producto y ubicación</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Municipio/Alcaldía"
            name="municipio"
            defaultValue={initial?.municipio}
            placeholder="Cuauhtémoc, CDMX"
          />
          <Field
            label="Zona / Colonia"
            name="zona"
            defaultValue={initial?.zona}
            placeholder="Juárez"
          />
          <Field
            label="m² totales a construir"
            name="m2_construir_total"
            defaultValue={initial?.m2_construir_total}
            placeholder="5200"
          />
          <Field
            label="Unidades totales"
            name="unidades_totales"
            defaultValue={initial?.unidades_totales}
            placeholder="60"
          />
          <Field
            label="m² promedio por unidad"
            name="m2_promedio_unidad"
            defaultValue={initial?.m2_promedio_unidad}
            placeholder="75"
          />
          <Field
            label="Radio de búsqueda (km)"
            name="radio_busqueda_km"
            defaultValue={initial?.radio_busqueda_km}
            placeholder="5"
          />
        </div>
        <label className="mt-3 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
            Amenidades destacadas
          </span>
          <textarea
            name="amenidades"
            rows={2}
            defaultValue={initial?.amenidades}
            placeholder="Roof garden, gym, 2 cajones por depto, vigilancia 24h, pet friendly"
            className="rounded-md border border-line bg-input px-3 py-2.5 text-sm text-ink outline-none transition-shadow placeholder:text-faint focus:border-volt focus:shadow-[0_0_0_3px_rgba(200,255,0,0.18)]"
          />
        </label>
      </div>

      {/* Demanda esperada */}
      <div>
        <SectionLabel>Demanda esperada (tu estimación)</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Precio/m² esperado (bajo)"
            name="precio_m2_esperado"
            defaultValue={initial?.precio_m2_esperado}
            placeholder="$110,000"
          />
          <Field
            label="Precio/m² esperado (alto)"
            name="precio_m2_esperado_alto"
            defaultValue={initial?.precio_m2_esperado_alto}
            placeholder="$135,000"
          />
        </div>
      </div>

      {/* Público objetivo */}
      <div>
        <SectionLabel>Público objetivo</SectionLabel>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
            Descripción del comprador objetivo
          </span>
          <textarea
            name="publico_objetivo"
            rows={2}
            defaultValue={initial?.publico_objetivo}
            placeholder="Jóvenes profesionistas 28-40, sin hijos, que buscan su primer depa bien ubicado cerca del trabajo"
            className="rounded-md border border-line bg-input px-3 py-2.5 text-sm text-ink outline-none transition-shadow placeholder:text-faint focus:border-volt focus:shadow-[0_0_0_3px_rgba(200,255,0,0.18)]"
          />
        </label>
        <div className="mt-3">
          <SectionLabel>Nivel socioeconómico objetivo</SectionLabel>
          <input type="hidden" name="nivel_socioeconomico" value={nse} />
          <div className="flex flex-wrap gap-2">
            {NSE.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setNse(n.id ?? "C+")}
                className={`rounded-md border px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                  nse === n.id
                    ? "border-volt/50 bg-volt/10 text-volt"
                    : "border-line text-muted hover:border-faint hover:text-ink"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-volt px-5 py-2.5 text-[13px] font-extrabold text-on-volt transition-all hover:bg-volt-sub disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar mercado"}
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