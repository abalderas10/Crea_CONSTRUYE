// GET /app/[projectId]/reportes/memorandum
// Template formal para banca / comité de inversión.

import { renderToBuffer } from "@react-pdf/renderer";
import { MemorandumReport } from "@/lib/pdf/MemorandumReport";
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
    <MemorandumReport
      project={ctx.project}
      toolData={ctx.toolData}
      statuses={ctx.statuses}
    />,
  );

  return pdfResponse(
    buffer,
    `memorandum-${slug(ctx.project.name)}-${shortDate()}.pdf`,
  );
}
