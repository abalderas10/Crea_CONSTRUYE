// Reporte PDF "Ejecutivo" — 1-pager con veredicto GO/NO-GO.
// Pensado para mostrar a socios, comité de inversión, o banca.
// Una sola página (forzando wrap=false en contenido crítico).

import { Document, Page, Text } from "@react-pdf/renderer";
import { styles, colors } from "@/lib/pdf/styles";
import { TOOLS } from "@/lib/tools";
import { num, money } from "@/lib/proforma/terreno";
import {
  CoverPage,
  PdfFooter,
  MetricGrid,
  Metric,
  Box,
  Divider,
  toneForVerdict,
  type VerdictTone,
} from "@/lib/pdf/components";
import {
  type BaseReportProps,
  goNoGoFromTools,
  countByStatus,
} from "@/lib/pdf/types";

export type EjecutivoReportProps = BaseReportProps;

/* ── Shapes de análisis ─────────────────────────────────────── */

type TerrenoDataShape = {
  predio?: { superficie_terreno?: string; precio_solicitado?: string };
};
type TerrenoAnalysisShape = {
  precio_objetivo_m2?: string;
  recomendacion?: string;
};
type RoiAnalysisShape = {
  tir?: number;
  van?: number;
  cap_rate?: number;
  payback?: number;
};
type ZonifAnalysisShape = { veredicto?: string };
type RiesgosAnalysisShape = { veredicto?: string };

function pick<T>(v: unknown): T | undefined {
  if (v && typeof v === "object") return v as T;
  return undefined;
}

export function EjecutivoReport({
  project,
  toolData,
  statuses,
  generatedAt = new Date(),
}: EjecutivoReportProps) {
  const { name, municipio, tipo } = project;
  const reportLabel = "Reporte Ejecutivo";
  const counts = countByStatus(statuses);
  const goNoGo = goNoGoFromTools(toolData, statuses);
  const terreno = toolData.terreno;
  const zonif = toolData.zonificacion;
  const roi = toolData.roi;

  const terrenoData = pick<TerrenoDataShape>(terreno?.data);
  const terrenoAnalysis = pick<TerrenoAnalysisShape>(terreno?.ai_analysis);
  const roiAnalysis = pick<RoiAnalysisShape>(roi?.ai_analysis);
  const zonifAnalysis = pick<ZonifAnalysisShape>(zonif?.ai_analysis);
  const riesgosAnalysis = pick<RiesgosAnalysisShape>(
    toolData.riesgos?.ai_analysis,
  );

  const superficie = num(terrenoData?.predio?.superficie_terreno);
  const precio = num(terrenoData?.predio?.precio_solicitado);
  const precioM2 = superficie > 0 ? precio / superficie : NaN;

  return (
    <Document
      title={`${reportLabel} — ${name}`}
      author="creaConstruye"
      subject="Reporte ejecutivo de proforma"
    >
      {/* ── PORTADA / 1-PAGER ──────────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <CoverPage
          reportLabel={reportLabel.toUpperCase()}
          projectName={name}
          subtitle={[municipio, tipo].filter(Boolean).join(" · ") || "Sin detalles"}
          projectMeta={[
            { label: "Veredicto", value: goNoGo.verdict },
            { label: "Confianza", value: `${goNoGo.confidence}%` },
            { label: "Avance", value: `${counts.done}/${TOOLS.length}` },
          ]}
          reportMeta={[
            {
              label: "Fecha",
              value: generatedAt.toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
          ]}
          footerNote={goNoGo.reason}
        />
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── MÉTRICAS CLAVE ─────────────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.eyebrow}>MÉTRICAS CLAVE</Text>
        <Text style={styles.h2}>Resumen en cifras</Text>
        <Divider />

        <Text style={styles.h3}>Terreno</Text>
        <MetricGrid>
          <Metric
            label="Superficie"
            value={isFinite(superficie) ? superficie.toLocaleString("es-MX") : "—"}
            unit="m²"
            source="Boleta predial"
          />
          <Metric
            label="Precio solicitado"
            value={money(precio)}
            source="Vendedor"
          />
          <Metric
            label="Precio / m²"
            value={money(precioM2)}
            source="Calculado"
            accent
          />
        </MetricGrid>
        {terrenoAnalysis !== undefined && terrenoAnalysis.precio_objetivo_m2 ? (
          <Box
            title="Recomendación Terreno"
            tone={toneForVerdict(terrenoAnalysis.recomendacion)}
          >
            <Text style={styles.body}>
              <Text style={styles.label}>Veredicto: </Text>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                {terrenoAnalysis.recomendacion ?? "—"}
              </Text>
              {" · "}
              <Text style={styles.label}>Precio objetivo / m²: </Text>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                {terrenoAnalysis.precio_objetivo_m2}
              </Text>
            </Text>
          </Box>
        ) : null}

        <Text style={[styles.h3, { marginTop: 14 }]}>Inversión</Text>
        <RoiSection roiAnalysis={roiAnalysis} />

        {zonifAnalysis !== undefined ? (
          <>
            <Text style={[styles.h3, { marginTop: 14 }]}>Zonificación</Text>
            <Box title="Capacidad de la zona">
              <Text style={styles.body}>
                <Text style={styles.label}>Veredicto: </Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  {zonifAnalysis.veredicto ?? "—"}
                </Text>
              </Text>
            </Box>
          </>
        ) : null}

        {riesgosAnalysis !== undefined ? (
          <>
            <Text style={[styles.h3, { marginTop: 14 }]}>Riesgos</Text>
            <Box
              title="Veredicto de Riesgos"
              tone={toneForVerdict(riesgosAnalysis.veredicto)}
            >
              <Text style={styles.body}>
                <Text style={styles.label}>Veredicto: </Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  {riesgosAnalysis.veredicto ?? "—"}
                </Text>
              </Text>
            </Box>
          </>
        ) : null}

        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>
    </Document>
  );
}

/* ── Subcomponentes ─────────────────────────────────────────── */

function RoiSection({ roiAnalysis }: { roiAnalysis: RoiAnalysisShape | undefined }) {
  if (roiAnalysis === undefined) {
    return (
      <Box>
        <Text style={styles.body}>
          Aún no hay análisis de ROI. Completa las herramientas 5 y 6 para ver
          TIR, VAN y CAP Rate aquí.
        </Text>
      </Box>
    );
  }
  return (
    <MetricGrid>
      {roiAnalysis.tir !== undefined && (
        <Metric
          label="TIR"
          value={`${roiAnalysis.tir.toFixed(1)}%`}
          source="ROI"
          hint="Tasa Interna de Retorno"
        />
      )}
      {roiAnalysis.van !== undefined && (
        <Metric
          label="VAN"
          value={money(roiAnalysis.van)}
          source="ROI"
          hint="Valor Actual Neto"
        />
      )}
      {roiAnalysis.cap_rate !== undefined && (
        <Metric
          label="CAP Rate"
          value={`${roiAnalysis.cap_rate.toFixed(1)}%`}
          source="ROI"
        />
      )}
      {roiAnalysis.payback !== undefined && (
        <Metric
          label="Payback"
          value={`${roiAnalysis.payback.toFixed(1)}`}
          unit="años"
          source="ROI"
        />
      )}
    </MetricGrid>
  );
}

const _TONE: Record<VerdictTone, string> = {
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  violet: colors.violet,
  neutral: colors.faint,
};
void _TONE;
