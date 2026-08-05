"use client";

import { useActionState } from "react";
import { saveRiesgosData } from "@/app/app/actions";

export function RiesgosForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial?: {
    notas_adicionales?: string;
    experiencia_previa?: "nula" | "1_proyecto" | "2-5_proyectos" | "5+_proyectos";
    tiene_socio_inversionista?: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(
    async (
      _prev: { error: string } | { ok: true } | null,
      formData: FormData,
    ) => saveRiesgosData(projectId, formData),
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <SectionLabel>Experiencia previa del equipo</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "nula", label: "Nula (primer proyecto)" },
              { id: "1_proyecto", label: "1 proyecto" },
              { id: "2-5_proyectos", label: "2-5 proyectos" },
              { id: "5+_proyectos", label: "5+ proyectos" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-line bg-base/40 px-3 py-2 text-[13px] transition-colors hover:border-faint has-[input:checked]:border-volt/50 has-[input:checked]:bg-volt/10 has-[input:checked]:text-volt"
            >
              <input
                type="radio"
                name="experiencia_previa"
                value={opt.id}
                defaultChecked={initial?.experiencia_previa === opt.id}
                className="accent-volt"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-md border border-line bg-base/40 p-3 transition-colors hover:border-faint">
        <input
          type="checkbox"
          name="tiene_socio_inversionista"
          defaultChecked={initial?.tiene_socio_inversionista}
          className="h-4 w-4 rounded border-line accent-volt"
        />
        <div>
          <div className="text-[13px] font-semibold text-ink">
            Tengo socio inversionista
          </div>
          <div className="text-[11px] text-faint">
            Cambia el análisis: la decisión final es compartida y los flujos de
            capital son bipartitos.
          </div>
        </div>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
          Notas adicionales o riesgos específicos
        </span>
        <textarea
          name="notas_adicionales"
          rows={3}
          defaultValue={initial?.notas_adicionales}
          placeholder="Ej: tenemos un acuerdo verbal con el municipio para reducir el derecho de vía; el socio tiene experiencia en preventas residenciales..."
          className="rounded-md border border-line bg-input px-3 py-2.5 text-sm text-ink outline-none transition-shadow placeholder:text-faint focus:border-volt focus:shadow-[0_0_0_3px_rgba(200,255,0,0.18)]"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-volt px-5 py-2.5 text-[13px] font-extrabold text-on-volt transition-all hover:bg-volt-sub disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar contexto"}
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