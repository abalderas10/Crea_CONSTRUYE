import Link from "next/link";
import { TOOLS, type ToolId } from "@/lib/tools";
import { TOOL_ICONS } from "@/components/icons/ToolIcons";
import {
  evaluateAllGates,
  type ProjectToolStatus,
  type GateEvaluation,
} from "@/lib/documentacion/gates";
import {
  DOCUMENT_TYPE_LABELS,
  type ProjectDocument,
  type DocumentTool,
} from "@/lib/documentacion";
import { CATEGORY_BY_TYPE } from "@/lib/documentacion/categories";
import { CategoryChip } from "./CategoryChip";

interface FaseZeroProps {
  projectId: string;
  projectName: string;
  municipio?: string | null;
  tipo?: string | null;
  documents: ProjectDocument[];
  toolStatusByTool: Partial<Record<DocumentTool, ProjectToolStatus>>;
}

const CORE_TOOLS: ToolId[] = TOOLS.map((t) => t.id);

/**
 * Hub post-crear-proyecto (Fase 0).
 *
 * Server component. Muestra:
 *   1. Header del proyecto + estado global (X/8 tools listas).
 *   2. Mapa de extracción visual: 8 cards, una por tool, con estado del gate.
 *   3. Banner inteligente: "sigue con la tool con mayor progreso".
 *   4. Accesos rápidos a Terreno + Zonificación (siempre visibles).
 *   5. Lista de documentos recientes (últimos 5).
 */
export function FaseZero({
  projectId,
  projectName,
  municipio,
  tipo,
  documents,
  toolStatusByTool,
}: FaseZeroProps) {
  const gates = evaluateAllGates(documents, toolStatusByTool);
  const readyCount = CORE_TOOLS.filter(
    (t) => gates[t]?.status === "ready",
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="rounded-xl border border-line bg-raised p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
              Fase 0 · Documentación
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
              {projectName}
            </h2>
            <p className="mt-1 text-[12.5px] text-muted">
              {[municipio, tipo].filter(Boolean).join(" · ") ||
                "Sin detalles aún"}
            </p>
          </div>
          <span
            className="rounded-md border px-3 py-1.5 text-[12px] font-bold"
            style={{
              borderColor: readyCount === 8 ? "#22c55e40" : "#8B5CF640",
              background: readyCount === 8 ? "#22c55e15" : "#8B5CF615",
              color: readyCount === 8 ? "#22c55e" : "#8B5CF6",
            }}
          >
            {readyCount}/8 herramientas listas
          </span>
        </div>
      </header>

      {/* Banner inteligente */}
      <NextUpBanner
        gates={gates}
        projectId={projectId}
        readyCount={readyCount}
      />

      {/* Mapa de extracción */}
      <section>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-faint">
          Mapa de extracción
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_TOOLS.map((t) => {
            const meta = TOOLS.find((x) => x.id === t);
            if (!meta) return null;
            const Icon = TOOL_ICONS[t];
            const ev = gates[t];
            return (
              <ToolGateCard
                key={t}
                projectId={projectId}
                toolId={t}
                num={meta.num}
                name={meta.name}
                tagline={meta.tagline}
                color={meta.color}
                Icon={Icon}
                evaluation={ev}
              />
            );
          })}
        </div>
      </section>

      {/* Accesos rápidos */}
      <section>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-faint">
          Accesos rápidos
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickLink
            projectId={projectId}
            toolId="terreno"
            label="Terreno"
            description="Empieza por el plano topográfico o la boleta predial."
            color="#22C55E"
          />
          <QuickLink
            projectId={projectId}
            toolId="zonificacion"
            label="Zonificación"
            description="Sube el certificado de uso de suelo para definir la envolvente."
            color="#3B82F6"
          />
        </div>
      </section>

      {/* Documentos recientes */}
      <RecentDocuments projectId={projectId} documents={documents} />
    </div>
  );
}

// ── Sub-componentes ───────────────────────────────────────────────

function ToolGateCard({
  projectId,
  toolId,
  num,
  name,
  tagline,
  color,
  Icon,
  evaluation,
}: {
  projectId: string;
  toolId: ToolId;
  num: number;
  name: string;
  tagline: string;
  color: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  evaluation: GateEvaluation;
}) {
  const { status, progress, reason } = evaluation;

  return (
    <div className="rounded-xl border border-line bg-raised p-4">
      <div className="flex items-start justify-between">
        <span
          className="grid h-9 w-9 place-items-center rounded-md"
          style={{ background: `${color}15`, color }}
        >
          <Icon size={18} />
        </span>
        <GateStatusPill status={status} progress={progress} />
      </div>
      <div className="mt-3 text-[13px] font-bold text-ink">
        {num}. {name}
      </div>
      <div className="mt-0.5 text-[11px] text-faint">{tagline}</div>

      <div className="mt-3">
        {status === "ready" && (
          <Link
            href={`/app/${projectId}/${toolId}`}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-volt hover:underline"
          >
            Ir a la herramienta →
          </Link>
        )}
        {status === "partial" && (
          <div className="space-y-1.5">
            <p className="text-[11px] text-faint">{progress}% completo</p>
            <Link
              href={`/app/${projectId}/documentacion?tool=${toolId}`}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink hover:text-volt"
            >
              Subir lo que falta →
            </Link>
          </div>
        )}
        {status === "locked" && (
          <p className="text-[11px] leading-relaxed text-faint" title={reason}>
            🔒 {reason}
          </p>
        )}
      </div>
    </div>
  );
}

function GateStatusPill({
  status,
  progress,
}: {
  status: GateEvaluation["status"];
  progress: number;
}) {
  if (status === "ready") {
    return (
      <span className="rounded-sm bg-success/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-success">
        Listo
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="rounded-sm bg-warning/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-warning">
        {progress}%
      </span>
    );
  }
  return (
    <span className="rounded-sm bg-line/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-faint">
      🔒
    </span>
  );
}

function NextUpBanner({
  gates,
  projectId,
  readyCount,
}: {
  gates: Record<DocumentTool, GateEvaluation>;
  projectId: string;
  readyCount: number;
}) {
  // Prioridad: ready > partial (con mayor progress) > locked
  const next = (Object.entries(gates) as [DocumentTool, GateEvaluation][])
    .filter(([t]) =>
      CORE_TOOLS.includes(t as ToolId) && t !== "general",
    )
    .filter(([, ev]) => ev.status !== "ready")
    .sort((a, b) => {
      if (a[1].status === b[1].status) {
        return b[1].progress - a[1].progress;
      }
      return a[1].status === "partial" ? -1 : 1;
    })[0];

  if (readyCount === 8) {
    return (
      <div
        className="rounded-xl border p-4"
        style={{
          borderColor: "#22c55e40",
          background: "#22c55e10",
        }}
      >
        <p className="text-[13px] font-semibold text-success">
          Las 8 herramientas están listas. Genera tu Proforma PDF.
        </p>
        <Link
          href={`/app/${projectId}/reportes`}
          className="mt-1 inline-block text-[12px] font-semibold text-success hover:underline"
        >
          Ir a Reportes →
        </Link>
      </div>
    );
  }

  if (!next) return null;
  const [nextTool, nextEv] = next;
  const meta = TOOLS.find((t) => t.id === nextTool);
  if (!meta) return null;

  const unlockedBy = (Object.entries(gates) as [DocumentTool, GateEvaluation][])
    .filter(([t, ev]) => {
      if (t === "general") return false;
      if (!ev.missingTools.includes(nextTool as DocumentTool)) return false;
      return true;
    })
    .map(([t]) => TOOLS.find((x) => x.id === t)?.name)
    .filter(Boolean);

  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: "#8B5CF640",
        background: "#8B5CF610",
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-sub">
        Sigue con
      </p>
      <p className="mt-1 text-[14px] font-bold text-ink">
        {meta.num}. {meta.name}
      </p>
      <p className="mt-1 text-[12px] text-muted">
        {nextEv.status === "locked" ? nextEv.reason : `Progreso: ${nextEv.progress}%`}
      </p>
      {unlockedBy.length > 0 && (
        <p className="mt-2 text-[11px] text-faint">
          Al completarla desbloqueas: {unlockedBy.join(", ")}.
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link
          href={`/app/${projectId}/${nextTool}`}
          className="rounded-md bg-volt px-3 py-1.5 text-[12px] font-extrabold text-on-volt transition-all hover:bg-volt-sub"
        >
          Ir a {meta.name}
        </Link>
        <Link
          href={`/app/${projectId}/documentacion?tool=${nextTool}`}
          className="rounded-md border border-line bg-base/40 px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:border-faint"
        >
          Subir documentos
        </Link>
      </div>
    </div>
  );
}

function QuickLink({
  projectId,
  toolId,
  label,
  description,
  color,
}: {
  projectId: string;
  toolId: ToolId;
  label: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      href={`/app/${projectId}/${toolId}`}
      className="group flex items-start gap-3 rounded-xl border border-line bg-raised p-4 transition-colors hover:border-faint"
    >
      <span
        className="mt-0.5 h-2 w-2 rounded-full"
        style={{ background: color }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-ink">{label}</p>
        <p className="mt-0.5 text-[11px] text-faint">{description}</p>
      </div>
      <span className="text-faint transition-colors group-hover:text-volt">→</span>
    </Link>
  );
}

function RecentDocuments({
  projectId,
  documents,
}: {
  projectId: string;
  documents: ProjectDocument[];
}) {
  const recent = documents.slice(0, 5);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-faint">
          Documentos recientes
        </h3>
        <Link
          href={`/app/${projectId}/documentacion`}
          className="text-[11px] text-volt hover:underline"
        >
          Ver todos →
        </Link>
      </div>
      {recent.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line bg-base/30 px-4 py-6 text-center text-[12.5px] text-faint">
          Aún no has subido documentos. Empieza por Terreno o Zonificación.
        </p>
      ) : (
        <ul className="space-y-2">
          {recent.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 rounded-lg border border-line bg-raised px-4 py-3"
            >
              <CategoryChip category={CATEGORY_BY_TYPE[d.document_type as keyof typeof CATEGORY_BY_TYPE]} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold text-ink">
                  {d.file_name}
                </p>
                <p className="text-[11px] text-faint">
                  {DOCUMENT_TYPE_LABELS[d.document_type]} ·{" "}
                  {new Date(d.created_at).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              </div>
              <span
                className="rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{
                  color:
                    d.extraction_status === "completed"
                      ? "#22c55e"
                      : d.extraction_status === "failed"
                        ? "#ff3b3b"
                        : d.extraction_status === "processing"
                          ? "#8B5CF6"
                          : "#52525b",
                  background:
                    d.extraction_status === "completed"
                      ? "#22c55e15"
                      : d.extraction_status === "failed"
                        ? "#ff3b3b15"
                        : d.extraction_status === "processing"
                          ? "#8B5CF615"
                          : "#52525b15",
                }}
              >
                {d.extraction_status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
