"use client";

import { useActionState } from "react";
import { saveTerrenoData } from "@/app/app/actions";

type Loc = Partial<{
  direccion: string;
  ciudad: string;
  superficie_m2: string;
  precio_solicitado: string;
  tipo_desarrollo: string;
}>;

export function TerrenoForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial?: Loc;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string } | { ok: true } | null, formData: FormData) =>
      saveTerrenoData(projectId, formData),
    null,
  );

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <Field label="Dirección" name="direccion" defaultValue={initial?.direccion} placeholder="Av. Reforma 360" className="sm:col-span-2" required />
      <Field label="Ciudad / zona" name="ciudad" defaultValue={initial?.ciudad} placeholder="Cuauhtémoc, CDMX" />
      <Field label="Superficie (m²)" name="superficie_m2" defaultValue={initial?.superficie_m2} placeholder="500" />
      <Field label="Precio solicitado" name="precio_solicitado" defaultValue={initial?.precio_solicitado} placeholder="$25,000,000" />
      <Field label="Tipo de desarrollo" name="tipo_desarrollo" defaultValue={initial?.tipo_desarrollo} placeholder="Uso mixto · 60 deptos" />

      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-volt px-5 py-2.5 text-[13px] font-extrabold text-on-volt transition-all hover:bg-volt-sub disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar localización"}
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
