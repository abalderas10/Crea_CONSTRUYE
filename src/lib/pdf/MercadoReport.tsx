// Reporte PDF "Estudio de Mercado" — standalone de la herramienta 3.
// Hoy la herramienta 3 (Mercado) aún no está implementada, pero el reporte
// ya está listo y se activará automáticamente cuando se llene.
//
// Estructura:
//   1. Portada
//   2. Resumen de mercado
//   3. Demanda y absorción
//   4. Precios comparables
//   5. Perfil del comprador
//   6. Producto óptimo
//   7. Anexo normativo

import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles, colors } from "@/lib/pdf/styles";
import {
  CoverPage,
  PdfHeader,
  PdfFooter,
  MetricGrid,
  Metric,
  Box,
  Divider,
} from "@/lib/pdf/components";
import { type BaseReportProps, countByStatus } from "@/lib/pdf/types";
import { TOOLS } from "@/lib/tools";

export type MercadoReportProps = BaseReportProps;

interface MercadoAnalysisShape {
  // Definido tentativamente — cuando se implemente herramienta 3,
  // ajustamos a su json_schema real.
  precio_m2_objetivo?: string;
  absorcion_mensual?: number;
  demanda_score?: number;
  perfil_comprador?: string;
  producto_optimo?: string;
  resumen?: string;
  insights?: string[];
  comparables?: { direccion: string; precio_m2: string; m2: string; fuente?: string }[];
}

export function MercadoReport({
  project,
  toolData,
  statuses,
  generatedAt = new Date(),
}: MercadoReportProps) {
  const { name, municipio, tipo } = project;
  const reportLabel = "Estudio de Mercado";
  const counts = countByStatus(statuses);
  const mercado = toolData.mercado;
  const a = mercado?.ai_analysis as MercadoAnalysisShape | undefined;

  return (
    <Document
      title={`${reportLabel} — ${name}`}
      author="creaConstruye"
      subject="Estudio de mercado inmobiliario"
    >
      {/* ── 1. PORTADA ─────────────────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <CoverPage
          reportLabel="ESTUDIO DE MERCADO"
          projectName={name}
          subtitle={[municipio, tipo].filter(Boolean).join(" · ") || "Sin detalles"}
          projectMeta={[
            { label: "Herramienta", value: "3 · Mercado" },
            { label: "Estado", value: a ? "Generado" : "Pendiente" },
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
          footerNote={
            !a
              ? "La herramienta 3 (Mercado) aún no se ha generado. Este documento se llenará automáticamente cuando se ejecute el análisis de mercado en la plataforma."
              : undefined
          }
        />
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 2. RESUMEN DE MERCADO ──────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader title="1. Resumen de mercado" />

        {!a ? (
          <Box>
            <Text style={styles.body}>
              Aún no se ha generado el análisis de mercado. Ve a la herramienta
              3 del proyecto, captura los datos (zona, m² construibles, tipo de
              proyecto) y haz clic en «Generar análisis». Claude generará este
              reporte automáticamente con datos reales de México.
            </Text>
            <Text style={[styles.small, { marginTop: 6 }]}>
              <Text style={styles.label}>Avance general: </Text>
              {counts.done}/{TOOLS.length} herramientas
            </Text>
          </Box>
        ) : (
          <>
            <Text style={styles.body}>
              {a.resumen ?? "Sin resumen."}
            </Text>

            <Text style={[styles.h3, { marginTop: 12 }]}>Indicadores</Text>
            <MetricGrid>
              {a.precio_m2_objetivo && (
                <Metric
                  label="Precio / m² objetivo"
                  value={a.precio_m2_objetivo}
                  source="Mercado"
                  accent
                />
              )}
              {a.absorcion_mensual !== undefined && (
                <Metric
                  label="Absorción"
                  value={a.absorcion_mensual.toFixed(1)}
                  unit="unid/mes"
                  source="Mercado"
                />
              )}
              {a.demanda_score !== undefined && (
                <Metric
                  label="Score de demanda"
                  value={a.demanda_score}
                  unit="/100"
                  source="Mercado"
                />
              )}
            </MetricGrid>

            {a.insights && a.insights.length > 0 && (
              <Box title="Insights clave">
                {a.insights.map((it, i) => (
                  <View key={i} style={styles.listItem}>
                    <Text style={styles.bullet}>·</Text>
                    <Text style={[styles.body, { flex: 1, fontSize: 9.5 }]}>
                      {it}
                    </Text>
                  </View>
                ))}
              </Box>
            )}
          </>
        )}
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 3. DEMANDA Y ABSORCIÓN ─────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader title="2. Demanda y absorción" />
        {!a ? (
          <Box>
            <Text style={styles.body}>Análisis pendiente.</Text>
          </Box>
        ) : (
          <>
            <Box title="Absorción esperada">
              <Text style={styles.body}>
                Tasa de absorción:{" "}
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  {a.absorcion_mensual?.toFixed(1) ?? "—"} unidades/mes
                </Text>
              </Text>
              <Text style={styles.small}>
                Estimación basada en oferta comparable y demanda histórica de la zona.
              </Text>
            </Box>
            <Box title="Perfil del comprador">
              <Text style={[styles.body, { lineHeight: 1.5 }]}>
                {a.perfil_comprador ?? "—"}
              </Text>
            </Box>
          </>
        )}
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 4. PRECIOS COMPARABLES ─────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader title="3. Precios comparables" />
        {!a?.comparables || a.comparables.length === 0 ? (
          <Box>
            <Text style={styles.body}>
              Sin comparables cargados. El análisis de mercado se apoya en datos
              de oferta comparable publicada en portales y datos oficiales
              cuando esté disponible.
            </Text>
          </Box>
        ) : (
          <Box>
            <Text style={styles.label}>COMPARABLES</Text>
            {a.comparables.map((c, i) => (
              <View
                key={i}
                style={[
                  styles.row,
                  {
                    marginTop: 6,
                    paddingTop: 6,
                    borderTopWidth: i === 0 ? 0 : 0.5,
                    borderTopColor: colors.line,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.body}>{c.direccion}</Text>
                  <Text style={styles.small}>
                    {c.m2} m² · {c.fuente ?? "fuente no especificada"}
                  </Text>
                </View>
                <Text style={[styles.value, { fontSize: 11 }]}>
                  {c.precio_m2}
                </Text>
              </View>
            ))}
          </Box>
        )}
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 5. PRODUCTO ÓPTIMO ─────────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader title="4. Producto óptimo recomendado" />
        {!a ? (
          <Box>
            <Text style={styles.body}>Análisis pendiente.</Text>
          </Box>
        ) : (
          <Box title="Recomendación de producto">
            <Text style={[styles.body, { lineHeight: 1.5 }]}>
              {a.producto_optimo ?? "—"}
            </Text>
          </Box>
        )}
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>

      {/* ── 6. ANEXO NORMATIVO ─────────────────────────────── */}
      <Page size="LETTER" style={styles.page}>
        <PdfHeader title="5. Anexo: normatividad aplicable" />
        <Box>
          <Text style={styles.body}>
            La herramienta Legal de creaConstruye mantiene un catálogo
            actualizado de la normatividad federal, estatal y municipal
            aplicable. Visite{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>/legal</Text> para
            consultar el detalle.
          </Text>
          <Divider />
          <Text style={[styles.h3]}>Normas federales de referencia</Text>
          {[
            "Ley General de Asentamientos Humanos, Ordenamiento Territorial y Desarrollo Urbano (LGAHOTDU)",
            "Ley General del Equilibrio Ecológico y la Protección al Ambiente (LGEEPA)",
            "Ley de Aguas Nacionales y sus Reglamentos",
            "Reglamento de Construcciones del Distrito Federal (aplicable a CDMX)",
          ].map((n) => (
            <View key={n} style={styles.listItem}>
              <Text style={styles.bullet}>·</Text>
              <Text style={[styles.body, { flex: 1, fontSize: 9.5 }]}>
                {n}
              </Text>
            </View>
          ))}
        </Box>
        <PdfFooter projectName={name} reportLabel={reportLabel} />
      </Page>
    </Document>
  );
}

// re-export para evitar unused
void colors;
