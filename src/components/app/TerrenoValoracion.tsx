"use client";

import { CalcCard } from "@/components/proforma/CalcCard";
import { MetricCard } from "@/components/proforma/MetricCard";
import type { CalcInput } from "@/lib/proforma/types";
import {
  calcEnvolvente,
  num,
  money,
  m2,
  type TerrenoData,
} from "@/lib/proforma/terreno";
import { getJurisdiccion } from "@/lib/proforma/jurisdicciones";

export function TerrenoValoracion({ data }: { data?: TerrenoData }) {
  const p = data?.predio ?? {};
  const z = data?.zonificacion ?? {};
  const j = getJurisdiccion(data?.entidad?.tipo);
  const zonaFuente =
    data?.entidad?.tipo === "otro"
      ? data?.entidad?.documento || "Doc. local"
      : j.fuenteTag;

  const superficie = num(p.superficie_terreno);
  const precio = num(p.precio_solicitado);
  const precioM2 = precio / superficie;
  const env = calcEnvolvente(z, p);

  // ── Envolvente: insumos transparentes ───────────────────────────
  const envInputs: CalcInput[] = [
    { label: "Superficie del terreno", value: m2(superficie), source: "Boleta predial", kind: "manual" },
    { label: "COS", value: z.cos || "—", source: zonaFuente, kind: "data" },
    { label: "CUS", value: z.cus || "—", source: zonaFuente, kind: "data" },
  ];

  // ── Valor Residual del Suelo (método) ───────────────────────────
  const residualInputs: CalcInput[] = [
    { label: "Valor de venta del desarrollo", value: "Pendiente", source: "Mercado", kind: "tool" },
    { label: "Costos de construcción", value: "Pendiente", source: "Costos", kind: "tool" },
    { label: "Costos blandos (8-15%)", value: "Pendiente", source: "Costos", kind: "tool" },
    { label: "Contingencia (10-15%)", value: "Pendiente", source: "Costos", kind: "tool" },
    { label: "Costos financieros", value: "Pendiente", source: "Financiero", kind: "tool" },
    { label: "Utilidad esperada (15-20%)", value: "20%", source: "Tú", kind: "manual" },
  ];

  return (
    <div className="space-y-3">
      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Precio solicitado" value={money(precio)} source="Boleta predial" sourceKind="manual" />
        <MetricCard label="Superficie" value={isFinite(superficie) ? superficie.toLocaleString("es-MX") : "—"} unit="m²" source="Boleta predial" sourceKind="manual" />
        <MetricCard label="Precio / m²" value={money(precioM2)} accent source="Calculado" sourceKind="tool" hint="Precio ÷ superficie" />
      </div>

      {/* Envolvente construible — cálculo real */}
      <CalcCard
        title="Envolvente construible"
        status="auto"
        result={isFinite(env.construibleTotal) ? m2(env.construibleTotal) : "—"}
        resultLabel="m² máximos a construir (alimenta valor de venta y costos)"
        inputs={envInputs}
        formula={
          "m² construibles = CUS × superficie\nDesplante (planta baja) = COS × superficie\nNiveles ≈ CUS ÷ COS"
        }
        formulaNote={`Según ${j.documento}. Desplante: ${m2(env.desplante)} · Niveles aprox: ${isFinite(env.nivelesAprox) ? Math.floor(env.nivelesAprox) : "—"} · Área libre: ${m2(env.areaLibre)}.`}
      />

      {/* Valor Residual del Suelo */}
      <CalcCard
        title="Valor Residual del Suelo"
        status="auto"
        result="—"
        resultLabel="Valor máximo a pagar por el terreno para que el proyecto sea rentable"
        inputs={residualInputs}
        formula={
          "Valor Residual = Valor de venta del desarrollo\n  − Costos de construcción\n  − Costos blandos\n  − Contingencia\n  − Costos financieros\n  − Utilidad del desarrollador"
        }
        formulaNote="Método estándar (ARGUS/TestFit): cuánto vale realmente el terreno para desarrollar, no lo que pide el vendedor. Se calcula al completar Mercado, Costos y Financiero."
      />
    </div>
  );
}
