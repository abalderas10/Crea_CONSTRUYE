// GET /app/[projectId]/reportes/ejecutivo
// 1-pager con veredicto GO/NO-GO.

import { renderToBuffer } from "@react-pdf/renderer";
import { EjecutivoReport } from "@/lib/pdf/EjecutivoReport";
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
    <EjecutivoReport
      project={ctx.project}
      toolData={ctx.toolData}
      statuses={ctx.statuses}
    />,
  );

  return pdfResponse(
    buffer,
    `ejecutivo-${slug(ctx.project.name)}-${shortDate()}.pdf`,
  );
}
