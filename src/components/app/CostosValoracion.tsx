"use client";

import { CalcCard } from "@/components/proforma/CalcCard";
import { MetricCard } from "@/components/proforma/MetricCard";
import { SourceTag } from "@/components/proforma/SourceTag";
import type { CalcInput } from "@/lib/proforma/types";
import { calcCostos, type CostosData } from "@/lib/proforma/costes";
import { num, money } from "@/lib/proforma/terreno";

export function CostosValoracion({ data }: { data?: CostosData }) {
  const r = calcCostos(data);
  const m2 = num(data?.m2_construir);

  const partidasVisibles = r.partidas.filter((p) => p.pctDelTotal >= 4);

  const inputs: CalcInput[] = [
    {
      label: "Sistema estructural",
      value: data?.tipo_estructura ?? "—",
      source: "Catálogo",
      kind: "manual",
    },
    {
      label: "Calidad de acabados",
      value: data?.calidad_acabados ?? "—",
      source: "Catálogo",
      kind: "manual",
    },
    {
      label: "m² a construir",
      value: isFinite(m2) ? m2.toLocaleString("es-MX") + " m²" : "—",
      source: "Zonificación",
      kind: "tool",
    },
    {
      label: "Niveles + sótanos",
      value: `${data?.niveles ?? "—"} + ${data?.sotanos ?? "0"}`,
      source: "Proyecto",
      kind: "manual",
    },
  ];

  return (
    <div className="space-y-3">
      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard
          label="Costo total"
          value={money(r.costoTotal)}
          accent
          source="Calculado"
          sourceKind="tool"
        />
        <MetricCard
          label="Costo / m² construido"
          value={money(r.costoM2Final)}
          unit="m²"
          source="Calculado"
          sourceKind="tool"
        />
        <MetricCard
          label="Costo directo"
          value={money(r.costoDirectoTotal)}
          source="Catálogo paramétrico"
          sourceKind="data"
        />
        <MetricCard
          label="Contingencia (10%)"
          value={money(r.contingencia)}
          source="Buena práctica"
          sourceKind="data"
        />
      </div>

      {/* Resumen paramétrico */}
      <CalcCard
        title="Presupuesto paramétrico"
        status="auto"
        result={money(r.costoDirectoTotal)}
        resultLabel="Costo directo de construcción (sin terreno, sin indirectos)"
        inputs={inputs}
        formula={
          "Costo directo = m² × costo/m²_base × calidad × región × (1 + 0.6×sótanos/m²)\n" +
          "Indirectos = permisos + proyecto arquitectónico + supervisión\n" +
          "Contingencia = 10% × costo directo\n" +
          "TOTAL = terreno + directo + indirectos + contingencia"
        }
        formulaNote={`Sistema: ${data?.tipo_estructura ?? "concreto"}. Calidad: ${data?.calidad_acabados ?? "media"}. Factor regional: ${data?.region_factor ?? "1.0"}.`}
      />

      {/* Desglose por partidas (solo las ≥4%) */}
      {partidasVisibles.length > 0 && (
        <div className="rounded-xl border border-line bg-raised p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
            <SourceTag source="Catálogo" kind="data" />
            Distribución por partidas
          </div>
          <ul className="mt-3 space-y-1.5">
            {partidasVisibles.map((p) => (
              <li
                key={p.nombre}
                className="flex items-center gap-3 text-[13px] text-muted"
              >
                <span className="flex-1">{p.nombre}</span>
                <span className="tabular w-24 text-right text-ink">
                  {money(p.costo)}
                </span>
                <span className="tabular w-12 text-right text-[11px] text-faint">
                  {p.pctDelTotal.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}