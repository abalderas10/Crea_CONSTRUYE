// Reporte PDF "Memorándum de Inversión".
// Template formal para presentar a banca, inversionistas institucionales o
// comités de inversión. Estructura:
//
//   1. Portada
//   2. Resumen ejecutivo
//   3. El proyecto (descripción + ubicación)
//   4. Análisis de mercado
//   5. Análisis financiero (costos, ROI)
//   6. Riesgos y mitigaciones
//   7. Recomendación final y próximos pasos
//   8. Anexos (normatividad)

import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles, colors } from "@/lib/pdf/styles";
import { TOOLS } from "@/lib/tools";
import { num, money } from "@/lib/proforma/terreno";
import {
  CoverPage,
  PdfHeader,
  PdfFooter,
  MetricGrid,
  Metric,
  Box,
  toneForVerdict,
} from "@/lib/pdf/components";
import {
  type BaseReportProps,
  goNoGoFromTools,
  countByStatus,
} from "@/lib/pdf/types";

export type MemorandumReportProps = BaseReportProps;

export function MemorandumReport({
  project,
  toolData,
  statuses,
  generatedAt = new Date(),
}: MemorandumReportProps) {
  const { name, municipio, tipo } = project;
  const reportLabel = "Memorándum de Inversión";
  const goNoGo = goNoGoFromTools(toolData, statuses);
  const counts = countByStatus(statuses);
  const terreno = toolData.terreno;
  const zonif = toolData.zonificacion;
  const roi = toolData.roi;
  const riesgos = toolData.riesgos;

  // Casts a través del helper pick (estilo EjecutivoReport)
  type TerrenoDataShape = {
    predio?: { superficie_terreno?: string; precio_solicitado?: string; direccion?: string };
  };
  type TerrenoAnalysisShape = {
    recomendacion?: string;
    precio_objetivo_m2?: string;
    resumen?: string;
    fortalezas?: string[];
    riesgos?: string[];
  };
  type RoiAnalysisShape = {
    tir?: number;
    van?: number;
    cap_rate?: number;
    payback?: number;
    resumen?: string;
  };
  type ZonifAnalysisShape = { veredicto?: string };
  type RiesgosAnalysisShape = {
    veredicto?: string;
    resumen?: string;
    mitigaciones?: string[];
  };

  function pick<T>(v: unknown): T | undefined {
    if (v && typeof v === "object") return v as T;
    return undefined;
  }

  const terrenoData = pick<TerrenoDataShape>(terreno?.data);
  const terrenoAnalysis = pick<TerrenoAnalysisShape>(terreno?.ai_analysis);
  const roiAnalysis = pick<RoiAnalysisShape>(roi?.ai_analysis);
  const zonifAnalysis = pick<ZonifAnalysisShape>(zonif?.ai_analysis);
  const riesgosAnalysis = pick<RiesgosAnalysisShape>(riesgos?.ai_analysis);

  const superficie = num(terrenoData?.predio?.superficie_terreno);
  const precio = num(terrenoData?.predio?.precio_solicitado);
  const precioM2 = superficie > 0 ? precio / superficie : NaN;

  return (
    <Document
      title={`${reportLabel} — ${name}`}
      author="creaConstruye"
      subject="Memorándum de inversión inmobiliaria"
    >
      {/* ── 1. PORTADA ─────────────────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <CoverPage
          reportLabel="MEMORÁNDUM DE INVERSIÓN"
          projectName={name}
          subtitle={[municipio, tipo].filter(Boolean).join(" · ") || "Sin detalles"}
          projectMeta={[
            { label: "Veredicto", value: goNoGo.verdict },
            { label: "Confianza", value: `${goNoGo.confidence}%` },
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
            { label: "Documento", value: "Confidencial" },
          ]}
          footerNote="Documento preparado para revisión por el comité de inversión. La información contenida se basa en los datos capturados en la plataforma creaConstruye y análisis de IA generativa. Se recomienda verificación independiente antes de cualquier compromiso financiero."
        />
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 2. RESUMEN EJECUTIVO ──────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader title="1. Resumen ejecutivo" />
        <Text style={styles.body}>
          El presente memorándum describe el proyecto{" "}
          <Text style={{ fontFamily: "Helvetica-Bold" }}>{name}</Text>
          {municipio ? `, ubicado en ${municipio}` : ""}
          {tipo ? `, tipología ${tipo}` : ""}, y evalúa su viabilidad financiera y
          regulatoria con base en el análisis de las {TOOLS.length} herramientas
          estándar del proforma creaConstruye ({counts.done} completas,{" "}
          {counts.inProgress} en proceso).
        </Text>

        <Box title="Veredicto del Comité">
          <Text style={styles.body}>
            <Text style={styles.label}>Recomendación: </Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{goNoGo.verdict}</Text>
            {" · "}
            <Text style={styles.label}>Confianza: </Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {goNoGo.confidence}%
            </Text>
          </Text>
          <Text style={[styles.body, { marginTop: 4 }]}>
            {goNoGo.reason}
          </Text>
        </Box>

        <Text style={[styles.h3, { marginTop: 14 }]}>Métricas del terreno</Text>
        <MetricGrid>
          <Metric
            label="Superficie del terreno"
            value={isFinite(superficie) ? superficie.toLocaleString("es-MX") : "—"}
            unit="m²"
          />
          <Metric
            label="Precio solicitado"
            value={money(precio)}
          />
          <Metric
            label="Precio / m²"
            value={money(precioM2)}
            accent
          />
        </MetricGrid>
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 3. EL PROYECTO ─────────────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader title="2. El proyecto" />
        <Box title="Ubicación">
          <Text style={styles.body}>
            <Text style={styles.label}>Dirección: </Text>
            {terrenoData?.predio?.direccion ?? "—"}
          </Text>
          <Text style={styles.small}>
            {municipio ?? "—"}
          </Text>
        </Box>

        <Text style={[styles.h3, { marginTop: 12 }]}>Tipología</Text>
        <Box>
          <Text style={styles.body}>
            {tipo ?? "Tipo de proyecto por definir"}
          </Text>
        </Box>

        {terrenoAnalysis && (
          <>
            <Text style={[styles.h3, { marginTop: 12 }]}>
              Análisis de Terreno
            </Text>
            <Box
              title={`Veredicto: ${terrenoAnalysis.recomendacion ?? "—"}`}
              tone={toneForVerdict(terrenoAnalysis.recomendacion)}
            >
              <Text style={styles.body}>
                Precio objetivo por m²:{" "}
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  {terrenoAnalysis.precio_objetivo_m2 ?? "—"}
                </Text>
              </Text>
              {terrenoAnalysis.resumen && (
                <Text style={[styles.body, { marginTop: 6, lineHeight: 1.5 }]}>
                  {terrenoAnalysis.resumen}
                </Text>
              )}
            </Box>
          </>
        )}
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 4. ANÁLISIS DE MERCADO ─────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader title="3. Análisis de mercado y regulatorio" />

        {toolData.mercado ? (
          <Box>
            <Text style={styles.body}>
              Ver herramienta 3 (Mercado) en la proforma completa.
            </Text>
          </Box>
        ) : (
          <Box>
            <Text style={styles.body}>
              Análisis de mercado pendiente. La herramienta 3 (Mercado) genera
              automáticamente: demanda, precios comparables, perfil del
              comprador y tasa de absorción.
            </Text>
          </Box>
        )}

        {zonif?.data && zonifAnalysis !== undefined ? (
          <>
            <Text style={[styles.h3, { marginTop: 12 }]}>Zonificación</Text>
            <Box>
              <Text style={styles.body}>
                <Text style={styles.label}>Tipo: </Text>
                {pick<{ tipo_proyecto?: string }>(zonif.data)?.tipo_proyecto ?? "—"}
                {" · "}
                <Text style={styles.label}>Veredicto: </Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  {zonifAnalysis.veredicto ?? "—"}
                </Text>
              </Text>
            </Box>
          </>
        ) : null}
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 5. ANÁLISIS FINANCIERO ─────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader title="4. Análisis financiero" />

        {roiAnalysis ? (
          <>
            <MetricGrid>
              {roiAnalysis.tir !== undefined && (
                <Metric label="TIR" value={`${roiAnalysis.tir.toFixed(1)}%`} accent />
              )}
              {roiAnalysis.van !== undefined && (
                <Metric label="VAN" value={money(roiAnalysis.van)} />
              )}
              {roiAnalysis.cap_rate !== undefined && (
                <Metric label="CAP Rate" value={`${roiAnalysis.cap_rate.toFixed(1)}%`} />
              )}
              {roiAnalysis.payback !== undefined && (
                <Metric label="Payback" value={roiAnalysis.payback.toFixed(1)} unit="años" />
              )}
            </MetricGrid>
            {roiAnalysis.resumen && (
              <Box title="Resumen financiero">
                <Text style={[styles.body, { lineHeight: 1.5 }]}>
                  {roiAnalysis.resumen}
                </Text>
              </Box>
            )}
          </>
        ) : (
          <Box>
            <Text style={styles.body}>
              El análisis financiero (herramienta 5: Financiero, y 6: ROI) aún
              no se ha generado. Estas herramientas producen el flujo de caja
              mensual, escenarios conservador/base/agresivo, simulación Monte
              Carlo, TIR, VAN, CAP Rate y payback.
            </Text>
          </Box>
        )}
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 6. RIESGOS Y MITIGACIONES ──────────────────────── */}
      <Page size="LETTER" style={styles.page} wrap>
        <PdfHeader title="5. Riesgos y mitigaciones" />

        {riesgosAnalysis ? (
          <>
            <Box
              title={`Veredicto: ${riesgosAnalysis.veredicto ?? "—"}`}
              tone={toneForVerdict(riesgosAnalysis.veredicto)}
            >
              {riesgosAnalysis.resumen && (
                <Text style={[styles.body, { lineHeight: 1.5 }]}>
                  {riesgosAnalysis.resumen}
                </Text>
              )}
            </Box>
            {riesgosAnalysis.mitigaciones && riesgosAnalysis.mitigaciones.length > 0 && (
              <Box title="Mitigaciones">
                {riesgosAnalysis.mitigaciones.map((m, i) => (
                  <View key={i} style={styles.listItem}>
                    <Text style={styles.bullet}>·</Text>
                    <Text style={[styles.body, { flex: 1, fontSize: 9.5 }]}>
                      {m}
                    </Text>
                  </View>
                ))}
              </Box>
            )}
          </>
        ) : (
          <Box>
            <Text style={styles.body}>
              La herramienta 8 (Riesgos + GO/NO-GO) consolida los riesgos
              detectados en las 7 herramientas anteriores, calcula el VaR y
              emite el veredicto final con nivel de confianza.
            </Text>
            <Text style={[styles.small, { marginTop: 6 }]}>
              Mientras tanto, se incluyen los riesgos del terreno:
            </Text>
            {terrenoAnalysis?.riesgos && terrenoAnalysis.riesgos.length > 0 && (
              <View style={{ marginTop: 6 }}>
                {terrenoAnalysis.riesgos.map((r, i) => (
                  <View key={i} style={styles.listItem}>
                    <Text style={styles.bullet}>·</Text>
                    <Text style={[styles.body, { flex: 1, fontSize: 9.5 }]}>
                      {r}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Box>
        )}
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 7. RECOMENDACIÓN Y PRÓXIMOS PASOS ──────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader title="6. Recomendación y próximos pasos" />
        <Box title="Recomendación del comité" tone={toneForVerdict(goNoGo.verdict)}>
          <Text style={[styles.body, { fontFamily: "Helvetica-Bold", fontSize: 12 }]}>
            {goNoGo.verdict}
          </Text>
          <Text style={[styles.body, { marginTop: 4 }]}>
            {goNoGo.reason}
          </Text>
        </Box>

        <Text style={[styles.h3, { marginTop: 12 }]}>Próximos pasos sugeridos</Text>
        <Box>
          {nextSteps(goNoGo.verdict, counts.done, TOOLS.length).map((step, i) => (
            <View key={i} style={[styles.listItem, { marginTop: 3 }]}>
              <Text style={[styles.bullet, { width: 14 }]}>{i + 1}.</Text>
              <Text style={[styles.body, { flex: 1, fontSize: 9.5 }]}>
                {step}
              </Text>
            </View>
          ))}
        </Box>

        <Text style={[styles.h3, { marginTop: 12 }]}>Aviso</Text>
        <Box>
          <Text style={[styles.small, { lineHeight: 1.5 }]}>
            Este memorándum es un documento generado con apoyo de IA (Claude,
            Anthropic) a partir de los datos capturados por el equipo del
            proyecto. Las cifras, recomendaciones y análisis deben ser
            verificados por un profesional certificado antes de tomar
            decisiones de inversión. creaConstruye no se hace responsable por
            decisiones tomadas con base en este documento.
          </Text>
        </Box>
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>
    </Document>
  );
}

function nextSteps(
  verdict: string,
  done: number,
  total: number,
): string[] {
  if (done < total) {
    return [
      `Completar las ${total - done} herramienta(s) restantes del proforma.`,
      "Generar análisis de IA en cada herramienta completada.",
      "Revisar el veredicto final de Riesgos (herramienta 8).",
    ];
  }
  if (verdict === "NO_GO" || verdict === "NO_PROCEDE") {
    return [
      "Documentar las razones del NO_GO y archivarlo para referencia.",
      "Explorar terrenos alternativos o ajustes al proyecto.",
      "Repetir el proforma con las nuevas variables.",
    ];
  }
  if (verdict === "GO_WITH_CONDITIONS" || verdict === "AJUSTAR") {
    return [
      "Atender las condiciones señaladas por el análisis de Riesgos.",
      "Negociar el precio del terreno al rango objetivo.",
      "Validar normatividad con la autoridad local antes de compra.",
      "Re-generar el reporte tras los ajustes.",
    ];
  }
  return [
    "Proceder con la adquisición del terreno.",
    "Iniciar el proceso de permisos y licencias.",
    "Contratar proyecto arquitectónico y estructural.",
    "Estructurar el financiamiento con la banca.",
  ];
}

// re-export para evitar unused
void colors;
