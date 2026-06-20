"use client";

import { useActionState, useState } from "react";
import { saveTerrenoData } from "@/app/app/actions";
import { JURISDICCIONES, getJurisdiccion } from "@/lib/proforma/jurisdicciones";
import type { TerrenoData } from "@/lib/proforma/terreno";

export function TerrenoForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial?: TerrenoData;
}) {
  const [entidadId, setEntidadId] = useState(initial?.entidad?.tipo ?? "cdmx");
  const j = getJurisdiccion(entidadId);

  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string } | { ok: true } | null, formData: FormData) =>
      saveTerrenoData(projectId, formData),
    null,
  );

  const p = initial?.predio;
  const z = initial?.zonificacion;

  return (
    <form action={formAction} className="space-y-6">
      {/* Entidad */}
      <div>
        <SectionLabel>Entidad</SectionLabel>
        <input type="hidden" name="entidad_tipo" value={entidadId} />
        <div className="flex flex-wrap gap-2">
          {JURISDICCIONES.map((jur) => (
            <button
              key={jur.id}
              type="button"
              onClick={() => setEntidadId(jur.id)}
              className={`rounded-md border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                entidadId === jur.id
                  ? "border-volt/50 bg-volt/10 text-volt"
                  : "border-line text-muted hover:border-faint hover:text-ink"
              }`}
            >
              {jur.nombre}
            </button>
          ))}
        </div>

        {j.configurable && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Nombre del estado" name="entidad_estado" defaultValue={initial?.entidad?.estado} placeholder="Ej. Jalisco" />
            <Field label="Documento de zonificación" name="entidad_documento" defaultValue={initial?.entidad?.documento} placeholder="Ej. Plan Parcial de Desarrollo Urbano" />
          </div>
        )}

        <p className="mt-2 text-[11px] leading-relaxed text-faint">
          {j.nota}{" "}
          {j.consultaUrl && (
            <a href={j.consultaUrl} target="_blank" rel="noreferrer" className="text-volt hover:underline">
              Consultar →
            </a>
          )}
        </p>
      </div>

      {/* Predio (de la boleta predial) */}
      <div>
        <SectionLabel>Predio · de la boleta predial</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={j.territorioLabel} name="territorio" defaultValue={p?.territorio} placeholder={j.id === "cdmx" ? "Cuauhtémoc" : "Naucalpan"} />
          <Field label={j.catastroHint} name="cuenta_catastral" defaultValue={p?.cuenta_catastral} placeholder="000-000-000" />
          <Field label="Dirección" name="direccion" defaultValue={p?.direccion} placeholder="Av. Paseo de la Reforma 360" className="sm:col-span-2" required />
          <Field label="Colonia" name="colonia" defaultValue={p?.colonia} placeholder="Juárez" />
          <Field label="Superficie del terreno (m²)" name="superficie_terreno" defaultValue={p?.superficie_terreno} placeholder="520" />
          <Field label="Superficie construida existente (m²)" name="superficie_construccion" defaultValue={p?.superficie_construccion} placeholder="0" />
          <Field label="Valor catastral" name="valor_catastral" defaultValue={p?.valor_catastral} placeholder="$18,000,000" />
        </div>
      </div>

      {/* Proyecto */}
      <div>
        <SectionLabel>Proyecto</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Precio solicitado" name="precio_solicitado" defaultValue={p?.precio_solicitado} placeholder="$78,000,000" />
          <Field label="Tipo de desarrollo" name="tipo_desarrollo" defaultValue={p?.tipo_desarrollo} placeholder="Uso mixto · 60 deptos" />
        </div>
      </div>

      {/* Zonificación */}
      <div>
        <SectionLabel>Zonificación · {j.documento}</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={j.zonaLabel} name="zona_codigo" defaultValue={z?.zona_codigo} placeholder={j.zonaPlaceholder} />
          <Field label="Uso permitido" name="uso_permitido" defaultValue={z?.uso_permitido} placeholder="Habitacional mixto" />
          <Field label="COS (0–1)" name="cos" defaultValue={z?.cos} placeholder="0.6" />
          <Field label="CUS" name="cus" defaultValue={z?.cus} placeholder="3.0" />
          <Field label="Niveles máximos" name="niveles_max" defaultValue={z?.niveles_max} placeholder="5" />
          <Field label="Área libre mínima (%)" name="area_libre_pct" defaultValue={z?.area_libre_pct} placeholder="20" />
        </div>
        <p className="mt-2 text-[11px] text-faint">
          COS = % del terreno ocupable en planta baja. CUS = cuántos m² totales
          puedes construir. De aquí sale la envolvente construible.
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-volt px-5 py-2.5 text-[13px] font-extrabold text-on-volt transition-all hover:bg-volt-sub disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar datos del terreno"}
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
