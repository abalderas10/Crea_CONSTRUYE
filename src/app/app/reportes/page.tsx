import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reportes" };

const REPORTS = [
  { name: "Proforma completa", desc: "Documento ensamblado con los outputs de las 8 herramientas.", fmt: "PDF · Excel · PPT" },
  { name: "Estudio de mercado", desc: "Reporte standalone de la Herramienta 3 para clientes y socios.", fmt: "PDF" },
  { name: "Reporte ejecutivo", desc: "1-pager con métricas clave y veredicto GO/NO-GO.", fmt: "PDF" },
  { name: "Memorándum de inversión", desc: "Documento formal para levantar capital con template bancario.", fmt: "PDF · PPT" },
];

export default function ReportesPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Reportes</h1>
      <p className="mt-1 text-sm text-muted">
        Exporta tu proforma en formato profesional. Disponible cuando completes
        las herramientas.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {REPORTS.map((r) => (
          <div
            key={r.name}
            className="rounded-xl border border-line bg-raised p-5"
          >
            <h3 className="font-bold text-ink">{r.name}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{r.desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wide text-faint">
                {r.fmt}
              </span>
              <span className="rounded-sm bg-base px-2 py-1 text-[10px] font-bold text-faint">
                Próximamente
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
