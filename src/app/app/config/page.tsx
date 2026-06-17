import type { Metadata } from "next";
import { DEMO_PROJECTS } from "@/lib/projects";

export const metadata: Metadata = { title: "Configuración" };

export default function ConfigPage() {
  const p = DEMO_PROJECTS[0];
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">
        Configuración del proyecto
      </h1>
      <p className="mt-1 text-sm text-muted">
        Datos, colaboradores y contexto que Claude usa en cada análisis.
      </p>

      <div className="mt-8 max-w-xl space-y-3">
        <Row label="Nombre" value={p.name} />
        <Row label="Municipio" value={p.municipio} />
        <Row label="Tipo" value={p.tipo} />
        <Row label="Creado" value={p.createdAt} />
      </div>

      <div className="mt-8 max-w-xl rounded-xl border border-line bg-raised p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
          Contexto para Claude
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Torre de uso mixto en {p.municipio} para el segmento medio-alto. Este
          resumen se editará y persistirá en Supabase para que Claude mantenga el
          contexto entre sesiones.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-raised px-4 py-3">
      <span className="text-[11px] uppercase tracking-wide text-faint">
        {label}
      </span>
      <span className="text-[13px] font-medium text-ink">{value}</span>
    </div>
  );
}
