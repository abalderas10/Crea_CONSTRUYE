// GET /app/[projectId]/reportes/mercado
// Standalone de la herramienta 3 (Mercado).

import { renderToBuffer } from "@react-pdf/renderer";
import { MercadoReport } from "@/lib/pdf/MercadoReport";
import {
  buildReportContext,
  pdfResponse,
  shortDate,
  slug,
} from "@/lib/pdf/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;
  const result = await buildReportContext(projectId);
  if ("err" in result) return result.err;

  const { ctx } = result;
  const buffer = await renderToBuffer(
    <MercadoReport
      project={ctx.project}
      toolData={ctx.toolData}
      statuses={ctx.statuses}
    />,
  );

  return pdfResponse(
    buffer,
    `mercado-${slug(ctx.project.name)}-${shortDate()}.pdf`,
  );
}
