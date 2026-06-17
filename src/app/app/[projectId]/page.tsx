import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS } from "@/lib/tools";
import { TOOL_ICONS } from "@/components/icons/ToolIcons";
import {
  getProject,
  getToolStatuses,
  completedCount,
  type ToolStatus,
} from "@/lib/data/projects";

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

export default async function ProjectDashboard({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, statuses] = await Promise.all([
    getProject(projectId),
    getToolStatuses(projectId),
  ]);
  if (!project) notFound();

  const done = completedCount(statuses);
  const nextTool = TOOLS.find((t) => statuses[t.id] !== "done") ?? TOOLS[0];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {[project.municipio, project.tipo].filter(Boolean).join(" · ") ||
              "Sin detalles aún"}
          </p>
        </div>
        <span className="rounded-md border border-volt/30 bg-volt/[0.06] px-3 py-1.5 text-[13px] font-bold text-volt">
          {done}/8 herramientas
        </span>
      </div>

      {/* Continuar */}
      <Link
        href={`/app/${project.id}/${nextTool.id}`}
        className="mt-6 flex items-center gap-4 rounded-xl border border-line bg-raised p-5 transition-colors hover:border-faint"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-faint">
          {done === 0 ? "Empezar por" : done === 8 ? "Revisar" : "Continúa con"}
        </span>
        <span className="text-base font-bold text-ink">
          {nextTool.num}. {nextTool.name}
        </span>
        <span className="ml-auto text-volt">→</span>
      </Link>

      {/* Tool status grid */}
      <h2 className="mt-10 text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
        Herramientas del proforma
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((t) => {
          const Icon = TOOL_ICONS[t.id];
          const status = statuses[t.id];
          return (
            <Link
              key={t.id}
              href={`/app/${project.id}/${t.id}`}
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
    </div>
  );
}
