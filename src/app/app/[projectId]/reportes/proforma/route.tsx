// GET /app/[projectId]/reportes/proforma
// Devuelve el PDF "Proforma Completa" generado server-side.

import { renderToBuffer } from "@react-pdf/renderer";
import { ProformaReport } from "@/lib/pdf/ProformaReport";
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
    <ProformaReport
      project={ctx.project}
      toolData={ctx.toolData}
      statuses={ctx.statuses}
    />,
  );

  return pdfResponse(
    buffer,
    `proforma-${slug(ctx.project.name)}-${shortDate()}.pdf`,
  );
}
