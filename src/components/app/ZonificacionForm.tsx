"use client";

import { useActionState, useState } from "react";
import { saveZonificacionData } from "@/app/app/actions";
import {
  permisosRequeridos,
  type ZonificacionData,
  type TipoProyecto,
} from "@/lib/proforma/zonificacion";

const TIPOS: { id: TipoProyecto; label: string }[] = [
  { id: "habitacional", label: "Habitacional" },
  { id: "habitacional-mixto", label: "Habitacional + comercio" },
  { id: "comercial", label: "Comercial" },
  { id: "oficinas", label: "Oficinas" },
  { id: "industrial", label: "Industrial" },
  { id: "mixto", label: "Uso mixto" },
  { id: "otro", label: "Otro" },
];

export function ZonificacionForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial?: ZonificacionData;
}) {
  const [tipo, setTipo] = useState<TipoProyecto>(
    (initial?.tipo_proyecto as TipoProyecto) ?? "habitacional",
  );
  const [state, formAction, pending] = useActionState(
    async (
      _prev: { error: string } | { ok: true } | null,
      formData: FormData,
    ) => saveZonificacionData(projectId, formData),
    null,
  );

  const n = initial?.norma;
  const r = initial?.restricciones;
  const s = initial?.servicios;
  const permisos = permisosRequeridos(tipo);

  return (
    <form action={formAction} className="space-y-6">
      {/* Tipo de proyecto */}
      <div>
        <SectionLabel>Tipo de proyecto</SectionLabel>
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
        <input type="hidden" name="tipo_proyecto" value={tipo} />
        <p className="mt-2 text-[11px] leading-relaxed text-faint">
          Esto define el catálogo de permisos y la normatividad a aplicar.
        </p>
      </div>

      {/* Propuesta */}
      <div>
        <SectionLabel>Propuesta</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Unidades previstas"
            name="propuesta_unidades"
            defaultValue={initial?.propuesta_unidades}
            placeholder="60 deptos / 12 locales / 1 nave"
          />
          <Field
            label="m² a construir (propuesta)"
            name="propuesta_m2_construir"
            defaultValue={initial?.propuesta_m2_construir}
            placeholder="5,800"
          />
        </div>
      </div>

      {/* Normativa */}
      <div>
        <SectionLabel>Normativa de la zona</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Clave de zona"
            name="zona_codigo"
            defaultValue={n?.zona_codigo}
            placeholder="HM 4/20/Z (CDMX) · H.200.A (EdoMex)"
          />
          <Field
            label="Uso permitido"
            name="uso_permitido"
            defaultValue={n?.uso_permitido}
            placeholder="Habitacional mixto"
          />
          <Field
            label="COS (0–1)"
            name="cos"
            defaultValue={n?.cos}
            placeholder="0.6"
          />
          <Field
            label="CUS"
            name="cus"
            defaultValue={n?.cus}
            placeholder="3.0"
          />
          <Field
            label="Niveles máximos"
            name="niveles_max"
            defaultValue={n?.niveles_max}
            placeholder="5"
          />
          <Field
            label="Área libre mínima (%)"
            name="area_libre_pct"
            defaultValue={n?.area_libre_pct}
            placeholder="20"
          />
          <Field
            label="Densidad viv/ha (opcional)"
            name="densidad_viv_ha"
            defaultValue={n?.densidad_viv_ha}
            placeholder="120"
          />
          <Field
            label="Altura máx (m, opcional)"
            name="altura_max_m"
            defaultValue={n?.altura_max_m}
            placeholder="18"
          />
        </div>
      </div>

      {/* Restricciones */}
      <div>
        <SectionLabel>Restricciones del predio</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Afectación"
            name="afectacion"
            defaultValue={r?.afectacion}
            placeholder="Derecho de vía, área verde…"
          />
          <Field
            label="Zona de riesgo"
            name="zona_riesgo"
            defaultValue={r?.zona_riesgo}
            placeholder="Inundación, hundimiento, sísmica…"
          />
          <Field
            label="Restricciones ambientales"
            name="restricciones_ambientales"
            defaultValue={r?.restricciones_ambientales}
            placeholder="MIA requerida, cuerpo de agua cercano…"
            className="sm:col-span-2"
          />
        </div>
        <Check
          label="Zona de patrimonio (INAH/INBAL)"
          name="zona_patrimonio"
          defaultChecked={r?.zona_patrimonio}
        />
      </div>

      {/* Servicios */}
      <div>
        <SectionLabel>Servicios disponibles</SectionLabel>
        <div className="grid gap-2 sm:grid-cols-2">
          <Check label="Agua potable" name="agua" defaultChecked={s?.agua} />
          <Check label="Drenaje" name="drenaje" defaultChecked={s?.drenaje} />
          <Check
            label="Electricidad"
            name="electricidad"
            defaultChecked={s?.electricidad}
          />
          <Check label="Gas" name="gas" defaultChecked={s?.gas} />
          <Check
            label="Vialidad pavimentada"
            name="vialidad_pavimentada"
            defaultChecked={s?.vialidad_pavimentada}
          />
          <Check
            label="Transporte público cercano"
            name="transporte_publico"
            defaultChecked={s?.transporte_publico}
          />
        </div>
      </div>

      {/* Permisos preview */}
      <div>
        <SectionLabel>Permisos típicos para {TIPOS.find((t) => t.id === tipo)?.label}</SectionLabel>
        <ul className="space-y-1.5 rounded-lg border border-line bg-base/40 p-4 text-[12.5px] text-muted">
          {permisos.map((p, i) => (
            <li key={p} className="flex gap-2">
              <span className="tabular w-4 shrink-0 text-faint">{i + 1}.</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-faint">
          Claude ajustará esta lista con permisos específicos del municipio y el proyecto.
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-volt px-5 py-2.5 text-[13px] font-extrabold text-on-volt transition-all hover:bg-volt-sub disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar zonificación"}
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

function Check({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 rounded-md border border-line bg-base/40 px-3 py-2.5 text-[13px] text-ink transition-colors hover:border-faint">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-line bg-input accent-volt"
      />
      <span>{label}</span>
    </label>
  );
}
