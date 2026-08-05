// Reporte PDF "Proforma Completa".
// Ensambla: cover + resumen ejecutivo + una página por herramienta.
// Terreno y Zonificación tienen secciones detalladas; el resto aparece
// como "Pendiente" hasta que se implementen.

import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles, colors } from "@/lib/pdf/styles";
import { TOOLS, type ToolId } from "@/lib/tools";
import { num, money } from "@/lib/proforma/terreno";
import { calcEnvolventeZonif } from "@/lib/proforma/zonificacion";
import type { TerrenoData } from "@/lib/proforma/terreno";
import type { ZonificacionData } from "@/lib/proforma/zonificacion";
import {
  CoverPage,
  PdfHeader,
  PdfFooter,
  MetricGrid,
  Metric,
  StatusBadge,
  AnalysisBlock,
  Box,
  Divider,
  type AnalysisGroup,
} from "@/lib/pdf/components";
import {
  type BaseReportProps,
  type ToolRows,
  countByStatus,
} from "@/lib/pdf/types";

export type ProformaReportProps = BaseReportProps;

export function ProformaReport({
  project,
  toolData,
  statuses,
  generatedAt = new Date(),
}: ProformaReportProps) {
  const { name, municipio, tipo, created_at } = project;
  const counts = countByStatus(statuses);
  const reportLabel = "Proforma Completa";
  const fecha = formatDate(generatedAt);

  return (
    <Document
      title={`${reportLabel} — ${name}`}
      author="creaConstruye"
      subject="Proforma inmobiliaria"
    >
      {/* ── PORTADA ─────────────────────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <CoverPage
          reportLabel={reportLabel.toUpperCase()}
          projectName={name}
          subtitle={[municipio, tipo].filter(Boolean).join(" · ") || "Sin detalles"}
          projectMeta={[
            { label: "Fecha del reporte", value: fecha },
            { label: "Herramientas", value: `${counts.done}/${TOOLS.length}` },
          ]}
          reportMeta={[
            {
              label: "Proyecto creado",
              value: formatDate(created_at, { year: "numeric", month: "short" }),
            },
            { label: "Avance", value: `${Math.round((counts.done / TOOLS.length) * 100)}%` },
          ]}
          footerNote={
            counts.done < TOOLS.length
              ? `Este reporte incluye ${counts.done} de ${TOOLS.length} herramientas. Las secciones pendientes se completarán conforme avances en la plataforma.`
              : undefined
          }
        />
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── RESUMEN EJECUTIVO ──────────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader
          title="Resumen ejecutivo"
          subtitle="Métricas clave y avance de la proforma."
        />
        <Text style={styles.body}>
          Este documento presenta la proforma del proyecto{" "}
          <Text style={{ fontFamily: "Helvetica-Bold" }}>{name}</Text>
          {municipio ? `, ubicado en ${municipio}` : ""}
          {tipo ? `, tipología ${tipo}` : ""}.
        </Text>

        <Text style={[styles.h3, { marginTop: 14 }]}>Avance</Text>
        <MetricGrid>
          <Metric
            label="Herramientas"
            value={`${counts.done}/${TOOLS.length}`}
            hint={`${counts.inProgress} en proceso · ${counts.empty} pendientes`}
          />
          <Metric
            label="% avance"
            value={`${Math.round((counts.done / TOOLS.length) * 100)}%`}
          />
          <Metric
            label="Análisis de IA"
            value={Object.values(toolData).filter((t) => t?.ai_analysis).length}
            unit={`de ${TOOLS.length}`}
          />
        </MetricGrid>

        <Text style={[styles.h3, { marginTop: 14 }]}>Índice de herramientas</Text>
        <Box>
          {TOOLS.map((t) => (
            <View
              key={t.id}
              style={[styles.row, { marginTop: 4, alignItems: "center" }]}
            >
              <Text style={[styles.body, { width: 24 }]}>{t.num}.</Text>
              <Text style={[styles.body, { flex: 1 }]}>{t.name}</Text>
              <StatusBadge status={statuses[t.id]} />
            </View>
          ))}
        </Box>
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── SECCIÓN POR HERRAMIENTA ───────────────────────── */}
      {TOOLS.map((t) => (
        <ToolPage
          key={t.id}
          toolId={t.id}
          toolData={toolData}
          statuses={statuses}
          projectName={name}
          reportLabel={reportLabel}
        />
      ))}
    </Document>
  );
}

/* ── Páginas por herramienta ───────────────────────────────── */

function ToolPage({
  toolId,
  toolData,
  statuses,
  projectName,
  reportLabel,
}: {
  toolId: ToolId;
  toolData: ToolRows;
  statuses: BaseReportProps["statuses"];
  projectName: string;
  reportLabel: string;
}) {
  const t = TOOLS.find((x) => x.id === toolId)!;
  const row = toolData[toolId];
  const status = statuses[toolId];

  return (
    <Page size="LETTER" style={styles.page} wrap>
      <PdfHeader
        title={`${t.num}. ${t.name}`}
        subtitle={t.tagline}
        accent={t.color}
        right={<StatusBadge status={status} />}
      />

      <Divider />

      {toolId === "terreno" && (
        <TerrenoSection data={row?.data as TerrenoData | undefined} analysis={row?.ai_analysis} />
      )}
      {toolId === "zonificacion" && (
        <ZonificacionSection data={row?.data as ZonificacionData | undefined} analysis={row?.ai_analysis} />
      )}
      {["costos", "mercado", "financiero", "riesgos"].includes(toolId) && (
        <GenericToolSection
          toolName={t.name}
          data={row?.data as Record<string, unknown> | undefined}
          analysis={row?.ai_analysis as Record<string, unknown> | undefined}
        />
      )}
      {!["terreno", "zonificacion", "costos", "mercado", "financiero", "riesgos"].includes(toolId) && (
        <Box>
          <Text style={styles.body}>
            Esta herramienta aún no se ha implementado en el reporte PDF.
            Próximamente se integrarán ROI y Cronograma.
          </Text>
          <Text style={[styles.small, { marginTop: 6 }]}>
            <Text style={styles.label}>Inputs: </Text>
            {t.inputs}
          </Text>
        </Box>
      )}

      <PdfFooter projectName={projectName} reportLabel={reportLabel} />
    </Page>
  );
}

/* ── Shapes de análisis (hasta que las herramientas definan tipos) ── */

interface TerrenoAnalysisShape {
  recomendacion?: string;
  precio_objetivo_m2?: string;
  confianza?: number;
  resumen?: string;
  fortalezas?: string[];
  riesgos?: string[];
}

interface ZonifAnalysisShape {
  veredicto?: string;
  confianza?: number;
  resumen?: string;
  puntos_cumplimiento?: string[];
  puntos_ajuste?: string[];
  permisos_orden?: string[];
  riesgos_adicionales?: string[];
}

/* ── Sección Terreno ───────────────────────────────────────── */

function TerrenoSection({
  data,
  analysis,
}: {
  data?: TerrenoData;
  analysis?: unknown;
}) {
  if (!data?.predio) {
    return (
      <Box>
        <Text style={styles.body}>
          Sin datos del terreno. Completa la herramienta 1 para ver este
          análisis aquí.
        </Text>
      </Box>
    );
  }

  const a = analysis as TerrenoAnalysisShape | undefined;
  const p = data.predio;
  const z = data.zonificacion ?? {};
  const superficie = num(p.superficie_terreno);
  const precio = num(p.precio_solicitado);
  const precioM2 = superficie > 0 ? precio / superficie : NaN;
  const env = calcEnvolventeZonif(z, superficie, undefined);

  const groups: AnalysisGroup[] = [];
  if (a?.fortalezas?.length) {
    groups.push({ title: "Fortalezas", tone: "success", items: a.fortalezas });
  }
  if (a?.riesgos?.length) {
    groups.push({ title: "Riesgos", tone: "warning", items: a.riesgos });
  }

  return (
    <View>
      <Text style={styles.h3}>Datos del predio</Text>
      <MetricGrid>
        <Metric label="Precio solicitado" value={money(precio)} source="Boleta predial" />
        <Metric
          label="Superficie"
          value={isFinite(superficie) ? superficie.toLocaleString("es-MX") : "—"}
          unit="m²"
          source="Boleta predial"
        />
        <Metric
          label="Precio / m²"
          value={money(precioM2)}
          source="Calculado"
          hint="Precio ÷ superficie"
          accent
        />
      </MetricGrid>

      <Box title="Ubicación">
        <Text style={styles.body}>
          {p.direccion ?? "—"}, {p.colonia ?? ""} {p.territorio ?? ""}
        </Text>
        <Text style={styles.small}>
          Cuenta catastral: {p.cuenta_catastral ?? "—"}
        </Text>
      </Box>

      {isFinite(env.construibleTotal) && (
        <Box title="Envolvente construible" tone="success">
          <Text style={[styles.metricValue, { fontSize: 16, color: colors.ink }]}>
            {Math.round(env.construibleTotal).toLocaleString("es-MX")} m²
          </Text>
          <Text style={styles.small}>
            Desplante: {Math.round(env.desplante).toLocaleString("es-MX")} m² ·
            Niveles aprox:{" "}
            {isFinite(env.nivelesAprox) ? Math.floor(env.nivelesAprox) : "—"}
          </Text>
        </Box>
      )}

      {a && (
        <AnalysisBlock
          verdict={a.recomendacion}
          confianza={a.confianza}
          resumen={a.resumen}
          groups={groups}
          extra={
            a.precio_objetivo_m2
              ? { label: "Precio objetivo / m²", value: a.precio_objetivo_m2 }
              : undefined
          }
        />
      )}
    </View>
  );
}

/* ── Sección Zonificación ───────────────────────────────────── */

function ZonificacionSection({
  data,
  analysis,
}: {
  data?: ZonificacionData;
  analysis?: unknown;
}) {
  if (!data?.norma) {
    return (
      <Box>
        <Text style={styles.body}>
          Sin datos de zonificación. Completa la herramienta 2 para ver este
          análisis aquí.
        </Text>
      </Box>
    );
  }

  const a = analysis as ZonifAnalysisShape | undefined;
  const n = data.norma;
  const superficie = num(data.terreno_ref?.superficie_terreno);
  const propM2 = num(data.propuesta_m2_construir);
  const env = calcEnvolventeZonif(n, superficie, propM2);

  const groups: AnalysisGroup[] = [];
  if (a?.puntos_cumplimiento?.length) {
    groups.push({
      title: "Cumplimiento",
      tone: "success",
      items: a.puntos_cumplimiento,
    });
  }
  if (a?.puntos_ajuste?.length) {
    groups.push({ title: "Ajustes", tone: "warning", items: a.puntos_ajuste });
  }
  if (a?.permisos_orden?.length) {
    groups.push({
      title: "Permisos en orden",
      tone: "violet",
      items: a.permisos_orden,
    });
  }
  if (a?.riesgos_adicionales?.length) {
    groups.push({
      title: "Riesgos adicionales",
      tone: "danger",
      items: a.riesgos_adicionales,
    });
  }

  return (
    <View>
      <MetricGrid>
        <Metric
          label="Tipo de proyecto"
          value={data.tipo_proyecto ?? "—"}
          cols={1}
        />
        <Metric
          label="m² construibles"
          value={Math.round(env.construibleTotal).toLocaleString("es-MX")}
          unit="m²"
          accent
        />
        <Metric
          label="Niveles"
          value={
            n.niveles_max ??
            (isFinite(env.nivelesAprox) ? Math.floor(env.nivelesAprox) : "—")
          }
        />
      </MetricGrid>

      <Box title="Normativa">
        <Text style={styles.body}>
          Clave: {n.zona_codigo ?? "—"} · Uso: {n.uso_permitido ?? "—"}
        </Text>
        <Text style={styles.small}>
          COS: {n.cos ?? "—"} · CUS: {n.cus ?? "—"} · Área libre:{" "}
          {n.area_libre_pct ?? "—"}%
        </Text>
      </Box>

      {a && (
        <AnalysisBlock
          verdict={a.veredicto}
          confianza={a.confianza}
          resumen={a.resumen}
          groups={groups}
        />
      )}
    </View>
  );
}

/* ── Sección genérica (Costos, Mercado, Financiero, Riesgos) ─ */

function GenericToolSection({
  toolName,
  data,
  analysis,
}: {
  toolName: string;
  data?: Record<string, unknown>;
  analysis?: Record<string, unknown>;
}) {
  if (!data && !analysis) {
    return (
      <Box>
        <Text style={styles.body}>
          Aún no se han capturado datos para {toolName}.
        </Text>
      </Box>
    );
  }

  return (
    <View>
      {analysis && (
        <AnalysisBlock
          verdict={
            (analysis.veredicto as string) ??
            (analysis.recomendacion as string)
          }
          confianza={analysis.confianza as number | undefined}
          resumen={analysis.resumen as string | undefined}
          groups={extractAnalysisGroups(analysis)}
        />
      )}
      {data && Object.keys(data).length > 0 && (
        <Box title="Datos capturados">
          <View>
            {Object.entries(data)
              .filter(([k, v]) => v && typeof v !== "object" && k !== "terreno_ref")
              .slice(0, 10)
              .map(([k, v]) => (
                <View
                  key={k}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 2,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.line,
                  }}
                >
                  <Text style={[styles.label, { flex: 1 }]}>
                    {k.replace(/_/g, " ")}
                  </Text>
                  <Text style={[styles.body, { flex: 1, textAlign: "right" }]}>
                    {String(v).slice(0, 60)}
                  </Text>
                </View>
              ))}
          </View>
        </Box>
      )}
    </View>
  );
}

function extractAnalysisGroups(
  analysis: Record<string, unknown>,
): AnalysisGroup[] {
  const groups: AnalysisGroup[] = [];
  // Costos: partidas_criticas + partidas_optimizables + recomendaciones
  if (Array.isArray(analysis.partidas_criticas)) {
    groups.push({
      title: "Partidas críticas",
      tone: "danger",
      items: analysis.partidas_criticas as string[],
    });
  }
  if (Array.isArray(analysis.partidas_optimizables)) {
    groups.push({
      title: "Partidas optimizables",
      tone: "success",
      items: analysis.partidas_optimizables as string[],
    });
  }
  if (Array.isArray(analysis.recomendaciones)) {
    groups.push({
      title: "Recomendaciones",
      tone: "violet",
      items: analysis.recomendaciones as string[],
    });
  }
  // Mercado: insights + alertas
  if (Array.isArray(analysis.insights)) {
    groups.push({
      title: "Insights clave",
      tone: "violet",
      items: analysis.insights as string[],
    });
  }
  if (Array.isArray(analysis.alertas)) {
    groups.push({
      title: "Alertas de mercado",
      tone: "danger",
      items: analysis.alertas as string[],
    });
  }
  // Financiero: alertas + recomendaciones
  if (Array.isArray(analysis.alertas) && !groups.some((g) => g.title === "Alertas de mercado")) {
    groups.push({
      title: "Alertas financieras",
      tone: "danger",
      items: analysis.alertas as string[],
    });
  }
  // Riesgos: mitigaciones + riesgos
  if (Array.isArray(analysis.mitigaciones)) {
    groups.push({
      title: "Plan de mitigación",
      tone: "violet",
      items: analysis.mitigaciones as string[],
    });
  }
  if (Array.isArray(analysis.riesgos)) {
    const riesgos = (analysis.riesgos as Array<{
      nivel: string;
      titulo: string;
    }>).map((r) => `${r.titulo} (${r.nivel})`);
    if (riesgos.length > 0) {
      groups.push({ title: "Riesgos detectados", tone: "warning", items: riesgos });
    }
  }
  return groups;
}

/* ── Helpers ──────────────────────────────────────────────── */

function formatDate(d: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(
    "es-MX",
    opts ?? { year: "numeric", month: "long", day: "numeric" },
  );
}
