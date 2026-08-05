"use client";

import { useActionState, useState } from "react";
import { saveCostosData } from "@/app/app/actions";
import type { CostosData, TipoEstructura, CalidadAcabados } from "@/lib/proforma/costes";

const TIPOS_ESTRUCTURA: { id: TipoEstructura; label: string; costoBase: string }[] = [
  { id: "concreto", label: "Concreto", costoBase: "$22,000/m²" },
  { id: "acero", label: "Acero estructural", costoBase: "$24,000/m²" },
  { id: "mixta", label: "Mixta (concreto + acero)", costoBase: "$23,000/m²" },
  { id: "mamposteria", label: "Mampostería", costoBase: "$18,000/m²" },
  { id: "otro", label: "Otro / tradicional", costoBase: "$21,000/m²" },
];

const CALIDADES: { id: CalidadAcabados; label: string; factor: string }[] = [
  { id: "economica", label: "Económica", factor: "×0.70" },
  { id: "media", label: "Media", factor: "×1.00" },
  { id: "alta", label: "Alta", factor: "×1.35" },
  { id: "premium", label: "Premium / lujo", factor: "×1.85" },
];

export function CostosForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial?: CostosData;
}) {
  const [tipoEstructura, setTipoEstructura] = useState<TipoEstructura>(
    (initial?.tipo_estructura as TipoEstructura) ?? "concreto",
  );
  const [calidad, setCalidad] = useState<CalidadAcabados>(
    (initial?.calidad_acabados as CalidadAcabados) ?? "media",
  );

  const [state, formAction, pending] = useActionState(
    async (
      _prev: { error: string } | { ok: true } | null,
      formData: FormData,
    ) => saveCostosData(projectId, formData),
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Estructura */}
      <div>
        <SectionLabel>Sistema estructural</SectionLabel>
        <input type="hidden" name="tipo_estructura" value={tipoEstructura} />
        <div className="flex flex-wrap gap-2">
          {TIPOS_ESTRUCTURA.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTipoEstructura(t.id)}
              className={`rounded-md border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                tipoEstructura === t.id
                  ? "border-volt/50 bg-volt/10 text-volt"
                  : "border-line text-muted hover:border-faint hover:text-ink"
              }`}
            >
              <div>{t.label}</div>
              <div className="mt-0.5 text-[10px] text-faint">{t.costoBase}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Calidad de acabados */}
      <div>
        <SectionLabel>Calidad de acabados</SectionLabel>
        <input type="hidden" name="calidad_acabados" value={calidad} />
        <div className="flex flex-wrap gap-2">
          {CALIDADES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCalidad(c.id)}
              className={`rounded-md border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                calidad === c.id
                  ? "border-volt/50 bg-volt/10 text-volt"
                  : "border-line text-muted hover:border-faint hover:text-ink"
              }`}
            >
              <div>{c.label}</div>
              <div className="mt-0.5 text-[10px] text-faint">{c.factor}</div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-faint">
          La calidad de acabados impacta el costo total entre 0.7× y 1.85× el
          costo base. «Premium» se reserva para desarrollos de gama alta con
          mármol, maderas finas, domótica integral.
        </p>
      </div>

      {/* Dimensiones */}
      <div>
        <SectionLabel>Dimensiones y configuración</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="m² totales a construir"
            name="m2_construir"
            defaultValue={initial?.m2_construir}
            placeholder="5200"
          />
          <Field
            label="Niveles sobre rasante"
            name="niveles"
            defaultValue={initial?.niveles}
            placeholder="5"
          />
          <Field
            label="Sótanos (0 a 3)"
            name="sotanos"
            defaultValue={initial?.sotanos}
            placeholder="1"
          />
          <Field
            label="Unidades vendibles"
            name="unidades"
            defaultValue={initial?.unidades}
            placeholder="60 deptos"
          />
          <Field
            label="Cajones de estacionamiento"
            name="cajones_estacionamiento"
            defaultValue={initial?.cajones_estacionamiento}
            placeholder="80"
          />
          <Field
            label="Factor regional (1.0 = CDMX)"
            name="region_factor"
            defaultValue={initial?.region_factor ?? "1.0"}
            placeholder="1.0"
          />
        </div>
        <p className="mt-2 text-[11px] text-faint">
          Factor regional: 1.0 para CDMX/EdoMex zona conurbada, 0.85 para
          interior de la república, 1.10 para zonas turísticas premium.
        </p>
      </div>

      {/* Costos directos adicionales */}
      <div>
        <SectionLabel>Costos directos adicionales</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field
            label="Costo del terreno"
            name="costo_terreno"
            defaultValue={initial?.costo_terreno}
            placeholder="$78,000,000"
          />
          <Field
            label="Permisos y trámites"
            name="costo_permisos_tramites"
            defaultValue={initial?.costo_permisos_tramites}
            placeholder="$3,500,000"
          />
          <Field
            label="Proyecto arquitectónico"
            name="costo_proyecto_arquitectonico"
            defaultValue={initial?.costo_proyecto_arquitectonico}
            placeholder="$2,800,000"
          />
        </div>
        <p className="mt-2 text-[11px] text-faint">
          Permisos típicos: 3-5% del costo directo. Proyecto arquitectónico:
          5-8% del costo directo.
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-volt px-5 py-2.5 text-[13px] font-extrabold text-on-volt transition-all hover:bg-volt-sub disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar costos"}
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