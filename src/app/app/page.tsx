import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { TOOL_ICONS } from "@/components/icons/ToolIcons";
import { DEMO_PROJECTS, completedCount, type ToolStatus } from "@/lib/projects";

const STATUS_LABEL: Record<ToolStatus, string> = {
  done: "Completado",
  in_progress: "En proceso",
  empty: "Pendiente",
};
const STATUS_COLOR: Record<ToolStatus, string> = {
  done: "var(--color-success)",
  in_progress: "var(--color-violet)",
  empty: "var(--color-faint)",
};

const KPIS = [
  { label: "Score terreno", value: "8.4", suffix: "/10", accent: false },
  { label: "Precio/m² objetivo", value: "$8,420", accent: true },
  { label: "Inversión total", value: "$142M", accent: false },
  { label: "TIR estimada", value: "24.5%", accent: false },
];

const ACTIVITY = [
  { when: "Hace 2 días", text: "Mercado auto-actualizado: precio promedio de zona subió a $8,420/m²", ai: false },
  { when: "Hace 4 días", text: "Claude completó el análisis de Zonificación — COS/CUS validados", ai: true },
  { when: "Hace 1 semana", text: "Ingresaste los datos del Terreno", ai: false },
];

export default function DashboardPage() {
  const project = DEMO_PROJECTS[0];
  const done = completedCount(project);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {project.municipio} · {project.tipo}
          </p>
        </div>
        <span className="rounded-md border border-volt/30 bg-volt/[0.06] px-3 py-1.5 text-[13px] font-bold text-volt">
          {done}/8 herramientas
        </span>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div
            key={k.label}
            className="rounded-lg border bg-raised px-4 py-4"
            style={{ borderColor: k.accent ? "rgba(200,255,0,0.25)" : "var(--color-line)" }}
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
              {k.label}
            </div>
            <div
              className="tabular mt-1 text-2xl font-black"
              style={{ color: k.accent ? "var(--color-volt)" : "var(--color-ink)" }}
            >
              {k.value}
              {k.suffix && (
                <span className="text-sm font-normal text-faint">{k.suffix}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tool status grid */}
      <h2 className="mt-10 text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
        Herramientas del proforma
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((t) => {
          const Icon = TOOL_ICONS[t.id];
          const status = project.toolStatus[t.id];
          return (
            <Link
              key={t.id}
              href={`/app/${t.id}`}
              className="group rounded-xl border border-line bg-raised p-4 transition-colors hover:border-faint"
            >
              <div className="flex items-center justify-between">
                <span
                  className="grid h-9 w-9 place-items-center rounded-md"
                  style={{ background: `${t.color}15`, color: t.color }}
                >
                  <Icon size={18} />
                </span>
                <span
                  className="rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                  style={{
                    color: STATUS_COLOR[status],
                    background: `${STATUS_COLOR[status]}15`,
                  }}
                >
                  {STATUS_LABEL[status]}
                </span>
              </div>
              <div className="mt-3 text-[13px] font-bold text-ink">
                {t.num}. {t.name}
              </div>
              <div className="mt-0.5 text-[11px] text-faint">{t.tagline}</div>
            </Link>
          );
        })}
      </div>

      {/* Activity */}
      <h2 className="mt-10 text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
        Actividad reciente
      </h2>
      <div className="mt-3 rounded-xl border border-line bg-raised p-2">
        {ACTIVITY.map((a, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-3 py-3"
            style={{ borderTop: i ? "1px solid var(--color-line)" : "none" }}
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: a.ai ? "var(--color-violet)" : "var(--color-faint)" }}
            />
            <div className="flex-1">
              <p className="text-[13px] text-muted">{a.text}</p>
              <p className="text-[11px] text-faint">{a.when}</p>
            </div>
            {a.ai && (
              <span className="rounded-sm bg-violet/15 px-1.5 py-0.5 text-[9px] font-bold text-violet-sub">
                AI
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
