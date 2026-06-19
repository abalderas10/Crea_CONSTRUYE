"use client";

import { CalcCard } from "@/components/proforma/CalcCard";
import { MetricCard } from "@/components/proforma/MetricCard";
import type { CalcInput } from "@/lib/proforma/types";

type Loc = Partial<{
  direccion: string;
  ciudad: string;
  superficie_m2: string;
  precio_solicitado: string;
  tipo_desarrollo: string;
}>;

function num(s?: string): number {
  if (!s) return NaN;
  return parseFloat(s.replace(/[^0-9.]/g, ""));
}
function money(n: number): string {
  if (!isFinite(n)) return "—";
  return "$" + Math.round(n).toLocaleString("es-MX");
}

export function TerrenoValoracion({ loc }: { loc?: Loc }) {
  const superficie = num(loc?.superficie_m2);
  const precio = num(loc?.precio_solicitado);
  const precioM2 = precio / superficie;

  // Valor Residual del Suelo (método) — los insumos vienen de Mercado y Costos,
  // que aún no se calculan; se muestra el método con datos pendientes.
  const residualInputs: CalcInput[] = [
    { label: "Valor de venta del desarrollo", value: "Pendiente", source: "Mercado", kind: "tool" },
    { label: "Costos de construcción", value: "Pendiente", source: "Costos", kind: "tool" },
    { label: "Costos blandos (8-15%)", value: "Pendiente", source: "Costos", kind: "tool" },
    { label: "Utilidad esperada (margen)", value: "20%", source: "Tú", kind: "manual" },
    { label: "Costos financieros", value: "Pendiente", source: "Financiero", kind: "tool" },
  ];

  return (
    <div>
      {/* KPIs reales desde la localización */}
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Precio solicitado"
          value={money(precio)}
          source="Localización"
          sourceKind="manual"
        />
        <MetricCard
          label="Superficie"
          value={isFinite(superficie) ? superficie.toLocaleString("es-MX") : "—"}
          unit="m²"
          source="Localización"
          sourceKind="manual"
        />
        <MetricCard
          label="Precio / m²"
          value={money(precioM2)}
          accent
          source="Calculado"
          sourceKind="tool"
          hint="Precio solicitado ÷ superficie"
        />
      </div>

      {/* Valor Residual del Suelo — tarjeta transparente con fórmula editable */}
      <div className="mt-3">
        <CalcCard
          title="Valor Residual del Suelo"
          status="auto"
          result="—"
          resultLabel="Valor máximo a pagar por el terreno para que el proyecto sea rentable"
          inputs={residualInputs}
          formula={
            "Valor Residual = Valor de venta del desarrollo\n  − Costos de construcción\n  − Costos blandos\n  − Costos financieros\n  − Utilidad esperada del desarrollador"
          }
          formulaNote="Se calcula automáticamente cuando completes Mercado, Costos y Financiero. Es el método estándar para saber cuánto vale realmente un terreno para desarrollar (no lo que pide el vendedor)."
        />
      </div>
    </div>
  );
}
