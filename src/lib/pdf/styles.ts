// Estilos compartidos para todos los reportes PDF.
// Usamos un set mínimo y consistente: tipografía, colores, espaciado.
// (react-pdf NO soporta Tailwind, son estilos inline en JS.)

import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  ink: "#0c0c0e",
  muted: "#52525b",
  faint: "#a1a1aa",
  line: "#e4e4e7",
  volt: "#c8ff00",
  voltDark: "#8fb800",
  violet: "#8b5cf6",
  violetSub: "#a78bfa",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  surface: "#fafafa",
};

export const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.ink,
    lineHeight: 1.4,
  },

  // ── Tipografía
  h1: { fontSize: 24, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  h2: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 6, marginTop: 14 },
  h3: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 4, marginTop: 10 },
  body: { fontSize: 10, marginBottom: 6 },
  small: { fontSize: 8, color: colors.muted },
  eyebrow: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  label: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  value: { fontSize: 11, fontFamily: "Helvetica-Bold", color: colors.ink },
  mono: { fontFamily: "Courier", fontSize: 10 },

  // ── Layout
  row: { flexDirection: "row", gap: 8 },
  col: { flexDirection: "column" },
  spacer: { height: 8 },

  // ── Cajas
  card: {
    border: `1pt solid ${colors.line}`,
    borderRadius: 4,
    padding: 10,
    marginBottom: 6,
  },
  cardAccent: {
    border: `1pt solid ${colors.voltDark}`,
    borderRadius: 4,
    padding: 10,
    marginBottom: 6,
  },
  divider: {
    borderBottom: `0.5pt solid ${colors.line}`,
    marginVertical: 8,
  },

  // ── Métricas (KPI grid)
  metricGrid: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  metric: {
    flex: 1,
    border: `0.5pt solid ${colors.line}`,
    borderRadius: 3,
    padding: 6,
  },
  metricLabel: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metricValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: colors.ink,
    marginTop: 2,
  },
  metricHint: { fontSize: 7, color: colors.muted, marginTop: 1 },

  // ── Veredicto (badge)
  verdict: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    letterSpacing: 0.5,
  },

  // ── Header / footer
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1pt solid ${colors.line}`,
    paddingBottom: 6,
    marginBottom: 12,
  },
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: colors.muted,
    borderTop: `0.5pt solid ${colors.line}`,
    paddingTop: 4,
  },

  // ── Cover
  coverBadge: {
    backgroundColor: colors.volt,
    color: colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 0.8,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    lineHeight: 1.1,
  },
  coverSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 32,
  },
  coverMeta: {
    flexDirection: "row",
    gap: 24,
    marginTop: 24,
    paddingTop: 16,
    borderTop: `0.5pt solid ${colors.line}`,
  },

  // ── Listas
  listItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bullet: { width: 8, color: colors.muted },
});
