// Helpers compartidos por los 4 route handlers de PDF.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getProject, getToolStatuses } from "@/lib/data/projects";
import { TOOLS, type ToolId } from "@/lib/tools";
import type { ToolRows } from "@/lib/pdf/types";

/** Resultado del armado de contexto para un PDF. */
export interface ReportContext {
  project: NonNullable<Awaited<ReturnType<typeof getProject>>>;
  toolData: ToolRows;
  statuses: Awaited<ReturnType<typeof getToolStatuses>>;
  ownerId: string;
}

/**
 * Construye el contexto común que todos los reportes necesitan:
 * - Valida Supabase configurado
 * - Autentica al usuario
 * - Verifica que el proyecto existe y pertenece al usuario
 * - Carga data + ai_analysis de todas las herramientas
 *
 * Devuelve `null` y rellena `err` con la respuesta HTTP si algo falla.
 */
export async function buildReportContext(
  projectId: string,
): Promise<{ ctx: ReportContext } | { err: NextResponse }> {
  if (!isSupabaseConfigured) {
    return {
      err: NextResponse.json(
        { error: "Supabase no está configurado en este entorno." },
        { status: 503 },
      ),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      err: NextResponse.json(
        { error: "Necesitas iniciar sesión para descargar reportes." },
        { status: 401 },
      ),
    };
  }

  const [project, statuses] = await Promise.all([
    getProject(projectId),
    getToolStatuses(projectId),
  ]);
  if (!project) {
    return {
      err: NextResponse.json(
        { error: "Proyecto no encontrado." },
        { status: 404 },
      ),
    };
  }
  if (project.owner_id !== user.id) {
    return {
      err: NextResponse.json(
        { error: "No tienes acceso a este proyecto." },
        { status: 403 },
      ),
    };
  }

  // Carga paralela de data + ai_analysis de cada herramienta
  const toolData: ToolRows = {};
  await Promise.all(
    TOOLS.map(async (t) => {
      const { data } = await supabase
        .from("project_tool_data")
        .select("data, ai_analysis")
        .eq("project_id", projectId)
        .eq("tool_id", t.id as ToolId)
        .maybeSingle();
      if (data) toolData[t.id] = data;
    }),
  );

  return { ctx: { project, toolData, statuses, ownerId: user.id } };
}

/** Slug seguro para nombre de archivo. */
export function slug(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

/** Fecha corta ISO (YYYY-MM-DD). */
export function shortDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Construye una Response PDF con headers consistentes. */
export function pdfResponse(buffer: Buffer, filename: string): NextResponse {
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Content-Length": String(buffer.length),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
