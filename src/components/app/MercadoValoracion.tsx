"use client";

import { MetricCard } from "@/components/proforma/MetricCard";
import { calcMercado, type MercadoData } from "@/lib/proforma/mercado";
import { num, money } from "@/lib/proforma/terreno";

export function MercadoValoracion({ data }: { data?: MercadoData }) {
  const r = calcMercado(data);
  const precioBajo = num(data?.precio_m2_esperado);
  const precioAlto = num(data?.precio_m2_esperado_alto);
  const precioPromedio = isFinite(precioBajo) && isFinite(precioAlto)
    ? (precioBajo + precioAlto) / 2
    : precioBajo;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard
          label="Ingreso bruto"
          value={money(r.ingreso_bruto_proyecto)}
          accent
          source="Calculado"
          sourceKind="tool"
        />
        <MetricCard
          label="Absorción"
          value={r.absorcion_mensual_estimada.toFixed(1)}
          unit="unid/mes"
          source="Heurística"
          sourceKind="data"
        />
        <MetricCard
          label="Tiempo de venta"
          value={isFinite(r.meses_para_vender_todo) ? r.meses_para_vender_todo.toFixed(0) : "—"}
          unit="meses"
          source="Estimación"
          sourceKind="tool"
        />
        <MetricCard
          label="Score demanda"
          value={r.score_demanda}
          unit="/100"
          source="Calculado"
          sourceKind="tool"
        />
      </div>

      <div className="rounded-xl border border-line bg-raised p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
          Rango de precios esperado
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <div className="tabular text-[28px] font-extrabold text-ink">
            {money(precioPromedio)}
          </div>
          <span className="text-[12px] text-faint">/ m² promedio</span>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-faint">
          Rango declarado: {data?.precio_m2_esperado ?? "—"} a{" "}
          {data?.precio_m2_esperado_alto ?? "—"} / m².
          {precioBajo > 0 && precioAlto > 0 && (
            <>
              {" "}Variación: {(((precioAlto - precioBajo) / precioBajo) * 100).toFixed(0)}%.
            </>
          )}
        </p>
      </div>
    </div>
  );
}