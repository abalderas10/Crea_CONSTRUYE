// Componentes reutilizables para los reportes PDF.
// Centraliza header, footer, métricas, veredictos y bloques de análisis.
// Cada reporte (Proforma, Ejecutivo, Memorándum, Mercado) usa estos.

import { Text, View } from "@react-pdf/renderer";
import { colors, styles } from "@/lib/pdf/styles";

/* ── Header / Footer ──────────────────────────────────────── */

export function PdfHeader({
  eyebrow = "PROFORMA · creaConstruye",
  title,
  subtitle,
  accent,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.pageHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.h2}>{title}</Text>
        {subtitle && <Text style={styles.body}>{subtitle}</Text>}
      </View>
      {right}
      {accent && (
        <View
          style={{
            width: 6,
            height: 40,
            backgroundColor: accent,
            borderRadius: 2,
            marginLeft: 12,
          }}
        />
      )}
    </View>
  );
}

export function PdfFooter({
  projectName,
  reportLabel,
}: {
  projectName: string;
  reportLabel: string;
}) {
  return (
    <View style={styles.pageFooter} fixed>
      <Text>
        {projectName} · {reportLabel}
      </Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber} de ${totalPages}`
        }
      />
    </View>
  );
}

/* ── Métricas (KPI grid) ──────────────────────────────────── */

export function MetricGrid({
  children,
}: {
  cols?: 2 | 3 | 4;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.metricGrid,
        { flexWrap: "wrap" as const },
      ]}
    >
      {children}
    </View>
  );
}

export function Metric({
  label,
  value,
  unit,
  hint,
  source,
  accent = false,
  cols = 1,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  source?: string;
  accent?: boolean;
  cols?: 1 | 2;
}) {
  return (
    <View
      style={[
        styles.metric,
        cols === 2 ? { minWidth: "48%", flex: 1 } : { flex: 1 },
        ...(accent ? [{ borderColor: colors.volt, borderWidth: 1 }] : []),
      ]}
    >
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 2 }}>
        <Text style={[styles.metricValue, { fontSize: 14 }]}>{value}</Text>
        {unit && (
          <Text
            style={[
              styles.metricValue,
              { fontSize: 9, color: colors.muted, marginLeft: 3 },
            ]}
          >
            {unit}
          </Text>
        )}
      </View>
      {hint && <Text style={styles.metricHint}>{hint}</Text>}
      {source && <Text style={[styles.metricHint, { marginTop: 1 }]}>↑ {source}</Text>}
    </View>
  );
}

/* ── Veredicto / status badges ────────────────────────────── */

export type VerdictTone = "success" | "warning" | "danger" | "violet" | "neutral";

export function VerdictBadge({
  label,
  tone,
  size = "md",
}: {
  label: string;
  tone: VerdictTone;
  size?: "sm" | "md" | "lg";
}) {
  const color = TONE_COLOR[tone];
  const fontSize = size === "lg" ? 14 : size === "sm" ? 8 : 10;
  const padV = size === "lg" ? 5 : 3;
  const padH = size === "lg" ? 10 : 7;
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: `${color}1f`,
        paddingHorizontal: padH,
        paddingVertical: padV,
        borderRadius: 3,
      }}
    >
      <Text
        style={{
          color,
          fontFamily: "Helvetica-Bold",
          fontSize,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export function StatusBadge({
  status,
}: {
  status: "done" | "in_progress" | "empty";
}) {
  const tone: VerdictTone =
    status === "done" ? "success" : status === "in_progress" ? "violet" : "neutral";
  const label =
    status === "done" ? "Completado" : status === "in_progress" ? "En proceso" : "Pendiente";
  return <VerdictBadge label={label} tone={tone} size="sm" />;
}

const TONE_COLOR: Record<VerdictTone, string> = {
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  violet: colors.violet,
  neutral: colors.faint,
};

/** Mapea un veredicto textual a tone. */
export function toneForVerdict(verdict?: string | null): VerdictTone {
  if (!verdict) return "neutral";
  const v = verdict.toUpperCase();
  if (/COMPRAR|PROCEDE|DONE|GO/.test(v)) return "success";
  if (/NEGOCIAR|AJUSTAR|IN_PROGRESS|REVISAR/.test(v)) return "warning";
  if (/NO_COMPRAR|NO_PROCEDE|NO_GO|REJECT/.test(v)) return "danger";
  return "neutral";
}

/* ── Bloque de análisis (usado por Terreno, Zonificación, etc.) ── */

export interface AnalysisGroup {
  title: string;
  tone: VerdictTone;
  items: string[];
}

export function AnalysisBlock({
  verdict,
  confianza,
  resumen,
  groups,
  extra,
}: {
  verdict?: string;
  confianza?: number;
  resumen?: string;
  groups: AnalysisGroup[];
  extra?: { label: string; value: string };
}) {
  const tone = toneForVerdict(verdict);

  return (
    <View style={{ marginTop: 12 }}>
      <View style={[styles.row, { alignItems: "center", flexWrap: "wrap" }]}>
        {verdict && <VerdictBadge label={verdict} tone={tone} />}
        {typeof confianza === "number" && (
          <Text
            style={[
              styles.small,
              { marginLeft: 8 },
            ]}
          >
            Confianza {confianza}%
          </Text>
        )}
        {extra && (
          <Text
            style={[
              styles.body,
              { marginLeft: "auto" },
            ]}
          >
            <Text style={styles.label}>{extra.label}: </Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{extra.value}</Text>
          </Text>
        )}
      </View>

      {resumen && (
        <Text style={[styles.body, { marginTop: 8, lineHeight: 1.5 }]}>
          {resumen}
        </Text>
      )}

      {groups.map((g, gi) => {
        if (g.items.length === 0) return null;
        return (
          <View key={gi} style={styles.card}>
            <Text style={[styles.label, { color: TONE_COLOR[g.tone] }]}>
              {g.title.toUpperCase()}
            </Text>
            {g.items.map((it, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.bullet}>·</Text>
                <Text style={[styles.body, { flex: 1, fontSize: 9.5 }]}>
                  {it}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

/* ── Helpers de página ────────────────────────────────────── */

/** Etiqueta + valor (label/value row). */
export function LabelValue({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        { justifyContent: "space-between", alignItems: "baseline" },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, ...(mono ? [{ fontFamily: "Courier" }] : [])]}>
        {value}
      </Text>
    </View>
  );
}

/** Caja con encabezado y cuerpo. */
export function Box({
  title,
  tone = "neutral",
  children,
}: {
  title?: string;
  tone?: VerdictTone;
  children: React.ReactNode;
}) {
  const isAccent = tone !== "neutral";
  const borderColor = isAccent ? TONE_COLOR[tone] : colors.line;
  return (
    <View
      style={[
        isAccent ? styles.cardAccent : styles.card,
        { borderColor, borderWidth: isAccent ? 1 : 0.5 },
      ]}
    >
      {title && (
        <Text
          style={[
            styles.label,
            ...(isAccent ? [{ color: TONE_COLOR[tone] }] : []),
          ]}
        >
          {title}
        </Text>
      )}
      <View style={{ marginTop: title ? 4 : 0 }}>{children}</View>
    </View>
  );
}

/** Línea separadora. */
export function Divider() {
  return <View style={styles.divider} />;
}

/** Texto monoespaciado (para cifras largas). */
export function Mono({ children }: { children: React.ReactNode }) {
  return <Text style={styles.mono}>{children}</Text>;
}

/** Portada genérica (compartida por los 4 reportes). */
export function CoverPage({
  reportLabel,
  projectName,
  subtitle,
  projectMeta,
  reportMeta,
  footerNote,
}: {
  reportLabel: string;
  projectName: string;
  subtitle?: string;
  projectMeta: { label: string; value: string }[];
  reportMeta: { label: string; value: string }[];
  footerNote?: string;
}) {
  return (
    <View>
      <Text style={styles.coverBadge}>{reportLabel}</Text>
      <Text style={styles.coverTitle}>{projectName}</Text>
      {subtitle && <Text style={styles.coverSubtitle}>{subtitle}</Text>}

      <View style={styles.coverMeta}>
        {projectMeta.map((m) => (
          <View key={m.label}>
            <Text style={styles.label}>{m.label}</Text>
            <Text style={styles.value}>{m.value}</Text>
          </View>
        ))}
      </View>

      {reportMeta.length > 0 && (
        <View
          style={[
            styles.coverMeta,
            { marginTop: 12, borderTopWidth: 0, paddingTop: 0 },
          ]}
        >
          {reportMeta.map((m) => (
            <View key={m.label}>
              <Text style={styles.label}>{m.label}</Text>
              <Text style={styles.value}>{m.value}</Text>
            </View>
          ))}
        </View>
      )}

      {footerNote && (
        <View style={{ marginTop: 48 }}>
          <Text style={styles.eyebrow}>NOTA</Text>
          <Text style={[styles.body, { marginTop: 4 }]}>{footerNote}</Text>
        </View>
      )}

      <View style={{ marginTop: 48 }}>
        <Text style={styles.eyebrow}>PLATAFORMA</Text>
        <Text style={[styles.body, { marginTop: 4 }]}>
          creaConstruye · Evaluación de proyectos inmobiliarios con IA
        </Text>
      </View>
    </View>
  );
}
